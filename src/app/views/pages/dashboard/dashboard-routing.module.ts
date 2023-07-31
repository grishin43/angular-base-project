import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {DashboardRoute} from "./common/enums/dashboard-route.enum";
import {AccountComponent} from "./views/pages/account/account.component";
import {SecurityComponent} from "./views/pages/security/security.component";
import {AppRoute} from "../../../common/enums/app-route.enum";
import {ChangePasswordComponent} from "./views/pages/change-password/change-password.component";

const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: DashboardRoute.WALLETS,
        pathMatch: 'full'
      },
      {
        path: DashboardRoute.TOP_UP,
        loadChildren: () => import('./views/pages/top-up/top-up.module').then((m) => m.TopUpModule)
      },
      {
        path: DashboardRoute.WALLETS,
        loadChildren: () => import('./views/pages/wallets/wallets.module').then((m) => m.WalletsModule)
      },
      {
        path: DashboardRoute.ACCOUNT,
        component: AccountComponent
      },
      {
        path: DashboardRoute.SECURITY,
        component: SecurityComponent
      },
      {
        path: DashboardRoute.CHANGE_PASSWORD,
        component: ChangePasswordComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
