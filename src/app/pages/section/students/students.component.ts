import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Section } from '../../../interfaces/section';
import { User } from '../../../interfaces/user';

import { SectionService } from '../../../services/section.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  @Input() id: number;
  students: Array<User>;
  requests: Array<User>;
  isLoaded = false;
  constructor(private sectionService: SectionService, private router: Router) {}

  ngOnInit() {
    this.getSection();
  }

  getSection() {
    this.sectionService.getSection(this.id).subscribe(
      (section: Section) => {
        console.log(section);
        this.students = section.students;
        this.requests = section.requests;
        this.isLoaded = true;
      },
      (err: any) => {
        // Show some kind of error
        console.log(err);
        this.isLoaded = false;
        if (!!err && err.status === 404) {
          this.router.navigateByUrl('/not-found');
        }
      }
    );
  }
}
