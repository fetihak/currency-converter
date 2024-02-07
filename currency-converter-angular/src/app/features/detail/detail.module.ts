import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { CurrencyChartComponent } from './components/currency-chart/currency-chart.component';
import { DetailRoutingModule } from './detail.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    DetailPageComponent,
    CurrencyChartComponent
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    SharedModule
  ]
})
export class DetailModule { }
