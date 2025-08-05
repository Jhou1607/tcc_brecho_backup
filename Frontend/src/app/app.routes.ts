  import { Routes } from '@angular/router';
  import { AuthGuard, AdminGuard } from './auth.guard';

  // Admin Components
  import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';
  import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
  import { ProdutosComponent } from './admin/pages/produtos/produtos.component';
  import { FiltrosComponent } from './admin/pages/filtros/filtros.component';
  import { UsuariosComponent } from './admin/pages/usuarios/usuarios.component';

  export const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  
  // Páginas públicas
  { 
    path: 'catalogo', 
    loadComponent: () => import('./pages/catalogo/catalogo.component').then(m => m.CatalogoComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'recuperar-senha', 
    loadComponent: () => import('./pages/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
  },
  { 
    path: 'reset-password', 
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  { 
    path: 'cadastro', 
    loadComponent: () => import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  { 
    path: 'sobre-nos', 
    loadComponent: () => import('./pages/sobre-nos/sobre-nos.component').then(m => m.SobreNosComponent)
  },
  { 
    path: 'pesquisa', 
    loadComponent: () => import('./pages/pesquisa/pesquisa.component').then(m => m.PesquisaComponent)
  },
  { 
    path: 'produto/:id', 
    loadComponent: () => import('./pages/telaproduto/telaproduto.component').then(m => m.TelaprodutoComponent)
  },
  { 
    path: 'debug', 
    loadComponent: () => import('./pages/debug/debug.component').then(m => m.DebugComponent)
  },

  // Páginas autenticadas
  { 
    path: 'perfil', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  { 
    path: 'favoritos', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/favoritos/favoritos.component').then(m => m.FavoritosComponent)
  },
  { 
    path: 'montador-look', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/montador-look/montador-look.component').then(m => m.MontadorLookComponent)
  },
  { 
    path: 'meus-looks', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/meus-looks/meus-looks.component').then(m => m.MeusLooksComponent)
  },
  { 
    path: 'armario', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/armario/armario.component').then(m => m.ArmarioComponent)
  },
  { 
    path: 'vista-me', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/vista-me/vista-me.component').then(m => m.VistaMeComponent)
  },
  { 
    path: 'sugerir-look', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/sugerir-look/sugerir-look.component').then(m => m.SugerirLookComponent)
  },
  { 
    path: 'usuario/produtos/cadastro-usr', 
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/cadastro_produto/cadastro-usr/cadastro-usr.component').then(m => m.CadastroUsrComponent)
  },

  // Admin routes
  { 
    path: 'admin', 
    canActivate: [AdminGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'filtros', component: FiltrosComponent },
      { path: 'usuarios', component: UsuariosComponent }
    ]
  },

  // Wildcard - redireciona para catálogo se a rota não existir
  { path: '**', redirectTo: '/catalogo' }
];
