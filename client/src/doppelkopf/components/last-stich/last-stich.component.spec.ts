import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LastStichComponent } from './last-stich.component';

describe('LastStichComponent', () => {
  let component: LastStichComponent;
  let fixture: ComponentFixture<LastStichComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LastStichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastStichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
