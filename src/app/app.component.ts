import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlPanelComponent } from "./engine/control-panel/control-panel.component";
import { FlexLayoutModule } from '@angular/flex-layout';
import { SceneComponent } from "./engine/scene/scene.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlexLayoutModule, ControlPanelComponent, SceneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'farm-sim';
}
