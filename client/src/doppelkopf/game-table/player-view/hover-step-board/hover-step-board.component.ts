import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { GamesVariants } from 'src/doppelkopf/models/play-table.model';
import { TablePlayerState } from 'src/doppelkopf/models/table-player-state.model';

@Component({
  selector: 'app-hover-step-board',
  templateUrl: './hover-step-board.component.html',
  styleUrls: ['./hover-step-board.component.less'],
})
export class HoverStepBoardComponent implements OnInit, OnDestroy {
  @Input()
  tablePlayerState: TablePlayerState;
  @Output()
  gameVariantSelected: Subject<GamesVariants>;
  @Output()
  runNextTurn: Subject<void>;

  constructor() {}

  ngOnDestroy(): void {
    if (this.gameVariantSelected) this.gameVariantSelected.complete();
    if (this.runNextTurn) this.runNextTurn.complete();
  }

  ngOnInit(): void {
    this.gameVariantSelected = new Subject();
    this.runNextTurn = new Subject();
  }

  variantSelected(variant: GamesVariants) {
    this.gameVariantSelected.next(variant);
  }

  nextTurn() {
    this.runNextTurn.next();
  }
}
