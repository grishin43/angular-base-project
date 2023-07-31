import {IExchangeBalanceModel} from "../../../../../../../../common/models/domain/models";
import {BalanceRow} from "../../pages/wallets-list/wallets-list.component";
import {CryptoPriceResponse} from "../../../../../../../../common/models/coinapi-response.model";

export const mapExchangeBalanceRate = (rows: BalanceRow[], rates: CryptoPriceResponse[]): BalanceRow[] => {
  rates.forEach((rate: CryptoPriceResponse) => {
    const matchRow: BalanceRow | undefined = rows.find((row: BalanceRow) => row.currency.toLowerCase() == rate.symbol.toLowerCase());
    if (matchRow) {
      matchRow.marketPrice = parseFloat(rate.price).toFixed(5);
      matchRow.usdPrice = (parseFloat(rate.price) * parseFloat(matchRow.quantity)).toFixed(2);
    }
  })
  return rows;
}

export const mapExchangeBalance = (exchangeBalance: IExchangeBalanceModel): BalanceRow[] => {
  const formatValue = (value: number, fraction = 2) => {
    return (value || 0).toFixed(fraction);
  }
  return exchangeBalance.currencies.map((c) => {
    return {
      icon: `assets/images/${c.type.toLowerCase()}.png`,
      currency: c.type,
      quantity: formatValue(c.balance, 5),
      usdPrice: formatValue(c.balance)
    }
  })
}
