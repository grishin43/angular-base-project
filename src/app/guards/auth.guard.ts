import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {map, Observable} from "rxjs";
import {AppRoute} from "../common/enums/app-route.enum";
import {AuthService} from "../services/auth/auth.service";

@Injectable()
export class AuthGuard {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.authService.getAccount()
      .pipe(
        map((account) => {
          if (account) {
            return true;
          } else {
            this.router.navigate([`/${AppRoute.AUTH}`]);
            return false;
          }
        })
      )
  }

}
