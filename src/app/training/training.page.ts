import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../shared/services/storage.service';

import { NavController } from '@ionic/angular';




@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {

  userInfo: any;
  courseId: number;
  audio = new Audio('../../../assets/iphone_ding.mp3' );

  chooseTraining = [
    {
      img: '../../assets/icon/puzzle.png',
      name: 'Puzzle Image',
      url: '/exercise/puzzle-image',
      exerciseId: 4,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId'))
    },
    {
      img: '../../assets/icon/abc-block.png',
      name: 'Puzzle Text',
      url: '/exercise/puzzle-text',
      exerciseId: 3,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId'))
    },
    {
      img: '../../assets/icon/notepad.png',
      name: 'Single Choice',
      url: '/exercise/single-choice',
      exerciseId: 1,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId'))
    },
    {
      img: '../../assets/icon/checklist.png',
      name: 'Multi Choice',
      url: '/exercise/multi-choice',
      exerciseId: 2,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId'))
    }
  ];


  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    public toastController: ToastController,
    public navController: NavController

    ) { }

  ngOnInit() {
    this.userInfo = this.storageService.getUser();
    if(!this.route.snapshot.paramMap.get('courseId')){
      this.router.navigate(["courses/tabs/my-courses"]);

    }
  }

  goToCatExercise(url, exerciseId, courseId) {
    this.router.navigate([url, {exerciseId, courseId}]);
    // this.navController.navigateRoot(url + ';' + exerciseId + ';' + exerciseId );
    // if(courseId === null || courseId === undefined || courseId === '') {
    //   this.errorMessage('please choose course ');
    //   this.router.navigate(['/courses/tabs/my-courses']);
    // }
  }

  async errorMessage(msg: string) {
    this.audio.play();
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      cssClass:'ion-error',
      color: 'danger',
    });
    toast.present();
  }

}
