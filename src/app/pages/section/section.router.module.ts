import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SectionPage } from './section.page';

const routes: Routes = [
  {
    path: ':page/:id',
    component: SectionPage,
  },
  {
    path: '',
    redirectTo: '/not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionPageRoutingModule {}
