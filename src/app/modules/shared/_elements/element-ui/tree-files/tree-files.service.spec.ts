import { TestBed } from '@angular/core/testing';

import { TreeFilesService } from './tree-files.service';

describe('TreeFilesService', () => {
  let service: TreeFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
