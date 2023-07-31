import {EWalletCurrency, EWalletNetwork} from './wallet.model';
import {IAccountModel} from "./account.model";

export type BalanceCurrency = {
  type: EWalletCurrency;
  network: EWalletNetwork;
  balance: number;
}

export interface IExchangeBalance {
  id: string;
  accountId: string;
  currencies: BalanceCurrency[],
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IStakingBalance {
  id: string;
  accountId: string;
  currencies: BalanceCurrency[],
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IExchangeBalanceModel extends IExchangeBalance {
  account: IAccountModel;
}

export interface IStakingBalanceModel extends IStakingBalance {
  account: IAccountModel;
}

export enum EBalanceTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
}

export enum EBalanceTransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface IBalanceTransaction {
  id: string;
  accountId: string;
  amount: number;
  type: EBalanceTransactionType;
  status: EBalanceTransactionStatus;
  currency: EWalletCurrency;
  network: EWalletNetwork;
  from: string;
  to: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IBalanceTransactionModel extends IBalanceTransaction {
  account: IAccountModel;
}
