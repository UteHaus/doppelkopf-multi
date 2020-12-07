import { AdditionPlayerInfo } from './additional-player-info.model';
import { Card } from './card.model';
import { TableState } from './table-players.model';

export class TablePlayerState extends TableState {
  cards: Card[];
  playerPosition: number;

  thisPlayer?: AdditionPlayerInfo;
}
