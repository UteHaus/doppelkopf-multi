import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/services';
import { User } from '@app/models';
import { NGXLogger } from 'ngx-logger';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.less'],
})
export class ListComponent implements OnInit, AfterViewChecked {
  users = null;

  constructor(
    private accountService: AccountService,
    private logger: NGXLogger
  ) {
    /* this.logger.debug('Debug message');
    this.logger.info('Info message');
    this.logger.log('Default log message');
    this.logger.warn('Warning message');
    this.logger.error('Error message'); */
  }

  ngAfterViewChecked(): void {
    // set auto hight of scrolling element
    const overflowAuto = document.getElementsByClassName('card-body')[0];
    if (overflowAuto) {
      const maxHeight = overflowAuto.getBoundingClientRect().top + 20;
      overflowAuto['style'].height = 'calc(100vh - ' + maxHeight + 'px)';
    }
  }

  ngOnInit() {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe((users) => (this.users = this.sortUsers(users)));
  }

  deleteUser(id: string) {
    const user = this.users.find((x) => x.id === id);
    user.isDeleting = true;
    this.accountService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.users = this.users.filter((x) => x.id !== id);
      });
  }

  private sortUsers(users: User[]): User[] {
    return users.sort((userA, userB) =>
      userA.username.localeCompare(userB.username)
    );
  }
}
