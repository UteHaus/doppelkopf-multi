import { Card } from './card.model';
import { GamesVariants, PlayTable } from './play-table.model';

export class PlayTableGame extends PlayTable {
  userCount: number;
  shuffleCount: number;
  cards: Card[];
  players: AdditionPlayerInfo[];
  nextTurnCount: number;
  gameVariant: GamesVariants;

  thisPlayer?: AdditionPlayerInfo;
}

export class AdditionPlayerInfo {
  playerId: number;
  playerPosition: number;
  userName: string;
  shuffleRound: boolean;
  gameVariant: GamesVariants;
  playedCard: Card;

  nextTurn: boolean;

  viewPosition: number;
}
