import { Component, HostListener } from '@angular/core';

import { AccountService } from './services';
import { User } from './models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user$: Observable<User>;

  constructor(
    private accountService: AccountService,
    translate: TranslateService,
    private route: Router,
    private playeService: PlayTableService,
    public tableHub: TableHubService
  ) {
    this.user$ = this.accountService.user;
    translate.setDefaultLang('de');
    route.navigateByUrl;
  }

  logout() {
    this.playeService
      .logoutOfTable(this.accountService.userValue.id)
      .toPromise()
      .then();
    this.accountService.logout();
  }

  editUser(user: User) {
    this.route.navigate(user.admin ? ['/users'] : ['/users', 'edit', user.id]);
  }
}
