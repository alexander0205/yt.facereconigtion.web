import { TestBed } from '@angular/core/testing';

import { UserServiceResolverGuard } from './user-service-resolver.guard';

describe('UserServiceResolverService', () => {
  let service: UserServiceResolverGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServiceResolverGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
