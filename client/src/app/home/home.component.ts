import { Component } from '@angular/core';

import { User } from '@app/models';
import { AccountService } from '@app/services';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  user$: Observable<User>;

  constructor(private accountService: AccountService) {
    this.user$ = this.accountService.user;
  }
}
