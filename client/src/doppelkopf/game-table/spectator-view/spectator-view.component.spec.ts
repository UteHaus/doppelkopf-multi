import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpectatorViewComponent } from './spectator-view.component';

describe('SpectatorViewComponent', () => {
  let component: SpectatorViewComponent;
  let fixture: ComponentFixture<SpectatorViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SpectatorViewComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SpectatorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
