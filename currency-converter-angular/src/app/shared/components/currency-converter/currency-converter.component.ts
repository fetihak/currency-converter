import { CurrencyService } from './../../../core/services/currency.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from '../../models/Currency';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit , OnDestroy {
  converterForm!: FormGroup;
  currencies: string[] = [];
  baseCurrency: string = 'EUR';
  targetCurrency: string = 'USD';
  baseAmount : number = 1;
  conversionResultText: string = '';
  private subscriptions = new Subscription();
  @Input() disableFromCurrency!:boolean;
  @Input() hideDetailOption!:boolean;
  @Input() hideSwapButton !:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private currencyService: CurrencyService
  ) {
   
  }
  initForm(){
    this.converterForm = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      fromCurrency: ['', Validators.required],
      toCurrency: [' ', Validators.required],
    });
    this.disableForm()
  }
  ngOnInit(): void {
    this.initForm()
    this.getRates();
    this.subscriptions.add(
      this.currencyService.baseCurrency$.subscribe((currency) => {
        this.baseCurrency = currency;
        this.converterForm.patchValue({ fromCurrency: currency });
      })
    );

    this.subscriptions.add(
      this.currencyService.baseAmount$.subscribe((amount) => {
        this.baseAmount = amount;
        this.converterForm.patchValue({ amount: amount });
      })
    );

    this.subscriptions.add(
      this.currencyService.targetCurrency$.subscribe((currency) => {
        this.targetCurrency = currency;
        this.converterForm.patchValue({ toCurrency: currency });
      })
    );
  }
  
  onFromCurrencyChange(event: Event){
      const selectElement = event.target as HTMLSelectElement;
      const value = selectElement.value;
      console.log('Currency changed to:', value);
      this.currencyService.setBaseCurrency(value)
  }
  onToCurrencyChange(event: Event){
      const selectElement = event.target as HTMLSelectElement;
      const value = selectElement.value;
      console.log('Currency changed to:', value);
      this.currencyService.setTargetCurrency(value)
  }

  getRates() {
    this.currencyService.getLatestRates().subscribe(
      (data: Currency) => {
        this.currencies = Object.keys(data.rates);
      }
      // (error) => {
      //   // Handle error
      // }
    );
  }
  swapCurrencies() {
    const fromCurrency = this.converterForm.get('fromCurrency')?.value;
    const toCurrency = this.converterForm.get('toCurrency')?.value;

    this.converterForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
    });
  }
  convert() {
    if (this.converterForm.valid) {
      const formValues = this.converterForm.value;
      this.subscriptions.add(this.currencyService.convertCurrency(
          formValues.amount ,
          this.baseCurrency,
          this.targetCurrency
        )
        .subscribe(
          (result:any) => {
            this.conversionResultText = `${formValues.amount} ${this.baseCurrency } = ${result.toFixed(2)} ${this.targetCurrency}`;
            this.disableForm()
          },
          
        ));
    }
   
  }
  disableForm(){
    if (this.disableFromCurrency) {
      this.converterForm?.get('fromCurrency')?.disable();
    } else {
      this.converterForm.get('fromCurrency')?.enable();
    }
  }
  goToDetailsPage() {
    this.router.navigate(['/details', this.baseCurrency, this.targetCurrency]);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
