import { Pipe, PipeTransform } from '@angular/core';
import { PlayStatus } from '../models/play-table.model';
import { TableState } from '../models/table-state.model';

@Pipe({
  name: 'showCards',
})
export class ShowCardsPipe implements PipeTransform {
  transform(value: TableState, ...args: unknown[]): unknown {
    return (
      value.status == PlayStatus.Run ||
      value.status == PlayStatus.WaitForNextRund ||
      value.status == PlayStatus.SelectGameVarian
    );
  }
}
