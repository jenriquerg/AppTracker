import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { DeliveryService } from '../../core/services/delivery.service';
import { PackageService } from '../../core/services/package.service';
import { Delivery } from '../../core/models/delivery.model';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule, 
    TableModule,
  ],
})
export class AdminComponent implements OnInit {
  map: L.Map | undefined;
  deliveries: Delivery[] = [];
  markers: { [id: number]: L.Marker } = {};

  // Modal
  modalVisible = false;
  selectedDelivery: Delivery | null = null;
  paquetesSinAsignar: any[] = [];
  selectedPackageId: number | null = null;

  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.loadDeliveries();

    setInterval(() => this.loadDeliveries(), 5000); // actualizar cada 5s
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [20.65967, -100.40111],
      zoom: 14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);
  }

  loadDeliveries(): void {
    this.deliveryService.getLatestLocations().subscribe((data) => {
      this.deliveries = data;

      data.forEach((delivery) => {
        const { id, lat, lng, username, status } = delivery;

        const existingMarker = this.markers[id];
        const position = L.latLng(lat, lng);

        if (existingMarker) {
          existingMarker.setLatLng(position);
        } else {
          const marker = L.marker(position)
            .addTo(this.map!)
            .bindPopup(`<b>${username}</b><br>Status: ${status}`);
          this.markers[id] = marker;
        }
      });
    });
  }

  openAssignModal(delivery: Delivery): void {
    this.selectedDelivery = delivery;
    this.modalVisible = true;
    this.selectedPackageId = null;
    this.loadPaquetesSinAsignar();
  }

  loadPaquetesSinAsignar(): void {
    this.packageService.getPaquetesSinAsignar().subscribe({
      next: (paquetes) => (this.paquetesSinAsignar = paquetes),
      error: (err) => console.error('Error cargando paquetes sin asignar', err),
    });
  }

  asignarPaquete(): void {
    if (!this.selectedPackageId || !this.selectedDelivery) return;

    this.packageService
      .asignarPaquete(this.selectedPackageId, this.selectedDelivery.id)
      .subscribe({
        next: () => {
          alert('Paquete asignado correctamente');
          this.closeModal();
          this.loadDeliveries();
        },
        error: (err) =>
          alert('Error asignando paquete: ' + (err.message || err)),
      });
  }

  closeModal(): void {
    this.modalVisible = false;
    this.selectedDelivery = null;
    this.paquetesSinAsignar = [];
    this.selectedPackageId = null;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
