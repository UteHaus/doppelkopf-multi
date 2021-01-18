﻿import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './components';
import { HomeComponent } from './home';
import { DoppelkopfModule } from 'src/doppelkopf/doppelkopf.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectComponent } from './components/language-select/language-select.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '@environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    DoppelkopfModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
      enableSourceMaps: false,
      httpResponseType: 'json',
      serverLoggingUrl: `${environment.apiUrl}/logger`,
    }),
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LanguageSelectComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
  exports: [TranslateModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
