import { Component, EventEmitter, Input, Output, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
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
import { from, Observable, Observer, of, Subscription, finalize } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface ProcessedImage {
  file: File;
  url: SafeUrl;
  croppedBlob?: Blob;
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
  
  // Cropping
  imageChangedEvent: any = null;
  croppedImage: SafeUrl = '';
  lastCroppedBlob: Blob | null = null;
  
  // Object URL management
  objectUrl: string | null = null;

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
    this.fileList = [];
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageFromUrl = '';
    this.lastCroppedBlob = null;
    this.croppedImage = '';
    this.imageChangedEvent = null;
    
    // Clean up previous object URL
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  // File upload handling
  beforeUpload = (file: NzUploadFile | File, _fileList: NzUploadFile[]): Observable<boolean> => {
    console.log('beforeUpload called with file:', file);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    console.log('Is File instance:', file instanceof File);
    console.log('Is NzUploadFile:', 'originFileObj' in file);
    
    const isValidType = this.acceptedTypes.includes(file.type || '');
    if (!isValidType) {
      this.message.error(`Tipo de arquivo não suportado. Use: ${this.acceptedTypes.join(', ')}`);
      return of(false);
    }

    const isValidSize = (file.size || 0) / 1024 / 1024 < this.maxFileSize;
    if (!isValidSize) {
      this.message.error(`Arquivo muito grande. Máximo: ${this.maxFileSize}MB`);
      return of(false);
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
      return of(false);
    }

    console.log('Actual file object:', actualFile);
    console.log('Actual file type:', actualFile.type);
    console.log('Actual file size:', actualFile.size);

    // Add to fileList if it's an NzUploadFile
    if ('uid' in file) {
      this.fileList = [file as NzUploadFile];
    }
    
    this.processFile(actualFile);
    return of(false);
  };

  skipBackgroundRemoval(): void {
    // Skip background removal and go directly to cropping
    if (this.selectedFile) {
      this.setupCropping(this.selectedFile);
    }
    this.currentStep = 1;
    this.cdr.detectChanges();
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
    this.currentStep = 0;
    this.isModalVisible = true;
    this.isProcessing = false;
    this.processingMessage = '';
    
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

  // Background removal
  private removeBackground(file: File): Observable<File> {
    this.isProcessing = true;
    this.processingMessage = 'Removendo fundo da imagem...';
    
    // Add timeout to prevent infinite loading
    const timeout$ = new Observable<never>((observer) => {
      setTimeout(() => {
        observer.error(new Error('Timeout: Processamento demorou muito'));
      }, 30000); // 30 seconds timeout
    });
    
    const processing$ = from(removeBackground(file, {
      device: 'cpu',
      output: {
        format: 'image/png',
        quality: 0.8
      }
    })).pipe(
      map((result) => {
        if (result && result instanceof Blob) {
          // Validate the blob before proceeding
          if (result.size > 0) {
            return new File([result], file.name, { type: 'image/png' });
          } else {
            throw new Error('Processed image has no content');
          }
        } else {
          throw new Error('Invalid processing result');
        }
      }),
      catchError((error) => {
        console.error('Erro na remoção de fundo:', error);
        this.processingMessage = 'Erro na remoção de fundo. Usando imagem original.';
        
        // Return the original file as fallback
        return of(file);
      }),
      finalize(() => {
        this.isProcessing = false;
        this.processingMessage = '';
      })
    );
    
    // Race between processing and timeout
    return new Observable<File>((observer) => {
      const processingSub = processing$.subscribe(observer);
      const timeoutSub = timeout$.subscribe({
        error: (error) => {
          console.error('Timeout no processamento:', error);
          this.processingMessage = 'Timeout no processamento. Usando imagem original.';
          observer.next(file); // Return original file
          observer.complete();
        }
      });
      
      return () => {
        processingSub.unsubscribe();
        timeoutSub.unsubscribe();
      };
    });
  }

  // Image resizing
  private resizeImage(file: File): Observable<File> {
    this.isProcessing = true;
    this.processingMessage = 'Redimensionando imagem...';
    
    return from(this.ngxPicaService.resizeImage(file, 800, 600, false)).pipe(
      map((resizedBlob) => {
        // Validate the resized blob
        if (resizedBlob && resizedBlob instanceof Blob && resizedBlob.size > 0) {
          return new File([resizedBlob], file.name, { type: file.type });
        } else {
          throw new Error('Invalid resized image');
        }
      }),
      catchError((error) => {
        console.error('Erro no redimensionamento:', error);
        this.processingMessage = 'Erro no redimensionamento. Usando imagem original.';
        
        // Return the original file as fallback
        return of(file);
      }),
      finalize(() => {
        this.isProcessing = false;
        this.processingMessage = '';
      })
    );
  }

  // URL image loading
  loadImageFromUrl(): void {
    if (!this.imageFromUrl) {
      this.message.warning('Digite uma URL válida');
      return;
    }

    if (!this.isValidUrl(this.imageFromUrl)) {
      this.message.warning('URL inválida');
      return;
    }

    this.isProcessing = true;
    this.processingMessage = 'Baixando imagem da URL...';
    this.cdr.detectChanges();

    this.downloadImageAsBlob(this.imageFromUrl).subscribe({
      next: (blob) => {
        const file = new File([blob], 'image-from-url.png', { type: 'image/png' });
        this.processFile(file);
      },
      error: (error) => {
        this.isProcessing = false;
        this.message.error('Erro ao baixar imagem: ' + error.message);
        this.cdr.detectChanges();
      }
    });
  }

  private downloadImageAsBlob(imageUrl: string): Observable<Blob> {
    return from(fetch(imageUrl)).pipe(
      map(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }),
      switchMap(response => from(response.blob())),
      catchError(error => {
        throw new Error(`Não foi possível baixar a imagem: ${error.message}`);
      })
    );
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep === 0) {
      // Step 0: Upload complete, move to background removal
      this.currentStep = 0.5;
      this.cdr.detectChanges();
    } else if (this.currentStep === 0.5) {
      // Step 0.5: Background removal
      if (this.selectedFile) {
        this.isProcessing = true;
        this.processingMessage = 'Removendo fundo da imagem...';
        this.cdr.detectChanges();
        
        this.removeBackground(this.selectedFile).subscribe({
          next: (processedFile) => {
            this.selectedFile = processedFile;
            this.setupCropping(processedFile);
            this.currentStep = 1;
            this.isProcessing = false;
            this.processingMessage = '';
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Erro no processamento:', error);
            this.isProcessing = false;
            this.processingMessage = 'Erro no processamento. Continuando com imagem original.';
            this.setupCropping(this.selectedFile!);
            this.currentStep = 1;
            this.cdr.detectChanges();
          }
        });
      }
    } else if (this.currentStep === 1) {
      // Step 1: Cropping
      if (this.lastCroppedBlob) {
        this.finalizeProcessing();
      } else {
        this.message.warning('Recorte a imagem antes de continuar');
      }
    }
  }

  previousStep(): void {
    if (this.currentStep === 1) {
      this.currentStep = 0.5;
    } else if (this.currentStep === 0.5) {
      this.currentStep = 0;
    }
    this.cdr.detectChanges();
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
    console.log('Last cropped blob:', this.lastCroppedBlob);
    
    if (!this.lastCroppedBlob) {
      console.error('Nenhuma imagem processada disponível');
      this.message.error('Nenhuma imagem processada disponível');
      return;
    }

    // Validate the cropped blob before creating the final file
    if (!(this.lastCroppedBlob instanceof Blob) || this.lastCroppedBlob.size === 0) {
      console.error('Blob processado inválido');
      this.message.error('Imagem processada inválida');
      return;
    }

    try {
      const processedFile = new File([this.lastCroppedBlob], this.selectedFile?.name || 'processed-image.png', {
        type: 'image/png'
      });

      // Final validation before emitting
      if (processedFile instanceof File && processedFile.size > 0) {
        const processedImage: ProcessedImage = {
          file: processedFile,
          url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(processedFile)) as SafeUrl,
          croppedBlob: this.lastCroppedBlob
        };

        console.log('Emitting processed image:', processedImage);
        this.imageProcessed.emit(processedImage);
        this.closeModal();
      } else {
        throw new Error('Failed to create valid processed file');
      }
    } catch (error) {
      console.error('Erro ao finalizar processamento:', error);
      this.message.error('Erro ao finalizar processamento');
      // Emit the original file as fallback
      if (this.selectedFile) {
        const fallbackImage: ProcessedImage = {
          file: this.selectedFile,
          url: this.previewUrl || '',
          croppedBlob: this.lastCroppedBlob
        };
        this.imageProcessed.emit(fallbackImage);
        this.closeModal();
      }
    }
  }

  // Drag and drop handling
  handleUploadRequest = (item: NzUploadXHRArgs): Subscription => {
    const file = item.file;
    let actualFile: File;
    
    if (file.originFileObj) {
      actualFile = file.originFileObj;
    } else if (file instanceof File) {
      actualFile = file as File;
    } else {
      console.error('Não foi possível obter o arquivo original no handleUploadRequest');
      return of(null).subscribe();
    }
    
    this.processFile(actualFile);
    return of(null).subscribe();
  };

  handleRemove = (file: any): boolean => {
    this.fileList = this.fileList.filter(f => f.uid !== file.uid);
    return true;
  };
}
