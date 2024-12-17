import { uniqueNamesGenerator, colors, starWars } from 'unique-names-generator';
import { NeuralNetwork } from '../../../neural-network/NeuralNetwork';
import { COMBINATION_FACTOR, INITIAL_UNIT_POS_X, INITIAL_UNIT_POS_Y, MAX_SPEED, MUTATION_FACTOR, OBJ_SIZE, OBJ_POS_X, OBJ_POS_Y, UNIT_SIZE, TIMER, TICK_RATE, CELL_SIZE, NUM_RAYS, MAX_RAY_LENGTH } from '../configuration';
import { Worldmap } from './Worldmap';
import { Ray } from './Ray';

export class Unit {
    name = uniqueNamesGenerator({dictionaries: [starWars]});
    color = uniqueNamesGenerator({dictionaries: [colors]});
    rays: Ray[] = [];

    size = UNIT_SIZE;
    states: {x:number, y:number, angle: number, speed: number, neuralNetwork: number[][], rays: Ray[]}[] = [];


    neuralNetwork = new NeuralNetwork([4 + NUM_RAYS, 15,15,15, 5]);

    
    constructor(private wmap: Worldmap) {
        this.initUnit();
    }

    updateRays(unitAngle: number, x: number, y: number): void {
        const angleStep = (2 * Math.PI) / NUM_RAYS;
        this.rays = [];
        for (let i = 0; i < NUM_RAYS; i++) {
            const angle = unitAngle + i * angleStep;
            this.rays.push(new Ray(x, y, angle, MAX_RAY_LENGTH));
          }
    }
    
    initUnit() {
        let angle = 0;
        let speed = 0;
        let x = INITIAL_UNIT_POS_X;
        let y = INITIAL_UNIT_POS_Y;
        this.updateRays(angle, x, y);
        this.states = [];
        this.states.push({ x: x, y: y, angle:  angle, speed: speed, neuralNetwork: [], rays: this.rays});
        for (let tick = 0; tick < TIMER; tick++) {
            let state = [];
            const raysNN: number[] = this.rays.map((ray) => ray.distanceToCollision(this.wmap.walls)/MAX_RAY_LENGTH);
            let action: any[] = this.neuralNetwork.feedForward(
                [1/(1+(this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y)/100)), speed / MAX_SPEED, Math.abs(angle % 360)/360, tick/TIMER].concat(raysNN));
            state.push([1/(1+(this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y)/100)), speed / MAX_SPEED, Math.abs(angle % 360)/360, tick/TIMER].concat(raysNN));
            this.neuralNetwork.layers.forEach((layer) => {
                state.push(layer.outputs);
            })

            const actionsMap = [
                { condition: () => action[0], execute: () => (angle -= 5) },
                { condition: () => action[1], execute: () => (angle += 5) },
                { condition: () => action[2] && speed + 1 <= MAX_SPEED, execute: () => (speed += 1) },
                { condition: () => action[3] && speed - 1 >= 0, execute: () => (speed -= 1) },
            ];
            
            actionsMap.forEach(({ condition, execute }) => {
                if (condition()) execute();
            });
            const angleInRadians = angle * (Math.PI / 180);
            const newX = x + (Math.cos(angleInRadians) * speed / MAX_SPEED) + UNIT_SIZE;
            const newY = y + (Math.sin(angleInRadians) * speed / MAX_SPEED) + UNIT_SIZE;

            if (!this.wmap.isWall(newX/CELL_SIZE, newY/CELL_SIZE)) {
                x = x + (Math.cos(angleInRadians) * speed / MAX_SPEED);
                y = y + (Math.sin(angleInRadians) * speed / MAX_SPEED);    
            }   
            this.updateRays(angleInRadians, x, y);
            if (!(this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y) < OBJ_SIZE)) {
                this.states.push({ x: x, y:  y, speed: speed, angle: angle, neuralNetwork: state, rays: this.rays});
            }
        };
    }
    
    distanceToPoint(x: number, y: number, tick: number): number {
        return Math.sqrt(
            Math.pow(x - this.getStateByTick(tick).x, 2) +
            Math.pow(y - this.getStateByTick(tick).y, 2)) - UNIT_SIZE;    
        }
        
    lastDistanceToPoint(x: number, y: number): number {
        return Math.sqrt(
            Math.pow(x - this.states.at(-1)!.x, 2) +
            Math.pow(y - this.states.at(-1)!.y, 2)) - UNIT_SIZE;    
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
    
    getStateByTick(tick: number): {x: number, y: number, angle: number, speed: number, rays: Ray[]} {
        return this.states.at(parseInt((tick/TICK_RATE).toFixed(0))) || this.states.at(-1) || {x: 0, y: 0, angle : 0, speed: 0, rays: []};
    }

    get fitness(): number {
        return this.lastDistanceToPoint(OBJ_POS_X, OBJ_POS_Y) * (this.states.length / 10);
      }
    
}
