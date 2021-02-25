import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Session } from '../interfaces/session';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(private http: HttpClient) {}

  getAllSessions(id: number): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(
      `${environment.JAVA_API}/sessions/sections/${id}`
    );
  }

  startSessions(id: number): Observable<Session> {
    return this.http.get<Session>(
      `${environment.JAVA_API}/sessions/sections/${id}/start`
    );
  }

  stopSession(id: number): Observable<Session> {
    return this.http.get<Session>(`${environment.JAVA_API}/sessions/${id}/end`);
  }

  getPresenceList(
    sessionId: number
  ): Observable<
    Array<{
      id: number;
      username: string;
      email: string;
      presencePercentage: number;
    }>
  > {
    return this.http.get<
      Array<{
        id: number;
        username: string;
        email: string;
        presencePercentage: number;
      }>
    >(`${environment.JAVA_API}/presence/${sessionId}`);
  }
}
