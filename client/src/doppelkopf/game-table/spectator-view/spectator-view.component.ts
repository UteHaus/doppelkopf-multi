import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@app/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableState } from 'src/doppelkopf/models/table-state.model';
import { ViewerState } from 'src/doppelkopf/models/viewer-state.model';
import { SpectatorService } from 'src/doppelkopf/services/spectator.service';
import { TableMethods } from 'src/doppelkopf/services/table-hub-method.enum';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';
import { TableUtil } from 'src/doppelkopf/utils/table.util';

@Component({
  selector: 'app-spectator-view',
  templateUrl: './spectator-view.component.html',
  styleUrls: ['./spectator-view.component.less'],
})
export class SpectatorViewComponent implements OnInit, OnDestroy {
  tableStateSub = new BehaviorSubject<TableState>(null);
  spectatorStateSub = new BehaviorSubject<ViewerState>(null);
  tableState$: Observable<TableState>;
  cardSourceMethode: TableMethods = TableMethods.PlayerCardsForSpectator;

  constructor(
    private tableHubService: TableHubService,
    private accountService: AccountService,
    private spectatorService: SpectatorService
  ) {}

  ngOnDestroy(): void {
    this.tableHubService.offMethode(TableMethods.SpectatorTable);
    this.tableStateSub.complete();
    this.spectatorStateSub.complete();
    if (this.accountService.userValue) {
      this.spectatorService
        .cancelSpectatorOnTable(Number(this.accountService.userValue.id))
        .toPromise();
    }
  }

  ngOnInit(): void {
    this.tableHubService.onMethode(TableMethods.SpectatorTable, (data) =>
      this.tableStateSub.next(data)
    );
    this.tableState$ = this.tableStateSub.pipe(
      map((tableState) => {
        if (tableState && tableState.players) {
          tableState.players = TableUtil.orderPlayersByPositionAndSetViewPosition(
            tableState.players,
            1
          );
        }

        return tableState;
      })
    );
    this.tableHubService.invokeMethode(TableMethods.SpectatorTable);

    this.tableHubService.onMethode(TableMethods.SpectatorState, (data) =>
      this.spectatorStateSub.next(data)
    );
    this.tableHubService.invokeMethode(TableMethods.SpectatorState);
  }
}
