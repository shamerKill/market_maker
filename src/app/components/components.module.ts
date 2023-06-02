import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon/icon.component';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { TradingViewComponent } from './kline-chart/trading-view/trading-view.component';
import { EmptyComponent } from './empty/empty.component';



@NgModule({
  declarations: [
    IconComponent,
    KlineChartComponent,
    TradingViewComponent,
    EmptyComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    IconComponent,
    KlineChartComponent,
    EmptyComponent,
  ]
})
export class ComponentsModule { }
