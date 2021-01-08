import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';




import { Class } from '../../interfaces/class';

import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  classes: Array<Class> =[{id:1},{id:2}];
  private router: Router;
  


  constructor(private dashboardService: DashboardService,public alertCtrl: AlertController) {
    

  }
  
  
  ngOnInit() {
  //this.getClasses();
  }

  private getClasses() {
    this.dashboardService.getClasses().subscribe(
      (resp: Array<Class>) => {
        console.log(resp);
        this.classes = resp;
      },
      (error: any) => console.log(error)
    );
  }
  async deleteClassAlertButtons() {  
    const alert = await this.alertCtrl.create({  
      header: 'Alert !',  
      message: 'Are you sure you want to delete the class ?',  
      buttons: ['Cancel', 'Delete']  
    });  
    await alert.present();  
  }  
}
