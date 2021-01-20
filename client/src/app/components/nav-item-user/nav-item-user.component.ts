import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { Language } from './language.model';

@Component({
  selector: 'app-nav-item-user',
  templateUrl: './nav-item-user.component.html',
  styleUrls: ['./nav-item-user.component.less'],
})
export class NavItemUserComponent implements OnInit, OnDestroy {
  show: boolean = false;
  showLangauges: boolean = false;
  private setLanguage$ = new Subject<Language>();
  user$: Observable<User>;
  setLanguageSub: Subscription;
  languages: Language[] = [
    { key: 'de', name: 'Deutsch' },
    { key: 'hsb', name: 'Serbsce' },
    { key: 'en', name: 'English' },
  ];

  constructor(
    private translateService: TranslateService,
    private accountService: AccountService,
    private playerService: PlayTableService
  ) {}

  ngOnDestroy(): void {
    this.setLanguage$.complete();
    this.setLanguageSub.unsubscribe();
  }

  ngOnInit(): void {
    this.setLanguageSub = this.setLanguage$
      .pipe(
        switchMap((language) => this.accountService.setLanguage(language.key))
      )
      .subscribe();
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

  setLanguage(language: Language): void {
    this.translateService.use(language.key);
    this.setLanguage$.next(language);
    this.show = false;
  }
}
