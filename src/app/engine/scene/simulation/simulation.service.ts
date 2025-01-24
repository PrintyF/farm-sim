import { Injectable, signal } from '@angular/core';
import { interval, Subscription, takeWhile } from 'rxjs';
import { TICK_RATE, TIMER } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  isSimulationRunning = signal(false);
  timer = signal(0);
  timerSubscription: Subscription = new Subscription();

  constructor() { }


  toggleSimulation(): void {
    this.isSimulationRunning.update((toggle) => !toggle);
    if (this.isSimulationRunning()) {
      this.timerSubscription = interval(TICK_RATE * 1000).pipe(
        takeWhile(() => this.timer() < TIMER * TICK_RATE)
      ).subscribe(() => {
        this.timer.update((time) => parseFloat((time + TICK_RATE).toFixed(2)));

      });
    } else {
      this.timerSubscription.unsubscribe();
    }
  }

}
