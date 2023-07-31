import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRoutingModule} from "./dashboard-routing.module";
import { AccountComponent } from './views/pages/account/account.component';
import {DigitsOnlyModule} from "../../../shared/digits-only/digits-only.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import { SecurityComponent } from './views/pages/security/security.component';
import {MatIconModule} from "@angular/material/icon";
import { ChangePasswordComponent } from './views/pages/change-password/change-password.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,
    SecurityComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DigitsOnlyModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule
  ]
})
export class DashboardModule { }
