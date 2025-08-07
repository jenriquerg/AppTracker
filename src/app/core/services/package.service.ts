import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private api = 'http://localhost:3000/api/packages';

  constructor(private http: HttpClient) {}

  getPaquetesAsignados() {
    return this.http.get<any>(this.api);
  }

  getPaquetesSinAsignar() {
    return this.http.get<any[]>(`${this.api}/sin-asignar`);
  }

  asignarPaquete(paqueteId: number, deliveryId: number) {
    return this.http.put(`${this.api}/asignar/${paqueteId}`, { deliveryId });
  }

  updateEstado(id: number, estado: string) {
    return this.http.put(`${this.api}/${id}`, { status: estado });
  }
}
