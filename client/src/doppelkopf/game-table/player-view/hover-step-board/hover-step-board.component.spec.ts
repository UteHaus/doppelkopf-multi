import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverStepBoardComponent } from './hover-step-board.component';

describe('HoverStepBoardComponent', () => {
  let component: HoverStepBoardComponent;
  let fixture: ComponentFixture<HoverStepBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HoverStepBoardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverStepBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
