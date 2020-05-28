import { TestBed } from '@angular/core/testing';

import { AccountTransformerService } from './account-transformer.service';

describe('AccountTransformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountTransformerService = TestBed.get(AccountTransformerService);
    expect(service).toBeTruthy();
  });
});
