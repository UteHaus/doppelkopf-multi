import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AccountService } from '@app/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardEditUser implements CanActivate {
  constructor(private accountService: AccountService) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const editUserId = route.params['id'];

    return this.accountService.user.pipe(
      map((user) => user.admin || editUserId == user.id || user.editUser)
    );
  }
}
