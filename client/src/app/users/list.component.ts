import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/services';
import { User } from '@app/models';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.less'],
})
export class ListComponent implements OnInit, AfterViewChecked {
  users = null;

  constructor(private accountService: AccountService) {}

  ngAfterViewChecked(): void {
    // set auto hight of scrolling element
    const overflowAuto = document.getElementsByClassName('card-body')[0];
    if (overflowAuto) {
      const maxHeight = overflowAuto.getBoundingClientRect().top + 20;
      overflowAuto['style'].height = 'calc(100vh - ' + maxHeight + 'px)';
    }
  }

  ngOnInit(): void {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe((users) => (this.users = this.sortUsers(users)));
  }

  deleteUser(id: string): void {
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
