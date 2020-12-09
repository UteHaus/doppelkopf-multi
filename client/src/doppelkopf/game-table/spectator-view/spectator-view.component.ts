import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@app/services';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableState } from 'src/doppelkopf/models/table-players.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { TableMethods } from 'src/doppelkopf/services/table-hub-method.enum';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';

@Component({
  selector: 'app-spectator-view',
  templateUrl: './spectator-view.component.html',
  styleUrls: ['./spectator-view.component.less'],
})
export class SpectatorViewComponent implements OnInit, OnDestroy {
  tableStateSub = new BehaviorSubject<TableState>(null);
  tableState$: Observable<TableState>;

  constructor(
    private tableHubService: TableHubService,
    private playTableService: PlayTableService,
    private accountService: AccountService
  ) {}

  ngOnDestroy(): void {
    this.tableHubService.offMethode(TableMethods.SpectatorTable);
    this.tableStateSub.complete();
    this.playTableService
      .cancelSpectatorOnTable(Number(this.accountService.userValue.id))
      .toPromise();
  }

  ngOnInit(): void {
    this.tableHubService.onMethode(TableMethods.SpectatorTable, (data) =>
      this.tableStateSub.next(data)
    );
    this.tableState$ = this.tableStateSub.pipe(
      map((tableState) => {
        if (tableState.players) {
          let positionIndex = 1;
          tableState.players.forEach((player) => {
            player.viewPosition = positionIndex;
            positionIndex++;
          });
        }

        return tableState;
      })
    );
    this.tableHubService.invokeMethode(TableMethods.SpectatorTable);
  }
}
