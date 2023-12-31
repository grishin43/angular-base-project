import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from "./services/api/api.service";
import {AuthGuard} from "./guards/auth.guard";
import {AuthService} from "./services/auth/auth.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "./common/helpers/i18n/i18n-http-loader";
import {MissingTranslationService} from "./common/helpers/i18n/i18n-missing-translation";
import {LocalStorageService} from "./services/local-storage/local-storage.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]},
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MissingTranslationService},
    }),
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard,
    LocalStorageService,
    {
      provide: Window,
      useValue: window
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
