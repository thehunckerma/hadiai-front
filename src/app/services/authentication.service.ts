import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, concat } from 'rxjs';

import { environment } from '../../environments/environment';

import { AuthResp } from '../interfaces/auth';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: 'accessToken' });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { username: string; password: string }): Observable<void> {
    return this.http
      .post<AuthResp>(`${environment.JAVA_API}/auth/signin`, credentials)
      .pipe(
        switchMap(this.setUserData),
        tap(() => this.isAuthenticated.next(true))
      );
  }

  signup(credentials: {
    email: string;
    username: string;
    password: string;
  }): Observable<void> {
    return this.http
      .post<AuthResp>(`${environment.JAVA_API}/auth/signup`, credentials)
      .pipe(
        switchMap(this.setUserData),
        tap(() => this.isAuthenticated.next(true))
      );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: 'accessToken' });
  }

  private setUserData(data: AuthResp): Observable<void> {
    let observable$: Observable<void> = from(
      Storage.set({ key: 'roles', value: data['roles'][0] })
    );
    for (const element in data) {
      if (Object.prototype.hasOwnProperty.call(data, element)) {
        if (element === 'roles') {
          continue;
        }
        const userData = data[element];
        observable$ = concat(
          observable$,
          from(Storage.set({ key: element, value: userData }))
        );
      }
    }
    return observable$;
  }
}
