import {IExchangeBalanceModel} from "../../../../../../../../common/models/domain/models";
import {BalanceRow} from "../../pages/wallets-list/wallets-list.component";
import {TickerModel} from "../../../../../../../../common/models/ticker.model";

export const mapExchangeBalanceRate = (rows: BalanceRow[], rates: TickerModel[]): BalanceRow[] => {
  rates.forEach((rate: TickerModel) => {
    const matchRow: BalanceRow | undefined = rows.find((row: BalanceRow) => !rate.symbol.indexOf(row.currency));
    if (matchRow) {
      matchRow.marketPrice = parseFloat(String(rate.customDirectPrice)).toFixed(5);
      matchRow.usdPrice = (parseFloat(String(rate.customDirectPrice)) * parseFloat(matchRow.quantity)).toFixed(2);
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
