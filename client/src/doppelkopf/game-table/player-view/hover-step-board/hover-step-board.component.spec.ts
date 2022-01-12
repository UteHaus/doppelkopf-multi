import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayStatusRunPipe } from '../../play-status-run.pipe';
import { PlayStatusSelectVariantPipe } from '../../play-status-select-variant.pipe';
import { PlayStatusWaitNextRoundPipe } from '../../play-status-wait-next-round.pipe';
import { PlayStatusWinnerTimePipe } from '../../play-status-winner-time.pipe';
import { ValideGameVariantPipe } from '../../valide-game-variant.pipe';
import { HoverStepBoardComponent } from './hover-step-board.component';

describe('HoverStepBoardComponent', () => {
  let component: HoverStepBoardComponent;
  let fixture: ComponentFixture<HoverStepBoardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          HoverStepBoardComponent,
          ValideGameVariantPipe,
          PlayStatusSelectVariantPipe,
          PlayStatusWaitNextRoundPipe,
          PlayStatusWinnerTimePipe,
          PlayStatusRunPipe,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverStepBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
