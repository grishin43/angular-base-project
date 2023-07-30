import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ADestroyerDirective} from "../../../../../../../../common/abstracts/a-destroyer.directive";
import {KeyValue} from "@angular/common";
import {ToastService} from "../../../../../../../../services/toast/toast.service";

export interface WithdrawForm {
  currency: FormControl<string | null>;
  amount: FormControl<number | null>;
  address: FormControl<string | null>;
}

@Component({
  selector: 'app-wallets-withdraw',
  templateUrl: './wallets-withdraw.component.html',
  styleUrls: ['./wallets-withdraw.component.scss']
})
export class WalletsWithdrawComponent extends ADestroyerDirective implements OnInit {
  public formGroup!: FormGroup<WithdrawForm>;
  public isLoading: boolean = false;

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
  public tokenAvailableBalance = 1;

  constructor(
    private toastService: ToastService
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm(this.paymentMethods[0].value, 100);
  }

  private initForm(initialPaymentMethod: string | null, initialAmount: number): void {
    this.formGroup = new FormGroup<WithdrawForm>({
      currency: new FormControl(initialPaymentMethod, [Validators.required]),
      amount: new FormControl(initialAmount, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
    })
  }

  public onSubmit(): void {
    this.toastService.show({
      i18nKey: 'errors.errorOccurred',
      type: "error",
      duration: 5000
    });
  }
}
