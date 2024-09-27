import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SceneControlService {
  isSimulationRunning = new BehaviorSubject<boolean>(false);
  timer$ = new BehaviorSubject<number>(0);
  timerSubscription: Subscription = new Subscription();

  toggleSimulation() {
    this.isSimulationRunning.next(!this.isSimulationRunning.getValue());
    if (this.isSimulationRunning.getValue()) {
      this.timerSubscription = interval(100).pipe(
        takeWhile(() => this.timer$.value < 60)
      ).subscribe(() => {
        this.timer$.next(this.timer$.value + 0.1);
      });
    } else {
      this.timerSubscription.unsubscribe();
    }

  }

  constructor() { }
}
