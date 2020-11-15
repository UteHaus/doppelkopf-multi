import { Pipe, PipeTransform } from '@angular/core';
import { PlayTableGame } from '../models/play-table-game.model copy';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'showCards',
})
export class ShowCardsPipe implements PipeTransform {
  transform(value: PlayTableGame, ...args: unknown[]): unknown {
    return (
      value.status == PlayStatus.Run ||
      value.status == PlayStatus.WaitForNextRund ||
      value.status == PlayStatus.SelectGameVarian
    );
  }
}
