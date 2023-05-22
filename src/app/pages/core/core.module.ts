import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';


import { CoreRoutingModule } from './core-routing.module';
import { BaseComponent } from './base/base.component';
import { UserModule } from './user/user.module';
import { TradeModule } from './trade/trade.module';
import { LogsModule } from './logs/logs.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    BaseComponent,
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzLayoutModule,
    NzDividerModule,
    NzButtonModule,
    NzMenuModule,
    NzIconModule,
    NzTypographyModule,
    CoreRoutingModule,
    ComponentsModule,
    UserModule,
    TradeModule,
    LogsModule,
  ],
})
export class CoreModule { }
