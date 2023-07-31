import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoute} from "./common/enums/app-route.enum";
import {AuthGuard} from "./guards/auth.guard";
import {IntroComponent} from "./views/pages/intro/intro.component";
import {AboutComponent} from "./views/pages/about/about.component";
import {TermsComponent} from "./views/pages/terms/terms.component";
import {ChangePasswordComponent} from "./views/pages/dashboard/views/pages/change-password/change-password.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.INTRO
  },
  {
    path: AppRoute.INTRO,
    component: IntroComponent
  },
  {
    path: AppRoute.ABOUT,
    component: AboutComponent
  },
  {
    path: AppRoute.TERMS,
    component: TermsComponent
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
    redirectTo: AppRoute.INTRO
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
