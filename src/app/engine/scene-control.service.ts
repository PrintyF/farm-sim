import { Population } from './scene/classes/population';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Subscription, takeWhile, tap } from 'rxjs';
import { Unit } from './scene/classes/unit';
import { Worldmap } from './scene/classes/Worldmap';
import { OBJ_SIZE, OBJ_POS_X, OBJ_POS_Y, POP_SIZE, TICK_RATE, TIMER, CELL_SIZE } from './scene/configuration';
import { Ray } from './scene/classes/Ray';
import { MapService } from './scene/map/map.service';


@Injectable({
  providedIn: 'root'
})
export class SceneControlService {
  isSimulationRunning = new BehaviorSubject<boolean>(false);
  $timer = new BehaviorSubject<number>(0);
  timerSubscription: Subscription = new Subscription();

  private alphaMarkedSubject = new BehaviorSubject<boolean>(false);
  alphaMarked$ = this.alphaMarkedSubject.asObservable();

  selectedUnits = new BehaviorSubject<Set<Unit>>(new Set());

  private ctx: CanvasRenderingContext2D | undefined;
  wmap = new Worldmap();

  population = new Population(1, this.wmap);

  initPopulation() {
    this.population = new Population(POP_SIZE, this.wmap);
  }


  initContext(ctx: CanvasRenderingContext2D | null): void {
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
      this.timerSubscription = interval(TICK_RATE * 1000).pipe(
        takeWhile(() => this.$timer.value < TIMER * TICK_RATE)
      ).subscribe(() => {
        this.$timer.next(parseFloat((this.$timer.value + TICK_RATE).toFixed(2)));

      });
    } else {
      this.timerSubscription.unsubscribe();
    }
  }


  updateCanvas(): void {
    this.clearCanvas();
    this.drawWorld();

    this.drawUnits();
    if (this.alphaMarkedSubject.value) {
      const alpha = this.population.currentAlpha(this.$timer.value);
      this.cercleUnit(alpha, "blue", alpha.size + 5);
    }
    if (this.isSimulationRunning.getValue()) {
      requestAnimationFrame(() => this.updateCanvas());
    }
  }

  drawWorld() {
    if (this.ctx) {
      this.ctx.fillStyle = 'beige';
      this.wmap.walls.forEach((wall) => {
        if (this.ctx) {
          this.ctx.fillRect(
            wall.x * CELL_SIZE,
            wall.y * CELL_SIZE,
            wall.width * CELL_SIZE,
            wall.height * CELL_SIZE
          );
        }
      });
      this.ctx.beginPath();
      this.ctx.arc(OBJ_POS_X, OBJ_POS_Y, OBJ_SIZE, 0, 2 * Math.PI);
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
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

  drawRays(rays: Ray[]) {

      rays.forEach((ray) => {
        if (this.ctx) {
          const wallpoint = ray.cast(this.wmap.walls);
          const endpoint = ray.getEndPoint();
          if (wallpoint && endpoint) {
            this.ctx.strokeStyle = 'yellow';
            this.ctx.beginPath();
            this.ctx.moveTo(ray.originX, ray.originY);
            this.ctx.lineTo(wallpoint.x, wallpoint.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'black'; 
            this.ctx.moveTo(wallpoint.x, wallpoint.y);
            this.ctx.lineTo(endpoint.x, endpoint.y);
            this.ctx.stroke();  

          }
        }
      });
  }

  drawUnit(unit: Unit) {
    if (this.ctx) {
      const tick = this.$timer.getValue();
      this.ctx.fillStyle = unit.color;
      this.ctx.beginPath();
      const state = unit.getStateByTick(tick);
      this.ctx.arc(state.x, state.y, unit.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.cercleUnit(unit, "black", unit.size);
      if (this.selectedUnits.value.has(unit)) {
        this.drawRays(state.rays);
        this.cercleUnit(unit, unit.color, unit.size + 5);
      }
    }
  }

  cercleUnit(unit: Unit, color = 'red', size: number) {
    if (this.ctx) {
      const tick = this.$timer.getValue();
      const unitState = unit.getStateByTick(tick);
      this.ctx.beginPath();
      this.ctx.arc(unitState.x, unitState.y, size, 0, 2 * Math.PI);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  selectEvent(clickX: number, clickY: number) {
    this.selectedUnits.next(new Set());
    const tick = this.$timer.getValue();
    this.population.units.forEach(unit => {
      if (unit.distanceToPoint(clickX, clickY, tick) < unit.size) {
        const currentUnits = this.selectedUnits.getValue();
        currentUnits.add(unit);
        this.selectedUnits.next(currentUnits);
      }
    });
    this.updateCanvas();
  }

  constructor(private mapService: MapService) {
    this.mapService.getMapData().pipe(tap((map) => {
      console.log(map)
      this.wmap.init(map);
    }))
    .subscribe();
  }
}
