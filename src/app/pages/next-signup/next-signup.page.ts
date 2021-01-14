import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { FaceDetectionResp } from '../../interfaces/face-detection-resp';

import { FaceDetectionService } from '../../services/face-detection.service';
import { AuthenticationService } from './../../services/authentication.service';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-next-signup',
  templateUrl: './next-signup.page.html',
  styleUrls: ['./next-signup.page.scss'],
})
export class NextSignupPage implements OnInit {
  shouldLoad = false;
  showTraining = false;
  isImageCollectingStarted = false;
  isImageCollectingFinished = false;
  radio = 'student';
  isImageValid = false;

  credentials: {
    fullname: string;
    email: string;
    username: string;
    password: string;
    image?: string;
  };
  hiddenPassword: string;

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
  imageAsDataUrl: string;
  originalImageAsDataUrl: string;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  windowWidth: number;
  constructor(
    private faceDetectionService: FaceDetectionService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    // Sign Up credentials from Storage ------------------
    Storage.get({ key: 'stringified-creds' })
      .then((storage: { value: string }) => {
        const stringifiedCreds = storage.value;
        this.credentials = JSON.parse(stringifiedCreds);
        if (!this.credentials) {
          this.router.navigateByUrl('/signup', { replaceUrl: true });
        } else {
          this.hiddenPassword = '*'.repeat(this.credentials.password.length);
          this.shouldLoad = true;
        }
      })
      .catch((err: any) =>
        this.router.navigateByUrl('/signup', { replaceUrl: true })
      );
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.windowWidth = this.windowRef.innerWidth;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  get windowRef() {
    return window;
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  toggleWebcam(): void {
    this.errors = [];
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  showNextWebcam(directionOrDeviceId: boolean | string): void {
    if (!this.isImageCollectingStarted) {
      this.nextWebcam.next(directionOrDeviceId);
    }
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
  }

  handleImage(webcamImage: WebcamImage): void {
    this.isImageValid = false;
    this.webcamImage = webcamImage;
    this.imageAsDataUrl = webcamImage.imageAsDataUrl;
    this.originalImageAsDataUrl = webcamImage.imageAsDataUrl;
    const base64 = webcamImage.imageAsDataUrl;

    fetch(base64)
      .then((r: Response) => r.blob())
      .then((blob: Blob) => {
        const imgBody = new FormData();
        imgBody.append('image', new File([blob], 'bruh.png'));

        this.faceDetectionService
          .detectFace(imgBody)
          .subscribe((resp: FaceDetectionResp) => {
            if (resp.success) {
              this.imageAsDataUrl = 'data:image/jpeg;base64,' + resp.image;
              this.isImageValid = resp.num_faces === 1;
            } else {
              // raise error
            }
          });
      });
  }

  async signup() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signup(this.credentials, 'mod').subscribe(
      async () => {
        await Storage.remove({
          key: 'stringified-creds',
        });
        const toast = await this.toastController.create({
          header: 'Sign up successfull',
          duration: 1500000,
          position: 'bottom',
          color: 'primary',
        });
        toast.present();
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (res: any) => {
        console.log(res);
        let alert: any;
        await loading.dismiss();
        if (!!res && !!res.error && !!res.error.message) {
          alert = await this.alertController.create({
            header: 'Invalid credentials, please try again!',
            message: res.error.message,
            buttons: ['OK'],
          });
        } else {
          alert = await this.alertController.create({
            header: 'Invalid credentials, please try again!',
            message: res
              ? res.error
                ? res.error.error
                  ? res.error.error
                  : 'Unkown error'
                : 'Unkown error'
              : 'Unkown error',
            buttons: ['OK'],
          });
        }
        await alert.present();
      }
    );
  }

  proceed(): void {
    if (this.isImageValid) {
      if (this.radio === 'teacher') {
        this.signup();
      } else {
        this.showTraining = true;
      }
    }
  }

  cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  resetWebCam(): void {
    this.webcamImage = null;
    this.imageAsDataUrl = '';
  }

  // Image training related stuff

  startTakingTrainingImages(): void {
    this.isImageCollectingStarted = true;
  }
  cancel(): void {
    if (this.isImageCollectingStarted) {
      this.isImageCollectingStarted = false;
    } else {
      this.showTraining = false;
      this.resetWebCam();
    }
  }

  handleTrainingImage(webcamImage: WebcamImage): void {
    const base64 = webcamImage.imageAsDataUrl;

    fetch(base64)
      .then((r: Response) => r.blob())
      .then((blob: Blob) => {
        const imgBody = new FormData();
        imgBody.append('image', new File([blob], 'bruh.png'));

        this.faceDetectionService
          .detectFace(imgBody)
          .subscribe((resp: FaceDetectionResp) => {
            if (resp.success) {
              this.imageAsDataUrl = 'data:image/jpeg;base64,' + resp.image;
              this.isImageValid = resp.num_faces === 1;
            } else {
              // raise error
            }
          });
      });
  }
}
