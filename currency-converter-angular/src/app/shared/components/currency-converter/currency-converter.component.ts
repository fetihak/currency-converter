import { CurrencyService } from './../../../core/services/currency.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from '../../models/Currency';
import { Router } from '@angular/router';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  converterForm!: FormGroup;
  currencies: string[] = [];
  baseCurrency: string = 'EUR';
  targetCurrency: string = 'USD';
  conversionResultText: string = '';
  hideDetailOption = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private currencyService: CurrencyService
  ) {
    this.converterForm = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      fromCurrency: ['', Validators.required],
      toCurrency: [' ', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRates()
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


      this.currencyService.convertCurrency(
          formValues.amount ,
          formValues.fromCurrency ,
          formValues.toCurrency
        )
        .subscribe(
          (result:any) => {
            const from =   formValues.fromCurrency
            const to =  formValues.toCurrency
            this.conversionResultText = `${formValues.amount} ${from } = ${result.toFixed(2)} ${to}`;
          },
          
        );
    }
   
  }
  goToDetailsPage() {
    this.router.navigate(['/details', this.baseCurrency, this.targetCurrency]);
  }
}
