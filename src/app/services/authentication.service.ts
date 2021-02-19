import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, concat } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { AuthResp } from '../interfaces/auth';

import { Plugins } from '@capacitor/core';
import { User } from '../interfaces/user';
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
    setTimeout(() => {
      this.getUserDataFromBackend().subscribe(this.loadUserData);
    }, 0);
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
          this.isAuthenticated = new BehaviorSubject<boolean>(true);
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
      .post<AuthResp>(`${environment.JAVA_API}/auth/signin`, {
        username: credentials.username.trim(),
        password: credentials.password.trim(),
      })
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
        `${environment.JAVA_API}/auth/signup/${role}`,
        credentials
      )
      .pipe(switchMap(this.setUserData), tap(this.loadUserData));
  }

  getUserDataFromBackend(): Observable<void> {
    return this.http
      .get<AuthResp>(`${environment.JAVA_API}/account`)
      .pipe(switchMap(this.setUserData), tap(this.loadUserData));
  }

  getUserDataFromLocalStorage(): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const id = await Storage.get({ key: 'id' });
      const username = await Storage.get({ key: 'username' });
      const email = await Storage.get({ key: 'email' });
      const image = await Storage.get({ key: 'image' });
      const roles = await Storage.get({ key: 'roles' });
      const user: User = {
        id: parseInt(id.value, 10),
        username: username.value,
        email: email.value,
        image: image.value,
        roles: roles.value,
      };
      resolve(user);
    });
  }

  update(user: {
    username: string;
    email: string;
    password: string;
    image: string;
  }): Observable<AuthResp> {
    return this.http.post<AuthResp>(
      `${environment.JAVA_API}/account/update`,
      user
    );
  }

  validate(credentials: {
    email: string;
    username: string;
  }): Observable<{ message: string } | boolean> {
    return this.http.get<{ message: string } | boolean>(
      `${environment.JAVA_API}/auth/signup/validate?username=${credentials.username}&email=${credentials.email}`
    );
  }

  deleteUserData(): Observable<void> {
    let observable$: Observable<void> = from(
      Storage.remove({ key: 'accessToken' })
    );
    ['roles', 'tokenType', 'email', 'username', 'id'].forEach((key) => {
      observable$ = concat(observable$, from(Storage.remove({ key })));
    });
    return observable$;
  }

  logout() {
    this.deleteUserData().subscribe(() => {
      this.isAuthenticated.next(false);
      window.location.reload();
      this.router.navigate(['/login']);
    });
  }

  private setUserData(data: AuthResp): Observable<void> {
    const roles = data['roles'];
    let observable$: Observable<void>;

    if (typeof roles === 'string') {
      observable$ = from(Storage.set({ key: 'roles', value: roles }));
    }
    if (Array.isArray(roles)) {
      const role = roles[0];
      if (typeof role === 'string') {
        observable$ = from(Storage.set({ key: 'roles', value: role }));
      } else {
        observable$ = from(Storage.set({ key: 'roles', value: role.name }));
      }
    }

    const elements = ['id', 'username', 'image', 'email', 'accessToken'];

    for (const element in data) {
      if (Object.prototype.hasOwnProperty.call(data, element)) {
        if (elements.includes(element)) {
          const userData = data[element];
          observable$ = concat(
            observable$,
            from(Storage.set({ key: element, value: userData }))
          );
        }
      }
    }
    if (!this.isAuthenticated) {
      this.isAuthenticated = new BehaviorSubject<boolean>(null);
    }
    return observable$;
  }
}
