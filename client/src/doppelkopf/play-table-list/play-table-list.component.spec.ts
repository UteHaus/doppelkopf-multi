import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayTableListComponent } from './play-table-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '../../core/app-config';
import { defaultAppConfig } from '@app/app.module';

describe('PlayTableListComponent', () => {
  let component: PlayTableListComponent;
  let fixture: ComponentFixture<PlayTableListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [{ provide: APP_CONFIG, useValue: defaultAppConfig }],
        declarations: [PlayTableListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
