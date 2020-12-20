import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NextSignupPageRoutingModule } from './next-signup-routing.module';

import { NextSignupPage } from './next-signup.page';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebcamModule,
    NextSignupPageRoutingModule,
  ],
  declarations: [NextSignupPage],
})
export class NextSignupPageModule {}
