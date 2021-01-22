import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-next-turn-button',
  templateUrl: './next-turn-button.component.html',
  styleUrls: ['./next-turn-button.component.less'],
})
export class NextTurnButtonComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private timerSub = new Subject<void>();
  private timerSecondsCount: number = 2;
  countDown$: Observable<number>;

  @Output()
  runNextTurn: EventEmitter<void> = new EventEmitter();

  @Input()
  withTimer: boolean;

  constructor() {
    this.countDown$ = this.timerSub.pipe(
      switchMap(() => timer(0, 1000)),
      take(this.timerSecondsCount + 1),
      map((count) => {
        if (count == this.timerSecondsCount) {
          this.runNextTurn.next();
        } else {
          return this.timerSecondsCount - count;
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.withTimer) {
      this.timerSub.next();
    }
  }

  ngOnDestroy(): void {
    this.timerSub.complete();
  }

  ngOnInit(): void {}

  nextTurn() {
    this.runNextTurn.emit();
  }
}
