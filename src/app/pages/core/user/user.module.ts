import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AccountListComponent } from './account-list/account-list.component';
import { RechargeComponent } from './recharge/recharge.component';
import { SettingsComponent } from './settings/settings.component';
import { UpgradeComponent } from './upgrade/upgrade.component';


@NgModule({
  declarations: [
    AccountListComponent,
    RechargeComponent,
    SettingsComponent,
    UpgradeComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
