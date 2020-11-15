import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/services';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlayTableCount } from 'src/doppelkopf/models/play-table-count.model';
import { PlayTable } from 'src/doppelkopf/models/play-table.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';

@Component({
  selector: 'app-play-table-list',
  templateUrl: './play-table-list.component.html',
  styleUrls: ['./play-table-list.component.less'],
})
export class PlayTableListComponent implements OnInit {
  tables$: Observable<PlayTableCount[]>;
  userTableId$: Observable<number>;

  constructor(
    private tableService: PlayTableService,
    private alertService: AlertService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.tables$ = this.tableService.getTablesWithAutoReload();
    this.userTableId$ = this.tableService
      .getUserPlayTable(Number(this.accountService.userValue.id))
      .pipe(
        map((tp) => (tp != undefined ? tp.id : -1)),
        catchError(() => of(-1))
      );
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

  trackPlayTabel(index: number, table: PlayTable): string {
    return table.id.toString();
  }
}
