import { Pipe, PipeTransform } from '@angular/core';
import { GamesVariants } from '../models/play-table.model';

@Pipe({
  name: 'gameVariantNormal',
})
export class GameVariantNormalPipe implements PipeTransform {
  transform(value: GamesVariants): unknown {
    return value == GamesVariants.Normal;
  }
}
