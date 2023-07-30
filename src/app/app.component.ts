import {Component, OnInit} from '@angular/core';
import {I18nService} from "./services/i18n/i18n.service";
import {ClipboardService, IClipboardResponse} from "ngx-clipboard";
import {ADestroyerDirective} from "./common/abstracts/a-destroyer.directive";
import {ToastService} from "./services/toast/toast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ADestroyerDirective implements OnInit {

  constructor(
    private langService: I18nService,
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) {
    super()
    this.langService.setupLanguages();
  }

  ngOnInit(): void {
    this.subClipboardCopy();
  }

  private subClipboardCopy() {
    this.subs.add(
      this.clipboardService.copyResponse$.subscribe({
        next: ({isSuccess}: IClipboardResponse) => {
          isSuccess && this.toastService.show({
            i18nKey: 'common.copiedToClipBoard',
            type: "success",
            duration: 2000
          });
        }
      })
    );
  }

}
