import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TopHeaderComponent } from './components/top-header/top-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [CommonModule, IonicModule, HttpClientModule, RouterModule],
  declarations: [TopHeaderComponent],
  exports: [TopHeaderComponent],
  providers: [],
})

export class SharedModule {}
