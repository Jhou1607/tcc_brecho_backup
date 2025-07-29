import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { FilterManagerComponent } from './components/filter-manager/filter-manager.component';
import { AdminService } from './services/admin.service';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos', component: ProductListComponent },
      { path: 'produtos/novo', component: ProductFormComponent },
      { path: 'produtos/editar/:id', component: ProductFormComponent },
      { path: 'usuarios', component: UserListComponent },
      { path: 'filtros', component: FilterManagerComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    ProductListComponent,
    ProductFormComponent,
    UserListComponent,
    FilterManagerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [AdminService, AdminGuard]
})
export class AdminModule { } 