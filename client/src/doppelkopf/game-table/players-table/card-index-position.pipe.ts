import { Pipe, PipeTransform } from '@angular/core';
import { TableUtil } from 'src/doppelkopf/utils/table.util';

@Pipe({
  name: 'cardIndexPosition',
})
export class CardIndexPositionPipe implements PipeTransform {
  transform(position: number, ...args: number[]): number {
    const currentGiverPos = args[0];
    let zIndex = position - TableUtil.getNextPlayerPosition(currentGiverPos);
    zIndex = zIndex < 0 ? 4 + zIndex : zIndex;
    return zIndex + 1;
  }
}
