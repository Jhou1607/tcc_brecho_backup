import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Product, PaginatedResponse } from '../../../interfaces/interfaces';

// Ng-Zorro Modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCardModule } from 'ng-zorro-antd/card';
// import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzUploadModule,
    NzCardModule,
    // NzPopconfirmModule,
    NzGridModule,
    NzIconModule,
    NzTagModule,
    NzPaginationModule,
    NzDividerModule,
    NzSpaceModule,
    NzTypographyModule,
    NzSpinModule,
    NzEmptyModule,
    NzToolTipModule
  ]
})
export class ProdutosComponent implements OnInit {
  produtos: Product[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  isModalVisible = false;
  isEditMode = false;
  editingProduct: Product | null = null;
  produtoForm: FormGroup;
  fileList: any[] = [];

  constructor(
    private adminService: AdminService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.produtoForm = this.fb.group({
      nome_produto: ['', [Validators.required]],
      preco: ['', [Validators.required, Validators.min(0)]],
      marca: [''],
      modelo: [''],
      estado_conservacao: [''],
      estacao: [''],
      categoria: [''],
      genero: [''],
      cor: [''],
      numeracao: [''],
      material: [''],
      ocasioes: [[]],
      estilos: [[]]
    });
  }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.loading = true;
    this.adminService.getProdutos(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Product>) => {
        this.produtos = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.notification.error('Erro', 'Não foi possível carregar os produtos.');
        this.loading = false;
      }
    });
  }

  showCreateModal(): void {
    this.isEditMode = false;
    this.editingProduct = null;
    this.produtoForm.reset();
    this.fileList = [];
    this.isModalVisible = true;
  }

  showEditModal(produto: Product): void {
    this.isEditMode = true;
    this.editingProduct = produto;
    this.produtoForm.patchValue({
      nome_produto: produto.nome_produto,
      preco: produto.preco,
      marca: produto.marca || '',
      modelo: produto.modelo || '',
      estado_conservacao: produto.estado_conservacao || '',
      estacao: produto.estacao || '',
      categoria: produto.categoria || '',
      genero: produto.genero || '',
      cor: produto.cor || '',
      numeracao: produto.numeracao || '',
      material: produto.material || '',
      ocasioes: produto.ocasioes || [],
      estilos: produto.estilos || []
    });
    this.fileList = [];
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.produtoForm.valid) {
      const formData = new FormData();
      const formValue = this.produtoForm.value;

      // Adicionar campos do formulário
      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== undefined) {
          if (Array.isArray(formValue[key])) {
            formValue[key].forEach((item: string, index: number) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, formValue[key]);
          }
        }
      });

      // Adicionar imagens
      this.fileList.forEach((file: any) => {
        formData.append('imagens[]', file.originFileObj);
      });

      if (this.isEditMode && this.editingProduct) {
        this.adminService.updateProduto(this.editingProduct.id, formData).subscribe({
          next: () => {
            this.notification.success('Sucesso', 'Produto atualizado com sucesso!');
            this.isModalVisible = false;
            this.loadProdutos();
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
            this.notification.error('Erro', 'Não foi possível atualizar o produto.');
          }
        });
      } else {
        this.adminService.createProduto(formData).subscribe({
          next: () => {
            this.notification.success('Sucesso', 'Produto criado com sucesso!');
            this.isModalVisible = false;
            this.loadProdutos();
          },
          error: (error) => {
            console.error('Erro ao criar produto:', error);
            this.notification.error('Erro', 'Não foi possível criar o produto.');
          }
        });
      }
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteProduto(id: number): void {
    this.adminService.deleteProduto(id).subscribe({
      next: (response) => {
        this.notification.success('Sucesso', response.message);
        this.loadProdutos();
      },
      error: (error) => {
        console.error('Erro ao deletar produto:', error);
        this.notification.error('Erro', 'Não foi possível deletar o produto.');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProdutos();
  }

  beforeUpload = (file: any): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  removeFile = (file: any): boolean => {
    const index = this.fileList.indexOf(file);
    if (index > -1) {
      this.fileList.splice(index, 1);
    }
    return false;
  };
} 