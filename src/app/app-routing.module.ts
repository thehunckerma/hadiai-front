import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canLoad: [AuthGuard], // Secure all child pages
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
  },
  {
    path: '',
    redirectTo: '/login',
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
