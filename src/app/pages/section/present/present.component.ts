import { Component, OnInit } from '@angular/core';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { PythonService } from '../../../services/python.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../interfaces/user';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../interfaces/section';

@Component({
  selector: 'app-present',
  templateUrl: './present.component.html',
  styleUrls: ['./present.component.scss'],
})
export class PresentComponent implements OnInit {
  sectionId: number;
  imageUUID: string;

  isImageValid = false;
  destroy = false;
  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId: string;
  videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  errors: WebcamInitError[] = [];

  webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  private imgBody: FormData;
  windowWidth: number;

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  get windowRef() {
    return window;
  }

  constructor(
    private pythonService: PythonService,
    private sectionService: SectionService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.sectionId = +this.route.snapshot.paramMap.get('id');
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (!val.url.includes('class/present')) {
          this.destroy = true; // Unsubscribe from timer observable if user leave this page
        } else {
          this.destroy = false;
          timer(0, 2000)
            .pipe(takeWhile(() => !this.destroy))
            .subscribe(() => {
              this.recognize();
            });
        }
      }
    });
    this.authService.getUserDataFromLocalStorage().then((user: User) => {
      this.imageUUID = user.image;
    });
  }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.windowWidth = this.windowRef.innerWidth;
  }

  toggleWebcam(): void {
    this.errors = [];
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    const base64 = webcamImage.imageAsDataUrl;

    fetch(base64)
      .then((r: Response) => r.blob())
      .then((blob: Blob) => {
        this.imgBody = new FormData();
        this.imgBody.append('image', new File([blob], 'bruh.png'));

        this.pythonService
          .recognize(this.sectionId, this.imageUUID, this.imgBody)
          .subscribe(
            (resp: { success: boolean }) => {
              this.isImageValid = resp.success;
            },
            (error: any) => {
              this.isImageValid = false;
            }
          );
      });
  }

  cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  resetWebCam(): void {
    this.webcamImage = null;
  }

  recognize(): void {
    if (this.showWebcam || this.errors.length > 0) {
      console.log('Face recognition request sent!');
      this.trigger.next();
    }
  }

  getSection() {
    this.sectionService.getSection(this.sectionId).subscribe(
      (section: Section) => {
        if (!section.sessionOn) {
          this.router.navigateByUrl('/not-found');
        }
      },
      (err: any) => {
        // Show some kind of error
        console.log(err);
        if (!!err && err.status === 404) {
          this.router.navigateByUrl('/not-found');
        }
      }
    );
  }
}
