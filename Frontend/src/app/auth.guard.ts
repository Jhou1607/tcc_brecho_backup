import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.isAuthenticated()) {
      // Primeiro, verifica se já temos o usuário carregado
      let user = this.authService.getCurrentUserValue();
      
      if (user) {
        if (user.role === 'admin') {
          return true;
        } else {
          this.router.navigate(['/catalogo']);
          return false;
        }
      } else {
        // Se não temos o usuário, carrega e aguarda
        return this.authService.fetchCurrentUser().pipe(
          map(user => {
            if (user && user.role === 'admin') {
              return true;
            } else {
              this.router.navigate(['/catalogo']);
              return false;
            }
          }),
          catchError(error => {
            this.router.navigate(['/login']);
            return of(false);
          })
        );
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
