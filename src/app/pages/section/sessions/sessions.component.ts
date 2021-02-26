import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Section } from '../../../interfaces/section';
import { Chart } from 'chart.js';
import { Session } from '../../../interfaces/session';
import { SectionService } from '../../../services/section.service';
import { SessionsService } from '../../../services/sessions.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  @Input() id: number;
  sessionId: number;
  sessions: Array<Session>;
  isLoaded = false;
  token = '';
  areAllSessionEnded: boolean;
  startedSessionId: number;
  isShowPresence = false;
  isShowPresenceRaw = false;
  presenceList: Array<{
    id: number;
    username: string;
    email: string;
    presencePercentage: number;
  }>;
  presenceChart: {
    label: string;
    borderColor: string;
    data: Array<{ x: string; y: number }>;
  };
  @ViewChild('barChart', { static: false }) barChart;
  username: string;
  bars: any;
  colorArray: any;
  chartInterval: any;
  constructor(
    private sessionsService: SessionsService,
    private sectionService: SectionService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  createBarChart() {
    console.log('createBarChart');
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: { datasets: [this.presenceChart] },
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
            },
          ],
        },
      },
    });
  }

  ngOnInit() {
    this.getAllSessions();
    this.getSection();
  }

  getSection() {
    this.sectionService.getSection(this.id).subscribe(
      (section: Section) => {
        console.log(section);
        this.token = section.token;
      },
      (err: any) => {
        // Show some kind of error
        console.log(err);
        if (!!err && err.status === 404) {
          this.router.navigateByUrl('/not-found');
        }
      }
    );
  }

  getAllSessions() {
    this.areAllSessionEnded = true;
    this.sessionsService.getAllSessions(this.id).subscribe(
      (sessions: Array<Session>) => {
        console.log(sessions);
        this.sessions = sessions ? sessions : [];
        this.sessions.reverse();
        this.sessions.forEach((session: Session) => {
          if (!session.end) {
            this.areAllSessionEnded = false;
            this.startedSessionId = session.id;
          }
        });
        this.isLoaded = true;
      },
      (err: any) => {
        // Raise some error
        console.log(err);
        this.isLoaded = false;
      }
    );
  }

  async startSession() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.isLoaded = false;

    this.sessionsService
      .startSessions(this.id)
      .subscribe(
        (session: Session) => {
          console.log(session);
        },
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Session start failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        this.getAllSessions();
        await loading.dismiss();
      });
  }

  async stopSectionModal(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure ?',
      message:
        "Stopping the session can't be resumed, and the students will be kicked out of the session. You would have to start a new one to continue the session",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Stop',
          handler: () => {
            this.stopSession();
          },
        },
      ],
    });
    await alert.present();
  }

  async stopSession() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.isLoaded = false;

    this.sessionsService
      .stopSession(this.startedSessionId)
      .subscribe(
        (session: Session) => {
          console.log(session);
        },
        async (error: any) => {
          const m = 'Unkown error, try again later';
          const r = error.error;
          const alert = await this.alertController.create({
            header: 'Session stop failed',
            message: error ? (r ? (r.error ? r.error : m) : m) : m,
            buttons: ['OK'],
          });
          await alert.present();
        }
      )
      .add(async () => {
        this.getAllSessions();
        await loading.dismiss();
      });
  }

  async showPresence(sessionId: number) {
    console.log(sessionId);
    const loading = await this.loadingController.create();
    await loading.present();
    this.sessionId = sessionId;
    this.sessionsService
      .getPresenceList(sessionId)
      .subscribe(
        (
          resp: Array<{
            id: number;
            username: string;
            email: string;
            presencePercentage: number;
          }>
        ) => {
          this.isShowPresence = true;
          this.isShowPresenceRaw = false;
          this.presenceList = resp ? resp : [];
        }
      )
      .add(async () => {
        await loading.dismiss();
      });
  }

  async getPresenceChart(userId: number, username: string) {
    const loading = await this.loadingController.create();
    this.username = username;
    await loading.present();
    this.sessionsService
      .getPresenceRaw(this.sessionId, userId)
      .subscribe(
        (
          resp: Array<{
            '@UUID': string;
            id: number;
            createdDate: string;
            lastModifiedDate: string;
          }>
        ) => {
          this.isShowPresence = false;
          this.isShowPresenceRaw = true;
          const presenceRaw = resp ? resp : [];
          console.log('presenceRaw : ', presenceRaw);
          this.presenceChart = {
            label: 'Moments when the student was present',
            borderColor: 'lightblue',
            data: presenceRaw.map(
              (element: {
                '@UUID': string;
                id: number;
                createdDate: string;
                lastModifiedDate: string;
              }) => {
                return { x: element.createdDate, y: 1 };
              }
            ),
          };
          console.log('presenceChart : ', this.presenceChart);

          this.chartInterval = setInterval(() => {
            if (this.barChart) {
              clearInterval(this.chartInterval);
              this.createBarChart();
            }
          }, 50);
        }
      )
      .add(async () => {
        await loading.dismiss();
      });
  }
}
