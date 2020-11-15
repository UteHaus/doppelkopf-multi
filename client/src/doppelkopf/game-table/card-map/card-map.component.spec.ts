import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMapComponent } from './card-map.component';

describe('CardMapComponent', () => {
  let component: CardMapComponent;
  let fixture: ComponentFixture<CardMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardMapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
