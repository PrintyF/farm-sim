import { Injectable } from '@angular/core';
import { Unit } from '../classes/Unit';
import { CELL_SIZE, OBJ_POS_X, OBJ_POS_Y, OBJ_SIZE } from '../configuration';
import { Worldmap } from '../classes/Worldmap';
import { MapService } from '../map/map.service';
import { Objective, Wall, WorldmapEntity } from '../type/WorldmapEntity';
import { Ray } from '../classes/Ray';

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
    this.drawWalls(wmap.walls);
    this.drawObjective(wmap.objective);
  }

  private drawObjective(objective: Objective) {
    if (this.ctx) {
      this.ctx.fillStyle = 'cyan';
      this.ctx.beginPath();
      this.ctx.fillRect(
        objective.x * CELL_SIZE,
        objective.y * CELL_SIZE,
        objective.width * CELL_SIZE,
        objective.height * CELL_SIZE);
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
    }
}

  private drawWalls(walls: Wall[]) {
    if (this.ctx) {
      this.ctx.fillStyle = 'beige';
      walls.forEach((wall) => {
        if (this.ctx) {
          this.ctx.fillRect(
            wall.x * CELL_SIZE,
            wall.y * CELL_SIZE,
            wall.width * CELL_SIZE,
            wall.height * CELL_SIZE
          );
        }
      });  
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
        unit.setUnitToTick(timer);
        this.drawUnit(unit);
      }
    }
  }

  drawRays(unit: Unit, timer: number): void {
    const rays = unit.getStateByTick(timer)!.rays;
    rays.forEach((ray) => {
      if (this.ctx) {
        if (this.mapService.wmap) {
          const entityPoint = ray.cast(this.mapService.wmap!.walls.concat([this.mapService.wmap!.objective]));

          this.rayFromCenterToObject(ray, entityPoint);
          this.rayForWorldMapEntities(ray, [this.mapService.wmap!.objective], 'blue');
          this.rayForWorldMapEntities(ray, this.mapService.wmap!.walls);  
        }
      }
    });
  }

  private rayFromCenterToObject(ray: Ray, wallpoint: {x: number, y: number} | null) {
    if (this.ctx) {
      this.ctx.strokeStyle = 'yellow';
      this.ctx.beginPath();
      this.ctx.moveTo(ray.originX, ray.originY);
      this.ctx.lineTo(wallpoint!.x, wallpoint!.y);
      this.ctx.stroke();  
    }
  }


  private rayForWorldMapEntities(ray: Ray, worldmapEntities: WorldmapEntity[], color = 'black') {
    const wallpoint = ray.cast(worldmapEntities);
    const endpoint = ray.getEndPoint();
    if (wallpoint && endpoint && this.ctx) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.moveTo(wallpoint.x, wallpoint.y);
      this.ctx.lineTo(endpoint.x, endpoint.y);
      this.ctx.stroke();
    }
  }

  drawUnit(unit: Unit): void {
    if (this.ctx) {
      this.ctx.fillStyle = unit.color;
      this.ctx.beginPath();
      this.ctx.arc(unit.unitState.x, unit.unitState.y, unit.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.cercleUnit(unit, "black", unit.size);
    }
  }

  cercleUnit(unit: Unit, color: string, size: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(unit.unitState.x, unit.unitState.y, size, 0, 2 * Math.PI);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.closePath();
    } 
  }

  drawSelectedUnitHighlight(units: Unit[], timer: number = 0) {
    const circleOffset = 5;
    units.forEach((unit) => {
      this.cercleUnit(unit, 'red', unit.size + circleOffset);
    });
    if (units.length === 1) {
      units.forEach((unit) => {
        this.drawRays(unit, timer);
      })
    }

  }


  constructor(private mapService: MapService) { }  

}
