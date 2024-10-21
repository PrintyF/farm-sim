import { Unit } from "./unit";

export class Population {
  units: Unit[] = [];
  
  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      this.units.push(new Unit())
    }
  }
  
  get currentAlpha(): Unit {
    let alpha = this.units[0];
    this.units.forEach((unit) => {
      if (unit != alpha && 
          unit.distanceToPoint(1000, 500) < alpha.distanceToPoint(1000, 500)) {
        alpha = unit;
      }
    });
    return alpha;
  }

  get alpha(): Unit {
    let alpha = this.units[0];
    this.units.forEach((unit) => {
      if (unit != alpha &&
          unit.fitness < alpha.fitness) {
        alpha = unit;
      }
    });
    return alpha;
  }
  
  reproduce() {
    this.units.forEach((unit) => {
      if (unit != this.alpha) {
        unit.combine(this.alpha);
        unit.mutate();
        unit.initPositions();
      }
    });
  }
  
}
