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
}
