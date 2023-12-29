import { TestBed } from '@angular/core/testing';

import { InspectionProgramGuard } from './inspection-program.guard';

describe('InspectionProgramGuard', () => {
  let guard: InspectionProgramGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InspectionProgramGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
