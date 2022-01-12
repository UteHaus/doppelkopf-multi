import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '@app/services';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';
import { AdditionPlayerInfo } from '../../models/additional-player-info.model';
import { TableState } from '../../models/table-state.model';
import { ViewerState } from '../../models/viewer-state.model';
import { SpectatorService } from '../../services/spectator.service';
import { TableMethods } from '../../services/table-hub-method.enum';
import { TableHubService } from '../../services/table-hub.service';
import { TableUtil } from '../../utils/table.util';

@Component({
  selector: 'app-spectator-view',
  templateUrl: './spectator-view.component.html',
  styleUrls: ['./spectator-view.component.less'],
})
export class SpectatorViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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

    this.accountService.user
      .pipe(
        switchMap((user) =>
          user
            ? this.spectatorService.cancelSpectatorOnTable(Number(user.id))
            : of(undefined)
        ),
        first()
      )
      .subscribe();
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
          tableState.players =
            TableUtil.orderPlayersByPositionAndSetViewPosition(
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
    this.accountService.user
      .pipe(
        switchMap((user) =>
          this.spectatorService.showCardsOf(Number(user.id), player.playerId)
        ),
        take(1)
      )
      .toPromise()
      .then((canShow) => {
        if (canShow) {
          this.showPlayerId = player.playerId;
          this.tableHubService.invokeMethode(TableMethods.SpectatorTable);
        }
      });
  }

  playerAsAdditionPlayerChecked(value: boolean) {
    this.accountService.user
      .pipe(
        switchMap((user) =>
          this.spectatorService.setAsAdditionPlayer(Number(user.id), value)
        ),
        first()
      )
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
