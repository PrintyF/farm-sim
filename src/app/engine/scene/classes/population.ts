import { Unit } from "./unit";

export class Population {
    units: Unit[] = [];
    
    constructor(size: number) {
      for (let i = 0; i < size; i++) {
        this.units.push(new Unit())
      }
    }
  }
  