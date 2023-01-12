import { TestBed } from '@angular/core/testing';

import { DemodataService } from './demodata.service';

describe('DemodataService', () => {
  let service: DemodataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemodataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
