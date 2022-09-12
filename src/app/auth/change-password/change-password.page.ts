import { matchingPasswords } from 'src/theme/app-validators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    userInfo: any;
  passwordForm: FormGroup;
  subs: Subscription[] = [];

  passwordFormErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  passwordValidationMessages = {
    currentPassword: {
      required: 'Current password required',
    },
    newPassword: {
      required: 'New password required',
    },
    confirmPassword: {
      required: 'Confirm password',
    },
  };

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();

    this.passwordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmPassword')});

    this.passwordForm.valueChanges.subscribe((data) => this.validateChangePasswordForm());
  }

  validateChangePasswordForm(isSubmitting = false) {
    for (const field of Object.keys(this.passwordFormErrors)) {
      this.passwordFormErrors[field] = '';

      const input = this.passwordForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.passwordFormErrors[field] = this.passwordValidationMessages[field][
            error
          ];
        }
      }
    }
  }


  updatedPassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.subs.push(

      this.authService.updatedPassword(this.passwordForm.value).subscribe(async (response) => {

        if (response['success'] === true) {
        var toast = await this.toastController.create({
          message: 'Password updated',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.storageService.clearStorage();
        this.router.navigate(['/auth/sign-in']);
      } else {
        var toast = await this.toastController.create({
          message: response['arrayMessage'][0],
          duration: 2000,
          color: 'danger',
        });
        toast.present();
        this.router.navigate(['/auth/user-profile']);

      }

    })
    );

  }

  goToEditUser() {
    this.router.navigate(['/auth/user-profile/edit-user']);
  }

  ngOnDestroy() {
      this.subs.forEach((sub) => sub.unsubscribe());
  }

}
