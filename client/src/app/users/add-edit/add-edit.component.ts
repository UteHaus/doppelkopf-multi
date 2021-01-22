﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/services';
import { User } from '@app/models';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'add-edit.component.html',
  styleUrls: ['add-edit.component.less'],
})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  user$: Observable<User>;
  languageKey: string;
  previousUrl: string = '/users/list';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    const params = (this.route.snapshot.params.id as string).split('?');
    this.id = params[0];
    if (params.length > 1) {
      const url = params[1].split('=')[1];
      this.previousUrl = url.split('_').join('/');
    }
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
      this.accountService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => {
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
  get formControls() {
    return this.form.controls;
  }

  cancel(): void {
    this.router.navigate([this.previousUrl]);
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
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
    this.accountService
      .register(user)
      .pipe(first())
      .subscribe(
        () => {
          this.alertService.success('User added successfully', {
            keepAfterRouteChange: true,
          });
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  private updateUser(user: User) {
    this.accountService
      .update(this.id, user)
      .pipe(first())
      .subscribe(
        () => {
          this.alertService.success('Update successful', {
            keepAfterRouteChange: true,
          });
          this.router.navigate([this.previousUrl, { relativeTo: this.route }]);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}