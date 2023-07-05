import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { TradeRoutingModule } from './trade-routing.module';
import { AlarmsComponent } from './alarms/alarms.component';
import { RobotsComponent } from './robots/robots.component';
import { RobotListComponent } from './robot-list/robot-list.component';
import { StocksComponent } from './stocks/stocks.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NzFormModule } from 'ng-zorro-antd/form';


@NgModule({
  declarations: [
    AlarmsComponent,
    RobotsComponent,
    RobotListComponent,
    StocksComponent,
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzTabsModule,
    NzIconModule,
    NzButtonModule,
    NzMessageModule,
    NzFormModule,
    NzModalModule,
    NzSelectModule,
    NzRadioModule,
    NzSpinModule,
    FormsModule,
    NzInputModule,
    NzTypographyModule,
    NzBreadCrumbModule,
    NzCheckboxModule,
    TradeRoutingModule,
    ComponentsModule,
  ]
})
export class TradeModule { }
