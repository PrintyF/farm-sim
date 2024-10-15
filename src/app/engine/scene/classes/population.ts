import { Unit } from "./unit";

export class Population {
    units: Unit[] = [];
    
    constructor(size: number) {
      for (let i = 0; i < size; i++) {
        this.units.push(new Unit())
      }
    }

    get alpha(): Unit {
      let alpha = this.units[0];
      this.units.forEach((unit) => {
        if (unit.distanceToPoint(0, 0) < alpha.distanceToPoint(0, 0)) {
          alpha = unit;
        }

      });
      return alpha;
    }
  }
  