import { Component, OnInit } from '@angular/core';
import { Section } from '../../interfaces/section';
import { User } from '../../interfaces/user';
import { AuthenticationService } from '../../services/authentication.service';
import { SectionService } from '../../services/section.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  roles: 'ROLE_USER' | 'ROLE_MODERATOR';
  sections: Array<Section>;
  students : Array<User> ;
  isLoaded = false;

  constructor(public authService: AuthenticationService,
    private sectionService: SectionService) { }

  ngOnInit() {

    this.authService.roles.subscribe(
      (roles: 'ROLE_USER' | 'ROLE_MODERATOR') => {
        if (!!roles) {
          this.roles = roles;
          this.getAllSections(this.roles === 'ROLE_MODERATOR' ? 'mod' : null);
        }
      }
    );
  }

  private getAllSections(role: string = '') {
    this.sectionService.getAllSections(role).subscribe(
      (resp: Array<Section>) => {
        this.isLoaded = true;
        this.sections= resp;
        console.log(resp);
      },
      (error: any) => {
        console.log(error);
        this.isLoaded = false;
      }
    );
  }
}
