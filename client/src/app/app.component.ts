import { Component, OnInit } from '@angular/core';

import { AccountService } from './services';
import { User } from './models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { tap } from 'rxjs/operators';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private accountService: AccountService,
    private translateService: TranslateService,
    private route: Router,
    private playeService: PlayTableService
  ) {
    // translate.setDefaultLang('de');
    route.navigateByUrl;
  }

  ngOnInit(): void {
    this.user$ = this.accountService.user.pipe(
      tap((user) => {
        if (
          user &&
          user.languageKey &&
          this.translateService.currentLang != user.languageKey
        )
          this.translateService.use(user.languageKey);
        else this.translateService.use(this.translateService.getBrowserLang());
      })
    );
  }

  logout() {
    this.playeService
      .logoutOfTable(this.accountService.userValue.id)
      .toPromise()
      .then();
    this.accountService.logout();
  }

  editUser(user: User) {
    this.route.navigate(
      user.admin || user.editUser ? ['/users'] : ['/users', 'edit', user.id]
    );
  }
}
