import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeRoutingModule } from './trade-routing.module';
import { AlarmsComponent } from './alarms/alarms.component';
import { RobotsComponent } from './robots/robots.component';
import { RobotListComponent } from './robot-list/robot-list.component';
import { StocksComponent } from './stocks/stocks.component';


@NgModule({
  declarations: [
    AlarmsComponent,
    RobotsComponent,
    RobotListComponent,
    StocksComponent,
  ],
  imports: [
    CommonModule,
    TradeRoutingModule
  ]
})
export class TradeModule { }
