import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopUpComponent} from './top-up.component';
import {TopUpRoutingModule} from "./top-up-routing.module";
import {TopUpOrderComponent} from './views/pages/top-up-order/top-up-order.component';
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import { TopUpPaymentComponent } from './views/pages/top-up-payment/top-up-payment.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CopyToClipboardModule} from "../../../../../../shared/directives/copy-to-clipboard/copy-to-clipboard.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    TopUpComponent,
    TopUpOrderComponent,
    TopUpPaymentComponent
  ],
  imports: [
    CommonModule,
    TopUpRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    CopyToClipboardModule,
    MatProgressSpinnerModule
  ]
})
export class TopUpModule {
}
