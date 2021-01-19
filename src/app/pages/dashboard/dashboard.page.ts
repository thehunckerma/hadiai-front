import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { AuthenticationService } from '../../services/authentication.service';
import { SectionService } from '../../services/section.service';

import { Section, AddSection } from '../../interfaces/section';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  roles: 'ROLE_USER' | 'ROLE_MODERATOR';
  sections: Array<Section>;
  isLoaded = false;
  sectionName: string = '';
  sectionDescription: string = '';

  constructor(
    private alertCtrl: AlertController,
    public authService: AuthenticationService,
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
        this.isLoaded = true;
        this.sections = resp;
        console.log(resp);
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
            console.log(resp);
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

  deleteSection(id: number) {
    this.isLoaded = false;
    this.sectionService.deleteSection(id).subscribe(
      (resp: null) => {
        this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
      },
      (error: any) => {
        console.log(error);
        this.isLoaded = false;
      }
    );
  }

  async deleteSectionModal(id: number) {
    const alert = await this.alertCtrl.create({
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
}
