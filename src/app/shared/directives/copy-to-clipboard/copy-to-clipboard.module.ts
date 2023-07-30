import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CopyToClipboardDirective} from "./copy-to-clipboard.directive";

@NgModule({
  declarations: [
    CopyToClipboardDirective
  ],
  exports: [
    CopyToClipboardDirective
  ],
  imports: [
    CommonModule
  ]
})
export class CopyToClipboardModule {
}
