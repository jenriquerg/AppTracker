import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../core/services/package.service';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../../core/services/auth.service';
import * as L from 'leaflet';
import * as socketIOClient from 'socket.io-client';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit, OnDestroy {
  paquetes: any[] = [];
  loading = true;

  private map!: L.Map;
  private marker!: L.Marker;
  private intervalId: any;

  constructor(
    private packageService: PackageService,
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarMapa();
    this.inicializarSocket();
    this.compartirUbicacionCada10Segundos();
    this.cargarPaquetes();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
    if (this.socket) this.socket.disconnect();
  }

  inicializarMapa() {
    this.map = L.map('map').setView([19.4326, -99.1332], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
  }
  private socket: any;

  inicializarSocket() {
    const ioFunc = (socketIOClient as any).default ?? socketIOClient;
    this.socket = ioFunc('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de socket');
      this.socket.emit('join', 'delivery');
    });

    this.socket.on('disconnect', () => {
      console.warn('Desconectado del socket, reintentando...');
    });
  }

  private watchId: number | null = null;
  private ultimaLat: number | null = null;
  private ultimaLng: number | null = null;

  compartirUbicacionCada10Segundos() {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada.');
      return;
    }

    const enviarUbicacion = (lat: number, lng: number) => {
      this.ultimaLat = lat;
      this.ultimaLng = lng;

      if (!this.marker) {
        this.marker = L.marker([lat, lng]).addTo(this.map);
        this.map.setView([lat, lng], 15);
      } else {
        this.marker.setLatLng([lat, lng]);
      }

      const userId = this.tokenService.getUserId?.() ?? null;
      if (userId && this.socket?.connected) {
        this.socket.emit('locationUpdate', { userId, lat, lng });
      }
    };

    // Usar watchPosition para obtener actualización continua
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => enviarUbicacion(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error('Error al rastrear ubicación:', err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // Refuerzo con setInterval por si no hay cambios
    this.intervalId = setInterval(() => {
      if (this.ultimaLat !== null && this.ultimaLng !== null) {
        enviarUbicacion(this.ultimaLat, this.ultimaLng);
      }
    }, 10000);
  }

  cargarPaquetes() {
    this.loading = true;
    this.packageService.getPaquetesAsignados().subscribe({
      next: (res) => {
        this.paquetes = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar paquetes', err);
        this.loading = false;
      },
    });
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.packageService.updateEstado(id, nuevoEstado).subscribe({
      next: () => this.cargarPaquetes(),
      error: (err) => console.error('Error al actualizar estado', err),
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
