import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuralNetworkVisualizerComponent } from './neural-network-visualizer.component';

describe('NeuralNetworkVisualizerComponent', () => {
  let component: NeuralNetworkVisualizerComponent;
  let fixture: ComponentFixture<NeuralNetworkVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeuralNetworkVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeuralNetworkVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
