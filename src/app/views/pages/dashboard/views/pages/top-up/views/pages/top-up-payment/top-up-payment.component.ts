import {Component, OnInit} from '@angular/core';
import {ADestroyerDirective} from "../../../../../../../../../common/abstracts/a-destroyer.directive";
import {ApiService} from "../../../../../../../../../services/api/api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {DateHelper} from "../../../../../../../../../common/helpers/date.helper";
import {environment} from "../../../../../../../../../../environments/environment";
import {AnimationsHelper} from "../../../../../../../../../common/helpers/animations.helper";
import {AppRoute} from "../../../../../../../../../common/enums/app-route.enum";
import {DashboardRoute} from "../../../../../../common/enums/dashboard-route.enum";
import {TopUpRoute} from "../../../common/enums/top-up-route.enum";
import {ToastService} from "../../../../../../../../../services/toast/toast.service";
import {EBalanceTransactionStatus} from "../../../../../../../../../common/models/domain/models";

@Component({
  selector: 'app-top-up-payment',
  templateUrl: './top-up-payment.component.html',
  styleUrls: ['./top-up-payment.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class TopUpPaymentComponent extends ADestroyerDirective implements OnInit {
  public order!: any;
  public isLoading = true;
  public isAccepted!: boolean;
  public dateFullFormat: string = DateHelper.fullFormat;
  public clock: string = '--:--:--';
  public transactionStatus = EBalanceTransactionStatus;

  public readonly supportLink: string = environment.supportLink;
  public readonly transactionTimeInHours: number = environment.transactionTimeInHours || 2;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subOrder();
    setTimeout(() => {
      this.handleOrderAccepting();
    }, 3000);
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

  private subOrder(): void {
    this.subs.add(
      this.activatedRoute.paramMap
        .pipe(
          switchMap((paramMap: ParamMap) => this.apiService.getOrder(paramMap.get('id')))
        )
        .subscribe({
          next: (order: any) => {
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

  private handleOrderAccepting(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isAccepted = true;
    }, 750);
  }

}
