import { Component, Input } from '@angular/core';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { TableState } from 'src/doppelkopf/models/table-state.model';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.less'],
})
export class ResultTableComponent {
  @Input()
  set tablePlayerState(value: TableState) {
    this.winners = value.players.filter((player) => player.roundWinner);
    this.loser = value.players.filter((player) => !player.roundWinner);
    this.loserPoints = this.loser.reduce(
      (sum: number, player: AdditionPlayerInfo) => sum + player.roundsPoints,
      0
    );
    this.winnerPoints = this.winners.reduce(
      (sum: number, player: AdditionPlayerInfo) => sum + player.roundsPoints,
      0
    );
  }
  playersWinner: AdditionPlayerInfo[];
  winners: AdditionPlayerInfo[];
  winnerPoints: number;
  loserPoints: number;
  loser: AdditionPlayerInfo[];
}
