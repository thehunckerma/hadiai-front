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

  addSection(section: AddSection): Observable<Section> {
    return this.http.post<Section>(`${environment.JAVA_API}/sections`, section);
  }
  deleteSection(id: number): Observable<null> {
    return this.http.delete<null>(`${environment.JAVA_API}/sections/${id}`);
  }
}
