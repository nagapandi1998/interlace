import { TestBed } from '@angular/core/testing';

import { Superdoc } from './superdoc';

describe('Superdoc', () => {
  let service: Superdoc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Superdoc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
