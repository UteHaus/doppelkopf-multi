import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectVariantComponent } from './select-variant.component';

describe('SelectVariantComponent', () => {
  let component: SelectVariantComponent;
  let fixture: ComponentFixture<SelectVariantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectVariantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
