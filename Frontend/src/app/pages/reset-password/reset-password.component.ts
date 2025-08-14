import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzIconModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  senhaRedefinida = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Pegar parâmetros da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (!this.token || !this.email) {
        this.message.error('Link inválido ou expirado');
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (!this.password || !this.confirmPassword) {
      this.message.error('Por favor, preencha todos os campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message.error('As senhas não coincidem');
      return;
    }

    if (this.password.length < 6) {
      this.message.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.isLoading = true;

    this.http.post(`${environment.apiUrl}/reset-password`, {
      token: this.token,
      email: this.email,
      password: this.password,
      password_confirmation: this.confirmPassword
    })
    .subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.senhaRedefinida = true;
        this.message.success('Senha redefinida com sucesso!');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao redefinir senha:', error);
        
        if (error.status === 400) {
          this.message.error('Token inválido ou expirado');
        } else if (error.status === 422) {
          this.message.error('Dados inválidos. Verifique as informações');
        } else {
          this.message.error('Erro ao redefinir senha. Tente novamente');
        }
      }
    });
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
