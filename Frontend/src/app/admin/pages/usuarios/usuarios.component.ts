import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../auth.service';

// Ng-Zorro Modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
// import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NzTableModule,
    NzButtonModule,
    NzCardModule,
    NzAvatarModule,
    NzTagModule,
    // NzPopconfirmModule,
    NzIconModule,
    NzSpaceModule,
    NzToolTipModule,
    NzSpinModule,
    NzEmptyModule,
    NzPaginationModule
  ]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  total = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.adminService.getUsuarios(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.usuarios = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
      }
    });
  }

  deleteUsuario(id: number): void {
    this.adminService.deleteUsuario(id).subscribe({
      next: (response) => {
        console.log('Usuário deletado:', response.message);
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Erro ao deletar usuário:', error);
      }
    });
  }

  toggleRole(usuario: User): void {
    const newRole = usuario.role === 'admin' ? 'user' : 'admin';
    this.adminService.updateUsuarioRole(usuario.id, newRole).subscribe({
      next: (response) => {
        console.log('Role atualizada:', response);
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Erro ao atualizar role:', error);
      }
    });
  }

  getRoleColor(role: string): string {
    return role === 'admin' ? 'red' : 'blue';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsuarios();
  }
} 