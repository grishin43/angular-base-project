import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {map, Observable, of} from "rxjs";
import {AppRoute} from "../common/enums/app-route.enum";
import {AuthService} from "../services/auth/auth.service";
import {IAccountModel} from "../common/models/domain/models";

@Injectable()
export class AuthGuard {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(): Observable<boolean> {
    return of(this.authService.account)
      .pipe(
        map((account: IAccountModel) => {
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
