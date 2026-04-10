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
    id: 'tienda-online-ecommerce',
    title: 'Tienda Online (E-commerce Full-Stack)',
    subtitle: 'Next.js · FastAPI · Docker',
    description: 'Plataforma web para explorar productos, ver detalles y realizar compras.',
    longDescription: 'E-commerce end-to-end: frontend con Next.js y backend con FastAPI. Incluye estructura full-stack para catálogo, detalle de producto y flujo de compra, con entorno de desarrollo y despliegue pensado para contenedores (Docker Compose).',
    stack: ['Next.js 15', 'React 19', 'Tailwind CSS 3.4', 'FastAPI', 'SQLAlchemy 2', 'Docker Compose'],
    category: 'fullstack',
    year: '2025',
    accent: '#00f5ff',
    accentSecondary: '#00ff88',
    repoUrl: 'https://github.com/Karatsuyu/Tienda-Online.git',
    featured: true,
    metrics: [
      { label: 'Tecnologías', value: '6' },
      { label: 'Capas', value: '2' },
      { label: 'Compose', value: '1' },
    ],
  },
  {
    id: 'delicious-food-delivery',
    title: 'Delicious Food - Delivery de Comida',
    subtitle: 'Django · React · Stripe',
    description: 'Plataforma de pedidos de comida con combos personalizados, pagos Stripe y comunidad social.',
    longDescription: 'Full-stack con backend en Django + DRF y frontend en React (Vite). Incluye autenticación JWT, flujo de pedidos y pagos con Stripe, además de un enfoque en personalización de combos y experiencia de usuario.',
    stack: ['Django 5.2.6', 'DRF', 'SQLite', 'JWT', 'Stripe', 'React 19', 'Vite'],
    category: 'fullstack',
    year: '2025',
    accent: '#ff2d6b',
    accentSecondary: '#ff6b6b',
    repoUrl: 'https://github.com/Karatsuyu/delicious-food-app.git',
    featured: true,
    metrics: [
      { label: 'Tecnologías', value: '7' },
      { label: 'Pagos', value: '1' },
      { label: 'Auth', value: '1' },
    ],
  },
  {
    id: 'parkingpro-saas',
    title: 'ParkingPro SaaS - Gestión de Parqueaderos',
    subtitle: 'Node.js · PostgreSQL · Socket.IO',
    description: 'Plataforma SaaS con control en tiempo real, facturación automática y dashboard analytics.',
    longDescription: 'Sistema SaaS orientado a tiempo real: backend en Node.js/Express, PostgreSQL y Redis; comunicación en vivo con Socket.IO y dashboard en React. Enfoque en control operativo, facturación y visualización de métricas.',
    stack: ['Node.js 18', 'Express', 'PostgreSQL 15', 'Redis 7', 'Socket.IO', 'React 18'],
    category: 'fullstack',
    year: '2025',
    accent: '#a855f7',
    accentSecondary: '#7b2fff',
    repoUrl: 'https://github.com/Karatsuyu/parking-app.git',
    featured: true,
    metrics: [
      { label: 'Tecnologías', value: '6' },
      { label: 'Tiempo real', value: '1' },
      { label: 'Cache', value: '1' },
    ],
  },
  {
    id: 'sistema-gestion-registral',
    title: 'Sistema de Gestión Registral',
    subtitle: 'Node.js · PostgreSQL · React',
    description: 'Sistema web para gestionar personas, documentos y generar reportes estadísticos.',
    longDescription: 'Aplicación web con arquitectura MVC, backend en Node/Express y persistencia en PostgreSQL. Frontend en React (Vite). Enfocado en integridad de datos, gestión documental y reportes.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'React (Vite)', 'MVC'],
    category: 'fullstack',
    year: '2025',
    accent: '#00c8d4',
    accentSecondary: '#0099ff',
    repoUrl: 'https://github.com/Karatsuyu/Registradur-a-De-Colombia.git',
    featured: false,
    metrics: [
      { label: 'Tecnologías', value: '5' },
      { label: 'Capas', value: '2' },
      { label: 'Patrón', value: '1' },
    ],
  },
  {
    id: 'misalud-health-risk',
    title: 'MiSalud - Health Risk Prediction App',
    subtitle: 'Django · React · Tailwind',
    description: 'Plataforma para registrar hábitos, contenido educativo y predicciones de salud.',
    longDescription: 'Aplicación full-stack centrada en hábitos y prevención: backend con Django + DRF + SimpleJWT y frontend con React (Vite) + Tailwind. Incluye dashboard y componentes orientados a predicción/riesgo de salud.',
    stack: ['Django 4', 'DRF', 'SimpleJWT', 'React', 'Vite', 'Tailwind CSS'],
    category: 'fullstack',
    year: '2025',
    accent: '#f0e040',
    accentSecondary: '#ff9500',
    repoUrl: 'https://github.com/Karatsuyu/Mi-Salud.git',
    featured: false,
    metrics: [
      { label: 'Tecnologías', value: '6' },
      { label: 'Auth', value: '1' },
      { label: 'Capas', value: '2' },
    ],
  },
  {
    id: 'portfolio-profesional-web',
    title: 'Portfolio Profesional Web Full-Stack',
    subtitle: 'HTML · CSS · JS (Vanilla)',
    description: 'Sitio web responsive con sidebar, 8 proyectos, animaciones y modo oscuro/claro.',
    longDescription: 'Portafolio web enfocado en UI/UX y estructura de contenido: navegación con sidebar, sección de proyectos, animaciones y alternancia día/noche. Construido con HTML/CSS/JavaScript vanilla y diseño responsive.',
    stack: ['HTML5', 'CSS3', 'JavaScript Vanilla', 'Responsive Design'],
    category: 'web',
    year: '2025',
    accent: '#ff0080',
    accentSecondary: '#8000ff',
    repoUrl: 'https://github.com/Karatsuyu/Mi-Hoja-De-Vida.git',
    featured: false,
    metrics: [
      { label: 'Proyectos', value: '8' },
      { label: 'Modos', value: '2' },
      { label: 'Tecnologías', value: '4' },
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