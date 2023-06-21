import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
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
    NzBreadCrumbModule,
    NzDatePickerModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    CommonModule,
    NzSelectModule,
    LogsRoutingModule
  ]
})
export class LogsModule { }
