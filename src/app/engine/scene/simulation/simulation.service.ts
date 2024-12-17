import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription, takeWhile } from 'rxjs';
import { TICK_RATE, TIMER } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  isSimulationRunning = new BehaviorSubject<boolean>(false);
  $timer = new BehaviorSubject<number>(0);
  timerSubscription: Subscription = new Subscription();

  constructor() { }

  toggleSimulation(): void {
    this.isSimulationRunning.next(!this.isSimulationRunning.getValue());
    if (this.isSimulationRunning.getValue()) {
      this.timerSubscription = interval(TICK_RATE * 1000).pipe(
        takeWhile(() => this.$timer.value < TIMER * TICK_RATE)
      ).subscribe(() => {
        this.$timer.next(parseFloat((this.$timer.value + TICK_RATE).toFixed(2)));

      });
    } else {
      this.timerSubscription.unsubscribe();
    }
  }

}
