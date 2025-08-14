import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../auth.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DebugComponent implements OnInit {
  user: User | null = null;
  isAuthenticated = false;
  token = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.user = this.authService.getCurrentUserValue();
    this.token = this.authService.getToken() || '';
    
    console.log('🔍 DEBUG - Status da autenticação:');
    console.log('🔍 isAuthenticated:', this.isAuthenticated);
    console.log('🔍 user:', this.user);
    console.log('🔍 token:', this.token);
  }

  refreshUser(): void {
    this.authService.fetchCurrentUser().subscribe(user => {
      this.user = user;
      console.log('🔍 Usuário atualizado:', user);
    });
  }
} 