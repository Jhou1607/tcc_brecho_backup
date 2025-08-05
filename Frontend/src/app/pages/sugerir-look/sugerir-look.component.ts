import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as fabric from 'fabric';
import { ProdutoService } from '../../services/product.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SelecionarPecaModalComponent } from './selecionar-peca-modal.component';

interface Peca {
  id: number;
  nome: string;
  image_url: string;
  origem: 'usuario' | 'loja';
  categoria: string;
  tipo?: string;
  ocasioes?: string[];
  estilos?: string[];
  estacao?: string;
  cor?: string;
  material?: string;
}

@Component({
  selector: 'app-sugerir-look',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    SelecionarPecaModalComponent
  ],
  templateUrl: './sugerir-look.component.html',
  styleUrls: ['./sugerir-look.component.scss']
})
export class SugerirLookComponent implements AfterViewInit {
  modalAberto = false;
  pecaBaseSelecionada: Peca | null = null;
  sugestaoAtual: Peca[] = [];
  sugestaoIndex = 0;
  mensagemErroSugestao: string | null = null;

  pecasUsuario: Peca[] = [];
  pecasLoja: Peca[] = [];

  filtroOrigem: 'tudo' | 'usuario' | 'loja' = 'tudo';

  @ViewChild('canvasSugerirLook', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: fabric.Canvas;

  // Variáveis para salvar look
  showNomeLookModal = false;
  nomeLook = '';
  lookParaSalvar: any = null;

  private positions = [
    { left: 217, top: 35, width: 60, height: 60 }, // Acessórios de Cabeça
    { left: 160, top: 100, width: 175, height: 180 }, // Tops
    { left: 185, top: 280, width: 120, height: 180 }, // Calças e Saias
    { left: 187, top: 430, width: 115, height: 115 }, // Calçados
    { left: 310, top: 205, width: 85, height: 85 }, // Acessórios
  ];

  constructor(
    private produtoService: ProdutoService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    console.log('=== INICIALIZANDO COMPONENTE ===');
    if (!this.canvasElement) {
      console.error('❌ Canvas element não encontrado!');
      return;
    }
    setTimeout(() => {
      this.inicializarCanvas();
    }, 100);
  }

  private inicializarCanvas() {
    if (!this.canvasElement) {
      console.error('❌ Canvas element não encontrado!');
      return;
    }
    try {
      this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
        width: 500,
        height: 650,
      });
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = 'blue';
      fabric.Object.prototype.cornerStyle = 'circle';
      this.canvas.on('mouse:down', (event: any) => {
        const target = event.target;
        if (target instanceof fabric.FabricImage) {
          this.canvas.bringObjectToFront(target);
          this.canvas.renderAll();
        }
      });
      this.canvas.on('object:modified', () => {
        // Trigger look update if needed
      });
      console.log('✅ Canvas inicializado com sucesso');
      this.criarEstruturaInicial();
    } catch (error: any) {
      console.error('❌ Erro ao inicializar canvas:', error);
    }
  }

  private criarEstruturaInicial() {
    if (!this.canvas) {
      console.error('❌ Canvas não disponível para criar estrutura inicial');
      return;
    }
    const labels = [
      { text: 'Acessório de Cabeça', pos: 0 },
      { text: 'Top', pos: 1 },
      { text: 'Calça/Saia', pos: 2 },
      { text: 'Calçado', pos: 3 },
      { text: 'Acessório', pos: 4 }
    ];
    labels.forEach(label => {
      const pos = this.positions[label.pos];
      const rect = new fabric.Rect({
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        fill: 'rgba(255, 255, 255, 0.3)',
        stroke: '#ddd',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });
      const text = new fabric.Text(label.text, {
        left: pos.left + pos.width / 2,
        top: pos.top + pos.height / 2,
        fontSize: 12,
        fill: '#666',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      this.canvas.add(rect, text);
    });
    this.canvas.renderAll();
    console.log('✅ Estrutura inicial criada');
  }

  // Métodos para salvar e baixar look (copiados do montador-look)
  salvarLook() {
    if (!this.pecaBaseSelecionada || this.sugestaoAtual.length === 0) {
      this.notification.warning('Atenção', 'Não há look para salvar');
      return;
    }

    // Capturar o canvas como imagem
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    // Criar configuração do look
    const lookConfig = this.getLookConfig();

    // Abrir modal para nomear o look
    this.showNomeLookModal = true;
    this.lookParaSalvar = {
      imagem: dataURL,
      config: lookConfig,
      nome: this.nomeLook || `Look #${Date.now()}`
    };
  }

  baixarLook() {
    if (!this.pecaBaseSelecionada || this.sugestaoAtual.length === 0) {
      this.notification.warning('Atenção', 'Não há look para baixar');
      return;
    }

    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = `look_${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }

  private getLookConfig(): any {
    const config: any = {};
    const tipoParaPos: { [key: string]: number } = {
      'acessorio_cabeca': 0,
      'top': 1,
      'calca_saia': 2,
      'calcado': 3,
      'acessorio': 4
    };

    // Adicionar peça base
    if (this.pecaBaseSelecionada) {
      const tipoBase = this.categoriaParaTipo(this.pecaBaseSelecionada.categoria);
      const posBase = tipoParaPos[tipoBase];
      if (posBase !== undefined) {
        const pos = this.positions[posBase];
        config[this.getTipoLabel(posBase)] = {
          items: [{
            itemId: this.pecaBaseSelecionada.id,
            left: pos.left,
            top: pos.top,
            scaleX: 1,
            scaleY: 1,
            zIndex: 0
          }]
        };
      }
    }

    // Adicionar sugestões
    this.sugestaoAtual.forEach((peca, index) => {
      const tipo = this.categoriaParaTipo(peca.categoria);
      const pos = tipoParaPos[tipo];
      if (pos !== undefined) {
        const posObj = this.positions[pos];
        const label = this.getTipoLabel(pos);
        if (!config[label]) {
          config[label] = { items: [] };
        }
        config[label].items.push({
          itemId: peca.id,
          left: posObj.left,
          top: posObj.top,
          scaleX: 1,
          scaleY: 1,
          zIndex: index + 1
        });
      }
    });

    return config;
  }

  confirmarNomeLook() {
    if (this.lookParaSalvar) {
      const nomeLook = this.nomeLook || `Look #${Date.now()}`;
      
      this.produtoService.saveLook(nomeLook, this.lookParaSalvar.config, this.lookParaSalvar.imagem).subscribe({
        next: (res) => {
          this.notification.success('Sucesso', res.message || 'Look salvo com sucesso!');
          this.cancelarNomeLook();
          this.router.navigate(['/meus-looks']);
        },
        error: (err) => {
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

  // Métodos auxiliares
  private categoriaParaTipo(categoria: string): string {
    const mapeamento: { [key: string]: string } = {
      'chapeu': 'acessorio_cabeca', 'tiara': 'acessorio_cabeca', 'bone': 'acessorio_cabeca', 'lenco': 'acessorio_cabeca',
      'camiseta': 'top', 'camisa': 'top', 'blusa': 'top', 'jaqueta': 'top', 'casaco': 'top', 'sueter': 'top', 'regata': 'top', 'colete': 'top',
      'calca': 'calca_saia', 'saia': 'calca_saia', 'short': 'calca_saia', 'legging': 'calca_saia', 'bermuda': 'calca_saia', 'jardineira': 'calca_saia',
      'tenis': 'calcado', 'sandalia': 'calcado', 'bota': 'calcado', 'sapato': 'calcado', 'chinelo': 'calcado',
      'cinto': 'acessorio', 'oculos': 'acessorio', 'bolsa': 'acessorio', 'relogio': 'acessorio', 'brinco': 'acessorio', 'colar': 'acessorio', 'pulseira': 'acessorio', 'anel': 'acessorio'
    };
    return mapeamento[categoria.toLowerCase()] || 'acessorio';
  }

  private getTiposComplementares(tipoBase: string): string[] {
    const complementares: { [key: string]: string[] } = {
      'top': ['acessorio_cabeca', 'calca_saia', 'calcado', 'acessorio'],
      'calca_saia': ['acessorio_cabeca', 'top', 'calcado', 'acessorio'],
      'calcado': ['acessorio_cabeca', 'top', 'calca_saia', 'acessorio'],
      'acessorio_cabeca': ['top', 'calca_saia', 'calcado', 'acessorio'],
      'acessorio': ['acessorio_cabeca', 'top', 'calca_saia', 'calcado']
    };
    return complementares[tipoBase] || ['top', 'calca_saia', 'calcado', 'acessorio'];
  }

  setFiltroOrigem(origem: 'tudo' | 'usuario' | 'loja') {
    this.filtroOrigem = origem;
    if (this.pecaBaseSelecionada) {
      this.sugestaoIndex = 0;
      this.gerarSugestaoLook();
    }
  }

  abrirPopupSelecaoPeca() {
    this.modalAberto = true;
  }

  fecharPopupSelecaoPeca() {
    this.modalAberto = false;
  }

  setPecasUsuario(pecas: Peca[]) {
    this.pecasUsuario = pecas;
  }

  setPecasLoja(pecas: Peca[]) {
    this.pecasLoja = pecas;
    // Se já há uma peça base selecionada e o filtro é 'loja', regenerar sugestão imediatamente
    if (this.pecaBaseSelecionada && this.filtroOrigem === 'loja') {
      this.gerarSugestaoLook();
    }
  }

  onSelecionarPeca(peca: Peca) {
    console.log('=== PEÇA SELECIONADA ===');
    this.pecaBaseSelecionada = peca;
    this.sugestaoIndex = 0;
    this.fecharPopupSelecaoPeca();
    setTimeout(() => {
      this.gerarSugestaoLook();
    }, 100);
  }

  private gerarSugestaoLook() {
    if (!this.pecaBaseSelecionada) return;

    console.log('=== GERANDO SUGESTÃO DE LOOK ===');
    console.log('Peça base:', this.pecaBaseSelecionada);
    console.log('Filtro origem:', this.filtroOrigem);
    console.log('Pecas usuário:', this.pecasUsuario.length);
    console.log('Pecas loja:', this.pecasLoja.length);

    const tipoBase = this.categoriaParaTipo(this.pecaBaseSelecionada.categoria);
    const tiposComplementares = this.getTiposComplementares(tipoBase);

    console.log('Tipo base:', tipoBase);
    console.log('Tipos complementares:', tiposComplementares);

    const todasPecas = [...this.pecasUsuario, ...this.pecasLoja];
    let pecasFiltradas = todasPecas;

    if (this.filtroOrigem === 'usuario') {
      pecasFiltradas = this.pecasUsuario;
    } else if (this.filtroOrigem === 'loja') {
      pecasFiltradas = this.pecasLoja;
    }

    console.log('Pecas filtradas:', pecasFiltradas.length);
    console.log('Categorias disponíveis:', [...new Set(pecasFiltradas.map(p => p.categoria))]);

    const sugestao: Peca[] = [];

    tiposComplementares.forEach((tipo, index) => {
      const candidatas = pecasFiltradas.filter(p => {
        const tipoPeca = this.categoriaParaTipo(p.categoria);
        return tipoPeca === tipo && p.id !== this.pecaBaseSelecionada!.id;
      });

      console.log(`Candidatas para ${tipo}:`, candidatas.length);
      console.log(`Categorias para ${tipo}:`, candidatas.map(p => p.categoria));

      if (candidatas.length > 0) {
        const indiceEscolhido = (this.sugestaoIndex + index) % candidatas.length;
        const escolhida = candidatas[indiceEscolhido];
        sugestao.push(escolhida);
      }
    });

    console.log('Sugestão gerada:', sugestao.length, 'de', tiposComplementares.length);

    // Permitir sugestões parciais se pelo menos 2 tipos estiverem disponíveis
    if (sugestao.length >= 2) {
      this.sugestaoAtual = sugestao;
      this.mensagemErroSugestao = null;
      this.renderCanvasLook();
    } else {
      this.sugestaoAtual = [];
      const origemTexto = this.filtroOrigem === 'tudo' ? 'armário e catálogo' : 
                         this.filtroOrigem === 'usuario' ? 'armário' : 'catálogo da loja';
      this.mensagemErroSugestao = `Itens insuficientes no ${origemTexto} para montar sugestão (mínimo 2 tipos complementares)`;
      console.log('Erro de sugestão:', this.mensagemErroSugestao);
    }
  }

  trocarSugestao() {
    this.sugestaoIndex++;
    this.sugestaoAtual = [];
    this.mensagemErroSugestao = null;
    this.gerarSugestaoLook();
  }

  trocarSugestaoIndividual(index: number) {
    if (!this.pecaBaseSelecionada) return;

    const tipoBase = this.categoriaParaTipo(this.pecaBaseSelecionada.categoria);
    const tiposComplementares = this.getTiposComplementares(tipoBase);
    const tipoParaTrocar = tiposComplementares[index];

    const todasPecas = [...this.pecasUsuario, ...this.pecasLoja];
    let pecasFiltradas = todasPecas;

    if (this.filtroOrigem === 'usuario') {
      pecasFiltradas = this.pecasUsuario;
    } else if (this.filtroOrigem === 'loja') {
      pecasFiltradas = this.pecasLoja;
    }

    const candidatas = pecasFiltradas.filter(p => {
      const tipoPeca = this.categoriaParaTipo(p.categoria);
      return tipoPeca === tipoParaTrocar && 
             p.id !== this.pecaBaseSelecionada!.id &&
             !this.sugestaoAtual.some(s => s.id === p.id);
    });

    if (candidatas.length > 0) {
      const novaPeca = candidatas[Math.floor(Math.random() * candidatas.length)];
      this.sugestaoAtual[index] = novaPeca;
      this.renderCanvasLook();
    }
  }

  getTipoLabel(index: number): string {
    if (!this.pecaBaseSelecionada) {
      const labels = ['Acessório de Cabeça', 'Top', 'Calça/Saia', 'Calçado', 'Acessório'];
      return labels[index] || 'Item';
    }

    const tipoBase = this.categoriaParaTipo(this.pecaBaseSelecionada.categoria);
    const tiposComplementares = this.getTiposComplementares(tipoBase);
    
    if (index < tiposComplementares.length) {
      const tipo = tiposComplementares[index];
      const mapeamentoLabels: { [key: string]: string } = {
        'acessorio_cabeca': 'Acessório de Cabeça',
        'top': 'Top',
        'calca_saia': 'Calça/Saia',
        'calcado': 'Calçado',
        'acessorio': 'Acessório'
      };
      return mapeamentoLabels[tipo] || 'Item';
    }
    
    return 'Item';
  }

  private renderCanvasLook() {
    if (!this.canvas) {
      this.inicializarCanvas();
      if (!this.canvas) return;
    }

    this.canvas.clear();

    if (!this.pecaBaseSelecionada) {
      this.criarEstruturaInicial();
      return;
    }

    const tipoParaPos: { [key: string]: number } = {
      'acessorio_cabeca': 0,
      'top': 1,
      'calca_saia': 2,
      'calcado': 3,
      'acessorio': 4
    };

    // Adicionar peça base
    const tipoBase = this.categoriaParaTipo(this.pecaBaseSelecionada.categoria);
    const posBase = tipoParaPos[tipoBase];
    if (posBase !== undefined) {
      this.addPecaToCanvas(this.pecaBaseSelecionada, posBase);
    }

    // Adicionar sugestões
    this.sugestaoAtual.forEach((peca, index) => {
      const tipo = this.categoriaParaTipo(peca.categoria);
      const pos = tipoParaPos[tipo];
      if (pos !== undefined) {
        this.addPecaToCanvas(peca, pos);
      }
    });

    this.canvas.renderAll();
  }

  private addPecaToCanvas(peca: Peca, posIndex: number) {
    if (!this.canvas || !peca.image_url) return;

    const pos = this.positions[posIndex];

    fabric.FabricImage.fromURL(peca.image_url, { crossOrigin: 'anonymous' }).then((image) => {
      image.set({
        left: pos.left,
        top: pos.top,
        selectable: true,
        hasControls: true,
        itemId: peca.id,
      });

      image.scaleToWidth(pos.width);
      this.canvas.add(image);
      this.canvas.renderAll();
    });
  }
} 