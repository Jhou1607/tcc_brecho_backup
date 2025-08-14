import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { 
  CategoriaAcessoriosCabeca, 
  CategoriaTops, 
  CategoriaCalcasSaias, 
  CategoriaCalcados, 
  CategoriaAcessorios 
} from '../../../interfaces/categorias';

export interface CategoriaSelecionada {
  grupo: string;
  categoria: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-hierarchical-category-selector',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  template: `
    <div class="category-selector">
      <button 
        type="button" 
        class="category-selector-btn" 
        (click)="openModal()"
        [class.has-selection]="selectedCategory">
        {{ selectedCategory ? selectedCategory.grupo + ' > ' + selectedCategory.categoria : 'Selecione o grupo e a categoria' }}
        <nz-icon nzType="down" class="dropdown-icon"></nz-icon>
      </button>

      <!-- Modal de seleção -->
      <div class="modal-overlay" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ currentStep === 'group' ? 'Escolha o grupo' : 'Escolha a categoria' }}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <div class="modal-body">
            <!-- Seleção de Grupo -->
            <div *ngIf="currentStep === 'group'" class="group-selection">
              <button 
                *ngFor="let grupo of grupos" 
                class="selection-btn"
                (click)="selectGroup(grupo)">
                {{ grupo.label }}
              </button>
            </div>
            
            <!-- Seleção de Categoria -->
            <div *ngIf="currentStep === 'category'" class="category-selection">
              <button 
                *ngFor="let categoria of currentCategories" 
                class="selection-btn"
                (click)="selectCategory(categoria)">
                {{ categoria.label }}
              </button>
              <button class="back-btn" (click)="goBackToGroups()">
                &lt; Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-selector {
      position: relative;
      width: 100%;
    }

    .category-selector-btn {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #d0c9c0;
      border-radius: 8px;
      background: #fbf9f4;
      color: #385246;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-selector-btn:hover {
      border-color: #9bad9a;
      background: #dde5db;
    }

    .category-selector-btn.has-selection {
      border-color: #9bad9a;
      background: #dde5db;
      color: #385246;
      font-weight: 500;
    }

    .dropdown-icon {
      font-size: 12px;
      color: #8c624d;
      transition: transform 0.3s ease;
    }

    .category-selector-btn:hover .dropdown-icon {
      transform: rotate(180deg);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 0;
      min-width: 320px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .modal-header {
      background: linear-gradient(135deg, #9bad9a 0%, #8c624d 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 24px;
    }

    .group-selection,
    .category-selection {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .selection-btn {
      padding: 16px 20px;
      border: 2px solid #d0c9c0;
      border-radius: 8px;
      background: #fbf9f4;
      color: #385246;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .selection-btn:hover {
      border-color: #9bad9a;
      background: #dde5db;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(155, 173, 154, 0.2);
    }

    .back-btn {
      margin-top: 16px;
      padding: 12px 20px;
      border: 2px solid #d0c9c0;
      border-radius: 8px;
      background: white;
      color: #8c624d;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      border-color: #8c624d;
      background: rgba(139, 98, 77, 0.1);
    }

    @media (max-width: 768px) {
      .modal-content {
        margin: 20px;
        min-width: auto;
        width: calc(100% - 40px);
      }
    }
  `]
})
export class HierarchicalCategorySelectorComponent {
  @Input() selectedCategory: CategoriaSelecionada | null = null;
  @Output() categorySelected = new EventEmitter<CategoriaSelecionada>();

  isModalOpen = false;
  currentStep: 'group' | 'category' = 'group';
  selectedGroup: any = null;
  currentCategories: any[] = [];

  grupos = [
    { 
      label: 'Acessórios de Cabeça', 
      value: 'acessorios_cabeca', 
      categorias: CategoriaAcessoriosCabeca 
    },
    { 
      label: 'Tops', 
      value: 'tops', 
      categorias: CategoriaTops 
    },
    { 
      label: 'Calças/Saias', 
      value: 'calcas_saias', 
      categorias: CategoriaCalcasSaias 
    },
    { 
      label: 'Calçados', 
      value: 'calcados', 
      categorias: CategoriaCalcados 
    },
    { 
      label: 'Acessórios', 
      value: 'acessorios', 
      categorias: CategoriaAcessorios 
    },
  ];

  openModal(): void {
    this.isModalOpen = true;
    this.currentStep = 'group';
    this.selectedGroup = null;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentStep = 'group';
    this.selectedGroup = null;
  }

  selectGroup(grupo: any): void {
    this.selectedGroup = grupo;
    this.currentCategories = grupo.categorias;
    this.currentStep = 'category';
  }

  selectCategory(categoria: any): void {
    if (this.selectedGroup) {
      const selectedCategory: CategoriaSelecionada = {
        grupo: this.selectedGroup.label,
        categoria: categoria.label,
        value: categoria.value,
        label: categoria.label
      };
      
      this.categorySelected.emit(selectedCategory);
      this.closeModal();
    }
  }

  goBackToGroups(): void {
    this.currentStep = 'group';
    this.selectedGroup = null;
  }
}
