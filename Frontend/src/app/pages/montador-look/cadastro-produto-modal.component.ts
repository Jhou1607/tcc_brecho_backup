import { Component, Input, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    NzSpinModule,
    NgxPicaModule,
    ImageCropperComponent,
    NzStepsModule,
    CategoriaSelectorModalComponent,
    NzIconModule,
    NzInputGroupComponent
  ],
  template: `
    <div class="modal-header">
      <h2>Adicionar nova peça</h2>
    </div>
    
    <nz-steps [nzCurrent]="currentStep" class="steps-header">
      <nz-step nzTitle="Carregar imagem"></nz-step>
      <nz-step nzTitle="Processar imagem"></nz-step>
      <nz-step nzTitle="Recortar imagem"></nz-step>
      <nz-step nzTitle="Dados do produto"></nz-step>
    </nz-steps>

    <!-- Step 1: Carregar imagem -->
    <div class="steps-content" *ngIf="currentStep === 0">
      <div class="upload-container">
        <div class="upload-area" *ngIf="!previewUrl">
          <label class="upload-label">
            <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" (change)="onFileChange($event)" hidden />
            <div class="upload-box">
              <nz-icon nzType="inbox" class="upload-icon"></nz-icon>
              <p class="upload-text">Clique aqui ou arraste uma imagem para carregá-la</p>
              <p class="upload-hint">Formatos aceitos: PNG, JPEG, GIF, WEBP</p>
            </div>
          </label>
          
          <div class="divider">
            <span>ou</span>
          </div>
          
          <div class="url-input-section">
            <nz-input-group [nzAddOnAfter]="urlButton">
              <input nz-input placeholder="Cole uma URL de imagem aqui" [(ngModel)]="imgFromUrl" name="imgFromUrl" />
            </nz-input-group>
            <ng-template #urlButton>
              <button nz-button nzType="primary" (click)="loadImgFromUrl()" [disabled]="!isValidUrl(imgFromUrl)">
                <nz-icon nzType="cloud-download"></nz-icon>
                Carregar
              </button>
            </ng-template>
          </div>
        </div>

        <!-- Preview da imagem carregada -->
        <div class="image-preview" *ngIf="previewUrl">
          <div class="preview-header">
            <nz-icon nzType="check-circle" nzTheme="twotone" nzTwotoneColor="#52c41a"></nz-icon>
            <span>Imagem carregada com sucesso!</span>
          </div>
          <div class="preview-image">
            <img [src]="previewUrl" alt="Preview da imagem" />
          </div>
          <div class="preview-info">
            <p><strong>Nome:</strong> {{ selectedFileName || 'Imagem' }}</p>
            <p><strong>Tamanho:</strong> {{ selectedFileSize || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <div class="steps-action">
        <button nz-button nzType="primary" (click)="nextStep()" [disabled]="!previewUrl">
          <span>Continuar</span>
          <nz-icon nzType="right"></nz-icon>
        </button>
      </div>
    </div>

    <!-- Step 2: Processar imagem (remover fundo) -->
    <div class="steps-content" *ngIf="currentStep === 1">
      <div class="processing-step">
        <div class="image-preview-section">
          <div class="preview-container">
            <img [src]="previewUrl" alt="Preview da imagem" />
          </div>
        </div>
        
        <div class="processing-options">
          <div class="options-header">
            <h3>Processar Imagem</h3>
            <p>Escolha como deseja processar sua imagem:</p>
          </div>
          
          <!-- Background Removal -->
          <div class="option-card">
            <div class="option-header">
              <nz-icon nzType="scissor" nzTheme="twotone" nzTwotoneColor="#52c41a"></nz-icon>
              <h4>Remover Fundo</h4>
            </div>
            <p>Remove automaticamente o fundo da imagem usando IA</p>
            
            <div class="option-actions">
              <button 
                nz-button 
                nzType="primary" 
                (click)="removeBackground()"
                [nzLoading]="isProcessing"
                [disabled]="isProcessing"
                class="action-button">
                {{ isProcessing ? 'Processando...' : 'Remover Fundo' }}
              </button>
            </div>
            
            <!-- Processing Status -->
            <div *ngIf="isProcessing" class="processing-status">
              <nz-spin nzSize="small"></nz-spin>
              <span>{{ processingMessage }}</span>
            </div>
          </div>
          
          <!-- Skip Option -->
          <div class="option-card skip-option">
            <div class="option-header">
              <nz-icon nzType="forward" nzTheme="twotone" nzTwotoneColor="#faad14"></nz-icon>
              <h4>Pular Processamento</h4>
            </div>
            <p>Use a imagem original sem modificações</p>
            
            <div class="option-actions">
              <button 
                nz-button 
                nzType="default" 
                (click)="skipBackgroundRemoval()"
                [disabled]="isProcessing"
                class="action-button skip-button">
                Pular e Continuar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="steps-action">
        <button nz-button nzType="default" (click)="prevStep()">
          <nz-icon nzType="left"></nz-icon>
          <span>Voltar</span>
        </button>
        
        <button nz-button nzType="primary" (click)="nextStep()" [disabled]="!imagemProcessada">
          <span>Continuar</span>
          <nz-icon nzType="right"></nz-icon>
        </button>
      </div>
    </div>

    <!-- Step 3: Recortar imagem -->
    <div class="steps-content" *ngIf="currentStep === 2">
      <div class="cropping-step">
        <div class="cropping-header">
          <nz-icon nzType="scissor" nzTheme="twotone" nzTwotoneColor="#52c41a"></nz-icon>
          <h4>Recortar Imagem (Opcional)</h4>
          <p>Recorte a imagem para remover espaços desnecessários ou ajustar o enquadramento</p>
        </div>
        
        <div class="cropper-wrapper">
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
            (loadImageFailed)="loadImageFailed()">
          </image-cropper>
        </div>
        
        <div class="cropping-info">
          <p><strong>Dica:</strong> Você pode pular o recorte se estiver satisfeito com a imagem atual</p>
        </div>
      </div>

      <div class="steps-action">
        <button nz-button nzType="default" (click)="prevStep()">
          <nz-icon nzType="left"></nz-icon>
          <span>Voltar</span>
        </button>
        
        <button nz-button nzType="primary" (click)="nextStep()">
          <span>Continuar</span>
          <nz-icon nzType="right"></nz-icon>
        </button>
      </div>
    </div>

    <!-- Step 4: Dados do produto -->
    <div class="steps-content" *ngIf="currentStep === 3">
      <div class="product-form-step">
        <div class="final-image-preview">
          <img [src]="croppedPreviewUrl || previewUrl" alt="Imagem final do produto" />
        </div>
        
        <form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()" class="product-form">
          <div class="form-columns">
            <!-- Left Column -->
            <div class="form-column">
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
            </div>

            <!-- Right Column -->
            <div class="form-column">
              <nz-form-item>
                <nz-form-label nzFor="estacao">Estação anual</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="estacao" id="estacao" nzPlaceHolder="Selecione a estação">
                    <nz-option *ngFor="let est of opcoesEstacoes" [nzLabel]="est | titlecase" [nzValue]="est"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label nzFor="ocasioes">Ocasiões</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="ocasioes" id="ocasioes" nzPlaceHolder="Selecione as ocasiões" mode="multiple">
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
            </div>
          </div>

          <div class="submit-button-container">
            <button nz-button class="login-form-button" [nzType]="'primary'" [nzLoading]="isSubmitting" [disabled]="validateForm.invalid || isSubmitting">
              Cadastrar Produto
            </button>
          </div>
        </form>
      </div>

      <div class="steps-action">
        <button nz-button nzType="default" (click)="prevStep()">
          <nz-icon nzType="left"></nz-icon>
          <span>Voltar</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    // Color variables
    $light-bg: #fbf9f4;
    $dark-green: #385246;
    $brown: #8c624d;
    $border-color: #d0c9c0;
    $pastel-green: #9bad9a;

    .modal-header {
      text-align: center;
      margin-bottom: 24px;
      
      h2 {
        color: $dark-green;
        font-size: 24px;
        font-weight: 700;
        margin: 0;
      }
    }

    .steps-header {
      margin-bottom: 32px;
      
      ::ng-deep .ant-steps-item {
        .ant-steps-item-icon {
          background: $border-color;
          border-color: $border-color;
          
          .ant-steps-icon {
            color: $brown;
          }
        }
        
        &.ant-steps-item-process .ant-steps-item-icon {
          background: $pastel-green;
          border-color: $pastel-green;
          
          .ant-steps-icon {
            color: white;
          }
        }
        
        &.ant-steps-item-finish .ant-steps-item-icon {
          background: $brown;
          border-color: $brown;
          
          .ant-steps-icon {
            color: white;
          }
        }
        
        .ant-steps-item-title {
          color: $dark-green;
          font-weight: 600;
        }
      }
    }

    .steps-content {
      min-height: 400px;
      margin-bottom: 24px;
    }

    // Step 1: Upload
    .upload-container {
      .upload-area {
        .upload-label {
          display: block;
          cursor: pointer;
          
          .upload-box {
            border: 2px dashed $border-color;
            border-radius: 12px;
            background: $light-bg;
            padding: 40px 20px;
            text-align: center;
            transition: all 0.3s ease;
            
            &:hover {
              border-color: $pastel-green;
              background: #dde5db;
            }
            
            .upload-icon {
              font-size: 48px;
              color: $brown;
              margin-bottom: 16px;
            }
            
            .upload-text {
              color: $dark-green;
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }
            
            .upload-hint {
              color: $brown;
              font-size: 14px;
              margin: 0;
            }
          }
        }
        
        .divider {
          text-align: center;
          margin: 24px 0;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: $border-color;
          }
          
          span {
            background: white;
            padding: 0 16px;
            color: $brown;
            font-size: 14px;
          }
        }
        
        .url-input-section {
          ::ng-deep .ant-input-group {
            .ant-input {
              border: 2px solid $border-color;
              border-radius: 8px 0 0 8px;
              padding: 12px 16px;
              background: $light-bg;
              color: $dark-green;
              
              &:focus {
                border-color: $pastel-green;
                box-shadow: 0 0 0 2px rgba(155, 173, 154, 0.2);
                background: white;
              }
              
              &::placeholder {
                color: $brown;
                opacity: 0.6;
              }
            }
            
            .ant-input-group-addon {
              background: $pastel-green;
              border: 2px solid $pastel-green;
              border-left: none;
              border-radius: 0 8px 8px 0;
              
              button {
                border: none;
                background: transparent;
                color: white;
                
                &:hover {
                  background: rgba(255, 255, 255, 0.1);
                }
              }
            }
          }
        }
      }
      
      .image-preview {
        text-align: center;
        margin-top: 24px;
        
        .preview-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
          color: #52c41a;
          font-weight: 600;
          font-size: 16px;
          
          nz-icon {
            font-size: 20px;
          }
        }
        
        .preview-image {
          margin-bottom: 16px;
          
          img {
            max-width: 300px;
            max-height: 300px;
            border-radius: 12px;
            border: 2px solid $border-color;
            object-fit: cover;
          }
        }
        
        .preview-info {
          background: $light-bg;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid $border-color;
          
          p {
            margin: 4px 0;
            color: $dark-green;
            font-size: 14px;
            
            strong {
              color: $brown;
            }
          }
        }
      }
    }

    // Step 2: Processing
    .processing-step {
      .image-preview-section {
        text-align: center;
        margin-bottom: 24px;
        
        .preview-container {
          img {
            max-width: 300px;
            max-height: 300px;
            border-radius: 12px;
            border: 2px solid $border-color;
            object-fit: cover;
          }
        }
      }
      
      .processing-options {
        .options-header {
          text-align: center;
          margin-bottom: 24px;
          
          h3 {
            color: $dark-green;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          p {
            color: $brown;
            font-size: 14px;
            margin: 0;
          }
        }
        
        .option-card {
          background: $light-bg;
          border: 2px solid $border-color;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
          
          &:hover {
            border-color: $pastel-green;
            background: #dde5db;
          }
          
          .option-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            
            nz-icon {
              font-size: 24px;
            }
            
            h4 {
              color: $dark-green;
              font-size: 16px;
              font-weight: 600;
              margin: 0;
            }
          }
          
          p {
            color: $brown;
            font-size: 14px;
            margin-bottom: 16px;
          }
          
          .option-actions {
            .action-button {
              width: 100%;
              height: 44px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              transition: all 0.3s ease;
              
              &.ant-btn-primary {
                background: linear-gradient(135deg, $pastel-green 0%, $brown 100%);
                border: none;
                box-shadow: 0 4px 12px rgba(155, 173, 154, 0.4);
                
                &:hover:not(:disabled) {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 16px rgba(155, 173, 154, 0.5);
                }
              }
              
              &.skip-button {
                border: 2px solid $border-color;
                background: white;
                color: $brown;
                
                &:hover {
                  border-color: $pastel-green;
                  background: $light-bg;
                  color: $dark-green;
                }
              }
            }
          }
          
          .processing-status {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
            color: $brown;
            font-size: 14px;
            
            nz-spin {
              ::ng-deep .ant-spin-dot {
                i {
                  background-color: $pastel-green;
                }
              }
            }
          }
          
          &.skip-option {
            background: white;
            border-color: #faad14;
            
            .option-header nz-icon {
              color: #faad14;
            }
          }
        }
      }
    }

    // Step 3: Cropping
    .cropping-step {
      .cropping-header {
        text-align: center;
        margin-bottom: 24px;
        
        h4 {
          color: $dark-green;
          margin: 8px 0 4px 0;
          font-size: 18px;
        }
        
        p {
          color: $brown;
          margin: 0;
          font-size: 14px;
        }
        
        nz-icon {
          font-size: 24px;
          color: $pastel-green;
        }
      }
      
      .cropper-wrapper {
        border: 2px dashed $border-color;
        border-radius: 8px;
        padding: 16px;
        background: $light-bg;
        margin: 0 auto;
        max-width: 600px;
        
        ::ng-deep .ngx-image-cropper {
          .cropper-container {
            border-radius: 6px;
            overflow: hidden;
          }
        }
      }
      
      .cropping-info {
        text-align: center;
        padding: 16px;
        background: $light-bg;
        border-radius: 8px;
        border: 1px solid $border-color;
        margin-top: 16px;
        
        p {
          margin: 0;
          color: $brown;
          font-size: 14px;
          
          strong {
            color: $dark-green;
          }
        }
      }
    }

    // Step 4: Product Form
    .product-form-step {
      .final-image-preview {
        text-align: center;
        margin-bottom: 24px;
        
        img {
          max-width: 200px;
          max-height: 200px;
          border-radius: 12px;
          border: 2px solid $border-color;
          object-fit: cover;
        }
      }
      
      .product-form {
        .form-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
          
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        
        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        ::ng-deep .ant-form-item {
          .ant-form-item-label {
            label {
              color: $dark-green;
              font-weight: 600;
              font-size: 14px;
            }
          }
          
          .ant-form-item-control {
            .ant-input,
            .ant-select-selector {
              border: 2px solid $border-color !important;
              border-radius: 8px !important;
              padding: 12px 16px !important;
              font-size: 14px !important;
              transition: all 0.3s ease !important;
              background: $light-bg !important;
              height: 48px !important;
              line-height: 24px !important;
              display: flex !important;
              align-items: center !important;
              
              &:focus {
                border-color: $pastel-green !important;
                box-shadow: 0 0 0 2px rgba(155, 173, 154, 0.2) !important;
                background: white !important;
              }
              
              &:hover {
                border-color: $pastel-green !important;
              }
              
              &::placeholder {
                color: $brown !important;
                opacity: 0.6 !important;
              }
            }
            
            // Ajuste específico para selects
            .ant-select-selector {
              .ant-select-selection-item {
                line-height: 24px !important;
                display: flex !important;
                align-items: center !important;
                height: 100% !important;
                padding-right: 20px !important;
                overflow: visible !important;
                white-space: nowrap !important;
              }
              
              // Ajuste para o placeholder
              .ant-select-selection-placeholder {
                padding-right: 20px !important;
                overflow: visible !important;
                white-space: nowrap !important;
                text-overflow: clip !important;
              }
            }
          }
        }
        
        .categoria-btn {
          width: 100%;
          height: 48px;
          border: 2px solid $border-color;
          border-radius: 8px;
          background: $light-bg;
          color: $brown;
          text-align: left;
          padding: 0 16px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          line-height: 24px;
          
          &:hover {
            border-color: $pastel-green;
            background: #dde5db;
            color: $dark-green;
          }
        }
      }
      
      .submit-button-container {
        text-align: center;
        margin-top: 24px;
        
        .login-form-button {
          height: 48px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          background: linear-gradient(135deg, $pastel-green 0%, $brown 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(155, 173, 154, 0.4);
          min-width: 200px;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(155, 173, 154, 0.5);
          }
          
          &:disabled {
            background: $border-color;
            transform: none;
            box-shadow: none;
          }
        }
      }
    }

    // Steps Actions
    .steps-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid $border-color;
      margin-top: 24px;
      
      button {
        height: 48px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        min-width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.ant-btn-default {
          border: 2px solid $border-color;
          background: white;
          color: $brown;
          
          &:hover {
            border-color: $pastel-green;
            background: $light-bg;
            color: $dark-green;
          }
          
          nz-icon {
            margin-right: 6px;
          }
        }
        
        &.ant-btn-primary {
          background: linear-gradient(135deg, $pastel-green 0%, $brown 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(155, 173, 154, 0.4);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(155, 173, 154, 0.5);
          }
          
          &:disabled {
            background: $border-color;
            transform: none;
            box-shadow: none;
          }
          
          nz-icon {
            margin-left: 6px;
          }
        }
      }
    }

    // Responsive Design
    @media (max-width: 768px) {
      .steps-content {
        min-height: 300px;
      }
      
      .product-form-step .product-form .form-columns {
        gap: 20px;
      }
      
      .steps-action {
        flex-direction: column;
        gap: 16px;
        
        button {
          width: 100%;
          min-width: auto;
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
  isProcessing = false;
  processingMessage = '';
  selectedFileName: string | null = null;
  selectedFileSize: string | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef,
    private modalRef: NzModalRef<CadastroProdutoModalComponent>,
    private ngxPicaService: NgxPicaService,
    private sanitizer: DomSanitizer,
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
    
    // Adicionar informações do arquivo
    this.selectedFileName = file.name;
    this.selectedFileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    
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
      
      // Adicionar informações do arquivo
      this.selectedFileName = 'Imagem da URL';
      this.selectedFileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
      
      await this.processImageWithRemoveBg(file);
    } catch {
      this.notification.error('Erro', 'Não foi possível carregar a imagem da URL.');
    }
  }

  async processImageWithRemoveBg(file: File) {
    this.previewUrl = URL.createObjectURL(file);
    this.rawImageFile = file;
    
    // As informações do arquivo já foram definidas nos métodos chamadores
    // this.selectedFileName e this.selectedFileSize
    
    this.currentStep = 1;
    this.cdr.detectChanges();
  }

  async removeBackground() {
    if (!this.rawImageFile) return;
    
    this.isProcessing = true;
    this.processingMessage = 'Removendo fundo da imagem...';
    this.cdr.detectChanges();
    
    try {
      const result = await removeBackground(this.rawImageFile, {
        output: { quality: 1, format: 'image/png' },
        rescale: true,
        device: 'cpu'
      });
      
      this.rawImageFile = result as File;
      this.previewUrl = URL.createObjectURL(result as File);
      this.imageChangedEvent = { target: { files: [result as File] } };
      this.imagemProcessada = result as File; // Corrigido: agora é um File
      
      this.isProcessing = false;
      this.processingMessage = '';
      this.cdr.detectChanges();
    } catch (e) {
      this.isProcessing = false;
      this.processingMessage = '';
      this.notification.error('Erro', 'Erro ao remover fundo da imagem.');
      this.cdr.detectChanges();
    }
  }

  skipBackgroundRemoval() {
    if (!this.rawImageFile) return;
    
    this.imageChangedEvent = { target: { files: [this.rawImageFile] } };
    this.imagemProcessada = this.rawImageFile; // Corrigido: agora é um File
    this.cdr.detectChanges();
  }

  nextStep() {
    if (this.currentStep === 0 && this.previewUrl) {
      this.currentStep = 1;
    } else if (this.currentStep === 1 && this.imagemProcessada) {
      // Vai para o passo de cropping
      this.currentStep = 2;
      this.showCropper = true;
    } else if (this.currentStep === 2) {
      this.currentStep = 3;
    }
  }

  prevStep() {
    if (this.currentStep === 3) {
      this.currentStep = 2;
      this.showCropper = false;
    } else if (this.currentStep === 2) {
      this.currentStep = 1;
    } else if (this.currentStep === 1) {
      this.currentStep = 0;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    // Não altere previewUrl aqui!
    this.croppedPreviewUrl = event.objectUrl || '';
    this.imagemProcessada = event.blob ? new File([event.blob], 'imagem-crop.png', { type: 'image/png' }) : null;
    this.validateForm.patchValue({ imagem_principal: this.imagemProcessada });
    this.cdr.detectChanges();
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
      
      // Usar a imagem processada (cropped ou original)
      const imagemParaEnviar = this.imagemProcessada instanceof File ? this.imagemProcessada : this.rawImageFile;
      
      if (!imagemParaEnviar) {
        this.notification.create('warning', 'Atenção', 'Nenhuma imagem foi processada.');
        this.isSubmitting = false;
        return;
      }
      
      const productDataPayload: UserProductFormData = {
        nome_produto: formValue.nome_produto,
        marca: formValue.marca || undefined,
        categoria: formValue.categoria || undefined,
        estacao: formValue.estacao || undefined,
        cor: formValue.cor || undefined,
        imagem_principal: imagemParaEnviar,
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
    this.selectedFileName = null;
    this.selectedFileSize = null;
    this.isProcessing = false;
    this.processingMessage = '';
    this.currentStep = 0;
  }
} 