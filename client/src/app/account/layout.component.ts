import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
  constructor(private router: Router, private accountService: AccountService) {
    // redirect to home if already logged in
    this.accountService.user.pipe(first()).subscribe((user) => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }
}
