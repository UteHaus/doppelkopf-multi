import { Component, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';
import { TableState } from 'src/doppelkopf/models/table-state.model';

@Component({
  selector: 'app-hover-step-board',
  templateUrl: './hover-step-board.component.html',
  styleUrls: ['./hover-step-board.component.less'],
})
export class HoverStepBoardComponent implements OnDestroy {
  @Input()
  tablePlayerState: TableState;
  @Output()
  gameVariantSelected: Subject<GamesVariants> = new Subject();
  @Output()
  runNextTurn: Subject<void> = new Subject();

  @Input()
  waitingForPlayers$: Observable<string[]>;

  constructor() {}

  ngOnDestroy(): void {
    if (this.gameVariantSelected) this.gameVariantSelected.complete();
    if (this.runNextTurn) this.runNextTurn.complete();
  }

  variantSelected(variant: GamesVariants) {
    this.gameVariantSelected.next(variant);
  }

  nextTurn() {
    this.runNextTurn.next();
  }
}
