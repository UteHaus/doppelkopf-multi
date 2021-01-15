import { AdditionPlayerInfo } from '../models/additional-player-info.model';
import { TableState } from '../models/table-state.model';

export class TableUtil {
  /**
   * Sort players the ever time this player at the last postion
   * @param players Players of one Table
   * @param thisPlayerPosition The Player position of this instance.
   */
  public static orderPlayersByPositionAndSetViewPosition(
    players: AdditionPlayerInfo[],
    thisPlayerPosition: number
  ): AdditionPlayerInfo[] {
    players.forEach((player) => {
      this.setViewPositionOfPlayer(player, thisPlayerPosition);
    });
    return players.sort(
      (playerA, playerB) => playerA.viewPosition - playerB.viewPosition
    );
  }

  /**
   * Giv the nex postion of the given position.
   * @param position player position
   */
  public static getNextPlayerPosition(position: number) {
    return position + 1 > 4 ? 1 : position + 1;
  }

  /**
   * return the card of the player position x.
   * @param table play table
   * @param position player position.
   */
  public static getPlayedCardOfPlayerPosition(
    table: TableState,
    position: number
  ) {
    const playerOfPosition = table.players.find(
      (player) => player.playerPosition == position
    );
    return playerOfPosition.playedCard;
  }

  private static setViewPositionOfPlayer(
    player: AdditionPlayerInfo,
    thisPlayerPosition: number
  ): void {
    const player1Pos = player.playerPosition + 4 - thisPlayerPosition;
    player.viewPosition = player1Pos > 4 ? player1Pos - 4 : player1Pos;
  }
}
