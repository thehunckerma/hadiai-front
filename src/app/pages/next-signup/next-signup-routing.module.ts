import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NextSignupPage } from './next-signup.page';

const routes: Routes = [
  {
    path: '',
    component: NextSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NextSignupPageRoutingModule {}
