import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule
  ],
  templateUrl: './cadastro.component.html',
  standalone: true,
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  nome_usuario = '';
  email = '';
  password = '';
  password_confirmation = ''; // Novo campo
  data_nascimento = '';
  sexo = '';
  isLoading = false;

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
      document.getElementById('google-signup-btn'),
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
      }
    });
  }

  selecionarSexo(valor: string) {
    this.sexo = this.sexo === valor ? '' : valor;
  }

  onSubmit() {
    const userData = {
      nome_usuario: this.nome_usuario,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation, // Incluído para o backend
      data_nascimento: this.data_nascimento,
      sexo: this.sexo
    };

    // Depuração: Logar o userData antes do envio
    console.log('Enviando userData:', userData);

    // Validação dos campos obrigatórios
    if (!userData.nome_usuario || !userData.email || !userData.password || !userData.password_confirmation || !userData.data_nascimento || !userData.sexo) {
      // alert('Por favor, preencha todos os campos obrigatórios: Nome, Email, Senha, Confirmação de Senha, Data de Nascimento e Sexo.');
      return;
    }

    // Validação do formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      // alert('Por favor, insira um e-mail válido.');
      return;
    }

    // Validação da senha (mínimo 6 caracteres)
    if (userData.password.length < 6) {
      // alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Validação da confirmação de senha
    if (userData.password !== userData.password_confirmation) {
      // alert('As senhas não coincidem.');
      return;
    }

    // Validação da data de nascimento
    const date = new Date(userData.data_nascimento);
    if (isNaN(date.getTime()) || date >= new Date()) {
      // alert('Por favor, insira uma data de nascimento válida e anterior à data atual.');
      return;
    }

    // Validação do sexo
    if (userData.sexo !== 'masculino' && userData.sexo !== 'feminino') {
      // alert('Por favor, selecione um sexo válido (Masculino ou Feminino).');
      return;
    }

    this.isLoading = true;

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro no registro:', error);
        this.isLoading = false;
        if (error.status === 422 && error.error && error.error.errors) {
          let errorMessages = Object.values(error.error.errors).flat().join('\n');
          // alert('Erro de validação:\n' + errorMessages);
        } else {
          const backendMessage = error.error && error.error.message ? error.error.message : 'Ocorreu um erro desconhecido.';
          // alert('Erro ao registrar:\n' + backendMessage);
        }
      }
    });
  }
}
