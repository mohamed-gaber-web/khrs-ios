import { SharedModule } from './../../shared/shared.module';
import { TabsPageModule } from '../../tabs/tabs.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';


import { TranslateModule } from '@ngx-translate/core';

import { UserProfilePage } from './user-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    TabsPageModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule {}
