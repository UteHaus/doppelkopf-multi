import { Component, Input } from '@angular/core';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.less'],
})
export class PlayersTableComponent {
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
  showPointsForAllPlayers: boolean = false;

  constructor() {}
}
