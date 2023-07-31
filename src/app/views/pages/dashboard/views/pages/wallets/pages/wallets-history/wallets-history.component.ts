import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";
import {DashboardRoute} from "../../../../../common/enums/dashboard-route.enum";
import {WalletsRoute} from "../../common/enums/top-up-route.enum";
import {TopUpRoute} from "../../../top-up/common/enums/top-up-route.enum";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {ApiService} from "../../../../../../../../services/api/api.service";
import {AuthService} from "../../../../../../../../services/auth/auth.service";
import {
  EBalanceTransactionStatus,
  EBalanceTransactionType,
  IBalanceTransactionModel
} from "../../../../../../../../common/models/domain/models";
import {ISearchResponseDTO} from "../../../../../../../../common/models/domain/dto/search.dto";
import {DateHelper} from "../../../../../../../../common/helpers/date.helper";

@Component({
  selector: 'app-wallets-history',
  templateUrl: './wallets-history.component.html',
  styleUrls: ['./wallets-history.component.scss']
})
export class WalletsHistoryComponent extends ADestroyerDirective implements OnInit {
  public isLoading!: boolean;
  public rows: IBalanceTransactionModel[] = [];
  public balanceTransactionType = EBalanceTransactionType;
  public balanceTransactionStatus = EBalanceTransactionStatus;
  public dateFullFormat: string = DateHelper.fullFormat;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    super()
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.isLoading = true;
    this.subs.add(
      this.apiService.searchTransactions(this.authService.account.id)
        .subscribe({
          next: ({rows}: ISearchResponseDTO<IBalanceTransactionModel>) => {
            this.rows = rows;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        })
    )
  }

  public withdraw(currency: string): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.WALLETS}/${WalletsRoute.WITHDRAW}`], {
      queryParams: {
        token: currency
      }
    })
  }

  public deposit(currency: string): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.TOP_UP}/${TopUpRoute.ORDER}`], {
      queryParams: {
        token: currency
      }
    })
  }

  protected readonly EBalanceTransactionStatus = EBalanceTransactionStatus;
}
