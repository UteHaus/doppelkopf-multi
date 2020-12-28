import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/services';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { Card } from 'src/doppelkopf/models/card.model';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';
import { TableState } from 'src/doppelkopf/models/table-state.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { TableMethods } from 'src/doppelkopf/services/table-hub-method.enum';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';
import { TableUtil } from 'src/doppelkopf/utils/table.util';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.less'],
})
export class PlayerViewComponent implements OnInit, OnDestroy {
  cardSourceMethode: TableMethods = TableMethods.PlayerCards;
  private tablePlayerStateSubject = new BehaviorSubject<TableState>(null);
  playTable$: Observable<TableState>;
  private subscription: Subscription = new Subscription();
  nextTurnClicked$: Subject<void>;
  waitingForNextTurnPlayers$: Observable<string[]>;
  shuffleCardsClick$: Subject<void>;
  variantSelected$: Subject<GamesVariants> = new Subject<GamesVariants>();
  playerInOrder$: Observable<AdditionPlayerInfo[]>;
  lastStich: boolean = false;
  get userId(): number {
    return Number(this.userService.userValue.id);
  }

  constructor(
    private route: ActivatedRoute,
    private tableService: PlayTableService,
    private userService: AccountService,
    private tableHubService: TableHubService
  ) {}
  ngOnDestroy(): void {
    this.tableHubService.offMethode(TableMethods.PlayerTableState);
    this.nextTurnClicked$.complete();
    this.shuffleCardsClick$.complete();
    this.variantSelected$.complete();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const tableId$: Observable<number> = this.route.paramMap.pipe(
      map((params) => Number(params.get('id')))
    );
    this.nextTurnClicked$ = new Subject();

    this.playTable$ = this.tablePlayerStateSubject.pipe(
      shareReplay(),
      map((playTable) => {
        if (playTable) {
          playTable.thisPlayer = playTable.players.find(
            (p) => p.playerId == Number(this.userService.userValue.id)
          );
          playTable.players = TableUtil.orderPlayersByPositionAndSetViewPosition(
            playTable.players,
            playTable.thisPlayer.playerPosition
          );
        }

        return playTable;
      })
    );
    this.waitingForNextTurnPlayers$ = this.playTable$.pipe(
      map((tableState) => {
        if (tableState) {
          return tableState.players
            .filter((player) => !player.nextTurn)
            .map((player) => player.userName);
        }
        return [];
      })
    );

    this.tableHubService.onMethode(TableMethods.PlayerTableState, (state) => {
      this.tablePlayerStateSubject.next(state);
    });
    this.tableHubService.invokeMethode(TableMethods.PlayerTableState);

    this.addSubscription(
      this.nextTurnClicked$.pipe(
        switchMap(() => this.tableService.nextTurn(this.userId))
      )
    );
    this.shuffleCardsClick$ = new Subject();
    this.addSubscription(
      this.shuffleCardsClick$.pipe(
        switchMap(() => tableId$),
        switchMap(() => this.tableService.shuffleCards(this.userId))
      )
    );

    this.addSubscription(
      this.variantSelected$.pipe(
        switchMap((variant) =>
          this.tableService.setGameVariant(this.userId, variant)
        )
      )
    );
  }

  reloadTable() {
    this.tableHubService.invokeMethode(TableMethods.PlayerTableState);
  }

  shuffleCards(): void {
    this.shuffleCardsClick$.next();
  }

  cardSelected(card: Card) {
    this.tableService.playedCard(card, this.userId).subscribe();
  }

  variantSelected(variant: GamesVariants) {
    this.variantSelected$.next(variant);
  }

  showVariantSelection(variant: GamesVariants): boolean {
    return variant == GamesVariants.None;
  }

  trackPlayer(player: AdditionPlayerInfo): string {
    return `${player.playerPosition}`;
  }

  nextTurn() {
    this.nextTurnClicked$.next();
  }

  private addSubscription<T>(sub: Observable<T>): void {
    this.subscription.add(sub.subscribe());
  }

  announcementChanged(announcement: string) {
    this.tableService
      .setPlayerAnnouncement(this.userId, announcement)
      .pipe(take(1))
      .subscribe();
  }
  showLastStich(visible: boolean): void {
    this.lastStich = visible;
  }
}
