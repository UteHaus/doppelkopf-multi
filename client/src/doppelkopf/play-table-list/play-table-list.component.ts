import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models';
import { AccountService, AlertService } from '@app/services';
import { Observable, of, Subject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { PlayTableCount } from 'src/doppelkopf/models/play-table-count.model';
import { PlayTable } from 'src/doppelkopf/models/play-table.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { TableMethods } from '../services/table-hub-method.enum';
import { TableHubService } from '../services/table-hub.service';

@Component({
  selector: 'app-play-table-list',
  templateUrl: './play-table-list.component.html',
  styleUrls: ['./play-table-list.component.less'],
})
export class PlayTableListComponent implements OnInit, OnDestroy {
  tables$ = new Subject<PlayTableCount[]>();
  onHubConnect$: Observable<boolean>;
  testValue: any;
  userTableId$: Observable<number>;
  get user(): User {
    return this.accountService.userValue;
  }
  deleteTableIds = [];

  constructor(
    private tableService: PlayTableService,
    private alertService: AlertService,
    private router: Router,
    private accountService: AccountService,
    private tableHub: TableHubService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.userTableId$ = this.tableService
      .getUserPlayTable(Number(this.accountService.userValue.id))
      .pipe(
        map((tp) => (tp != undefined ? tp.id : -1)),
        catchError(() => of(-1))
      );

    this.onHubConnect$ = this.tableHub.connectionEstablished$;
    this.tableHub.onMethode(TableMethods.Tables, (tables) =>
      this.tables$.next(tables)
    );
    this.tableHub.invokeMethode(TableMethods.Tables);
  }

  runWithOnTable(tableId: number, playOn: boolean): void {
    if (playOn) {
      this.router.navigate(['table', tableId, 'player']);
    } else {
      this.tableService
        .runWithOnTable(tableId, Number(this.accountService.userValue.id))
        .toPromise()
        .then((result) => {
          if (result) {
            this.router.navigate(['table', tableId, 'player']);
          } else {
            this.alertService.error('error.full-table');
          }
        });
    }
  }

  watchTable(playTable: PlayTableCount) {
    this.tableService
      .setSpectatorOnTable(Number(this.user.id), playTable.id)
      .toPromise()
      .then((canView: boolean) => {
        this.router.navigate(['table', playTable.id, 'spectator']);
      })
      .catch(() => {});
  }

  trackPlayTable(index: number, table: PlayTable): string {
    return (table ? table.id : 0).toString();
  }

  deleteTable(playTable: PlayTable) {
    if (this.user.admin) {
      this.deleteTableIds[playTable.id] = true;
      this.tableService.deleteTable(playTable.id).pipe(first()).toPromise();
    }
  }
}
