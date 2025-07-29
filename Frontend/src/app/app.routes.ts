import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SobreNosComponent } from './pages/sobre-nos/sobre-nos.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { PesquisaComponent } from './pages/pesquisa/pesquisa.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ArmarioComponent } from './pages/armario/armario.component';
import { VistaMeComponent } from './pages/vista-me/vista-me.component';
import { MeusLooksComponent } from './pages/meus-looks/meus-looks.component'; // Importe o novo componente


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'sobre-nos', component: SobreNosComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'pesquisa', component: PesquisaComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'armario', component: ArmarioComponent },
  { path: 'vista-me', component: VistaMeComponent },
  { path: 'meus-looks', component: MeusLooksComponent },
  {
    path: 'sugerir-look',
    loadComponent: () => import('./pages/sugerir-look/sugerir-look.component').then(m => m.SugerirLookComponent)
  },
  {
    path: 'montador-look',
    loadComponent: () => import('./pages/montador-look/montador-look.component').then(m => m.MontadorLookComponent)
  },
  {
    path: 'telaproduto/:id',
    loadComponent: () => import('./pages/telaproduto/telaproduto.component').then(m => m.TelaprodutoComponent),
    data: { pageMode: 'catalogo' }
  },
  {
    path: 'peca-usuario/:id',
    loadComponent: () => import('./pages/telaproduto/telaproduto.component').then(m => m.TelaprodutoComponent),
    data: { pageMode: 'armario' }
  },
  {
    path: 'admin/produtos/cadastro-org',
    loadComponent: () => import('./pages/cadastro_produto/cadastro-org/cadastro-org.component').then(m => m.CadastroProdutoOrgComponent)
  },
  {
    path: 'usuario/produtos/cadastro-usr',
    loadComponent: () => import('./pages/cadastro_produto/cadastro-usr/cadastro-usr.component').then(m => m.CadastroUsrComponent)
  },

  { path: '**', redirectTo: '/catalogo' } 
];
