import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = ''; // Alterado de 'senha' para 'password'
  isLoading = false; // Indicador de carregamento

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.renderGoogleButton();
  }

  renderGoogleButton() {
    const clientId = '754445728495-c7tv7l3u4oi0budv5ju6n32peatus6dk.apps.googleusercontent.com';
    // Adiciona o script do Google Identity Services se não existir
    if (!document.getElementById('google-identity')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-identity';
      document.body.appendChild(script);
      script.onload = () => this.initGoogle(clientId);
    } else {
      this.initGoogle(clientId);
    }
  }

  initGoogle(clientId: string) {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => this.handleGoogleCredential(response)
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large', width: 300 }
    );
  }

  handleGoogleCredential(response: any) {
    this.isLoading = true;
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao autenticar com Google: ', err);
      }
    });
  }

  onSubmit(): void {
    // Validação dos campos obrigatórios
    if (!this.email || !this.password) {
      console.error('Erro de validação: Email ou Senha ausentes.');
      return;
    }

    // Validação do formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      console.error('Erro de validação: Email inválido.');
      return;
    }

    this.isLoading = true;

    const credentials = {
      email: this.email,
      password: this.password
    };

    // Depuração: Logar as credenciais
    console.log('Enviando credenciais:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.authService.storeToken(response.access_token);
        this.router.navigate(['/catalogo']); // Redireciona para a página de catálogo
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.isLoading = false;
        if (error.status === 422 && error.error && error.error.errors) {
          let errorMessages = Object.values(error.error.errors).flat().join('\n');
          console.error('Erro de validação:', errorMessages);
        } else if (error.status === 401) {
          console.error('Credenciais inválidas. Verifique seu email e senha.');
        } else {
          const backendMessage = error.error && error.error.message ? error.error.message : 'Ocorreu um erro desconhecido.';
          console.error('Erro ao fazer login:', backendMessage);
        }
      }
    });
  }

  onForgotPassword(): void {
    console.log('Vamos te ajudar a recuperar sua senha!');
    // Aqui você pode redirecionar ou abrir um modal
  }

  loginWithGoogle(): void {
    console.log('Futuramente, aqui vai entrar a integração com o Google!');
    // Aqui vai a lógica de autenticação com Firebase ou OAuth no futuro
  }
}
