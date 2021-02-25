import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthenticationService } from '../../services/authentication.service';
import { SectionService } from '../../services/section.service';

import { Section } from '../../interfaces/section';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  roles: 'ROLE_USER' | 'ROLE_MODERATOR';
  sections: Array<Section>;
  isLoaded = false;
  sectionName = '';
  sectionDescription = '';
  token = '';

  constructor(
    public authService: AuthenticationService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private sectionService: SectionService
  ) {}

  ngOnInit() {
    this.authService.roles.subscribe(
      (roles: 'ROLE_USER' | 'ROLE_MODERATOR') => {
        if (!!roles) {
          this.roles = roles;
          this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
        }
      }
    );
  }

  private getAllSections(role: string = '') {
    this.sectionService.getAllSections(role).subscribe(
      (resp: Array<Section>) => {
        console.log('bruuh', resp);

        this.isLoaded = true;
        this.sections = resp;
      },
      (error: any) => {
        console.log(error);
        this.isLoaded = false;
      }
    );
  }

  addSection() {
    this.isLoaded = false;
    if (this.sectionName) {
      this.sectionService
        .addSection({
          name: this.sectionName,
          description: this.sectionDescription,
        })
        .subscribe(
          (resp: Section) => {
            this.sectionName = '';
            this.sectionDescription = '';
            this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
          },
          (error: any) => {
            console.log(error);
            this.isLoaded = false;
          }
        );
    } else {
      // Toast message or input warning
    }
  }

  async deleteSection(id: number): Promise<void> {
    this.isLoaded = false;
    const loading = await this.loadingController.create();
    await loading.present();
    this.sectionService
      .deleteSection(id)
      .subscribe(
        (resp: null) => {},
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Delete failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
        await loading.dismiss();
      });
  }

  async deleteSectionModal(id: number) {
    const alert = await this.alertController.create({
      header: 'Are you sure ?',
      message: 'Deleting the section will delete all the sessions within it.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteSection(id);
          },
        },
      ],
    });
    await alert.present();
  }

  async joinSection(): Promise<void> {
    if (!!this.token) {
      this.isLoaded = false;
      const loading = await this.loadingController.create();
      await loading.present();

      this.sectionService
        .joinSection(this.token)
        .subscribe(
          async (resp: Section) => {
            const alert = await this.alertController.create({
              header: 'Join request is sent',
              message:
                'Once the teacher approves the request you can attend sessions',
              buttons: ['OK'],
            });
            await alert.present();
          },
          async (error: any) => {
            if (error.status === 400) {
              const alert = await this.alertController.create({
                header: 'Join failed',
                message: 'Join request is pending..',
                buttons: ['OK'],
              });
              await alert.present();
            } else {
              const m = 'Unkown error, try again later';
              const r = error.error;
              const alert = await this.alertController.create({
                header: 'Join failed',
                message: error ? (r ? (r.error ? r.error : m) : m) : m,
                buttons: ['OK'],
              });
              await alert.present();
            }
          }
        )
        .add(async () => {
          this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
          this.token = '';
          await loading.dismiss();
        });
    }
  }

  async quitSectionModal(id: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure ?',
      message: "Leaving the class won't delete your activity history",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Leave',
          handler: () => {
            this.quitSection(id);
          },
        },
      ],
    });
    await alert.present();
  }

  async quitSection(id: number): Promise<void> {
    this.isLoaded = false;
    const loading = await this.loadingController.create();
    await loading.present();

    this.sectionService
      .quitSection(id)
      .subscribe(
        async (resp: Section) => {},
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Join failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
        await loading.dismiss();
      });
  }
}
