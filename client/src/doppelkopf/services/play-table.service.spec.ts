import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayTableService } from './play-table.service';

describe('PlayTableService', () => {
  let service: PlayTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PlayTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
