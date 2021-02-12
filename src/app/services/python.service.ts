import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FaceDetectionResp, UploadImageResp } from '../interfaces/python';

@Injectable({
  providedIn: 'root',
})
export class PythonService {
  constructor(private http: HttpClient) {}

  detectFace(image: FormData): Observable<FaceDetectionResp> {
    return this.http.post<FaceDetectionResp>(
      `${environment.PYTHON_API}/detect`,
      image
    );
  }

  uploadImage(image: FormData): Observable<UploadImageResp> {
    return this.http.post<UploadImageResp>(
      `${environment.PYTHON_API}/upload`,
      image
    );
  }
}
