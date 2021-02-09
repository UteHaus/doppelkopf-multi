import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '@app/services';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private logger: NGXLogger
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 && !request.url.includes('polyfills')) {
          // auto logout if 401 response returned from api
          this.accountService.logout();
        }
        this.logger.error(err?.error?.message, [
          { request: request },
          { status: err.statusText },
        ]);
        const error = (err.error && err.error.message) || err.statusText;
        return throwError(error);
      })
    );
  }
}
