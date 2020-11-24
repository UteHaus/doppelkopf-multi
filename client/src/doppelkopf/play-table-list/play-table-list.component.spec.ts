import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTableListComponent } from './play-table-list.component';

describe('PlayTableListComponent', () => {
  let component: PlayTableListComponent;
  let fixture: ComponentFixture<PlayTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayTableListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
