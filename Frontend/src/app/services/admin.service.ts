import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, User, PaginatedResponse } from '../interfaces/interfaces';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalFilters: number;
  recentUsers: User[];
  recentProducts: Product[];
}

export interface FilterOption {
  id: number;
  type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface FilterGroup {
  type: string;
  options: FilterOption[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  // Produtos
  getProdutos(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/produtos`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  createProduto(data: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/produtos`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateProduto(id: number, data: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/produtos/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduto(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/produtos/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Filtros
  getFiltros(): Observable<FilterGroup[]> {
    return this.http.get<FilterGroup[]>(`${this.apiUrl}/filtros`, {
      headers: this.getAuthHeaders()
    });
  }

  createFiltro(type: string, value: string): Observable<FilterOption> {
    return this.http.post<FilterOption>(`${this.apiUrl}/filtros/${type}`, {
      value
    }, {
      headers: this.getAuthHeaders()
    });
  }

  updateFiltro(type: string, id: number, value: string): Observable<FilterOption> {
    return this.http.put<FilterOption>(`${this.apiUrl}/filtros/${type}/${id}`, {
      value
    }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteFiltro(type: string, id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/filtros/${type}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Usuários
  getUsuarios(page: number = 1, perPage: number = 10): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/usuarios`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  deleteUsuario(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUsuarioRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/usuarios/${id}/role`, {
      role
    }, {
      headers: this.getAuthHeaders()
    });
  }
} 