import { TrackingUserService } from './../../shared/services/tracking-user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { userCourse } from 'src/app/shared/models/userCourse';
import { CourseService } from 'src/app/shared/services/courses.service';
import { TestService } from 'src/app/shared/services/test.service';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-choose-course-material',
  templateUrl: './choose-course-material.page.html',
  styleUrls: ['./choose-course-material.page.scss'],
})
export class ChooseCourseMaterialPage implements OnInit {

  userId: number;
  courseId: number;
  subs: Subscription[] = [];
  userCourseDetails: userCourse[];
  CourseDetails: any;
  validCourse;
  isLoading: boolean = false;
  testActive: boolean;
  redOffset: any;
  offset: number = 0;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private trackingService: TrackingUserService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.courseId = JSON.parse(this.route.snapshot.paramMap.get('courseId'));
    this.redOffset = this.route.snapshot.paramMap.get('testOffset');
    this.offset = JSON.parse(localStorage.getItem('courseMaterialOffset'));
    this.subs.push(
      this.courseService.getUserCoursesDetails(this.courseId)
      .subscribe(response => {
        this.isLoading = false;
        this.userCourseDetails = response['result'].userCourse;
        let startDate = new Date(this.userCourseDetails['startDate']);
        let endDate = new Date(this.userCourseDetails['endDate']);
         let date = endDate.getTime() - startDate.getTime();
        this.validCourse = date/(1000 * 3600 * 24);
      }),

      this.courseService.getCoursesDetails(this.courseId)
      .subscribe(response => {
        this.isLoading = false;
        this.CourseDetails = response['result'];
        // console.log('course details', this.CourseDetails)
      })
    );

    this.getUserOffset(this.courseId);

  }

  // ** Send course id to exercise page
  sendIdToExercisePage() {
    this.router.navigate(['/exercise', {courseId: this.courseId}])
  }

  // ** Send course id to final test page_event
  sendIdToFinalTestPage() {
   this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'sure you want start the test?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'start',
          handler: () => {
            this.router.navigate(['/exercise/test-course', {courseId: this.courseId}])
          }
        }
      ]
    });

    await alert.present();
  }

  getUserOffset(course_ID:number) {

    this.trackingService.getAllUser(0,10)
    .subscribe(r =>
      {
        // console.log("resssss",r['result']);
        r['result'].forEach(element => {
          if (element.courseId===course_ID){
            this.offset=element.offset
            // console.log('yes',this.offset)
          }
          else if (element.courseId!==course_ID){
            // console.log("no",this.offset)
          }
        })
      })
  }

  openCourseDetails(ofst:number){
    this.router.navigate([`courses/course-material/${this.courseId}`, {ofst}])
  }

  ngOnDestroy() {
    this.subs.forEach(element => element.unsubscribe())
  }

  startAudio(x) {}

}
