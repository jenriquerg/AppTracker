import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: 'login' },
];
