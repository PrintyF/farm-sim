import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Worldmap } from '../classes/Worldmap';
import { WorldmapEntity } from '../type/WorldmapEntity';

export interface MapData {
  height: number,
  width: number,
  start: { x: number; y: number };
  objective: WorldmapEntity;
  walls: WorldmapEntity[];
}

@Injectable({
  providedIn: 'root',
})
export class MapService {

  wmap: null | Worldmap = null;

  constructor(private http: HttpClient) {
  }

  getMapData(): Observable<MapData> {
    return this.http.get<MapData>('map_001.json').pipe(
      tap((map) => {
      this.wmap = new Worldmap(map);
    })
  );
  }
}
