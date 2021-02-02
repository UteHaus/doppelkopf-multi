import { TestBed } from '@angular/core/testing';

import { JitsiService } from './jitsi.service';

describe('JitsiService', () => {
  let service: JitsiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JitsiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
