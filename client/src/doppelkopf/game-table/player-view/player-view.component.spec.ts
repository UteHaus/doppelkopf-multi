import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerViewComponent } from './player-view.component';

describe('PlayerViewComponent', () => {
  let component: PlayerViewComponent;
  let fixture: ComponentFixture<PlayerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
