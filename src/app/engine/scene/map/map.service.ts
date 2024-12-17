import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Worldmap } from '../classes/Worldmap';

export interface MapData {
  height: number,
  width: number,
  start: { x: number; y: number };
  objective: { x: number; y: number };
  walls: { x: number; y: number; width: number; height: number }[];
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
