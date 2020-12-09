import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/services';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { Card } from 'src/doppelkopf/models/card.model';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';
import { TablePlayerState } from 'src/doppelkopf/models/table-player-state.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { TableMethods } from 'src/doppelkopf/services/table-hub-method.enum';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.less'],
})
export class PlayerViewComponent implements OnInit, OnDestroy {
  private tablePlayerStateSubject = new BehaviorSubject<TablePlayerState>(null);
  playTable$: Observable<TablePlayerState>;
  private subscription: Subscription = new Subscription();
  nextTurnClicked$: BehaviorSubject<void>;
  shuffleCardsClick$: BehaviorSubject<void>;
  variantSelected$: BehaviorSubject<GamesVariants> = new BehaviorSubject<
    GamesVariants
  >(GamesVariants.None);
  playerInOrder$: Observable<AdditionPlayerInfo[]>;
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
    this.nextTurnClicked$ = new BehaviorSubject(null);

    this.playTable$ = this.tablePlayerStateSubject.pipe(
      shareReplay(),
      map((playTable) => {
        if (playTable) {
          playTable.thisPlayer = playTable.players.find(
            (p) => p.playerId == Number(this.userService.userValue.id)
          );
          playTable.players.forEach((player) => {
            this.setViewPositionOfPlayer(player, playTable);
          });
          playTable.players = playTable.players.sort(
            (playerA, playerB) => playerA.viewPosition - playerB.viewPosition
          );
        }

        return playTable;
      })
    );

    this.tableHubService.onMethode(TableMethods.PlayerTableState, (state) =>
      this.tablePlayerStateSubject.next(state)
    );
    this.tableHubService.invokeMethode(TableMethods.PlayerTableState);

    this.addSubscription(
      this.nextTurnClicked$.pipe(
        switchMap(() => this.tableService.nextTurn(this.userId))
      )
    );
    this.shuffleCardsClick$ = new BehaviorSubject(null);
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

  private setViewPositionOfPlayer(
    player: AdditionPlayerInfo,
    playTable: TablePlayerState
  ): void {
    const player1Pos = player.playerPosition + 4 - playTable.playerPosition;
    player.viewPosition = player1Pos > 4 ? player1Pos - 4 : player1Pos;
  }
}
