import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Class } from '../interfaces/class';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getClasses(): Observable<Array<Class>> {
    return this.http.get<Array<Class>>(`${environment.JAVA_API}/classes`);
  }
}
