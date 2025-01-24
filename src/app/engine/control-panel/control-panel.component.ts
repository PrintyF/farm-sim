import { Population } from '../scene/classes/Population';
import { MatInputModule } from '@angular/material/input';
import { SceneControlService } from './../scene-control.service';
import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, tap } from 'rxjs';
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
  
  displaySelectedUnits: Signal<UnitPanel[]> = computed(() => {
    return  Array.from(this.selectionService.selectedUnits()).map((unit) => ({
      color: unit.color, 
      name: unit.name,
      state: unit.getStateByTick(this.simulationSerice.timer())!}))});

  animationDuration = TIMER * TICK_RATE;
  tickRate = TICK_RATE;

  selectedIndexes: number[] = [];

  constructor(private sceneControlService: SceneControlService,
              private simulationSerice: SimulationService,
              private selectionService: SelectionService
  ) {
  }

  onTabChange(event: MatTabChangeEvent, groupIndex: number): void {
    if (event) {
      this.selectedIndexes[groupIndex] = event.index;
    }
  }

  ngOnInit(): void {
  }

  reproducePopulation(): void {
    this.sceneControlService.toggleReproduction();
  }

  onPlayButtonClick(): void {
    this.simulationSerice.toggleSimulation();
    this.sceneControlService.renderLoop();

  }

  warpTo(value: number) {
    this.simulationSerice.timer.set(value)
    this.sceneControlService.renderLoop();
  }

  get population(): Population | null {
    return this.sceneControlService.population;
  }

  get playButtonText() : "Play" | "Pause" {
    return this.simulationSerice.isSimulationRunning() ? "Pause" : "Play";
  }

  get timer(): number {
    return this.simulationSerice.timer();
  }  
  
}
