import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from 'src/core/app-config';

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {}

  openJitsiInNewBrowserTab(meetingName?: string): void {
    window.open(
      `https://meet.jit.si/${this.appConfig.jitsiBaseLink}${
        meetingName ? '-' + meetingName : ''
      }`
    );
  }
}
