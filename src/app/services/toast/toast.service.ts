import {Injectable} from '@angular/core';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBarRef, TextOnlySnackBar} from "@angular/material/snack-bar";
import {ToastMsgModel} from "./models/toast-msg.model";

@Injectable()
export class ToastService {
  public readonly defaultDuration: number = 3000;

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
  }

  public show(params: Partial<ToastMsgModel>): MatSnackBarRef<TextOnlySnackBar> {
    const message: string = this.translateService.instant(params.i18nKey || 'errors.occurred', params.i18nInterpolateParams);
    const action: string | undefined = '✕';
    return this.snackBar.open(message, action, {
      duration: params.duration || this.defaultDuration,
      panelClass: params.type || 'info',
      verticalPosition: params.vertical || 'top',
      horizontalPosition: params.horizontal || 'right'
    });
  }

  public close(): void {
    this.snackBar.dismiss();
  }

}
