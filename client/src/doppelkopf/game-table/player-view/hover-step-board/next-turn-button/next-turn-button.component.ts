import {
  AfterViewInit,
  Component,
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
  private timerSecondsCount: number = 3;
  countDown$: Observable<number>;

  @Output()
  runNextTurn: Subject<void> = new Subject();

  @Input()
  withTimer: boolean;

  constructor() {}
  ngAfterViewInit(): void {
    if (this.withTimer) {
      this.timerSub.next();
    }
  }

  ngOnDestroy(): void {
    this.timerSub.complete();
  }

  ngOnInit(): void {
    this.countDown$ = this.timerSub.pipe(
      switchMap(() => timer(0, 1000)),
      take(this.timerSecondsCount + 1),
      map((count) => {
        if (count == this.timerSecondsCount) {
          console.log('counter ' + count);
          this.runNextTurn.next();
        } else {
          return this.timerSecondsCount - count;
        }
      })
    );
  }

  nextTurn() {
    this.runNextTurn.next();
  }
}
