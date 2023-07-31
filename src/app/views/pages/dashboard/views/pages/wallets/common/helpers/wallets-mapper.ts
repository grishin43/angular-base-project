import {IExchangeBalanceModel} from "../../../../../../../../common/models/domain/models";
import {BalanceRow} from "../../pages/wallets-list/wallets-list.component";
import {CoinapiRateResponse} from "../../../../../../../../common/models/coinapi-response.model";

export const mapExchangeBalanceRate = (rows: BalanceRow[], rates: CoinapiRateResponse[]): BalanceRow[] => {
  rates.forEach((rate: CoinapiRateResponse) => {
    const matchRow: BalanceRow | undefined = rows.find((row: BalanceRow) => row.currency.toLowerCase() == rate.asset_id_base.toLowerCase());
    if (matchRow) {
      matchRow.marketPrice = rate.rate.toFixed(5);
      matchRow.usdPrice = (rate.rate * parseFloat(matchRow.quantity)).toFixed(2);
    }
  })
  return rows;
}

export const mapExchangeBalance = (exchangeBalance: IExchangeBalanceModel): BalanceRow[] => {
  const formatValue = (value: number, fraction = 2) => {
    return (value || 0).toFixed(fraction);
  }
  return [
    {
      icon: 'assets/images/1.png',
      currency: 'USDT',
      quantity: formatValue(exchangeBalance.USDT, 5),
      usdPrice: formatValue(exchangeBalance.USDT)
    },
    {
      icon: 'assets/images/2.png',
      currency: 'BTC',
      quantity: formatValue(exchangeBalance.BTC, 5),
      usdPrice: formatValue(exchangeBalance.BTC)
    },
    {
      icon: 'assets/images/33.png',
      currency: 'ETH',
      quantity: formatValue(exchangeBalance.ETH, 5),
      usdPrice: formatValue(exchangeBalance.ETH)
    },
    {
      icon: 'assets/images/9.png',
      currency: 'XRP',
      quantity: formatValue(exchangeBalance.XRP, 5),
      usdPrice: formatValue(exchangeBalance.XRP)
    },
    {
      icon: 'assets/images/bnb.png',
      currency: 'BNB',
      quantity: formatValue(exchangeBalance.BNB, 5),
      usdPrice: formatValue(exchangeBalance.BNB)
    },
    {
      icon: 'assets/images/ltc.png',
      currency: 'LTC',
      quantity: formatValue(exchangeBalance.LTC, 5),
      usdPrice: formatValue(exchangeBalance.LTC)
    }
  ]
}
