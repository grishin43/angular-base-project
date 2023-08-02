import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {ToastService} from "../../../../../../../../services/toast/toast.service";
import {AuthService} from "../../../../../../../../services/auth/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ApiService} from "../../../../../../../../services/api/api.service";
import {BalanceWithdraw} from "../../../../../../../../common/models/balance.model";
import {AnimationsHelper} from "../../../../../../../../common/helpers/animations.helper";
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";
import {BalanceCurrency, IExchangeBalanceModel} from "../../../../../../../../common/models/domain/models";

export interface WithdrawForm {
  currency: FormControl<string | null>;
  network: FormControl<string | null>;
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
  public paymentMethods!: BalanceCurrency[];
  public tokenAvailableBalance: number = 0;
  public availableNetworks: string[];

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    super()
    this.paymentMethods = this.authService.paymentMethods;
  }

  ngOnInit(): void {
    this.initForm();
    this.subCurrencyValueChanges();
    this.subscribeRoute();
  }

  private subExchangeBalance(cb: (exchangeBalance: IExchangeBalanceModel) => void): void {
    this.isLoading = true;
    this.subs.add(
      this.apiService.getExchangeBalance(this.authService.account.id)
        .subscribe({
          next: (exchangeBalance: IExchangeBalanceModel) => {
            cb(exchangeBalance);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.toastService.show({
              i18nKey: 'errors.errorOccurred',
              type: "error",
              duration: 5000
            });
          }
        })
    )
  }

  private subCurrencyValueChanges(): void {
    this.subs.add(
      this.formGroup.get('currency')?.valueChanges
        .subscribe({
          next: (token: string | null) => {
            this.subExchangeBalance(
              (exchangeBalance: IExchangeBalanceModel) => {
                if (token) {
                  const matchToken: BalanceCurrency | undefined = exchangeBalance.currencies.find((c) => c.type === token);
                  this.tokenAvailableBalance = matchToken?.balance || 0;
                  const matchNetwork = this.paymentMethods.find((pm: BalanceCurrency) => pm.type === token)?.network;
                  if (matchNetwork) {
                    this.availableNetworks = [matchNetwork];
                    this.formGroup.get('network')?.patchValue(matchNetwork);
                  }
                } else {
                  this.tokenAvailableBalance = 0;
                  this.availableNetworks = [];
                }
                this.formGroup.get('amount')?.patchValue(this.tokenAvailableBalance);
              }
            )
          }
        })
    )
  }

  private subscribeRoute(): void {
    this.subs.add(
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.formGroup.get('currency')?.patchValue(params['token'] || this.paymentMethods[0].type);
      })
    );
  }

  private initForm(): void {
    this.formGroup = new FormGroup<WithdrawForm>({
      currency: new FormControl(null, [Validators.required]),
      network: new FormControl(null, [Validators.required]),
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
