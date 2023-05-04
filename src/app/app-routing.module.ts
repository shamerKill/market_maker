import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'core',
    loadChildren: () => import('./pages/core/core.module').then(m => m.CoreModule),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {  scrollOffset: [0, 0] } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
