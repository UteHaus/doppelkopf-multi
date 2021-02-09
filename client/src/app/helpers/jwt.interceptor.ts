import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AccountService } from '@app/services';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to the api url
    return this.accountService.user.pipe(
      map((user) => {
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          return request;
        }
        return request;
      }),
      switchMap((modRequest) => next.handle(modRequest))
    );
  }
}
