import { Pipe, PipeTransform } from '@angular/core';
import { PlayTableGame } from '../models/play-table-game.model copy';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'playStatusSelectVariant',
})
export class PlayStatusSelectVariantPipe implements PipeTransform {
  transform(value: PlayTableGame, ...args: unknown[]): unknown {
    return value.status == PlayStatus.SelectGameVarian;
  }
}
