import { TestBed } from '@angular/core/testing';

import { KpiOnlineService } from './kpi-online.service';

describe('KpiOnlineService', () => {
  let service: KpiOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
