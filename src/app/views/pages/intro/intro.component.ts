import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api/api.service";
import {ADestroyerDirective} from "../../../common/abstracts/a-destroyer.directive";
import {TickerModel} from "../../../common/models/ticker.model";
import {map} from "rxjs";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent extends ADestroyerDirective implements OnInit {
  public tickers: TickerModel[];

  constructor(
    private apiService: ApiService
  ) {
    super()
  }

  ngOnInit() {
    this.subs.add(
      this.apiService.searchTickers()
        .pipe(
          map((res: TickerModel[]) => {
            return res.map((ticker: TickerModel) => {
              return {
                ...ticker,
                symbol: ticker.symbol === 'USDTUSD'
                  ? 'USDT'
                  : ticker.symbol.replace('USDT', '')
              }
            })
          })
        )
        .subscribe({
          next: (res: TickerModel[]) => {
            this.tickers = res || [];
          }
        })
    )
  }

}
