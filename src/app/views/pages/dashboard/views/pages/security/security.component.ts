import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AppRoute} from "../../../../../../common/enums/app-route.enum";
import {DashboardRoute} from "../../../common/enums/dashboard-route.enum";

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent {

  constructor(
    private router: Router
  ) {
  }

  public changePassword(): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.CHANGE_PASSWORD}`]);
  }

}
