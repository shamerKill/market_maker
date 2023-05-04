import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { RechargeComponent } from './recharge/recharge.component';
import { SettingsComponent } from './settings/settings.component';
import { UpgradeComponent } from './upgrade/upgrade.component';

const routes: Routes = [
  {
    path: 'account-list',
    component: AccountListComponent,
  },
  {
    path: 'recharge',
    component: RechargeComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'upgrade',
    component: UpgradeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
