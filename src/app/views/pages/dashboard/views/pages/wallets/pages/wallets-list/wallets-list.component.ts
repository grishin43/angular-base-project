import {Component, OnInit} from '@angular/core';
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";
import {DashboardRoute} from "../../../../../common/enums/dashboard-route.enum";
import {TopUpRoute} from "../../../top-up/common/enums/top-up-route.enum";
import {Router} from "@angular/router";
import {WalletsRoute} from "../../common/enums/top-up-route.enum";
import {FormControl} from "@angular/forms";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {forkJoin, map, startWith} from "rxjs";
import {AuthService} from "../../../../../../../../services/auth/auth.service";
import {IExchangeBalanceModel} from "../../../../../../../../common/models/domain/models";
import {mapExchangeBalance, mapExchangeBalanceRate} from "../../common/helpers/wallets-mapper";
import {ApiService} from "../../../../../../../../services/api/api.service";
import {CoinapiRateResponse} from "../../../../../../../../common/models/coinapi-response.model";

export interface BalanceRow {
  icon: string;
  currency: string;
  quantity: string;
  usdPrice: string;
  marketPrice?: string;
}

@Component({
  selector: 'app-wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.scss']
})
export class WalletsListComponent extends ADestroyerDirective implements OnInit {
  public isLoading!: boolean;
  public rows!: BalanceRow[];
  public filteredItems: any[] = [];
  public showBalance!: boolean;
  public searchFormControl = new FormControl();
  public usdBalance: string = '0.00';
  public btcBalance: string = '0.00000000';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    super()
  }

  ngOnInit(): void {
    this.getData();
    this.subSearchChanges();
  }

  private subSearchChanges(): void {
    this.subs.add(
      this.searchFormControl.valueChanges
        .pipe(
          startWith(null)
        )
        .subscribe({
          next: (str: string | null) => {
            if (str) {
              this.filteredItems = this.filterItems(str as string);
            } else {
              this.filteredItems = this.rows;
            }
          }
        })
    )
  }

  private filterItems(searchTerm: string): any[] {
    return this.rows.filter(item => {
      return item.currency?.toLowerCase()?.indexOf(searchTerm.toLowerCase()) !== -1
    });
  }

  private getData(): void {
    this.isLoading = true;
    const exchangeBalance: IExchangeBalanceModel = this.authService.account.exchangeBalance;
    if (exchangeBalance) {
      this.rows = mapExchangeBalance(exchangeBalance);
      this.subs.add(
        forkJoin(
          this.rows.map((row) => this.apiService.getExchangeRateToUsd(row.currency))
        ).pipe(
          map((res: CoinapiRateResponse[]) => mapExchangeBalanceRate(this.rows, res))
        ).subscribe({
          next: (rows: BalanceRow[]) => {
            this.rows = rows;
            this.calcTotalBalance(rows);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        })
      )
    } else {
      this.rows = [];
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  }

  private calcTotalBalance(balanceRows: BalanceRow[]): void {
    this.usdBalance = balanceRows.reduce((accumulator, row: BalanceRow) => {
      return accumulator + parseFloat(row.usdPrice);
    }, 0).toFixed(2);
    const matchBtcRow = balanceRows.find((row: BalanceRow) => row.currency === 'BTC');
    if (matchBtcRow) {
      this.btcBalance = (parseFloat(this.usdBalance) / parseFloat(matchBtcRow.marketPrice as string)).toFixed(8);
    }
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

}
