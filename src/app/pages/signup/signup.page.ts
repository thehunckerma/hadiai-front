import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;
  isSending = false;
  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private fb: FormBuilder,
    private router: Router,
    private loadingController: LoadingController
  ) {
    Storage.remove({ key: 'stringified-creds' }).then();
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fullname() {
    return this.credentials.get('fullname');
  }
  get email() {
    return this.credentials.get('email');
  }
  get username() {
    return this.credentials.get('username');
  }
  get password() {
    return this.credentials.get('password');
  }

  async next() {
    if (this.credentials.valid && !this.isSending) {
      this.isSending = true;
      const loading = await this.loadingController.create();
      await loading.present();
      this.authService
        .validate({
          username: this.credentials.value.username.trim(),
          email: this.credentials.value.email.trim(),
        })
        .subscribe(
          async (resp: boolean) => {
            if (resp) {
              const stringifiedCreds = JSON.stringify(this.credentials.value);
              Storage.set({
                key: 'stringified-creds',
                value: stringifiedCreds,
              }).then(() =>
                this.router.navigateByUrl('/next', { replaceUrl: true })
              );
            } else {
              const alert = await this.alertController.create({
                header: 'Invalid credentials, please try again!',
                buttons: ['OK'],
              });
              await alert.present();
            }
          },
          async (error: any) => {
            console.log(error);
            const alert = await this.alertController.create({
              header: 'Invalid credentials, please try again!',
              message: error
                ? error.error
                  ? error.error.message
                    ? error.error.message
                    : 'Unkown'
                  : 'Unkown'
                : 'Unkown',
              buttons: ['OK'],
            });
            await alert.present();
          }
        )
        .add(async (_) => {
          this.isSending = false;
          await loading.dismiss();
        });
    }
  }
}
