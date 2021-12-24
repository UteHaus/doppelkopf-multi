import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemUserComponent } from './nav-item-user.component';

describe('NavItemUserComponent', () => {
  let component: NavItemUserComponent;
  let fixture: ComponentFixture<NavItemUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavItemUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavItemUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
