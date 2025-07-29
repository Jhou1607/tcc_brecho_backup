import { Component, OnInit } from '@angular/core';
import { AdminService, AdminUser } from '../../services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: false
})
export class UserListComponent implements OnInit {
  
  users: AdminUser[] = [];
  loading = true;
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
      }
    });
  }

  get filteredUsers(): AdminUser[] {
    if (!this.searchTerm) {
      return this.users;
    }
    
    return this.users.filter(user =>
      user.nome_usuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
} 