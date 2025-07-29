import { Component, OnInit } from '@angular/core';
import { AdminService, FilterOption } from '../../services/admin.service';

@Component({
  selector: 'app-filter-manager',
  templateUrl: './filter-manager.component.html',
  styleUrls: ['./filter-manager.component.scss'],
  standalone: false
})
export class FilterManagerComponent implements OnInit {
  
  activeTab = 'categorias';
  loading = false;
  
  filterTypes = [
    { key: 'categorias', label: 'Categorias' },
    { key: 'cores', label: 'Cores' },
    { key: 'marcas', label: 'Marcas' },
    { key: 'estilos', label: 'Estilos' },
    { key: 'ocasioes', label: 'Ocasiões' },
    { key: 'estacoes', label: 'Estações' }
  ];

  filterOptions: { [key: string]: FilterOption[] } = {};
  newOptionName = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (!this.filterOptions[tab]) {
      this.loadFilterOptionsForType(tab);
    }
  }

  loadFilterOptions(): void {
    this.loadFilterOptionsForType(this.activeTab);
  }

  loadFilterOptionsForType(type: string): void {
    this.loading = true;
    this.adminService.getFilterOptions(type).subscribe({
      next: (options) => {
        this.filterOptions[type] = options;
        this.loading = false;
      },
      error: (error) => {
        console.error(`Erro ao carregar ${type}:`, error);
        this.filterOptions[type] = [];
        this.loading = false;
      }
    });
  }

  addFilterOption(): void {
    if (!this.newOptionName.trim()) return;

    this.adminService.addFilterOption(this.activeTab, this.newOptionName.trim()).subscribe({
      next: (newOption) => {
        this.filterOptions[this.activeTab].push(newOption);
        this.newOptionName = '';
      },
      error: (error) => {
        console.error('Erro ao adicionar opção:', error);
        alert('Erro ao adicionar opção');
      }
    });
  }

  editFilterOption(option: FilterOption): void {
    const newName = prompt('Digite o novo nome:', option.name);
    if (newName && newName.trim() && newName !== option.name) {
      this.adminService.updateFilterOption(this.activeTab, option.id, newName.trim()).subscribe({
        next: (updatedOption) => {
          const index = this.filterOptions[this.activeTab].findIndex(o => o.id === option.id);
          if (index !== -1) {
            this.filterOptions[this.activeTab][index] = updatedOption;
          }
        },
        error: (error) => {
          console.error('Erro ao atualizar opção:', error);
          alert('Erro ao atualizar opção');
        }
      });
    }
  }

  deleteFilterOption(option: FilterOption): void {
    if (confirm(`Tem certeza que deseja excluir "${option.name}"?`)) {
      this.adminService.deleteFilterOption(this.activeTab, option.id).subscribe({
        next: () => {
          this.filterOptions[this.activeTab] = this.filterOptions[this.activeTab].filter(
            o => o.id !== option.id
          );
        },
        error: (error) => {
          console.error('Erro ao excluir opção:', error);
          alert('Erro ao excluir opção');
        }
      });
    }
  }

  getActiveTabLabel(): string {
    const found = this.filterTypes.find(t => t.key === this.activeTab);
    return found ? found.label : '';
  }
} 