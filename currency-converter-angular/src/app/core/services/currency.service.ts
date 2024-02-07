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
  private accessKey = 'ac0f5e5ecfab59a863063f383bf22e2d';
 

  private baseCurrency = new BehaviorSubject<string>('EUR');
  private targetCurrency = new BehaviorSubject<string>('USD');
  private baseAmount = new BehaviorSubject<number>(1);
  private convertedAmount = new BehaviorSubject<number>(1.08);


  baseCurrency$ = this.baseCurrency.asObservable();
  targetCurrency$ = this.targetCurrency.asObservable();
  baseAmount$ = this.baseAmount.asObservable();
  convertedAmount$ = this.convertedAmount.asObservable();

  setBaseCurrency(currency: string) {
    this.baseCurrency.next(currency);
  }

  setTargetCurrency(currency: string) {
    this.targetCurrency.next(currency);
  }

  setBaseAmount(amount: number) {
    this.baseAmount.next(amount);
  }
  setAmount(amount: number) {
    this.baseAmount.next(amount);
  }

  constructor(private http: HttpClient) {}

  
  getLatestRates(): Observable<Currency> {
    const url = `${this.apiUrl}/latest?access_key=${this.accessKey}`;
    return this.http.get<Currency>(url).pipe(shareReplay(1));
  }
  getCurrencyNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/symbols?access_key=${this.accessKey}`).pipe(shareReplay(1));
  }
  getExchangeRateForDate(date: string, fromSymbol: string, toSymbol:string): Observable<any> {
    const url = `${this.apiUrl}/${date}?access_key=${this.accessKey}&symbols=${fromSymbol},${toSymbol}`;
    return this.http.get(url).pipe(shareReplay(1));
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
            this.convertedAmount.next(convertedAmount);
          return convertedAmount;
        }
        throw new Error('Unable to convert currency.');
      })
    )
  }

 
}
