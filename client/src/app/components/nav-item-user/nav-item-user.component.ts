import { Component, Input, OnInit } from '@angular/core';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';

@Component({
  selector: 'app-nav-item-user',
  templateUrl: './nav-item-user.component.html',
  styleUrls: ['./nav-item-user.component.less'],
})
export class NavItemUserComponent implements OnInit {
  show: boolean = false;
  showLangauges: boolean = false;
  user$: Observable<User>;
  backupRout: string;
  @Input()
  set previousRoute(value: string) {
    const i = value.includes('edit');
    if (!i) {
      this.backupRout = value.split('/').join('_');
    }
  }

  constructor(
    private accountService: AccountService,
    private playerService: PlayTableService
  ) {}

  ngOnInit(): void {
    this.user$ = this.accountService.user;
  }

  logout() {
    this.accountService.user
      .pipe(
        switchMap((user) =>
          user ? this.playerService.logoutOfTable(user.id) : of(undefined)
        ),
        first()
      )
      .subscribe(() => this.accountService.logout());
  }
}
