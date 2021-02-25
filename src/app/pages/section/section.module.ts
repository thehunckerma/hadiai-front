import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SectionPageRoutingModule } from './section.router.module';
import { TimeSinceModule } from '../../pipe/time-since.module';
import { WebcamModule } from 'ngx-webcam';

import { SectionPage } from './section.page';
import { MainComponent } from './main/main.component';
import { SessionsComponent } from './sessions/sessions.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { StudentsComponent } from './students/students.component';
import { PresentComponent } from './present/present.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SectionPageRoutingModule,
    TimeSinceModule,
    WebcamModule,
  ],
  declarations: [
    SectionPage,
    MainComponent,
    SessionsComponent,
    StatisticsComponent,
    StudentsComponent,
    PresentComponent,
  ],
})
export class SectionPageModule {}
