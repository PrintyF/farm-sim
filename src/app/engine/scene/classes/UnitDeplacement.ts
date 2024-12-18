import { Worldmap } from './Worldmap';
import { CELL_SIZE, MAX_SPEED } from '../configuration';

export class UnitMover {
  constructor(private wmap: Worldmap) {}

  move(x: number, y: number, angle: number, speed: number): { newX: number; newY: number } {
    const angleInRadians = angle * (Math.PI / 180);
    const deltaX = Math.cos(angleInRadians) * speed / MAX_SPEED;
    const deltaY = Math.sin(angleInRadians) * speed / MAX_SPEED;

    const newX = x + deltaX;
    const newY = y + deltaY;

    if (!this.wmap.isWall(newX / CELL_SIZE, newY / CELL_SIZE)) {
      return { newX, newY };
    }
    return { newX: x, newY: y };
  }
}
