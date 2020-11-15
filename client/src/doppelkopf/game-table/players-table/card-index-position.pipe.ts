import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardIndexPosition',
})
export class CardIndexPositionPipe implements PipeTransform {
  transform(position: number, ...args: number[]): number {
    const currentGiverPos = args[0];
    let zIndex = position - (currentGiverPos + 1);
    zIndex = zIndex < 0 ? 4 + zIndex : zIndex;
    return zIndex + 1;
  }
}
