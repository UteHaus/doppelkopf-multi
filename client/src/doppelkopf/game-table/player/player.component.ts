import { Component, Input, OnInit } from '@angular/core';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less'],
})
export class PlayerComponent implements OnInit {
  @Input()
  player: AdditionPlayerInfo;

  @Input()
  thisPlayer: boolean = false;

  @Input()
  isOnMove: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
