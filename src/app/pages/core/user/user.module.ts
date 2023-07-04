import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AccountListComponent } from './account-list/account-list.component';
import { RechargeComponent } from './recharge/recharge.component';
import { SettingsComponent } from './settings/settings.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [
    AccountListComponent,
    RechargeComponent,
    SettingsComponent,
    UpgradeComponent,
  ],
  imports: [
    CommonModule,
    NzButtonModule,
    NzGridModule,
    UserRoutingModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
    NzInputModule,
    NzMessageModule,
  ]
})
export class UserModule { }
