import { Currency } from './../../shared/models/Currency';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  private apiUrl = 'http://data.fixer.io/api';
  private accessKey = '01cfaa03cff04eca0c56aba0cec41905';
 

  private baseCurrency = new BehaviorSubject<string>('EUR');
  private targetCurrency = new BehaviorSubject<string>('USD');
  private baseAmount = new BehaviorSubject<number>(1);

  baseCurrency$ = this.baseCurrency.asObservable();
  targetCurrency$ = this.targetCurrency.asObservable();
  baseAmount$ = this.baseAmount.asObservable();

  setBaseCurrency(currency: string) {
    this.baseCurrency.next(currency);
  }

  setTargetCurrency(currency: string) {
    this.targetCurrency.next(currency);
  }

  setBaseAmount(amount: number) {
    this.baseAmount.next(amount);
  }
  constructor(private http: HttpClient) {}

  
  getLatestRates(): Observable<Currency> {
    const url = `${this.apiUrl}/latest?access_key=${this.accessKey}`;
    return this.http.get<Currency>(url).pipe(shareReplay(1));
  }
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    return this.getLatestRates().pipe(
      
      map((data: any) => {
        if (data && data.rates) {
          const fromRate = data.rates[fromCurrency];
          const toRate = data.rates[toCurrency];
          const euroAmount =
            fromCurrency === 'EUR' ? amount : amount / fromRate;
          const convertedAmount =
            toCurrency === 'EUR' ? euroAmount : euroAmount * toRate;
          return convertedAmount;
        }
        throw new Error('Unable to convert currency.');
      })
    )
  }

 
}
