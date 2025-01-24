import { Injectable, signal } from '@angular/core';
import { Unit } from '../classes/Unit';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedUnits = signal<Set<Unit>>(new Set());

  constructor() { }
}
