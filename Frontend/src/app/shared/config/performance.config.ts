export const PERFORMANCE_CONFIG = {
  // Configurações de imagem
  IMAGE: {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 600,
    QUALITY: 0.8,
    LAZY_LOAD_THRESHOLD: 100, // pixels antes de entrar na viewport
  },
  
  // Configurações de cache
  CACHE: {
    IMAGE_CACHE_SIZE: 50, // número máximo de imagens em cache
    API_CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  },
  
  // Configurações de animação
  ANIMATION: {
    DURATION: 300, // ms
    EASING: 'ease-out',
    REDUCE_MOTION: false, // respeitar preferência do usuário
  },
  
  // Configurações de debounce
  DEBOUNCE: {
    SEARCH: 300, // ms
    SCROLL: 16, // ms (60fps)
    RESIZE: 250, // ms
  },
  
  // Configurações de virtualização
  VIRTUALIZATION: {
    ITEM_HEIGHT: 80, // altura estimada de cada item
    BUFFER_SIZE: 5, // número de itens extras para renderizar
  }
};

// Detectar preferências do usuário
export const USER_PREFERENCES = {
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isSlowConnection: (navigator as any).connection?.effectiveType === 'slow-2g' || 
                   (navigator as any).connection?.effectiveType === '2g',
  isMobile: window.innerWidth <= 768,
};

// Aplicar otimizações baseadas nas preferências
export function applyPerformanceOptimizations(): void {
  if (USER_PREFERENCES.prefersReducedMotion) {
    PERFORMANCE_CONFIG.ANIMATION.DURATION = 0;
    PERFORMANCE_CONFIG.ANIMATION.REDUCE_MOTION = true;
  }
  
  if (USER_PREFERENCES.isSlowConnection) {
    PERFORMANCE_CONFIG.IMAGE.QUALITY = 0.6;
    PERFORMANCE_CONFIG.IMAGE.MAX_WIDTH = 600;
    PERFORMANCE_CONFIG.IMAGE.MAX_HEIGHT = 400;
  }
} 