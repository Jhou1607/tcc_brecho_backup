import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AdminProduct } from '../../services/admin.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  
  products: AdminProduct[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.adminService.getAdminProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading = false;
      }
    });
  }

  get filteredProducts(): AdminProduct[] {
    if (!this.searchTerm) {
      return this.products;
    }
    
    return this.products.filter(product =>
      product.nome_produto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editProduct(product: AdminProduct): void {
    this.router.navigate(['/admin/produtos/editar', product.id]);
  }

  deleteProduct(product: AdminProduct): void {
    if (confirm(`Tem certeza que deseja excluir o produto "${product.nome_produto}"?`)) {
      this.adminService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Erro ao excluir produto:', error);
          alert('Erro ao excluir produto');
        }
      });
    }
  }

  addNewProduct(): void {
    this.router.navigate(['/admin/produtos/novo']);
  }
} 