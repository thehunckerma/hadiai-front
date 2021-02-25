import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

import { Section } from '../../../interfaces/section';
import { User } from '../../../interfaces/user';

import { SectionService } from '../../../services/section.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  @Input() id: number;
  students: Array<User>;
  requests: Array<User>;
  isLoaded = false;
  constructor(
    private sectionService: SectionService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getSection();
  }

  getSection() {
    this.sectionService.getSection(this.id).subscribe(
      (section: Section) => {
        console.log(section);
        this.students = section.students;
        this.requests = section.requests;
        this.isLoaded = true;
      },
      (err: any) => {
        // Show some kind of error
        console.log(err);
        this.isLoaded = false;
        if (!!err && err.status === 404) {
          this.router.navigateByUrl('/not-found');
        }
      }
    );
  }

  async approveJoinRequest(userID: number): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    this.isLoaded = false;
    this.sectionService
      .approveJoinRequest(this.id, userID)
      .subscribe(
        (resp: any) => {
          console.log(resp);
        },
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Request Approval failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        await loading.dismiss();
        this.getSection();
      });
  }

  async rejectJoinRequest(userID: number): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    this.isLoaded = false;
    this.sectionService
      .rejectJoinRequest(this.id, userID)
      .subscribe(
        (resp: any) => {},
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Request Rejection failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        await loading.dismiss();
        this.getSection();
      });
  }

  async removeUserModal(userID: number) {
    const alert = await this.alertController.create({
      header: 'Are you sure ?',
      message:
        "Removing the student from the section won't delete his past activities",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Remove',
          handler: () => {
            this.removeUser(userID);
          },
        },
      ],
    });
    await alert.present();
  }

  private async removeUser(userID: number): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    this.isLoaded = false;
    this.sectionService
      .removeUser(this.id, userID)
      .subscribe(
        (resp: any) => {},
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Student Removal failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        await loading.dismiss();
        this.getSection();
      });
  }
}
