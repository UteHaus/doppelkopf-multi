import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/services';
import { firstValueFrom } from 'rxjs';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.less'],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams?.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
   firstValueFrom( this.accountService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())).then(
        () => this.router.navigate([this.returnUrl]),
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
