import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ValideGameVariantPipe } from '../valide-game-variant.pipe';
import { PlayersTableComponent } from './players-table.component';

describe('PlayersTableComponent', () => {
  let component: PlayersTableComponent;
  let fixture: ComponentFixture<PlayersTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PlayersTableComponent, ValideGameVariantPipe],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
