import { Pipe, PipeTransform } from '@angular/core';
import { PlayTableCount } from '../models/play-table-count.model';
import { PlayTableGame } from '../models/play-table-game.model copy';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'playStatusWinnerTime',
})
export class PlayStatusWinnerTimePipe implements PipeTransform {
  transform(value: PlayTableGame, ...args: unknown[]): unknown {
    return value.status == PlayStatus.WinnersTime;
  }
}
