import { EWalletCurrency } from './wallet.model';

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

}
export interface IStakingBalanceModel extends IStakingBalance {

}

export enum EBalanceTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum EBalanceTransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface IBalanceTransaction {
  id: string;
  type: EBalanceTransactionType;
  status: EBalanceTransactionStatus;
  currency: EWalletCurrency;
  from: string;
  to: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBalanceTransactionModel extends IBalanceTransaction {

}
