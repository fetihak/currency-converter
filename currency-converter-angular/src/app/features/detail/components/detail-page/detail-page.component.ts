import { Subscription, map } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  fromCurrencyFullName: string = '';
  baseCurrency: string = '';
  subscriptions: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.getCurrencyNames();
    this.subscriptions.add(
      this.currencyService.baseCurrency$.subscribe((currency) => {
        this.baseCurrency = currency;
      })
    );
  }
  getCurrencyNames() {
    this.subscriptions.add(
      this.currencyService
        .getCurrencyNames()
        .pipe(map((data) => data.symbols[this.baseCurrency]))
        .subscribe((name) => {
          this.fromCurrencyFullName = name;
        })
    );
  }
}
