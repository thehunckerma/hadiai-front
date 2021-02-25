import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { NavBarService } from './services/nav-bar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  isAuthenticated: boolean;
  title: string = '';
  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private navBarService: NavBarService
  ) {
    this.authService.isAuthenticated.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.navBarService.topNavBarTitle$.subscribe(
      (payload: { title: string; url: string }) => (this.title = payload.title)
    );
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (!!event && !!event.url) {
          const url: string = event.url;
          if (url.includes('class/home') || url.includes('class/present')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Class',
              url: url,
            });
          } else if (url.includes('class/sessions')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Sessions',
              url: url,
            });
          } else if (url.includes('class/students')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Students',
              url: url,
            });
          } else if (url.includes('profile')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Profile',
              url: url,
            });
          } else if (url.includes('class/statistics')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Statistics',
              url: url,
            });
          } else if (url.includes('login')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Log-in',
              url: url,
            });
          } else if (url.includes('signup')) {
            this.navBarService.topNavBarTitle.next({
              title: 'Sign up',
              url: url,
            });
          } else {
            this.navBarService.topNavBarTitle.next({
              title: 'Dashboard',
              url: url,
            });
          }
        }
      });
  }
}
