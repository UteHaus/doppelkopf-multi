import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { TableState } from '../../models/table-state.model';
import { AdditionPlayerInfo } from '../../models/additional-player-info.model';
import { Card } from '../../models/card.model';
import { GamesVariants } from '../../models/play-table.model';

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
  showPointsForAllPlayers: false;

  @Input()
  showCardsOfPlayer = -1;

  @Input()
  enableShowCardsOfPlayer = false;

  @Input()
  tableState!: TableState;

  @Output()
  showCardsOfPlayersSelected: EventEmitter<AdditionPlayerInfo> = new EventEmitter();

  @Output()
  announcementChanged: EventEmitter<string> = new EventEmitter();

  @Output()
  showLastStich = new EventEmitter<void>();

  @Output()
  shuffleCardsSelected = new EventEmitter<void>();

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

  shuffleCards(): void {
    this.shuffleCardsSelected.emit();
  }
}
