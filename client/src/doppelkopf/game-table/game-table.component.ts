import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/services';
import { iif, Observable, Subject, Subscription, timer } from 'rxjs';
import {
  flatMap,
  map,
  shareReplay as share,
  switchMap,
  take,
} from 'rxjs/operators';
import { Card, Ranks, Suits } from '../models/card.model';
import {
  AdditionPlayerInfo,
  PlayTableGame,
} from '../models/play-table-game.model copy';
import { GamesVariants } from '../models/play-table.model';
import { PlayTableService } from '../services/play-table.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.less'],
})
export class GameTableComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private lastTableUpdate: number;
  table$: Observable<PlayTableGame>;
  tableId$: Observable<number>;
  testCard: Card = new Card(Suits.clubs, Ranks.queen);
  nextTurnClicked$: Subject<undefined>;
  shuffleCardsClick$: Subject<undefined>;
  variantSelected$: Subject<GamesVariants> = new Subject<GamesVariants>();
  thisPlayer$: Observable<AdditionPlayerInfo>;
  playerInOrder$: Observable<AdditionPlayerInfo[]>;
  updateCounter: number = 0;
  get userId(): number {
    return Number(this.userService.userValue.id);
  }

  constructor(
    private route: ActivatedRoute,
    private tableService: PlayTableService,
    private userService: AccountService
  ) {
    this.lastTableUpdate = new Date(0).getTime();
  }

  ngOnDestroy(): void {
    this.nextTurnClicked$.complete();
    this.shuffleCardsClick$.complete();
    this.variantSelected$.complete();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const tableId$: Observable<number> = this.route.paramMap.pipe(
      map((params) => Number(params.get('id')))
    );
    this.nextTurnClicked$ = new Subject<undefined>();
    this.addSubscription(
      this.nextTurnClicked$.pipe(
        switchMap(() => this.tableService.nextTurn(this.userId))
      )
    );
    this.shuffleCardsClick$ = new Subject<undefined>();
    this.addSubscription(
      this.shuffleCardsClick$.pipe(
        switchMap(() => tableId$),
        switchMap((tableId) => this.tableService.shuffleCards(this.userId))
      )
    );

    this.addSubscription(
      this.variantSelected$.pipe(
        switchMap((variant) =>
          this.tableService.setGameVariant(this.userId, variant)
        )
      )
    );

    this.table$ = tableId$.pipe(
      switchMap((tableId) => this.getAutoRefreshTable(this.userId, tableId)),
      share(1)
    );

    this.thisPlayer$ = this.table$.pipe(
      map((table) => {
        const p = table.players.find((p) => p.playerId == this.userId);
        return p;
      })
    );
    // Arrange player position and this player has position 4 each time.
    this.playerInOrder$ = this.table$.pipe(
      map((table) => {
        table.players.forEach((player) => {
          const player1Pos = player.playerPosition + 4 - table.playerPosition;
          player.viewPosition = player1Pos > 4 ? player1Pos - 4 : player1Pos;
        });
        return table.players.sort(
          (playerA, playerB) => playerA.viewPosition - playerB.viewPosition
        );
      })
    );
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

  private getAutoRefreshTable(
    userId: number,
    tableId: number,
    intervalMilSeconds: number = 1100
  ): Observable<PlayTableGame> {
    return timer(0, intervalMilSeconds).pipe(
      flatMap(() =>
        this.tableService.isTableUpdated(tableId, this.lastTableUpdate)
      ),
      map((runUpdate) => {
        this.updateCounter++;
        if (runUpdate || this.updateCounter > 3) {
          this.lastTableUpdate = Date.now();
          this.updateCounter = 0;
        }
        return runUpdate;
      }),
      share(1),
      flatMap((tableUpdated) =>
        iif(() => tableUpdated, this.tableService.getTableGameState(userId))
      )
    );
  }

  trackPlayer(index: number, player: AdditionPlayerInfo): string {
    return `${player.playerPosition}`;
  }

  nextTurn() {
    this.nextTurnClicked$.next();
  }

  private addSubscription<T>(sub: Observable<T>): void {
    this.subscription.add(sub.subscribe());
  }
}
