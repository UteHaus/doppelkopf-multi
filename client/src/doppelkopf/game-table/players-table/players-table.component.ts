import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AccountService } from '@app/services';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { Card } from 'src/doppelkopf/models/card.model';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';
import { SpectatorService } from 'src/doppelkopf/services/spectator.service';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.less'],
})
export class PlayersTableComponent implements OnInit, OnDestroy {
  @Input()
  players: AdditionPlayerInfo[];

  @Input()
  thisPlayerId: number;

  @Input()
  positionOnMove: number;

  @Input()
  currentGiverPos: number;

  @Input()
  tableGameVariant: GamesVariants;

  @Input()
  showPointsForAllPlayers: boolean = false;

  @Input()
  showCardsOfPlayer: number = -1;

  @Input()
  enableShowCardsOfPlayer: boolean = false;

  @Output()
  showCardsOfPlayersSelected: EventEmitter<
    AdditionPlayerInfo
  > = new EventEmitter();

  constructor() {}

  ngOnDestroy(): void {
    this.showCardsOfPlayersSelected.complete();
  }

  ngOnInit(): void {}

  showCardsOf(player: AdditionPlayerInfo) {
    this.showCardsOfPlayersSelected.emit(player);
  }

  trackCards(index: number, card: Card): string {
    return `${card.rank}-${card.suit}`;
  }
}
