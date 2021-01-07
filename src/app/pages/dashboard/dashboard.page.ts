import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


import { Class } from '../../interfaces/class';

import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  classes: Array<Class> =[{id:1},{id:2}];

  constructor(private dashboardService: DashboardService) {
    
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
}
