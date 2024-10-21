import { Population } from './scene/classes/population';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription, takeWhile } from 'rxjs';
import { Unit } from './scene/classes/unit';

const TIMER = 60000;

@Injectable({
  providedIn: 'root'
})
export class SceneControlService {
  isSimulationRunning = new BehaviorSubject<boolean>(false);
  timer$ = new BehaviorSubject<number>(0);
  timerSubscription: Subscription = new Subscription();

  private alphaMarkedSubject = new BehaviorSubject<boolean>(false);
  alphaMarked$ = this.alphaMarkedSubject.asObservable();

  selectedUnits = new BehaviorSubject<Set<Unit>>(new Set());
  
  private ctx: CanvasRenderingContext2D | undefined;
  population = new Population(50);
  
  initContext(ctx : CanvasRenderingContext2D | null) : void {
    if (ctx) {
      this.ctx = ctx;
    }
  }

  toggleReproduction(): void {
    this.population.reproduce();
    this.updateCanvas();
  }

  toggleAlphaMarked(isMarked: boolean) {
    this.alphaMarkedSubject.next(isMarked);
    this.updateCanvas();
  }
  
  toggleSimulation(): void {
    this.isSimulationRunning.next(!this.isSimulationRunning.getValue());
    if (this.isSimulationRunning.getValue()) {
      this.timerSubscription = interval(10).pipe(
        takeWhile(() => this.timer$.value < TIMER/100)
      ).subscribe(() => {
        this.timer$.next(this.timer$.value + 0.01);
      });
    } else {
      this.timerSubscription.unsubscribe();
    }
  }
  
  
  updateCanvas(): void {
    this.clearCanvas();
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(1000, 500,  50, 0, 2 * Math.PI);
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
    }

    this.drawUnits();
    if (this.alphaMarkedSubject.value) {
      this.cercleUnit(this.population.currentAlpha, "blue", this.population.currentAlpha.size + 5);
    }
    if (this.isSimulationRunning.getValue()) {
      requestAnimationFrame(() => this.updateCanvas());
    }
  }
  
  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }
  
  drawUnits(): void {
    if (this.ctx) {
      for (let unit of this.population.units) {
        this.drawUnit(unit);
      }  
    }
  }
  
  drawUnit(unit: Unit) {
    if (this.ctx) {
      this.ctx.fillStyle = unit.color;
      this.ctx.beginPath();
      const postion = unit.getPostionByIndex(this.timer$.getValue()/unit.actions.length*TIMER);
      unit.posX.next(postion?.x);
      unit.posY.next(postion?.y);
      unit.angle.next(postion?.angle);
      unit.speed.next(postion?.speed);
      if (postion) {
        this.ctx.arc(unit.posX.value, unit.posY.value, unit.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.cercleUnit(unit, "black", unit.size);
      if (this.selectedUnits.value.has(unit)) {
        this.cercleUnit(unit, unit.color, unit.size + 5);    
      }
    }
  }
  
  cercleUnit(unit: Unit, color = 'red', size: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(unit.posX.value, unit.posY.value, size, 0, 2 * Math.PI);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
  
  selectEvent(clickX: number, clickY: number) {
    this.selectedUnits.next(new Set());
    this.population.units.forEach(unit => {
      if (unit.distanceToPoint(clickX, clickY) < unit.size) {
        const currentUnits = this.selectedUnits.getValue();
        currentUnits.add(unit);
        this.selectedUnits.next(currentUnits);
      }
    });
    this.updateCanvas();
  }
  
  constructor() { }
}
