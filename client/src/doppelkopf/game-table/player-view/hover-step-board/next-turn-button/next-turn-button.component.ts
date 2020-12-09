import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-next-turn-button',
  templateUrl: './next-turn-button.component.html',
  styleUrls: ['./next-turn-button.component.less'],
})
export class NextTurnButtonComponent implements OnInit {
  @Output()
  runNextTurn: Subject<void>;

  @Input()
  set withTimer(value: boolean): void {}

  constructor() {}

  ngOnInit(): void {}

  nextTurn() {
    this.runNextTurn.next();
  }
}
