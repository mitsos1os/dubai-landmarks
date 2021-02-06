import { TestBed } from '@angular/core/testing';

import { NotLoggedInGuard } from './not-logged-in-guard.service';

describe('LoggedinGuard', () => {
  let guard: NotLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
