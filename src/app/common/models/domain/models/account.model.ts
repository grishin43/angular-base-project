import {IBalanceTransactionModel, IExchangeBalanceModel, IStakingBalanceModel} from "./balance.model";

export interface IAccount {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isMFA: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IAccountModel extends IAccount {
  balanceTransactions: IBalanceTransactionModel[];
  exchangeBalance: IExchangeBalanceModel;
  stakingBalance: IStakingBalanceModel;
}
