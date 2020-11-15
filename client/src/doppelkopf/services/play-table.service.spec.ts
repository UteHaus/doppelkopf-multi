import { TestBed } from '@angular/core/testing';

import { PlayTableService } from './play-table.service';

describe('PlayTableService', () => {
  let service: PlayTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
