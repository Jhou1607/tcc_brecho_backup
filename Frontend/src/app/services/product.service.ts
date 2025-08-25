// src/app/services/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ClothingGroup,
  LookConfig,
  PaginatedResponse,
  Product,
  ProductFormData,
  UserProductFormData,
  Look // Importe Look
} from '../interfaces/interfaces';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFavoritos(page: number = 1): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams().set('page', page.toString());
    const headers = this.getAuthHeaders();
    return this.http.get<{ success: boolean; data: PaginatedResponse<Product> }>(`${this.apiUrl}/favoritos`, { headers, params }).pipe(
      map(response => response.data)
    );
  }

  getLookById(lookId: number): Observable<Look> {
    const headers = this.getAuthHeaders();
    return this.http.get<Look>(`${this.apiUrl}/looks/${lookId}`, { headers });
  }

  // Novo método para buscar os looks do usuário
  getLooksUsuario(): Observable<Look[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ success: boolean; data: Look[] }>(`${this.apiUrl}/looks`, { headers }).pipe(
      map(response => response.data)
    );
  }

  // Novo método para deletar um look
  deleteLook(lookId: number): Observable<{ success: boolean; message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/looks/${lookId}`, { headers });
  }

  createProdutoUsuario(data: UserProductFormData): Observable<any> {
    const formData = new FormData();
    formData.append('nome_produto', data.nome_produto);
    if (data.marca) formData.append('marca', data.marca);
    if (data.categoria) formData.append('categoria', data.categoria);
    if (data.estacao) formData.append('estacao', data.estacao);
    if (data.cor) formData.append('cor', data.cor);
    formData.append('imagem_principal', data.imagem_principal, data.imagem_principal.name);
    if (data.ocasioes && Array.isArray(data.ocasioes)) {
      data.ocasioes.forEach((o, i) => formData.append(`ocasioes[${i}]`, o));
    }
    if (data.estilos && Array.isArray(data.estilos)) {
      data.estilos.forEach((e, i) => formData.append(`estilos[${i}]`, e));
    }
    if (data.material) {
      formData.append('material', data.material);
    }
    return this.http.post<{ success: boolean; message: string; data: any }>(
      `${this.apiUrl}/produto-usuario`,
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  getProdutosUsuario(page: number = 1): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ success: boolean; data: PaginatedResponse<Product> }>(
      `${this.apiUrl}/produto-usuario`,
      { headers: this.getAuthHeaders(), params }
    ).pipe(map(response => response.data));
  }

  deleteProdutoUsuario(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/produto-usuario/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getProdutoUsuarioById(id: number | string): Observable<Product> {
    return this.http.get<{ success: boolean; data: Product }>(
      `${this.apiUrl}/produto-usuario/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(map(response => response.data));
  }

  getProdutos(term: string = '', page: number = 1, filters: any = {}, per_page: number = 12): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams().set('page', page.toString()).set('per_page', per_page.toString());
    if (term) params = params.set('term', term);
    // Adiciona filtros como query params
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length) {
        filters[key].forEach((val: string) => {
          params = params.append(key, val);
        });
      }
    });
    let requestUrl = `${this.apiUrl}/produtos`;
    if (term) requestUrl = `${this.apiUrl}/produtos/search`;
    
    console.log('🚀 ProdutoService - Fazendo requisição para:', requestUrl);
    console.log('🔧 Parâmetros:', params.toString());
    console.log('🌐 API URL base:', this.apiUrl);
    
    // Tenta usar headers de autenticação se disponível, senão faz sem
    const token = localStorage.getItem('authToken');
    const headers = token ? this.getAuthHeaders() : new HttpHeaders();
    
    console.log('🔑 Token disponível:', token ? 'Sim' : 'Não');
    console.log('📋 Headers:', headers);
    
    return this.http.get<{ success: boolean; data: PaginatedResponse<Product> }>(requestUrl, { params, headers }).pipe(
      tap(response => {
        console.log('✅ Resposta da API recebida:', response);
      }),
      map(response => response.data)
    );
  }

  /**
   * Busca as opções de filtros dinâmicos do backend (categorias, cores, tamanhos, etc)
   */
  getFiltrosDisponiveis(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filtros-disponiveis`);
  }

  // Método para buscar filtros por tipo
  getFiltrosPorTipo(tipo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/filtros-admin?tipo=${tipo}`, {
      headers: this.getAuthHeaders()
    });
  }

  getProdutoById(id: number | string): Observable<Product> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.apiUrl}/produtos/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  createProduto(data: ProductFormData): Observable<Product> {
    const formData = new FormData();
    // Adicionar campos do produto
    if (data.nome_produto !== undefined && data.nome_produto !== null) formData.append('nome_produto', data.nome_produto);
    if (data.marca !== undefined && data.marca !== null) formData.append('marca', data.marca);
    if (data.categoria !== undefined && data.categoria !== null) formData.append('categoria', data.categoria);
    if (data.estacao !== undefined && data.estacao !== null) formData.append('estacao', data.estacao);
    if (data.cor !== undefined && data.cor !== null) formData.append('cor', data.cor);
    if (data.ocasioes !== undefined && data.ocasioes !== null) {
      data.ocasioes.forEach((ocasiao: string) => {
        formData.append('ocasioes[]', ocasiao);
      });
    }
    if (data.estilos !== undefined && data.estilos !== null) {
      data.estilos.forEach((estilo: string) => {
        formData.append('estilos[]', estilo);
      });
    }
    if (data.material !== undefined && data.material !== null) formData.append('material', data.material);
    if (data.preco !== undefined && data.preco !== null) {
      formData.append('preco', data.preco.toString());
    }
    if (data.estado_conservacao !== undefined && data.estado_conservacao !== null) formData.append('estado_conservacao', data.estado_conservacao);
    if (data.numeracao !== undefined && data.numeracao !== null) {
      formData.append('numeracao', data.numeracao.toString());
    }
    if (data.imagem_principal instanceof File) {
      formData.append('imagem_principal', data.imagem_principal, data.imagem_principal.name);
    }
    if (data.imagens_adicionais && data.imagens_adicionais.length > 0) {
      data.imagens_adicionais.forEach((file, index) => {
        formData.append(`imagens_adicionais[${index}]`, file, file.name);
      });
    }
    return this.http.post<{ success: boolean, message: string, data: Product }>(`${this.apiUrl}/produtos`, formData, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  toggleFavorite(produtoId: number): Observable<{ success: boolean, message: string, status: 'added' | 'removed' }> {
    return this.http.post<{ success: boolean, message: string, status: 'added' | 'removed' }>(`${this.apiUrl}/favoritos/toggle`, { produto_id: produtoId }, { headers: this.getAuthHeaders() });
  }

  getFavoritosIds(): Observable<number[]> {
    return this.http.get<{ success: boolean, data: number[] }>(`${this.apiUrl}/favoritos/ids`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  getAllProdutosUsuario(): Observable<Product[]> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('per_page', '999');
    return this.http.get<{ success: boolean; data: PaginatedResponse<Product> }>(
      `${this.apiUrl}/produto-usuario`,
      { headers, params }
    ).pipe(map(response => response.data.data));
  }

  // Alteração: nome_look agora é opcional e passa no body
  saveLook(nome_look: string, configuracao: any, imagem_base64: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/looks`, { nome_look, configuracao, imagem_base64 }, { headers });
  }

  updateLook(id: number, nome_look: string, configuracao: any, imagem_base64: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/looks/${id}`, { nome_look, configuracao, imagem_base64 }, { headers });
  }

  getItensParaMontador(): Observable<ClothingGroup[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ClothingGroup[]>(`${this.apiUrl}/montador/roupas`, { headers }).pipe(
      map(grupos => grupos.map(grupo => ({
        ...grupo,
        items: grupo.items.map(item => ({
          ...item,
          // Adapte as URLs de imagem se necessário para o seu backend
          thumbnailUrl: item.thumbnailUrl ? `${this.apiUrl.replace('/api', '')}${item.thumbnailUrl}` : 'assets/produtos/placeholder-product.png',
          canvasUrl: item.canvasUrl ? item.canvasUrl : ''
        }))
      })))
    ) as Observable<ClothingGroup[]>;
  }
}