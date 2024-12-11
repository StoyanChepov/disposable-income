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
  getLatestPositions(count: number) {
    return this.http.get<Position[]>(`/api/expenses?pageSize=${count}`);
  }

  getPositionById(id: string) {
    return this.http.get<Position>(`/api/expenses/${id}`);
  }

  removePosition(id: string) {
    return this.http.delete(`/api/expenses/${id}`);
  }

  addPosition(position: any) {
    return this.http.post('/api/expenses/create', position);
  }

  updatePosition(position: Position) {
    return this.http.put(`/api/positions/${position._id}`, position);
  }
}
