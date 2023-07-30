export enum EWalletCurrency {
  USDT = 'USDT',
  BTC = 'BTC',
  ETH = 'ETH',
  XRP = 'XRP',
  BNB = 'BNB',
  LTC = 'LTC',
}

export interface IWallet {
  id: string;
  name: string;
  currency: EWalletCurrency;
  balance: number;
  isBusy: boolean;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IWalletModel extends IWallet {

}
