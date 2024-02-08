import { CurrencyService } from './../../../core/services/currency.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from '../../models/Currency';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  converterForm!: FormGroup;
  currencies: string[] = [];
  baseCurrency: string = 'EUR';
  targetCurrency: string = 'USD';
  baseAmount: number = 1;
  convertedAmount: number = 1;
  conversionResultText: string = '';
  baseResult:string = '';
  private subscriptions = new Subscription();
  @Input() disableFromCurrency!: boolean;
  @Input() hideDetailOption!: boolean;
  @Input() hideSwapButton!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr:ToastrService,
    private currencyService: CurrencyService
  ) {}
  initForm() {
    this.converterForm = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      fromCurrency: ['', Validators.required],
      toCurrency: [' ', Validators.required],
    });
    this.disableForm();
  }
  getBaseData() {
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
    this.subscriptions.add(
      this.currencyService.convertedAmount$.subscribe((currency) => {
        this.convertedAmount = currency;
      })
    );
    if (this.conversionResultText === '') {
      this.conversionResultText = `${this.baseAmount} ${ this.baseCurrency} = ${this.convertedAmount.toFixed(2)} ${this.targetCurrency}`;
      this.baseResult = `${(this.baseAmount/this.baseAmount)}  ${ this.baseCurrency} = ${+this.convertedAmount.toFixed(2)/this.baseAmount} ${this.targetCurrency}`
    }
  }
  ngOnInit(): void {
    this.initForm();
    this.getRates();
    this.getBaseData();
  }

  onFromCurrencyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.currencyService.setBaseCurrency(value);
  }
  onToCurrencyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.currencyService.setTargetCurrency(value);
  }
  onAmountChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = Number(inputElement.value);
    this.currencyService.setAmount(newValue);
  }

  getRates() {
    this.currencyService.getLatestRates().subscribe(
      (data: Currency) => {
        if(data && data.rates) {
        this.currencies = Object.keys(data.rates);
      }
      else{
        console.error('Rates data is undefined or null');
        this.toastr.error('Failed to load currency rates', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        
      }
    })
     
      
    
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
      this.subscriptions.add(
        this.currencyService
          .convertCurrency(
            this.baseAmount,
            this.baseCurrency,
            this.targetCurrency
          )
          .subscribe((result: any) => {
            this.conversionResultText = `${formValues.amount} ${
              this.baseCurrency
            } = ${result.toFixed(2)} ${this.targetCurrency}`;
            this.disableForm();
          })
      );
    }
  }
  disableForm() {
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
