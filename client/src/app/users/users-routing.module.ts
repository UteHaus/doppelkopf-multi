import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { AuthGuard } from '@app/helpers';
import { AuthAdminGuard } from '@app/helpers/auth-admin.guard';
import { AuthForUserGuard } from '@app/helpers/auth-for-user.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ListComponent, canActivate: [AuthAdminGuard] },
      {
        path: 'add',
        component: AddEditComponent,
        canActivate: [AuthAdminGuard],
      },
      {
        path: 'edit/:id',
        component: AddEditComponent,
        canActivate: [AuthForUserGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
