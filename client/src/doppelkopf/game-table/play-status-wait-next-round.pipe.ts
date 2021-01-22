import { Pipe, PipeTransform } from '@angular/core';
import { PlayStatus } from '../models/play-table.model';
import { TableState } from '../models/table-state.model';

@Pipe({
  name: 'playStatusWaitNextRound',
})
export class PlayStatusWaitNextRoundPipe implements PipeTransform {
  transform(value: TableState): unknown {
    return value.status === PlayStatus.WaitForNextRund;
  }
}
