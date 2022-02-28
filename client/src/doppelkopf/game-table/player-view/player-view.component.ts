import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';
import { CardUtil } from 'src/doppelkopf/utils/card.util';
import { AdditionPlayerInfo } from '../../models/additional-player-info.model';
import { Card } from '../../models/card.model';
import { GamesVariants, PlayStatus } from '../../models/play-table.model';
import { TableState } from '../../models/table-state.model';
import { PlayTableService } from '../../services/play-table.service';
import { TableMethods } from '../../services/table-hub-method.enum';
import { TableHubService } from '../../services/table-hub.service';
import { TableUtil } from '../../utils/table.util';
import { CardMapComponent } from '../card-map/card-map.component';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.less'],
})
export class PlayerViewComponent implements OnInit, OnDestroy, AfterViewInit {
  private playerCards$: BehaviorSubject<Card[]> = new BehaviorSubject([]);
  sortPlayerCards$: Observable<Card[]>;
  playTable$ = new BehaviorSubject<TableState>(null);
  private subscription: Subscription = new Subscription();
  nextTurnClicked$ = new Subject();
  waitingForNextTurnPlayers$: Observable<string[]>;
  shuffleCardsClick$ = new Subject();
  variantSelected$: Subject<GamesVariants> = new Subject<GamesVariants>();
  playerInOrder$: Observable<AdditionPlayerInfo[]>;
  lastStich = false;
  private autoSetLastCard: Subscription;
  @ViewChildren(CardMapComponent)
  private cardMap: QueryList<CardMapComponent>;

  constructor(
    private tableService: PlayTableService,
    private userService: AccountService,
    private tableHubService: TableHubService
  ) {}

  ngAfterViewInit(): void {
    this.autoSetLastCard = combineLatest([
      this.cardMap.changes,
      this.playTable$,
    ])
      .pipe(
        map((state) =>
          this.setLastCard(state[1], state[0] ? state[0].first : null)
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.tableHubService.offMethode(TableMethods.PlayerTableState);
    this.tableHubService.offMethode(TableMethods.PlayerCards);
    this.nextTurnClicked$.complete();
    this.shuffleCardsClick$.complete();
    this.variantSelected$.complete();
    this.subscription.unsubscribe();
    this.autoSetLastCard.unsubscribe();
  }

  ngOnInit(): void {
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
    this.sortPlayerCards$ = combineLatest([
      this.playerCards$,
      this.playTable$,
    ]).pipe(
      map(([playerCards, playTable]) =>
        playerCards?.length > 0
          ? CardUtil.orderCards(
              playerCards,
              playTable.gameVariant,
              playTable.diamondsAceAsMaster
            )
          : []
      )
    );

    this.tableHubService.onMethode(
      TableMethods.PlayerTableState,
      (state: TableState) => {
        this.playTable$.next(this.mapTableStateToThisPlayerState(state));
        if (state.status === PlayStatus.SelectGameVarian)
          this.tableHubService.invokeMethode(TableMethods.PlayerCards);
      }
    );
    this.tableHubService.invokeMethode(TableMethods.PlayerTableState);

    this.tableHubService.onMethode(TableMethods.PlayerCards, (playedCards) => {
      this.playerCards$.next(playedCards);
    });
    this.tableHubService.invokeMethode(TableMethods.PlayerCards);

    this.addSubscription(this.nextTurnClicked$, (user) =>
      this.tableService.nextTurn(Number.parseInt(user.id))
    );
    this.addSubscription(this.shuffleCardsClick$, (user) =>
      this.tableService.shuffleCards(Number.parseInt(user.id))
    );
    this.addSubscription(this.variantSelected$, (user, variant) =>
      this.tableService.setGameVariant(Number.parseInt(user.id), variant)
    );
  }

  reloadTable(): void {
    this.tableHubService.invokeMethode(TableMethods.PlayerTableState);
  }

  shuffleCards(): void {
    this.shuffleCardsClick$.next(null);
  }

  cardSelected(card: Card): void {
    firstValueFrom(
      this.userService.user.pipe(
        switchMap((user) =>
          this.tableService.playedCard(card, Number.parseInt(user.id))
        )
      )
    ).then();
  }

  variantSelected(variant: GamesVariants): void {
    this.variantSelected$.next(variant);
  }

  showVariantSelection(variant: GamesVariants): boolean {
    return variant == GamesVariants.None;
  }

  trackPlayer(player: AdditionPlayerInfo): string {
    return `${player.playerPosition}`;
  }

  nextTurn(): void {
    this.nextTurnClicked$.next(null);
  }

  announcementChanged(announcement: string): void {
    firstValueFrom(
      this.userService.user.pipe(
        switchMap((user) =>
          this.tableService.setPlayerAnnouncement(
            Number.parseInt(user.id),
            announcement
          )
        )
      )
    ).then();
  }

  showLastStich(visible: boolean): void {
    this.lastStich = visible;
  }

  private addSubscription<T>(
    event: Observable<T>,
    sm: (user: User, eventValue: T) => Observable<undefined>
  ): void {
    const observable = combineLatest([this.userService.user, event]).pipe(
      switchMap((userValue) => sm(userValue[0], userValue[1]))
    );
    this.subscription.add(observable.subscribe());
  }

  private mapTableStateToThisPlayerState(state: TableState): TableState {
    if (state) {
      firstValueFrom(this.userService.user.pipe(first())).then((user) => {
        state.thisPlayer = state.players.find(
          (p) => p.playerId == Number(user.id)
        );
        state.players = TableUtil.orderPlayersByPositionAndSetViewPosition(
          state.players,
          state.thisPlayer.playerPosition
        );
      });
    }

    return state;
  }

  private setLastCard(table: TableState, cardMap: CardMapComponent): boolean {
    if (
      cardMap &&
      cardMap.playerCards?.length === 1 &&
      table.status == PlayStatus.Run &&
      table.thisPlayer &&
      table.currentPlayerPosition === table.thisPlayer.playerPosition &&
      table.players.filter((player) => player.playedCard !== null).length > 0
    ) {
      cardMap.setLastCard();
      return true;
    }
    return false;
  }
}
