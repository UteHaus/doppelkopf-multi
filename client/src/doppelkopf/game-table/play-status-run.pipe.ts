import { Pipe, PipeTransform } from '@angular/core';
import { PlayStatus, PlayTable } from '../models/play-table.model';

@Pipe({
  name: 'playStatusRun',
})
export class PlayStatusRunPipe implements PipeTransform {
  transform(value: PlayTable, ...args: unknown[]): boolean {
    return value.status == PlayStatus.Run;
  }
}
