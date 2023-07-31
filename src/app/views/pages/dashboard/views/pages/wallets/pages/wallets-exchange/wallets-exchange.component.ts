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
import {combineLatest} from "rxjs";
import {ApiService} from "../../../../../../../../services/api/api.service";
import {CryptoPriceResponse} from "../../../../../../../../common/models/coinapi-response.model";

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

  public readonly exchangeFee: number = environment.exchangeFee;

  public paymentMethods!: BalanceCurrency[];
  public availableBalanceFrom = 0;
  public availableBalanceTo = 0;

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
    this.subCurrencyValuesChanges();
    this.subCurrencyFromValueChanges();
    this.subCurrencyToValueChanges();
    this.patchInitialPaymentMethods();
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

  private subCurrencyValuesChanges(): void {
    this.subs.add(
      combineLatest([
        this.formGroup.get('fromCurrency')?.valueChanges,
        this.formGroup.get('toCurrency')?.valueChanges
      ]).subscribe({
        next: (res: any) => {
          const [fromCurrency, toCurrency] = res;
          this.patchCurrenciesPairs(fromCurrency, toCurrency);
        }
      })
    )
  }

  private patchCurrenciesPairs(fromCurrency: string, toCurrency: string): void {
    this.isLoading = true;
    this.subs.add(
      this.apiService.getExchangeRate(fromCurrency, toCurrency)
        .subscribe({
          next: (res: CryptoPriceResponse) => {
            this.formGroup.get('toExchangeRate')?.patchValue(parseFloat(res.price));
            this.isLoading = false;
          },
          error: () => {
            this.patchCurrenciesPairs(toCurrency, fromCurrency);
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
              this.availableBalanceFrom = this.authService.account.exchangeBalance[token] || 0;
              this.formGroup.get('fromAmount')?.patchValue(this.availableBalanceFrom);
            } else {
              this.availableBalanceFrom = 0;
              this.formGroup.get('fromAmount')?.patchValue(0);
            }
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
              this.availableBalanceTo = this.authService.account.exchangeBalance[token] || 0;
              this.formGroup.get('toAmount')?.patchValue(this.availableBalanceTo);
            } else {
              this.availableBalanceTo = 0;
              this.formGroup.get('toAmount')?.patchValue(0);
            }
          }
        })
    )
  }

  private initForm(): void {
    this.formGroup = new FormGroup<ExchangeForm>({
      fromCurrency: new FormControl(null, [Validators.required]),
      fromNetwork: new FormControl(null, [Validators.required]),
      fromAmount: new FormControl(null, [Validators.required]),
      toCurrency: new FormControl(null, [Validators.required]),
      toNetwork: new FormControl(null, [Validators.required]),
      toAmount: new FormControl(null, [Validators.required]),
      fromExchangeRate: new FormControl(null, [Validators.required]),
      toExchangeRate: new FormControl(null, [Validators.required])
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isSuccessfull = true;
      }, 750);
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
