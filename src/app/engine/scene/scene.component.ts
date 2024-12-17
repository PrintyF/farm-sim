import { tap } from 'rxjs';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SceneControlService } from '../scene-control.service';
import { SimulationService } from './simulation/simulation.service';
import { RenderingService } from './rendering/rendering.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss'
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('simulationCanvas') canvasRef: ElementRef<HTMLCanvasElement> | undefined;
  
  constructor(private simualationService: SimulationService,
              private renderingService: RenderingService,
              private sceneControlService: SceneControlService) {}
  
  ngAfterViewInit() {
    if (this.canvasRef) {
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.canvasRef.nativeElement.height = window.innerHeight;
      this.renderingService.initContext(this.canvasRef.nativeElement.getContext('2d'));
    }
    this.simualationService.isSimulationRunning.pipe((tap((value) => {
      if (value) {
        this.sceneControlService.renderLoop();
      }
    }))).subscribe();
  }
  

  onCanvasClick(event: MouseEvent) {
    if (this.canvasRef?.nativeElement) {
      const rect = this.canvasRef?.nativeElement.getBoundingClientRect();
      const scaleX = this.canvasRef?.nativeElement.width / rect.width;
      const scaleY = this.canvasRef?.nativeElement.height / rect.height;
    
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;
  
      this.sceneControlService.selectEvent(clickX, clickY, this.simualationService.$timer.getValue());
    }
  }
}
