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
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';
import { PlayTableCount } from '../models/play-table-count.model';
import { PlayTable } from '../models/play-table.model';
import { PlayTableService } from '../services/play-table.service';
import { JitsiService } from '../../jitsi/services/jitsi.service';
import { SpectatorService } from '../services/spectator.service';
import { TableMethods } from '../services/table-hub-method.enum';
import { TableHubService } from '../services/table-hub.service';

@Component({
  selector: 'app-play-table-list',
  templateUrl: './play-table-list.component.html',
  styleUrls: [],
})
export class PlayTableListComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  tables$ = new BehaviorSubject<PlayTableCount[]>([]);
  onHubConnect$: Observable<boolean>;
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
    private spectatorService: SpectatorService,
    private jitsiService: JitsiService
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
    this.userTableId$ = combineLatest([
      this.accountService.user,
      this.userTableIdSub,
    ]).pipe(
      switchMap((user) =>
        this.tableService.getUserPlayTable(Number(user[0].id))
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
      this.accountService.user
        .pipe(
          switchMap((user) =>
            this.tableService.runWithOnTable(tableId, Number(user.id))
          ),
          first()
        )
        .subscribe((result) => {
          if (result) {
            this.router.navigate(['table', tableId, 'player']);
          } else {
            this.alertService.error('error.full-table');
          }
        });
    }
  }

  goOutOfTable(): void {
    this.accountService.user
      .pipe(
        switchMap((user) => this.tableService.logoutOfTable(user.id)),
        first()
      )
      .subscribe(() => this.router.navigate([]));
    this.userTableIdSub.next();
  }

  watchTable(playTable: PlayTableCount): void {
    this.user$
      .pipe(
        switchMap((user) =>
          this.spectatorService.setSpectatorOnTable(
            Number(user.id),
            playTable.id
          )
        ),
        first()
      )
      .subscribe((canView: boolean) => {
        if (canView) this.router.navigate(['table', playTable.id, 'spectator']);
      });
  }

  trackPlayTable(index: number, table: PlayTable): string {
    return (table ? table.id : 0).toString();
  }

  deleteTable(playTable: PlayTable): void {
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
      .subscribe();
  }
  openJitsi(): void {
    this.jitsiService.openJitsiInNewBrowserTab();
  }

  private sortTables(tables: PlayTableCount[]): PlayTableCount[] {
    return tables.sort((tablesA, tablesB) =>
      tablesA.name.localeCompare(tablesB.name)
    );
  }
}
