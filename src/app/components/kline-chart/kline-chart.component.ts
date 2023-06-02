import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-kline-chart',
  templateUrl: './kline-chart.component.html',
  styleUrls: ['./kline-chart.component.scss']
})
export class KlineChartComponent {
  @Input('symbol') symbol?: string;
  @Input('exchange') exchange?: string;

}
