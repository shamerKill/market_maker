import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataChartComponent } from './data-chart/data-chart.component';
import { PropertyComponent } from './property/property.component';
import { RobotLogsComponent } from './robot-logs/robot-logs.component';

const routes: Routes = [
  {
    path: 'chart',
    component: DataChartComponent,
  },
  {
    path: 'property',
    component: PropertyComponent,
  },
  {
    path: 'robot-logs',
    component: RobotLogsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
