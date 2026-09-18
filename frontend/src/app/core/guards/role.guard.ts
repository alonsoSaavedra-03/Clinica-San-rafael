import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUserValue;
    if (!user) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Si el usuario no tiene el rol, redirigir a su panel correspondiente
    if (user.role === 'medico') {
      router.navigate(['/doctor/dashboard']);
    } else if (user.role === 'administrador') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/patient/dashboard']);
    }

    return false;
  };
};
