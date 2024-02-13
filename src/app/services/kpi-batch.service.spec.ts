import { TestBed } from '@angular/core/testing';

import { KpiBatchService } from './kpi-batch.service';

describe('KpiBatchService', () => {
  let service: KpiBatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiBatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
