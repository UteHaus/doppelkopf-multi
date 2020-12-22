import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@app/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
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
export class SpectatorViewComponent
  implements OnInit, OnDestroy, AfterViewInit {
  tableStateSub = new BehaviorSubject<TableState>(null);
  spectatorStateSub = new BehaviorSubject<ViewerState>(null);
  tableState$: Observable<TableState>;
  cardSourceMethode: TableMethods = TableMethods.PlayerCardsForSpectator;
  private showPlayerId: number = -1;

  constructor(
    private tableHubService: TableHubService,
    private accountService: AccountService,
    private spectatorService: SpectatorService
  ) {}

  ngAfterViewInit(): void {
    this.tableHubService.invokeMethode(TableMethods.SpectatorTable);
    this.tableHubService.invokeMethode(TableMethods.SpectatorState);
  }

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
    this.tableHubService.onMethode(TableMethods.SpectatorTable, (data) => {
      const tableState = data as TableState;
      if (tableState && tableState.players) {
        tableState.players = TableUtil.orderPlayersByPositionAndSetViewPosition(
          tableState.players,
          this.getPlayerPosition(tableState.players, this.showPlayerId)
        );
      }
      this.tableStateSub.next(tableState);
    });
    this.tableState$ = this.tableStateSub.pipe(
      map((tableState) => {
        if (tableState && tableState.players) {
          tableState.players = TableUtil.orderPlayersByPositionAndSetViewPosition(
            tableState.players,
            this.getPlayerPosition(tableState.players, this.showPlayerId)
          );
        }

        return tableState;
      })
    );

    this.tableHubService.onMethode(TableMethods.SpectatorState, (data) =>
      this.spectatorStateSub.next(data)
    );
  }

  cardsOfPlayerSelected(player: AdditionPlayerInfo): void {
    this.spectatorService
      .showCardsOf(Number(this.accountService.userValue.id), player.playerId)
      .pipe(take(1))
      .toPromise()
      .then((canShow) => {
        if (canShow) {
          this.showPlayerId = player.playerId;
          this.tableHubService.invokeMethode(TableMethods.SpectatorTable);
        }
      });
  }

  playerAsAdditionPlayerChecked(value: boolean) {
    this.spectatorService
      .setAsAdditionPlayer(Number(this.accountService.userValue.id), value)
      .pipe(take(1))
      .subscribe();
  }

  private getPlayerPosition(
    players: AdditionPlayerInfo[],
    showPlayerId: number
  ): number {
    if (showPlayerId < 0) {
      return 1;
    }
    const player = players.find((player) => player.playerId == showPlayerId);
    return player ? player.playerPosition : 1;
  }
}
