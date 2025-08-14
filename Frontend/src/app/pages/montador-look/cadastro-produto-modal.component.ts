import { Component, Input, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProdutoService } from '../../services/product.service';
import { UserProductFormData } from '../../interfaces/interfaces';
import { NgxPicaModule, NgxPicaService } from '@digitalascetic/ngx-pica';
import { removeBackground } from '@imgly/background-removal';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { CategoriaAcessoriosCabeca, CategoriaTops, CategoriaCalcasSaias, CategoriaCalcados, CategoriaAcessorios } from '../../interfaces/categorias';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { CategoriaSelecionada } from '../../interfaces/interfaces';
import { CategoriaSelectorModalComponent } from '../cadastro_produto/categoria-selector-modal.component';

@Component({
  selector: 'app-cadastro-produto-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NgxPicaModule,
    ImageCropperComponent,
    NzStepsModule,
    CategoriaSelectorModalComponent
  ],
  template: `
    <h2>Adicionar nova peça</h2>
    <nz-steps [nzCurrent]="currentStep">
      <nz-step nzTitle="Carregar imagem"></nz-step>
      <nz-step nzTitle="Cadastro"></nz-step>
    </nz-steps>
    <div class="steps-content" *ngIf="currentStep === 0">
      <div class="upload-container">
        <label class="upload-label">
          <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" (change)="onFileChange($event)" hidden />
          <div class="upload-box">Clique aqui ou arraste uma imagem para carregá-la</div>
        </label>
        <div style="margin: 8px 0;">ou</div>
        <input nz-input placeholder="Carregue a imagem de uma Url" [(ngModel)]="imgFromUrl" name="imgFromUrl" />
        <button nz-button (click)="loadImgFromUrl()" [disabled]="!isValidUrl(imgFromUrl)">Carregar da URL</button>
      </div>
      <div *ngIf="showCropper">
        <image-cropper
          [imageChangedEvent]="imageChangedEvent"
          [imageURL]="previewUrl"
          [onlyScaleDown]="true"
          [maintainAspectRatio]="false"
          output="blob"
          format="png"
          (imageCropped)="imageCropped($event)"
          (imageLoaded)="imageLoaded($event)"
          (cropperReady)="cropperReady()"
          (loadImageFailed)="loadImageFailed()"
        ></image-cropper>
      </div>
      <div *ngIf="!showCropper && imagemProcessada" style="margin-top: 10px; text-align:center;">
        <img [src]="croppedPreviewUrl" alt="Preview" style="max-width: 180px; max-height: 180px; border-radius: 8px;" />
      </div>
      <div class="steps-action">
        <button nz-button nzType="primary" (click)="nextStep()" [disabled]="!imagemProcessada">Próximo</button>
      </div>
    </div>
    <div class="steps-content" *ngIf="currentStep === 1">
      <form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
        <nz-form-item>
          <nz-form-label nzFor="nome_produto" nzRequired>Nome da peça</nz-form-label>
          <nz-form-control nzErrorTip="Por favor, dê um nome para a sua peça!">
            <input nz-input formControlName="nome_produto" id="nome_produto" placeholder="Ex: Minha jaqueta jeans favorita" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="marca">Marca do produto</nz-form-label>
          <nz-form-control nzErrorTip="Máximo de 55 caracteres.">
            <input nz-input formControlName="marca" id="marca" placeholder="Ex: Zara, Renner, etc." />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="categoria">Categoria</nz-form-label>
          <nz-form-control>
            <button type="button" class="categoria-btn" (click)="abrirCategoriaModal()">
              {{ categoriaSelecionada ? categoriaSelecionada.grupo + ' > ' + categoriaSelecionada.categoria : 'Selecione o grupo e a categoria' }}
            </button>
            <app-categoria-selector-modal
              [aberto]="categoriaModalAberto"
              (fechar)="fecharCategoriaModal()"
              (selecionar)="onCategoriaSelecionada($event)">
            </app-categoria-selector-modal>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="cor">Coloração</nz-form-label>
          <nz-form-control nzErrorTip="Máximo de 55 caracteres.">
            <input nz-input formControlName="cor" id="cor" placeholder="Ex: Azul Marinho" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="estacao">Estação anual</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="estacao" id="estacao" nzPlaceHolder="Selecione a estação">
              <nz-option *ngFor="let est of opcoesEstacoes" [nzLabel]="est | titlecase" [nzValue]="est"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="ocasioes">Ocasioes</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="ocasioes" id="ocasioes" nzPlaceHolder="Selecione as ocasioes" mode="multiple">
              <nz-option *ngFor="let ocasioes of opcoesOcasioes" [nzLabel]="ocasioes | titlecase" [nzValue]="ocasioes"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="estilos">Estilos</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="estilos" id="estilos" nzPlaceHolder="Selecione os estilos" mode="multiple">
              <nz-option *ngFor="let estilos of opcoesEstilos" [nzLabel]="estilos | titlecase" [nzValue]="estilos"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzFor="material">Material</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="material" id="material" nzPlaceHolder="Selecione o material">
              <nz-option *ngFor="let material of opcoesMateriais" [nzLabel]="material | titlecase" [nzValue]="material"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item class="submit-button-container">
          <nz-form-control>
            <button nz-button class="login-form-button" [nzType]="'primary'" [nzLoading]="isSubmitting" [disabled]="validateForm.invalid || isSubmitting">
              Cadastrar
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
      <div class="steps-action">
        <button nz-button (click)="prevStep()">Voltar</button>
      </div>
    </div>
  `,
  styles: [`
    h2 { 
      text-align: center; 
      margin-bottom: 16px; 
      color: #385246;
      font-weight: 600;
    }
    
    .submit-button-container { 
      text-align: center; 
    }
    
    .upload-container { 
      text-align: center; 
      margin-bottom: 16px; 
    }
    
    .upload-label { 
      cursor: pointer; 
    }
    
    .upload-box { 
      border: 2px dashed #d0c9c0; 
      padding: 24px; 
      border-radius: 8px; 
      color: #8c624d;
      background: #fbf9f4;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #9bad9a;
        background: #dde5db;
        color: #385246;
      }
    }
    
    .steps-action { 
      text-align: center; 
      margin-top: 16px; 
    }
    
    .categoria-btn {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #d0c9c0;
      border-radius: 8px;
      background: #fbf9f4;
      color: #385246;
      cursor: pointer;
      text-align: left;
      box-sizing: border-box;
      transition: all 0.3s ease;
      font-size: 14px;
      min-height: 44px;
      line-height: 1.5;
      display: flex;
      align-items: center;
      
      &:hover {
        border-color: #9bad9a;
        background: #dde5db;
      }
    }
    
    // Ng-Zorro Steps customization
    ::ng-deep .ant-steps {
      .ant-steps-item-process .ant-steps-item-icon {
        background: #9bad9a !important;
        border-color: #9bad9a !important;
      }
      
      .ant-steps-item-finish .ant-steps-item-icon {
        background: #8c624d !important;
        border-color: #8c624d !important;
      }
      
      .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
        color: white !important;
      }
      
      .ant-steps-item-process .ant-steps-item-icon .ant-steps-icon {
        color: white !important;
      }
      
      .ant-steps-item-title {
        color: #385246 !important;
        font-weight: 500 !important;
      }
      
      .ant-steps-item-process .ant-steps-item-title {
        color: #9bad9a !important;
        font-weight: 600 !important;
      }
      
      .ant-steps-item-finish .ant-steps-item-title {
        color: #8c624d !important;
        font-weight: 600 !important;
      }
    }
    
    // Ng-Zorro Form customization
    ::ng-deep .ant-form {
      .ant-form-item-label > label {
        color: #385246 !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        
        &.ant-form-item-required::before {
          color: #ff4d4f !important;
        }
      }
      
      .ant-input {
        border: 2px solid #d0c9c0 !important;
        border-radius: 8px !important;
        padding: 12px 16px !important;
        background: #fbf9f4 !important;
        transition: all 0.3s ease !important;
        height: auto !important;
        min-height: 44px !important;
        line-height: 1.5 !important;
        font-size: 14px !important;
        
        &:focus {
          border-color: #9bad9a !important;
          box-shadow: 0 0 0 2px rgba(155, 173, 154, 0.2) !important;
          background: white !important;
        }
        
        &:hover {
          border-color: #9bad9a !important;
        }
        
        &::placeholder {
          color: #8c624d !important;
          opacity: 0.8 !important;
          line-height: 1.5 !important;
          vertical-align: middle !important;
        }
      }
      
      .ant-select {
        .ant-select-selector {
          border: 2px solid #d0c9c0 !important;
          border-radius: 8px !important;
          padding: 10px 16px !important;
          background: #fbf9f4 !important;
          transition: all 0.3s ease !important;
          height: 44px !important;
          line-height: 1.5 !important;
          display: flex !important;
          align-items: center !important;
          
          &:hover {
            border-color: #9bad9a !important;
          }
        }
        
        &.ant-select-focused .ant-select-selector {
          border-color: #9bad9a !important;
          box-shadow: 0 0 0 2px rgba(155, 173, 154, 0.2) !important;
          background: white !important;
        }
        
        .ant-select-selection-placeholder {
          color: #8c624d !important;
          opacity: 0.8 !important;
          line-height: 1.5 !important;
          font-size: 14px !important;
        }
      }
    }
    
    // Ng-Zorro Button customization
    ::ng-deep .ant-btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
      
      &.ant-btn-primary {
        background: linear-gradient(135deg, #9bad9a 0%, #8c624d 100%) !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(155, 173, 154, 0.4) !important;
        
        &:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 16px rgba(155, 173, 154, 0.5) !important;
        }
        
        &:disabled {
          background: #d0c9c0 !important;
          transform: none !important;
          box-shadow: none !important;
        }
      }
      
      &.ant-btn-default {
        border: 2px solid #d0c9c0 !important;
        color: #8c624d !important;
        background: white !important;
        
        &:hover {
          border-color: #9bad9a !important;
          color: #9bad9a !important;
        }
      }
    }
  `]
})
export class CadastroProdutoModalComponent {
  @Input() categoriasFiltradas: string[] = [];
  @Output() produtoCriado = new EventEmitter<any>();

  validateForm!: FormGroup;
  isSubmitting = false;
  opcoesEstacoes = ['verao', 'outono', 'inverno', 'primavera', 'todas', 'neutra'];
  opcoesOcasioes = ['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia', 'casamento', 'formatura', 'viagem'];
  opcoesEstilos = ['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'];
  opcoesMateriais = ['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester'];

  previewUrl: string = '';
  croppedPreviewUrl: string = '';
  imagemProcessada: File | null = null;
  imgFromUrl: string = '';
  imageChangedEvent: any = null;
  rawImageFile: File | null = null;
  currentStep = 0;
  showCropper = false;
  categoriaModalAberto = false;
  categoriaSelecionada: CategoriaSelecionada | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef,
    private modalRef: NzModalRef<CadastroProdutoModalComponent>,
    private ngxPicaService: NgxPicaService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    if (!this.categoriasFiltradas?.length && data?.categoriasFiltradas) {
      this.categoriasFiltradas = data.categoriasFiltradas;
    }
    // Se não vier nada, usa todas as categorias
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

  async onFileChange(event: any) {
    this.resetImageState();
    const file = event.target.files[0];
    if (!file) return;
    await this.processImageWithRemoveBg(file);
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  async loadImgFromUrl() {
    this.resetImageState();
    if (!this.isValidUrl(this.imgFromUrl)) return;
    try {
      const res = await fetch(this.imgFromUrl);
      const blob = await res.blob();
      const file = new File([blob], 'imagem-url.png', { type: blob.type });
      await this.processImageWithRemoveBg(file);
    } catch {
      this.notification.error('Erro', 'Não foi possível carregar a imagem da URL.');
    }
  }

  async processImageWithRemoveBg(file: File) {
    this.notification.info('Processando imagem', 'Removendo fundo da imagem...');
    try {
      const result = await removeBackground(file, {
        output: { quality: 1, format: 'image/png' },
        rescale: true,
        device: 'gpu'
      });
      this.rawImageFile = result as File;
      this.previewUrl = URL.createObjectURL(result as File);
      this.imageChangedEvent = { target: { files: [result as File] } };
      this.showCropper = true;
      this.imagemProcessada = null;
      this.croppedPreviewUrl = '';
      this.cdr.detectChanges();
    } catch (e) {
      this.notification.error('Erro', 'Erro ao remover fundo da imagem.');
    }
  }

  nextStep() {
    if (this.imagemProcessada) {
      this.showCropper = false;
      this.currentStep = 1;
      // Não limpe o preview aqui!
    }
  }

  prevStep() {
    this.currentStep = Math.max(0, this.currentStep - 1);
  }

  imageCropped(event: ImageCroppedEvent) {
    // Não altere previewUrl aqui!
    this.croppedPreviewUrl = event.objectUrl || '';
    this.imagemProcessada = event.blob ? new File([event.blob], 'imagem-crop.png', { type: 'image/png' }) : null;
    this.validateForm.patchValue({ imagem_principal: this.imagemProcessada });
  }

  imageLoaded(image: LoadedImage) { }
  cropperReady() { }
  loadImageFailed() {
    this.notification.error('Erro', 'Erro ao carregar a imagem para crop.');
  }

  submitForm() {
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
    if (this.validateForm.valid && this.imagemProcessada) {
      this.isSubmitting = true;
      const formValue = this.validateForm.value;
      const productDataPayload: UserProductFormData = {
        nome_produto: formValue.nome_produto,
        marca: formValue.marca || undefined,
        categoria: formValue.categoria || undefined,
        estacao: formValue.estacao || undefined,
        cor: formValue.cor || undefined,
        imagem_principal: this.imagemProcessada,
        ocasioes: Array.isArray(formValue.ocasioes) ? formValue.ocasioes : [],
        estilos: Array.isArray(formValue.estilos) ? formValue.estilos : [],
        material: formValue.material || null
      };
      this.produtoService.createProdutoUsuario(productDataPayload).subscribe({
        next: (produtoCriado) => {
          this.isSubmitting = false;
          this.notification.create('success', 'Sucesso!', `Peça "${produtoCriado.nome_produto}" cadastrada com sucesso.`);
          this.produtoCriado.emit(produtoCriado);
          this.modalRef.close(produtoCriado);
        },
        error: (err) => {
          this.isSubmitting = false;
          let errorMessage = err?.error?.message || 'Ocorreu um erro ao cadastrar a peça.';
          this.notification.create('error', 'Erro no Cadastro', errorMessage);
        }
      });
    } else {
      this.notification.create('warning', 'Atenção', 'Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

  abrirCategoriaModal() {
    this.categoriaModalAberto = true;
  }
  fecharCategoriaModal() {
    this.categoriaModalAberto = false;
  }
  onCategoriaSelecionada(cat: CategoriaSelecionada & { value: string, label: string }) {
    this.categoriaSelecionada = cat;
    this.validateForm.patchValue({ categoria: cat.value }); // value para o backend
    this.fecharCategoriaModal();
  }

  // Limpar previews apenas ao fechar ou iniciar novo upload
  resetImageState() {
    this.previewUrl = '';
    this.croppedPreviewUrl = '';
    this.imagemProcessada = null;
    this.imageChangedEvent = null;
    this.rawImageFile = null;
    this.showCropper = false;
  }
} 