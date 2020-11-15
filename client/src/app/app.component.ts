import { Component } from '@angular/core';

import { AccountService } from './services';
import { User } from './models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user$: Observable<User>;

  constructor(
    private accountService: AccountService,
    translate: TranslateService,
    private route: Router
  ) {
    this.user$ = this.accountService.user;
    translate.setDefaultLang('de');
    route.navigateByUrl;
  }

  logout() {
    this.accountService.logout();
  }

  editUser(user: User) {
    this.route.navigate(user.admin ? ['/users'] : ['/users', 'edit', user.id]);
  }
}
