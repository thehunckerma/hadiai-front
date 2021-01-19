import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

type Page = 'home' | 'students' | 'sessions' | 'statistics';
@Component({
  selector: 'app-section',
  templateUrl: 'section.page.html',
  styleUrls: ['section.page.scss'],
})
export class SectionPage {
  page: Page;
  id: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    console.log('bruh');
  }

  ngOnInit() {
    this.page = this.route.snapshot.params['page'];
    if (!['home', 'students', 'sessions', 'statistics'].includes(this.page)) {
      this.router.navigateByUrl('/not-found');
    }
    this.id = this.route.snapshot.params['id'];
    if (isNaN(parseInt(this.id, 10))) {
      this.router.navigateByUrl('/not-found');
    }
    console.log(this.page);
  }

  switchPage(page: Page) {
    this.page = page;
    this.location.replaceState('/class/' + page + '/' + this.id);
  }
}
