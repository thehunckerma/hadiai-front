import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, concat } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { AuthResp } from '../interfaces/auth';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private privateRoles: 'ROLE_USER' | 'ROLE_MODERATOR';
  private privateToken = '';

  // Init with null to filter out the first value in a guard
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  roles: BehaviorSubject<'ROLE_USER' | 'ROLE_MODERATOR'> = new BehaviorSubject<
    'ROLE_USER' | 'ROLE_MODERATOR'
  >(null);

  get token(): string {
    return this.privateToken;
  }

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserData();
  }

  async loadUserData() {
    const token = await Storage.get({ key: 'accessToken' });
    if (token && token.value) {
      this.privateToken = token.value;
      const roles = await Storage.get({ key: 'roles' });
      if (roles && roles.value) {
        this.privateRoles = roles.value as 'ROLE_USER' | 'ROLE_MODERATOR';
        if (!this.roles) {
          this.roles = new BehaviorSubject<'ROLE_USER' | 'ROLE_MODERATOR'>(
            null
          );
        }
        if (!this.isAuthenticated) {
          this.isAuthenticated = new BehaviorSubject<boolean>(null);
        }
        this.roles.next(this.privateRoles);
        this.isAuthenticated.next(true);
        return;
      }
    }
    this.isAuthenticated.next(false);
  }

  login(credentials: { username: string; password: string }): Observable<void> {
    return this.http
      .post<AuthResp>(`${environment.JAVA_API}/auth/signin`, credentials)
      .pipe(switchMap(this.setUserData), tap(this.loadUserData));
  }

  signup(
    credentials: {
      email: string;
      username: string;
      password: string;
    },
    role: string = ''
  ): Observable<void> {
    return this.http
      .post<AuthResp>(
        `${environment.JAVA_API}/auth/signup/${
          role === 'mod' ? 'moderator' : 'user'
        }`,
        credentials
      )
      .pipe(switchMap(this.setUserData), tap(this.loadUserData));
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: 'accessToken' });
  }

  async logoutAndNavigateToLogin() {
    await this.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
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
