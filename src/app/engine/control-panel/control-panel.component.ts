import { Population } from '../scene/classes/Population';
import { MatInputModule } from '@angular/material/input';
import { SceneControlService } from './../scene-control.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, combineLatest, map, Observable, take, tap } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Unit, UnitState } from '../scene/classes/Unit';
import { TICK_RATE, TIMER } from '../scene/configuration';
import { SimulationService } from '../scene/simulation/simulation.service';
import { SelectionService } from '../scene/selection/selection.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs'; 
import { NeuralNetworkVisualizerComponent } from './neural-network-visualizer/neural-network-visualizer.component';

export type UnitPanel = {
  name : string,
  color : string,
  state: UnitState
}

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [NeuralNetworkVisualizerComponent, CommonModule, MatTabsModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSliderModule, MatCardModule, MatDividerModule, FormsModule, MatInputModule, MatCheckboxModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit {
  
  time$: BehaviorSubject<number> | undefined;
  $selectedUnits: BehaviorSubject<Set<Unit>> | undefined;
  alphaMarked = false;
  population: Population | null = null;
  animationDuration = TIMER * TICK_RATE;
  tickRate = TICK_RATE;
  $displaySlectedUnits : Observable<UnitPanel[]>;
  selectedIndex: number[] = [];
  selectedIndexes: number[] = [];
  selectedFile: File | null = null;

  constructor(private sceneControlService: SceneControlService,
              private simulationSerice: SimulationService,
              private selectionService: SelectionService
  ) {
    this.selectionService.selectedUnits.pipe(tap((units: Set<Unit>) => {
      this.selectedIndexes = Array(units.size).fill(0);
    })).subscribe();
    this.$displaySlectedUnits = combineLatest([this.simulationSerice.$timer, this.selectionService.selectedUnits]).pipe(
      map(([tick, units]: [number, Set<Unit>]) => {
        this.selectedIndex = [];
        return Array.from(units).map(unit => ({
          name: unit.name,
          color: unit.color,
          state: unit.getStateByTick(tick)!,
        }));
      }),
    );
  }

  onTabChange(event: MatTabChangeEvent, groupIndex: number): void {
    if (event) {
      this.selectedIndexes[groupIndex] = event.index;
    }
  }

  ngOnInit(): void {
    this.selectionService.alphaMarked$.subscribe((value) => {
      this.alphaMarked = value;
    });
    if (this.sceneControlService.population) {
      this.population = this.sceneControlService.population;
    }
    this.time$ = this.simulationSerice.$timer;
    this.$selectedUnits = this.selectionService.selectedUnits;
  }

  reproducePopulation(): void {
    this.sceneControlService.toggleReproduction();
  }

  onPlayButtonClick(): void {
    if (this.sceneControlService.population) {
      this.population = this.sceneControlService.population;
    }
    this.simulationSerice.toggleSimulation();
  }

  warpTo(value: number) {
    this.time$?.next(value);
    this.sceneControlService.renderLoop();
  }

  openNeuralNetworkDisplay(index: number): void {
    let  t = new Set<Unit>();
    if (this.$selectedUnits)
      t.add(Array.from(this.$selectedUnits.value)[0])
    this.$selectedUnits?.next(new Set(t));
  }

  get playButtonText() : "Play" | "Pause" {
    return this.simulationSerice.isSimulationRunning.getValue() ? "Pause" : "Play";
  }
  
  
}
