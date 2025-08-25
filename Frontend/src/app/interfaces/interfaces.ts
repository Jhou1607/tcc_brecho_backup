// src/app/shared/interfaces.ts (ou outro caminho de sua preferência)

import * as fabric from 'fabric';

export interface ClothingItem {
  id: string;
  name: string;
  favorited?: boolean;
  thumbnailUrl: string | null;
  canvasUrl: string | null;
  origem?: string;
}

export interface Look {
  id: number;
  usuario_id: number;
  nome_look: string | null;
  configuracao: LookConfig;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClothingGroup {
  id: number;
  name: string;
  icon: string;
  items: ClothingItem[];
  placeholder: fabric.Rect | fabric.FabricImage | null;
  ordem: number;

}

export interface LookConfig {
  [groupName: string]: {
    items: {
      itemId: string;
      left: number;
      top: number;
      scaleX: number;
      scaleY: number;
      zIndex: number;
    }[];
  };
}

export interface ApiClothingItem {
  id: string;
  name: string;
  favorited: boolean;
  thumbnailUrl: string | null;
  canvasUrl: string | null;
}

export interface ApiClothingGroup {
  id: number;
  name: string;
  icon: string;
  items: ApiClothingItem[];
  placeholder: null;
  ordem: number;
}

export interface ProductImage {
  id_imagem?: number;
  id?: number;
  url: string;
  is_principal?: boolean;
}

export interface UserProductFormData {
  nome_produto: string;
  marca?: string;
  categoria: string;
  estacao: string;
  cor?: string;
  ocasioes: string[];
  estilos: string[];
  material: string;
  descricao?: string;
  imagem_principal: File;
}

export interface Product {
  id: number;
  nome_produto: string;
  preco: number;
  marca?: string;
  estado_conservacao?: string;
  estacao?: string;
  categoria?: string;
  genero?: string;
  cor?: string;
  numeracao?: string | number;
  images: ProductImage[];
  image_url?: string; // Added for the new backend structure
  created_at?: string;
  updated_at?: string;
  is_favorited?: boolean;
  ocasioes?: string[];
  estilos?: string[];
  material?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
  first_page_url?: string;
  from?: number;
  last_page_url?: string;
  next_page_url?: string | null;
  path?: string;
  prev_page_url?: string | null;
  to?: number;
}

export interface ProductFormData {
  nome_produto: string;
  preco: number;
  marca?: string;
  estado_conservacao?: string;
  estacao?: string;
  categoria?: string;
  genero?: string;
  cor?: string;
  numeracao?: string | number;
  imagem_principal?: File | null;
  imagens_adicionais?: File[];
  ocasioes?: string[];
  estilos?: string[];
  material?: string;
}

export interface User {
  id: number;
  nome_usuario: string;
  email: string;
  sexo: string;
  data_nascimento: string;
  foto_url?: string | null;
  bio?: string | null;
  role?: string; // 'user' ou 'admin'
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileUpdateData {
  nome_usuario?: string;
  email?: string;
  data_nascimento?: string;
  sexo?: string;
  bio?: string | null;
}

export interface RegisterUserData {
  nome_usuario: string;
  email: string;
  password: string;
  password_confirmation: string;
  data_nascimento: string;
  sexo: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user?: User;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface CategoriaSelecionada {
  grupo: string; // Ex: 'Tops', 'Calças/Saias', etc
  categoria: string; // Ex: 'Camisa', 'Saia', etc
}

export interface Peca {
  id: number;
  nome: string;
  marca?: string;
  categoria: string;
  cor: string;
  material?: string;
  estacao?: string;
  ocasioes?: string[];
  estilos?: string[];
  image_url?: string; // Changed from imagem to image_url
  origem?: 'usuario' | 'loja';
}
