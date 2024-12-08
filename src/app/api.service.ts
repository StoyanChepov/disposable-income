import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from './types/position';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getPositions() {
    return this.http.get<Position[]>(`/api/expenses`);
  }

  getPositionById(id: string) {
    return this.http.get<Position>(`/api/positions/${id}`);
  }

  addPosition(position: Position) {
    return this.http.post('/api/positions', position);
  }

  updatePosition(position: Position) {
    return this.http.put(`/api/positions/${position.id}`, position);
  }

  deletePosition(id: string) {
    return this.http.delete(`/api/positions/${id}`);
  }
}
