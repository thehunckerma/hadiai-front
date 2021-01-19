import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = {
    id: 0,
    username: 'test',
    email: 'test',
  };
  constructor() {}

  ngOnInit() {}
}
