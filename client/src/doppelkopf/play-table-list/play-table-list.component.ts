import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models';
import { AccountService, AlertService } from '@app/services';
import { Observable, of, Subject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { PlayTableCount } from 'src/doppelkopf/models/play-table-count.model';
import { PlayTable } from 'src/doppelkopf/models/play-table.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@aspnet/signalr';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-play-table-list',
  templateUrl: './play-table-list.component.html',
  styleUrls: ['./play-table-list.component.less'],
})
export class PlayTableListComponent implements OnInit, OnDestroy {
  tables$: Subject<PlayTableCount[]> = new Subject();
  testValue: any;
  userTableId$: Observable<number>;
  get user(): User {
    return this.accountService.userValue;
  }
  deleteTableIds = [];
  private connection: HubConnection;

  constructor(
    private tableService: PlayTableService,
    private alertService: AlertService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnDestroy(): void {
    this.connection.stop();
  }

  ngOnInit(): void {
    /* this.tables$ = this.tableService.getTablesWithAutoReload(); */
    this.userTableId$ = this.tableService
      .getUserPlayTable(Number(this.accountService.userValue.id))
      .pipe(
        map((tp) => (tp != undefined ? tp.id : -1)),
        catchError(() => of(-1))
      );
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub/playtable`, {
        /* skipNegotiation: true,
        transport: HttpTransportType.WebSockets, */
        accessTokenFactory: () => this.accountService.userValue.token,
      })
      .build();
    this.connect();
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

  private connect() {
    this.connection
      .start()
      .then(() => {
        console.log('Connection started');
        this.connection.on('tables', (value) => {
          this.tables$.next(value);
        });
        this.connection.invoke('tables');
      })
      .catch((err) => console.error('Error while starting connection: ' + err));
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
