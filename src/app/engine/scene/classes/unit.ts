import { BehaviorSubject } from 'rxjs';
import { uniqueNamesGenerator, colors, starWars } from 'unique-names-generator';

export class Unit {
    name = uniqueNamesGenerator({dictionaries: [starWars]});
    posX = new BehaviorSubject(0);
    posY = new BehaviorSubject(0);
    color = uniqueNamesGenerator({dictionaries: [colors]});
    actions: number[] = []
    size = 15;
    postions: {x:number, y:number, angle: number, speed: number}[] = [];
    speed = new BehaviorSubject(0);
    angle = new BehaviorSubject(0);
    
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
        let angle = 0;
        let speed = 0;
        this.posX.next(0);
        this.posY.next(500);
        this.postions = [];
        this.postions.push({ x: this.posX.value, y: this.posY.value, angle:  angle, speed: speed});
        let x = this.posX.value;
        let y = this.posY.value;
        this.actions.forEach((action) => {
            switch (action) {
                case 1:
                angle -= 5;
                break;
                case 2:
                angle += 5;
                break;
                case 3:
                    if(speed + 1 <= 3)
                        speed += 1;
                break;
                case 4:
                    if(speed - 1 >= 0)
                        speed -= 1;
                break;
                case 5:
                default:
                break;
            }
            
            const angleInRadians = angle * (Math.PI / 180);
            
            x = x + (Math.cos(angleInRadians) * speed / 3);
            y = y + (Math.sin(angleInRadians) * speed / 3);    
            if (!(this.lastDistanceToPoint(1000, 500) < 50)) {
                this.postions.push({ x: x, y:  y, speed: speed, angle: angle});
            }
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
                Math.random() < 0.05 ? Math.floor(Math.random() * 4 + 1) : action
        );
    }
    
    getPostionByIndex(index: number): {x: number, y: number, angle: number, speed: number} {
        return this.postions.at(index * 10) || this.postions.at(-1) || {x: 0, y: 0,angle : 0, speed: 0};
    }

    get fitness(): number {
        return this.lastDistanceToPoint(1000, 500) * (this.postions.length / 10);
      }
    
}
