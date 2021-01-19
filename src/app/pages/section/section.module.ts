import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SectionPageRoutingModule } from './section.router.module';

import { SectionPage } from './section.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SectionPageRoutingModule],
  declarations: [SectionPage],
})
export class SectionPageModule {}
