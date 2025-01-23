import { Population } from './scene/classes/Population';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { POP_SIZE } from './scene/configuration';
import { MapService } from './scene/map/map.service';
import { SimulationService } from './scene/simulation/simulation.service';
import { RenderingService } from './scene/rendering/rendering.service';
import { SelectionService } from './scene/selection/selection.service';


@Injectable({
  providedIn: 'root'
})
export class SceneControlService {
  population: Population | null = null;

  initPopulation() {
    if (this.mapService.wmap) {
      this.population = new Population(POP_SIZE, this.mapService.wmap);
    }
  }

  toggleReproduction(): void {
    if (this.population) {
      this.population.reproduce();
      this.renderLoop();
    }
  }


  renderLoop(): void {
    this.renderingService.clearCanvas();
    if (this.mapService.wmap) {
      this.renderingService.drawWorld(this.mapService.wmap);
    }
    if (this.population) {
      this.renderingService.drawUnits(this.population.units, this.simulationService.timer());
    }
    this.renderingService.drawSelectedUnitHighlight(Array.from(this.selectionService.selectedUnits.value), this.simulationService.timer());

    if (this.simulationService.isSimulationRunning.value) {
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  selectEvent(clickX: number, clickY: number, timer: number): void {
    this.selectionService.selectedUnits.next(new Set());
    const tick = timer;
    if (this.population) {
      this.population.units.forEach(unit => {
        if (unit.distanceToPoint(clickX, clickY, tick) < unit.size) {
          const currentUnits = this.selectionService.selectedUnits.getValue();
          currentUnits.add(unit);
          this.selectionService.selectedUnits.next(currentUnits);
        }
      });
    }
    this.renderLoop();
  }

  constructor(private mapService: MapService,
    private simulationService: SimulationService,
    private renderingService: RenderingService,
    private selectionService: SelectionService) {
      const mapObs = this.mapService.getMapData();
      
      mapObs.pipe(tap(() => {
        this.initPopulation();
      })).subscribe();
  
  }
}
