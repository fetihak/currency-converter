import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CurrencyConverterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,FormsModule, ReactiveFormsModule
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class SharedModule { }
