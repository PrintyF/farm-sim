import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [MatButtonModule, MatSliderModule, MatCardModule, FormsModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit {
  isSimulationRunning = new BehaviorSubject<boolean>(false);
  timer = 0;
  intervalId: any;

  ngOnInit(): void {
  }

  onPlayButtonClick(): void {
    this.isSimulationRunning.next(this.isSimulationRunning.getValue() ? false : true); 
    if (this.isSimulationRunning.getValue()) {
      this.intervalId = setInterval(() => {
        if (this.timer < 60) {
          this.timer += 0.1;
        }
      }, 100)
    } else {
      clearInterval(this.intervalId);
    }
  }

  get playButtonText() : "Play" | "Pause" {
    return this.isSimulationRunning.getValue() ? "Pause" : "Play";
  }


}
