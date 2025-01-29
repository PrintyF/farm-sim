import { Population } from './scene/classes/Population';
import { effect, Injectable } from '@angular/core';
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
      this.renderingService.drawUnits(this.population.units, this.simulationService.timer);
    }
    const timer = this.simulationService.timer;
    this.renderingService.drawSelectedUnitHighlight(Array.from(this.selectionService.selectedUnits()), timer);

    if (this.simulationService.isSimulationRunning()) {
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  selectEvent(clickX: number, clickY: number): void {
    this.selectionService.selectedUnits.set(new Set());
    if (this.population) {
      this.population.units.forEach(unit => {
        if (unit.distanceToPoint(clickX, clickY, this.simulationService.timer) < unit.size) {
          const currentUnits = this.selectionService.selectedUnits();
          currentUnits.add(unit);
          this.selectionService.selectedUnits.set(currentUnits);
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
      effect(() => {
        if (this.simulationService.isSimulationRunning()) {
          this.renderLoop();
        }
      });
  
  
  }
}
