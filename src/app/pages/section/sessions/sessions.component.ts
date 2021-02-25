import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
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
export class SessionsComponent implements OnInit, AfterViewInit {
  @Input() id: number;

  sessions: Array<Session>;
  isLoaded = false;
  token = '';
  areAllSessionEnded: boolean;
  startedSessionId: number;
  isShowPresence = false;
  presenceList: Array<{
    id: number;
    username: string;
    email: string;
    presencePercentage: number;
  }>;

  @ViewChild('barChart', { static: false }) barChart;

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
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [
          {
            label: 'Viewers in millions',
            data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
            backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  ngOnInit() {
    this.getAllSessions();
    this.getSection();

    this.chartInterval = setInterval(() => {
      if (this.barChart) {
        clearInterval(this.chartInterval);
        this.createBarChart();
      }
    }, 200);
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
    const loading = await this.loadingController.create();
    await loading.present();
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
          this.presenceList = resp ? resp : [];
        }
      )
      .add(async () => {
        await loading.dismiss();
      });
  }
}
