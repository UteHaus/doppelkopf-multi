import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models';
import { AccountService, AlertService } from '@app/services';
import { Observable, of, Subject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { PlayTableCount } from 'src/doppelkopf/models/play-table-count.model';
import { PlayTable } from 'src/doppelkopf/models/play-table.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { SignalRService } from '../services/signal-r.service';
import { TableHubService } from '../services/table-hub.service';

@Component({
  selector: 'app-play-table-list',
  templateUrl: './play-table-list.component.html',
  styleUrls: ['./play-table-list.component.less'],
})
export class PlayTableListComponent implements OnInit, OnDestroy {
  tables$: Observable<PlayTableCount[]>;
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
    this.tables$ = this.tableHub.tables$;
    this.onHubConnect$ = this.tableHub.connectionEstablished$;
    this.tableHub.InvokeForTables();
  }

  runWithOnTable(tableId: number, playOn: boolean): void {
    if (playOn) {
      this.router.navigate(['table', tableId]);
    } else {
      this.tableService
        .runWithOnTable(tableId, Number(this.accountService.userValue.id))
        .toPromise()
        .then((result) => {
          if (result) {
            this.router.navigate(['table', tableId]);
          } else {
            this.alertService.error('error.full-table');
          }
        });
    }
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
