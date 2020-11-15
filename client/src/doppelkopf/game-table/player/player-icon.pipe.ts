import { Pipe, PipeTransform } from '@angular/core';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/play-table-game.model copy';

@Pipe({
  name: 'playerIcon',
})
export class PlayerIconPipe implements PipeTransform {
  transform(value: AdditionPlayerInfo, ...args: unknown[]): unknown {
    return `assets/images/avatar/avatar-${value.playerPosition}.svg`;
  }
}
