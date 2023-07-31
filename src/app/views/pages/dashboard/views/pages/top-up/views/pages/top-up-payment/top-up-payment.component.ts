import {Component, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../../../../../common/abstracts/a-destroyer.directive";
import {ApiService} from "../../../../../../../../../services/api/api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {interval, switchMap, takeWhile, tap} from "rxjs";
import {DateHelper} from "../../../../../../../../../common/helpers/date.helper";
import {environment} from "../../../../../../../../../../environments/environment";
import {AnimationsHelper} from "../../../../../../../../../common/helpers/animations.helper";
import {AppRoute} from "../../../../../../../../../common/enums/app-route.enum";
import {DashboardRoute} from "../../../../../../common/enums/dashboard-route.enum";
import {TopUpRoute} from "../../../common/enums/top-up-route.enum";
import {ToastService} from "../../../../../../../../../services/toast/toast.service";
import {EBalanceTransactionStatus, IBalanceTransaction} from "../../../../../../../../../common/models/domain/models";
import {AuthService} from "../../../../../../../../../services/auth/auth.service";
import QRCode from 'qrcode'

@Component({
  selector: 'app-top-up-payment',
  templateUrl: './top-up-payment.component.html',
  styleUrls: ['./top-up-payment.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class TopUpPaymentComponent extends ADestroyerDirective implements OnInit {
  public id!: string;
  public order!: IBalanceTransaction;
  public isLoading = true;
  public isAccepted!: boolean;
  public dateFullFormat: string = DateHelper.fullFormat;
  public clock: string = '--:--:--';
  public transactionStatus = EBalanceTransactionStatus;
  public qrCode!: string;

  public readonly interval: number = 10000;
  public readonly supportLink: string = environment.supportLink;
  public readonly transactionTimeInHours: number = environment.transactionTimeInHours || 2;
  public readonly topUpFee = environment.topUpFee;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subOrder();
    this.checkTransaction();
  }

  public cancelOrder(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.TOP_UP}/${TopUpRoute.ORDER}`])
        .then(() => {
          this.toastService.show({
            i18nKey: 'common.orderCanceled',
            type: "success",
            duration: 5000
          });
        });
    }, 500);
  }

  public backToProfile(): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}`]);
  }

  private checkTransaction(): void {
    this.subs.add(
      interval(this.interval)
        .pipe(
          switchMap(() => this.apiService.findTransaction(this.id, this.authService.account.id)),
          tap((res: IBalanceTransaction) => {
            if (res.status === EBalanceTransactionStatus.ACCEPTED) {
              this.isLoading = true;
              this.isAccepted = true;
            } else if (res.status === EBalanceTransactionStatus.DECLINED) {
              this.errorHandler('errors.errorOccurred');
            }
          }),
          takeWhile((res: IBalanceTransaction) => res.status !== EBalanceTransactionStatus.ACCEPTED),
        ).subscribe()
    )
  }

  private subOrder(): void {
    this.subs.add(
      this.activatedRoute.paramMap
        .pipe(
          tap((paramMap: ParamMap) => {
            this.id = paramMap.get('id') as string
          }),
          switchMap((paramMap: ParamMap) => this.apiService.findTransaction(paramMap.get('id') as string, this.authService.account.id))
        )
        .subscribe({
          next: (order: IBalanceTransaction) => {
            if (order) {
              QRCode.toDataURL(order.to)
                .then((url: string) => {
                  this.qrCode = url;
                })
                .catch(err => {
                  this.errorHandler('errors.errorOccurred');
                })
              if (order.createdAt) {
                const timeDiffInMs: number = Math.abs(new Date().getTime() - new Date(order.createdAt).getTime());
                const timeLimitInMs: number = this.transactionTimeInHours * 60 * 60 * 1000;
                if (timeLimitInMs > timeDiffInMs) {
                  const timeLostInMs: number = timeLimitInMs - timeDiffInMs;
                  this.countdownTimer(timeLostInMs);
                  this.order = order;
                  this.isLoading = false;
                } else {
                  this.errorHandler('errors.transactionTimeoutExpired');
                }
              }
            } else {
              this.errorHandler('errors.errorOccurred');
            }
          },
          error: () => {
            this.errorHandler('errors.errorOccurred');
            this.isLoading = false;
          }
        })
    )
  }

  private countdownTimer = (timeLostInMs: number) => {
    const cb = () => {
      timeLostInMs -= 1000;
      if (timeLostInMs <= 0) {
        clearInterval(interval);
        this.clock = "00:00:00";
        this.errorHandler('errors.transactionTimeoutExpired');
      } else {
        this.clock = DateHelper.formatTime(timeLostInMs);
      }
    }
    const interval = setInterval(cb, 1000);
    cb();
  }

  private errorHandler(errorKey: string): void {
    this.router.navigate([`/${AppRoute.DASHBOARD}/${DashboardRoute.TOP_UP}/${TopUpRoute.ORDER}`])
      .then(() => {
        this.toastService.show({
          i18nKey: errorKey,
          type: "error",
          duration: 5000
        });
      })
  }

}
