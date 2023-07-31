import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../../../services/auth/auth.service";
import {IAccountModel} from "../../../../../../common/models/domain/models";
import {ToastService} from "../../../../../../services/toast/toast.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
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
        i18nKey: 'common.dataUpdated',
        type: "success",
        duration: 5000
      });
    },750)
  }

}
