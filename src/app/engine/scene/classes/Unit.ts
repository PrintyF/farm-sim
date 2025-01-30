import { uniqueNamesGenerator, colors, starWars } from 'unique-names-generator';
import { NeuralNetwork } from '../../../neural-network/NeuralNetwork';
import { COMBINATION_FACTOR, INITIAL_UNIT_POS_X, INITIAL_UNIT_POS_Y, MAX_SPEED, MUTATION_FACTOR, OBJ_SIZE, OBJ_POS_X, OBJ_POS_Y, UNIT_SIZE, TIMER, TICK_RATE, CELL_SIZE, NUM_RAYS, MAX_RAY_LENGTH } from '../configuration';
import { Worldmap } from './Worldmap';
import { Ray } from './Ray';
import { RayManager } from './RayManager';
import { FitnessEvaluator } from './FitnessEvaluator';
import { MovementController } from './MouvementController';

export type UnitState = {
    x: number;
    y: number;
    angle: number;
    speed: number;
    rays: Ray[];
    normalizedInputs: number[];
    hasReachedWall: boolean;
    fitness:  number
};

export class Unit {
    name = uniqueNamesGenerator({ dictionaries: [starWars] });
    color = "rgba(" + Math.random() * 255 + ', ' + Math.random() * 255 + ', ' + Math.random() * 255 + ', ' + 0.5 + ')';

    rayManager: RayManager = new RayManager();

    size = UNIT_SIZE;
    states: UnitState[] = [];
    fitnessModifier: number = 0;
    isInWall: boolean = false;
    
    unitState :UnitState = {
        x: 0,
        y: 0,
        speed: 0,
        angle: 0,
        rays: [],
        normalizedInputs: [],
        hasReachedWall: false,
        fitness: 0
    }

    neuralNetwork = new NeuralNetwork([4 + NUM_RAYS*2, 4 + NUM_RAYS*2, 4 + NUM_RAYS*2, 5]);

    constructor(private wmap: Worldmap, private movementController: MovementController) {
        this.computeUnit();
    }

    computeUnit() {
        let angle = 0, speed = 0, x = INITIAL_UNIT_POS_X, y = INITIAL_UNIT_POS_Y;
        this.fitnessModifier = 0;
        this.rayManager.updateRays(angle, x, y);
        this.states = [];

        for (let tick = 0; tick <= TIMER; tick++) {
            const normalizedInputs = this.getNormalizedInputs(tick, x, y, angle, speed);
            this.neuralNetwork.feedForward(normalizedInputs);
            const actions = this.neuralNetwork.layers.at(-1)!.outputs
            this.movementController.processActions(actions, speed, {
                turnRight:() => (angle -= 5),
                turnLeft: () => (angle += 5),
                accelerate: () => (speed += 1),
                decelerate: () => (speed -= 1)});

            const { newX, newY } = this.movementController.computeNewPosition(x, y, angle, speed);
            const hasReachedObjective = this.wmap.hasReachedEntity(newX, newY, UNIT_SIZE, [this.wmap.objective]);
            const hasReachedWall = this.wmap.hasReachedEntity(newX, newY, UNIT_SIZE, this.wmap.walls);
            hasReachedWall ? this.isInWall = true: this.isInWall = false;
            if (!hasReachedWall && !hasReachedObjective) {
                x = newX;
                y = newY;
            } else if (hasReachedObjective) {
                this.fitnessModifier -= 100000;
            } else if(!hasReachedObjective && x === newX && y === newY) {
                this.fitnessModifier += 10;
            } else {
                this.fitnessModifier += 10000;
            }

            this.rayManager.updateRays(angle * (Math.PI / 180), x, y);
            [normalizedInputs].concat(this.neuralNetwork.layers.map(layer => layer.outputs));
            this.addState(x, y, angle, speed, normalizedInputs, hasReachedWall, this.fitnessModifier);
        }
    }

    getNormalizedInputs(tick: number, x: number, y: number, angle: number, speed: number): number[] {
        let raysInputs = this.rayManager.getRays().map(ray => 1 - (ray.distanceToCollision(this.wmap.walls) / MAX_RAY_LENGTH));
        raysInputs = raysInputs.concat(this.rayManager.getRays().map(ray => 1 - (ray.distanceToCollision([this.wmap.objective]) / MAX_RAY_LENGTH)));
        const normalizedDistance = 1 / (1 + (this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y) / 100));
        const normalizedSpeed = speed / MAX_SPEED;
        const normalizedAngle = Math.abs(angle % 360) / 360;
        const normalizedTimer = tick / TIMER;
        return [
            normalizedDistance,
            normalizedSpeed,
            normalizedAngle,
            normalizedTimer,
            ...raysInputs
        ];
    }

    private addState(x: number, y: number, angle: number, speed: number, normalizedInputs: number[], hasReachedWall: boolean, fitness: number): void {
        const newState: UnitState = {
            x,
            y,
            angle,
            speed,
            rays: [...this.rayManager.getRays()],
            normalizedInputs: normalizedInputs,
            hasReachedWall,
            fitness
        };
        this.states.push(newState);
    }

    distanceToPoint(x: number, y: number, tick: number): number {
        return Math.sqrt(
            Math.pow(x - this.unitState.x, 2) +
            Math.pow(y - this.unitState.y, 2)) - UNIT_SIZE;
    }

    lastDistanceToPoint(x: number, y: number): number {
        let posX = INITIAL_UNIT_POS_X;
        let posY = INITIAL_UNIT_POS_Y;
        if (this.states.at(-1)) {
            posX = this.states.at(-1)!.x
            posY = this.states.at(-1)!.y
        }
        return Math.sqrt(
            Math.pow(x - posX, 2) +
            Math.pow(y - posY, 2)) - UNIT_SIZE;
    }

    getStateByTick(tick: number): UnitState | undefined {
        return this.states.at(parseInt((tick / TICK_RATE).toFixed(0)));
    }

    setUnitToTick(tick: number): void {
        this.unitState = this.getStateByTick(tick)!;
    }


    get fitness(): number {
        return FitnessEvaluator.calculateFitness(this);
    }

}
