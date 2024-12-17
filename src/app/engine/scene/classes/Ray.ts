import { CELL_SIZE, MAX_RAY_LENGTH } from "../configuration";
import { Wall } from "./Worldmap";

export class Ray {
  constructor(
    public originX: number,
    public originY: number,
    public angle: number,
    public maxLength: number
  ) {}

 
  getEndPoint(): { x: number; y: number } {
    return {
      x: this.originX + Math.cos(this.angle) * this.maxLength,
      y: this.originY + Math.sin(this.angle) * this.maxLength,
    };
  }

  cast(walls: Wall[]): { x: number; y: number } | null {
    let closestPoint: { x: number; y: number } | null = null;
    let closestDistance = MAX_RAY_LENGTH;

    for (const wall of walls) {
      const segments = this.wallToSegments(wall, CELL_SIZE);
      for (const { x1, y1, x2, y2 } of segments) {
        const intersection = this.getIntersection(x1, y1, x2, y2);
        if (intersection) {
          const distance = Math.sqrt(
            (intersection.x - this.originX) ** 2 +
            (intersection.y - this.originY) ** 2
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPoint = intersection;
          }
        }
      }
    }
    if (!closestPoint) {
        return this.getEndPoint();
    }
    return closestPoint;
  }

  private wallToSegments(wall: Wall, cellSize: number): { x1: number; y1: number; x2: number; y2: number }[] {
    const x1 = wall.x * cellSize;
    const y1 = wall.y * cellSize;
    const x2 = x1 + wall.width * cellSize;
    const y2 = y1 + wall.height * cellSize;

    return [
      { x1:x1, y1:y1, x2:x2, y2:y1 }, // Top
      { x1:x2, y1:y1, x2:x2, y2:y2 }, // Right
      { x1:x2, y1:y2, x2:x1, y2:y2 }, // Bottom
      { x1:x1, y1:y2, x2:x1, y2:y1 }, // Left
    ];
  }

  distanceToCollision(walls: Wall[]): number {
    let minDistance = this.maxLength;
    walls.forEach((wall) => {
      const collisionPoint = this.cast(walls);
      if (collisionPoint) {
        const dx = collisionPoint.x - this.originX;
        const dy = collisionPoint.y - this.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
        }
      }
    });
    return minDistance;
  }

  private getIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): { x: number; y: number } | null {
    const x3 = this.originX;
    const y3 = this.originY;
    const x4 = this.getEndPoint().x;
    const y4 = this.getEndPoint().y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denom === 0) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const intersectionX = x1 + t * (x2 - x1);
      const intersectionY = y1 + t * (y2 - y1);
      return { x: intersectionX, y: intersectionY };
    }

    return null;
  }
}
