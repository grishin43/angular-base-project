import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {KeyValue} from "@angular/common";
import {ToastService} from "../../../../../../../../services/toast/toast.service";
import {AuthService} from "../../../../../../../../services/auth/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ApiService} from "../../../../../../../../services/api/api.service";
import {BalanceWithdraw} from "../../../../../../../../common/models/balance.model";
import {AnimationsHelper} from "../../../../../../../../common/helpers/animations.helper";
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";

export interface WithdrawForm {
  currency: FormControl<string | null>;
  amount: FormControl<number | null>;
  to: FormControl<string | null>;
}

@Component({
  selector: 'app-wallets-withdraw',
  templateUrl: './wallets-withdraw.component.html',
  styleUrls: ['./wallets-withdraw.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class WalletsWithdrawComponent extends ADestroyerDirective implements OnInit {
  public formGroup!: FormGroup<WithdrawForm>;
  public isLoading: boolean = false;
  public isSuccessfull!: boolean;
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
  public tokenAvailableBalance: number = 0;

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
    this.subCurrencyValueChanges();
    this.subscribeRoute();
  }

  private subCurrencyValueChanges(): void {
    this.subs.add(
      this.formGroup.get('currency')?.valueChanges
        .subscribe({
          next: (token: string | null) => {
            if (token) {
              this.tokenAvailableBalance = this.authService.account.exchangeBalance[token] || 0;
            } else {
              this.tokenAvailableBalance = 0;
            }
          }
        })
    )
  }

  private subscribeRoute(): void {
    this.subs.add(
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.formGroup.get('currency')?.patchValue(params['token'] || this.paymentMethods[0].value);
      })
    );
  }

  private initForm(): void {
    this.formGroup = new FormGroup<WithdrawForm>({
      currency: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      to: new FormControl(null, [Validators.required]),
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      this.subs.add(
        this.apiService.doBalanceWithdraw(this.formGroup.value as BalanceWithdraw, this.authService.account.id)
          .subscribe({
            next: () => {
              this.isSuccessfull = true;
              this.isLoading = false;
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
    } else {
      this.toastService.show({
        i18nKey: (parseFloat(String(this.formGroup.get('amount')?.value as number)) > this.tokenAvailableBalance)
          ? 'errors.amountMoreThanBalance'
          : 'errors.fillAllRequiredFields',
        i18nInterpolateParams: {
          amount: this.tokenAvailableBalance.toString()
        },
        type: "error",
        duration: 5000
      });
    }
  }

  public backToProfile(): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}`]);
  }

}
