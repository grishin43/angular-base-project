import {Injectable} from '@angular/core';
import {BalanceCurrency, IAccountModel} from "../../common/models/domain/models";
import {Router} from "@angular/router";
import {AppRoute} from "../../common/enums/app-route.enum";
import {LocalStorageService} from "../local-storage/local-storage.service";
import {LocalStorageKey} from "../local-storage/local-storage-key.enum";

@Injectable()
export class AuthService {
  public account!: IAccountModel;

  constructor(
    private localstorageService: LocalStorageService,
    private router: Router
  ) {
    this.setCachedAccount();
  }

  private setCachedAccount(): void {
    this.account = this.localstorageService.getItem(LocalStorageKey.ACCOUNT);
  }

  public get paymentMethods(): BalanceCurrency[] {
    return (this.account && this.account.exchangeBalance.currencies) || [];
  }

  public signIn(account: IAccountModel): void {
    this.localstorageService.setItem(LocalStorageKey.ACCOUNT, account);
    this.account = account;
    this.router.navigate([`/${AppRoute.DASHBOARD}`]);
  }

  public signOut(): void {
    this.localstorageService.clear();
    this.account = undefined as unknown as IAccountModel;
    this.router.navigate([`/${AppRoute.INTRO}`]);
  }

}
