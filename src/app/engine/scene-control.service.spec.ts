import { TestBed } from '@angular/core/testing';

import { SceneControlService } from './scene-control.service';

describe('SceneControlService', () => {
  let service: SceneControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
