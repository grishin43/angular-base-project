import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {DashboardRoute} from "./common/enums/dashboard-route.enum";

const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: DashboardRoute.TOP_UP,
        pathMatch: 'full'
      },
      {
        path: DashboardRoute.TOP_UP,
        loadChildren: () => import('./views/pages/top-up/top-up.module').then((m) => m.TopUpModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
