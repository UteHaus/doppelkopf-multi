import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultTableComponent } from './result-table.component';

describe('ResultTableComponent', () => {
  let component: ResultTableComponent;
  let fixture: ComponentFixture<ResultTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ResultTableComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
