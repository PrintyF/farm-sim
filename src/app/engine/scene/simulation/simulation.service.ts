import { effect, Injectable, signal, untracked } from '@angular/core';
import { BehaviorSubject, interval, Subscription, takeWhile, tap } from 'rxjs';
import { TICK_RATE, TIMER } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  isSimulationRunning = signal(false);
  timerSubject = new BehaviorSubject(0);
  timerSubscription: Subscription = new Subscription();

  constructor() {
    effect(() => {
      const isRunning = this.isSimulationRunning();
      untracked(() => {
        this.timerSubscription.unsubscribe();
    
        if (isRunning) {
          this.timerSubscription = interval(TICK_RATE * 1000).pipe(
              takeWhile(() => this.timer < TIMER * TICK_RATE),
            tap(() => {
              this.timerSubject.next(parseFloat((this.timer+ TICK_RATE).toFixed(2)));
            })
          ).subscribe();
        }
      });
    });
}

get timer(): number {
  return this.timerSubject.value;
}


  toggleSimulation(): void {
    this.isSimulationRunning.update((toggle) => !toggle);
  }

}
