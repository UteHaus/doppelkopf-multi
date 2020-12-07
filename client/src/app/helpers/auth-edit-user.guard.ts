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
export class AuthGuardEditUser implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.accountService.userValue;
    const editUserId = route.params['id'];
    if (user && (user.admin || editUserId == user.id)) return true;

    return this.accountService
      .getById(editUserId)
      .pipe(map((user) => !(user.admin || user.editTables || user.editTables)));
  }
}
