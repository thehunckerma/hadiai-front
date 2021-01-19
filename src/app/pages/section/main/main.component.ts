import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Section } from '../../../interfaces/section';

import { SectionService } from '../../../services/section.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @Input() id: number;
  section: Section;
  constructor(private sectionService: SectionService, private router: Router) {}

  ngOnInit() {
    this.getSection();
  }

  getSection() {
    this.sectionService.getSection(this.id).subscribe(
      (section: Section) => {
        console.log(section);
        this.section = section;
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
