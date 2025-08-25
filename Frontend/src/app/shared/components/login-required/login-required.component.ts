import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-required',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="login-required-container">
      <div class="login-required-card">
        <div class="icon-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#9bad9a"/>
          </svg>
        </div>
        <h2 class="title">Acesso Restrito</h2>
        <p class="message">
          Esta página requer que você esteja logado em sua conta.
        </p>
        <div class="actions">
          <a routerLink="/login" class="btn btn-primary">Fazer Login</a>
          <a routerLink="/cadastro" class="btn btn-secondary">Criar Conta</a>
        </div>
        <a routerLink="/catalogo" class="back-link">← Voltar ao Catálogo</a>
      </div>
    </div>
  `,
  styleUrls: ['./login-required.component.scss']
})
export class LoginRequiredComponent {}
