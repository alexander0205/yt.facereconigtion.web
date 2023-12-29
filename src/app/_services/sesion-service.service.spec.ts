import { TestBed } from '@angular/core/testing';

import { SesionServiceService } from './sesion-service.service';

describe('SesionServiceService', () => {
  let service: SesionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SesionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
