import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { BaseComponent } from './base/base.component';
import { UserModule } from './user/user.module';
import { TradeModule } from './trade/trade.module';
import { LogsModule } from './logs/logs.module';


@NgModule({
  declarations: [
    BaseComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    UserModule,
    TradeModule,
    LogsModule,
  ]
})
export class CoreModule { }
