import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  constructor(private logger: NGXLogger, private route: Router) {
    super();
  }

  handleError(error: any): void {
    if (error != null) {
      this.logger.error(error.message || error, [
        { url: this.route.url, stak: error.stack || '' },
      ]);
      super.handleError(error);
    }
  }
}
