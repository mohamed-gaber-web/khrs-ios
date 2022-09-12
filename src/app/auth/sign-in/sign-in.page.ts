import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { loginCredentials } from 'src/app/shared/models/loginCredentials';
import { StorageService } from 'src/app/shared/services/storage.service';
import { emailValidator } from 'src/theme/app-validators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  returnUrl: string;
  loginCredentials: loginCredentials;
  showPasswordItem: boolean = false;
  subs: Subscription[] = [];

  loginFormErrors = {
    Email: '',
    Password: '',
  };

  loginValidationMessages = {
    Email: {
      required: 'Email required',
      invalidEmail: 'Email must be valid',
    },
    Password: {
      required: 'Password required',
    },
  };

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public storageService: StorageService,
    // public translate: TranslateService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams.returnUrl || '/courses/tabs/all-courses';

    this.loginCredentials = new loginCredentials();
    this.buildLoginForm();
  }

  goToUpdatedUser() {
    this.router.navigateByUrl('/courses/tabs/all-courses');
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.compose([Validators.required, emailValidator])],
      Password: ['', Validators.required],
    });
    this.loginForm.valueChanges.subscribe((data) => this.validateLoginForm());
  }

  validateLoginForm(isSubmitting = false) {
    for (const field of Object.keys(this.loginFormErrors)) {
      this.loginFormErrors[field] = '';

      const input = this.loginForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.loginFormErrors[field] = this.loginValidationMessages[field][
            error
          ];
        }
      }
    }
  }

  public onLoginFormSubmit(values): void {
    this.validateLoginForm(true);
    if (this.loginForm.valid) {
      this.isLoading = true;
      Object.assign(this.loginCredentials, this.loginForm.value);
      this.auth.signInUser(this.loginCredentials).subscribe(
        async (response) => {
          if (response['success'] === true) {
            this.storageService.setAccessToken(response['result']);
            this.storageService.setExpiresIn(
              new Date(response['.expires']).getTime() / 1000 // .expires
            );
            // this.signInService.IsLoggedIn();
            var toast = await this.toastController.create({
              message: 'You signed in successfully!',
              duration: 2000,
              color: 'success',
            });
            toast.present();
            this.router.navigateByUrl(this.returnUrl);
          } else {
            var toast = await this.toastController.create({
              message: 'Username or password incorrect',
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          }
        },
        (error) => {
          Object.keys(error).forEach(async (key) => {
            var toast = await this.toastController.create({
              message: error[key][0],
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          });

          this.loginForm.reset();
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }

  // * show and hide password
  showPassword() {
    this.showPasswordItem = !this.showPasswordItem
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
