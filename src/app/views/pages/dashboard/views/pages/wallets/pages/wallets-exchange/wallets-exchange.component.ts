import {Component, OnInit} from '@angular/core';
import {AnimationsHelper} from "../../../../../../../../common/helpers/animations.helper";
import {KeyValue} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {ToastService} from "../../../../../../../../services/toast/toast.service";
import {AppRoute} from "../../../../../../../../common/enums/app-route.enum";
import {Router} from "@angular/router";
import {environment} from "../../../../../../../../../environments/environment";

export interface ExchangeForm {
  currencyFrom: FormControl<string | null>;
  currencyFromCount: FormControl<number | null>;
  currencyTo: FormControl<string | null>;
  currencyToCount: FormControl<number | null>;
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
  public availableBalanceFrom = 0;
  public availableBalanceTo = 0;

  constructor(
    private toastService: ToastService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.initForm(this.paymentMethods[0].value, this.paymentMethods[1].value);
  }

  private initForm(initialFrom: string | null, initialTo: string | null): void {
    this.formGroup = new FormGroup<ExchangeForm>({
      currencyFrom: new FormControl(initialFrom, [Validators.required]),
      currencyFromCount: new FormControl(0, [Validators.required]),
      currencyTo: new FormControl(initialTo, [Validators.required]),
      currencyToCount: new FormControl(100, [Validators.required]),
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
