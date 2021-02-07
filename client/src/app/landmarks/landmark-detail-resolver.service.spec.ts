import { TestBed } from '@angular/core/testing';

import { LandmarkDetailResolverService } from './landmark-detail-resolver.service';

describe('LandmarkDetailResolverService', () => {
  let service: LandmarkDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandmarkDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
