import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, AdminProduct } from '../../services/admin.service';
import { ProdutoService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;

  // Opções para os selects
  categorias: string[] = [];
  cores: string[] = [];
  generos: string[] = ['masculino', 'feminino', 'unissex'];
  marcas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      nome_produto: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0)]],
      marca: ['', Validators.required],
      cor: ['', Validators.required],
      genero: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.checkEditMode();
  }

  loadFilterOptions(): void {
    this.produtoService.getFiltrosDisponiveis().subscribe({
      next: (filtros) => {
        this.categorias = filtros.categorias || [];
        this.cores = filtros.cores || [];
        this.marcas = filtros.marcas || [];
      },
      error: (error) => {
        console.error('Erro ao carregar filtros:', error);
      }
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.adminService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      const productData = this.productForm.value;

      const request = this.isEditMode && this.productId
        ? this.adminService.updateProduct(this.productId, productData)
        : this.adminService.createProduct(productData);

      request.subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/admin/produtos']);
        },
        error: (error) => {
          console.error('Erro ao salvar produto:', error);
          this.submitting = false;
          alert('Erro ao salvar produto');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/produtos']);
  }
} 