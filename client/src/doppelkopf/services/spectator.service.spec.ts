import { TestBed } from '@angular/core/testing';
import { SpectatorService } from './spectator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpectatosService', () => {
  let service: SpectatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SpectatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
