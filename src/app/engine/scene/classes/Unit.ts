import { uniqueNamesGenerator, colors, starWars } from 'unique-names-generator';
import { NeuralNetwork } from '../../../neural-network/NeuralNetwork';
import { COMBINATION_FACTOR, INITIAL_UNIT_POS_X, INITIAL_UNIT_POS_Y, MAX_SPEED, MUTATION_FACTOR, OBJ_SIZE, OBJ_POS_X, OBJ_POS_Y, UNIT_SIZE, TIMER, TICK_RATE, CELL_SIZE, NUM_RAYS, MAX_RAY_LENGTH } from '../configuration';
import { Worldmap } from './Worldmap';
import { Ray } from './Ray';
import { RayManager } from './RayManager';

export type UnitState = {
    x: number;
    y: number;
    angle: number;
    speed: number;
    rays: Ray[];
    neuralNetwork: NeuralNetwork;
    normalizedInputs: number[];
};

export class Unit {
    name = uniqueNamesGenerator({dictionaries: [starWars]});
    color = "rgba(" + Math.random() * 255 + ', '+ Math.random() * 255 + ', '+ Math.random() * 255 + ', ' + 0.5 + ')';

    rayManager: RayManager = new RayManager();

    size = UNIT_SIZE;
    states: UnitState[] = [];


    neuralNetwork = new NeuralNetwork([4 + NUM_RAYS, 4 + NUM_RAYS, 4 + NUM_RAYS, 5]);
    
    constructor(private wmap: Worldmap) {
        this.computeUnit();
    }
    
    computeUnit() {
        let angle = 0, speed = 0, x = INITIAL_UNIT_POS_X, y = INITIAL_UNIT_POS_Y;
    
        this.rayManager.updateRays(angle, x, y);
        this.states = [];
    
        for (let tick = 0; tick < TIMER; tick++) {
            const normalizedInputs = this.getNormalizedInputs(tick, x, y, angle, speed);   
            this.neuralNetwork.feedForward(normalizedInputs);
            const action = this.neuralNetwork.layers.at(-1)!.outputs
            this.processActions(action, () => (angle -= 5), () => (angle += 5), () => (speed += 1), () => (speed -= 1), speed);
    
            const { newX, newY } = this.computeNewPosition(x, y, angle, speed);
            if (!this.wmap.isWall((newX + UNIT_SIZE) / CELL_SIZE, (newY + UNIT_SIZE) / CELL_SIZE)) {
                x = newX;
                y = newY;
            }
    
            this.rayManager.updateRays(angle * (Math.PI / 180), x, y);
            if (!this.hasReachedObjective(x, y)) {
                const state = [normalizedInputs].concat(this.neuralNetwork.layers.map(layer => layer.outputs));
                this.addState(x, y, angle, speed, normalizedInputs, this.neuralNetwork);
            }
        }
    }
  
    getNormalizedInputs(tick: number, x: number, y: number, angle: number, speed: number): number[] {
        const raysInputs = this.rayManager.getRays().map(ray => ray.distanceToCollision(this.wmap.walls) / MAX_RAY_LENGTH);
        const normalizedDistance = 1/(1+(this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y)/100));
        const normalizedSpeed = speed / MAX_SPEED;
        const normalizedAngle = Math.abs(angle % 360)/360;
        const normalizedTimer = tick/TIMER;
        return [
            normalizedDistance,
            normalizedSpeed,
            normalizedAngle,
            normalizedTimer,
            ...raysInputs
        ];
    }
    
    private processActions(action: number[], turnLeft: () => void, turnRight: () => void, accelerate: () => void, decelerate: () => void, speed: number): void {
        const actionsMap = [
            { condition: () => action[0] === 1, execute: turnLeft },
            { condition: () => action[1] === 1, execute: turnRight },
            { condition: () => action[2] === 1 && speed + 1 <= MAX_SPEED, execute: accelerate },
            { condition: () => action[3] === 1 && speed - 1 >= 0, execute: decelerate },
        ];

        actionsMap.forEach(({ condition, execute }) => {
            if (condition()) execute();
        });
    }
    
    private computeNewPosition(x: number, y: number, angle: number, speed: number): { newX: number, newY: number } {
        const angleInRadians = angle * (Math.PI / 180);
        const deltaX = Math.cos(angleInRadians) * (speed / MAX_SPEED);
        const deltaY = Math.sin(angleInRadians) * (speed / MAX_SPEED);
        return { newX: x + deltaX, newY: y + deltaY };
    }
    
    private hasReachedObjective(x: number, y: number): boolean {
        return this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y) < OBJ_SIZE;
    }
    
    private addState(x: number, y: number, angle: number, speed: number, normalizedInputs: number[], neuralNetwork: NeuralNetwork): void {
        const newState: UnitState = {
            x,
            y,
            angle,
            speed,
            rays: [...this.rayManager.getRays()],
            normalizedInputs: normalizedInputs,
            neuralNetwork: neuralNetwork
          };
        this.states.push(newState);
    }
    
    private captureNeuralState(normalizedInputs: number[]): number[][] {
        const state: number[][] = [normalizedInputs];
        this.neuralNetwork.layers.forEach(layer => state.push(layer.outputs));
        return state;
    }
        
    distanceToPoint(x: number, y: number, tick: number): number {
    return Math.sqrt(
        Math.pow(x - this.getStateByTick(tick)!.x, 2) +
        Math.pow(y - this.getStateByTick(tick)!.y, 2)) - UNIT_SIZE;    
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
        
    combine(unit: Unit): void {
        for (let i = 0; i < this.neuralNetwork.layers.length; i++) {
            for (let j = 0; j < this.neuralNetwork.layers[i].bias.length; j++) {
                this.neuralNetwork.layers[i].bias[j] = Math.random() < COMBINATION_FACTOR ? this.neuralNetwork.layers[i].bias[j] : unit.neuralNetwork.layers[i].bias[j]
            }
            for (let j = 0; j < this.neuralNetwork.layers[i].weights.length; j++) {
                for (let k = 0; k < this.neuralNetwork.layers[i].weights[j].length; k++) {
                  this.neuralNetwork.layers[i].weights[j][k] = Math.random() < COMBINATION_FACTOR ? this.neuralNetwork.layers[i].weights[j][k] : unit.neuralNetwork.layers[i].weights[j][k];
                }
            }            
         }
    }
    
    mutate(): void {
        for (let i = 0; i < this.neuralNetwork.layers.length; i++) {
            for (let j = 0; j < this.neuralNetwork.layers[i].bias.length; j++) {
                this.neuralNetwork.layers[i].bias[j] = Math.random() < MUTATION_FACTOR ? Math.random() * 2 - 1 : this.neuralNetwork.layers[i].bias[j];
            }
            for (let j = 0; j < this.neuralNetwork.layers[i].weights.length; j++) {
                for (let k = 0; k < this.neuralNetwork.layers[i].weights[j].length; k++) {
                  this.neuralNetwork.layers[i].weights[j][k] = Math.random() < MUTATION_FACTOR ? Math.random() * 2 - 1 : this.neuralNetwork.layers[i].weights[j][k];
                }
            }            
         }
    }
    
    getStateByTick(tick: number): UnitState | undefined {
        return this.states.at(parseInt((tick/TICK_RATE).toFixed(0)));
    }

    get fitness(): number {
        return this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y) * (this.states.length / 10);
      }
    
}
