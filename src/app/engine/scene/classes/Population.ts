import { OBJ_POS_X, OBJ_POS_Y } from "../configuration";
import { GeneticAlgorithm } from "./GeneticAlgorithm";
import { MovementController } from "./MouvementController";
import { Unit } from "./Unit";
import { Worldmap } from "./Worldmap";

export class Population {
  units: Unit[] = [];
  
  constructor(size: number, wmap: Worldmap) {
    for (let i = 0; i < size; i++) {
      this.units.push(new Unit(wmap, new MovementController()))
    }
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
    console.time('computeUnit')
    console.log(this.alpha)
    this.units.forEach((unit) => {
      if (unit != this.alpha) {
        GeneticAlgorithm.combine(unit.neuralNetwork, this.alpha.neuralNetwork);
        GeneticAlgorithm.mutate(unit.neuralNetwork);
        unit.computeUnit();
      }
    });
    console.timeEnd('computeUnit')
  }
  
}
