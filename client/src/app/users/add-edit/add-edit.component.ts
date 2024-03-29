﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/services';
import { User } from '@app/models';
import { firstValueFrom, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'add-edit.component.html',
  styleUrls: ['add-edit.component.less'],
})
export class AddEditComponent implements OnInit {
  form: UntypedFormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  user$: Observable<User>;
  languageKey: string;
  previousUrl = '/users/list';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const params = (this.route.snapshot.params.id as string)?.split('?');
    if (params != null) {
      this.id = params[0];

      if (params.length > 1) {
        const url = params[1]?.split('=')[1];
        this.previousUrl = url?.split('_').join('/');
      }
    }
    if (this.previousUrl == null) this.previousUrl = '/users/list';

    this.isAddMode = !this.id;
    this.user$ = this.accountService.user;
    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      username: ['', Validators.required],
      password: ['', passwordValidators],
      editUser: [false],
      editTables: [false],
    });
    this.languageKey = this.translateService.getBrowserLang();

    if (!this.isAddMode) {
      firstValueFrom(this.accountService.getById(this.id)).then((x) => {
        this.formControls.firstName.setValue(x.firstName);
        this.formControls.lastName.setValue(x.lastName);
        this.formControls.username.setValue(x.username);
        this.formControls.editUser.setValue(x.editUser);
        this.formControls.editTables.setValue(x.editTables);
        this.languageKey =
          x.languageKey ?? this.translateService.getBrowserLang();
      });
    }
  }

  // convenience getter for easy access to form fields
  get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cancel(): void {
    this.router.navigate([this.previousUrl]);
  }

  onSubmit(): void {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here is form invalid
    /*   if (this.form.invalid) {
      return;
    } */

    this.loading = true;
    const user: User = this.form.value;
    user.languageKey = this.languageKey;
    if (this.isAddMode) {
      this.createUser(user);
    } else {
      this.updateUser(user);
    }
  }

  private createUser(user: User) {
    firstValueFrom(this.accountService.register(user))
      .then(() => {
        this.alertService.success('User added successfully', {
          keepAfterRouteChange: true,
        });
        this.router.navigate([this.previousUrl]);
      })
      .catch((error) => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

  private updateUser(user: User) {
    firstValueFrom(this.accountService.update(this.id, user))
      .then(() => {
        this.alertService.success('Update successful', {
          keepAfterRouteChange: true,
        });
        this.router.navigate([this.previousUrl]);
      })
      .catch((error) => {
        this.alertService.error(error);
        this.loading = false;
      });
  }
}
