import { tap } from 'rxjs';
import { SceneControlService } from './../scene-control.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss'
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('simulationCanvas') canvasRef: ElementRef<HTMLCanvasElement> | undefined;
  
  constructor(private sceneControlService: SceneControlService) {}
  
  ngAfterViewInit() {
    
    if (this.canvasRef) {
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.canvasRef.nativeElement.height = window.innerHeight;
      this.sceneControlService.initContext(this.canvasRef.nativeElement.getContext('2d'));
    }
    this.sceneControlService.isSimulationRunning.pipe((tap((value) => {
      if (value) {
        this.sceneControlService.updateCanvas();
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
  
      this.sceneControlService.selectEvent(clickX, clickY);
    }
  }
}
