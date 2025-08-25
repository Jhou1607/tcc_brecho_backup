import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Product, PaginatedResponse } from '../../../interfaces/interfaces';
import { ImageUploadProcessorComponent } from '../../../shared/components/image-upload-processor/image-upload-processor.component';
import type { ProcessedImage } from '../../../shared/components/image-upload-processor/image-upload-processor.component';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    NzGridModule,
    NzIconModule,
    NzTagModule,
    NzPaginationModule,
    NzDividerModule,
    NzSpaceModule,
    NzTypographyModule,
    NzSpinModule,
    NzEmptyModule,
    NzToolTipModule,
    ImageUploadProcessorComponent
  ]
})
export class ProdutosComponent implements OnInit {
  @ViewChild('imageProcessor') imageProcessor!: ImageUploadProcessorComponent;

  produtos: Product[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  isModalVisible = false;
  isEditMode = false;
  editingProduct: Product | null = null;
  produtoForm: FormGroup;
  
  // Image handling
  imagePreviews: SafeUrl[] = [];
  processedImageFiles: File[] = [];
  

  
  // Form submission state
  isSubmitting = false;

  // Options for dropdowns - serão carregadas dos filtros administráveis
  opcoesEstacoes: string[] = [];
  opcoesOcasioes: string[] = [];
  opcoesEstilos: string[] = [];
  opcoesMateriais: string[] = [];
  opcoesGenero: string[] = [];
  opcoesEstado: string[] = [];
  opcoesCores: string[] = [];
  opcoesCategorias: string[] = [];
  opcoesNumeracao: string[] = [];

  constructor(
    private adminService: AdminService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.produtoForm = this.fb.group({
      nome_produto: ['', [Validators.required]],
      preco: [null, [Validators.required, Validators.min(0)]],
      marca: [''],
      categoria: ['', [Validators.required]],
      cor: [''],
      genero: [''],
      estado_conservacao: [''],
      estacao: [''],
      numeracao: [''],
      material: [''],
      ocasioes: [[]],
      estilos: [[]]
    });
  }

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      nome_produto: ['', [Validators.required]],
      preco: [null, [Validators.required, Validators.min(0)]],
      marca: [''],
      categoria: ['', [Validators.required]],
      cor: [''],
      genero: [''],
      estado_conservacao: [''],
      estacao: [''],
      numeracao: [''],
      material: [''],
      ocasioes: [[]],
      estilos: [[]]
    });

    this.loadProdutos();
    this.loadAdminFiltros();
  }

  loadAdminFiltros(): void {
    this.adminService.getAdminFiltros().subscribe({
      next: (response: any) => {
        if (response.success) {
          response.data.forEach((filterGroup: any) => {
            const options = filterGroup.options.map((option: any) => option.label);
            
            switch (filterGroup.type) {
              case 'estacao':
                this.opcoesEstacoes = options;
                break;
              case 'ocasioes':
                this.opcoesOcasioes = options;
                break;
              case 'estilos':
                this.opcoesEstilos = options;
                break;
              case 'material':
                this.opcoesMateriais = options;
                break;
              case 'genero':
                this.opcoesGenero = options;
                break;
              case 'estado':
                this.opcoesEstado = options;
                break;
              case 'cor':
                this.opcoesCores = options;
                break;
              case 'categoria':
                this.opcoesCategorias = options;
                break;
              case 'numeracao':
                this.opcoesNumeracao = options;
                break;
            }
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar filtros administráveis:', error);
        // Fallback para opções básicas em caso de erro
        this.loadFallbackOptions();
      }
    });
  }

  private loadFallbackOptions(): void {
    this.opcoesEstacoes = ['primavera', 'verao', 'outono', 'inverno', 'todas_as_estacoes'];
    this.opcoesOcasioes = ['casual', 'trabalho', 'festa', 'esporte', 'formal', 'praia', 'academia'];
    this.opcoesEstilos = ['vintage', 'retro', 'moderno', 'classico', 'esportivo', 'elegante', 'casual'];
    this.opcoesMateriais = ['algodao', 'poliester', 'linho', 'seda', 'la', 'couro', 'jeans'];
    this.opcoesGenero = ['masculino', 'feminino', 'unissex'];
    this.opcoesEstado = ['novo', 'semi-novo', 'usado', 'vintage'];
    this.opcoesCores = ['branco', 'preto', 'azul', 'vermelho', 'verde', 'amarelo', 'rosa'];
    this.opcoesCategorias = ['camisetas', 'calcas', 'vestidos', 'saias', 'blusas', 'jaquetas'];
    this.opcoesNumeracao = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
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
        this.message.error('Erro ao carregar produtos');
        this.loading = false;
      }
    });
  }

  showModal(): void {
    this.isModalVisible = true;
    this.isEditMode = false;
    this.editingProduct = null;
    this.resetForm();
  }

  showEditModal(produto: Product): void {
    this.isModalVisible = true;
    this.isEditMode = true;
    this.editingProduct = produto;
    this.loadProductData(produto);
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.resetForm();
  }

  resetForm(): void {
    this.produtoForm.reset();
    this.imagePreviews = [];
    this.processedImageFiles = [];

    this.isSubmitting = false;
  }

  loadProductData(produto: Product): void {
    this.produtoForm.patchValue({
      nome_produto: produto.nome_produto,
      preco: produto.preco,
      marca: produto.marca,
      estado_conservacao: produto.estado_conservacao,
      estacao: produto.estacao,
      categoria: produto.categoria,
      genero: produto.genero,
      cor: produto.cor,
      numeracao: produto.numeracao,
      material: produto.material,
      ocasioes: produto.ocasioes || [],
      estilos: produto.estilos || []
    });
  }



  openImageProcessor(): void {
    this.imageProcessor.openModal();
  }

  onImageProcessed(processedImage: ProcessedImage): void {
    this.imagePreviews.push(processedImage.url);
    this.processedImageFiles.push(processedImage.file);
  }

  onImageProcessCancelled(): void {
    // Handle cancellation if needed
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.processedImageFiles.splice(index, 1);
  }

  handleSubmit(): void {
    if (this.produtoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      const formValue = this.produtoForm.value;
      
      // Add form fields
      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== undefined) {
          if (Array.isArray(formValue[key])) {
            formValue[key].forEach((item: any) => {
              formData.append(`${key}[]`, item);
            });
          } else {
            formData.append(key, formValue[key]);
          }
        }
      });
      
      // Add images
      this.processedImageFiles.forEach((file, index) => {
        formData.append('imagens[]', file);
      });
      
      const request = this.isEditMode && this.editingProduct
        ? this.adminService.updateProduto(this.editingProduct.id, formData)
        : this.adminService.createProduto(formData);
      
      request.subscribe({
        next: (response) => {
          this.message.success(
            this.isEditMode 
              ? 'Produto atualizado com sucesso!' 
              : 'Produto criado com sucesso!'
          );
          this.isModalVisible = false;
          this.resetForm();
          this.loadProdutos();
        },
        error: (error) => {
          console.error('Erro ao salvar produto:', error);
          this.message.error('Erro ao salvar produto');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else if (!this.produtoForm.valid) {
      this.message.warning('Por favor, preencha todos os campos obrigatórios');
    }
  }

  deleteProduto(id: number): void {
    this.adminService.deleteProduto(id).subscribe({
      next: () => {
        this.message.success('Produto excluído com sucesso!');
        this.loadProdutos();
      },
      error: (error) => {
        console.error('Erro ao excluir produto:', error);
        this.message.error('Erro ao excluir produto');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProdutos();
  }
} 