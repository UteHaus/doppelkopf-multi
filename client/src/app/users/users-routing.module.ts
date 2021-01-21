import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AuthGuardEditUser } from '@app/helpers/auth-edit-user.guard';
import { AuthGuardAddUser } from '@app/helpers/auth-add-user.guard';
import { AuthGuardListUser } from '@app/helpers/auth-list-user.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthGuardListUser],
      },
      {
        path: 'add',
        component: AddEditComponent,
        canActivate: [AuthGuardEditUser],
      },
      {
        path: 'edit/:id',
        component: AddEditComponent,
        canActivate: [AuthGuardEditUser],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
