import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let cloned = req.clone({
    setHeaders: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (token) {
    cloned = cloned.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(cloned);
};
