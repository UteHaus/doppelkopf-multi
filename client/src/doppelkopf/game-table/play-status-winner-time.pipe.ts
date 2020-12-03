import { Pipe, PipeTransform } from '@angular/core';
import { PlayTableCount } from '../models/play-table-count.model';
import { TablePlayerState } from '../models/table-player-state.model';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'playStatusWinnerTime',
})
export class PlayStatusWinnerTimePipe implements PipeTransform {
  transform(value: TablePlayerState, ...args: unknown[]): unknown {
    return value.status == PlayStatus.WinnersTime;
  }
}
