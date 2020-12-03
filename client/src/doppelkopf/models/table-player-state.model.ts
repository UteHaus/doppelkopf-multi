import { AdditionPlayerInfo } from './additional-player-info.model';
import { Card } from './card.model';
import { TablePlayers } from './table-players.model';

export class TablePlayerState extends TablePlayers {
  cards: Card[];

  thisPlayer?: AdditionPlayerInfo;
}
