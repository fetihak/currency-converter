import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, catchError, forkJoin, of } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { popularCurrencies } from '../../../../shared/models/data';
@Component({
  selector: 'app-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})

export class CurrencyCardComponent implements OnInit ,OnDestroy {
  baseCurrency: string = '';

  baseAmount: number = 0;

  targetCurrency: string = '';

  convertedValues: { fromCurrency: string; toCurrency: string; convertedAmount: number }[] = [];


  private subscriptions = new Subscription();
  constructor(private currencyService:CurrencyService) { }

  ngOnInit(): void {
    this.getBaseData()
    this.fetchConversionRate();
  }
  fetchConversionRate() {
    const conversionObservables = popularCurrencies.map(currency => 
      this.currencyService.convertCurrency(1, this.baseCurrency, currency).pipe(
        catchError(error => {
          console.error(`Error converting ${this.baseCurrency} to ${currency}:`, error);
          return of(null); // Handle error to keep the stream alive
        })
      )
    );
  
    forkJoin(conversionObservables).subscribe(results => {
      results.forEach((conversionResult, index) => {
        if (conversionResult !== null) {
          const currency = popularCurrencies[index];
          this.convertedValues.push({
            fromCurrency: this.baseCurrency,
            toCurrency: currency,
            convertedAmount: conversionResult
          });
        }
      });
    });
  }
  getBaseData(): void {
    this.subscriptions.add(
      this.currencyService.baseCurrency$.subscribe((currency) => {
        this.baseCurrency = currency;
      })
    );

    this.subscriptions.add(
      this.currencyService.baseAmount$.subscribe((amount) => {
        this.baseAmount = amount;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
