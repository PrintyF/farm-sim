import { Ray } from './Ray';
import { NUM_RAYS, MAX_RAY_LENGTH } from '../configuration';

export class RayManager {
  private rays: Ray[] = [];

  updateRays(unitAngle: number, x: number, y: number): void {
    const angleStep = (2 * Math.PI) / NUM_RAYS;
    this.rays = [];
    for (let i = 0; i < NUM_RAYS; i++) {
      const angle = unitAngle + i * angleStep;
      this.rays.push(new Ray(x, y, angle, MAX_RAY_LENGTH));
    }
  }

  getDistances(walls: any[]): number[] {
    return this.rays.map((ray) => ray.distanceToCollision(walls) / MAX_RAY_LENGTH);
  }

  getRays(): Ray[] {
    return this.rays;
  }
}
