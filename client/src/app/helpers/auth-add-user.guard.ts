﻿import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AccountService } from '@app/services';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardAddUser implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.accountService.user.pipe(
      first(),
      map((user) => {
        if (user && (user.admin || user.editUser)) {
          // authorised so return true
          return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate([''], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
  }
}
