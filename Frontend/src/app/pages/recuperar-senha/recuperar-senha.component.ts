import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzIconModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent {
  email = '';
  isLoading = false;
  emailEnviado = false;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private http: HttpClient
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.message.error('Por favor, insira seu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.message.error('Por favor, insira um email válido');
      return;
    }

    this.isLoading = true;

    this.http.post(`${environment.apiUrl}/forgot-password`, { email: this.email })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.emailEnviado = true;
          this.message.success('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao enviar email de recuperação:', error);
          
          if (error.status === 404) {
            this.message.error('Email não encontrado em nossa base de dados');
          } else if (error.status === 429) {
            this.message.error('Muitas tentativas. Tente novamente em alguns minutos');
          } else {
            this.message.error('Erro ao enviar email de recuperação. Tente novamente');
          }
        }
      });
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
