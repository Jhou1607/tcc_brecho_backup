import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProdutoService } from '../../../services/product.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import {UserProductFormData, CategoriaSelecionada} from '../../../interfaces/interfaces';
import { CategoriaAcessoriosCabeca, CategoriaTops, CategoriaCalcasSaias, CategoriaCalcados, CategoriaAcessorios } from '../../../interfaces/categorias';
import { CategoriaSelectorModalComponent } from '../categoria-selector-modal.component';

@Component({
  selector: 'app-cadastro-usr',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzUploadModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    CategoriaSelectorModalComponent
  ],
  templateUrl: './cadastro-usr.component.html',
  styleUrls: ['./cadastro-usr.component.scss']
})
export class CadastroUsrComponent implements OnInit {
  validateForm!: FormGroup;
  isSubmitting = false;
  fileList: NzUploadFile[] = [];

  opcoesOcasioes = ['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia', 'casamento', 'formatura', 'viagem'];
  opcoesEstilos = ['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'];
  opcoesMateriais = ['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester'];
  opcoesEstacoes = ['verao', 'outono', 'inverno', 'primavera', 'todas', 'neutra'];

  categoriaModalAberto = false;
  categoriaSelecionada: CategoriaSelecionada | null = null;

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
      categoria: [null],
      estacao: [null],
      cor: [null, [Validators.maxLength(55)]],
      imagem_principal: [null, [Validators.required]],
      ocasioes: [null],
      estilos: [null],
      material: [null]
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isJpgOrPngOrGifOrWebp = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type || '');
    if (!isJpgOrPngOrGifOrWebp) {
      this.notification.error('Erro de Upload', 'Você só pode fazer upload de arquivos JPG, PNG, GIF ou WEBP!');
      return false;
    }
    const isLt2M = (file.size || 0) / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.notification.error('Erro de Upload', 'A imagem deve ser menor que 2MB!');
      return false;
    }

    this.fileList = [file];
    this.validateForm.patchValue({ imagem_principal: file });
    this.cdr.detectChanges();
    return false;
  }

  handleRemove = (file: any): boolean => {
    this.fileList = this.fileList.filter(f => f.uid !== file.uid);
    this.validateForm.patchValue({ imagem_principal: null });
    return true;
  }

  submitForm(): void {
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });

    if (this.validateForm.valid) {
      this.isSubmitting = true;
      const formValue = this.validateForm.value;

      const productDataPayload: UserProductFormData = {
        nome_produto: formValue.nome_produto,
        marca: formValue.marca || undefined,
        categoria: formValue.categoria || undefined,
        estacao: formValue.estacao || undefined,
        cor: formValue.cor || undefined,
        imagem_principal: this.fileList[0] as any as File,
        ocasioes: Array.isArray(formValue.ocasioes) ? formValue.ocasioes : [],
        estilos: Array.isArray(formValue.estilos) ? formValue.estilos : [],
        material: formValue.material || null
      };

      this.produtoService.createProdutoUsuario(productDataPayload).subscribe({
        next: (produtoCriado) => {
          this.isSubmitting = false;
          this.notification.create(
            'success',
            'Sucesso!',
            `Peça "${produtoCriado.nome_produto}" cadastrada com sucesso.`
          );
          this.validateForm.reset();
          this.fileList = [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error("Erro ao cadastrar peça:", err);
          let errorMessage = err?.error?.message || 'Ocorreu um erro ao cadastrar a peça.';
          this.notification.create('error', 'Erro no Cadastro', errorMessage);
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
