import { Pipe, PipeTransform } from '@angular/core';
import { PlayStatus } from '../models/play-table.model';
import { TableState } from '../models/table-state.model';

@Pipe({
  name: 'playStatusWinnerTime',
})
export class PlayStatusWinnerTimePipe implements PipeTransform {
  transform(value: TableState): unknown {
    return value.status == PlayStatus.WinnersTime;
  }
}
