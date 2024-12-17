import { MapData } from "../map/map.service";

export type Wall = {x: number; y: number; width: number; height: number};

export class Worldmap {
  width: number;
  height: number;
  walls: Wall[] = [];
  start: { x: number; y: number };
  objective: { x: number; y: number };

  constructor(map: MapData) {
    this.walls = map.walls;
    this.objective = map.objective;
    this.start = map.start;
    this.height = map.height;
    this.width = map.width;
  }

  addWall(x: number, y: number, width: number, height: number): void {
    this.walls.push({ x, y, width, height });
  }

  isWall(x: number, y: number): boolean {
    return this.walls.some(
      (wall) =>
        x >= wall.x &&
        x < wall.x + wall.width &&
        y >= wall.y &&
        y < wall.y + wall.height
    );
  }

  loadFromFile(fileContent: string): void {
    const lines = fileContent.split('\n');

    lines.forEach((line) => {
      const parts = line.trim().split(' ');

      switch (parts[0].toUpperCase()) {
        case 'START':
          this.start = { x: parseInt(parts[1], 10), y: parseInt(parts[2], 10) };
          break;

        case 'OBJECTIVE':
          this.objective = { x: parseInt(parts[1], 10), y: parseInt(parts[2], 10) };
          break;

        case 'WALL':
          const x = parseInt(parts[1], 10);
          const y = parseInt(parts[2], 10);
          const width = parseInt(parts[3], 10);
          const height = parseInt(parts[4], 10);
          this.addWall(x, y, width, height);
          break;

        default:
          console.warn(`Unrecognized line: ${line}`);
      }
    });
  }
}
