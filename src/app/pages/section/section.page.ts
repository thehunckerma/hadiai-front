import { Component, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavBarService } from '../../services/nav-bar.service';

type Page = 'home' | 'students' | 'sessions' | 'statistics';
@Component({
  selector: 'app-section',
  templateUrl: 'section.page.html',
  styleUrls: ['section.page.scss'],
})
export class SectionPage implements AfterViewChecked {
  page: Page;
  id: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private navBarService: NavBarService
  ) {
    this.navBarService.topNavBarTitle$.subscribe(
      (payload: { title: string; url: string }) => {
        if (payload.url.includes('class/home')) {
          this.page = 'home';
        }
      }
    );
  }

  ngAfterViewChecked(): void {
    document.querySelectorAll('ion-segment-button').forEach((e) => {
      const ionSegmentButton = e.shadowRoot;
      if (!!ionSegmentButton) {
        const segmentButtonIndicator = ionSegmentButton.querySelector(
          '.segment-button-indicator'
        );
        if (!!segmentButtonIndicator) {
          segmentButtonIndicator.setAttribute('style', 'display: none');
        }
      }
    });
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
    switch (page) {
      case 'sessions':
        this.navBarService.topNavBarTitle.next({
          title: 'Sessions',
          url: '',
        });
        break;
      case 'students':
        this.navBarService.topNavBarTitle.next({
          title: 'Students',
          url: '',
        });
        break;
      case 'statistics':
        this.navBarService.topNavBarTitle.next({
          title: 'Statistics',
          url: '',
        });
        break;

      default:
        this.navBarService.topNavBarTitle.next({
          title: 'Class',
          url: '',
        });
        break;
    }
    this.location.replaceState('/class/' + page + '/' + this.id);
  }
}
