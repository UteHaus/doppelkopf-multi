import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers';

const accountModule = () =>
  import('./account/account.module').then((x) => x.AccountModule);
const usersModule = () =>
  import('./users/users.module').then((x) => x.UsersModule);
const doppelkopfModule = () =>
  import('./../doppelkopf/doppelkopf.module').then((x) => x.DoppelkopfModule);

const routes: Routes = [
  { path: '', loadChildren: doppelkopfModule, canActivate: [AuthGuard] },
  {
    path: 'users',
    loadChildren: usersModule,
  },
  { path: 'account', loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
