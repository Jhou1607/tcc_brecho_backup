import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/product.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ImageUploadProcessorComponent } from '../../../shared/components/image-upload-processor/image-upload-processor.component';
import type { ProcessedImage } from '../../../shared/components/image-upload-processor/image-upload-processor.component';
import { HierarchicalCategorySelectorComponent, CategoriaSelecionada } from '../../../shared/components/hierarchical-category-selector/hierarchical-category-selector.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserProductFormData } from '../../../interfaces/interfaces';

// Ng-Zorro Modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRowDirective } from 'ng-zorro-antd/grid';
import { NzColDirective } from 'ng-zorro-antd/grid';

// Components
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-cadastro-usr',
  templateUrl: './cadastro-usr.component.html',
  styleUrls: ['./cadastro-usr.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzRowDirective,
    NzColDirective,
    HeaderComponent,
    FooterComponent,
    ImageUploadProcessorComponent,
    HierarchicalCategorySelectorComponent
  ]
})
export class CadastroUsrComponent implements OnInit {
  @ViewChild('imageProcessor') imageProcessor!: ImageUploadProcessorComponent;

  validateForm!: FormGroup;
  isSubmitting = false;
  
  // Category selection
  selectedCategory: CategoriaSelecionada | null = null;
  
  // Image handling
  imagePreview: SafeUrl | null = null;
  processedImageFile: File | null = null;

  // Options for dropdowns
  opcoesEstacoes = ['verao', 'outono', 'inverno', 'primavera', 'todas', 'neutra'];
  opcoesOcasioes = ['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia', 'casamento', 'formatura', 'viagem'];
  opcoesEstilos = ['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'];
  opcoesMateriais = ['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester'];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.validateForm = this.fb.group({
      nome_produto: [null, Validators.required],
      marca: [null, Validators.maxLength(55)],
      categoria: [null, Validators.required],
      cor: [null, Validators.maxLength(55)],
      estacao: [null, Validators.required],
      ocasioes: [null, Validators.required],
      estilos: [null, Validators.required],
      material: [null, Validators.required],
      imagem_principal: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onCategorySelected(category: CategoriaSelecionada): void {
    this.selectedCategory = category;
    this.validateForm.patchValue({
      categoria: category.value
    });
  }

  openImageProcessor(): void {
    this.imageProcessor.openModal();
  }

  onImageProcessed(processedImage: ProcessedImage): void {
    this.imagePreview = processedImage.url;
    this.processedImageFile = processedImage.file;
    this.validateForm.patchValue({
      imagem_principal: processedImage.file
    });
  }

  onImageProcessCancelled(): void {
    // Handle cancellation if needed
  }

  removeImage(): void {
    this.imagePreview = null;
    this.processedImageFile = null;
    this.validateForm.patchValue({
      imagem_principal: null
    });
  }

  submitForm(): void {
    if (this.validateForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.validateForm.value;
      
      // Prepare data for the service
      const productData: UserProductFormData = {
        nome_produto: formValue.nome_produto,
        marca: formValue.marca || undefined,
        categoria: formValue.categoria,
        cor: formValue.cor || undefined,
        estacao: formValue.estacao,
        ocasioes: Array.isArray(formValue.ocasioes) ? formValue.ocasioes : [],
        estilos: Array.isArray(formValue.estilos) ? formValue.estilos : [],
        material: formValue.material,
        imagem_principal: this.processedImageFile!
      };
      
      this.produtoService.createProdutoUsuario(productData).subscribe({
        next: (response: any) => {
          this.message.success('Produto cadastrado com sucesso!');
          this.router.navigate(['/usuario/produtos']);
        },
        error: (error: any) => {
          console.error('Erro ao cadastrar produto:', error);
          this.message.error('Erro ao cadastrar produto. Tente novamente.');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else if (!this.validateForm.valid) {
      this.message.warning('Por favor, preencha todos os campos obrigatórios');
    }
  }
}
