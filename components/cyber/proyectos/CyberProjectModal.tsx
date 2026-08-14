'use client';

/**
 * CyberProjectModal — Modal HUD completo para el tema Cyber
 *
 * Layout: TODO EN UN SOLO SCROLL (sin tabs de navegación)
 * Cada sección está separada visualmente con elementos HUD:
 *   - Líneas de datos con números de línea
 *   - Bordes angulados con clip-path
 *   - Scanlines animadas
 *   - Barras de progreso con glow
 *   - Matriz de datos tipo terminal
 *   - Canvas Three.js como fondo con partículas de código
 *
 * Diferente a Space (tabs con nav lateral) y Runic (dos paneles)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tipos completos ──────────────────────────────────────────

export interface CyberMetric {
  label: string;
  value: string;
  sublabel?: string;
  bar?: number;       // 0–100 para barra de progreso
  icon: string;
}

export interface CyberArchLayer {
  id: string;
  name: string;
  tech: string[];
  color: string;
  description: string;
}

export interface CyberMedia {
  type: 'image' | 'video' | 'gif';
  src: string;
  caption: string;
  thumbnail?: string;
}

export interface CyberSCC {
  code: string;
  title: string;
  evidence: string;
  level: 'básico' | 'intermedio' | 'avanzado';
}

export interface CyberProject {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  accent: string;
  accentSecondary: string;
  stack: string[];
  category: string;
  year: string;
  repoUrl?: string;
  liveUrl?: string;
  featured: boolean;
  // Nuevos campos completos
  problem: string;
  solution: string;
  role: string;
  period: string;
  type: 'academic' | 'freelance' | 'job' | 'personal' | 'fullstack';
  highlights: string[];
  metrics: CyberMetric[];
  archLayers: CyberArchLayer[];
  patterns: string[];
  challenges: string[];
  media: CyberMedia[];
  scc: CyberSCC[];
}

// ── Datos completos de los proyectos Cyber ───────────────────

export const CYBER_PROJECTS: CyberProject[] = [
  {
    id: 'tienda-online-ecommerce',
    num: '01',
    title: 'Tienda Online',
    subtitle: 'E-commerce full-stack',
    accent: '#00f5ff',
    accentSecondary: '#00ff88',
    stack: ['Next.js 15', 'React 19', 'Tailwind CSS', 'FastAPI', 'SQLAlchemy', 'Docker'],
    category: 'fullstack',
    year: '2025',
    repoUrl: 'https://github.com/Karatsuyu/Tienda-Online.git',
    featured: true,
    period: 'Feb 2024 – Abr 2024',
    type: 'freelance',
    problem: 'Comercios locales sin venta online pagando 25-30% de comisión a marketplaces. Sin control del inventario ni datos de sus clientes.',
    solution: 'E-commerce propio con catálogo dinámico, carrito persistente, checkout Stripe, panel admin y Docker Compose. Comisión: 0%.',
    role: 'Full Stack Developer · DevOps — arquitectura end-to-end, frontend Next.js, API FastAPI, Stripe y contenedores.',
    highlights: [
      'Carrito persistente con sync servidor/cliente via JWT',
      'Webhooks Stripe idempotentes para órdenes 100% seguras',
      'SSR Next.js 15 App Router — FCP < 1.2s en producción',
      'Docker Compose: 4 servicios (frontend + API + DB + Redis)',
      'Panel admin: inventario, órdenes, reportes CSV exportables',
      'Cobertura tests 72% con pytest + Playwright E2E',
    ],
    metrics: [
      { label: 'Lighthouse',    value: '94',    sublabel: 'Performance',    bar: 94,  icon: '⚡' },
      { label: 'Carga FCP',     value: '<1.2s', sublabel: 'First Paint',    bar: 88,  icon: '🚀' },
      { label: 'Tests',         value: '72%',   sublabel: 'Cobertura',      bar: 72,  icon: '✅' },
      { label: 'Endpoints API', value: '38',    sublabel: 'OpenAPI docs',   bar: 100, icon: '📡' },
      { label: 'Checkout',      value: '-40%',  sublabel: 'Tiempo proceso', bar: 60,  icon: '💳' },
      { label: 'Uptime',        value: '99.5%', sublabel: 'Docker Compose', bar: 99,  icon: '🛡' },
    ],
    archLayers: [
      { id: 'fe', name: 'Frontend', tech: ['Next.js 15', 'React 19', 'Tailwind', 'React Query', 'Zod'], color: '#00f5ff', description: 'SPA con SSR selectivo y rutas protegidas por rol con middleware Next.js.' },
      { id: 'api', name: 'API REST', tech: ['FastAPI', 'Pydantic v2', 'Uvicorn', 'JWT'], color: '#00ff88', description: 'API async con validación de esquemas, auth stateless y docs OpenAPI auto.' },
      { id: 'db', name: 'Datos', tech: ['PostgreSQL 15', 'SQLAlchemy 2', 'Alembic', 'Redis'], color: '#a855f7', description: 'ORM con migraciones versionadas. Redis para sesiones y caché de catálogo.' },
      { id: 'infra', name: 'Infra', tech: ['Docker Compose', 'Nginx', 'GitHub Actions'], color: '#f0e040', description: '4 servicios contenerizados. CI/CD básico con pruebas en cada push.' },
    ],
    patterns: ['Repository Pattern', 'JWT Stateless Auth', 'Webhook Idempotency', 'SSR + Client Hydration', 'Optimistic UI'],
    challenges: [
      'Sincronizar el carrito entre sesiones anónimas y autenticadas sin duplicar ítems',
      'Webhooks Stripe con idempotency keys para evitar órdenes duplicadas en reintentos',
      'Nginx SSL auto-renovable dentro de Docker Compose en VPS propio',
    ],
    media: [
      { type: 'video', src: '/videos/2025-10-13 17-20-25.mp4', caption: 'Demo flujo de compra completo', thumbnail: '/NextWebsite.png' },
    ],
    scc: [
      { code: 'SCC.E.3', title: 'Paradigmas',    evidence: 'React declarativo, FastAPI async/await, SQLAlchemy OOP.', level: 'avanzado' },
      { code: 'SCC.E.4', title: 'Interfaces',    evidence: 'UI responsiva Tailwind, flujo 3 pasos evaluado con testers.', level: 'avanzado' },
      { code: 'SCC.E.8', title: 'Alternativas',  evidence: 'FastAPI vs Django REST, Stripe vs PayPal documentado.', level: 'intermedio' },
      { code: 'SCC.E.9', title: 'Documentación', evidence: 'OpenAPI auto, Docker reproducible, README en 5 pasos.', level: 'avanzado' },
    ],
  },
  {
    id: 'delicious-food-delivery',
    num: '02',
    title: 'Delicious Food',
    subtitle: 'Delivery + pagos online',
    accent: '#ff2d6b',
    accentSecondary: '#ff6b6b',
    stack: ['Django 5.2', 'DRF', 'JWT', 'Stripe', 'React 19', 'Vite', 'Celery'],
    category: 'fullstack',
    year: '2025',
    repoUrl: 'https://github.com/Karatsuyu/delicious-food-app.git',
    featured: true,
    period: 'Jul 2024 – Sep 2024',
    type: 'freelance',
    problem: 'Restaurante local perdía 30% de pedidos por teléfono. Rappi y similares cobran 25-30% de comisión por cada pedido.',
    solution: 'Plataforma propia de delivery con combos personalizados, Stripe, notificaciones WebSocket y dashboard del dueño. Comisión: 0%.',
    role: 'Full Stack Developer — sistema de combos, integración Stripe con webhooks, WebSocket en tiempo real, analytics.',
    highlights: [
      'Combos personalizados compartibles en la comunidad de usuarios',
      'Stripe Checkout con reembolsos automáticos y facturación',
      'WebSocket (Django Channels) para estado de pedido en tiempo real',
      'Dashboard dueño: ventas diarias, platos top, inventario en vivo',
      'Pedidos online aumentaron 35% en el primer mes de producción',
    ],
    metrics: [
      { label: 'Pedidos online', value: '+35%',  sublabel: 'Primer mes prod.',  bar: 75,  icon: '📈' },
      { label: 'Carga FCP',      value: '<1.5s', sublabel: 'Vite + lazy load', bar: 85,  icon: '⚡' },
      { label: 'Endpoints',      value: '45',    sublabel: 'DRF + JWT',        bar: 100, icon: '📡' },
      { label: 'Tests',          value: '68%',   sublabel: 'Django + Jest',    bar: 68,  icon: '✅' },
      { label: 'Beta testers',   value: '20+',   sublabel: 'Restaurante',      bar: 80,  icon: '👥' },
      { label: 'Pagos',          value: '100%',  sublabel: 'Stripe prod.',     bar: 100, icon: '💳' },
    ],
    archLayers: [
      { id: 'fe', name: 'Frontend', tech: ['React 19', 'Vite', 'React Router', 'Axios', 'CSS Modules'], color: '#ff2d6b', description: 'SPA con carrito en Context API + persistencia localStorage.' },
      { id: 'be', name: 'Backend', tech: ['Django 5.2', 'DRF', 'Django Channels', 'Celery'], color: '#ff6b6b', description: 'REST + WebSockets. Celery para emails y tareas async.' },
      { id: 'db', name: 'Datos', tech: ['SQLite (dev)', 'PostgreSQL (prod)', 'Redis'], color: '#a855f7', description: 'Redis como broker Celery y caché de sesiones.' },
      { id: 'pay', name: 'Pagos', tech: ['Stripe Checkout', 'Webhooks', 'Stripe.js'], color: '#00f5ff', description: 'Checkout seguro con session IDs y signature verification.' },
    ],
    patterns: ['Django MVT', 'Context API + Reducer', 'Webhook Signature Verification', 'Observer (Django Signals)'],
    challenges: [
      'Modelar combos many-to-many con variantes opcionales sin explotar la complejidad del esquema',
      'Sincronizar estado del pedido via WebSocket sin condiciones de carrera entre instancias',
      'Optimizar N+1 queries en combos populares con select_related y prefetch_related de Django',
    ],
    media: [
      { type: 'video', src: '/videos/2025-12-03 12-26-20.mp4', caption: 'Sistema de combos y checkout Stripe', thumbnail: '/CardImage.png' },
    ],
    scc: [
      { code: 'SCC.E.3', title: 'Paradigmas',    evidence: 'Django MVT (OOP), React hooks funcionales, Channels async.', level: 'avanzado' },
      { code: 'SCC.E.4', title: 'Interfaces',    evidence: 'UI combos con feedback inmediato, checkout 3 pasos evaluado.', level: 'intermedio' },
      { code: 'SCC.E.5', title: 'Usabilidad',    evidence: '20 testers del restaurante, rediseño flujo 2 veces antes de lanzar.', level: 'intermedio' },
      { code: 'SCC.E.9', title: 'Documentación', evidence: 'DRF Spectacular docs, README completo, guía webhooks Stripe.', level: 'intermedio' },
    ],
  },
  {
    id: 'parkingpro-saas',
    num: '03',
    title: 'ParkingPro SaaS',
    subtitle: 'Tiempo real multi-tenant',
    accent: '#a855f7',
    accentSecondary: '#7b2fff',
    stack: ['Node.js 18', 'Express', 'PostgreSQL 15', 'Redis 7', 'Socket.IO', 'React 18'],
    category: 'fullstack',
    year: '2025',
    repoUrl: 'https://github.com/Karatsuyu/parking-app.git',
    featured: true,
    period: 'Mar 2024 – Jun 2024',
    type: 'academic',
    problem: 'Parqueaderos gestionando espacios con papel. Sin visibilidad en tiempo real de ocupación ni métricas de facturación.',
    solution: 'SaaS multi-tenant con WebSockets para 200+ espacios en tiempo real, tarifas configurables y dashboard analytics. Escalable a múltiples sedes.',
    role: 'Full Stack Developer y Arquitecto — multi-tenancy schema-per-tenant, WebSockets Redis pub/sub, liderazgo con Scrum.',
    highlights: [
      'WebSockets + Redis pub/sub — 200+ conexiones simultáneas sin latencia',
      'Multi-tenancy con schema-per-tenant en PostgreSQL (aislamiento total)',
      'Tarifas configurables: hora, fracción, día, mes, tipo de vehículo',
      'Dashboard React + Recharts con métricas en tiempo real',
      'Nota 4.8/5.0 — caso de estudio en clase de Arquitectura de Software',
    ],
    metrics: [
      { label: 'Nota académica',  value: '4.8/5', sublabel: 'Mejor cohorte',  bar: 96,  icon: '🏆' },
      { label: 'Conexiones WS',   value: '200+',  sublabel: 'Sin latencia',   bar: 100, icon: '⚡' },
      { label: 'Uptime demo',     value: '99%',   sublabel: 'AWS EC2',        bar: 99,  icon: '🛡' },
      { label: 'Endpoints',       value: '50+',   sublabel: 'Swagger UI',     bar: 100, icon: '📡' },
      { label: 'Sprints Scrum',   value: '6',     sublabel: '2 semanas c/u',  bar: 100, icon: '📋' },
      { label: 'Schemas PG',      value: '5+',    sublabel: 'Tenants demo',   bar: 100, icon: '🗄' },
    ],
    archLayers: [
      { id: 'fe',   name: 'Frontend',     tech: ['React 18', 'TypeScript', 'Recharts', 'Socket.IO Client'], color: '#a855f7', description: 'Dashboard con gráficas en tiempo real. Estado global Context + Reducer.' },
      { id: 'api',  name: 'API REST',     tech: ['Node.js 18', 'Express 4', 'JWT', 'Joi'],                  color: '#7b2fff', description: '50+ endpoints RESTful con auth por rol (admin/operador/visitante).' },
      { id: 'rt',   name: 'Tiempo Real',  tech: ['Socket.IO 4', 'Redis 7 pub/sub', 'Event Emitters'],       color: '#ff2d6b', description: 'Redis pub/sub para sync entre múltiples instancias del servidor.' },
      { id: 'db',   name: 'Persistencia', tech: ['PostgreSQL 15', 'Schema-per-tenant', 'Redis Cache'],       color: '#00f5ff', description: 'Aislamiento por schema PostgreSQL. Redis para caché de espacios activos.' },
    ],
    patterns: ['Multi-tenant (Schema per tenant)', 'CQRS', 'Observer via WebSocket', 'Repository', 'Strategy (tarifas)'],
    challenges: [
      'Redis pub/sub entre múltiples instancias del servidor sin race conditions al escalar',
      'Schema-per-tenant sin afectar performance de queries cross-tenant para reportes globales',
      'Reconexión WebSocket automática en cliente sin perder estado de la vista del operador',
    ],
    media: [
      { type: 'video', src: '/videos/2025-10-23 17-08-31.mp4', caption: 'Sistema tiempo real — entrada/salida de vehículos', thumbnail: '/SpaceWebsite.png' },
    ],
    scc: [
      { code: 'SCC.E.3', title: 'Paradigmas',    evidence: 'Node.js async/await, React funcional, Redis Observer Pattern.', level: 'avanzado' },
      { code: 'SCC.E.6', title: 'Seguridad',     evidence: 'Schema isolation, JWT rotación, CORS por tenant, Joi validation.', level: 'intermedio' },
      { code: 'SCC.E.7', title: 'Infraestructura', evidence: 'AWS EC2 + Docker Compose, Nginx, SSL Let\'s Encrypt.', level: 'básico' },
      { code: 'SCC.E.8', title: 'Alternativas',  evidence: 'Socket.IO vs SSE vs Long Polling; schema vs row-level security.', level: 'intermedio' },
      { code: 'SCC.E.9', title: 'Documentación', evidence: 'Diagramas C4, Swagger UI, guía AWS, presentación técnica.', level: 'avanzado' },
    ],
  },
  {
    id: 'sistema-gestion-registral',
    num: '04',
    title: 'Sistema Registral',
    subtitle: 'Gestión documental RBAC',
    accent: '#00c8d4',
    accentSecondary: '#0099ff',
    stack: ['Node.js 18', 'Express', 'PostgreSQL 15', 'React', 'Redis', 'JWT'],
    category: 'fullstack',
    year: '2025',
    repoUrl: 'https://github.com/Karatsuyu/Registradur-a-De-Colombia.git',
    featured: false,
    period: 'Jun 2024 – Dic 2024',
    type: 'job',
    problem: 'Proceso registral manual con 3 días por trámite y errores por duplicados. Necesidad de digitalizar flujos de aprobación multinivel.',
    solution: 'Sistema con RBAC 4 roles, flujos de aprobación como máquina de estados, búsqueda GIN full-text y auditoría con triggers PostgreSQL.',
    role: 'Backend Developer — 52 endpoints REST, sistema RBAC, máquina de estados de aprobación, auditoría con PG triggers.',
    highlights: [
      'RBAC 4 roles con permisos granulares por recurso (admin/registrador/validador/consultor)',
      'Auditoría inviolable con triggers PG — imposible modificar desde la aplicación',
      'Reducción tiempo de procesamiento: 3 días → 4 horas (60% más rápido)',
      'Búsqueda full-text GIN en PostgreSQL — resultados en < 200ms',
      '500+ documentos procesados diariamente en producción sin incidentes',
    ],
    metrics: [
      { label: 'Tiempo reducido', value: '60%',   sublabel: '3 días → 4 horas', bar: 60,  icon: '⏱' },
      { label: 'Docs/día',        value: '500+',  sublabel: 'En producción',    bar: 100, icon: '📄' },
      { label: 'Endpoints',       value: '52',    sublabel: 'RBAC granular',    bar: 100, icon: '📡' },
      { label: 'Roles',           value: '4',     sublabel: 'Por recurso',      bar: 100, icon: '👥' },
      { label: 'Uptime',          value: '99.8%', sublabel: '6 meses',          bar: 99,  icon: '🛡' },
      { label: 'Búsqueda',        value: '<200ms',sublabel: 'GIN index PG',     bar: 95,  icon: '🔍' },
    ],
    archLayers: [
      { id: 'fe',   name: 'Frontend',       tech: ['React 18', 'Vite', 'React Hook Form', 'React Table'],  color: '#00c8d4', description: 'Formularios con validación en tiempo real. Tablas con paginación avanzada.' },
      { id: 'api',  name: 'API REST',       tech: ['Node.js 18', 'Express', 'Joi', 'JWT + Refresh'],       color: '#0099ff', description: '52 endpoints con middleware RBAC. Rate limiting por usuario.' },
      { id: 'db',   name: 'Base de datos',  tech: ['PostgreSQL 15', 'Redis', 'GIN Full-Text', 'Triggers'], color: '#a855f7', description: 'GIN para búsqueda. Triggers para auditoría inviolable desde DB.' },
      { id: 'not',  name: 'Notificaciones', tech: ['Nodemailer', 'HTML Templates', 'Cron Jobs'],           color: '#f0e040', description: 'Emails transaccionales con templates. Cron para recordatorios.' },
    ],
    patterns: ['RBAC', 'Audit Log Pattern', 'Repository + Unit of Work', 'State Machine (aprobaciones)', 'Specification Pattern'],
    challenges: [
      'RBAC extensible sin modificar código al agregar roles nuevos (Open/Closed Principle)',
      'Flujo de aprobación como máquina de estados con rechazos parciales y reasignaciones',
      'Auditoría con PG triggers — imposible modificar o eliminar registros desde la app',
    ],
    media: [
      { type: 'video', src: '/videos/2025-10-21 09-59-56.mp4', caption: 'Sistema registral — gestión documental y RBAC', thumbnail: '' },
    ],
    scc: [
      { code: 'SCC.E.3', title: 'Paradigmas',    evidence: 'Node.js funcional (middleware chain), PG triggers procedural, React declarativo.', level: 'avanzado' },
      { code: 'SCC.E.6', title: 'Seguridad',     evidence: 'RBAC granular, JWT refresh, audit log PG inviolable, Joi validation.', level: 'avanzado' },
      { code: 'SCC.E.9', title: 'Documentación', evidence: 'Swagger, ER diagrams, manual usuario, guía configuración roles.', level: 'intermedio' },
    ],
  },
  {
    id: 'misalud-health-risk',
    num: '05',
    title: 'MiSalud',
    subtitle: 'Health risk prediction PWA',
    accent: '#f0e040',
    accentSecondary: '#ff9500',
    stack: ['Django 5', 'DRF', 'SimpleJWT', 'React', 'Vite', 'Tailwind CSS'],
    category: 'fullstack',
    year: '2025',
    repoUrl: 'https://github.com/Karatsuyu/Mi-Salud.git',
    featured: false,
    period: 'Sep 2024 – Dic 2024',
    type: 'academic',
    problem: 'Sin forma simple de monitorear hábitos y recibir alertas tempranas. Apps médicas complejas o requieren dispositivos costosos.',
    solution: 'PWA para registrar hábitos, predecir riesgo con 8 indicadores configurables. 100% funcional offline con Service Worker.',
    role: 'Full Stack Developer — arquitectura completa, algoritmo de scoring de riesgo ponderado, PWA con Workbox offline.',
    highlights: [
      'Algoritmo de scoring con 8 indicadores de salud ponderados y configurables',
      'PWA con Workbox — 100% offline, sincroniza al reconectar sin conflictos',
      'OAuth2 Google + 2FA TOTP compatible con Google Authenticator',
      'Cifrado AES-256 para datos médicos sensibles antes de persistir',
      '🏆 Premio Mejor Proyecto Capstone 2024 · Nota 5.0/5.0',
    ],
    metrics: [
      { label: 'Nota final',      value: '5.0/5', sublabel: 'Mejor Capstone 🏆', bar: 100, icon: '🏆' },
      { label: 'Lighthouse PWA',  value: '91',    sublabel: '/100 como PWA',     bar: 91,  icon: '⚡' },
      { label: 'Indicadores',     value: '8',     sublabel: 'Scoring riesgo',    bar: 100, icon: '🏥' },
      { label: 'Modo offline',    value: '100%',  sublabel: 'Service Worker',    bar: 100, icon: '📱' },
      { label: 'Seguridad',       value: 'AES-256',sublabel: 'Datos médicos',   bar: 100, icon: '🔐' },
      { label: 'Beta testers',    value: '15',    sublabel: 'Estudiantes',       bar: 80,  icon: '👥' },
    ],
    archLayers: [
      { id: 'pwa', name: 'Frontend PWA',  tech: ['React 18', 'Tailwind', 'Recharts', 'Workbox'],              color: '#f0e040', description: 'PWA instalable. Caché offline Workbox. Gráficas 30 días.' },
      { id: 'be',  name: 'Backend',       tech: ['Django 5', 'DRF', 'OAuth2', 'TOTP 2FA', 'Celery'],         color: '#ff9500', description: 'Auth OAuth2 + 2FA TOTP. Celery para recordatorios diarios.' },
      { id: 'sec', name: 'Seguridad',     tech: ['PostgreSQL', 'AES-256', 'Redis', 'cryptography'],           color: '#ff2d6b', description: 'Cifrado de campos sensibles antes de persistir en DB.' },
      { id: 'alg', name: 'Algoritmo',     tech: ['Python', 'Pandas', 'Scoring ponderado', 'NumPy'],          color: '#00f5ff', description: '8 indicadores ajustables. Exporta a CSV. Transparente.' },
    ],
    patterns: ['PWA (Service Worker + Cache API)', 'OAuth2 + TOTP MFA', 'Strategy (scoring)', 'Decorator (cifrado transparente)', 'CQRS'],
    challenges: [
      'Service Worker offline con sincronización sin conflictos al reconectar (background sync)',
      'Scoring transparente — el usuario entiende por qué cada indicador contribuye al riesgo',
      'AES-256 transparente a nivel modelo Django sin afectar búsquedas ni filtros',
    ],
    media: [
      { type: 'video', src: '/videos/2025-12-03 15-27-11.mp4', caption: 'Dashboard de hábitos y predicción de riesgo', thumbnail: '' },
    ],
    scc: [
      { code: 'SCC.E.3', title: 'Paradigmas',  evidence: 'Django OOP + decoradores, React funcional, Pandas funcional para scoring.', level: 'avanzado' },
      { code: 'SCC.E.4', title: 'Interfaces',  evidence: 'PWA instalable móvil, WCAG 2.1 AA, modo oscuro, gráficas interactivas.', level: 'avanzado' },
      { code: 'SCC.E.5', title: 'Usabilidad',  evidence: '15 testers think-aloud, 3 iteraciones del flujo de registro.', level: 'intermedio' },
      { code: 'SCC.E.6', title: 'Seguridad',   evidence: 'OAuth2 + 2FA, AES-256, HTTPS, CSP, validación Zod + DRF.', level: 'avanzado' },
    ],
  },
  {
    id: 'portfolio-profesional-web',
    num: '06',
    title: 'Portfolio Web',
    subtitle: 'Sitio profesional responsive',
    accent: '#ff0080',
    accentSecondary: '#8000ff',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'CSS Grid', 'Flexbox'],
    category: 'web',
    year: '2025',
    repoUrl: 'https://github.com/Karatsuyu/Mi-Hoja-De-Vida.git',
    featured: false,
    period: 'Ene 2024 – Feb 2024',
    type: 'personal',
    problem: 'Portfolio profesional responsive ultra-rápido sin frameworks. Instalable, accesible, Lighthouse cercano a 100.',
    solution: 'Portfolio static HTML/CSS/JS puro — 0 dependencias externas. Animaciones CSS nativas, tema oscuro/claro nativo.',
    role: 'Frontend Developer y Designer — sistema visual completo, maquetación CSS Grid, animaciones y optimización Lighthouse.',
    highlights: [
      'Lighthouse 98/100 en performance — 0 dependencias externas JavaScript',
      '100% responsive: mobile, tablet, desktop con CSS Grid puro',
      'Animaciones CSS avanzadas sin librerías (keyframes + IntersectionObserver)',
      'Tema oscuro/claro sin flash al recargar (script inline en <head>)',
      'WCAG 2.1 AA — navegable 100% con teclado, contraste 4.5:1',
    ],
    metrics: [
      { label: 'Lighthouse',    value: '98',   sublabel: 'Performance',  bar: 98,  icon: '⚡' },
      { label: 'Dependencias',  value: '0',    sublabel: 'JS puro',      bar: 100, icon: '📦' },
      { label: 'Carga FCP',     value: '<1s',  sublabel: 'First Paint',  bar: 95,  icon: '🚀' },
      { label: 'Accesibilidad', value: '100',  sublabel: 'Lighthouse',   bar: 100, icon: '♿' },
      { label: 'Secciones',     value: '8',    sublabel: 'Portfolio',    bar: 100, icon: '📄' },
      { label: 'Responsive',    value: '100%', sublabel: '3 breakpoints',bar: 100, icon: '📱' },
    ],
    archLayers: [
      { id: 'html', name: 'Estructura',     tech: ['HTML5 semántico', 'ARIA roles', 'Meta SEO'],                  color: '#ff0080', description: 'HTML semántico con roles ARIA para accesibilidad completa.' },
      { id: 'css',  name: 'Estilos',        tech: ['CSS3', 'Custom Properties', 'CSS Grid', 'Flexbox'],           color: '#8000ff', description: 'Sistema de diseño con variables CSS. Sin frameworks.' },
      { id: 'js',   name: 'Interactividad', tech: ['JavaScript ES6+', 'IntersectionObserver', 'localStorage'],   color: '#00f5ff', description: 'Animaciones scroll con IO. Persistencia tema en localStorage.' },
    ],
    patterns: ['BEM (CSS)', 'Progressive Enhancement', 'CSS Custom Properties (design tokens)'],
    challenges: [
      'Animaciones de entrada complejas al scroll sin librerías manteniendo 98/100 Lighthouse',
      'Tema oscuro/claro sin flash al recargar usando script inline en el <head> antes del render',
    ],
    media: [
      { type: 'video', src: '/videos/2025-10-23 18-00-50.mp4', caption: 'Portfolio responsive con tema oscuro/claro', thumbnail: '' },
    ],
    scc: [
      { code: 'SCC.E.4', title: 'Interfaces',  evidence: 'CSS Grid responsiva, accesible WCAG 2.1, 98/100 Lighthouse.', level: 'avanzado' },
      { code: 'SCC.E.5', title: 'Usabilidad',  evidence: 'Navegación teclado 100%, ARIA todos los elementos, contraste 4.5:1.', level: 'avanzado' },
    ],
  },
];

// ── Canvas HUD de partículas de código (Three.js) ────────────

function CyberParticlesHeader({ accent }: { accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const W = canvas.clientWidth || 860;
    const H = canvas.clientHeight || 160;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 100);
    camera.position.z = 10;

    const hexToThree = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return new THREE.Color(r, g, b);
    };

    // Grid de puntos
    const count = 300;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: hexToThree(accent), size: 0.07, transparent: true, opacity: 0.7 });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // Forma central (octaedro wireframe)
    const shapeMat = new THREE.MeshBasicMaterial({ color: hexToThree(accent), wireframe: true, transparent: true, opacity: 0.5 });
    const shape = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 1), shapeMat);
    scene.add(shape);

    let t = 0, raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.006;
      pts.rotation.y = t * 0.08;
      shape.rotation.y += 0.01;
      shape.rotation.x += 0.005;
      const col = hexToThree(accentRef.current);
      mat.color.copy(col);
      shapeMat.color.copy(col);
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(raf); renderer.dispose(); };
  }, []); // eslint-disable-line

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

// ── Componentes HUD ──────────────────────────────────────────

// Borde estilo HUD con esquinas cortadas
function HUDBorder({ accent, children, className = '' }: { accent: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        background: `rgba(3,4,10,0.85)`,
        border: `1px solid ${accent}25`,
        padding: '1rem',
      }}
    >
      {/* Esquinas decorativas */}
      {[
        { top: -1, left: -1, rotation: 0 },
        { top: -1, right: -1, rotation: 90 },
        { bottom: -1, right: -1, rotation: 180 },
        { bottom: -1, left: -1, rotation: 270 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 10, height: 10,
          ...pos,
          borderTop: `2px solid ${accent}`,
          borderLeft: `2px solid ${accent}`,
          transform: `rotate(${pos.rotation}deg)`,
          boxShadow: `0 0 6px ${accent}80`,
        }} />
      ))}
      {children}
    </div>
  );
}

// Número de línea decorativo tipo IDE
function LineNum({ n, accent }: { n: number; accent: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: '0.6rem',
      color: `${accent}30`,
      minWidth: '2rem',
      display: 'inline-block',
      textAlign: 'right',
      marginRight: '0.75rem',
      userSelect: 'none',
    }}>
      {String(n).padStart(2, '0')}
    </span>
  );
}

// Sección HUD con título
function HUDSection({ title, accent, lineStart, children }: {
  title: string;
  accent: string;
  lineStart: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Header de sección estilo HUD */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: `1px solid ${accent}20`,
      }}>
        {/* Número de línea */}
        <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: `${accent}35`, minWidth: '1.5rem' }}>
          {String(lineStart).padStart(3, '0')}
        </span>
        {/* Línea decorativa izquierda */}
        <div style={{ width: 3, height: 14, background: accent, boxShadow: `0 0 6px ${accent}` }} />
        {/* Título */}
        <span style={{
          fontFamily: 'var(--font-display, monospace)',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: accent,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          textShadow: `0 0 8px ${accent}60`,
        }}>
          {title}
        </span>
        {/* Línea decorativa derecha */}
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
        {/* Decoración angular */}
        <div style={{
          display: 'flex', gap: 2,
          fontFamily: 'monospace', fontSize: '0.5rem', color: `${accent}40`,
        }}>
          {'///'}
        </div>
      </div>
      {children}
    </div>
  );
}

// Barra de progreso estilo cyberpunk
function CyberBar({ value, accent, label, sublabel }: {
  value: number; accent: string; label: string; sublabel?: string;
}) {
  return (
    <div style={{ marginBottom: '0.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(200,216,232,0.6)' }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 700, color: accent, textShadow: `0 0 8px ${accent}80` }}>
          {sublabel || `${value}%`}
        </span>
      </div>
      <div style={{
        height: 5,
        background: 'rgba(200,216,232,0.06)',
        position: 'relative',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)',
      }}>
        {/* Fondo con patrón */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg, ${accent}08 0px, ${accent}08 2px, transparent 2px, transparent 8px)`,
        }} />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${accent}80, ${accent})`,
            boxShadow: `0 0 8px ${accent}80, 4px 0 12px ${accent}60`,
            clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 100%, 3px 100%)',
            position: 'relative',
          }}
        >
          {/* Destello en la punta */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: 4,
            background: `radial-gradient(circle, white 0%, ${accent} 60%, transparent 100%)`,
            opacity: 0.9,
          }} />
        </motion.div>
      </div>
    </div>
  );
}

// Nodo de arquitectura (tipo diagrama)
function ArchNode({ layer, index, accent }: {
  layer: CyberArchLayer;
  index: number;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0.75rem',
        background: `${layer.color}06`,
        border: `1px solid ${layer.color}22`,
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        position: 'relative',
      }}
    >
      {/* Conector izquierdo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, background: layer.color, boxShadow: `0 0 8px ${layer.color}` }} />
        {index < 3 && (
          <div style={{ width: 1, flex: 1, background: `${layer.color}30`, minHeight: 12 }} />
        )}
      </div>
      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ fontFamily: 'var(--font-display, monospace)', fontWeight: 700, fontSize: '0.72rem', color: '#fff', letterSpacing: '0.06em' }}>
            {layer.name}
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: '0.55rem',
            color: layer.color, border: `1px solid ${layer.color}30`,
            padding: '0.08rem 0.4rem',
          }}>
            {layer.id.toUpperCase()}
          </span>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: '0.67rem', color: 'rgba(200,216,232,0.45)', lineHeight: 1.5, marginBottom: '0.4rem' }}>
          {layer.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {layer.tech.map(t => (
            <span key={t} style={{
              fontFamily: 'monospace', fontSize: '0.58rem',
              padding: '0.1rem 0.45rem',
              background: `${layer.color}10`,
              color: `${layer.color}cc`,
              border: `1px solid ${layer.color}22`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Matriz SCC estilo data terminal
function SCCMatrix({ project }: { project: CyberProject }) {
  const ALL_SCC = ['SCC.E.1','SCC.E.2','SCC.E.3','SCC.E.4','SCC.E.5','SCC.E.6','SCC.E.7','SCC.E.8','SCC.E.9'];
  const covered = new Set(project.scc.map(s => s.code));
  const LEVEL_CFG = {
    básico:     { color: '#f0e040', bar: 35, code: '01' },
    intermedio: { color: project.accent, bar: 65, code: '02' },
    avanzado:   { color: '#00ff88', bar: 90, code: '03' },
  };

  return (
    <div>
      {/* Mapa de cobertura tipo terminal */}
      <div style={{
        fontFamily: 'monospace',
        fontSize: '0.62rem',
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${project.accent}20`,
        padding: '0.75rem',
        marginBottom: '0.75rem',
        lineHeight: 2,
      }}>
        <div style={{ color: `${project.accent}50`, marginBottom: '0.4rem' }}>
          {'> COMPETENCIAS_SCAN ——————————————————————'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {ALL_SCC.map(code => {
            const ok = covered.has(code);
            return (
              <span key={code} style={{
                padding: '0.15rem 0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                border: `1px solid ${ok ? project.accent + '60' : 'rgba(255,255,255,0.06)'}`,
                background: ok ? `${project.accent}15` : 'rgba(255,255,255,0.02)',
                color: ok ? project.accent : '#1f2937',
                boxShadow: ok ? `0 0 6px ${project.accent}40` : 'none',
              }}>
                {ok ? '◆' : '◇'} {code.replace('SCC.', '')}
              </span>
            );
          })}
        </div>
        <div style={{ color: `${project.accent}40`, marginTop: '0.4rem', fontSize: '0.58rem' }}>
          {'> STATUS: '}<span style={{ color: '#00ff88' }}>{project.scc.length}/{ALL_SCC.length} COMPETENCIAS VERIFICADAS</span>
        </div>
      </div>

      {/* Detalle de competencias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {project.scc.map((scc, i) => {
          const lvl = LEVEL_CFG[scc.level];
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                padding: '0.7rem 0.85rem',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${lvl.color}18`,
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Indicador cuadrado */}
                  <div style={{ width: 6, height: 6, background: lvl.color, boxShadow: `0 0 6px ${lvl.color}` }} />
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.68rem', color: lvl.color }}>{scc.code}</span>
                  <span style={{ fontSize: '0.66rem', color: 'rgba(200,216,232,0.45)', fontFamily: 'monospace' }}>· {scc.title}</span>
                </div>
                <span style={{
                  fontFamily: 'monospace', fontSize: '0.55rem',
                  padding: '0.1rem 0.5rem',
                  border: `1px solid ${lvl.color}25`,
                  background: `${lvl.color}0e`,
                  color: lvl.color,
                }}>
                  {lvl.code} {scc.level.toUpperCase()}
                </span>
              </div>
              {/* Barra nivel */}
              <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', overflow: 'hidden', marginBottom: '0.4rem' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${lvl.bar}%` }} transition={{ delay: i * 0.06 + 0.2, duration: 0.7 }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${lvl.color}60, ${lvl.color})` }} />
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: '0.67rem', color: 'rgba(200,216,232,0.45)', lineHeight: 1.5, margin: 0 }}>
                {scc.evidence}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── MODAL PRINCIPAL ──────────────────────────────────────────

interface Props {
  project: CyberProject;
  onClose: () => void;
}

export default function CyberProjectModal({ project: p, onClose }: Props) {
  const [activeMedia, setActiveMedia] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const TYPE_LABELS = {
    academic:  { label: 'ACADÉMICO',  color: '#a855f7' },
    freelance: { label: 'FREELANCE',  color: '#00ff88' },
    job:       { label: 'PRÁCTICA',   color: '#ff2d6b' },
    personal:  { label: 'PERSONAL',   color: '#00f5ff' },
    fullstack: { label: 'FULL STACK', color: '#f0e040' },
  };
  const typeMeta = TYPE_LABELS[p.type] ?? TYPE_LABELS.fullstack;

  let lineCounter = 1;
  const nextLine = (n = 1) => { const l = lineCounter; lineCounter += n; return l; };

  return (
    <AnimatePresence>
      {/* ── OVERLAY ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
        }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Nebulosa de fondo */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 30%, ${p.accent}08 0%, transparent 55%)`,
          transition: 'background 0.5s',
        }} />

        {/* Scanlines overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }} />

        {/* ── MODAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 860,
            maxHeight: '92vh',
            background: 'rgba(3,4,10,0.98)',
            border: `1px solid ${p.accent}30`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: `0 0 80px ${p.accent}18, 0 0 200px ${p.accent}06, 0 32px 80px rgba(0,0,0,0.7)`,
            // Bordes angulados tipo HUD
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
        >
          {/* Línea superior de glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 10,
            background: `linear-gradient(90deg, transparent, ${p.accent}, ${p.accentSecondary}, ${p.accent}, transparent)`,
            boxShadow: `0 0 20px ${p.accent}`,
          }} />

          {/* Esquinas HUD del modal */}
          {[
            { top: 0, left: 0, borderTop: `2px solid ${p.accent}`, borderLeft: `2px solid ${p.accent}` },
            { top: 0, right: 0, borderTop: `2px solid ${p.accent}`, borderRight: `2px solid ${p.accent}` },
            { bottom: 0, left: 0, borderBottom: `2px solid ${p.accent}`, borderLeft: `2px solid ${p.accent}` },
            { bottom: 0, right: 0, borderBottom: `2px solid ${p.accent}`, borderRight: `2px solid ${p.accent}` },
          ].map((style, i) => (
            <div key={i} style={{ position: 'absolute', width: 20, height: 20, zIndex: 10, boxShadow: `0 0 10px ${p.accent}60`, ...style }} />
          ))}

          {/* ── CABECERA con Three.js ── */}
          <div style={{ position: 'relative', height: 130, flexShrink: 0, overflow: 'hidden' }}>
            <CyberParticlesHeader accent={p.accent} />
            {/* Gradiente fade abajo */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to bottom, transparent 30%, rgba(3,4,10,0.97) 100%)`,
            }} />
            {/* Contenido cabecera */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'flex-end',
              padding: '0 1.4rem 1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', width: '100%' }}>
                {/* Número */}
                <div style={{
                  fontFamily: 'var(--font-display, monospace)',
                  fontSize: '3.5rem', fontWeight: 900, lineHeight: 1,
                  color: `${p.accent}15`,
                }}>
                  {p.num}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    {/* Badge tipo */}
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.58rem',
                      letterSpacing: '0.18em', padding: '0.15rem 0.6rem',
                      border: `1px solid ${typeMeta.color}40`,
                      background: `${typeMeta.color}12`,
                      color: typeMeta.color,
                    }}>
                      {typeMeta.label}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(200,216,232,0.3)' }}>
                      {p.period}
                    </span>
                    {p.featured && (
                      <span style={{
                        fontFamily: 'monospace', fontSize: '0.55rem',
                        padding: '0.12rem 0.5rem',
                        background: `linear-gradient(90deg, ${p.accent}, ${p.accentSecondary})`,
                        color: '#000', fontWeight: 700,
                      }}>
                        ◆ FEATURED
                      </span>
                    )}
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-display, monospace)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                    fontWeight: 900, color: '#fff', margin: 0,
                    textShadow: `0 0 20px ${p.accent}30`,
                  }}>
                    {p.title}
                  </h2>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: p.accent, margin: '0.15rem 0 0', opacity: 0.7 }}>
                    {p.subtitle}
                  </p>
                </div>
                {/* Botones */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'monospace', fontSize: '0.65rem',
                        padding: '0.4rem 0.85rem',
                        border: `1px solid ${p.accent}35`,
                        color: `${p.accent}cc`,
                        background: `${p.accent}0a`,
                        textDecoration: 'none',
                        clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)',
                        transition: 'all 0.2s',
                      }}>
                      ⌥ GitHub
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'monospace', fontSize: '0.65rem',
                        padding: '0.4rem 0.85rem',
                        background: `linear-gradient(90deg, ${p.accent}30, ${p.accentSecondary}20)`,
                        border: `1px solid ${p.accent}50`,
                        color: p.accent,
                        textDecoration: 'none',
                        clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)',
                      }}>
                      ↗ Live
                    </a>
                  )}
                  <button onClick={onClose} style={{
                    width: 30, height: 30, fontFamily: 'monospace', fontSize: '0.8rem',
                    border: `1px solid rgba(200,216,232,0.15)`,
                    background: 'transparent', color: 'rgba(200,216,232,0.4)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stack pills mini bajo la cabecera */}
          <div style={{
            display: 'flex', gap: '0.3rem', flexWrap: 'wrap',
            padding: '0.5rem 1.4rem',
            borderBottom: `1px solid ${p.accent}12`,
            flexShrink: 0,
          }}>
            {p.stack.map(t => (
              <span key={t} style={{
                fontFamily: 'monospace', fontSize: '0.6rem',
                padding: '0.12rem 0.5rem',
                background: 'rgba(200,216,232,0.04)',
                border: '1px solid rgba(200,216,232,0.08)',
                color: 'rgba(200,216,232,0.4)',
              }}>
                {t}
              </span>
            ))}
          </div>

          {/* ── CONTENIDO SCROLLABLE (todo en un solo scroll) ── */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem 1.4rem',
              scrollbarWidth: 'thin',
              scrollbarColor: `${p.accent}30 transparent`,
            }}
          >
            {/* ═══════════════════════════════════════════════ */}
            {/* 1. PROBLEMA → SOLUCIÓN                          */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// MISIÓN" accent={p.accent} lineStart={nextLine(3)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {/* Problema */}
                <div style={{
                  padding: '0.85rem',
                  background: 'rgba(255,50,50,0.04)',
                  border: '1px solid rgba(255,80,80,0.15)',
                  borderLeft: '3px solid rgba(255,80,80,0.6)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,100,100,0.6)', marginBottom: '0.4rem' }}>
                    <LineNum n={nextLine()} accent={p.accent} />PROBLEMA
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(200,216,232,0.7)', lineHeight: 1.65, margin: 0 }}>
                    {p.problem}
                  </p>
                </div>
                {/* Solución */}
                <div style={{
                  padding: '0.85rem',
                  background: 'rgba(0,255,136,0.03)',
                  border: '1px solid rgba(0,255,136,0.12)',
                  borderLeft: '3px solid rgba(0,255,136,0.5)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,255,136,0.55)', marginBottom: '0.4rem' }}>
                    <LineNum n={nextLine()} accent={p.accent} />SOLUCIÓN
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(200,216,232,0.7)', lineHeight: 1.65, margin: 0 }}>
                    {p.solution}
                  </p>
                </div>
              </div>

              {/* Rol */}
              <div style={{
                padding: '0.65rem 0.85rem',
                background: `${p.accent}05`,
                border: `1px solid ${p.accent}18`,
                borderLeft: `3px solid ${p.accent}60`,
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${p.accent}60` }}>
                  <LineNum n={nextLine()} accent={p.accent} />ROL ·
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(200,216,232,0.65)', marginLeft: '0.5rem' }}>
                  {p.role}
                </span>
              </div>
            </HUDSection>

            {/* ═══════════════════════════════════════════════ */}
            {/* 2. LOGROS                                        */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// HIGHLIGHTS" accent={p.accent} lineStart={nextLine(2)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {p.highlights.map((h, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                      padding: '0.5rem 0.6rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid rgba(200,216,232,0.05)`,
                    }}
                  >
                    <LineNum n={nextLine()} accent={p.accent} />
                    <span style={{ color: p.accent, fontSize: '0.6rem', flexShrink: 0, marginTop: '0.18rem' }}>▸</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(200,216,232,0.65)', lineHeight: 1.5 }}>
                      {h}
                    </span>
                  </motion.div>
                ))}
              </div>
            </HUDSection>

            {/* ═══════════════════════════════════════════════ */}
            {/* 3. MÉTRICAS CON BARRAS                          */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// MÉTRICAS DE IMPACTO" accent={p.accent} lineStart={nextLine(2)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Barras de progreso */}
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: `${p.accent}40`, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                    <LineNum n={nextLine()} accent={p.accent} />performance
                  </div>
                  {p.metrics.filter(m => m.bar !== undefined).map(m => (
                    <CyberBar key={m.label} value={m.bar!} accent={p.accent} label={m.label} sublabel={m.value} />
                  ))}
                </div>
                {/* Tarjetas de números */}
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: `${p.accent}40`, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                    <LineNum n={nextLine()} accent={p.accent} />datos clave
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {p.metrics.map((m, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        style={{
                          padding: '0.55rem',
                          background: `${p.accent}06`,
                          border: `1px solid ${p.accent}18`,
                          textAlign: 'center',
                          clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
                        }}
                      >
                        <div style={{ fontSize: '0.9rem' }}>{m.icon}</div>
                        <div style={{
                          fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem',
                          color: p.accent, textShadow: `0 0 10px ${p.accent}70`,
                          lineHeight: 1,
                        }}>
                          {m.value}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: 'rgba(200,216,232,0.4)', marginTop: '0.15rem', lineHeight: 1.2 }}>
                          {m.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </HUDSection>

            {/* ═══════════════════════════════════════════════ */}
            {/* 4. ARQUITECTURA                                  */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// ARQUITECTURA DEL SISTEMA" accent={p.accent} lineStart={nextLine(2)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                {p.archLayers.map((layer, i) => (
                  <ArchNode key={layer.id} layer={layer} index={i} accent={p.accent} />
                ))}
              </div>

              {/* Patrones de diseño */}
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: `${p.accent}40`, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <LineNum n={nextLine()} accent={p.accent} />DESIGN PATTERNS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {p.patterns.map((pt, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        fontFamily: 'monospace', fontSize: '0.65rem',
                        padding: '0.25rem 0.65rem',
                        border: `1px solid ${p.accent}25`,
                        color: `${p.accent}90`,
                        background: `${p.accent}07`,
                        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
                      }}
                    >
                      {pt}
                    </motion.span>
                  ))}
                </div>
              </div>
            </HUDSection>

            {/* ═══════════════════════════════════════════════ */}
            {/* 5. GALERÍA / MEDIA                              */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// DEMO · GALERÍA" accent={p.accent} lineStart={nextLine(2)}>
              {p.media.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  border: `1px dashed ${p.accent}20`,
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  color: 'rgba(200,216,232,0.2)',
                }}>
                  {'// sin media disponible — próximamente screenshots y demos'}
                </div>
              ) : (
                <div>
                  {/* Visor principal */}
                  <div style={{
                    position: 'relative', borderRadius: 0, overflow: 'hidden',
                    background: '#000', aspectRatio: '16/9',
                    border: `1px solid ${p.accent}20`,
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                    marginBottom: '0.6rem',
                  }}>
                    {p.media[activeMedia].type === 'video' ? (
                      <video
                        src={p.media[activeMedia].src}
                        controls autoPlay muted loop
                        poster={p.media[activeMedia].thumbnail || undefined}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.media[activeMedia].src} alt={p.media[activeMedia].caption} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                    {/* HUD overlay en el visor */}
                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.75rem', fontFamily: 'monospace', fontSize: '0.6rem', color: `${p.accent}80` }}>
                      {'[ REC · '}<span style={{ color: '#ff2d6b' }}>●</span>{' DEMO ]'}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '0.4rem 0.75rem',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      fontFamily: 'monospace', fontSize: '0.65rem',
                      color: 'rgba(200,216,232,0.6)',
                    }}>
                      {p.media[activeMedia].caption}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {p.media.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {p.media.map((m, i) => (
                        <button key={i} onClick={() => setActiveMedia(i)}
                          style={{
                            flexShrink: 0, width: 64, height: 44,
                            border: `1.5px solid ${i === activeMedia ? p.accent : 'transparent'}`,
                            background: '#000', cursor: 'pointer', overflow: 'hidden',
                            boxShadow: i === activeMedia ? `0 0 8px ${p.accent}60` : 'none',
                          }}>
                          {m.thumbnail
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={m.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${p.accent}12`, color: p.accent, fontSize: '1rem' }}>▶</div>
                          }
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </HUDSection>

            {/* ═══════════════════════════════════════════════ */}
            {/* 6. DESAFÍOS TÉCNICOS                            */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// RETOS TÉCNICOS SUPERADOS" accent={p.accent} lineStart={nextLine(2)}>
              {p.challenges.map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '0.75rem 0.85rem',
                    marginBottom: '0.5rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${p.accent}15`,
                    borderLeft: `2px solid ${p.accent}60`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Número de fondo */}
                  <div style={{
                    position: 'absolute', top: '0.3rem', right: '0.6rem',
                    fontFamily: 'monospace', fontSize: '2rem', fontWeight: 900,
                    color: `${p.accent}06`, lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <LineNum n={nextLine()} accent={p.accent} />
                  <div style={{ flexShrink: 0, width: 6, height: 6, background: p.accent, boxShadow: `0 0 6px ${p.accent}`, marginTop: '0.35rem' }} />
                  <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(200,216,232,0.65)', lineHeight: 1.6, margin: 0 }}>
                    {c}
                  </p>
                </motion.div>
              ))}
            </HUDSection>

            {/* ═══════════════════════════════════════════════ */}
            {/* 7. COMPETENCIAS SCC                             */}
            {/* ═══════════════════════════════════════════════ */}
            <HUDSection title="// COMPETENCIAS SCC — EVIDENCIAS" accent={p.accent} lineStart={nextLine(2)}>
              <SCCMatrix project={p} />
            </HUDSection>

            {/* EOF marker */}
            <div style={{
              fontFamily: 'monospace', fontSize: '0.6rem',
              color: `${p.accent}30`, textAlign: 'center',
              paddingTop: '1rem', borderTop: `1px solid ${p.accent}10`,
            }}>
              {'/* EOF — '}{p.title}{' · '}{p.year}{' · '}{p.stack.join(' · ')}{' */'}
            </div>
          </div>

          {/* ── STATUS BAR INFERIOR tipo IDE ── */}
          <div style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.35rem 1.1rem',
            borderTop: `1px solid ${p.accent}12`,
            background: 'rgba(0,0,0,0.5)',
            fontFamily: 'monospace', fontSize: '0.58rem',
          }}>
            <span style={{ color: `${p.accent}60` }}>
              {p.num} · {p.title}.tsx
            </span>
            <span style={{ color: 'rgba(200,216,232,0.2)' }}>
              {p.scc.length}/9 SCC · {p.stack.length} tecnologías · ESC para cerrar
            </span>
            <span style={{ color: `${p.accent}40` }}>
              TypeScript · UTF-8
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
