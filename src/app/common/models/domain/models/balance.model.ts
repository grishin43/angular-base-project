import {EWalletCurrency} from './wallet.model';
import {IAccountModel} from "./account.model";

export interface IExchangeBalance {
  id: string;
  accountId: string;
  USDT: number;
  BTC: number;
  ETH: number;
  XRP: number;
  BNB: number;
  LTC: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IStakingBalance {
  id: string;
  accountId: string;
  USDT: number;
  BTC: number;
  ETH: number;
  XRP: number;
  BNB: number;
  LTC: number;
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
  from: string;
  to: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IBalanceTransactionModel extends IBalanceTransaction {
  account: IAccountModel;
}
