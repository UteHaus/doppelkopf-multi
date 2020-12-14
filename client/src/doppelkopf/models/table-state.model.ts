import { AdditionPlayerInfo } from './additional-player-info.model';
import { PlayTableCount } from './play-table-count.model';
import { GamesVariants } from './play-table.model';

export class TableState extends PlayTableCount {
  shuffleCount: number;
  players: AdditionPlayerInfo[];
  nextTurnCount: number;
  gameVariant: GamesVariants;

  thisPlayer?: AdditionPlayerInfo;
}
