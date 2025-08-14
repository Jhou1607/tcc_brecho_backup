// C:\Users\Jonathas\Downloads\TCC - Latest\Projeto TCC\Frontend\src\app\pages\montador-look\montador-look.component.ts

import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import * as fabric from 'fabric';
import {NzRateComponent} from 'ng-zorro-antd/rate';
import {FormsModule} from '@angular/forms';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {removeBackground} from '@imgly/background-removal';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NgxPicaModule, NgxPicaService} from '@digitalascetic/ngx-pica';
import { ImageOptimizerService } from '../../shared/services/image-optimizer.service';

// <<<<<<< CORREÇÃO: Importar operadores de 'rxjs/operators' >>>>>>>
import { from, map, Observable, Observer, of, Subscription, switchMap, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
// <<<<<<< FIM DA CORREÇÃO >>>>>>>

import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from 'ngx-image-cropper';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import { NzUploadModule, NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzStepComponent, NzStepsComponent} from 'ng-zorro-antd/steps';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {HeaderComponent} from "../../shared/components/header/header.component";
import {ProdutoService} from '../../services/product.service';
import {ClothingGroup, ClothingItem, LookConfig, Look} from '../../interfaces/interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { LookNameModalComponent } from '../../shared/components/look-name-modal/look-name-modal.component';
import { CadastroProdutoModalComponent } from './cadastro-produto-modal.component';
import { CategoriaAcessoriosCabeca, CategoriaTops, CategoriaCalcasSaias, CategoriaCalcados, CategoriaAcessorios } from '../../interfaces/categorias';

@Component({
  selector: 'app-montador-look',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    ImageCropperComponent,
    NgxPicaModule,
    NzCollapseModule,
    NzRateComponent,
    FormsModule,
    NzIconDirective,
    NzSpinComponent,
    NzUploadModule,
    NzInputGroupComponent,
    NzInputDirective,
    NzStepsComponent,
    NzStepComponent,
    NzFlexDirective,
    HeaderComponent,
    FontAwesomeModule,
  ],
  templateUrl: './montador-look.component.html',
  styleUrls: ['./montador-look.component.scss'],
})
export class MontadorLookComponent implements AfterViewInit, OnInit, OnDestroy {
  faSolidHeart = faSolidHeart;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  private lookIdFromRoute: number | null = null;
  private canvas!: fabric.Canvas;
  private deleteImg: HTMLImageElement;
  private selectedFile: File | null = null;
  protected previewUrl: string = "";
  protected loadingImg: boolean = false;
  protected showCropper: boolean | undefined;
  protected currentGroup: ClothingGroup | null = null;
  protected lastCroppedBlob: Blob | null | undefined = null;
  protected showAddImg : boolean = false;
  protected imgFromUrl: any;
  protected currentStep = 0;
  protected showErroDownImg = false;

    private groupItemsCache: { [groupName: string]: ClothingItem[] } = {};
  public loadingLookImages = false;
  public loadingGroups: { [groupName: string]: boolean } = {};
  private subscriptions: Subscription[] = [];
  private imageCache = new Map<string, string>();

  // Variáveis para salvar look
  showNomeLookModal = false;
  nomeLook = '';
  lookParaSalvar: any = null;

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  fileList: NzUploadFile[] = [];

  beforeUploadImgLocal = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.notification.warning('Somente imagens PNG e JPG sao permitidas!', 'Atenção');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.notification.warning('Tamanho da imagem deve ser menor que 2MB!', 'Atenção');
        observer.complete();
        return;
      }

      this.fileList = [...this.fileList, { ...file, uid: file.uid || Date.now().toString(), status: 'uploading' }];
      this.cdr.detectChanges();
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  imageChangedEvent:  any = '';
  croppedImage: SafeUrl  = '';

  private positions = [
    { left: 217, top: 43, width: 60, height: 60 }, // Acessórios de Cabeça
    { left: 160, top: 100, width: 175, height: 180 }, // Tops
    { left: 185, top: 280, width: 120, height: 180 }, // Calças e Saias
    { left: 175, top: 550, width: 115, height: 115 }, // Calçados
    { left: 310, top: 205, width: 85, height: 85 }, // Acessórios
  ];

  clothingGroups: ClothingGroup[] = [];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private notification: NzNotificationService, 
    private ngxPicaService: NgxPicaService, 
    private productService: ProdutoService,  
    private zone: NgZone, 
    private cdr: ChangeDetectorRef, 
    private modalService: NzModalService, 
    private sanitizer: DomSanitizer,
    private imageOptimizer: ImageOptimizerService
  ) {
    const deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    this.deleteImg = document.createElement('img');
    this.deleteImg.src = deleteIcon;
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      width: 500,
      height: 650,
    });

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';

    this.canvas.on('mouse:down', (event) => {
      const target = event.target;
      if (target instanceof fabric.FabricImage) {
        this.canvas.bringObjectToFront(target);
        this.canvas.renderAll();
        this.triggerLookUpdate();
      }
    });

    this.canvas.on('object:modified', () => {
      this.triggerLookUpdate();
    });
  }

  private initializePlaceholders() {
    this.clothingGroups.forEach((group, index) => {
      const placeholder = new fabric.Rect({
        left: this.positions[index].left,
        top: this.positions[index].top,
        width: this.positions[index].width,
        height: this.positions[index].height,
        fill: 'rgba(255, 255, 255, 0.3)',
        selectable: false,
        evented: false,
      });
      this.canvas.add(placeholder);
      group.placeholder = placeholder;
    });

    this.canvas.renderAll();
  }

  private addDeleteControl(image: fabric.FabricImage, group: ClothingGroup) {
    image.controls['deleteControl'] = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: (_eventData, transform) => {
        this.removeClothingItem(group, transform.target as fabric.FabricImage);
        return true;
      },
      render: (ctx, left, top, _styleOverride, fabricObject) => {
        const size = 24;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
        ctx.drawImage(this.deleteImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      },
    });
  }

  selectClothingItem(group: ClothingGroup, item: ClothingItem) {
    console.log('selectClothingItem', group, item);

    // Para grupos multi-item, não remove os outros
    if (group.name === 'Acessórios de Cabeça') {
      const groupIndex = this.clothingGroups.indexOf(group);
      const itemIdx = group.items.indexOf(item);
      // Centralizado (primeiro) e levemente à direita (segundo)
      let left = this.positions[groupIndex].left;
      let top = this.positions[groupIndex].top;
      if (itemIdx === 1) {
        left += 40; // desloca para a direita
        top += 10;
      }
      const initialWidth = this.positions[groupIndex].width;
      fabric.FabricImage.fromURL(item.canvasUrl || '', { crossOrigin: 'anonymous' }).then((image) => {
        image.set({
          left: left,
          top: top,
          selectable: true,
          hasControls: true,
          itemId: item.id,
        });
        image.scaleToWidth(initialWidth);
        image.applyFilters();
        this.addDeleteControl(image, group);
        this.canvas.add(image);
        this.canvas.renderAll();
        this.triggerLookUpdate();
      });
    } else if (group.name === 'Acessórios') {
      const groupIndex = this.clothingGroups.indexOf(group);
      const itemIdx = group.items.indexOf(item);
      // Um acessório à esquerda, outro à direita
      let left = this.positions[groupIndex].left;
      let top = this.positions[groupIndex].top;
      if (itemIdx === 0) {
        left -= 40; // esquerda
      } else if (itemIdx === 1) {
        left += 40; // direita
      }
      const initialWidth = this.positions[groupIndex].width;
      fabric.FabricImage.fromURL(item.canvasUrl || '', { crossOrigin: 'anonymous' }).then((image) => {
        image.set({
          left: left,
          top: top,
          selectable: true,
          hasControls: true,
          itemId: item.id,
        });
        image.scaleToWidth(initialWidth);
        image.applyFilters();
        this.addDeleteControl(image, group);
        this.canvas.add(image);
        this.canvas.renderAll();
        this.triggerLookUpdate();
      });
    } else {
      // Comportamento padrão para os outros grupos
      if (group.placeholder instanceof fabric.FabricImage) {
        this.canvas.remove(group.placeholder);
      } else if (group.placeholder instanceof fabric.Rect) {
        this.canvas.remove(group.placeholder);
      }
      group.placeholder = null;
      const groupIndex = this.clothingGroups.indexOf(group);
      const initialLeft = this.positions[groupIndex].left;
      const initialTop = this.positions[groupIndex].top;
      const initialWidth = this.positions[groupIndex].width;
      fabric.FabricImage.fromURL(item.canvasUrl || '', { crossOrigin: 'anonymous' }).then((image) => {
        image.set({
          left: initialLeft,
          top: initialTop,
          selectable: true,
          hasControls: true,
          itemId: item.id,
        });
        image.scaleToWidth(initialWidth);
        image.applyFilters();
        this.addDeleteControl(image, group);
        this.canvas.add(image);
        group.placeholder = image;
        this.canvas.renderAll();
        this.triggerLookUpdate();
      });
    }
  }

  private removeClothingItem(group: ClothingGroup, image: fabric.FabricImage) {
    this.canvas.remove(image);

    const groupIndex = this.clothingGroups.indexOf(group);
    const placeholder = new fabric.Rect({
      left: this.positions[groupIndex].left,
      top: this.positions[groupIndex].top,
      width: this.positions[groupIndex].width,
      height: this.positions[groupIndex].height,
      fill: 'rgba(255, 255, 255, 0.3)',
      selectable: false,
      evented: false,
    });
    this.canvas.add(placeholder);
    group.placeholder = placeholder;
    this.canvas.renderAll();
    this.triggerLookUpdate();
  }

  private getLookConfig(): LookConfig {
    const config: LookConfig = {};
    // Mapear todos os objetos do canvas para seus grupos
    this.clothingGroups.forEach((group) => {
      // Filtrar imagens do grupo pelo itemId
      const groupObjects = this.canvas.getObjects().filter(obj => {
        return obj instanceof fabric.FabricImage && group.items.some(i => i.id === obj.get('itemId'));
      }) as fabric.FabricImage[];
      config[group.name] = {
        items: groupObjects.map(obj => ({
          itemId: obj.get('itemId'),
          left: obj.left ?? 0,
          top: obj.top ?? 0,
          scaleX: obj.scaleX ?? 1,
          scaleY: obj.scaleY ?? 1,
          zIndex: this.canvas.getObjects().indexOf(obj),
        }))
      };
    });
    return config;
  }

  private getZIndexOrder(): { [itemId: string]: number } {
    const zIndexOrder: { [itemId: string]: number } = {};
    const objects = this.canvas.getObjects().filter(obj => obj instanceof fabric.FabricImage) as fabric.FabricImage[];
    objects.forEach((obj, index) => {
      const itemId = obj.get('itemId') as string;
      if (itemId) {
        zIndexOrder[itemId] = index;
      }
    });
    return zIndexOrder;
  }

  private triggerLookUpdate() {
    const lookConfig = this.getLookConfig();
    // Não precisa mais de getZIndexOrder separado, pois zIndex já está em cada item
    const postData = {
      lookConfig
    };
    console.log('Dados do look atualizados:', JSON.stringify(postData, null, 2));
  }

  importLook(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const lookConfig: LookConfig = JSON.parse(e.target?.result as string);
          this.applyLookConfigToCanvas(lookConfig);
          this.notification.success('Sucesso', 'Look importado do arquivo com sucesso!');
        } catch (error) {
          console.error('Erro ao importar JSON:', error);
          this.notification.error('Erro', 'Erro ao importar o look. Verifique se o arquivo JSON é válido.');
        }
      };
      reader.readAsText(file);
    }
  }

  saveLook() {
    const lookConfig = this.getLookConfig();

    const modalRef = this.modalService.create({
      nzTitle: 'Salvar Look',
      nzContent: LookNameModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzFooter: null
    });

    modalRef.afterClose.subscribe((nome_look: string) => {
      if (nome_look !== undefined) {
        if (this.lookIdFromRoute) {
          // Update existente
          this.productService.updateLook(this.lookIdFromRoute, nome_look, lookConfig, this.canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1,
          })).subscribe({
            next: (res) => {
              this.notification.success('Sucesso', res.message);
              this.router.navigate(['/meus-looks']);
            },
            error: (err) => {
              this.notification.error('Erro', err.error.message || 'Não foi possível atualizar o look.');
            }
          });
        } else {
          // Novo look
          this.productService.saveLook(nome_look, lookConfig, this.canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1,
          })).subscribe({
            next: (res) => {
              this.notification.success('Sucesso', res.message);
              this.router.navigate(['/meus-looks']);
            },
            error: (err) => {
              this.notification.error('Erro', err.error.message || 'Não foi possível salvar o look.');
            }
          });
        }
      }
    });
  }

  exportLookAsPng() {
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    const imageLink = document.createElement('a');
    imageLink.href = dataURL;
    imageLink.download = 'look-final.png';
    imageLink.click();
  }

  addItemToGroup(groupId: number, item: { url: string, name: string }) {
    const group = this.clothingGroups.find(g => g.id === groupId);
    if (group) {
      // Permitir até 2 itens para Acessórios de Cabeça e Acessórios
      if (group.name === 'Acessórios de Cabeça' || group.name === 'Acessórios') {
        if (group.items.length >= 2) {
          this.notification.warning('Limite atingido', 'Só é possível adicionar até 2 itens neste grupo.');
          return;
        }
        // Permite adicionar múltiplos
        const newId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        group.items.unshift({ id: newId, thumbnailUrl: item.url, canvasUrl: item.url, name: item.name, favorited: false, origem: 'custom' });
      } else {
        // Para os outros grupos, só pode 1 item
        group.items = [];
        const newId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        group.items.unshift({ id: newId, thumbnailUrl: item.url, canvasUrl: item.url, name: item.name, favorited: false, origem: 'custom' });
      }
    }
  }

  resizeImage(file: File, width: number, height: number): Observable<File> {
    return this.ngxPicaService.resizeImage(file, width, height, false);
  }

  openImageCropperModal(blobToEdit?: Blob): void {
    if (!blobToEdit) {
      console.warn('Nenhum Blob de imagem fonte disponível para edição.');
      return;
    }
  }

  salvaCropper(): void {
    console.log('Button ok clicked!');
    this.showCropper = false;
    if (this.lastCroppedBlob){
      const imageUrlString = URL.createObjectURL(this.lastCroppedBlob);
      this.addItemToGroup(this.currentGroup!.id, {url : imageUrlString, name: this.currentGroup!.name});
      this.currentGroup = null;
      this.lastCroppedBlob = null;
    }
  }

  cancelaCropper(): void {
    console.log('Button cancel clicked!');
    this.showCropper = false;
    this.currentGroup = null;
    this.lastCroppedBlob = null;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('imageCropped',event);
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.lastCroppedBlob = event.blob;
    }
  }
  imageLoaded(image: LoadedImage) { }
  cropperReady() { }
  loadImageFailed() { }

  addItem(group: ClothingGroup) {
    if (this.loadingImg) {
      this.notification.warning('Aguarde', 'Há uma imagem sendo processada.');
      return;
    }
    const modalRef = this.modalService.create({
      nzTitle: `Adicionar ${group.name}`,
      nzContent: CadastroProdutoModalComponent,
      nzFooter: null
    });
    // Escuta o evento produtoCriado do modal
    modalRef.afterOpen.subscribe(() => {
      if (modalRef.componentInstance?.produtoCriado) {
        modalRef.componentInstance.produtoCriado.subscribe(() => {
          this.refreshItens();
        });
      }
    });
  }

  refreshItens() {
    this.productService.getItensParaMontador().subscribe({
      next: res => {
        const fixedOrder = [
          'Acessórios de Cabeça',
          'Tops',
          'Calças e Saias',
          'Calçados',
          'Acessórios',
        ];
        this.clothingGroups = fixedOrder.map((name, idx) => {
          const found = res.find((g: any) => g.name === name);
          return found || {
            id: idx,
            name,
            icon: this.getDefaultIconForGroup(name),
            items: [],
            placeholder: null,
            ordem: idx
          };
        });
        this.cdr.detectChanges();
      }
    });
  }

  downloadImageAsBlob(imageUrl: string): Observable<Blob> {
    return from(fetch(imageUrl)).pipe(
      map(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return response;
      }),
      switchMap(response => from(response.blob())),
      catchError(error => {
        return throwError(() => new Error(`Não foi possível baixar a imagem da URL: ${imageUrl}. Detalhes: ${error.message}`));
      })
    );
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }
    this.previewUrl = file.url || file['preview'];
  };

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  preProcessImg(file: File) : Observable<File>{
    return new Observable((observer: Observer<File>) => {
      this.loadingImg = true;
      removeBackground(file, {
        output: {
          quality: 1,
          format: "image/png"
        },
        rescale: true,
        device: "gpu"
      }).then(async (result) => {
        try {
          const maxSize = 600;
          this.resizeImage(result as File, maxSize, maxSize).subscribe( {
            next: (resizedImg) => {
              this.selectedFile = new File([resizedImg], file.name, { type: 'image/png' });
              this.previewUrl = URL.createObjectURL(resizedImg);
              this.loadingImg = false;
              this.imageChangedEvent = {
                target: {
                files: [resizedImg]
                }
              };
              this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(resizedImg));
              this.loadingImg = false;
              observer.next(resizedImg);
              observer.complete();
            },
            error: (err) => {
              this.notification.error('Erro', 'Ocorreu um erro ao processar a imagem.');
              this.loadingImg = false;
              this.showAddImg = false;
              this.selectedFile = null;
              this.previewUrl = "";
              observer.error(err);
            }
          });
        } catch (error) {
          this.notification.error('Erro', 'Ocorreu um erro ao processar a imagem.');
          this.loadingImg = false;
          this.showAddImg = false;
          this.selectedFile = null;
          this.previewUrl = "";
          observer.error(error);
        }
      })
        .catch(error => {
          this.notification.error('Erro', 'Ocorreu um erro ao processar a imagem.');
          this.loadingImg = false;
          this.showAddImg = false;
          this.selectedFile = null;
          this.previewUrl = "";
          observer.error(error);
        });
    });
  }

  closeInfoDownImg(){
    this.showErroDownImg = false;
  }

  cancelAddImg() {
    this.showAddImg = false;
    this.selectedFile = null;
    this.previewUrl = "";
  }

  saveAddImg() {
    if (this.lastCroppedBlob){
      this.addItemToGroup(this.currentGroup!.id, {url : URL.createObjectURL(this.lastCroppedBlob), name: this.currentGroup!.name});
      this.showAddImg = false;
      this.selectedFile = null;
      this.lastCroppedBlob = null;
      this.previewUrl = "";
    }
  }

  handleUploadRequest = (item: NzUploadXHRArgs): Subscription => {
    const file = item.file as unknown as File;
    if (file) {
      this.preProcessImg(file).subscribe({
        next: (res) => {
          this.selectedFile = res;
          this.previewUrl = URL.createObjectURL(this.selectedFile);
          this.imageChangedEvent = {
            target: {
              files: [this.selectedFile]
            }
          };
          this.lastCroppedBlob = this.selectedFile;
          this.nextStep();
          return of(null).subscribe();
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      console.error('Nenhum arquivo selecionado.');
    }
    return of(null).subscribe();
  };

  imgLocalLoaded({ file, fileList }: NzUploadChangeParam): void { }
  preStep(): void {
    this.currentStep -= 1;
    if (this.currentStep === 0) {
      this.lastCroppedBlob = null;
    }
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  nextStep(): void {
    this.currentStep += 1;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  doneSteps(): void {
    console.log('done');
  }

  loadImgFromUrl() {
    if (this.imgFromUrl) {
      if (!this.isValidUrl(this.imgFromUrl)) {
        this.notification.warning('Url inválida', 'Atenção');
        return;
      }
      this.downloadImageAsBlob(this.imgFromUrl).subscribe({
        next: (blob) => {
          this.preProcessImg(blob as File).subscribe({
            next: (res) => {
              this.lastCroppedBlob = res;
              this.selectedFile = res;
              this.previewUrl = URL.createObjectURL(this.selectedFile);
              this.nextStep();
            },
            error: (err) => {
              console.log(err);
            }
          })
        },
        error: (err) => {
          this.showErroDownImg = true;
        }
      })
    }
  }

  ngOnInit(): void {
    this.productService.getItensParaMontador().subscribe({
      next: res => {
        // Ordem fixa dos grupos
        const fixedOrder = [
          'Acessórios de Cabeça',
          'Tops',
          'Calças e Saias',
          'Calçados',
          'Acessórios',
        ];
        // Monta os grupos na ordem fixa, preenchendo com array vazio se não vier do backend
        this.clothingGroups = fixedOrder.map((name, idx) => {
          const found = res.find((g: any) => g.name === name);
          return found || {
            id: idx,
            name,
            icon: this.getDefaultIconForGroup(name),
            items: [],
            placeholder: null,
            ordem: idx
          };
        });
        this.cdr.detectChanges();

        const routeLookId = this.activatedRoute.snapshot.params['lookId'];
        const queryLookId = this.activatedRoute.snapshot.queryParams['lookId'];
        this.lookIdFromRoute = routeLookId
          ? Number(routeLookId)
          : (queryLookId ? Number(queryLookId) : null);

        if (this.lookIdFromRoute) {
          this.loadLookById(this.lookIdFromRoute);
        } else {
          this.initializePlaceholders();
        }
      }
    });
  }

  private getDefaultIconForGroup(name: string): string {
    switch (name) {
      case 'Acessórios de Cabeça': return '/assets/images/icon-chapeu.png';
      case 'Tops': return '/assets/images/icon-camisa.png';
      case 'Calças e Saias': return '/assets/images/icon-calca.png';
      case 'Calçados': return '/assets/images/icon-sapatos.png';
      case 'Acessórios': return '/assets/images/icon-acessorio.png';
      default: return '/assets/images/icon-default.png';
    }
  }

  loadLookById(lookId: number): void {
    console.log('Chamando loadLookById para o lookId:', lookId);
    this.productService.getLookById(lookId).subscribe({
      next: (look: Look) => {
        console.log('Look recebido do backend:', look);
        this.notification.success('Sucesso', `Look "${look.nome_look || 'Sem Nome'}" carregado!`);
        this.applyLookConfigToCanvas(look.configuracao);
      },
      error: (err) => {
        this.notification.error('Erro', err.error.message || 'Não foi possível carregar o look.');
        console.error('Erro ao carregar look:', err);
        this.router.navigate(['/meus-looks']);
      }
    });
  }

  onToggleFavorite(item: any, group: any) {
    if (item.origem !== 'catalog') return;
    this.productService.toggleFavorite(Number(item.id)).subscribe(() => {
      group.items = group.items.filter((i: any) => i.id !== item.id);
      this.cdr.detectChanges();
    });
  }

  async applyLookConfigToCanvas(lookConfig: LookConfig): Promise<void> {
    this.loadingLookImages = true;
    this.canvas.clear();
    const preloadPromises: Promise<{ image: fabric.FabricImage, group: ClothingGroup }>[] = [];
    Object.keys(lookConfig).forEach(groupName => {
      const group = this.clothingGroups.find(g => g.name === groupName);
      if (!group) return;
      const groupConfig = lookConfig[groupName];
      if (!groupConfig || !groupConfig.items) return;
      const sortedItems = [...groupConfig.items].sort((a, b) => a.zIndex - b.zIndex);
      sortedItems.forEach(itemConfig => {
        const item = group.items.find(i => i.id === itemConfig.itemId);
        if (item && item.canvasUrl) {
          preloadPromises.push(
            new Promise(resolve => {
              fabric.FabricImage.fromURL(item.canvasUrl!, { crossOrigin: 'anonymous' }).then((image) => {
                image.set({
                  left: itemConfig.left,
                  top: itemConfig.top,
                  scaleX: itemConfig.scaleX,
                  scaleY: itemConfig.scaleY,
                  selectable: true,
                  hasControls: true,
                  itemId: item.id,
                });
                this.addDeleteControl(image, group);
                resolve({ image, group });
              });
            })
          );
        }
      });
    });
    const loadedImages = await Promise.all(preloadPromises);
    loadedImages.forEach(({ image }) => {
      this.canvas.add(image);
    });
    this.canvas.renderAll();
    this.loadingLookImages = false;
    this.triggerLookUpdate();
  }

    loadGroupItems(group: ClothingGroup) {
    if (this.groupItemsCache[group.name]) {
      group.items = this.groupItemsCache[group.name];
      return;
    }
    this.loadingGroups[group.name] = true;
    
    const subscription = this.productService.getItensParaMontador().subscribe({
      next: (groups) => {
        const found = groups.find(g => g.name === group.name);
        if (found) {
          group.items = found.items;
          this.groupItemsCache[group.name] = found.items;
          
          // Pré-carregar imagens para melhor performance
          const imageUrls = found.items
            .filter(item => item.canvasUrl)
            .map(item => item.canvasUrl!);
          
          if (imageUrls.length > 0) {
            this.imageOptimizer.preloadImages(imageUrls).subscribe();
          }
        }
        this.loadingGroups[group.name] = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingGroups[group.name] = false;
      }
    });
    
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.canvas) {
      this.canvas.dispose();
    }
  }

  confirmarNomeLook() {
    if (this.lookParaSalvar) {
      const nomeLook = this.nomeLook || `Look #${Date.now()}`;
      
      this.productService.saveLook(nomeLook, this.lookParaSalvar.config, this.lookParaSalvar.imagem).subscribe({
        next: (res: any) => {
          this.notification.success('Sucesso', res.message || 'Look salvo com sucesso!');
          this.cancelarNomeLook();
          this.router.navigate(['/meus-looks']);
        },
        error: (err: any) => {
          this.notification.error('Erro', err.error?.message || 'Não foi possível salvar o look.');
        }
      });
    }
  }

  cancelarNomeLook() {
    this.showNomeLookModal = false;
    this.nomeLook = '';
    this.lookParaSalvar = null;
  }
}