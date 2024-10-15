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
        
        this.posX.next(500);
        this.posY.next(500);
        this.postions.push({x:this.posX.value, y:this.posY.value})
        let x = this.posX.value;
        let y = this.posY.value;    
        for (let i= 0; i < 60000; i++) {
            const action = Math.round(Math.random() * 3 + 1);
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
            this.postions.push({x:x, y:y})        
        }
    }

    distanceToPoint(x: number, y: number): number {
        return Math.sqrt(
            Math.pow(x - this.posX.value, 2) +
            Math.pow(y - this.posY.value, 2));    
    }
    
    getPostionByIndex(index: number): {x: number, y: number} {
        return this.postions.at(index * 10) || {x: 0, y: 0};
    }
    
}
