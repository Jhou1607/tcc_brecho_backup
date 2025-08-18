import { Component, EventEmitter, Input, Output, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { removeBackground } from '@imgly/background-removal';
import { NgxPicaModule, NgxPicaService } from '@digitalascetic/ngx-pica';
import { from, Observable, of, Subscription, finalize } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HierarchicalCategorySelectorComponent, CategoriaSelecionada } from '../hierarchical-category-selector/hierarchical-category-selector.component';

export interface ProcessedImage {
  file: File;
  url: SafeUrl;
  croppedBlob?: Blob;
}

export interface ProductFormData {
  nome_produto: string;
  marca: string;
  categoria: string;
  cor: string;
  estacao: string;
  ocasioes: string[];
  estilos: string[];
  material: string;
}

@Component({
  selector: 'app-image-upload-processor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzUploadModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzInputGroupComponent,
    NzStepsModule,
    NzSpinModule,
    NzIconModule,
    ImageCropperComponent,
    NgxPicaModule
  ],
  templateUrl: './image-upload-processor.component.html',
  styleUrls: ['./image-upload-processor.component.scss']
})
export class ImageUploadProcessorComponent implements OnDestroy {
  @Input() title: string = 'Adicionar Foto';
  @Input() showUrlInput: boolean = true;
  @Input() maxFileSize: number = 2; // MB
  @Input() acceptedTypes: string[] = ['image/png', 'image/jpeg'];
  
  @Output() imageProcessed = new EventEmitter<ProcessedImage>();
  @Output() processCancelled = new EventEmitter<void>();

  @ViewChild('imageCropperRef') imageCropperRef!: ImageCropperComponent;

  // Modal state
  isModalVisible: boolean = false;
  currentStep: number = 0;
  
  // File handling
  fileList: NzUploadFile[] = [];
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  imageFromUrl: string = '';
  currentFile: File | null = null;
  
  // Processing state
  isProcessing: boolean = false;
  processingMessage: string = '';
  backgroundRemoved: boolean = false;
  
  // Cropping
  imageChangedEvent: any = null;
  croppedImage: SafeUrl = '';
  lastCroppedBlob: Blob | null = null;
  
  // Object URL management
  objectUrl: string | null = null;
  finalImageUrl: SafeUrl | null = null;
  
  // Image dimensions
  imageDimensions = { width: 0, height: 0 };

  constructor(
    private ngxPicaService: NgxPicaService,
    private sanitizer: DomSanitizer,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    // Clean up object URLs to prevent memory leaks
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  openModal(): void {
    this.isModalVisible = true;
    this.currentStep = 0;
    this.resetState();
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.resetState();
    this.processCancelled.emit();
  }

  private resetState(): void {
    this.currentStep = 0;
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageFromUrl = '';
    this.currentFile = null;
    this.isProcessing = false;
    this.processingMessage = '';
    this.backgroundRemoved = false;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.lastCroppedBlob = null;
    this.objectUrl = null;
    this.finalImageUrl = null;
    this.imageDimensions = { width: 0, height: 0 };
    this.fileList = [];
    
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  // File upload handling
  beforeUpload = (file: NzUploadFile | File, _fileList: NzUploadFile[]): boolean | Observable<boolean> => {
    console.log('beforeUpload called with file:', file);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    console.log('Is File instance:', file instanceof File);
    console.log('Is NzUploadFile:', 'originFileObj' in file);
    
    const isValidType = this.acceptedTypes.includes(file.type || '');
    if (!isValidType) {
      this.message.error(`Tipo de arquivo não suportado. Use: ${this.acceptedTypes.join(', ')}`);
      return false;
    }

    const isValidSize = (file.size || 0) / 1024 / 1024 < this.maxFileSize;
    if (!isValidSize) {
      this.message.error(`Arquivo muito grande. Máximo: ${this.maxFileSize}MB`);
      return false;
    }

    // Extract the actual File object
    let actualFile: File;
    
    if (file instanceof File) {
      // If it's already a File object, use it directly
      actualFile = file;
    } else if ('originFileObj' in file && file.originFileObj) {
      // If it's an NzUploadFile with originFileObj, use that
      actualFile = file.originFileObj;
    } else {
      // If we can't get a proper File object, show an error
      console.error('Não foi possível obter o arquivo original');
      this.message.error('Erro ao processar arquivo. Tente novamente.');
      return false;
    }

    console.log('Actual file object:', actualFile);
    console.log('Actual file type:', actualFile.type);
    console.log('Actual file size:', actualFile.size);

    // Add to fileList if it's an NzUploadFile
    if ('uid' in file) {
      this.fileList = [file as NzUploadFile];
    }
    
    this.processFile(actualFile);
    return false;
  };

  handleUploadRequest = (item: any): Subscription => {
    console.log('handleUploadRequest called with:', item);
    console.log('Origin file obj:', item.file.originFileObj);
    
    if (item.file.originFileObj) {
      this.processFile(item.file.originFileObj);
    } else if (item.file instanceof File) {
      this.processFile(item.file);
    } else {
      console.error('Não foi possível obter o arquivo para upload');
      this.message.error('Erro ao processar arquivo. Tente novamente.');
    }
    return of(null).subscribe();
  };

  handleRemove = (event: any): boolean => {
    console.log('handleRemove called with:', event);
    if (event.file) {
      this.fileList = this.fileList.filter(f => f.uid !== event.file.uid);
      this.selectedFile = null;
      this.previewUrl = null;
      this.resetState();
    }
    return true;
  };

  loadImageFromUrl(): void {
    if (!this.imageFromUrl.trim()) {
      this.message.warning('Por favor, insira uma URL válida');
      return;
    }

    this.isProcessing = true;
    this.processingMessage = 'Carregando imagem da URL...';

    // Create a temporary image element to get dimensions
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Convert image to blob
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'image-from-url.jpg', { type: 'image/jpeg' });
            this.processFile(file);
            this.isProcessing = false;
            this.processingMessage = '';
            this.imageFromUrl = '';
          } else {
            this.message.error('Erro ao processar imagem da URL');
            this.isProcessing = false;
            this.processingMessage = '';
          }
        }, 'image/jpeg');
      }
    };
    
    img.onerror = () => {
      this.message.error('Erro ao carregar imagem da URL');
      this.isProcessing = false;
      this.processingMessage = '';
    };
    
    img.src = this.imageFromUrl;
  }

  private processFile(file: File): void {
    console.log('processFile called with:', file);
    console.log('File instanceof File:', file instanceof File);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
    
    if (!file) {
      console.error('Arquivo inválido');
      return;
    }

    // Validate file before processing
    if (!(file instanceof File) || file.size === 0) {
      console.error('Arquivo inválido ou vazio');
      return;
    }

    this.selectedFile = file;
    this.currentFile = file;
    this.isProcessing = false;
    this.processingMessage = '';
    
    // Get image dimensions
    this.getImageDimensions(file);
    
    // Create preview URL with validation
    try {
      if (file instanceof Blob && file.size > 0) {
        // Clean up previous object URL
        if (this.objectUrl) {
          URL.revokeObjectURL(this.objectUrl);
        }
        this.objectUrl = URL.createObjectURL(file);
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
        console.log('Preview URL created successfully');
        this.cdr.detectChanges();
      } else {
        throw new Error('Invalid file for preview');
      }
    } catch (error) {
      console.error('Erro ao criar preview:', error);
      this.previewUrl = null;
    }
  }

  private getImageDimensions(file: File): void {
    const img = new Image();
    img.onload = () => {
      this.imageDimensions = {
        width: img.width,
        height: img.height
      };
      this.cdr.detectChanges();
    };
    img.src = URL.createObjectURL(file);
  }

  nextStep(): void {
    if (this.currentStep === 0 && this.selectedFile) {
      this.currentStep = 1;
      this.setupCropping(this.selectedFile);
    } else if (this.currentStep === 1) {
      this.currentStep = 2;
      this.setupFinalImage();
    }
    this.cdr.detectChanges();
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.cdr.detectChanges();
    }
  }

  removeBackground(): void {
    if (!this.selectedFile) {
      this.message.error('Nenhuma imagem selecionada');
      return;
    }

    this.isProcessing = true;
    this.processingMessage = 'Removendo fundo da imagem...';

    // Add timeout to prevent infinite loading
    const timeout$ = new Observable<never>((observer) => {
      setTimeout(() => {
        observer.error(new Error('Timeout: Processamento demorou muito'));
      }, 30000); // 30 seconds timeout
    });

    const processing$ = from(removeBackground(this.selectedFile, {
      model: 'isnet',
      output: { format: 'image/png' },
      device: "cpu" // Use CPU to avoid WebAssembly multi-threading issues
    }));

    // Race between processing and timeout
    const processingWithTimeout$ = new Observable<Blob>((observer) => {
      const processingSub = processing$.subscribe(observer);
      const timeoutSub = timeout$.subscribe({
        error: (error) => {
          console.error('Timeout no processamento:', error);
          this.processingMessage = 'Timeout no processamento. Usando imagem original.';
          // Convert original file to blob for consistency
          this.selectedFile!.arrayBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: this.selectedFile!.type });
            observer.next(blob);
            observer.complete();
          });
        }
      });

      return () => {
        processingSub.unsubscribe();
        timeoutSub.unsubscribe();
      };
    });

    processingWithTimeout$.pipe(
      finalize(() => {
        this.isProcessing = false;
        this.processingMessage = '';
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (processedBlob) => {
        try {
          console.log('Background removal completed successfully');
          this.backgroundRemoved = true;
          
          // Convert blob to file
          const processedFile = new File([processedBlob], this.selectedFile?.name || 'processed-image.png', {
            type: 'image/png'
          });
          
          // Update the file and preview
          this.selectedFile = processedFile;
          this.currentFile = processedFile;
          
          // Clean up previous object URL
          if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
          }
          
          this.objectUrl = URL.createObjectURL(processedFile);
          this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
          
          // Set up cropping
          this.setupCropping(processedFile);
          
          this.message.success('Fundo removido com sucesso!');
          this.cdr.detectChanges();
        } catch (error) {
          console.error('Erro ao processar arquivo sem fundo:', error);
          this.message.error('Erro ao processar imagem sem fundo. Usando original.');
          this.backgroundRemoved = false;
        }
      },
      error: (error) => {
        console.error('Erro na remoção de fundo:', error);
        this.message.error('Erro na remoção de fundo. Usando imagem original.');
        this.backgroundRemoved = false;
        this.setupCropping(this.selectedFile!);
      }
    });
  }

  skipProcessing(): void {
    this.backgroundRemoved = false;
    this.setupCropping(this.selectedFile!);
    this.nextStep();
  }

  private setupCropping(file: File): void {
    try {
      // Clean up previous object URL
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }
      this.objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
      
      // Set up imageChangedEvent for the cropper
      this.imageChangedEvent = {
        target: { files: [file] }
      };
      
      console.log('Cropping setup completed');
    } catch (error) {
      console.error('Erro ao configurar cropping:', error);
    }
  }

  private setupFinalImage(): void {
    if (this.lastCroppedBlob) {
      this.finalImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.lastCroppedBlob));
    } else if (this.previewUrl) {
      this.finalImageUrl = this.previewUrl;
    }
  }

  // Image cropping
  imageCropped(event: ImageCroppedEvent): void {
    console.log('Image cropped event:', event);
    if (event.blob) {
      this.lastCroppedBlob = event.blob;
      if (event.objectUrl) {
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      }
      console.log('Cropped blob size:', event.blob.size);
    }
  }

  imageLoaded(image: LoadedImage): void {
    console.log('Image loaded:', image);
  }
  
  cropperReady(): void {
    console.log('Cropper ready');
  }
  
  loadImageFailed(): void {
    console.error('Failed to load image in cropper');
    this.message.error('Erro ao carregar imagem no recortador');
  }

  // Finalize processing
  finalizeProcessing(): void {
    console.log('Finalizing processing...');
    
    try {
      // Get the final image (cropped or original)
      let finalFile: File;
      let finalUrl: SafeUrl;
      
      if (this.lastCroppedBlob && this.lastCroppedBlob.size > 0) {
        finalFile = new File([this.lastCroppedBlob], this.selectedFile?.name || 'processed-image.png', {
          type: 'image/png'
        });
        finalUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.lastCroppedBlob));
      } else if (this.selectedFile) {
        finalFile = this.selectedFile;
        finalUrl = this.previewUrl || '';
      } else {
        throw new Error('Nenhuma imagem disponível');
      }

      // Create the final processed image
      const processedImage: ProcessedImage = {
        file: finalFile,
        url: finalUrl,
        croppedBlob: this.lastCroppedBlob || undefined
      };

      console.log('Emitting processed image:', processedImage);
      this.imageProcessed.emit(processedImage);
      this.closeModal();
      
    } catch (error) {
      console.error('Erro ao finalizar processamento:', error);
      this.message.error('Erro ao finalizar processamento');
    }
  }
}
