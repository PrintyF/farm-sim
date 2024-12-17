import { Population } from '../scene/classes/Population';
import { MatInputModule } from '@angular/material/input';
import { SceneControlService } from './../scene-control.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Unit } from '../scene/classes/Unit';
import { TICK_RATE, TIMER } from '../scene/configuration';
import { Worldmap } from '../scene/classes/Worldmap';
import { SimulationService } from '../scene/simulation/simulation.service';
import { SelectionService } from '../scene/selection/selection.service';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSliderModule, MatCardModule, MatDividerModule, FormsModule, MatInputModule, MatCheckboxModule],
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
  $displaySlectedUnits : Observable<any>;

  selectedFile: File | null = null;

  constructor(private sceneControlService: SceneControlService,
              private simulationSerice: SimulationService,
              private selectionService: SelectionService
  ) {
    this.$displaySlectedUnits = combineLatest([this.simulationSerice.$timer, this.selectionService.selectedUnits]).pipe(
      map(([tick, units]: [number, Set<Unit>]) => {
          return Array.from(units).map(unit => ({
          name: unit.name,
          color: unit.color,
          state: unit.getStateByTick(tick),
        }));
      })
    );
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

  markAlpha(checked: boolean): void {
    this.selectionService.toggleAlphaMarked(checked);
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
