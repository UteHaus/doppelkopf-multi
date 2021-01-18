import { ErrorHandler, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  constructor(private logger: NGXLogger) {
    super();
  }

  handleError(error) {
    // Here you can provide whatever logging you want
    this.logger.error(error);
    super.handleError(error);
  }
}
