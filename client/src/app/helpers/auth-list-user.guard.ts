import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AccountService } from '@app/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardListUser implements CanActivate {
  constructor(private accountService: AccountService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.accountService.user.pipe(
      map((user) => user && (user.admin || user.editUser))
    );
  }
}
