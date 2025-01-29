import { OBJ_POS_X, OBJ_POS_Y } from "../configuration";
import { Unit } from "./Unit";

export class FitnessEvaluator {
    static calculateFitness(unit: Unit): number {
        const distanceScore = unit.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y) * (unit.states.length / 10);
        return distanceScore + unit.fitnessModifier;
    }
}