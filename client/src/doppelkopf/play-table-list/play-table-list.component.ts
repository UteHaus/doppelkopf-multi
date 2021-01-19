import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models';
import { AccountService, AlertService } from '@app/services';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, first, map, switchMap, take } from 'rxjs/operators';
import { PlayTableCount } from 'src/doppelkopf/models/play-table-count.model';
import { PlayTable } from 'src/doppelkopf/models/play-table.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { SpectatorService } from '../services/spectator.service';
import { TableMethods } from '../services/table-hub-method.enum';
import { TableHubService } from '../services/table-hub.service';

@Component({
  selector: 'app-play-table-list',
  templateUrl: './play-table-list.component.html',
  styleUrls: ['./play-table-list.component.less'],
})
export class PlayTableListComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  tables$ = new BehaviorSubject<PlayTableCount[]>([]);
  onHubConnect$: Observable<boolean>;
  testValue: any;
  userTableId$: Observable<number>;
  userTableIdSub: BehaviorSubject<void> = new BehaviorSubject(null);
  currentUser$: Observable<User>;
  user$: Observable<User>;
  deleteTableIds = [];

  constructor(
    private tableService: PlayTableService,
    private alertService: AlertService,
    private router: Router,
    private accountService: AccountService,
    private tableHub: TableHubService,
    private spectatorService: SpectatorService
  ) {}

  ngAfterViewInit(): void {
    this.userTableIdSub.next();
  }
  ngAfterViewChecked(): void {
    // set auto hight of scrolling element
    const overflowAuto = document.getElementsByClassName('card-body')[0];
    if (overflowAuto) {
      const maxHeight = overflowAuto.getBoundingClientRect().top + 20;
      overflowAuto['style'].height = 'calc(100vh - ' + maxHeight + 'px)';
    }
  }

  ngOnDestroy(): void {
    this.userTableIdSub.complete();
    this.tables$.complete();
  }

  ngOnInit(): void {
    this.user$ = this.accountService.user;
    this.currentUser$ = this.accountService.user;
    this.userTableId$ = this.userTableIdSub.pipe(
      switchMap(() =>
        this.tableService.getUserPlayTable(
          Number(this.accountService.userValue.id)
        )
      ),
      map((tp) => {
        return tp != undefined ? tp.id : -1;
      }),
      catchError(() => of(-1))
    );

    this.onHubConnect$ = this.tableHub.connectionEstablished$;
    this.tableHub.onMethode(TableMethods.Tables, (tables) => {
      this.tables$.next(this.sortTables(tables));
      this.userTableIdSub.next();
    });

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

  goOutOfTable(): void {
    this.tableService
      .logoutOfTable(this.accountService.userValue.id)
      .pipe(take(1))
      .toPromise()
      .then(() => this.router.navigate([]));
    this.userTableIdSub.next();
  }

  watchTable(playTable: PlayTableCount) {
    this.user$
      .pipe(
        switchMap((user) =>
          this.spectatorService.setSpectatorOnTable(
            Number(user.id),
            playTable.id
          )
        )
      )
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
    this.user$
      .pipe(
        switchMap((user) => {
          if (user.admin) {
            this.deleteTableIds[playTable.id] = true;
            return this.tableService.deleteTable(playTable.id);
          }
          return of(undefined);
        }),
        first()
      )
      .toPromise();
  }

  private sortTables(tables: PlayTableCount[]): PlayTableCount[] {
    return tables.sort((tablesA, tablesB) =>
      tablesA.name.localeCompare(tablesB.name)
    );
  }
}
