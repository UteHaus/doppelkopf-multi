import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { Card } from 'src/doppelkopf/models/card.model';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.less'],
})
export class PlayersTableComponent implements OnDestroy {
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
  showPointsForAllPlayers: false;

  @Input()
  showCardsOfPlayer = -1;

  @Input()
  enableShowCardsOfPlayer = false;

  @Output()
  showCardsOfPlayersSelected: EventEmitter<
    AdditionPlayerInfo
  > = new EventEmitter();

  @Output()
  announcementChanged: EventEmitter<string> = new EventEmitter();

  @Output()
  showLastStich = new EventEmitter<void>();

  ngOnDestroy(): void {
    this.showCardsOfPlayersSelected.complete();
  }

  showCardsOf(player: AdditionPlayerInfo): void {
    this.showCardsOfPlayersSelected.emit(player);
  }

  trackCards(card: Card): string {
    return `${card.rank}-${card.suit}`;
  }
  trackPlayer(player: AdditionPlayerInfo): number {
    return player.viewPosition;
  }

  announcementSelected(announcement: string): void {
    this.announcementChanged.emit(announcement);
  }

  lastStich(): void {
    this.showLastStich.emit();
  }
}
