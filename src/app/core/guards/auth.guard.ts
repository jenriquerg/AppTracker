import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = localStorage.getItem('access_token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const decoded = tokenService.decodeToken(token);
  if (!decoded) {
    localStorage.removeItem('access_token');
    router.navigate(['/login']);
    return false;
  }

  const permisos: string[] = decoded.permisos || [];
  const requiredPermiso = route.data?.['permiso'];

  if (requiredPermiso && !permisos.includes(requiredPermiso)) {
    localStorage.clear();
    router.navigate(['/']);
    return false;
  }

  return true;
};
