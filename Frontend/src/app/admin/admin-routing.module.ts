import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { FilterManagerComponent } from './components/filter-manager/filter-manager.component';
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { } 