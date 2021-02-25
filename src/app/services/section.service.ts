import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Section, AddSection } from '../interfaces/section';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  constructor(private http: HttpClient) {}

  getAllSections(role: string = ''): Observable<Array<Section>> {
    return this.http.get<Array<Section>>(
      `${environment.JAVA_API}/sections/${role === 'mod' ? '' : 'user'}`
    );
  }

  getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${environment.JAVA_API}/sections/${id}`);
  }

  addSection(section: AddSection): Observable<Section> {
    return this.http.post<Section>(`${environment.JAVA_API}/sections`, section);
  }

  deleteSection(id: number): Observable<null> {
    return this.http.delete<null>(`${environment.JAVA_API}/sections/${id}`);
  }

  joinSection(token: string): Observable<Section> {
    return this.http.get<Section>(
      `${environment.JAVA_API}/sections/token/${token}/join`
    );
  }

  quitSection(id: number): Observable<Section> {
    return this.http.get<Section>(
      `${environment.JAVA_API}/sections/${id}/quit`
    );
  }

  approveJoinRequest(sectionID: number, userID: number): Observable<any> {
    return this.http.get<any>(
      `${environment.JAVA_API}/sections/${sectionID}/join/approve/user/${userID}`
    );
  }

  rejectJoinRequest(sectionID: number, userID: number): Observable<any> {
    return this.http.get<any>(
      `${environment.JAVA_API}/sections/${sectionID}/join/reject/user/${userID}`
    );
  }

  removeUser(sectionID: number, userID: number): Observable<any> {
    return this.http.get<any>(
      `${environment.JAVA_API}/sections/${sectionID}/user/${userID}/remove`
    );
  }
}
