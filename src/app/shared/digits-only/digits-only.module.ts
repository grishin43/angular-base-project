import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DigitsOnlyDirective} from "./digits-only.directive";

@NgModule({
  declarations: [
    DigitsOnlyDirective
  ],
  exports: [
    DigitsOnlyDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DigitsOnlyModule {
}
