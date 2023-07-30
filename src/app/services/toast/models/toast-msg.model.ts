import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

export interface ToastMsgModel {
  i18nKey: string;
  i18nInterpolateParams: { [key: string]: string };
  type: ToastPanelType;
  duration: number;
  dismissible: boolean;
  vertical: MatSnackBarVerticalPosition;
  horizontal: MatSnackBarHorizontalPosition;
}

export type ToastPanelType = 'error' | 'success' | 'warning' | 'info';
