import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {AuthComponent} from "./auth.component";
import {AuthRoute} from "./common/enums/auth-route.enum";
import {SignInComponent} from "./pages/sign-in/sign-in.component";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";

const routes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: AuthRoute.SIGN_IN,
        pathMatch: 'full'
      },
      {
        path: AuthRoute.SIGN_IN,
        component: SignInComponent
      },
      {
        path: AuthRoute.SIGN_UP,
        component: SignUpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
