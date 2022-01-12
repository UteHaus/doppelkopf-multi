import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';

import { AnnouncementSelectorComponent } from './announcement-selector.component';

describe('AnnouncementSelectorComponent', () => {
  let component: AnnouncementSelectorComponent;
  let fixture: ComponentFixture<AnnouncementSelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forChild()],
        declarations: [AnnouncementSelectorComponent],
        providers: [TranslateStore],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
