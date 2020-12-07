import { Pipe, PipeTransform } from '@angular/core';
import { AdditionPlayerInfo } from 'src/doppelkopf/models/additional-player-info.model';

@Pipe({
  name: 'playerIcon',
})
export class PlayerIconPipe implements PipeTransform {
  transform(value: AdditionPlayerInfo, ...args: unknown[]): unknown {
    return `assets/images/avatar/avatar-${value.playerPosition}.svg`;
  }
}
