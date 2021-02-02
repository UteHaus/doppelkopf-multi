import { InjectionToken } from '@angular/core';

export interface AppConfig {
  jitsiBaseLink: string;
}
export const APP_CONFIG = new InjectionToken<AppConfig>('appConfig.hock');
