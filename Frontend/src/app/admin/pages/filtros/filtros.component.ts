import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AdminFilterGroup, AdminFilterOption, UnifiedFilterGroup, UnifiedFilterOption } from '../../../services/admin.service';

// Ng-Zorro Modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';

interface CategoriaFiltro {
  tipo: string;
  nome: string;
  descricao: string;
  icon: string;
}

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzTypographyModule,
    NzSpinModule,
    NzEmptyModule,
    NzToolTipModule,
    NzModalModule,
    NzInputModule
  ]
})
export class FiltrosComponent implements OnInit {
  filtros: UnifiedFilterGroup[] = [];
  loading = false;
  
  // Categorias de filtros
  categorias: CategoriaFiltro[] = [
    { tipo: 'cor', nome: 'Cores', descricao: 'Gerenciar cores disponíveis', icon: 'bg-colors' },
    { tipo: 'categoria', nome: 'Categorias', descricao: 'Gerenciar categorias de produtos', icon: 'tags' },
    { tipo: 'genero', nome: 'Gêneros', descricao: 'Gerenciar gêneros disponíveis', icon: 'user' },
    { tipo: 'material', nome: 'Materiais', descricao: 'Gerenciar materiais disponíveis', icon: 'skin' },
    { tipo: 'estado_conservacao', nome: 'Estados', descricao: 'Gerenciar estados de conservação', icon: 'star' },
    { tipo: 'numeracao', nome: 'Numerações', descricao: 'Gerenciar numerações disponíveis', icon: 'ordered-list' },
    { tipo: 'ocasioes', nome: 'Ocasiões', descricao: 'Gerenciar ocasiões de uso', icon: 'calendar' },
    { tipo: 'estilos', nome: 'Estilos', descricao: 'Gerenciar estilos disponíveis', icon: 'heart' },
    { tipo: 'estacao', nome: 'Estações', descricao: 'Gerenciar estações do ano', icon: 'sun' }
  ];

  // Pop-up state
  isPopUpVisible = false;
  categoriaSelecionada: CategoriaFiltro | null = null;
  filtrosFiltrados: UnifiedFilterOption[] = [];
  termoPesquisa = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdminFiltros();
  }

  loadAdminFiltros(): void {
    this.loading = true;
    this.adminService.getAdminFiltros().subscribe({
      next: (response: any) => {
        if (response.success) {
          // Converter para interface unificada
          this.filtros = response.data.map((group: AdminFilterGroup) => ({
            type: group.type,
            options: group.options.map((option: AdminFilterOption) => ({
              id: option.id,
              type: option.filter_type,
              value: option.value,
              label: option.label,
              is_active: option.is_active,
              sort_order: option.sort_order,
              created_at: option.created_at,
              updated_at: option.updated_at
            }))
          }));
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar filtros:', error);
        this.loading = false;
      }
    });
  }

  // Abrir pop-up de categoria
  abrirPopUpCategoria(categoria: CategoriaFiltro): void {
    this.categoriaSelecionada = categoria;
    this.termoPesquisa = '';
    this.filtrarFiltros();
    this.isPopUpVisible = true;
  }

  // Fechar pop-up
  fecharPopUp(): void {
    this.isPopUpVisible = false;
    this.categoriaSelecionada = null;
    this.filtrosFiltrados = [];
    this.termoPesquisa = '';
  }

  // Filtrar filtros baseado na pesquisa
  filtrarFiltros(): void {
    if (!this.categoriaSelecionada) return;

    const filtrosCategoria = this.getFiltrosByType(this.categoriaSelecionada.tipo);
    
    if (this.termoPesquisa.trim() === '') {
      this.filtrosFiltrados = filtrosCategoria;
    } else {
      const termo = this.termoPesquisa.toLowerCase();
      this.filtrosFiltrados = filtrosCategoria.filter(filtro =>
        filtro.label.toLowerCase().includes(termo) ||
        filtro.value.toLowerCase().includes(termo)
      );
    }
  }

  // Obter filtros por tipo
  getFiltrosByType(type: string): UnifiedFilterOption[] {
    const filterGroup = this.filtros.find(group => group.type === type);
    return filterGroup ? filterGroup.options : [];
  }

  // Contar filtros ativos por tipo
  getFiltrosAtivos(tipo: string): number {
    const filtros = this.getFiltrosByType(tipo);
    return filtros.filter(filtro => filtro.is_active).length;
  }

  // Contar total de filtros por tipo
  getFiltrosTotal(tipo: string): number {
    return this.getFiltrosByType(tipo).length;
  }

  // Toggle status do filtro
  toggleFilterStatus(filterId: number): void {
    // Encontrar o filtro na lista
    const filterGroup = this.filtros.find(group => 
      group.options.some(option => option.id === filterId)
    );
    
    if (filterGroup) {
      const option = filterGroup.options.find(opt => opt.id === filterId);
      if (option) {
        // Otimistic update - mudar imediatamente no frontend
        const newStatus = !option.is_active;
        option.is_active = newStatus;
        
        // Atualizar também na lista filtrada do pop-up
        const filtroFiltrado = this.filtrosFiltrados.find(f => f.id === filterId);
        if (filtroFiltrado) {
          filtroFiltrado.is_active = newStatus;
        }
        
        // Chamar API em background
        this.adminService.toggleFilterStatus(filterId).subscribe({
          next: (response) => {
            console.log('Status do filtro alterado com sucesso:', response);
            // Não precisa fazer nada, já foi atualizado otimisticamente
          },
          error: (error) => {
            console.error('Erro ao alterar status do filtro:', error);
            // Reverter mudança em caso de erro
            option.is_active = !newStatus;
            if (filtroFiltrado) {
              filtroFiltrado.is_active = !newStatus;
            }
          }
        });
      }
    }
  }

  // Obter label do tipo de filtro (mantido para compatibilidade)
  getFilterTypeLabel(type: string): string {
    const categoria = this.categorias.find(cat => cat.tipo === type);
    return categoria ? categoria.nome : type;
  }
} 