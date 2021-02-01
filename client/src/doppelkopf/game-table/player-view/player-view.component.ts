import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { Card } from 'src/doppelkopf/models/card.model';
import {
  GamesVariants,
  PlayStatus,
} from 'src/doppelkopf/models/play-table.model';
import { TableState } from 'src/doppelkopf/models/table-state.model';
import { PlayTableService } from 'src/doppelkopf/services/play-table.service';
import { TableMethods } from 'src/doppelkopf/services/table-hub-method.enum';
import { TableHubService } from 'src/doppelkopf/services/table-hub.service';
import { TableUtil } from 'src/doppelkopf/utils/table.util';
import { CardMapComponent } from '../card-map/card-map.component';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.less'],
})
export class PlayerViewComponent implements OnInit, OnDestroy, AfterViewInit {
  cardSourceMethode: TableMethods = TableMethods.PlayerCards;
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
    private route: ActivatedRoute,
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

    this.tableHubService.onMethode(TableMethods.PlayerTableState, (state) => {
      this.playTable$.next(this.mapTableStateToThisPlayerState(state));
    });
    this.tableHubService.invokeMethode(TableMethods.PlayerTableState);

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
    this.shuffleCardsClick$.next();
  }

  cardSelected(card: Card): void {
    this.userService.user
      .pipe(
        switchMap((user) =>
          this.tableService.playedCard(card, Number.parseInt(user.id))
        ),
        take(1)
      )
      .subscribe();
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
    this.nextTurnClicked$.next();
  }

  private addSubscription<T>(
    event: Observable<T>,
    sm: (user: User, eventValue: T) => Observable<undefined>
  ): void {
    const observ = combineLatest([this.userService.user, event]).pipe(
      switchMap((userValue) => sm(userValue[0], userValue[1]))
    );
    this.subscription.add(observ.subscribe());
  }

  announcementChanged(announcement: string): void {
    this.userService.user
      .pipe(
        switchMap((user) =>
          this.tableService.setPlayerAnnouncement(
            Number.parseInt(user.id),
            announcement
          )
        ),
        take(1)
      )
      .subscribe();
  }

  showLastStich(visible: boolean): void {
    this.lastStich = visible;
  }

  private mapTableStateToThisPlayerState(state: TableState): TableState {
    if (state) {
      this.userService.user.pipe(first()).subscribe((user) => {
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
    const firstCardPlayer = TableUtil.getNextPlayerPosition(
      table.roundCardsGiversPosition
    );
    if (
      table.status == PlayStatus.Run &&
      table.thisPlayer &&
      table.currentPlayerPosition === table.thisPlayer.playerPosition &&
      firstCardPlayer !== table.thisPlayer.playerPosition &&
      cardMap &&
      cardMap.orderedCards &&
      cardMap.orderedCards.length == 1
    ) {
      cardMap.setLastCard();
      return true;
    }
    return false;
  }
}
