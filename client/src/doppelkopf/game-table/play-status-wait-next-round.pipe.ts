import { Pipe, PipeTransform } from '@angular/core';
import { PlayTableGame } from '../models/play-table-game.model copy';
import { PlayStatus } from '../models/play-table.model';

@Pipe({
  name: 'playStatusWaitNextRound',
})
export class PlayStatusWaitNextRoundPipe implements PipeTransform {
  transform(value: PlayTableGame): unknown {
    return value.status == PlayStatus.WaitForNextRund;
  }
}
