import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  constructor(public alertCtrl: AlertController) { }

  ngOnInit() {
  }
  async deleteClassAlertButtons() {  
    const alert = await this.alertCtrl.create({  
      header: 'Alert !',  
      message: 'Are you sure you want to delete student ?',  
      buttons: ['Cancel', 'Delete']  
    });  
    await alert.present();  
  }  
}
