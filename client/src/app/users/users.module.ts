import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectionComponent } from './add-edit/language-selection/language-selection.component';
import { LanguageNamePipe } from './add-edit/language-selection/language-name.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    TranslateModule,
  ],
  declarations: [
    LayoutComponent,
    ListComponent,
    AddEditComponent,
    LanguageSelectionComponent,
    LanguageNamePipe,
  ],
})
export class UsersModule {}
