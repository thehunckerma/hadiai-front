import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    Storage.remove({ key: 'stringified-creds' }).then();
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fullname() {
    return this.credentials.get('fullname');
  }
  get email() {
    return this.credentials.get('email');
  }
  get username() {
    return this.credentials.get('username');
  }
  get password() {
    return this.credentials.get('password');
  }

  next(): void {
    if (this.credentials.valid) {
      const stringifiedCreds = JSON.stringify(this.credentials.value);
      Storage.set({
        key: 'stringified-creds',
        value: stringifiedCreds,
      }).then(() => this.router.navigateByUrl('/next', { replaceUrl: true }));
    }
  }
}
