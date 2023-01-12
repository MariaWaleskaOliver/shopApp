import { TestBed } from '@angular/core/testing';

import { CartOperationService } from './cartOperation.service';

describe('CartOperationService', () => {
  let service: CartOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
