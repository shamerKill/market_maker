import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlarmsComponent } from './alarms/alarms.component';
import { RobotListComponent } from './robot-list/robot-list.component';
import { RobotsComponent } from './robots/robots.component';
import { StocksComponent } from './stocks/stocks.component';

const routes: Routes = [
  {
    path: 'alarms',
    component: AlarmsComponent,
  },
  {
    path: 'robot-list',
    component: RobotListComponent
  },
  {
    path: 'robots',
    component: RobotsComponent,
  },
  {
    path: 'stocks',
    component: StocksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }