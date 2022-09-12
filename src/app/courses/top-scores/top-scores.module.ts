import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopScoresPageRoutingModule } from './top-scores-routing.module';

import { TopScoresPage } from './top-scores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopScoresPageRoutingModule,
    SharedModule
  ],
  declarations: [TopScoresPage]
})
export class TopScoresPageModule {}
