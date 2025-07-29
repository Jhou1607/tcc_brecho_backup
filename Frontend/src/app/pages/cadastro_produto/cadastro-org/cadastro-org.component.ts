import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ProdutoService} from '../../../services/product.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import {Product, ProductFormData, CategoriaSelecionada} from '../../../interfaces/interfaces';
import { CategoriaAcessoriosCabeca, CategoriaTops, CategoriaCalcasSaias, CategoriaCalcados, CategoriaAcessorios } from '../../../interfaces/categorias';
import { FormsModule } from '@angular/forms';
import { CategoriaSelectorModalComponent } from '../categoria-selector-modal.component';

@Component({
  selector: 'app-cadastro-produto-org',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule,
    NzUploadModule,
    NzCardModule,
    NzGridModule,
    CategoriaSelectorModalComponent
  ],
  templateUrl: './cadastro-org.component.html',
  styleUrls: ['./cadastro-org.component.scss']
})
export class CadastroProdutoOrgComponent implements OnInit {
  validateForm!: FormGroup;
  isSubmitting = false;
  // previewImage e previewVisible não estão sendo usados no template, podem ser removidos se não planeja usá-los.
  // previewImage: string | undefined = '';
  // previewVisible = false;
  fileList: NzUploadFile[] = [];

  opcoesEstadoConservacao = ['novo', 'seminovo', 'usado', 'com defeito', 'restaurado']; // Adicionado 'restaurado' como exemplo
  // Substituir as listas de categorias por uso dos enums centralizados
  // Exemplo de uso: Object.values(CategoriaTops)
  opcoesEstacoes = ['verao', 'outono', 'inverno', 'primavera', 'todas', 'neutra']; // Adicionado 'neutra'
  opcoesGeneros = ['masculino', 'feminino', 'unissex'];
  opcoesOcasioes = ['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia', 'casamento', 'formatura', 'viagem'];
  opcoesEstilos = ['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'];
  opcoesMateriais = ['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester'];

  grupos = [
    { label: 'Acessórios de Cabeça', value: 'acessorios_cabeca' },
    { label: 'Tops', value: 'tops' },
    { label: 'Calças/Saias', value: 'calcas_saias' },
    { label: 'Calçados', value: 'calcados' },
    { label: 'Acessórios', value: 'acessorios' },
  ];
  // Remover opcoesCategorias e grupoSelecionado
  // Remover atualizarCategoriasPorGrupo()
  // opcoesCategorias: string[] = Object.values(CategoriaTops);
  // opcoesCoresComuns não está sendo usada no template atual, pois 'cor' é um input de texto.

  categoriaModalAberto = false;
  categoriaSelecionada: CategoriaSelecionada | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private notification: NzNotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      nome_produto: [null, [Validators.required, Validators.maxLength(55)]],
      marca: [null, [Validators.maxLength(55)]],
      modelo: [null, [Validators.maxLength(55)]],
      numeracao: [null, [Validators.pattern('^[a-zA-Z0-9_/-]+$')]],
      preco: [null, [Validators.required, Validators.min(0)]],
      estado_conservacao: [null],
      categoria: [null],
      estacao: [null],
      genero: [null],
      cor: [null, [Validators.maxLength(55)]],
      imagem_principal: [null],
      ocasioes: [null],
      estilos: [null],
      material: [null]
    });
    // this.opcoesCategorias = []; // Removido
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isJpgOrPngOrGifOrWebp = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp';
    if (!isJpgOrPngOrGifOrWebp) {
      this.notification.error('Erro de Upload', 'Você só pode fazer upload de arquivos JPG, PNG, GIF ou WEBP!');
      return false;
    }
    const isLt2M = (file.size || 0) / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.notification.error('Erro de Upload', 'A imagem deve ser menor que 2MB!');
      return false;
    }
    // Converter para File real se possível
    const realFile = file as any as File;
    this.fileList = [file];
    this.validateForm.patchValue({ imagem_principal: realFile });
    this.cdr.detectChanges();
    return false;
  }

  handleRemove = (eventData: any): boolean => { // Mudado para any para depuração
    console.log('Conteúdo do $event em handleRemove:', eventData); // Loga o que foi recebido

    // Tenta usar como NzUploadFile, mas com cuidado
    if (eventData && typeof eventData === 'object' && 'uid' in eventData) {
      const file = eventData as NzUploadFile; // Faz um cast seguro após verificar
      this.fileList = this.fileList.filter(f => f.uid !== file.uid);
      this.validateForm.patchValue({ imagem_principal: null });
      return true;
    } else {
      console.warn('handleRemove recebeu um evento inesperado ou não é NzUploadFile.');

      const fileToRemove = this.fileList.find(f => f.name === (eventData as any)?.target?.files?.[0]?.name); // Exemplo de tentativa de achar o arquivo
      if(fileToRemove) {
        this.fileList = this.fileList.filter(f => f.uid !== fileToRemove.uid);
        this.validateForm.patchValue({ imagem_principal: null });
      }
      return true;
    }
  }

  // Remover atualizarCategoriasPorGrupo()

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

  submitForm(): void {
    // Marca todos os campos como 'dirty' para mostrar erros de validação se existirem
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });

    if (this.validateForm.valid) {
      this.isSubmitting = true;
      const formValue = this.validateForm.value;

      const productDataPayload: ProductFormData = {
        nome_produto: formValue.nome_produto,
        preco: formValue.preco,
        marca: formValue.marca || undefined,
        modelo: formValue.modelo || undefined,
        estado_conservacao: formValue.estado_conservacao || undefined,
        estacao: formValue.estacao || undefined,
        categoria: formValue.categoria || undefined,
        genero: formValue.genero || undefined,
        cor: formValue.cor || undefined,
        numeracao: formValue.numeracao || undefined,
        imagem_principal: this.fileList.length > 0 ? (this.fileList[0] as any as File) : null,
        ocasioes: Array.isArray(formValue.ocasioes) ? formValue.ocasioes : [],
        estilos: Array.isArray(formValue.estilos) ? formValue.estilos : [],
        material: formValue.material || null
      };

      this.produtoService.createProduto(productDataPayload).subscribe({
        next: (produtoCriado: Product) => { // Tipado produtoCriado
          this.isSubmitting = false;
          this.notification.create(
            'success',
            'Sucesso!',
            `Produto "${produtoCriado.nome_produto}" cadastrado com sucesso.`
          );
          this.validateForm.reset();
          this.fileList = [];
          this.cdr.detectChanges();
          // Opcional: this.router.navigate(['/catalogo']); ou para a página do produto
        },
        error: (err: HttpErrorResponse | Error | any) => { // Tipado err
          this.isSubmitting = false;
          console.error("Erro ao cadastrar produto:", err);
          let errorMessage = 'Ocorreu um erro ao cadastrar o produto.';
          if (err instanceof HttpErrorResponse && err.error && err.error.errors) {
            errorMessage = "Por favor, corrija os seguintes erros: \n";
            for (const key in err.error.errors) {
              if (err.error.errors.hasOwnProperty(key)) {
                errorMessage += `${err.error.errors[key].join(', ')}\n`;
              }
            }
          } else if (err && err.message) {
            errorMessage = err.message;
          }
          this.notification.create(
            'error',
            'Erro no Cadastro',
            errorMessage.trim() // Remove espaços extras no final
          );
        }
      });
    } else {
      this.notification.create(
        'warning',
        'Atenção',
        'Por favor, preencha todos os campos obrigatórios corretamente.'
      );
    }
  }
}
