import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WalletsComponent} from './wallets.component';
import {WalletsRoutingModule} from "./wallets-routing.module";
import { WalletsListComponent } from './pages/wallets-list/wallets-list.component';
import { WalletsWithdrawComponent } from './pages/wallets-withdraw/wallets-withdraw.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    WalletsComponent,
    WalletsListComponent,
    WalletsWithdrawComponent
  ],
  imports: [
    CommonModule,
    WalletsRoutingModule,
    MatProgressSpinnerModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class WalletsModule {
}
