import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { GamesVariants } from 'src/doppelkopf/models/play-table.model';

@Component({
  selector: 'app-select-variant',
  templateUrl: './select-variant.component.html',
  styleUrls: ['./select-variant.component.less'],
})
export class SelectVariantComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {}

  ngOnInit(): void {}

  setVariant(varian: GamesVariants): void {
    this.showMenu = !this.showMenu;
    this.selected.emit(varian);
  }
}
