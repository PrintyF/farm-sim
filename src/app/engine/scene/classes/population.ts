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
          unit.distanceToPoint(0, 0) < alpha.distanceToPoint(0, 0)) {
        alpha = unit;
      }
    });
    return alpha;
  }

  get alpha(): Unit {
    let alpha = this.units[0];
    this.units.forEach((unit) => {
      if (unit != alpha &&
          unit.lastDistanceToPoint(0, 0) < alpha.lastDistanceToPoint(0, 0)) {
        alpha = unit;
      }
    });
    return alpha;
  }

  get fitness(): number {
    return this.alpha.lastDistanceToPoint(0, 0);
  }
  
  reproduce() {
    this.units.forEach((unit) => {
        unit.combine(this.alpha);
        unit.mutate();
        unit.initPositions();
    });
  }
  
}
