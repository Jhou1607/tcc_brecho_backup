import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
}

export interface AdminProduct {
  id: number;
  nome_produto: string;
  categoria: string;
  preco: number;
  marca: string;
  cor: string;
  genero: string;
  image_url?: string;
}

export interface AdminUser {
  id: number;
  nome_usuario: string;
  email: string;
  created_at: string;
}

export interface FilterOption {
  id: number;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/dashboard`);
  }

  // Produtos
  getAdminProducts(): Observable<{data: AdminProduct[]}> {
    return this.http.get<{data: AdminProduct[]}>(`${this.apiUrl}/admin/produtos`);
  }

  getProduct(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.apiUrl}/admin/produtos/${id}`);
  }

  createProduct(product: Partial<AdminProduct>): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.apiUrl}/admin/produtos`, product);
  }

  updateProduct(id: number, product: Partial<AdminProduct>): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.apiUrl}/admin/produtos/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/produtos/${id}`);
  }

  // Usuários
  getUsers(): Observable<{data: AdminUser[]}> {
    return this.http.get<{data: AdminUser[]}>(`${this.apiUrl}/admin/usuarios`);
  }

  // Filtros
  getFilterOptions(type: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.apiUrl}/admin/filtros/${type}`);
  }

  addFilterOption(type: string, name: string): Observable<FilterOption> {
    return this.http.post<FilterOption>(`${this.apiUrl}/admin/filtros/${type}`, { name });
  }

  updateFilterOption(type: string, id: number, name: string): Observable<FilterOption> {
    return this.http.put<FilterOption>(`${this.apiUrl}/admin/filtros/${type}/${id}`, { name });
  }

  deleteFilterOption(type: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/filtros/${type}/${id}`);
  }
} 