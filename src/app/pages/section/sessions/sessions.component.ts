import { Component, Input, OnInit } from '@angular/core';

import { Session } from '../../../interfaces/session';
import { SessionsService } from '../../../services/sessions.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  @Input() id: number;

  sessions: Array<Session>;
  isLoaded = false;

  constructor(private sessionsService: SessionsService) {}

  ngOnInit() {
    this.getAllSessions();
  }

  getAllSessions() {
    this.sessionsService.getAllSessions(this.id).subscribe(
      (sessions: Array<Session>) => {
        console.log(sessions);
        this.sessions = sessions;
        this.isLoaded = true;
      },
      (err: any) => {
        // Raise some error
        console.log(err);
        this.isLoaded = false;
      }
    );
  }
}
