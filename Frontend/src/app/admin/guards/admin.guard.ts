import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUserValue();
    
    console.log('=== ADMIN GUARD DEBUG ===');
    console.log('User:', user);
    console.log('User role:', user?.role);
    console.log('Is admin?', user?.role === 'admin');
    
    // Verificar se o usuário existe e tem role admin
    if (user && user.role === 'admin') {
      console.log('✅ Acesso permitido - Usuário é admin');
      return true;
    }
    
    console.log('❌ Acesso negado - Redirecionando para /catalogo');
    // Redireciona para a página inicial se não for admin
    this.router.navigate(['/catalogo']);
    return false;
  }
} 