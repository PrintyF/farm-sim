import { MatInputModule } from '@angular/material/input';
import { SceneControlService } from './../scene-control.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Unit } from '../scene/classes/unit';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSliderModule, MatCardModule, MatDividerModule, FormsModule, MatInputModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit {

  time$: BehaviorSubject<number> | undefined;
  selectedUnits$: BehaviorSubject<Unit[]> | undefined;

  constructor(private sceneControlService: SceneControlService) {
  }

  ngOnInit() {
    this.time$ = this.sceneControlService.timer$;
    this.selectedUnits$ = this.sceneControlService.selectedUnits;
    this.time$.subscribe((time) => {

    });
  }
  
  onPlayButtonClick(): void {
    this.sceneControlService.toggleSimulation();
  }

  warpTo(value: number) {
    this.time$?.next(value);
    this.sceneControlService.updateCanvas();
  }

  get playButtonText() : "Play" | "Pause" {
    return this.sceneControlService.isSimulationRunning.getValue() ? "Pause" : "Play";
  }
  
  
}
