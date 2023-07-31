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
import { HeaderComponent } from './views/partial/header/header.component';
import { FooterComponent } from './views/partial/footer/footer.component';
import {I18nService} from "./services/i18n/i18n.service";
import {ToastModule} from "./services/toast/toast.module";
import { IntroComponent } from './views/pages/intro/intro.component';
import { AboutComponent } from './views/pages/about/about.component';
import { TermsComponent } from './views/pages/terms/terms.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IntroComponent,
    AboutComponent,
    TermsComponent
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
    ToastModule
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard,
    LocalStorageService,
    I18nService,
    {
      provide: Window,
      useValue: window
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
