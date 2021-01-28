import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService
      .login(this.credentials.value)
      .subscribe(
        () => {
          window.location.reload();
          this.router.navigate(['/dashboard']);
        },
        async (res) => {
          const alert = await this.alertController.create({
            header: 'Login failed',
            message: res
              ? res.error
                ? res.error.error
                  ? res.error.error
                  : 'Unkown error'
                : 'Unkown error'
              : 'Unkown error',
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => await loading.dismiss());
  }
}
