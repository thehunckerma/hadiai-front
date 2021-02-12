import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  topNavBarTitle: BehaviorSubject<{
    title: string;
    url: string;
  }> = new BehaviorSubject<{ title: string; url: string }>(null);
  topNavBarTitle$ = this.topNavBarTitle
    .asObservable()
    .pipe(filter((payload: any) => !!payload));
  constructor() {}
}
