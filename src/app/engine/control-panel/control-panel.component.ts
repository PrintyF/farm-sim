import { Population } from './../scene/classes/population';
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
import { Unit } from '../scene/classes/unit';
import { TICK_RATE, TIMER } from '../scene/configuration';
import { Worldmap } from '../scene/classes/Worldmap';

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
  population: Population = new Population(0, new Worldmap());
  animationDuration = TIMER * TICK_RATE;
  tickRate = TICK_RATE;
  $displaySlectedUnits : Observable<any>;

  selectedFile: File | null = null;

  constructor(private sceneControlService: SceneControlService) {
    this.$displaySlectedUnits = combineLatest([this.sceneControlService.$timer, this.sceneControlService.selectedUnits]).pipe(
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

    this.sceneControlService.initPopulation();
    this.sceneControlService.alphaMarked$.subscribe((value) => {
      this.alphaMarked = value;
    });
    this.population = this.sceneControlService.population;
    this.time$ = this.sceneControlService.$timer;
    this.$selectedUnits = this.sceneControlService.selectedUnits;
  }

  reproducePopulation(): void {
    this.sceneControlService.toggleReproduction();
  }

  markAlpha(checked: boolean): void {
    this.sceneControlService.toggleAlphaMarked(checked);
  }
  
  onPlayButtonClick(): void {
    this.population = this.sceneControlService.population;
    this.sceneControlService.toggleSimulation();
  }

  warpTo(value: number) {
    this.time$?.next(value);
    this.sceneControlService.updateCanvas();
  }

  openNeuralNetworkDisplay(index: number): void {
    let  t = new Set<Unit>();
    if (this.$selectedUnits)
      t.add(Array.from(this.$selectedUnits.value)[0])
    this.$selectedUnits?.next(new Set(t));
  }

  get playButtonText() : "Play" | "Pause" {
    return this.sceneControlService.isSimulationRunning.getValue() ? "Pause" : "Play";
  }
  
  
}
