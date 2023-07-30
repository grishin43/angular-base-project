import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {TopUpComponent} from "./top-up.component";
import {TopUpRoute} from "./common/enums/top-up-route.enum";
import {TopUpOrderComponent} from "./views/pages/top-up-order/top-up-order.component";
import {TopUpPaymentComponent} from "./views/pages/top-up-payment/top-up-payment.component";

const routes: Route[] = [
  {
    path: '',
    component: TopUpComponent,
    children: [
      {
        path: '',
        redirectTo: TopUpRoute.ORDER,
        pathMatch: 'full'
      },
      {
        path: TopUpRoute.ORDER,
        component: TopUpOrderComponent
      },
      {
        path: `${TopUpRoute.ORDER}/:id`,
        component: TopUpPaymentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopUpRoutingModule {
}
