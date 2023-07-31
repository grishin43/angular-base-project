import {Component, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../../../../../common/abstracts/a-destroyer.directive";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {KeyValue} from "@angular/common";
import {ApiService} from "../../../../../../../../../services/api/api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TopUpRoute} from "../../../common/enums/top-up-route.enum";
import {DashboardRoute} from "../../../../../../common/enums/dashboard-route.enum";
import {AppRoute} from "../../../../../../../../../common/enums/app-route.enum";
import {ToastService} from "../../../../../../../../../services/toast/toast.service";
import {environment} from "../../../../../../../../../../environments/environment";

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

  public readonly minUsdDeposit: number = environment.minUsdDeposit;
  public readonly topUpFee: number = environment.topUpFee;

  public paymentMethods: KeyValue<string, string>[] = [
    {
      key: 'USDT (TRC20)',
      value: 'USDT'
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
      key: 'XRP',
      value: 'XRP'
    },
    {
      key: 'BNB',
      value: 'BNB'
    },
    {
      key: 'LTC',
      value: 'LTC'
    }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {
    super()
  }

  ngOnInit() {
    this.initForm();
    this.subscribeRoute();
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.getOrder();
    } else {
      this.toastService.show({
        i18nKey: (parseFloat(String(this.formGroup.get('amount')?.value as number)) < this.minUsdDeposit)
          ? 'errors.amountLowerThanMin'
          : 'errors.fillAllRequiredFields',
        i18nInterpolateParams: {
          amount: this.minUsdDeposit.toString()
        },
        type: "error",
        duration: 5000
      });
    }
  }

  private subscribeRoute(): void {
    this.subs.add(
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.formGroup.get('paymentMethod')?.patchValue(params['token'] || this.paymentMethods[0].value);
      })
    );
  }

  private initForm(): void {
    this.formGroup = new FormGroup<TopUpForm>({
      paymentMethod: new FormControl(null, [Validators.required]),
      amount: new FormControl(this.minUsdDeposit, [Validators.required, Validators.min(this.minUsdDeposit)]),
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

