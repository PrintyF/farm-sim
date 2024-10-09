import { Population } from './scene/classes/population';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription, takeWhile } from 'rxjs';
import { Unit } from './scene/classes/unit';

@Injectable({
  providedIn: 'root'
})
export class SceneControlService {
  isSimulationRunning = new BehaviorSubject<boolean>(false);
  timer$ = new BehaviorSubject<number>(0);
  timerSubscription: Subscription = new Subscription();

  selectedUnits = new BehaviorSubject<Unit[]>([]);

  private ctx: CanvasRenderingContext2D | undefined;
  population = new Population(5);

  initContext(ctx : CanvasRenderingContext2D | null) : void {
    if (ctx) {
      this.ctx = ctx;
    }
  }

  toggleSimulation(): void {
    this.isSimulationRunning.next(!this.isSimulationRunning.getValue());
    if (this.isSimulationRunning.getValue()) {
      this.timerSubscription = interval(100).pipe(
        takeWhile(() => this.timer$.value < 60)
      ).subscribe(() => {
        this.timer$.next(this.timer$.value + 0.1);
      });
    } else {
      this.timerSubscription.unsubscribe();
    }
  }


  updateCanvas(): void {
    this.clearCanvas();
    this.drawUnits();
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
      const postion = unit.getPostionByIndex(this.timer$.getValue() * 10);
      unit.posX.next(postion?.x);
      unit.posY.next(postion?.y);
      if (postion) {
        this.ctx.arc(unit.posX.value, unit.posY.value, 5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  selectEvent(clickX: number, clickY: number) {
    this.selectedUnits.next([]);
    this.population.units.forEach(unit => {
      const distance = Math.sqrt(
        Math.pow(clickX - unit.getPostionByIndex(this.timer$.getValue() * 10)?.x, 2) +
        Math.pow(clickY - unit.getPostionByIndex(this.timer$.getValue() * 10)?.y, 2));
      if (distance < 5) {
        const currentUnits = this.selectedUnits.getValue();
        this.selectedUnits.next([...currentUnits, unit]);
      }
    });
  }

  constructor() { }
}
