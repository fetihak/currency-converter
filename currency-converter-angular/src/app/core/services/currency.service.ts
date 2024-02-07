import { Currency } from './../../shared/models/Currency';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

type ExchangeRateRecord = Record<string, number>;

interface ExchangeRates {
  [key: string]: ExchangeRateRecord;
}


@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  

  private mockResponse = {
    success: true,
    timestamp: Date.now(),
    base: 'EUR',
    date: '2023-02-22',
    rates: {
      USD: 1.12,
      GBP: 0.86,
      EUR: 1,
      JPY: 129.53,
    },
  };
  private exchangeRates: ExchangeRates = {
    USD: { EUR: 0.92, GBP: 0.77, JPY: 108.57 },
    EUR: { USD: 1.09, GBP: 0.84, JPY: 118.49 },
    GBP: { EUR: 1.19, USD: 1.30, JPY: 140.93 },
    JPY: { USD: 0.0092, GBP: 0.0071, EUR: 0.0084 },
    // More currencies...
  };
  constructor(private http: HttpClient) {}

  
  getLatestRates(): Observable<Currency> {
    return of(this.mockResponse)
  }
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    return new Observable<number>(subscriber => {
      const fromRates = this.exchangeRates[fromCurrency];
      if (!fromRates) {
        subscriber.error(new Error(`Unsupported source currency: ${fromCurrency}`));
        return;
      }

      const rate = fromRates[toCurrency];
      if (rate === undefined) {
        subscriber.error(new Error(`Unsupported target currency: ${toCurrency}`));
        return;
      }

      const convertedAmount = amount * rate;

      delay(1000).then(() => { // Simulating network delay
        subscriber.next(convertedAmount);
        subscriber.complete();
      });
    });
  }

 
}
