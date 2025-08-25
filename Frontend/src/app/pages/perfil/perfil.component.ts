import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, User, UserProfileUpdateData } from '../../auth.service';
import { UsuarioService, UserStats } from '../../services/usuario.service';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, DatePipe],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {
  user: User | null = null;
  editableUser: UserProfileUpdateData = {};
  isEditing = false;
  isLoading = true;
  isSaving = false;
  error: string | null = null;
  successMessage: string | null = null;
  private userSubscription?: Subscription;
  imageBaseUrl = environment.apiUrl.replace('/api', '');
  private notificationTimer: any;
  userStats = { looks_favoritados: 0, pecas_salvas: 0 };

  constructor(
    public authService: AuthService, // ALTERADO DE private PARA public
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  private setNotification(message: string, type: 'success' | 'error') {
    clearTimeout(this.notificationTimer);
    if (type === 'success') {
      this.successMessage = message;
      this.error = null;
    } else {
      this.error = message;
      this.successMessage = null;
    }
    this.cdr.detectChanges();
    this.notificationTimer = setTimeout(() => {
      this.successMessage = null;
      this.error = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        this.user = { ...currentUser };
        // A lógica de prefixar imageBaseUrl deve ser feita ao exibir, ou garantir que a API sempre retorne URLs completas.
        // No AuthController@me, já usamos Storage::url(), então a foto_url deve vir completa.
        // if (this.user.foto_url && !this.user.foto_url.startsWith('http') && !this.user.foto_url.startsWith('assets/')) {
        //   this.user.foto_url = this.imageBaseUrl + this.user.foto_url;
        // }
        this.isLoading = false;
        this.error = null;
        this.carregarEstatisticas();
      } else if (!this.authService.getToken() && !this.isLoading) {
        this.router.navigate(['/login']);
      }
    });

    if (!this.user && this.authService.getToken()) {
      this.isLoading = true;
      this.authService.fetchCurrentUser().subscribe({
        next: (fetchedUser) => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else if (!this.authService.getToken()) {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    clearTimeout(this.notificationTimer);
  }

  handleImageError(): void {
    if (this.user) {
      this.user.foto_url = 'assets/default-user-avatar.svg';
    }
  }

  carregarEstatisticas(): void {
    this.usuarioService.getEstatisticas().subscribe({
      next: (stats: UserStats) => {
        this.userStats = stats;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        // Não mostrar erro para o usuário, apenas manter os valores padrão
      }
    });
  }

  startEdit(): void {
    if (this.user) {
      this.editableUser = {
        nome_usuario: this.user.nome_usuario,
        email: this.user.email,
        data_nascimento: this.user.data_nascimento ? new Date(this.user.data_nascimento).toISOString().substring(0,10) : undefined,
        sexo: this.user.sexo,
        bio: this.user.bio || ''
      };
      this.isEditing = true;
      this.successMessage = null;
      this.error = null;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editableUser = {};
    this.error = null;
    this.successMessage = null;
  }

  saveProfile(): void {
    if (!this.editableUser || !this.user) {
      console.warn('Tentativa de salvar perfil sem usuário editável ou usuário atual.');
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;
    this.cdr.detectChanges(); // Garante que o estado de 'isSaving' seja refletido

    const dataToUpdate: UserProfileUpdateData = {};
    let hasChanges = false;

    // Compara nome_usuario
    if (this.editableUser.nome_usuario !== undefined && this.editableUser.nome_usuario !== this.user.nome_usuario) {
      dataToUpdate.nome_usuario = this.editableUser.nome_usuario;
      hasChanges = true;
    }

    // Compara email
    if (this.editableUser.email !== undefined && this.editableUser.email !== this.user.email) {
      dataToUpdate.email = this.editableUser.email;
      hasChanges = true;
    }

    // Compara data_nascimento
    // Converte a data atual do usuário para o formato YYYY-MM-DD para comparação precisa
    const currentUserBirthDateString = this.user.data_nascimento
      ? new Date(this.user.data_nascimento).toISOString().split('T')[0]
      : undefined;
    // O editableUser.data_nascimento já vem do input type="date" no formato YYYY-MM-DD
    if (this.editableUser.data_nascimento !== undefined && this.editableUser.data_nascimento !== currentUserBirthDateString) {
      dataToUpdate.data_nascimento = this.editableUser.data_nascimento;
      hasChanges = true;
    }

    // Compara sexo
    // Considera que o valor pode ser '' (string vazia) do select e o valor no user pode ser null/undefined
    const currentUserSexo = this.user.sexo || ''; // Normaliza null/undefined para '' para comparação
    const editableUserSexo = this.editableUser.sexo || ''; // Normaliza null/undefined para ''
    if (this.editableUser.sexo !== undefined && editableUserSexo !== currentUserSexo) {
      dataToUpdate.sexo = this.editableUser.sexo; // Envia o valor como está (o backend tratará '' como null se necessário)
      hasChanges = true;
    }

    // Compara bio
    const currentUserBio = this.user.bio || ''; // Normaliza null/undefined para ''
    const editableUserBio = this.editableUser.bio || ''; // Normaliza null/undefined para ''
    if (this.editableUser.bio !== undefined && editableUserBio !== currentUserBio) {
      dataToUpdate.bio = this.editableUser.bio; // Envia a bio como está (string vazia se for o caso)
      hasChanges = true;
    }

    if (!hasChanges) {
      this.isEditing = false;
      this.isSaving = false;
      this.setNotification("Nenhuma alteração detectada.", 'success');
      this.cdr.detectChanges();
      return;
    }

    console.log('Enviando atualizações para o backend:', dataToUpdate);

    this.authService.updateUserProfile(dataToUpdate).subscribe({
      next: (response) => { // A resposta do backend (ex: { message: '...' })
        this.isEditing = false;
        this.isSaving = false;
        this.setNotification('Perfil atualizado com sucesso!', 'success');

        this.authService.fetchCurrentUser().subscribe({
          next: () => console.log('Dados do usuário recarregados após salvar o perfil.'),
          error: (errFetch) => console.error('Erro ao recarregar dados do usuário após salvar:', errFetch)
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.setNotification(err.message || 'Falha ao atualizar o perfil.', 'error');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  triggerFileInput(): void {
    this.error = null;
    this.successMessage = null;
    this.usuarioService.uploadFotoUsuario().subscribe({
      next: (response) => {
        if (response) {
          this.setNotification(response.message || 'Foto atualizada com sucesso!', 'success');
          this.authService.fetchCurrentUser().subscribe();
        }
      },
      error: (err) => {
        this.setNotification(err.message || 'Erro ao atualizar a foto.', 'error');
      }
    });
  }

  retryFetchUser(): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.authService.fetchCurrentUser().subscribe({
      next: () => {
        this.isLoading = false; // User será atualizado pelo BehaviorSubject
      },
      error: (err) => {
        this.isLoading = false;
        this.setNotification('Falha ao recarregar o perfil.', 'error');
      }
    });
  }

  logout(): void {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
