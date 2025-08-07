import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { PackageService } from '../../core/services/package.service';
import { TokenService } from '../../core/services/token.service';
import * as L from 'leaflet';
import * as socketIOClient from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit, OnDestroy {
  paquetes: any[] = [];
  loading = true;

  private map!: L.Map;
  private marker!: L.Marker;
  private intervalId: any;

  constructor(
    private packageService: PackageService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.inicializarMapa();
    this.inicializarSocket();
    this.compartirUbicacionCada10Segundos();
    this.cargarPaquetes();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.socket) this.socket.disconnect();
  }

  inicializarMapa() {
    this.map = L.map('map').setView([19.4326, -99.1332], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }
   private socket: any;

  inicializarSocket() {
    const ioFunc = (socketIOClient as any).default ?? socketIOClient;
    this.socket = ioFunc.connect
      ? ioFunc.connect('http://localhost:3000')
      : ioFunc('http://localhost:3000');

    this.socket.emit('join', 'delivery');
  }

  compartirUbicacionCada10Segundos() {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada.');
      return;
    }

    const enviarUbicacion = (lat: number, lng: number) => {
      if (!this.marker) {
        this.marker = L.marker([lat, lng]).addTo(this.map);
        this.map.setView([lat, lng], 15);
      } else {
        this.marker.setLatLng([lat, lng]);
      }

      const userId = this.tokenService.getUserId?.() ?? null;
      console.log(userId);

      if (userId) {
        this.socket.emit('locationUpdate', { userId, lat, lng });
      }
    };

    navigator.geolocation.getCurrentPosition(
      pos => enviarUbicacion(pos.coords.latitude, pos.coords.longitude),
      err => console.error('Error geolocalización:', err),
      { enableHighAccuracy: true }
    );

    this.intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        pos => enviarUbicacion(pos.coords.latitude, pos.coords.longitude),
        err => console.error('Error geolocalización:', err),
        { enableHighAccuracy: true }
      );
    }, 10000);
  }

  cargarPaquetes() {
    this.loading = true;
    this.packageService.getPaquetesAsignados().subscribe({
      next: res => {
        this.paquetes = res;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar paquetes', err);
        this.loading = false;
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.packageService.updateEstado(id, nuevoEstado).subscribe({
      next: () => this.cargarPaquetes(),
      error: err => console.error('Error al actualizar estado', err)
    });
  }
}