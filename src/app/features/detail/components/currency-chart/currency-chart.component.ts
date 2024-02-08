import { formatDate } from '@angular/common';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Component, OnInit } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartItem,
  registerables,
} from 'chart.js/auto';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-currency-chart',
  templateUrl: './currency-chart.component.html',
  styleUrls: ['./currency-chart.component.scss'],
})
export class CurrencyChartComponent implements OnInit {
  symbols: string = '';
  fromDate: string = '';
  toDate:string = ''
  constructor(
    private currencyService: CurrencyService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.fromDate =params['from'];
      this.toDate =params['to']
      const { fromRate, toRate } = await this.fetchMonthlyRates(
        params['from'],
        params['to']
      ); // Or your target currency
      this.createChart(fromRate, toRate);
    });
  }
  async fetchMonthlyRates(from: string, to: string) {
    const lastDays = this.getLastDaysOfEachMonth();
    // const lastDays = ['jan','feb'];
    const fromRate = [];
    const toRate = [];
    for (const day of lastDays) {
      const response = await this.currencyService
        .getExchangeRateForDate(day, from, to)
        .toPromise();
      fromRate.push(response.rates[from]);
      toRate.push(response.rates[to]);
    }
    return { fromRate, toRate };
  }
  createChart(monthlyRates: number[], monthlyRates2: number[]): void {
    Chart.register(...registerables);
    const data = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: `Monthly Exchange Rate of (${this.fromDate})`,
          data: monthlyRates,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: `Monthly Exchange Rate of (${this.toDate})`,
          data: monthlyRates2,
          fill: false,
          borderColor: 'rgb(15, 92, 12)',
          tension: 0.1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
    };
    const chartItem: ChartItem = document.getElementById(
      'my-chart'
    ) as ChartItem;
    new Chart(chartItem, config);
  }
  getLastDaysOfEachMonth() {
    const dates = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Start from January of the previous year
    for (let year = currentYear - 1; year <= currentYear; year++) {
      for (let month = 0; month <= 11; month++) {
        // Skip months after the current month for the current year
        if (year === currentYear && month > currentMonth - 1) {
          break;
        }

        // Calculate the last day of the month
        let date = new Date(year, month + 1, 0);

        // Format the date as 'YYYY-MM-DD'
        const formattedDate = date.toISOString().split('T')[0];
        dates.push(formattedDate);
      }
    }
    return dates;
  }
}
