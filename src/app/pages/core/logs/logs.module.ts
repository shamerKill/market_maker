import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsRoutingModule } from './logs-routing.module';
import { DataChartComponent } from './data-chart/data-chart.component';
import { PropertyComponent } from './property/property.component';
import { RobotLogsComponent } from './robot-logs/robot-logs.component';


@NgModule({
  declarations: [
    DataChartComponent,
    PropertyComponent,
    RobotLogsComponent,
  ],
  imports: [
    CommonModule,
    LogsRoutingModule
  ]
})
export class LogsModule { }
