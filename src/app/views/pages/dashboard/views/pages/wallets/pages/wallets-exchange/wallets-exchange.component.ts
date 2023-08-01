import {Component, OnInit} from '@angular/core';
import {AnimationsHelper} from "../../../../../../../../common/helpers/animations.helper";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {ToastService} from "../../../../../../../../services/toast/toast.service";
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";
import {Router} from "@angular/router";
import {environment} from "../../../../../../../../../environments/environment";
import {AuthService} from "../../../../../../../../services/auth/auth.service";
import {BalanceCurrency} from "../../../../../../../../common/models/domain/models";
import {startWith} from "rxjs";
import {ApiService} from "../../../../../../../../services/api/api.service";
import {TickerModel} from "../../../../../../../../common/models/ticker.model";

export interface ExchangeForm {
  fromCurrency: FormControl<string | null>;
  fromNetwork: FormControl<string | null>;
  fromAmount: FormControl<number | null>;
  toCurrency: FormControl<string | null>;
  toNetwork: FormControl<string | null>;
  toAmount: FormControl<number | null>;
  fromExchangeRate: FormControl<number | null>;
  toExchangeRate: FormControl<number | null>;
}

@Component({
  selector: 'app-wallets-exchange',
  templateUrl: './wallets-exchange.component.html',
  styleUrls: ['./wallets-exchange.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class WalletsExchangeComponent extends ADestroyerDirective implements OnInit {
  public formGroup!: FormGroup<ExchangeForm>;
  public isLoading!: boolean;
  public isSuccessfull!: boolean;
  public paymentMethods!: BalanceCurrency[];
  public availableBalanceFrom = 0;
  public availableBalanceTo = 0;
  public tickers: TickerModel[];

  constructor(
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    super();
    this.paymentMethods = this.authService.paymentMethods;
  }

  ngOnInit() {
    this.initForm();
    this.subCurrencyFromValueChanges();
    this.subCurrencyToValueChanges();
    this.patchInitialPaymentMethods();
    this.searchTickers();
  }

  public get toExchangeRate(): number | null | undefined {
    return this.formGroup.get('toExchangeRate')?.value || 0;
  }

  public get fromCurrency(): string | null | undefined {
    return this.formGroup.get('fromCurrency')?.value;
  }

  public get toCurrency(): string | null | undefined {
    return this.formGroup.get('toCurrency')?.value;
  }

  private patchInitialPaymentMethods(): void {
    this.formGroup.get('fromCurrency')?.patchValue(this.paymentMethods[0].type);
    this.formGroup.get('toCurrency')?.patchValue(this.paymentMethods[1].type);
  }

  private searchTickers(): void {
    this.isLoading = true;
    this.subs.add(
      this.apiService.searchTickers()
        .subscribe({
          next: (res: TickerModel[]) => {
            this.tickers = res;
            this.isLoading = false;
            this.subFromAmountChanges();
          },
          error: () => {
            this.isLoading = false;
          }
        })
    )
  }

  private subCurrencyFromValueChanges(): void {
    this.subs.add(
      this.formGroup.get('fromCurrency')?.valueChanges
        .subscribe({
          next: (token: string | null) => {
            if (token) {
              const matchToken: BalanceCurrency | undefined = this.authService.account.exchangeBalance.currencies.find((c) => c.type === token);
              this.availableBalanceFrom = matchToken?.balance || 0;
              this.formGroup.get('fromNetwork')?.patchValue(matchToken?.network as string);
            } else {
              this.availableBalanceFrom = 0;
              this.formGroup.get('fromNetwork')?.patchValue(null);
            }
            this.calcPrice();
          }
        })
    )
  }

  private subCurrencyToValueChanges(): void {
    this.subs.add(
      this.formGroup.get('toCurrency')?.valueChanges
        .subscribe({
          next: (token: string | null) => {
            if (token) {
              const matchToken: BalanceCurrency | undefined = this.authService.account.exchangeBalance.currencies.find((c) => c.type === token);
              this.availableBalanceTo = matchToken?.balance || 0;
              this.formGroup.get('toNetwork')?.patchValue(matchToken?.network as string);
            } else {
              this.availableBalanceTo = 0;
              this.formGroup.get('toNetwork')?.patchValue(null);
            }
            this.calcPrice();
          }
        })
    )
  }

  private subFromAmountChanges(): void {
    this.subs.add(
      this.formGroup.get('fromAmount')?.valueChanges
        .pipe(
          startWith(null)
        )
        .subscribe({
          next: (fromAmount: number | null) => {
            this.calcPrice();
          }
        })
    )
  }

  private calcPrice(): void {
    const fromTicker = this.tickers?.find((t) => t.symbol.startsWith(this.fromCurrency as string));
    const toTicker = this.tickers?.find((t) => t.symbol.startsWith(this.toCurrency as string));
    const x = this.formGroup.get('fromAmount')?.value as number * (fromTicker?.customDirectPrice || 0);
    const y = x / (toTicker?.customDirectPrice || 1);
    this.formGroup.get('toAmount')?.patchValue(y);
    this.formGroup.get('fromExchangeRate')?.patchValue(fromTicker?.customDirectPrice || 0);
    this.formGroup.get('toExchangeRate')?.patchValue(toTicker?.customDirectPrice || 0);
  }

  private initForm(): void {
    this.formGroup = new FormGroup<ExchangeForm>({
      fromCurrency: new FormControl(null, [Validators.required]),
      fromNetwork: new FormControl(null, [Validators.required]),
      fromAmount: new FormControl(0, [Validators.required]),
      toCurrency: new FormControl(null, [Validators.required]),
      toNetwork: new FormControl(null, [Validators.required]),
      toAmount: new FormControl(0, [Validators.required]),
      fromExchangeRate: new FormControl(null, [Validators.required]),
      toExchangeRate: new FormControl(null, [Validators.required])
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const {toAmount, ...body} = this.formGroup.value;
      this.subs.add(
        this.apiService.balanceTransactionTransfer(this.authService.account.id, body)
          .subscribe({
            next: () => {
              this.isSuccessfull = true;
            },
            error: (err) => {
              this.toastService.show({
                i18nKey: err?.error?.message || 'errors.errorOccurred',
                type: "error",
                duration: 5000
              });
              this.isLoading = false;
            }
          })
      )
    } else {
      this.toastService.show({
        i18nKey: 'errors.fillAllRequiredFields',
        type: "error",
        duration: 5000
      });
    }
  }

  public backToProfile(): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}`]);
  }

}
