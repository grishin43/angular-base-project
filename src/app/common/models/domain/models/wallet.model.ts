export enum EWalletCurrency {
  USDT = 'USDT',
  BTC = 'BTC',
  ETH = 'ETH',
  XRP = 'XRP',
  BNB = 'BNB',
  LTC = 'LTC',
}

export enum EWalletNetwork {
  TRC20 = 'TRC20',
  Bitcoin = 'Bitcoin',
  Etherum = 'Etherum',
  Solana = 'Solana',
  StartChain = 'StartChain',
  Litecoin = 'Litecoin',
}

export interface IWallet {
  id: string;
  name: string;
  address: string;
  currency: EWalletCurrency;
  network: EWalletNetwork;
  balance: number;
  isBusy: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IWalletModel extends IWallet {

}
