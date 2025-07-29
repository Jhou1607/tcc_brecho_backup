import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, DashboardStats } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  
  stats: DashboardStats = { totalProducts: 0, totalUsers: 0 };
  loading = true;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        this.loading = false;
      }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/admin/produtos']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  navigateToFilters(): void {
    this.router.navigate(['/admin/filtros']);
  }
} 