import { TestBed } from '@angular/core/testing';

import { SecurityTokenService } from './security-token.service';

describe('SecurityTokenService', () => {
  let service: SecurityTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
