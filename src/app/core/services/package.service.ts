import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private api = 'http://localhost:3000/api/packages';

  constructor(private http: HttpClient) {}

  // Paquetes asignados al usuario (delivery) o todos (admin)
  getPaquetesAsignados() {
    return this.http.get<any[]>(this.api);
  }

  // Paquetes sin asignar
  getPaquetesSinAsignar() {
    return this.http.get<any[]>(`${this.api}/unassigned`);
  }

  // Asignar paquete existente a un delivery
  asignarPaquete(paqueteId: number, deliveryId: number) {
    return this.http.put(`${this.api}/${paqueteId}/assign`, { delivery_id: deliveryId });
  }

  // Crear y asignar paquete (admin)
  crearPaquete(direccionEntrega: string, deliveryId: number) {
    return this.http.post(this.api + '/assign', { direccion_entrega: direccionEntrega, delivery_id: deliveryId });
  }

  // Actualizar estado de paquete
  updateEstado(id: number, estado: string) {
    return this.http.put(`${this.api}/${id}`, { status: estado });
  }
}
