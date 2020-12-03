import { Pipe, PipeTransform } from '@angular/core';
import { TablePlayerState } from '../models/table-player-state.model';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'showCards',
})
export class ShowCardsPipe implements PipeTransform {
  transform(value: TablePlayerState, ...args: unknown[]): unknown {
    return (
      value.status == PlayStatus.Run ||
      value.status == PlayStatus.WaitForNextRund ||
      value.status == PlayStatus.SelectGameVarian
    );
  }
}
