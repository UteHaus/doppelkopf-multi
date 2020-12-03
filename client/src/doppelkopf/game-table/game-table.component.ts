import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/services';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Card, Ranks, Suits } from '../models/card.model';
import { TablePlayerState } from '../models/table-player-state.model';
import { GamesVariants } from '../models/play-table.model';
import { PlayTableService } from '../services/play-table.service';
import { TableHubService } from '../services/table-hub.service';
import { AdditionPlayerInfo } from '../models/additional-player-info.model';
import { TableMethods } from '../services/table-hub-method.enum';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.less'],
})
export class GameTableComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  table$: Observable<TablePlayerState>;
  tableId$: Observable<number>;
  testCard: Card = new Card(Suits.clubs, Ranks.queen);
  nextTurnClicked$: Subject<undefined>;
  shuffleCardsClick$: Subject<undefined>;
  variantSelected$: Subject<GamesVariants> = new Subject<GamesVariants>();
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

    this.table$ = this.tableHubService.tableGame$.pipe(
      shareReplay(),
      map((playTable) => {
        playTable.thisPlayer = playTable.players.find(
          (p) => p.playerId == this.userId
        );
        playTable.players.forEach((player) => {
          const player1Pos =
            player.playerPosition + 4 - playTable.playerPosition;
          player.viewPosition = player1Pos > 4 ? player1Pos - 4 : player1Pos;
        });
        console.log('oder players');
        playTable.players = playTable.players.sort(
          (playerA, playerB) => playerA.viewPosition - playerB.viewPosition
        );

        return playTable;
      })
    );

    this.tableHubService.InvokeMethode(TableMethods.PlayerTableState);

    this.playerInOrder$ = this.table$.pipe(
      map((playTable) => {
        playTable.players.forEach((player) => {
          const player1Pos =
            player.playerPosition + 4 - playTable.playerPosition;
          player.viewPosition = player1Pos > 4 ? player1Pos - 4 : player1Pos;
        });
        console.log('oder players');
        return playTable.players.sort(
          (playerA, playerB) => playerA.viewPosition - playerB.viewPosition
        );
      })
    );

    this.addSubscription(
      this.nextTurnClicked$.pipe(
        switchMap(() => this.tableService.nextTurn(this.userId))
      )
    );
    this.shuffleCardsClick$ = new Subject<undefined>();
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
    this.tableHubService.InvokeMethode(TableMethods.PlayerTableState);
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
}
