import { Component, effect, ElementRef, Input, ViewChild } from '@angular/core';
import { SimulationService } from '../../scene/simulation/simulation.service';
import { Unit } from '../../scene/classes/Unit';

@Component({
  selector: 'app-neural-network-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './neural-network-visualizer.component.html',
  styleUrl: './neural-network-visualizer.component.scss'
})
export class NeuralNetworkVisualizerComponent {
  @Input('unit') unit: Unit | undefined;
  @ViewChild('neuralNetworkCanvas') canvasRef: ElementRef<HTMLCanvasElement> | undefined;

  ctx: CanvasRenderingContext2D | null = null;

  constructor(private simulationService: SimulationService) {
    effect(() => {
      if (this.simulationService.isSimulationRunning()) {
        console.log('test')
        this.renderLoop();
      }
    });
  }

  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  drawLayer(layerSize: number, neuralNetworkSize: number, layerIndex: number, neuronIndex: number, neuronValue: number): void {
    const neuronVisualizerSize = 4;
    if (this.ctx) {  
      const horizontalSpacing = (this.ctx.canvas.width - neuronVisualizerSize) / (layerSize);
      const vertiacalSpacing = this.ctx.canvas.height / (neuralNetworkSize);
      const x = horizontalSpacing * (neuronIndex + 1);
      const y = vertiacalSpacing * (layerIndex + 1);
      this.ctx.beginPath();
      this.ctx.arc(x, y, neuronVisualizerSize, 0, Math.PI * 2);
      this.ctx.fillStyle = "rgba(0, 0, 0, " + neuronValue + ")";
      this.ctx.fill()
      this.ctx.beginPath();
      this.ctx.arc(x,y, neuronVisualizerSize, 0, 2 * Math.PI);
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  drawLayers(): void {
    this.unit?.unitState.normalizedInputs.forEach((neuronValue, inputIndex) => {
      this.drawLayer(this.unit!.unitState.normalizedInputs.length + 1, this.unit!.neuralNetwork.layers.length + 2, 0, inputIndex, neuronValue);
    });
    this.unit?.neuralNetwork.feedForward(this.unit!.unitState.normalizedInputs);
    this.unit?.neuralNetwork.layers.forEach((layer, layerIndex) => {
      layer.outputs.forEach((neuronValue, neuronIndex) => {
        this.drawLayer(layer.outputs.length + 1, this.unit!.neuralNetwork.layers.length + 2, layerIndex + 1, neuronIndex, neuronValue);
      })
    });
  }


  renderLoop(): void {
    if (this.ctx) {
      this.clearCanvas();
      this.drawLayers();
      if (this.simulationService.isSimulationRunning()) {
        requestAnimationFrame(() => this.renderLoop());
      }
    }
  }

  ngAfterViewInit() {
    if (this.canvasRef) {
      this.ctx = this.canvasRef.nativeElement.getContext('2d');
    }
  }
}
