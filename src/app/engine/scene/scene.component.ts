import { tap } from 'rxjs';
import { SceneControlService } from './../scene-control.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss'
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('simulationCanvas') canvasRef: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null = null;
  
  constructor(private sceneControlService: SceneControlService) {
  }
  
  
  ngAfterViewInit() {
    if (this.canvasRef) {
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.canvasRef.nativeElement.height = window.innerHeight;  
      this.ctx = this.canvasRef.nativeElement.getContext('2d');
    }
    this.sceneControlService.isSimulationRunning.pipe((tap((value) => {
      if (value) {
        this.updateCanvas();
      }
    }))).subscribe();
  }
  
  updateCanvas() {
    this.clearCanvas();
    this.drawUnits();
    if (this.sceneControlService.isSimulationRunning.getValue()) {
      requestAnimationFrame(() => this.updateCanvas());
    }
  }
  
  clearCanvas() {
    if (this.canvasRef && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }
  }
  
  drawUnits() {
    if (this.ctx && this.canvasRef) {
      this.ctx.fillStyle = 'blue';
      for (let i = 0; i < 50; i++) {
        this.drawUnit();
      }  
    }
  }
  
  drawUnit() {
    if (this.ctx && this.canvasRef) {
      this.ctx.beginPath();
      const x = Math.random() * this.canvasRef.nativeElement.width;
      const y = Math.random() * this.canvasRef.nativeElement.height;
      this.ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
