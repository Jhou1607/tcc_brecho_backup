import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { FilterGroup, FilterOption } from '../../../services/admin.service';

// Ng-Zorro Modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';


@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzTagModule,
    NzIconModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzSpaceModule,
    NzTypographyModule,
    NzSpinModule,
    NzEmptyModule,
    NzToolTipModule,
    NzSelectModule
  ]
})
export class FiltrosComponent implements OnInit {
  filtros: FilterGroup[] = [];
  loading = false;
  isModalVisible = false;
  isEditMode = false;
  editingFilter: FilterOption | null = null;
  filterForm: FormGroup;
  
  filterTypes = [
    { value: 'cor', label: 'Cor' },
    { value: 'estilo', label: 'Estilo' },
    { value: 'ocasiao', label: 'Ocasião' },
    { value: 'material', label: 'Material' },
    { value: 'estacao', label: 'Estação' },
    { value: 'marca', label: 'Marca' }
  ];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      type: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadFiltros();
  }

  loadFiltros(): void {
    this.loading = true;
    this.adminService.getFiltros().subscribe({
      next: (filtros) => {
        this.filtros = filtros;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar filtros:', error);
        this.loading = false;
      }
    });
  }

  showCreateModal(): void {
    this.isEditMode = false;
    this.editingFilter = null;
    this.filterForm.reset();
    this.isModalVisible = true;
  }

  showEditModal(filter: FilterOption): void {
    this.isEditMode = true;
    this.editingFilter = filter;
    this.filterForm.patchValue({
      type: filter.type,
      value: filter.value
    });
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.filterForm.valid) {
      const formData = this.filterForm.value;

      if (this.isEditMode && this.editingFilter) {
        this.adminService.updateFiltro(formData.type, this.editingFilter.id, formData.value).subscribe({
          next: () => {
            console.log('Filtro atualizado com sucesso!');
            this.isModalVisible = false;
            this.loadFiltros();
          },
          error: (error) => {
            console.error('Erro ao atualizar filtro:', error);
          }
        });
      } else {
        this.adminService.createFiltro(formData.type, formData.value).subscribe({
          next: () => {
            console.log('Filtro criado com sucesso!');
            this.isModalVisible = false;
            this.loadFiltros();
          },
          error: (error) => {
            console.error('Erro ao criar filtro:', error);
          }
        });
      }
    }
  }
  
  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteFiltro(type: string, id: number): void {
    this.adminService.deleteFiltro(type, id).subscribe({
      next: (response) => {
        console.log('Filtro deletado:', response.message);
        this.loadFiltros();
      },
      error: (error) => {
        console.error('Erro ao deletar filtro:', error);
      }
    });
  }
  
  getFiltrosByType(type: string): FilterOption[] {
    const filterGroup = this.filtros.find(fg => fg.type === type);
    return filterGroup ? filterGroup.options : [];
  }
} 