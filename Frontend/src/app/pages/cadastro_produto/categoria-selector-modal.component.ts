import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaAcessoriosCabeca, CategoriaTops, CategoriaCalcasSaias, CategoriaCalcados, CategoriaAcessorios } from '../../interfaces/categorias';
import { CategoriaSelecionada } from '../../interfaces/interfaces';

@Component({
  selector: 'app-categoria-selector-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="categoria-modal-overlay" *ngIf="aberto" (click)="fecharModal()">
      <div class="categoria-modal-box" (click)="$event.stopPropagation()">
        <div class="categoria-modal-header">
          <span *ngIf="!grupoSelecionado">Escolha o grupo</span>
          <span *ngIf="grupoSelecionado">Escolha a categoria</span>
          <button class="close-btn" (click)="fecharModal()">&times;</button>
        </div>
        <div *ngIf="!grupoSelecionado" class="categoria-grupos">
          <button *ngFor="let grupo of grupos" (click)="selecionarGrupo(grupo)">{{ grupo.label }}</button>
        </div>
        <div *ngIf="grupoSelecionado" class="categoria-categorias">
          <button *ngFor="let cat of categoriasDoGrupo" (click)="selecionarCategoria(cat)">{{ cat.label }}</button>
          <button class="voltar-btn" (click)="grupoSelecionado = null">&lt; Voltar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categoria-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 9999;
    }
    .categoria-modal-box {
      background: #fff; border-radius: 12px; padding: 32px 24px; min-width: 320px; box-shadow: 0 4px 24px #0002;
      display: flex; flex-direction: column; align-items: center;
    }
    .categoria-modal-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .categoria-grupos, .categoria-categorias { display: flex; flex-direction: column; gap: 12px; width: 100%; }
    .categoria-grupos button, .categoria-categorias button { padding: 10px 0; border-radius: 6px; border: 1px solid #eee; background: #f8f8f8; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
    .categoria-grupos button:hover, .categoria-categorias button:hover { background: #e6e6e6; }
    .voltar-btn { margin-top: 16px; background: #fff0; border: none; color: #888; font-size: 1rem; cursor: pointer; }
  `]
})
export class CategoriaSelectorModalComponent {
  @Input() aberto = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() selecionar = new EventEmitter<CategoriaSelecionada & { value: string, label: string }>();

  grupos = [
    { label: 'Acessórios de Cabeça', value: 'acessorios_cabeca', categorias: CategoriaAcessoriosCabeca },
    { label: 'Tops', value: 'tops', categorias: CategoriaTops },
    { label: 'Calças/Saias', value: 'calcas_saias', categorias: CategoriaCalcasSaias },
    { label: 'Calçados', value: 'calcados', categorias: CategoriaCalcados },
    { label: 'Acessórios', value: 'acessorios', categorias: CategoriaAcessorios },
  ];

  grupoSelecionado: { label: string, value: string, categorias: { value: string, label: string }[] } | null = null;

  get categoriasDoGrupo() {
    return this.grupoSelecionado ? this.grupoSelecionado.categorias : [];
  }

  selecionarGrupo(grupo: { label: string, value: string, categorias: { value: string, label: string }[] }) {
    this.grupoSelecionado = grupo;
  }

  selecionarCategoria(cat: { value: string, label: string }) {
    if (this.grupoSelecionado) {
      // Envie o value (backend) e label (frontend)
      this.selecionar.emit({ grupo: this.grupoSelecionado.label, categoria: cat.label, value: cat.value, label: cat.label });
      this.fecharModal();
    }
  }

  fecharModal() {
    this.grupoSelecionado = null;
    this.fechar.emit();
  }
} 