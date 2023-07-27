import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoute} from "./common/enums/app-route.enum";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.DASHBOARD
  },
  {
    path: AppRoute.AUTH,
    loadChildren: () => import('./views/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: AppRoute.DASHBOARD,
    canActivate: [AuthGuard],
    loadChildren: () => import('./views/pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '**',
    redirectTo: AppRoute.DASHBOARD
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
