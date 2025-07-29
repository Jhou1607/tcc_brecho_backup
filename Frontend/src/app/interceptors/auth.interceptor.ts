import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isPublicRoute = req.url.includes('/login') || req.url.includes('/register');

  console.log('Interceptor: Requisição para', req.url, 'Token:', token || 'Nenhum');
  if (token && !isPublicRoute) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor: Adicionando header Authorization:', authReq.headers.get('Authorization'));
    return next(authReq);
  }

  console.log('Interceptor: Sem token ou rota pública, enviando sem Authorization.');
  return next(req);
};
