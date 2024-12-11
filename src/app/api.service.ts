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

  updatePosition(positionId: string, position: Position) {
    return this.http.put(`/api/positions/${positionId}`, position);
  }

  getCategories() {
    return this.http.get<any[]>(`/api/categories`);
  }

  createCategory(name: string) {
    return this.http.post(`/api/categories/create`, { name });
  }

  getAllItems() {
    return this.http.get<any[]>(`/api/items`);
  }

  getAllUnits() {
    return this.http.get<any[]>(`/api/units`);
  }
}
