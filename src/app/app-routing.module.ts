import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
    // canLoad: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'section',
    loadChildren: './pages/section/section.module#SectionPageModule',
    canLoad: [AuthGuard], // Secure all child pages from unauthenticated clients
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    // canLoad: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'signup',
    loadChildren: './pages/signup/signup.module#SignupPageModule',
    // canLoad: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'next',
    loadChildren: './pages/next-signup/next-signup.module#NextSignupPageModule',
    // canLoad: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    // canLoad: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'update',
    loadChildren: './pages/update/update.module#UpdatePageModule',
    // canLoad: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },

  {
    path: '**',
    redirectTo: '/home/users',
    pathMatch: 'full',
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
