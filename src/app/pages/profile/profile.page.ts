import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  shouldLoad = false;
  hiddenPassword: string;
  credentials: {
    fullname: string;
    email: string;
    username: string;
    password: string;
    image?: string;
  };
  constructor(    
    private authService: AuthenticationService,
    private router: Router,
    ) {
    Storage.get({ key: 'stringified-creds' })
      .then((storage: { value: string }) => {
        const stringifiedCreds = storage.value;
        this.credentials = JSON.parse(stringifiedCreds);
        if (!this.credentials) {
          this.router.navigateByUrl('/signup', { replaceUrl: true });
        } else {
          this.hiddenPassword = '*'.repeat(this.credentials.password.length);
          this.shouldLoad = true;
        }
      })
      .catch((err: any) =>
        this.router.navigateByUrl('/signup', { replaceUrl: true })
      );
    }
  ngOnInit() {}
}
