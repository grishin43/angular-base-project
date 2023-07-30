import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {ToastService} from './toast.service';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {TranslateModule} from '@ngx-translate/core';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ToastService
  ]
})
export class ToastModule {
}
