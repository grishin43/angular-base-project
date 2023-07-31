import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, delay, map, Observable, of} from "rxjs";
import {ISessionCreateDTO} from "../../common/models/domain/dto/session.dto";
import {
  EBalanceTransactionStatus,
  IAccountModel,
  IBalanceTransaction, IBalanceTransactionModel,
  IWallet
} from "../../common/models/domain/models";
import {environment} from "../../../environments/environment";
import {IAccountCreate} from "../../common/models/account.model";
import {CryptoPriceResponse} from "../../common/models/coinapi-response.model";
import {BalanceWithdraw} from "../../common/models/balance.model";
import {ISearchResponseDTO} from "../../common/models/domain/dto/search.dto";

@Injectable()
export class ApiService {
  protected api: string = environment.apiDomain;
  protected cryptoApiDomain: string = environment.cryptoApiDomain;

  constructor(
    private http: HttpClient
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

  public getExchangeRate(fromCurrency: string, toCurrency = 'USDT'): Observable<CryptoPriceResponse> {
    if (fromCurrency === toCurrency) {
      return of({
        symbol: toCurrency,
        price: '1.00000000'
      })
    } else {
      return this.http.get<CryptoPriceResponse>(`${this.cryptoApiDomain}/ticker/price?symbol=${toCurrency}${fromCurrency}`)
    }
  }

  public searchTransactions(accountId: string): Observable<ISearchResponseDTO<IBalanceTransactionModel>> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-account-id': accountId
    });
    return this.http.get<ISearchResponseDTO<IBalanceTransactionModel>>(`${this.api}/balance-transaction?filter[accountId]=${accountId}&sort[createdAt]=desc`, {headers});
  }

  public getOrder(body: any): Observable<any> {
    /*return this.http.get<any>(`${this.api}`, body)*/
    return of({
      id: '0b29b0e213347fde9e389f8ee0ea7a262bfadedb',
      address: 'TA21GcYGhK1vQCKdrPgtnAjs5wgK9wwb9Q',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAAC5CAIAAAD7zwkLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD30lEQVR4nO3dS26kShQA0VdPvf8tu+cMsgPlB8o6Z2obSqVQ6gpD8vn5+fkPgv+f/gB8Da1QaYVKK1RaodIKlVaotEKlFSqtUGmFSitUWqHSCpVWqLRCpRUqrVBpherPzB9/Pp9Vn2Ps1k3Bl091+duZz/zOQ82c9xbrCpVWqLRCpRWqqdn2YuFjaeNZbzy9js0Mlbd+eeZEx77JW6wrVFqh0gqVVqhWzrYX+6a58S+Pfzr+VOOBdOGRb3lqLr6wrlBphUorVFqh2jjb7rNw1lt4GffX76ZmXaHSCpVWqLRC9ZWz7czV1ZlRd2aY/QWDsHWFSitUWqHSCtXG2Xbf+LbwJtljtzfMfBsvGYStK1RaodIKlVaoVs62xx72v7h1GXfmKbV9Rx7/8ktYV6i0QqUVKq1QTc22T11P3DdUznjJxgj7WFeotEKlFSqtUH2OPb8/dmzr2Ke215q5BLzwpzOsK1RaodIKlVaoNs62+6bIW//Q3zc1j818OQu/2IWjrnWFSitUWqHSCtXUbPuPQ2/bVWDhhctjo+74vMe+nBnWFSqtUGmFSitU5/ZJOHb/6VPvbhh76lky1215gFaotEKlFapz7yWbeQDs1okuFr674dg9GAuP7LotD9AKlVaotEK18p6EhXeYvuTpqX33zI4PtfAat+u2PEArVFqh0grVudl2bOFwt28w3HeohQ+8jY88w7pCpRUqrVBpheot7yVbeDvqvkfL9u2TMHP/xrG9ca0rVFqh0gqVVqg2zrZjL3nhwsVTL9l9yTw+Zl2h0gqVVqi0QrVyf9tj/98fW7i/7cILtTMnWri97wzrCpVWqLRCpRWqjbPtwptGL77i3WLHzjv+5YWsK1RaodIKlVaozt2TsHBAe8krvxZuzTUzJnt3A6+jFSqtUGmF6txs+9TLC8aOXRJduGPvmOu2PE8rVFqh0grVxnfu7vPO7W5v+YqX7F5YV6i0QqUVKq1QTV23ferq6i3H3r8wPvLCfSGe2kTCukKlFSqtUGmFauU9CS95IdjC/bT2bc118ZKvbsy6QqUVKq1QaYVq4/22T+22te8Rr5mPcfnlY3fUepaMB2iFSitUWqF67N0NC81cxr115Kf2WBjPxcduYLCuUGmFSitUWqH6DbPtzOvC9l2ZnTnvLd5LxutohUorVFqh2jjbPvWi3IXj6szfLhw5F553hnWFSitUWqHSCtXK2fbYtgkLzzszGN76d//MY2kv2TbBukKlFSqtUGmF6iv3t+UR1hUqrVBphUorVFqh0gqVVqi0QqUVKq1QaYVKK1RaodIKlVaotEKlFSqtUGmF6i+AYEFm7kSJtQAAAABJRU5ErkJggg==',
      createdAt: '2023-07-30T21:50:54.543Z',
      paymentMethod: 'USDT (TRC20)',
      amount: 100,
      topUpFee: 0,
      totalAmount: 100,
      status: EBalanceTransactionStatus.PENDING
    }).pipe(
      delay(1500)
    )
  }

}
