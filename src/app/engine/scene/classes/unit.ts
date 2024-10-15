import { BehaviorSubject } from 'rxjs';
import { uniqueNamesGenerator, colors, starWars } from 'unique-names-generator';

export class Unit {
    name = uniqueNamesGenerator({dictionaries: [starWars]});
    posX = new BehaviorSubject(0);
    posY = new BehaviorSubject(0);
    color = uniqueNamesGenerator({dictionaries: [colors]});
    actions: number[] = []
    size = 15;
    postions: {x:number, y:number}[] = [];

    constructor() {
        let x = this.posX.value;
        let y = this.posY.value;
        for (let i = 0; i < 6000; i++) {
            const action = Math.floor(Math.random() * 5 + 1);
            this.actions.push(action);
        }
        this.initPositions();
    }

    initPositions() {
        this.posX.next(500);
        this.posY.next(500);
        this.postions = [];
        this.postions.push({ x: this.posX.value, y: this.posY.value });
        let x = this.posX.value;
        let y = this.posY.value;
        this.actions.forEach((action) => {
            if (action === 1) {
                x += 2;
            }
            if (action === 2) {
                x -= 2;
            }
            if (action === 3) {
                y += 2;
            }
            if (action === 4) {
                y -= 2;
            }
            this.postions.push({ x: x, y: y });
        });
    }

    distanceToPoint(x: number, y: number): number {
        return Math.sqrt(
            Math.pow(x - this.posX.value, 2) +
            Math.pow(y - this.posY.value, 2));    
    }

    lastDistanceToPoint(x: number, y: number): number {
        return Math.sqrt(
            Math.pow(x - this.postions.at(-1)!.x, 2) +
            Math.pow(y - this.postions.at(-1)!.y, 2));    
    }

    combine(unit: Unit): void {
        this.actions = this.actions.map((action, index) => 
          Math.random() < 0.5 ? action : unit.actions[index]
        );
      }

    mutate(): void {
        this.actions = this.actions.map((action) => 
            Math.random() < 0.1 ? Math.floor(Math.random() * 4 + 1) : action
          );
      }
    
    getPostionByIndex(index: number): {x: number, y: number} {
        return this.postions.at(index * 10) || {x: 0, y: 0};
    }
    
}
