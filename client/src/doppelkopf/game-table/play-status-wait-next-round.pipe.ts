import { Pipe, PipeTransform } from '@angular/core';
import { TablePlayerState } from '../models/table-player-state.model';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'playStatusWaitNextRound',
})
export class PlayStatusWaitNextRoundPipe implements PipeTransform {
  transform(value: TablePlayerState): unknown {
    return value.status == PlayStatus.WaitForNextRund;
  }
}
