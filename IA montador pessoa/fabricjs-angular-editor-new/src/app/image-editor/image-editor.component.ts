import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import * as fabric from 'fabric';
import {NzRateComponent} from 'ng-zorro-antd/rate';
import {FormsModule} from '@angular/forms';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {removeBackground} from '@imgly/background-removal';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NzAlertComponent} from 'ng-zorro-antd/alert';
import {NgxPicaModule, NgxPicaService} from '@digitalascetic/ngx-pica';
import {catchError, from, map, Observable, Observer, of, Subscription, switchMap, throwError} from 'rxjs';
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from 'ngx-image-cropper';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzModalComponent, NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {NzUploadChangeParam, NzUploadComponent, NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzStepComponent, NzStepsComponent} from 'ng-zorro-antd/steps';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {HttpClient} from '@angular/common/http';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzRadioModule} from 'ng-zorro-antd/radio';


interface ClothingItem {
  id: string;
  url: string;
  name: string;
  favorited?: boolean;
}

interface ClothingGroup {
  id: number;
  name: string;
  icon: string;
  items: ClothingItem[];
  placeholder: fabric.Rect | fabric.FabricImage | null;
}

interface LookConfig {
  [groupName: string]: {
    itemId: string | null;
    left: number | null;
    top: number | null;
    scaleX: number | null;
    scaleY: number | null;
  };
}

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule, ImageCropperComponent, NgxPicaModule, NzCollapseModule, NzRateComponent, FormsModule, NzIconDirective, NzSpinComponent, NzAlertComponent, NzModalComponent, NzUploadComponent, NzInputGroupComponent, NzInputDirective, NzStepsComponent, NzStepComponent, NzFlexDirective, NzDropDownModule, NzRadioModule],
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
})
export class ImageEditorComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
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
  protected showMobileCategoryModal = false;
  protected currentMobileGroup: ClothingGroup | null = null;
  protected showAiLookModal = false;
  protected aiLookImage: string | null = null;
  protected loadingAiLook = false;
  protected refreshingAiLook = false;
  protected retryCount = 0;
  private readonly MAX_RETRIES = 2; // 3 tentativas (0, 1, 2)
  protected aiLookGender: 'woman' | 'man' | null = 'woman';
  protected aiLookSkinColor: string | null = 'WHITE'; 
  protected aiLookHeight: number | null = 175; // Altura em cm
  protected aiLookWeight: number | null = 65; // Peso em kg
  protected loadingComment = false;
  protected showCommentModal = false;
  protected aiComment: string | null = null;
  protected commentRetryCount = 0;
  private aiCommentForCurrentImage: string | null = null; // Comentário específico para a imagem atual

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
        alert('Somente imagens PNG e JPG sao permitidas!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        alert('Tamanho da imagem deve ser menor que 2MB!');
        observer.complete();
        return;
      }

      this.fileList = [...this.fileList, { ...file, uid: file.uid || Date.now().toString(), status: 'uploading' }];
      this.cdr.detectChanges();
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });


  imageChangedEvent:  any = '';
  croppedImage: SafeUrl  = '';

  private positions = [
    { left: 217, top: 43, width: 60, height: 60 }, // Chapéu
    { left: 160, top: 100, width: 175, height: 180 }, // Blusa
    { left: 185, top: 280, width: 120, height: 180 }, // Calça
    { left: 175, top: 550, width: 115, height: 115 }, // Sapato
    { left: 310, top: 205, width: 85, height: 85 }, // Acessório
  ];

  clothingGroups: ClothingGroup[] = [
    {
      id: 1,
      name: 'Chapéus',
      icon: '/assets/images/icon-chapeu.png',
      items: [
        { id: '1', url: '/assets/images/bone1.png', name: 'Boné Águia' },
        { id: '2', url: '/assets/images/chapeu1.png', name: 'Chapéu Preto' },
        { id: '3', url: '/assets/images/chapeu2.png', name: 'Chapéu Rosa' },
      ],
      placeholder: null,
    },
    {
      id: 2,
      name: 'Blusas',
      icon: '/assets/images/icon-camisa.png',
      items: [
        { id: '1', url: '/assets/images/camisa1.png', name: 'Camisa Branca' },
        { id: '2', url: '/assets/images/blusa1.png', name: 'Blusa Rosa' },
        { id: '3', url: '/assets/images/blusa2.png', name: 'Blusinha' },
      ],
      placeholder: null,
    },
    {
      id: 3,
      name: 'Calças',
      icon: '/assets/images/icon-calca.png',
      items: [
        { id: '1', url: '/assets/images/calca1.png', name: 'Calça Lag' },
        { id: '2', url: '/assets/images/saia1.png', name: 'Saia Preta' },
        { id: '3', url: '/assets/images/saia2.png', name: 'Saia Rosa' },
      ],
      placeholder: null,
    },
    {
      id: 4,
      name: 'Sapatos',
      icon: '/assets/images/icon-sapatos.png',
      items: [
        { id: '1', url: '/assets/images/tenis1.png', name: 'Tênis Puma' },
        { id: '2', url: '/assets/images/sapato1.png', name: 'Sapato Salto' },
        { id: '3', url: '/assets/images/sapato2.png', name: 'Sapato Preto' },
      ],
      placeholder: null,
    },
    {
      id: 5,
      name: 'Acessórios',
      icon: '/assets/images/icon-acessorio.png',
      items: [
        { id: '1', url: '/assets/images/bolsa1.png', name: 'Bolsa de Mão' },
        { id: '2', url: '/assets/images/bolsa2.png', name: 'Bolsa Caramelo' },
        { id: '3', url: '/assets/images/bolsa3.png', name: 'Bolsa Rosa' },
        { id: '4', url: '/assets/images/oculos1.png', name: 'Oculos feminino' },
      ],
      placeholder: null,
    },
  ];




  constructor(private ngxPicaService: NgxPicaService, private zone: NgZone, private cdr: ChangeDetectorRef, private modalService: NzModalService, private sanitizer: DomSanitizer, private http: HttpClient) {
    // Inicializar a imagem do ícone de remoção
    const deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    this.deleteImg = document.createElement('img');
    this.deleteImg.src = deleteIcon;
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      width: 350,
      height: 750,
    });

    // Restaurar gênero e cor da pele salvos
    const savedGender = localStorage.getItem('aiLookGender');
    if (savedGender === 'woman' || savedGender === 'man') {
      this.aiLookGender = savedGender;
    }
    const savedSkinColor = localStorage.getItem('aiLookSkinColor');
    if (savedSkinColor) {
      this.aiLookSkinColor = savedSkinColor;
    }
    const savedHeight = localStorage.getItem('aiLookHeight');
    if (savedHeight) {
      this.aiLookHeight = parseInt(savedHeight, 10);
    }
    const savedWeight = localStorage.getItem('aiLookWeight');
    if (savedWeight) {
      this.aiLookWeight = parseInt(savedWeight, 10);
    }

    // Configurações globais para controles
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';

    this.initializePlaceholders();

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
    if (!group.placeholder) return;

    const currentLeft = group.placeholder.left || 0;
    const currentTop = group.placeholder.top || 0;
    const currentScaleX = (group.placeholder instanceof fabric.FabricImage ? group.placeholder.scaleX : 0.25) || 0.25;
    const currentScaleY = (group.placeholder instanceof fabric.FabricImage ? group.placeholder.scaleY : 0.25) || 0.25;

    this.canvas.remove(group.placeholder);

    const groupIndex = this.clothingGroups.indexOf(group);

    fabric.FabricImage.fromURL(item.url, { crossOrigin: 'anonymous' }).then((image) => {
      image.set({
        left: currentLeft,
        top: currentTop,
        scaleX: currentScaleX,
        scaleY: currentScaleY,
        selectable: true,
        hasControls: true,
        itemId: item.id,
      });
      if (!(group.placeholder instanceof fabric.FabricImage)) {
        image.scaleToWidth(this.positions[groupIndex].width);
      }
      image.applyFilters();

      this.addDeleteControl(image, group);

      this.canvas.add(image);
      group.placeholder = image;
      this.canvas.renderAll();
      this.triggerLookUpdate();
    });
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
    this.clothingGroups.forEach((group) => {
      config[group.name] = {
        itemId: null,
        left: null,
        top: null,
        scaleX: null,
        scaleY: null,
      };
      if (group.placeholder instanceof fabric.FabricImage && group.placeholder.get('itemId')) {
        config[group.name] = {
          itemId: group.placeholder.get('itemId') as string, // Type assertion
          left: group.placeholder.left || null,
          top: group.placeholder.top || null,
          scaleX: group.placeholder.scaleX || null,
          scaleY: group.placeholder.scaleY || null,
        };
      }
    });
    return config;
  }

  private getZIndexOrder(): { [itemId: string]: number } {
    const zIndexOrder: { [itemId: string]: number } = {};
    const objects = this.canvas.getObjects().filter(obj => obj instanceof fabric.FabricImage) as fabric.FabricImage[];
    objects.forEach((obj, index) => {
      const itemId = obj.get('itemId') as string; // Type assertion
      if (itemId) {
        zIndexOrder[itemId] = index;
      }
    });
    return zIndexOrder;
  }

  private triggerLookUpdate() {
    const lookConfig = this.getLookConfig();
    const zIndexOrder = this.getZIndexOrder();

    const postData = {
      lookConfig,
      zIndexOrder,
    };

    console.log('POST /api/save-look', JSON.stringify(postData, null, 2));

    /*
    import { HttpClient } from '@angular/common/http';
    constructor(private http: HttpClient) {}
    this.http.post('/api/save-look', postData).subscribe({
      next: () => console.log('Look salvo no banco!'),
      error: (err) => console.error('Erro ao salvar look:', err),
    });
    */
  }

  importLook(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const lookConfig: LookConfig = JSON.parse(e.target?.result as string);

          this.clothingGroups.forEach((group) => {
            const config = lookConfig[group.name];
            if (!config || !config.itemId) {
              if (group.placeholder) {
                this.canvas.remove(group.placeholder);
              }
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
              return;
            }

            const item = group.items.find((i) => i.id === config.itemId);
            if (!item) {
              console.warn(`Item com ID ${config.itemId} não encontrado no grupo ${group.name}`);
              return;
            }

            if (group.placeholder) {
              this.canvas.remove(group.placeholder);
            }

            fabric.FabricImage.fromURL(item.url, { crossOrigin: 'anonymous' }).then((image) => {
              image.set({
                left: config.left ?? 0,
                top: config.top ?? 0,
                scaleX: config.scaleX ?? 0.25,
                scaleY: config.scaleY ?? 0.25,
                selectable: true,
                hasControls: true,
                itemId: item.id,
              });
              this.addDeleteControl(image, group);

              this.canvas.add(image);
              group.placeholder = image;
              this.canvas.renderAll();
            });
          });
          this.canvas.renderAll();
          this.triggerLookUpdate();
        } catch (error) {
          console.error('Erro ao importar JSON:', error);
          alert('Erro ao importar o look. Verifique se o arquivo JSON é válido.');
        }
      };
      reader.readAsText(file);
    }
  }

  saveLook() {
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    const imageLink = document.createElement('a');
    imageLink.href = dataURL;
    imageLink.download = 'look-final.png';
    imageLink.click();

    const lookConfig = this.getLookConfig();
    const configJson = JSON.stringify(lookConfig, null, 2);
    const configLink = document.createElement('a');
    configLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(configJson);
    configLink.download = 'look-config.json';
    configLink.click();

    this.triggerLookUpdate();
  }

  private hasClothingItems(): boolean {
    const objects = this.canvas.getObjects();
    return objects.some(obj => obj instanceof fabric.FabricImage && obj.get('itemId'));
  }

  private generateLookImage(): string {
    return this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
  }

  async generateAiLook() {
    if (!this.hasClothingItems()) {
      this.modalService.warning({
        nzTitle: 'Atenção',
        nzContent: 'É necessário adicionar pelo menos uma peça/acessório ao look antes de gerar o look com IA.',
        nzOkText: 'OK'
      });
      return;
    }

    if (!this.aiLookGender || !this.aiLookSkinColor || !this.aiLookHeight || !this.aiLookWeight) {
      this.modalService.warning({
        nzTitle: 'Atenção',
        nzContent: 'Selecione o gênero, a cor da pele, a altura e o peso antes de gerar o look.',
        nzOkText: 'OK'
      });
      return;
    }

    this.loadingAiLook = true;
    this.retryCount = 0;
    this.cdr.detectChanges();

    await this.generateAiLookInternal();
  }

  openAiLookModal() {
    this.showAiLookModal = true;
    this.aiLookImage = null;
    this.loadingAiLook = false;
    this.cdr.detectChanges();
  }

  /**
   * Internal method that handles the actual AI look generation with retry logic
   * Sends the canvas image and parameters to the AI service
   */
  private async generateAiLookInternal() {
    try {
      const imageDataUrl = this.generateLookImage();
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'look.png');
      if (this.aiLookGender) {
        formData.append('gender', this.aiLookGender);
      }
      if (this.aiLookSkinColor) {
        formData.append('skinColor', this.aiLookSkinColor);
      }
      if (this.aiLookWeight) {
        formData.append('weight', this.aiLookWeight.toString());
      }
      if (this.aiLookHeight) {
        formData.append('height', this.aiLookHeight.toString());
      }

      this.http.post('http://localhost:8000/api/look-ia', formData, { responseType: 'blob' })
        .subscribe({
          next: (response: Blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              this.aiLookImage = reader.result as string;
              this.aiCommentForCurrentImage = null; // Limpa o comentário da imagem anterior
              this.showAiLookModal = true;
              this.loadingAiLook = false;
              this.refreshingAiLook = false;
              this.retryCount = 0;
              this.cdr.detectChanges();
            };
            reader.readAsDataURL(response);
          },
          error: async (_error) => {
            if (this.retryCount < this.MAX_RETRIES) {
              this.retryCount++;
              await new Promise(resolve => setTimeout(resolve, 2000));
              await this.generateAiLookInternal();
            } else {
              this.modalService.error({
                nzTitle: 'Erro',
                nzContent: 'Ocorreu um problema na geração da imagem após 3 tentativas. Tente novamente.',
                nzOkText: 'OK'
              });
              this.loadingAiLook = false;
              this.refreshingAiLook = false;
              this.retryCount = 0;
              this.cdr.detectChanges();
            }
          }
        });
    } catch (_error) {
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.generateAiLookInternal();
      } else {
        this.modalService.error({
          nzTitle: 'Erro',
          nzContent: 'Ocorreu um problema na geração da imagem após 3 tentativas. Tente novamente.',
          nzOkText: 'OK'
        });
        this.loadingAiLook = false;
        this.refreshingAiLook = false;
        this.retryCount = 0;
        this.cdr.detectChanges();
      }
    }
  }

  closeAiLookModal() {
    this.showAiLookModal = false;
    this.aiLookImage = null;
  }

  async refreshAiLook() {
    if (!this.hasClothingItems()) {
      this.modalService.warning({
        nzTitle: 'Atenção',
        nzContent: 'É necessário adicionar pelo menos uma peça/acessório ao look antes de gerar o look com IA.',
        nzOkText: 'OK'
      });
      return;
    }

    this.refreshingAiLook = true;
    this.retryCount = 0;
    this.cdr.detectChanges();

    await this.generateAiLookInternal();
  }

  selectGender(gender: 'woman' | 'man') {
    this.aiLookGender = gender;
    localStorage.setItem('aiLookGender', gender);
    this.cdr.detectChanges();
  }

  selectSkinColor(skinColor: string) {
    this.aiLookSkinColor = skinColor;
    localStorage.setItem('aiLookSkinColor', skinColor);
    this.cdr.detectChanges();
  }

  selectWeight(weight: number) {
    this.aiLookWeight = weight;
    localStorage.setItem('aiLookWeight', weight.toString());
    this.cdr.detectChanges();
  }

  selectHeight(height: number) {
    this.aiLookHeight = height;
    localStorage.setItem('aiLookHeight', height.toString());
    this.cdr.detectChanges();
  }

  generateFromBar() {
    void this.generateAiLook();
  }

  shareHelp() {
    this.modalService.info({
      nzTitle: 'Como compartilhar',
      nzContent: 'Clique com o botão direito sobre a imagem e selecione "Copiar imagem". Depois cole diretamente no campo de conversa do aplicativo desejado (WhatsApp, Facebook, Instagram, e-mail, etc.).',
      nzOkText: 'Entendi'
    });
  }

  /**
   * Initiates AI comment request with validation and retry logic
   * Validates that an AI image exists before proceeding
   */
  async requestAiComment() {
    if (!this.aiLookImage) {
      this.modalService.warning({
        nzTitle: 'Atenção',
        nzContent: 'É necessário ter uma imagem gerada pela IA antes de solicitar um comentário.',
        nzOkText: 'OK'
      });
      return;
    }

    // Se já existe um comentário para a imagem atual, apenas mostra a modal
    if (this.aiCommentForCurrentImage) {
      this.aiComment = this.aiCommentForCurrentImage;
      this.showCommentModal = true;
      this.cdr.detectChanges();
      return;
    }

    this.loadingComment = true;
    this.commentRetryCount = 0;
    this.cdr.detectChanges();

    await this.requestAiCommentInternal();
  }

  /**
   * Internal method that handles the actual AI comment request with retry logic
   * Sends the generated AI image to the comment service
   */
  private async requestAiCommentInternal() {
    try {
      // Verificar se a imagem existe
      if (!this.aiLookImage) {
        throw new Error('Imagem não disponível');
      }

      // Converter a imagem de volta para blob
      const response = await fetch(this.aiLookImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'ai-look.png');

      this.http.post('http://localhost:8000/api/look-comment', formData, { responseType: 'text' })
        .subscribe({
          next: (response: string) => {
            this.aiComment = response;
            this.aiCommentForCurrentImage = response; // Salva o comentário para a imagem atual
            this.showCommentModal = true;
            this.loadingComment = false;
            this.commentRetryCount = 0;
            this.cdr.detectChanges();
          },
          error: async (_error) => {
            if (this.commentRetryCount < this.MAX_RETRIES) {
              this.commentRetryCount++;
              await new Promise(resolve => setTimeout(resolve, 2000));
              await this.requestAiCommentInternal();
            } else {
              this.modalService.error({
                nzTitle: 'Erro',
                nzContent: 'Ocorreu um problema ao solicitar o comentário da IA após 3 tentativas. Tente novamente.',
                nzOkText: 'OK'
              });
              this.loadingComment = false;
              this.commentRetryCount = 0;
              this.cdr.detectChanges();
            }
          }
        });
    } catch (error) {
      if (this.commentRetryCount < this.MAX_RETRIES) {
        this.commentRetryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.requestAiCommentInternal();
      } else {
        console.error('Erro ao processar imagem:', error);
        this.modalService.error({
          nzTitle: 'Erro',
          nzContent: 'Ocorreu um problema ao processar a imagem após 3 tentativas. Tente novamente.',
          nzOkText: 'OK'
        });
        this.loadingComment = false;
        this.commentRetryCount = 0;
        this.cdr.detectChanges();
      }
    }
  }

  closeCommentModal() {
    this.showCommentModal = false;
    this.aiComment = null;
  }


  addItemToGroup(groupId: number, item: { url: string, name: string }) {
    const group = this.clothingGroups.find(g => g.id === groupId);
    if (group) {
      const nextId = (Math.max(...group.items.map(i => parseInt(i.id, 10)), 0) + 1).toString();
      group.items.unshift({ id: nextId, url: item.url, name: item.name, favorited: false });
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
      this.addItemToGroup(this.currentGroup!!.id, { url: imageUrlString || "", name: "" });
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
      this.lastCroppedBlob = event!!.blob;
    }
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }




  addItem(group: ClothingGroup) {
    if (this.loadingImg) {
      alert("Aguarde, há uma imagem sendo processada.");
      return;
    }

    this.currentGroup = group;
    this.lastCroppedBlob = null;
    this.currentStep = 0;
    this.previewUrl = "";
    this.showAddImg = true;
    this.imgFromUrl = "";

  }

  downloadImageAsBlob(imageUrl: string): Observable<Blob> {
    return from(fetch(imageUrl)).pipe(
      map(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return response;
      }),
      switchMap(response => from(response.blob())), // response.blob() retorna Promise<Blob>, 'from' a converte para Observable<Blob>
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
              alert('Ocorreu um erro ao processar a imagem.');
              this.loadingImg = false;
              this.showAddImg = false;
              this.selectedFile = null;
              this.previewUrl = "";
              observer.error(err);
            }
          });


        } catch (error) {
          alert('Ocorreu um erro ao processar a imagem.');
          this.loadingImg = false;
          this.showAddImg = false;
          this.selectedFile = null;
          this.previewUrl = "";
          observer.error(error);
        }

      })
        .catch(error => {
          alert('Ocorreu um erro ao processar a imagem.');
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
      this.addItemToGroup(this.currentGroup!!.id, {url : URL.createObjectURL(this.lastCroppedBlob), name: this.currentGroup!!.name});
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


  imgLocalLoaded({ file, fileList }: NzUploadChangeParam): void {


    // const status = file.status;
    // if (status !== 'uploading') {
    //
    // }
    // if (status === 'done' && file.originFileObj) {
    //
    //   this.selectedFile = file.originFileObj;
    //   this.previewUrl = URL.createObjectURL(this.selectedFile);
    //
    //   console.log(this.selectedFile);
    //
    //  this.imageChangedEvent = {
    //     target: {
    //       files: [this.selectedFile]
    //     }
    //   };
    //   this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
    //
    //   this.nextStep();
    //   this.cdr.detectChanges();
    // } else if (status === 'error') {
    //   console.error('Erro ao carregar a imagem:', file.error);
    // }
  }
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
    if (this.isValidUrl(this.imgFromUrl)) {
      this.loadingImg = true;
      this.downloadImageAsBlob(this.imgFromUrl)
        .pipe(
          switchMap(blob => this.preProcessImg(new File([blob], 'image.png', { type: 'image/png' }))),
          catchError(error => {
            console.error('Erro ao carregar imagem da URL:', error);
            this.loadingImg = false;
            this.showErroDownImg = true;
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (processedFile) => {
            this.loadingImg = false;
            this.lastCroppedBlob = new Blob([processedFile], { type: 'image/png' });
            this.previewUrl = URL.createObjectURL(this.lastCroppedBlob);
            this.imageChangedEvent = { target: { files: [processedFile] } };
            this.nextStep();
          },
          error: (error) => {
            console.error('Erro no processamento:', error);
            this.loadingImg = false;
          }
        });
    }
  }

  // Métodos para o menu mobile
  openMobileCategoryModal(group: ClothingGroup) {
    this.currentMobileGroup = group;
    this.showMobileCategoryModal = true;
  }

  closeMobileCategoryModal() {
    this.showMobileCategoryModal = false;
    this.currentMobileGroup = null;
  }
}
