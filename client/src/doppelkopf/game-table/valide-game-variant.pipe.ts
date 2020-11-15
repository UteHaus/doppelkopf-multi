import { Pipe, PipeTransform } from '@angular/core';
import { GamesVariants } from '../models/play-table.model';

@Pipe({
  name: 'valideGameVariant',
})
export class ValideGameVariantPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    return value != undefined && value != GamesVariants.None;
  }
}
