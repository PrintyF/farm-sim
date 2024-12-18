import { OBJ_POS_X, OBJ_POS_Y } from "../configuration";
import { Unit } from "./Unit";
import { Worldmap } from "./Worldmap";

export class Population {
  units: Unit[] = [];
  
  constructor(size: number, wmap: Worldmap) {
    for (let i = 0; i < size; i++) {
      this.units.push(new Unit(wmap))
    }
  }
  
  currentAlpha(tick: number): Unit {
    let alpha = this.units[0];
    this.units.forEach((unit) => {
      if (unit != alpha && 
          unit.distanceToPoint(OBJ_POS_X, OBJ_POS_Y, tick) < alpha.distanceToPoint(OBJ_POS_X, OBJ_POS_Y, tick)) {
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
  
  reproduce(): void {
    this.units.forEach((unit) => {
      if (unit != this.alpha) {
        unit.combine(this.alpha);
        unit.mutate();
        unit.computeUnit();
      }
    });
  }
  
}
