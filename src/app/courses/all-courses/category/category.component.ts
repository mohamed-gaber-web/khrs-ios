import { ICategory } from './../../../shared/models/category.model';
import { Subscription } from 'rxjs';
import { CourseService } from 'src/app/shared/services/courses.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

sub: Subscription[] = [];
  categories: ICategory[];
  categoriesCount: number;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 4,
    scrollbar: true,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 40
      }
    }
  };

  constructor(private courseService: CourseService) { }

  ngOnInit() {

    this.sub.push(
      this.courseService.getCourseCategories(0, 10)
      .subscribe(response => {
        // console.log('category', response);
        this.categories = response['result'];
        this.categoriesCount = response['length']
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(el => {
      el.unsubscribe();
    })
  }

}
