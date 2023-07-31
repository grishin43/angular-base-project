import { Component } from '@angular/core';
import {IAccountModel} from "../../../../../../common/models/domain/models";
import {AuthService} from "../../../../../../services/auth/auth.service";
import {ToastService} from "../../../../../../services/toast/toast.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  public isLoading!: boolean;
  public account!: IAccountModel;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.account = this.authService.account;
  }

  public submit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.toastService.show({
        i18nKey: 'common.passwordUpdated',
        type: "success",
        duration: 5000
      });
    },750)
  }
}
