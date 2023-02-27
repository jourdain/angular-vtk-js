import { TestBed } from '@angular/core/testing';

import { VtkEngineService } from './vtk-engine.service';

describe('VtkEngineService', () => {
  let service: VtkEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VtkEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
