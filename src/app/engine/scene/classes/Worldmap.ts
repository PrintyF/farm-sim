import { CELL_SIZE, UNIT_SIZE } from "../configuration";
import { MapData } from "../map/map.service";
import { Wall, WorldmapEntity } from "../type/WorldmapEntity";

export class Worldmap {
  width: number;
  height: number;
  walls: Wall[] = [];
  start: { x: number; y: number };
  objective: WorldmapEntity;
  grid: Map<string, Wall[]> = new Map();
  cellSize = CELL_SIZE;

  constructor(map: MapData) {
    this.walls = map.walls;
    this.objective = map.objective;
    this.start = map.start;
    this.height = map.height;
    this.width = map.width;
    this.initializeGrid();
  }

  private initializeGrid() {
    for (const wall of this.walls) {
        const key = this.getCellKey(wall.x, wall.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key)!.push(wall);
    }
}

private getCellKey(x: number, y: number): string {
  return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
}

  addWall(wall: Wall): void {
    this.walls.push(wall);
  }

  getNearbyWalls(x: number, y: number): boolean {
    const keys = [
        this.getCellKey(x, y),
        this.getCellKey(x + this.cellSize, y),
        this.getCellKey(x - this.cellSize, y),
        this.getCellKey(x, y + this.cellSize),
        this.getCellKey(x, y - this.cellSize)
    ];
    return keys.some((key) => this.grid.has(key));
}

  hasReachedEntity(x: number, y: number, unitSize: number, entities: WorldmapEntity[]): boolean{
    return entities.some(
      (entity) =>
        x + unitSize > entity.x * CELL_SIZE &&
        x < entity.x * CELL_SIZE + (entity.width * CELL_SIZE)  + unitSize &&
        y  + unitSize  > entity.y * CELL_SIZE &&
        y < entity.y * CELL_SIZE + (entity.height *  CELL_SIZE)  + unitSize 
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
          this.objective = this.parseWorldMapEntity(parts);
          break;

        case 'WALL':
          this.addWall(this.parseWorldMapEntity(parts));
          break;

        default:
          console.warn(`Unrecognized line: ${line}`);
      }
    });
  }

  private parseWorldMapEntity(parts: string[]): Wall {
    const x = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    const width = parseInt(parts[3], 10);
    const height = parseInt(parts[4], 10);

    return {height: height, width: width, x: x, y: y};
  }
}
