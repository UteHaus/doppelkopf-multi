import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AccountService } from '@app/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthForUserGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.accountService.user.pipe(
      map((user) => {
        if (user && route.params['id'] == user.id) {
          // authorised so return true
          return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
  }
}
