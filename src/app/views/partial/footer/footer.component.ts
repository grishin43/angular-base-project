import {Component} from '@angular/core';
import {ToastService} from "../../../services/toast/toast.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public formControl = new FormControl();

  constructor(
    private toastService: ToastService
  ) {
  }

  public submit(): void {
    if (this.formControl.value?.length) {
      this.toastService.show({
        i18nKey: 'common.emailSubSuccess',
        type: "success",
        duration: 5000
      });
    } else {
      this.toastService.show({
        i18nKey: 'errors.fillAllRequiredFields',
        type: "error",
        duration: 5000
      });
    }
  }

}
