import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {startWith} from "rxjs";
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";
import {DashboardRoute} from "../../../../../common/enums/dashboard-route.enum";
import {WalletsRoute} from "../../common/enums/top-up-route.enum";
import {TopUpRoute} from "../../../top-up/common/enums/top-up-route.enum";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";

@Component({
  selector: 'app-wallets-history',
  templateUrl: './wallets-history.component.html',
  styleUrls: ['./wallets-history.component.scss']
})
export class WalletsHistoryComponent extends ADestroyerDirective implements OnInit {
  public isLoading!: boolean;
  public tableData = [
    {
      currency: 'BTC',
      quantity: '0.00000',
      usdPrice: 32000
    },
    {
      currency: 'ETH',
      quantity: '0.00000',
      usdPrice: 1800
    },
    {
      currency: 'LTC',
      quantity: '0.00000',
      usdPrice: 142
    }
  ];
  public filteredItems: any[] = [];
  public showBalance!: boolean;
  public searchFormControl = new FormControl();

  constructor(
    private router: Router
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
            if(str){
              this.filteredItems = this.filterItems(str as string);
            } else {
              this.filteredItems = this.tableData;
            }
          }
        })
    )
  }

  private filterItems(searchTerm: string): any[] {
    return this.tableData.filter(item => {
      return item.currency?.toLowerCase()?.indexOf(searchTerm.toLowerCase()) !== -1
    });
  }

  private getData(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
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
