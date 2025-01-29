import { MAX_SPEED } from "../configuration";

export class MovementController {
    computeNewPosition(x: number, y: number, angle: number, speed: number): { newX: number, newY: number } {
        const angleInRadians = angle * (Math.PI / 180);
        return {
            newX: x + Math.cos(angleInRadians) * (speed / MAX_SPEED),
            newY: y + Math.sin(angleInRadians) * (speed / MAX_SPEED),
        };
    }

    processActions(actions: number[], speed: number, handlers: { turnLeft: () => void, turnRight: () => void, accelerate: () => void, decelerate: () => void }): void {
        if (actions[0] === 1) handlers.turnLeft();
        if (actions[1] === 1) handlers.turnRight();
        if (actions[2] === 1 && speed + 1 <= MAX_SPEED) handlers.accelerate();
        if (actions[3] === 1 && speed - 1 >= 0) handlers.decelerate();
    }
}