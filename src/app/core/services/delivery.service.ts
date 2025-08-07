import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from '../models/delivery.model';


@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private baseUrl = 'http://localhost:3000/api/locations';

  constructor(private http: HttpClient) {}

  getLatestLocations(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.baseUrl}/latest`);
  }

}
