import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UnitPanel } from '../control-panel.component';
import { SimulationService } from '../../scene/simulation/simulation.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-neural-network-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './neural-network-visualizer.component.html',
  styleUrl: './neural-network-visualizer.component.scss'
})
export class NeuralNetworkVisualizerComponent {
  @Input('unitPanel') unitPanel: UnitPanel | undefined;
  @ViewChild('neuralNetworkCanvas') canvasRef: ElementRef<HTMLCanvasElement> | undefined;

  ctx: CanvasRenderingContext2D | null = null;

  constructor(private simulationService: SimulationService) {

  }

  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

  }

  drawLayer() {
    const verticalSpacing = (this.ctx!.canvas.height - 2 * 10) / (this.unitPanel!.state.neuralNetworkStates[0].length - 1);
    this.unitPanel?.state.neuralNetworkStates[0].forEach((neuronValue, index) => {
      if (this.ctx) {
        const x = this.ctx.canvas.width / 4;
        const y = this.ctx.canvas.height + index * verticalSpacing;

        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = "black";
        this.ctx.fill()
      }
    });
  }


  renderLoop(): void {
    if (this.ctx) {
      this.clearCanvas();
      this.drawLayer();
      if (this.simulationService.isSimulationRunning.value) {
        requestAnimationFrame(() => this.renderLoop());
      }  
    }
  }

  ngAfterViewInit() {
    if (this.canvasRef) {
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.canvasRef.nativeElement.height = window.innerHeight;
      console.log(this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height)

      this.ctx = this.canvasRef.nativeElement.getContext('2d');
      this.simulationService.isSimulationRunning.pipe(tap((value) => {
        this.renderLoop();
      })).subscribe();
    }
  }
}
