import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, delay, map, Observable, of, tap} from "rxjs";
import {ISessionCreateDTO} from "../../common/models/domain/dto/session.dto";
import {
  EBalanceTransactionStatus,
  IAccountModel,
  IBalanceTransaction, IBalanceTransactionModel, IExchangeBalanceModel,
  IWallet
} from "../../common/models/domain/models";
import {environment} from "../../../environments/environment";
import {IAccountCreate} from "../../common/models/account.model";
import {CryptoPriceResponse} from "../../common/models/coinapi-response.model";
import {BalanceWithdraw} from "../../common/models/balance.model";
import {ISearchResponseDTO} from "../../common/models/domain/dto/search.dto";
import {TickerModel} from "../../common/models/ticker.model";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class ApiService {
  protected api: string = environment.apiDomain;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  public signIn({email, password}: ISessionCreateDTO): Observable<IAccountModel> {
    return this.http.post<IAccountModel>(`${this.api}/account/login`, {email, password});
  }

  public signUp(body: IAccountCreate): Observable<IAccountModel> {
    return this.http.post<IAccountModel>(`${this.api}/account/signUP`, body);
  }

  public doBalanceWithdraw(body: BalanceWithdraw, accountId: string): Observable<void> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.post<void>(`${this.api}/balance-transaction/withdraw/${accountId}`, body, {headers});
  }

  public generateAddress(currency: string, network: string, accountId: string): Observable<IWallet> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.get<IWallet>(`${this.api}/wallet/generate-address?currency=${currency}&network=${network}`, {headers});
  }

  public createTransaction(body: any, accountId: string): Observable<IBalanceTransaction> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.post<IBalanceTransaction>(`${this.api}/balance-transaction/deposit/${accountId}`, body, {headers});
  }

  public findTransaction(id: string, accountId: string): Observable<IBalanceTransaction> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.get<IBalanceTransaction>(`${this.api}/balance-transaction/${id}`, {headers});
  }

  public searchTransactions(accountId: string): Observable<ISearchResponseDTO<IBalanceTransactionModel>> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.get<ISearchResponseDTO<IBalanceTransactionModel>>(`${this.api}/balance-transaction?filter[accountId]=${accountId}&sort[createdAt]=desc`, {headers});
  }

  public balanceTransactionTransfer(accountId: string, body: any): Observable<void> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.post<void>(`${this.api}/balance-transaction/transfer/${accountId}`, body, {headers});
  }

  public getExchangeBalance(accountId: string): Observable<IExchangeBalanceModel> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.get<IExchangeBalanceModel>(`${this.api}/account/exchange-balance/${accountId}`, {headers})
      .pipe(
        tap((exchangeBalance: IExchangeBalanceModel) => this.authService.patchExchangeBalance(exchangeBalance))
      )
  }

  public searchTickers(): Observable<TickerModel[]> {
    return this.http.get<TickerModel[]>(`${this.api}/ticker`);
  }

}
