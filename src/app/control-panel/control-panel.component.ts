import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit {
  isSimulationRunning = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
  }

  onPlayButtonClick(): void {
    this.isSimulationRunning.next(this.isSimulationRunning.getValue() ? false : true); 
  }

  get playButtonText() : "Play" | "Pause" {
    return this.isSimulationRunning.getValue() ? "Pause" : "Play";
  }


}
