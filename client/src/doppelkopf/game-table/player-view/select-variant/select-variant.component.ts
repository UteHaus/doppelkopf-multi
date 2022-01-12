import { Component, EventEmitter, Output } from '@angular/core';
import { GamesVariants } from '../../../models/play-table.model';

@Component({
  selector: 'app-select-variant',
  templateUrl: './select-variant.component.html',
  styleUrls: ['./select-variant.component.less'],
})
export class SelectVariantComponent {
  @Output()
  selected = new EventEmitter<GamesVariants>();
  variants: GamesVariants[] = Object.keys(GamesVariants)
    .map((k) => GamesVariants[k])
    .filter(
      (variant) =>
        variant != GamesVariants.None && variant != GamesVariants.SuitSolo
    );
  showMenu: boolean = false;

  constructor() {}

  setVariant(varian: GamesVariants): void {
    this.showMenu = !this.showMenu;
    this.selected.emit(varian);
  }
}
