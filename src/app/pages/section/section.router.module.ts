import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SectionPage } from './section.page';

const routes: Routes = [
  {
    path: '',
    component: SectionPage,
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: '../users/users.module#UsersPageModule',
          },
        ],
      },
      {
        path: 'sessions',
        children: [
          {
            path: '',
            loadChildren: '../sessions/sessions.module#SessionsPageModule',
          },
        ],
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule',
          },
        ],
      },
      {
        path: '**',
        redirectTo: '/home/users',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home/users',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionPageRoutingModule {}
