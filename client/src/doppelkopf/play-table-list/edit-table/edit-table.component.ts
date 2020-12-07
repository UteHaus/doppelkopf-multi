import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/services';
import { first } from 'rxjs/internal/operators';
import {
  GamesVariants,
  PlayStatus,
  PlayTable,
} from 'src/doppelkopf/models/play-table.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.less'],
})
export class EditTableComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private playTableService: PlayTableService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      tableName: ['', Validators.required],
      diamondsAceAsMaster: [false],
      withNiner: [false],
    });

    if (!this.isAddMode) {
      this.playTableService
        .getTable(Number(this.id))
        .pipe(first())
        .subscribe((x) => {
          this.f.tableName.setValue(x.name);
          this.f.diamondsAceAsMaster.setValue(x.diamondsAceAsMaster);
          this.f.withNiner.setValue(x.withNiner);
        });
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createTable();
    }
  }

  private createTable() {
    const newTable: PlayTable = {
      name: this.form.value.tableName,
      status: PlayStatus.None,
      withNiner: this.form.value.withNiner,
      currentPlayerPosition: 1,
      roundCardsGiversPosition: 0,
      diamondsAceAsMaster: this.form.value.diamondsAceAsMaster,
      weddingWithFirstColorCast: true,
      gameVariant: GamesVariants.None,
    };
    this.playTableService
      .createTable(newTable)
      .pipe(first())
      .subscribe(
        () => {
          this.alertService.success('Table added successfully', {
            keepAfterRouteChange: true,
          });
          this.router.navigate([' ', { relativeTo: this.route }]);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  private updateTabel() {
    /* const table: PlayTable = { name: this.form.value, id: Number(this.id) }
 
     this.playTableService.updateTable(table)
       .pipe(first())
       .subscribe(
         data => {
           this.alertService.success('Update successful', { keepAfterRouteChange: true });
           this.router.navigate(['..', { relativeTo: this.route }]);
         },
         error => {
           this.alertService.error(error);
           this.loading = false;
         });*/
  }
}
