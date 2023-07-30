import {NgModule} from '@angular/core';
import {Route, RouterModule} from "@angular/router";
import {WalletsComponent} from "./wallets.component";
import {WalletsListComponent} from "./pages/wallets-list/wallets-list.component";
import {WalletsRoute} from "./common/enums/top-up-route.enum";
import {WalletsWithdrawComponent} from "./pages/wallets-withdraw/wallets-withdraw.component";

const routes: Route[] = [
  {
    path: '',
    component: WalletsComponent,
    children: [
      {
        path: '',
        redirectTo: WalletsRoute.LIST,
        pathMatch: 'full'
      },
      {
        path: WalletsRoute.LIST,
        component: WalletsListComponent
      },
      {
        path: WalletsRoute.WITHDRAW,
        component: WalletsWithdrawComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletsRoutingModule {
}
