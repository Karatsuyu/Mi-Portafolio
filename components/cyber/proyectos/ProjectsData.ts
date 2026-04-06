// ============================================================
//  PROYECTOS — edita este archivo con tus proyectos reales
//  Cada proyecto tiene: id, título, descripción, stack, links,
//  categoría, año y un color accent único
// ============================================================

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  stack: string[];
  category: 'web' | 'mobile' | 'backend' | 'fullstack' | '3d' | 'ai';
  year: string;
  accent: string;         // color principal de la card
  accentSecondary: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  metrics?: { label: string; value: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: 'portfolio-multistyle',
    title: 'Portfolio Multi-Style',
    subtitle: 'Next.js · 4 temas visuales',
    description: 'Hoja de vida interactiva con 4 estilos radicalmente diferentes: Space, Classic, Runic y Cyber. Cada tema es una experiencia visual completa.',
    longDescription: 'Proyecto arquitectado con Next.js 13 App Router, TypeScript estricto y Tailwind. Cada tema tiene su propio sistema de diseño, animaciones y comportamiento. Backend con Supabase para contacto, proyectos y tracking de visitas. La variante Cyber usa Three.js + React Three Fiber para escenas 3D interactivas.',
    stack: ['Next.js 13', 'TypeScript', 'Three.js', 'Framer Motion', 'Supabase', 'Tailwind'],
    category: 'fullstack',
    year: '2024',
    accent: '#00f5ff',
    accentSecondary: '#00ff88',
    liveUrl: 'https://tudominio.com',
    repoUrl: 'https://github.com/tuusuario/portfolio',
    featured: true,
    metrics: [
      { label: 'Temas', value: '4' },
      { label: 'Animaciones', value: '30+' },
      { label: 'Score Perf.', value: '94' },
    ],
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    subtitle: 'React · Node.js · PostgreSQL',
    description: 'Plataforma de comercio electrónico completa con panel admin, pagos, inventario y analíticas en tiempo real.',
    longDescription: 'Sistema full-stack con autenticación JWT, carrito de compras, integración con Stripe, panel de administración completo, reportes de ventas y sistema de notificaciones. API REST documentada con Swagger. Desplegado en Railway + Vercel.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
    category: 'fullstack',
    year: '2024',
    accent: '#a855f7',
    accentSecondary: '#7b2fff',
    liveUrl: 'https://demo.tudominio.com',
    repoUrl: 'https://github.com/tuusuario/ecommerce',
    featured: true,
    metrics: [
      { label: 'Usuarios', value: '500+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'APIs', value: '45' },
    ],
  },
  {
    id: 'dashboard-analytics',
    title: 'Analytics Dashboard',
    subtitle: 'React · D3.js · WebSockets',
    description: 'Dashboard de analíticas en tiempo real con gráficos interactivos, filtros avanzados y exportación de datos.',
    longDescription: 'Interfaz de analíticas construida con React y D3.js para visualizaciones complejas. Datos en tiempo real via WebSockets. Sistema de filtros dinámicos, comparativas de periodos, exportación a CSV/PDF y modo oscuro. Optimizado para grandes volúmenes de datos con virtualización.',
    stack: ['React', 'D3.js', 'WebSockets', 'Express', 'MongoDB', 'Chart.js'],
    category: 'web',
    year: '2023',
    accent: '#00ff88',
    accentSecondary: '#00c8d4',
    liveUrl: 'https://analytics.tudominio.com',
    featured: true,
    metrics: [
      { label: 'Gráficos', value: '12' },
      { label: 'Métricas', value: '80+' },
      { label: 'Datos/s', value: '1K' },
    ],
  },
  {
    id: 'mobile-fitness',
    title: 'FitTrack Mobile',
    subtitle: 'React Native · Expo',
    description: 'App móvil de seguimiento de ejercicio con rutinas personalizadas, tracking de calorías y progresión visual.',
    longDescription: 'Aplicación móvil cross-platform desarrollada con React Native y Expo. Incluye rutinas de ejercicio personalizables, timer de descanso, registro de pesos, gráficas de progreso, integración con HealthKit/Google Fit y modo offline completo con sincronización.',
    stack: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Redux Toolkit'],
    category: 'mobile',
    year: '2023',
    accent: '#f0e040',
    accentSecondary: '#ff9500',
    repoUrl: 'https://github.com/tuusuario/fittrack',
    featured: false,
    metrics: [
      { label: 'Descargas', value: '200+' },
      { label: 'Rutinas', value: '50+' },
      { label: 'Rating', value: '4.8★' },
    ],
  },
  {
    id: 'api-gateway',
    title: 'API Gateway Service',
    subtitle: 'Node.js · Microservicios',
    description: 'Gateway de microservicios con rate limiting, autenticación centralizada, logging y circuit breaker pattern.',
    longDescription: 'Servicio de gateway construido con Node.js y Express. Implementa autenticación JWT centralizada, rate limiting por usuario/IP, circuit breaker para resiliencia, balanceo de carga, logging estructurado con Winston y métricas con Prometheus. Completamente dockerizado.',
    stack: ['Node.js', 'Express', 'Docker', 'Redis', 'Prometheus', 'Nginx'],
    category: 'backend',
    year: '2023',
    accent: '#ff2d6b',
    accentSecondary: '#ff6b6b',
    repoUrl: 'https://github.com/tuusuario/api-gateway',
    featured: false,
    metrics: [
      { label: 'RPS', value: '10K' },
      { label: 'Latencia', value: '<5ms' },
      { label: 'Servicios', value: '8' },
    ],
  },
  {
    id: '3d-configurator',
    title: '3D Product Configurator',
    subtitle: 'Three.js · React Three Fiber',
    description: 'Configurador de producto 3D interactivo con cambio de materiales, colores y vistas en tiempo real.',
    longDescription: 'Experiencia 3D web construida con Three.js y React Three Fiber. Permite rotar, hacer zoom y configurar un producto 3D en tiempo real: cambio de materiales PBR, colores personalizados, iluminación HDR. Exporta la configuración y genera previews. Carga GLTF con compresión Draco.',
    stack: ['Three.js', 'React Three Fiber', 'GLTF', 'Drei', 'Leva', 'Vite'],
    category: '3d',
    year: '2024',
    accent: '#00c8d4',
    accentSecondary: '#0099ff',
    liveUrl: 'https://configurator.tudominio.com',
    featured: false,
    metrics: [
      { label: 'Variantes', value: '120+' },
      { label: 'FPS', value: '60' },
      { label: 'Load time', value: '<2s' },
    ],
  },
];

// Categorías con sus labels y colores
export const CATEGORIES = {
  all:       { label: 'Todos',       color: '#00f5ff' },
  fullstack: { label: 'Full Stack',  color: '#a855f7' },
  web:       { label: 'Web',         color: '#00ff88' },
  mobile:    { label: 'Mobile',      color: '#f0e040' },
  backend:   { label: 'Backend',     color: '#ff2d6b' },
  '3d':      { label: '3D / Three',  color: '#00c8d4' },
  ai:        { label: 'AI / ML',     color: '#ff9500' },
} as const;