import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-kline-chart',
  templateUrl: './kline-chart.component.html',
  styleUrls: ['./kline-chart.component.scss']
})
export class KlineChartComponent {
  @Input('symbol') symbol?: string;
  @Input('exchange') exchange?: string;
  timeType: '1m'|'5m'|'15m'|'1h'|'4h'|'1d' = '1m';

  constructor() {
    const timeType = window.localStorage.getItem('maker_type_time');
    if (timeType) {
      this.timeType = timeType as this['timeType'];
    }
  }

  changeTimeType(type: string) {
    this.timeType = type as this['timeType'];
    window.localStorage.setItem('maker_type_time', type);
  }

}
