import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'class',
    loadChildren: './pages/section/section.module#SectionPageModule',
    canActivate: [AuthGuard], // Secure this page from unauthenticated clients
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'signup',
    loadChildren: './pages/signup/signup.module#SignupPageModule',
    canActivate: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'next',
    loadChildren: './pages/next-signup/next-signup.module#NextSignupPageModule',
    canActivate: [NotAuthGuard], // Prevent authenticated users from accessing this page
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard], // Secure this page from unauthenticated clients
  },
  {
    path: 'not-found',
    loadChildren: './pages/not-found/not-found.module#NotFoundPageModule',
  },
  {
    path: '**',
    redirectTo: '/not-found',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
