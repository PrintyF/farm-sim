import { Ray } from './Ray';
import { NUM_RAYS, MAX_RAY_LENGTH } from '../configuration';

export class RayManager {
  private rays: Ray[] = [];

  updateRays(unitAngle: number, x: number, y: number): void {
    const angleStep = (Math.PI/2) / NUM_RAYS;
    this.rays = [];
    for (let i = 0; i < NUM_RAYS; i++) {
      const angle = unitAngle - (Math.PI/4) + (i * angleStep);
      this.rays.push(new Ray(x, y, angle, MAX_RAY_LENGTH));
    }
  }

  getRays(): Ray[] {
    return this.rays;
  }
}
