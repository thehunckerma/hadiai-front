import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';

import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { AuthResp } from '../../interfaces/auth';
import { PythonService } from '../../services/python.service';
import { FaceDetectionResp, UploadImageResp } from '../../interfaces/python';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: User;
  username: string;
  email: string;
  image: string;
  imagePath: string;
  password: string = '***********';
  isLoaded = false;

  constructor(
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private pythonService: PythonService
  ) {
    this.getUserData();
  }

  ngOnInit() {}

  private getUserData(): void {
    this.authService.getUserDataFromBackend().subscribe(() => {
      this.authService.getUserDataFromLocalStorage().then((user: User) => {
        this.userData = user;
        this.image = user.image;
        this.username = user.username;
        this.email = user.email;
        this.updateImagePath();
        this.isLoaded = true;
      });
    });
  }

  async send(): Promise<void> {
    const user = {
      username: '',
      email: '',
      password: '',
      image: '',
    };

    if (this.password !== '***********') {
      user.password = this.password;
    }
    if (this.email && this.email !== this.userData.email) {
      user.email = this.email;
    }
    if (this.image && this.image !== this.userData.image) {
      user.image = this.image;
    }
    if (this.username && this.username !== this.userData.username) {
      user.username = this.username;
    }

    if (user.username || user.email || user.password || user.image) {
      const loading = await this.loadingController.create();
      await loading.present();

      this.authService
        .update(user)
        .subscribe(
          (resp: AuthResp) => {
            this.getUserData();
          },
          async (res) => {
            const m = 'Unkown error, try again later';
            const r = res.error;
            const alert = await this.alertController.create({
              header: 'Saving failed',
              message: res ? (r ? (r.error ? r.error : m) : m) : m,
              buttons: ['OK'],
            });
            await alert.present();
          }
        )
        .add(async () => await loading.dismiss());
    }
  }

  async upload(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;

    if (files.length > 0) {
      const formData = new FormData();
      formData.append('image', files[0]);

      const loading = await this.loadingController.create();
      await loading.present();

      this.pythonService.detect(formData).subscribe(
        async (resp: FaceDetectionResp) => {
          if (resp.success) {
            if (resp.num_faces === 1) {
              this.pythonService
                .uploadImage(formData)
                .subscribe(
                  (_resp: UploadImageResp) => {
                    if (_resp.uuid) {
                      this.image = _resp.uuid;
                      this.updateImagePath();
                    }
                  },
                  async (res: any) => {
                    const m = 'Unkown error, try again later';
                    const r = res.error;
                    const alert = await this.alertController.create({
                      header: 'Saving failed',
                      message: res ? (r ? (r.error ? r.error : m) : m) : m,
                      buttons: ['OK'],
                    });
                    await alert.present();
                  }
                )
                .add(async () => await loading.dismiss());
            } else {
              await loading.dismiss();
              const alert = await this.alertController.create({
                header: 'Failed to detect a single face',
                message: 'Please try again with another image',
                buttons: ['OK'],
              });
              await alert.present();
            }
          } else {
            await loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Failed to process the image',
              message: 'Please try again with another image',
              buttons: ['OK'],
            });
            await alert.present();
          }
        },
        async (res: any) => {
          await loading.dismiss();
          const m = 'Unkown error, try again later';
          const r = res.error;
          const alert = await this.alertController.create({
            header: 'Saving failed',
            message: res ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
    }
  }

  private updateImagePath(): void {
    this.imagePath = `${environment.PYTHON_API}/images/${this.image}`;
  }
}
