import { Injectable } from '@angular/core';
import { Unit } from '../classes/Unit';
import { CELL_SIZE, OBJ_POS_X, OBJ_POS_Y, OBJ_SIZE } from '../configuration';
import { Worldmap } from '../classes/Worldmap';
import { MapService } from '../map/map.service';

@Injectable({
  providedIn: 'root'
})
export class RenderingService {
  private ctx: CanvasRenderingContext2D | undefined;


  initContext(ctx: CanvasRenderingContext2D | null): void {
    if (ctx) {
      this.ctx = ctx;
    }
  }

  drawWorld(wmap: Worldmap) {
    if (this.ctx) {
      this.ctx.fillStyle = 'beige';
      wmap.walls.forEach((wall) => {
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

  drawUnits(units: Unit[], timer: number): void {
    if (this.ctx) {
      for (let unit of units) {
        this.drawUnit(unit, timer);
      }
    }
  }

  drawRays(unit: Unit, timer: number): void {
    const rays = unit.getStateByTick(timer)!.rays;
    rays.forEach((ray) => {
      if (this.ctx) {
        if (this.mapService.wmap) {
          const wallpoint = ray.cast(this.mapService.wmap.walls);
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
      }
    });
  }

  drawUnit(unit: Unit, timer: number): void {
    if (this.ctx) {
      const tick = timer;
      this.ctx.fillStyle = unit.color;
      this.ctx.beginPath();
      const state = unit.getStateByTick(tick);
      this.ctx.arc(state!.x, state!.y, unit.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.cercleUnit(unit, "black", unit.size, timer);
    }
  }

  cercleUnit(unit: Unit, color: string, size: number, timer: number) {
    if (this.ctx) {
      const tick = timer;
      const unitState = unit.getStateByTick(tick);
      this.ctx.beginPath();
      this.ctx.arc(unitState!.x, unitState!.y, size, 0, 2 * Math.PI);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
    } 
  }

  drawSelectedUnitHighlight(units: Unit[], timer: number) {
    const circleOffset = 5;
    units.forEach((unit) => {
      this.cercleUnit(unit, 'red', unit.size + circleOffset, timer);
    });
    if (units.length === 1) {
      units.forEach((unit) => {
        this.drawRays(unit, timer);
      })
    }

  }


  constructor(private mapService: MapService) { }  

}
