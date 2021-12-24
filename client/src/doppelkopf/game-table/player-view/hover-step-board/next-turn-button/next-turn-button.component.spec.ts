import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NextTurnButtonComponent } from './next-turn-button.component';

describe('NextTurnButtonComponent', () => {
  let component: NextTurnButtonComponent;
  let fixture: ComponentFixture<NextTurnButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NextTurnButtonComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NextTurnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
