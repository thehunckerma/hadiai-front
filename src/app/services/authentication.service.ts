import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';

import { LoginResp } from '../interfaces/auth';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { username: string; password: string }): Observable<void> {
    return this.http
      .post(`${environment.javaApi}/auth/signin`, credentials)
      .pipe(
        map((data: LoginResp) => data.accessToken),
        switchMap((token) => {
          return from(Storage.set({ key: TOKEN_KEY, value: token }));
        }),
        tap((_) => {
          this.isAuthenticated.next(true);
        })
      );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}
