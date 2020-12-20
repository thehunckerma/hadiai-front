import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FaceDetectionResp } from '../interfaces/face-detection-resp';

@Injectable({
  providedIn: 'root',
})
export class FaceDetectionService {
  constructor(private http: HttpClient) {}

  detectFace(image: FormData): Observable<FaceDetectionResp> {
    return this.http.post<FaceDetectionResp>(
      `${environment.FACE_DETECTION_API}`,
      image
    );
  }
}
