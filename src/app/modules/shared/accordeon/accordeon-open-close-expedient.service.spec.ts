import { TestBed } from '@angular/core/testing';

import { AccordeonOpenCloseExpedientService } from './accordeon-open-close-expedient.service';

describe('AccordeonOpenCloseExpedientService', () => {
  let service: AccordeonOpenCloseExpedientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccordeonOpenCloseExpedientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
