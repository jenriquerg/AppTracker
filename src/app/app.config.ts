import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import Aura from '@primeuix/themes/aura';

// Definir una interfaz para tipar el preset de Aura
interface AuraPreset {
  semantic?: {
    primary?: Record<string, string>;
    secondary?: Record<string, string>;
    text?: Record<string, string>;
    highlight?: Record<string, string>;
    [key: string]: any; // Permitir otras propiedades dinámicas
  };
}

// Personalizar el preset de Aura
const customAura: AuraPreset = {
  ...Aura,
  semantic: {
    ...(Aura.semantic || {}),
    primary: {
      50: '#e6e6ff',
      100: '#ccccff',
      200: '#9999ff',
      300: '#6666ff',
      400: '#0061ff', // Color primario
      500: '#4a12e6',
      600: '#400fb3',
      700: '#330c8c',
      800: '#260966',
      900: '#1a0633',
    },
    secondary: {
      50: '#e6f3ff',
      100: '#cce8ff',
      200: '#99d1ff',
      300: '#66baff',
      400: '#148aff', // Color secundario
      500: '#127ae6',
      600: '#0f6ab3',
      700: '#0c558c',
      800: '#094066',
      900: '#063033',
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: customAura, // Usar el preset personalizado
      },
      ripple: true,
    }),
  ],
};
