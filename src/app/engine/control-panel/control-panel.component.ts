import { SceneControlService } from './../scene-control.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, takeWhile, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSliderModule, MatCardModule, MatDividerModule, FormsModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit {

  time$: BehaviorSubject<number> | undefined;

  constructor(private sceneControlService: SceneControlService) {
  }

  ngOnInit() {
    this.time$ = this.sceneControlService.timer$;
  }
  
  onPlayButtonClick(): void {
    this.sceneControlService.toggleSimulation();
  }

  get playButtonText() : "Play" | "Pause" {
    return this.sceneControlService.isSimulationRunning.getValue() ? "Pause" : "Play";
  }
  
  
}
