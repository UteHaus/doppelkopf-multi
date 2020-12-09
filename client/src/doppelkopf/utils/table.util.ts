import { AdditionPlayerInfo } from '../models/additional-player-info.model';

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

  private static setViewPositionOfPlayer(
    player: AdditionPlayerInfo,
    thisPlayerPosition: number
  ): void {
    const player1Pos = player.playerPosition + 4 - thisPlayerPosition;
    player.viewPosition = player1Pos > 4 ? player1Pos - 4 : player1Pos;
  }
}
