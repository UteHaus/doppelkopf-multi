import { Card } from './card.model';
import { GamesVariants } from './play-table.model';

export class AdditionPlayerInfo {
  playerId: number;
  playerPosition: number;
  userName: string;
  shuffleRound: boolean;
  gameVariant: GamesVariants;
  playedCard: Card;
  message: string;
  dutyAnnouncement: string;
  roundWinner: boolean;

  nextTurn: boolean;
  roundsPoints: number;
  viewPosition: number;
}
