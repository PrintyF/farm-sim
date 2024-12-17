import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Unit } from '../classes/Unit';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private alphaMarkedSubject = new BehaviorSubject<boolean>(false);
  alphaMarked$ = this.alphaMarkedSubject.asObservable();

  selectedUnits = new BehaviorSubject<Set<Unit>>(new Set());

  toggleAlphaMarked(isMarked: boolean) {
    this.alphaMarkedSubject.next(isMarked);
  }

  constructor() { }
}
