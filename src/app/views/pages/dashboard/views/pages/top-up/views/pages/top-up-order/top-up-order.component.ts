import {Component, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../../../../../common/abstracts/a-destroyer.directive";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {KeyValue} from "@angular/common";
import {ApiService} from "../../../../../../../../../services/api/api.service";
import {Router} from "@angular/router";
import {TopUpRoute} from "../../../common/enums/top-up-route.enum";
import {DashboardRoute} from "../../../../../../common/enums/dashboard-route.enum";
import {AppRoute} from "../../../../../../../../../common/enums/app-route.enum";
import {ToastService} from "../../../../../../../../../services/toast/toast.service";

export interface TopUpForm {
  paymentMethod: FormControl<string | null>;
  amount: FormControl<number | null>;
}

@Component({
  selector: 'app-top-up-order',
  templateUrl: './top-up-order.component.html',
  styleUrls: ['./top-up-order.component.scss']
})
export class TopUpOrderComponent extends ADestroyerDirective implements OnInit {
  public formGroup!: FormGroup<TopUpForm>;
  public isLoading: boolean = false;

  public readonly minUsdDeposit: number = 100;
  public readonly topUpFee: number = 0;

  public paymentMethods: KeyValue<string, string>[] = [
    {
      key: 'USDT (TRC20)',
      value: 'usdt-trc-20'
    },
    {
      key: 'BTC',
      value: 'BTC'
    },
    {
      key: 'ETH',
      value: 'ETH'
    },
    {
      key: 'LTC',
      value: 'LTC'
    }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService
  ) {
    super()
  }

  ngOnInit() {
    this.initForm(this.paymentMethods[0].value, 100);
  }

  public onSubmit(): void {
    this.getOrder();
  }

  private initForm(initialPaymentMethod: string | null, initialAmount: number): void {
    this.formGroup = new FormGroup<TopUpForm>({
      paymentMethod: new FormControl(initialPaymentMethod, [Validators.required]),
      amount: new FormControl(initialAmount, [Validators.required]),
    })
  }

  private getOrder(): void {
    this.isLoading = true;
    this.subs.add(
      this.apiService.getOrder(this.formGroup.getRawValue())
        .subscribe({
          next: ({id}: any) => {
            this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.TOP_UP}/${TopUpRoute.ORDER}/${id}`]);
          },
          error: () => {
            this.toastService.show({
              i18nKey: 'errors.errorOccurred',
              type: "error",
              duration: 5000
            });
            this.isLoading = false;
          }
        })
    )
  }

}

