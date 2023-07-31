import {Component, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../../../../../common/abstracts/a-destroyer.directive";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../../../../../../../services/api/api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TopUpRoute} from "../../../common/enums/top-up-route.enum";
import {DashboardRoute} from "../../../../../../common/enums/dashboard-route.enum";
import {AppRoute} from "../../../../../../../../../common/enums/app-route.enum";
import {ToastService} from "../../../../../../../../../services/toast/toast.service";
import {environment} from "../../../../../../../../../../environments/environment";
import {AuthService} from "../../../../../../../../../services/auth/auth.service";
import {BalanceCurrency, IBalanceTransaction, IWallet} from "../../../../../../../../../common/models/domain/models";
import {catchError, switchMap, throwError} from "rxjs";

export interface TopUpForm {
  currency: FormControl<string | null>;
  network: FormControl<string | null>;
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
  public paymentMethods!: BalanceCurrency[];
  public availableNetworks: string[];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    super()
    this.paymentMethods = this.authService.paymentMethods;
  }

  ngOnInit() {
    this.initForm();
    this.subCurrencyValueChanges();
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

  private subCurrencyValueChanges(): void {
    this.subs.add(
      this.formGroup.get('currency')?.valueChanges
        .subscribe({
          next: (token: string | null) => {
            if (token) {
              const matchNetwork = this.paymentMethods.find((pm: BalanceCurrency) => pm.type === token)?.network;
              if (matchNetwork) {
                this.availableNetworks = [matchNetwork];
                this.formGroup.get('network')?.patchValue(matchNetwork);
              }
            } else {
              this.availableNetworks = [];
            }
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
    this.formGroup = new FormGroup<TopUpForm>({
      currency: new FormControl(null, [Validators.required]),
      network: new FormControl(null, [Validators.required]),
      amount: new FormControl(this.minUsdDeposit, [Validators.required, Validators.min(this.minUsdDeposit)]),
    })
  }

  private getOrder(): void {
    this.isLoading = true;
    const {currency, network, amount} = this.formGroup.value;
    this.subs.add(
      this.apiService.generateAddress(currency as string, network as string, this.authService.account.id)
        .pipe(
          catchError((err) => {
            this.toastService.show({
              i18nKey: 'errors.errorOccurred',
              type: "error",
              duration: 5000
            });
            this.isLoading = false;
            return throwError(err);
          }),
          switchMap((wallet: IWallet) => this.apiService.createTransaction({
            currency: wallet.currency,
            network: wallet.network,
            amount: amount,
            to: wallet.address
          }, this.authService.account.id))
        )
        .subscribe({
          next: (transaction: IBalanceTransaction) => {
            if (transaction) {
              this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.TOP_UP}/${TopUpRoute.ORDER}/${transaction.id}`])
                .then(() => {
                  this.isLoading = false;
                })
            } else {
              this.toastService.show({
                i18nKey: 'errors.errorOccurred',
                type: "error",
                duration: 5000
              });
              this.isLoading = false;
            }
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

