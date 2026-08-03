"use client";

/**
 * RunicProjectModal v2 — Layout RADICALMENTE diferente al Space
 *
 * Concepto: Dashboard de dos paneles tipo HUD místico
 *  LEFT PANEL (40%):
 *    - Círculo mágico Three.js GRANDE y central
 *    - Info del proyecto superpuesta en el centro del círculo
 *    - Métricas como "orbes" flotando alrededor del círculo
 *    - Runas decorativas en las esquinas
 *    - Links y tipo de proyecto como badges
 *
 *  RIGHT PANEL (60%):
 *    - Menú de runas RADIAL/WHEEL en la parte superior
 *      (no lateral como Space, no horizontal simple como antes)
 *      → Las runas se muestran en arco/curva, al hover se expanden
 *    - Contenido de la sección seleccionada debajo
 *    - Línea mágica animada como separador
 */

import React, {
  useEffect, useRef, useState, useCallback
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════
//  TIPOS
// ═══════════════════════════════════════════════════════════

export interface RunicProject {
  id: number;
  rune: string;
  runeName: string;
  title: string;
  subtitle: string;
  tech: string;
  stack: string[];
  link: string;
  video?: string;
  type: "academic" | "freelance" | "job" | "personal";
  period: string;
  problem: string;
  solution: string;
  role: string;
  highlights: string[];
  metrics: { label: string; value: string; sublabel?: string; icon: string }[];
  archLayers: { name: string; tech: string[]; color: string; description: string }[];
  patterns: string[];
  challenges: string[];
  media: { type: "image" | "video" | "gif"; src: string; caption: string; thumbnail?: string }[];
  scc: { code: string; title: string; evidence: string; level: "básico" | "intermedio" | "avanzado" }[];
}

// ═══════════════════════════════════════════════════════════
//  DATOS
// ═══════════════════════════════════════════════════════════

export const RUNIC_PROJECTS: RunicProject[] = [
  {
    id: 1, rune: "ᚠ", runeName: "Fehu",
    title: "Tienda Online", subtitle: "E-commerce full-stack",
    tech: "Next.js 15, React 19, Tailwind CSS, FastAPI, SQLAlchemy, Docker",
    stack: ["Next.js 15","React 19","FastAPI","Docker","PostgreSQL","Stripe"],
    link: "https://github.com/Karatsuyu/Tienda-Online.git",
    video: "/videos/2025-10-13 17-20-25.mp4",
    type: "freelance", period: "Feb 2024 – Abr 2024",
    problem: "Pequeños comercios sin venta online sin pagar comisiones a marketplaces. Necesitaban tienda propia con control total del inventario y pagos.",
    solution: "E-commerce completo con catálogo dinámico, carrito persistente, checkout Stripe, panel admin y Docker. Comisión: 0%.",
    role: "Full Stack Developer · DevOps — arquitectura end-to-end: frontend Next.js, API FastAPI, integración Stripe y despliegue Docker.",
    highlights: ["Carrito persistente con JWT sync servidor/cliente","Webhooks Stripe idempotentes para órdenes seguras","SSR Next.js 15 App Router — carga < 1.2s","Docker Compose 4 servicios contenerizados","Panel admin con inventario, órdenes y CSV"],
    metrics: [
      { label: "Lighthouse", value: "94", sublabel: "/100", icon: "⚡" },
      { label: "Carga", value: "<1.2s", sublabel: "FCP", icon: "🚀" },
      { label: "Tests", value: "72%", sublabel: "cobertura", icon: "✅" },
      { label: "Endpoints", value: "38", sublabel: "OpenAPI", icon: "📡" },
      { label: "Checkout", value: "-40%", sublabel: "tiempo", icon: "💳" },
      { label: "Uptime", value: "99.5%", sublabel: "Docker", icon: "🛡" },
    ],
    archLayers: [
      { name: "Frontend", tech: ["Next.js 15","React 19","Tailwind","React Query"], color: "#3b82f6", description: "SPA con SSR selectivo y rutas protegidas por rol." },
      { name: "API", tech: ["FastAPI","Pydantic v2","JWT"], color: "#9400ff", description: "API REST asíncrona con validación y auth stateless." },
      { name: "Base de datos", tech: ["PostgreSQL 15","SQLAlchemy 2","Redis"], color: "#10b981", description: "ORM con migraciones. Redis para sesiones y caché." },
      { name: "Infra", tech: ["Docker Compose","Nginx","GitHub Actions"], color: "#f59e0b", description: "4 servicios en contenedores. CI/CD básico." },
    ],
    patterns: ["Repository Pattern","JWT Stateless","Webhook Idempotency","SSR + Hydration"],
    challenges: ["Sincronizar carrito entre sesiones anónimas y autenticadas sin duplicados","Webhooks Stripe con idempotency keys en reintentos","Nginx SSL auto-renovable dentro de Docker Compose"],
    media: [{ type: "video", src: "/videos/2025-10-13 17-20-25.mp4", caption: "Demo flujo de compra completo", thumbnail: "/NextWebsite.png" }],
    scc: [
      { code: "SCC.E.3", title: "Paradigmas", evidence: "React declarativo, FastAPI asíncrono, SQLAlchemy OOP.", level: "avanzado" },
      { code: "SCC.E.4", title: "Interfaces", evidence: "UI responsiva Tailwind, flujo 3 pasos evaluado con testers.", level: "avanzado" },
      { code: "SCC.E.8", title: "Alternativas", evidence: "FastAPI vs Django REST, Stripe vs PayPal documentado.", level: "intermedio" },
      { code: "SCC.E.9", title: "Documentación", evidence: "OpenAPI auto, Docker reproducible, README 5 pasos.", level: "avanzado" },
    ],
  },
  {
    id: 2, rune: "ᚷ", runeName: "Gebo",
    title: "Delicious Food", subtitle: "Delivery + pagos",
    tech: "Django 5.2, DRF, SQLite, JWT, Stripe, React 19, Vite",
    stack: ["Django 5.2","DRF","React 19","Stripe","Celery","Redis"],
    link: "https://github.com/Karatsuyu/delicious-food-app.git",
    video: "/videos/2025-12-03 12-26-20.mp4",
    type: "freelance", period: "Jul 2024 – Sep 2024",
    problem: "Restaurante local perdía 30% de pedidos por teléfono. Rappi cobraba 25-30% comisión por pedido.",
    solution: "Plataforma propia de delivery con combos personalizados, Stripe y dashboard del dueño. Comisión: 0%.",
    role: "Full Stack Developer — combos personalizados, integración Stripe, WebSocket notificaciones, analytics.",
    highlights: ["Combos personalizados compartibles entre usuarios","Stripe Checkout con reembolsos automáticos","WebSocket en tiempo real para estado de pedido","Dashboard dueño: ventas, platos top, inventario","Pedidos online +35% en el primer mes"],
    metrics: [
      { label: "Pedidos", value: "+35%", sublabel: "primer mes", icon: "📈" },
      { label: "Carga", value: "<1.5s", sublabel: "Vite lazy", icon: "⚡" },
      { label: "Endpoints", value: "45", sublabel: "DRF + JWT", icon: "📡" },
      { label: "Tests", value: "68%", sublabel: "Django + Jest", icon: "✅" },
      { label: "Beta testers", value: "20+", sublabel: "restaurante", icon: "👥" },
      { label: "Pagos", value: "100%", sublabel: "Stripe prod", icon: "💳" },
    ],
    archLayers: [
      { name: "Frontend", tech: ["React 19","Vite","React Router","Axios"], color: "#f97316", description: "SPA carrito en Context API persistente." },
      { name: "Backend", tech: ["Django 5.2","DRF","Channels","Celery"], color: "#9400ff", description: "REST + WebSockets. Celery para emails async." },
      { name: "Datos", tech: ["SQLite/PostgreSQL","Redis"], color: "#10b981", description: "Redis como broker Celery y caché." },
      { name: "Pagos", tech: ["Stripe Checkout","Webhooks"], color: "#3b82f6", description: "Flujo seguro con signature verification." },
    ],
    patterns: ["Django MVT","Context API + Reducer","Webhook Signature Verification","Observer (Django Signals)"],
    challenges: ["Modelar combos many-to-many con variantes opcionales sin explotar complejidad","Sincronizar estado pedido via WebSocket sin race conditions","Optimizar N+1 queries en combos populares con prefetch_related"],
    media: [{ type: "video", src: "/videos/2025-12-03 12-26-20.mp4", caption: "Sistema de combos y checkout Stripe", thumbnail: "/CardImage.png" }],
    scc: [
      { code: "SCC.E.3", title: "Paradigmas", evidence: "Django MVT (OOP), React hooks funcionales, Channels async.", level: "avanzado" },
      { code: "SCC.E.4", title: "Interfaces", evidence: "UI combos con feedback inmediato, checkout 3 pasos.", level: "intermedio" },
      { code: "SCC.E.5", title: "Usabilidad", evidence: "20 testers, rediseño flujo 2 veces antes de lanzar.", level: "intermedio" },
      { code: "SCC.E.9", title: "Documentación", evidence: "DRF Spectacular API docs, guía webhooks Stripe.", level: "intermedio" },
    ],
  },
  {
    id: 3, rune: "ᚱ", runeName: "Raidho",
    title: "ParkingPro SaaS", subtitle: "Tiempo real multi-tenant",
    tech: "Node.js 18, Express, PostgreSQL 15, Redis 7, Socket.IO, React 18",
    stack: ["Node.js 18","Express","PostgreSQL 15","Redis 7","Socket.IO","React 18"],
    link: "https://github.com/Karatsuyu/parking-app.git",
    video: "/videos/2025-10-23 17-08-31.mp4",
    type: "academic", period: "Mar 2024 – Jun 2024",
    problem: "Parqueaderos con papel sin visibilidad en tiempo real de ocupación ni facturación automatizada.",
    solution: "SaaS multi-tenant con WebSockets para 200+ espacios en tiempo real, tarifas configurables y analytics.",
    role: "Full Stack Developer y Arquitecto — multi-tenant, WebSockets Redis pub/sub, liderazgo Scrum.",
    highlights: ["WebSockets + Redis pub/sub — 200+ conexiones sin latencia","Multi-tenancy schema-per-tenant PostgreSQL","Tarifas configurables: hora, día, mes, tipo vehículo","Dashboard React + Recharts en tiempo real","Nota 4.8/5.0 — caso de estudio Arquitectura"],
    metrics: [
      { label: "Nota", value: "4.8/5", sublabel: "mejor cohorte", icon: "🏆" },
      { label: "Conexiones WS", value: "200+", sublabel: "sin latencia", icon: "⚡" },
      { label: "Uptime demo", value: "99%", sublabel: "AWS EC2", icon: "🛡" },
      { label: "Endpoints", value: "50+", sublabel: "Swagger", icon: "📡" },
      { label: "Sprints", value: "6", sublabel: "Scrum 2 sem", icon: "📋" },
      { label: "Schemas PG", value: "5+", sublabel: "tenants", icon: "🗄" },
    ],
    archLayers: [
      { name: "Frontend", tech: ["React 18","TypeScript","Recharts","Socket.IO Client"], color: "#f59e0b", description: "Dashboard gráficas en tiempo real, Context + Reducer." },
      { name: "API REST", tech: ["Node.js 18","Express 4","JWT","Joi"], color: "#9400ff", description: "50+ endpoints, auth por rol (admin/operador/visitante)." },
      { name: "Tiempo Real", tech: ["Socket.IO 4","Redis 7 pub/sub"], color: "#ef4444", description: "Redis pub/sub para sync entre instancias del servidor." },
      { name: "Persistencia", tech: ["PostgreSQL 15","Schema-per-tenant","Redis Cache"], color: "#10b981", description: "Aislamiento por schema. Redis caché espacios activos." },
    ],
    patterns: ["Multi-tenant (Schema per tenant)","CQRS","Observer WebSocket","Repository","Strategy (tarifas)"],
    challenges: ["Redis pub/sub para estado compartido entre instancias sin race conditions al escalar","Multi-tenant schema-per-tenant sin afectar queries cross-tenant","Reconexión WebSocket automática en cliente sin perder estado de la vista"],
    media: [{ type: "video", src: "/videos/2025-10-23 17-08-31.mp4", caption: "Sistema tiempo real — entrada/salida vehículos", thumbnail: "/SpaceWebsite.png" }],
    scc: [
      { code: "SCC.E.3", title: "Paradigmas", evidence: "Node.js async/await, React funcional, Redis Observer Pattern.", level: "avanzado" },
      { code: "SCC.E.6", title: "Seguridad", evidence: "Schema isolation, JWT rotación, CORS por tenant, Joi.", level: "intermedio" },
      { code: "SCC.E.7", title: "Infraestructura", evidence: "AWS EC2, Docker Compose, Nginx, SSL Let's Encrypt.", level: "básico" },
      { code: "SCC.E.8", title: "Alternativas", evidence: "Socket.IO vs SSE vs Long Polling; schema vs row-level.", level: "intermedio" },
      { code: "SCC.E.9", title: "Documentación", evidence: "Diagramas C4, Swagger UI, guía AWS, presentación técnica.", level: "avanzado" },
    ],
  },
  {
    id: 4, rune: "ᛉ", runeName: "Algiz",
    title: "Sistema Registral", subtitle: "Gestión documental RBAC",
    tech: "Node.js, Express, PostgreSQL, React (Vite), MVC",
    stack: ["Node.js 18","Express","PostgreSQL 15","React","Redis","JWT"],
    link: "https://github.com/Karatsuyu/Registradur-a-De-Colombia.git",
    video: "/videos/2025-10-21 09-59-56.mp4",
    type: "job", period: "Jun 2024 – Dic 2024",
    problem: "Proceso registral manual — 3 días por trámite, errores por duplicados. Necesidad de digitalizar flujos de aprobación multinivel.",
    solution: "Sistema con RBAC 4 roles, flujos de aprobación como máquina de estados, búsqueda GIN full-text y auditoría inviolable con triggers PostgreSQL.",
    role: "Backend Developer — 52 endpoints, RBAC, flujos aprobación máquina de estados, auditoría con triggers PG.",
    highlights: ["RBAC 4 roles con permisos granulares por recurso","Auditoría inviolable — triggers PG, imposible modificar desde app","Reducción tiempo procesamiento 3 días → 4 horas (60%)","Full-text search con GIN en PostgreSQL — < 200ms","500+ documentos/día en producción sin incidentes"],
    metrics: [
      { label: "Tiempo -", value: "60%", sublabel: "3d → 4h", icon: "⏱" },
      { label: "Docs/día", value: "500+", sublabel: "producción", icon: "📄" },
      { label: "Endpoints", value: "52", sublabel: "RBAC granular", icon: "📡" },
      { label: "Roles", value: "4", sublabel: "por recurso", icon: "👥" },
      { label: "Uptime", value: "99.8%", sublabel: "6 meses", icon: "🛡" },
      { label: "Búsqueda", value: "<200ms", sublabel: "GIN index", icon: "🔍" },
    ],
    archLayers: [
      { name: "Frontend", tech: ["React 18","Vite","React Hook Form","React Table"], color: "#22c55e", description: "Formularios con validación en tiempo real. Tablas con paginación." },
      { name: "API", tech: ["Node.js 18","Express","Joi","JWT + Refresh"], color: "#9400ff", description: "52 endpoints con middleware RBAC. Rate limiting por usuario." },
      { name: "Base de datos", tech: ["PostgreSQL 15","Redis","GIN Full-Text","Triggers"], color: "#3b82f6", description: "GIN para búsqueda. Triggers para auditoría inviolable." },
      { name: "Notificaciones", tech: ["Nodemailer","HTML Templates","Cron"], color: "#f59e0b", description: "Emails transaccionales. Cron para recordatorios pendientes." },
    ],
    patterns: ["RBAC","Audit Log Pattern","Repository + Unit of Work","Specification Pattern"],
    challenges: ["RBAC extensible sin modificar código al agregar roles (Open/Closed)","Flujo aprobación como máquina de estados con rechazos parciales y reasignaciones","Auditoría con triggers PG imposible de modificar desde la aplicación"],
    media: [{ type: "video", src: "/videos/2025-10-21 09-59-56.mp4", caption: "Gestión documental y sistema RBAC", thumbnail: "" }],
    scc: [
      { code: "SCC.E.3", title: "Paradigmas", evidence: "Node.js funcional (middleware chain), PG triggers procedural.", level: "avanzado" },
      { code: "SCC.E.6", title: "Seguridad", evidence: "RBAC granular, JWT refresh, audit log PG inviolable.", level: "avanzado" },
      { code: "SCC.E.9", title: "Documentación", evidence: "Swagger, ER diagrams, manual usuario, guía roles.", level: "intermedio" },
    ],
  },
  {
    id: 5, rune: "ᚢ", runeName: "Uruz",
    title: "MiSalud", subtitle: "Health risk prediction PWA",
    tech: "Django 4, DRF, SimpleJWT, React, Vite, Tailwind CSS",
    stack: ["Django 5","DRF","React","Tailwind","PWA","PostgreSQL"],
    link: "https://github.com/Karatsuyu/Mi-Salud.git",
    video: "/videos/2025-12-03 15-27-11.mp4",
    type: "academic", period: "Sep 2024 – Dic 2024",
    problem: "Sin forma simple de monitorear hábitos y recibir alertas tempranas. Apps médicas complejas o requieren dispositivos costosos.",
    solution: "PWA para registrar hábitos, predecir riesgo con 8 indicadores configurables. Funciona 100% offline.",
    role: "Full Stack Developer — arquitectura, modelo scoring ponderado, PWA Service Worker offline.",
    highlights: ["Scoring de riesgo 8 indicadores ponderados y configurables","PWA offline 100% con Workbox — sincroniza al reconectar","OAuth2 Google + 2FA TOTP (Google Authenticator)","AES-256 para datos médicos antes de persistir","🏆 Mejor Proyecto Capstone 2024 · Nota 5.0/5.0"],
    metrics: [
      { label: "Nota", value: "5.0/5", sublabel: "Mejor Capstone 🏆", icon: "🏆" },
      { label: "Lighthouse", value: "91", sublabel: "PWA score", icon: "⚡" },
      { label: "Indicadores", value: "8", sublabel: "scoring riesgo", icon: "🏥" },
      { label: "Offline", value: "100%", sublabel: "Service Worker", icon: "📱" },
      { label: "Seguridad", value: "AES-256", sublabel: "datos médicos", icon: "🔐" },
      { label: "Beta", value: "15", sublabel: "testers", icon: "👥" },
    ],
    archLayers: [
      { name: "Frontend PWA", tech: ["React 18","Tailwind","Recharts","Workbox"], color: "#06b6d4", description: "PWA instalable. Caché offline Workbox. Gráficas 30 días." },
      { name: "Backend", tech: ["Django 5","DRF","OAuth2","TOTP 2FA","Celery"], color: "#9400ff", description: "Auth OAuth2 + 2FA TOTP. Celery para recordatorios." },
      { name: "Seguridad", tech: ["PostgreSQL","AES-256","Redis","cryptography"], color: "#ef4444", description: "Cifrado campos sensibles antes de persistir." },
      { name: "Algoritmo", tech: ["Python","Pandas","Scoring ponderado"], color: "#10b981", description: "8 indicadores ajustables. Exporta a CSV." },
    ],
    patterns: ["PWA (Service Worker + Cache API)","OAuth2 + TOTP MFA","Strategy (scoring)","Decorator (cifrado)"],
    challenges: ["Service Worker offline con sincronización sin conflictos al reconectar","Scoring transparente — usuario entiende contribución de cada indicador","AES-256 transparente a nivel modelo sin afectar búsquedas"],
    media: [{ type: "video", src: "/videos/2025-12-03 15-27-11.mp4", caption: "Dashboard hábitos y predicción de riesgo", thumbnail: "" }],
    scc: [
      { code: "SCC.E.3", title: "Paradigmas", evidence: "Django OOP + decoradores, React funcional, Pandas scoring.", level: "avanzado" },
      { code: "SCC.E.4", title: "Interfaces", evidence: "PWA instalable móvil, WCAG 2.1 AA, modo oscuro, gráficas.", level: "avanzado" },
      { code: "SCC.E.5", title: "Usabilidad", evidence: "15 testers think-aloud, 3 iteraciones del flujo de registro.", level: "intermedio" },
      { code: "SCC.E.6", title: "Seguridad", evidence: "OAuth2 + 2FA, AES-256, HTTPS, CSP, validación Zod + DRF.", level: "avanzado" },
    ],
  },
  {
    id: 6, rune: "ᚲ", runeName: "Kenaz",
    title: "Portfolio Web", subtitle: "Sitio profesional responsive",
    tech: "HTML5, CSS3, JavaScript Vanilla, Responsive Design",
    stack: ["HTML5","CSS3","JavaScript","GSAP","CSS Grid","Flexbox"],
    link: "https://github.com/Karatsuyu/Mi-Hoja-De-Vida.git",
    video: "/videos/2025-10-23 18-00-50.mp4",
    type: "personal", period: "Ene 2024 – Feb 2024",
    problem: "Portfolio profesional responsive ultra-rápido sin frameworks. Instalable, accesible, Lighthouse cercano a 100.",
    solution: "Portfolio static HTML/CSS/JS puro — 0 dependencias. Animaciones CSS nativas, tema oscuro/claro, sidebar sticky.",
    role: "Frontend Developer y Designer — sistema visual completo, maquetación, animaciones y optimización.",
    highlights: ["Lighthouse 98/100 — 0 dependencias externas","100% responsive: mobile, tablet, desktop con CSS Grid","Animaciones CSS avanzadas sin librerías (keyframes)","Tema oscuro/claro con CSS custom properties + localStorage","WCAG 2.1 AA — navegable 100% con teclado"],
    metrics: [
      { label: "Lighthouse", value: "98", sublabel: "/100 perf", icon: "⚡" },
      { label: "Deps", value: "0", sublabel: "JS puro", icon: "📦" },
      { label: "Carga", value: "<1s", sublabel: "FCP", icon: "🚀" },
      { label: "A11y", value: "100", sublabel: "Lighthouse", icon: "♿" },
      { label: "Secciones", value: "8", sublabel: "documentadas", icon: "📄" },
      { label: "Responsive", value: "100%", sublabel: "3 breakpoints", icon: "📱" },
    ],
    archLayers: [
      { name: "Estructura", tech: ["HTML5 semántico","ARIA roles","Meta SEO"], color: "#f59e0b", description: "HTML semántico con roles ARIA para accesibilidad." },
      { name: "Estilos", tech: ["CSS3","Custom Properties","CSS Grid","Flexbox"], color: "#9400ff", description: "Sistema de diseño con variables CSS. Sin frameworks." },
      { name: "Interactividad", tech: ["JavaScript ES6+","IntersectionObserver","localStorage"], color: "#3b82f6", description: "Animaciones scroll con IO. Persistencia tema." },
    ],
    patterns: ["BEM (CSS)","Progressive Enhancement","CSS Custom Properties"],
    challenges: ["Animaciones scroll complejas sin librerías manteniendo 98/100 Lighthouse","Tema oscuro/claro sin flash al recargar usando script inline en <head>"],
    media: [{ type: "video", src: "/videos/2025-10-23 18-00-50.mp4", caption: "Portfolio responsive con tema oscuro/claro", thumbnail: "" }],
    scc: [
      { code: "SCC.E.4", title: "Interfaces", evidence: "CSS Grid responsiva, accesible WCAG 2.1, 98/100 Lighthouse.", level: "avanzado" },
      { code: "SCC.E.5", title: "Usabilidad", evidence: "Navegación teclado 100%, ARIA todos los elementos, contraste 4.5:1.", level: "avanzado" },
    ],
  },
  {
    id: 7, rune: "ᚹ", runeName: "Wunjo",
    title: "Lavelo Pues", subtitle: "API REST + desktop Tkinter",
    tech: "Django 5.x, DRF, Python Tkinter (GUI), SQLite",
    stack: ["Django 4.2","DRF","Tkinter","SQLite","JWT","requests"],
    link: "https://github.com/Karatsuyu/Lavelo-Pues.git",
    video: "/videos/1014 (1)(1).mp4",
    type: "academic", period: "Jul 2023 – Nov 2023",
    problem: "Lavadero de carros con cuadernos físicos. Información perdida, sin estadísticas, proceso de cobro lento.",
    solution: "API REST Django + cliente desktop Tkinter desacoplado. CRUD clientes, servicios, pagos y reportes diarios.",
    role: "Full Stack Developer — API DRF y cliente Tkinter desde cero. Primer proyecto en negocio real.",
    highlights: ["API REST completa con DRF y JWT","Cliente Tkinter desacoplado consumiendo la API","Cola de turnos con estimación de tiempo","Reportes diarios de ingresos imprimibles","Sistema en uso 3 meses en negocio real"],
    metrics: [
      { label: "Meses prod.", value: "3+", sublabel: "negocio real", icon: "🏭" },
      { label: "Endpoints", value: "18", sublabel: "CRUD + JWT", icon: "📡" },
      { label: "Tiempo -", value: "-70%", sublabel: "vs manual", icon: "⏱" },
      { label: "Clientes", value: "50+", sublabel: "registrados", icon: "👥" },
      { label: "Tests", value: "60%", sublabel: "Django TestCase", icon: "✅" },
      { label: "Servicios/día", value: "15+", sublabel: "promedio", icon: "🚗" },
    ],
    archLayers: [
      { name: "Cliente Desktop", tech: ["Python 3.11","Tkinter","ttk","requests"], color: "#3b82f6", description: "Multi-ventana. Llama a la API con requests y maneja JWT." },
      { name: "API REST", tech: ["Django 4.2","DRF","JWT","SQLite"], color: "#9400ff", description: "18 endpoints para clientes, servicios y pagos." },
    ],
    patterns: ["REST Client desacoplado","JWT Stateless","MVC (Django MVT)","Repository (DRF ViewSets)"],
    challenges: ["JWT en Tkinter sin gestor de estado — singleton con renovación automática","UI Tkinter con feedback visual suficiente para usuarios no técnicos"],
    media: [{ type: "video", src: "/videos/1014 (1)(1).mp4", caption: "Gestión de lavadero con API + Tkinter", thumbnail: "" }],
    scc: [
      { code: "SCC.E.3", title: "Paradigmas", evidence: "Django MVT (OOP), Tkinter orientado a eventos, REST cliente-servidor.", level: "intermedio" },
      { code: "SCC.E.9", title: "Documentación", evidence: "README instalación, manual dueño no técnico, scripts configuración.", level: "básico" },
    ],
  },
  {
    id: 8, rune: "ᚦ", runeName: "Thurisaz",
    title: "Sistema Bancario", subtitle: "Desktop OOP avanzado",
    tech: "Python 3.x, Tkinter (GUI), Archivos .txt, POO",
    stack: ["Python 3.11","Tkinter","POO","Archivos .txt","unittest"],
    link: "https://github.com/Karatsuyu/Banco.git",
    video: "/videos/1014 (1).mp4",
    type: "academic", period: "Mar 2023 – Jun 2023",
    problem: "Proyecto Fundamentos de Programación: simular sistema bancario completo demostrando POO, herencia, polimorfismo y persistencia sin BD.",
    solution: "Desktop Python con Tkinter para clientes, cuentas (corriente/ahorro) y transacciones. Persistencia en .txt con formato propio.",
    role: "Desarrollador completo — jerarquía clases, GUI multi-ventana, persistencia propia desde cero.",
    highlights: ["Jerarquía: Persona → Cliente → CuentaBase → Corriente/Ahorro","Polimorfismo real: calcularInteres() diferente por tipo","Persistencia .txt atómica sin ORM — no corrompe datos","8 ventanas Tkinter multi-ventana","Nota 4.9/5.0 — mejor proyecto Fundamentos"],
    metrics: [
      { label: "Nota", value: "4.9/5", sublabel: "mejor semestre", icon: "🏆" },
      { label: "Clases POO", value: "12+", sublabel: "herencia 3 niveles", icon: "🏗" },
      { label: "Ventanas", value: "8", sublabel: "Tkinter multi", icon: "🖥" },
      { label: "Pruebas", value: "25+", sublabel: "manuales doc.", icon: "✅" },
      { label: "Tipos cuenta", value: "2", sublabel: "polimórficos", icon: "🏦" },
      { label: "Líneas", value: "1200+", sublabel: "Python doc.", icon: "💻" },
    ],
    archLayers: [
      { name: "GUI", tech: ["Tkinter","ttk","Python 3.11"], color: "#a855f7", description: "8 ventanas independientes con navegación." },
      { name: "Lógica", tech: ["POO","Herencia","Polimorfismo","Excepciones custom"], color: "#9400ff", description: "Jerarquía 3 niveles. Validaciones encapsuladas." },
      { name: "Persistencia", tech: ["Archivos .txt","Parsing custom","Serialización manual"], color: "#3b82f6", description: "Formato propio sin ORM. Transacciones atómicas." },
    ],
    patterns: ["Herencia OOP","Polimorfismo","Singleton (gestor archivo)","Factory Method (cuentas)","Template Method (reportes)"],
    challenges: ["Herencia extensible para nuevos tipos de cuenta sin modificar código (Open/Closed)","Persistencia .txt atómica — si falla a mitad no corrompe datos","Navegación 8 ventanas Tkinter con estado compartido de sesión"],
    media: [{ type: "video", src: "/videos/1014 (1).mp4", caption: "Sistema bancario desktop POO avanzada", thumbnail: "" }],
    scc: [
      { code: "SCC.E.1", title: "Fundamentos", evidence: "Estructuras de control, funciones, excepciones custom, recursión.", level: "avanzado" },
      { code: "SCC.E.2", title: "POO", evidence: "Herencia 3 niveles, polimorfismo real, encapsulamiento, Factory Method.", level: "avanzado" },
      { code: "SCC.E.3", title: "Paradigmas", evidence: "POO principal + programación estructurada en módulos persistencia.", level: "intermedio" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
//  CÍRCULO MÁGICO CON RUNAS GIRATORIAS
// ═══════════════════════════════════════════════════════════

// Las 24 runas del Futhark antiguo
const RUNES = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ",
               "ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

const runeCircleCSS = `
.mrc-scene{
  position:relative;
  display:flex; align-items:center; justify-content:center;
  border-radius:50%;
  background:radial-gradient(circle at center, #17082b 0%, #0b0417 55%, #06020c 100%);
  box-shadow:0 0 60px rgba(160,32,240,.25), inset 0 0 40px rgba(160,32,240,.15);
}
.mrc-halo{
  position:absolute; width:72%; height:72%; border-radius:50%;
  background:radial-gradient(circle, rgba(194,107,255,.30) 0%, rgba(160,32,240,.12) 45%, transparent 70%);
  filter:blur(8px);
  animation:mrc-pulse 4s ease-in-out infinite;
}
.mrc-border{
  position:absolute; border-radius:50%;
  border:2px solid rgba(194,107,255,.8);
  animation:mrc-glow 3s ease-in-out infinite;
}
.mrc-ring{
  position:absolute; inset:0; pointer-events:none;
  animation:mrc-spin var(--speed,24s) linear infinite;
  will-change:transform;
}
.mrc-ring--inner{ animation-direction:reverse; }
.mrc-rune{
  position:absolute; left:50%; top:50%;
  font-family:'Noto Sans Runic', sans-serif;
  color:#eecbff; user-select:none;
  text-shadow:0 0 4px #f3dcff, 0 0 10px #c26bff, 0 0 22px #a020f0, 0 0 42px #7a00d6;
  animation:mrc-flicker 2.6s ease-in-out infinite;
}
.mrc-core{
  position:absolute; width:16%; height:16%; border-radius:50%;
  background:radial-gradient(circle, #f6e7ff 0%, #c26bff 40%, rgba(160,32,240,0) 75%);
  filter:blur(1px);
  animation:mrc-pulse 3s ease-in-out infinite;
}
@keyframes mrc-spin{ to{ transform:rotate(360deg); } }
@keyframes mrc-pulse{
  0%,100%{ transform:scale(1); opacity:.85; }
  50%{ transform:scale(1.1); opacity:1; }
}
@keyframes mrc-flicker{ 0%,100%{ opacity:1; } 50%{ opacity:.6; } }
@keyframes mrc-glow{
  0%,100%{ box-shadow:0 0 10px #a020f0, inset 0 0 10px rgba(160,32,240,.7); }
  50%{ box-shadow:0 0 22px #c26bff, inset 0 0 18px rgba(194,107,255,.9); }
}
`;

function MagicRuneCircle({ size = 260, speed = 24 }: { size?: number; speed?: number }) {
  const outerR = size / 2 - size * 0.10;  // radio anillo exterior
  const innerR = size / 2 - size * 0.26;  // radio anillo interior

  return (
    <div className="mrc-scene" style={{ width: size, height: size }}>
      <style>{runeCircleCSS}</style>

      <div className="mrc-halo" />
      <div className="mrc-border" style={{ inset: size * 0.015 }} />
      <div className="mrc-border" style={{ inset: size * 0.19 }} />

      {/* Anillo exterior: gira en sentido horario */}
      <div className="mrc-ring" style={{ "--speed": `${speed}s` } as React.CSSProperties}>
        {RUNES.map((r, i) => (
          <span key={i} className="mrc-rune"
            style={{
              fontSize: size * 0.085,
              transform: `translate(-50%,-50%) rotate(${(360 / RUNES.length) * i}deg) translateY(-${outerR}px)`,
              animationDelay: `${-i * 0.2}s`,
            }}>
            {r}
          </span>
        ))}
      </div>

      {/* Anillo interior: gira al revés */}
      <div className="mrc-ring mrc-ring--inner" style={{ "--speed": `${speed * 1.6}s` } as React.CSSProperties}>
        {RUNES.map((r, i) => (
          <span key={i} className="mrc-rune"
            style={{
              fontSize: size * 0.05,
              transform: `translate(-50%,-50%) rotate(${(360 / RUNES.length) * i + 7.5}deg) translateY(-${innerR}px)`,
              animationDelay: `${-i * 0.15}s`,
            }}>
            {r}
          </span>
        ))}
      </div>

      <div className="mrc-core" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PANEL IZQUIERDO — Círculo + info + orbes de métricas
// ═══════════════════════════════════════════════════════════

function LeftPanel({ p }: { p: RunicProject }) {
  const TYPE_META = {
    academic:  { label: "Académico",  color: "#a855f7" },
    freelance: { label: "Freelance",  color: "#00ff88" },
    job:       { label: "Práctica",   color: "#ff6b6b" },
    personal:  { label: "Personal",   color: "#38bdf8" },
  };
  const m = TYPE_META[p.type];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1.5rem 1.2rem",
      borderRight: "1px solid rgba(148,0,255,0.2)",
      position: "relative",
      overflow: "hidden",
      height: "100%",
    }}>
      {/* Runas decorativas en las esquinas */}
      {[
        { rune: "ᚠ", top: "0.5rem", left: "0.5rem" },
        { rune: "ᚷ", top: "0.5rem", right: "0.5rem" },
        { rune: "ᚱ", bottom: "0.5rem", left: "0.5rem" },
        { rune: "ᚹ", bottom: "0.5rem", right: "0.5rem" },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          fontFamily: "'Noto Sans Runic', serif",
          fontSize: "1.4rem",
          color: "rgba(148,0,255,0.18)",
          animation: `floatRune ${4 + i}s ease-in-out ${i * 0.5}s infinite alternate`,
          ...({ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom } as React.CSSProperties),
        }}>
          {pos.rune}
        </div>
      ))}

      {/* Círculo mágico con runas giratorias */}
      <div style={{
        width: "260px",
        height: "260px",
        position: "relative",
        flexShrink: 0,
      }}>
        <MagicRuneCircle size={260} speed={24} />

        {/* Info superpuesta en el centro del círculo */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'Noto Sans Runic', serif",
            fontSize: "2.6rem",
            color: "hsl(280,100%,50%)",
            filter: "drop-shadow(0 0 12px hsla(280,100%,50%,0.9))",
            lineHeight: 1,
          }}>
            {p.rune}
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: "rgba(200,160,255,0.5)",
            marginTop: "0.3rem",
            textTransform: "uppercase",
          }}>
            {p.runeName}
          </div>
        </div>
      </div>

      {/* Título y badges */}
      <div style={{ textAlign: "center", marginTop: "1rem", width: "100%" }}>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: "1.3rem",
          color: "#fff",
          margin: "0 0 0.3rem",
          lineHeight: 1.2,
        }}>
          {p.title}
        </h2>
        <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "rgba(200,160,255,0.6)", margin: "0 0 0.8rem" }}>
          {p.subtitle}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          <span style={{
            fontSize: "0.75rem", padding: "0.3rem 0.8rem", borderRadius: "20px",
            background: `${m.color}15`, border: `1px solid ${m.color}35`, color: m.color,
          }}>
            {p.rune} {m.label}
          </span>
          <span style={{ fontSize: "0.72rem", color: "rgba(200,180,240,0.4)", fontFamily: "monospace", padding: "0.3rem 0" }}>
            {p.period}
          </span>
        </div>
      </div>

      {/* Divisor rúnico */}
      <div style={{
        width: "100%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(148,0,255,0.5), transparent)",
        boxShadow: "0 0 8px rgba(148,0,255,0.3)",
        margin: "0.7rem 0",
      }} />

      {/* Orbes de métricas — grid 3x2 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.5rem",
        width: "100%",
        marginTop: "0.4rem",
      }}>
        {p.metrics.map((met, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0.6rem 0.3rem",
              background: "rgba(148,0,255,0.06)",
              border: "1px solid rgba(148,0,255,0.2)",
              borderRadius: "8px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow top */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(148,0,255,0.6), transparent)",
            }} />
            <div style={{ fontSize: "1.1rem", marginBottom: "0.15rem" }}>{met.icon}</div>
            <div style={{
              fontFamily: "monospace", fontWeight: 800, fontSize: "1rem",
              color: "hsl(280,100%,50%)",
              textShadow: "0 0 10px hsla(280,100%,50%,0.7)",
              lineHeight: 1,
            }}>
              {met.value}
            </div>
            <div style={{ fontSize: "0.62rem", color: "rgba(200,160,255,0.6)", marginTop: "0.2rem", lineHeight: 1.2 }}>
              {met.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Links */}
      {p.link && (
        <a href={p.link} target="_blank" rel="noopener noreferrer"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.65rem",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            border: "1px solid rgba(148,0,255,0.3)",
            color: "rgba(200,160,255,0.7)",
            background: "rgba(148,0,255,0.07)",
            borderRadius: "6px",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(148,0,255,0.7)";
            (e.currentTarget as HTMLAnchorElement).style.color = "hsl(280,100%,70%)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(148,0,255,0.3)";
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(200,160,255,0.7)";
          }}
        >
          <span style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "0.9rem" }}>ᚠ</span>
          Ver en GitHub
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RUNIC WHEEL NAV — menú en arco de runas
// ═══════════════════════════════════════════════════════════

type TabId = "vision" | "metricas" | "arquitectura" | "galeria" | "desafios" | "scc";

const TABS: { id: TabId; rune: string; runeName: string; label: string }[] = [
  { id: "vision",       rune: "ᚠ", runeName: "Fehu",    label: "Visión"       },
  { id: "metricas",     rune: "ᚢ", runeName: "Uruz",    label: "Métricas"     },
  { id: "arquitectura", rune: "ᚦ", runeName: "Thurisaz", label: "Arq."        },
  { id: "galeria",      rune: "ᚱ", runeName: "Raidho",  label: "Galería"      },
  { id: "desafios",     rune: "ᚲ", runeName: "Kenaz",   label: "Desafíos"     },
  { id: "scc",          rune: "ᚷ", runeName: "Gebo",    label: "SCC"          },
];

function RunicWheelNav({
  active,
  onSelect,
}: {
  active: TabId;
  onSelect: (id: TabId) => void;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "2px",
      padding: "0.5rem 0.75rem 0",
      flexShrink: 0,
      borderBottom: "1px solid rgba(148,0,255,0.15)",
      position: "relative",
    }}>
      {/* Línea mágica animada debajo de los tabs */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(148,0,255,0.15) 20%, rgba(148,0,255,0.5) 50%, rgba(148,0,255,0.15) 80%, transparent 100%)",
      }}>
        <motion.div
          animate={{ x: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", top: 0,
            width: "30%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(148,0,255,0.9), transparent)",
            boxShadow: "0 0 10px rgba(148,0,255,0.8)",
          }}
        />
      </div>

      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            whileHover={{ y: -2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "0.45rem 0.7rem 0.65rem",
              background: isActive ? "rgba(148,0,255,0.15)" : "transparent",
              border: "none",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
              flex: 1,
            }}
          >
            {/* Runa */}
            <span style={{
              fontFamily: "'Noto Sans Runic', serif",
              fontSize: "1.1rem",
              color: isActive ? "hsl(280,100%,65%)" : "rgba(148,0,255,0.4)",
              textShadow: isActive ? "0 0 12px hsla(280,100%,50%,0.8)" : "none",
              transition: "all 0.2s",
              filter: isActive ? "drop-shadow(0 0 6px hsla(280,100%,50%,0.7))" : "none",
              lineHeight: 1,
            }}>
              {tab.rune}
            </span>

            {/* Label */}
            <span style={{
              fontSize: "0.6rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "rgba(230,210,255,0.9)" : "rgba(200,180,240,0.35)",
              letterSpacing: "0.03em",
              transition: "color 0.2s",
              lineHeight: 1,
            }}>
              {tab.label}
            </span>

            {/* RuneName micro */}
            <span style={{
              fontSize: "0.5rem",
              fontFamily: "monospace",
              color: isActive ? "rgba(148,0,255,0.6)" : "rgba(148,0,255,0.18)",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}>
              {tab.runeName}
            </span>

            {/* Indicador activo — línea vertical a los lados del tab */}
            {isActive && (
              <>
                <motion.div layoutId="runicTabActive"
                  style={{
                    position: "absolute",
                    bottom: 0, left: "10%", right: "10%",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, hsl(280,100%,55%), transparent)",
                    boxShadow: "0 0 8px hsla(280,100%,50%,0.9)",
                  }}
                />
                {/* Puntos de luz en bordes */}
                <div style={{ position: "absolute", bottom: 0, left: "10%", width: 3, height: 3, borderRadius: "50%", background: "hsl(280,100%,70%)", boxShadow: "0 0 6px hsl(280,100%,50%)" }} />
                <div style={{ position: "absolute", bottom: 0, right: "10%", width: 3, height: 3, borderRadius: "50%", background: "hsl(280,100%,70%)", boxShadow: "0 0 6px hsl(280,100%,50%)" }} />
              </>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  TABS — CONTENIDO DEL PANEL DERECHO
// ═══════════════════════════════════════════════════════════

const ACCENT = "hsl(280,100%,50%)";
const ACCENT_MUTED = "hsla(280,100%,60%,0.5)";
const TEXT = "#e6eef6";
const MUTED = "rgba(200,180,240,0.55)";
const BORDER = "rgba(148,0,255,0.2)";

function RSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT_MUTED, marginBottom: "0.5rem" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function TabVision({ p }: { p: RunicProject }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Problema */}
      <div style={{ background: "rgba(255,80,80,0.05)", border: "1px solid rgba(255,80,80,0.14)", borderRadius: 8, padding: "0.85rem", borderLeft: "3px solid rgba(255,80,80,0.4)" }}>
        <div style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,100,100,0.55)", marginBottom: "0.35rem" }}>ᚦ Problema</div>
        <p style={{ fontSize: "0.78rem", color: TEXT, lineHeight: 1.65, margin: 0 }}>{p.problem}</p>
      </div>

      {/* Solución */}
      <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 8, padding: "0.85rem", borderLeft: "3px solid rgba(0,255,136,0.4)" }}>
        <div style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,255,136,0.5)", marginBottom: "0.35rem" }}>ᚷ Solución</div>
        <p style={{ fontSize: "0.78rem", color: TEXT, lineHeight: 1.65, margin: 0 }}>{p.solution}</p>
      </div>

      {/* Rol */}
      <div style={{ background: "rgba(148,0,255,0.05)", border: "1px solid rgba(148,0,255,0.15)", borderRadius: 8, padding: "0.75rem", borderLeft: "3px solid rgba(148,0,255,0.5)" }}>
        <div style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT_MUTED, marginBottom: "0.3rem" }}>ᚢ Mi rol</div>
        <p style={{ fontSize: "0.76rem", color: TEXT, margin: 0 }}>{p.role}</p>
      </div>

      {/* Highlights */}
      <RSection label="ᚹ Logros clave">
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {p.highlights.map((h, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.76rem", color: TEXT, lineHeight: 1.5 }}>
              <span style={{ color: ACCENT, fontFamily: "'Noto Sans Runic', serif", flexShrink: 0, marginTop: "0.1rem", fontSize: "0.85rem" }}>ᚠ</span>
              {h}
            </motion.li>
          ))}
        </ul>
      </RSection>
    </div>
  );
}

function TabMetricas({ p }: { p: RunicProject }) {
  return (
    <div>
      <RSection label="ᚢ Stack completo">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {p.stack.map(t => (
            <span key={t} style={{ fontSize: "0.68rem", padding: "0.22rem 0.65rem", border: `1px solid ${BORDER}`, color: ACCENT_MUTED, background: "rgba(148,0,255,0.06)", borderRadius: 4, fontFamily: "monospace" }}>
              {t}
            </span>
          ))}
        </div>
      </RSection>

      <RSection label="ᚷ Tecnología completa">
        <p style={{ fontSize: "0.75rem", color: MUTED, margin: 0, lineHeight: 1.6, fontFamily: "monospace" }}>{p.tech}</p>
      </RSection>

      {/* Tabla de métricas en formato rúnico */}
      <RSection label="ᚱ Impacto medido">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
          {p.metrics.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.55rem 0.7rem",
                background: "rgba(148,0,255,0.05)",
                border: "1px solid rgba(148,0,255,0.15)",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 800, fontFamily: "monospace", color: ACCENT, textShadow: "0 0 10px hsla(280,100%,50%,0.6)", lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: "0.6rem", color: MUTED, lineHeight: 1.2 }}>{m.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </RSection>
    </div>
  );
}

function TabArquitectura({ p }: { p: RunicProject }) {
  return (
    <div>
      <RSection label="ᚦ Capas del sistema">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {p.archLayers.map((layer, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                display: "flex", gap: "0.7rem",
                background: `${layer.color}08`, border: `1px solid ${layer.color}20`,
                borderRadius: 7, padding: "0.65rem 0.8rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: layer.color, boxShadow: `0 0 6px ${layer.color}` }} />
                {i < p.archLayers.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 12, background: `${layer.color}35` }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#fff", marginBottom: "0.18rem" }}>{layer.name}</div>
                <p style={{ fontSize: "0.68rem", color: MUTED, lineHeight: 1.5, margin: "0 0 0.4rem" }}>{layer.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                  {layer.tech.map(t => (
                    <span key={t} style={{ fontSize: "0.6rem", padding: "0.12rem 0.42rem", background: `${layer.color}12`, color: `${layer.color}cc`, border: `1px solid ${layer.color}22`, borderRadius: 3, fontFamily: "monospace" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </RSection>

      <RSection label="ᚲ Patrones de diseño">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {p.patterns.map((pt, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              style={{ fontSize: "0.68rem", padding: "0.25rem 0.65rem", border: `1px solid ${BORDER}`, color: ACCENT_MUTED, background: "rgba(148,0,255,0.07)", borderRadius: 20, fontFamily: "monospace" }}>
              {pt}
            </motion.span>
          ))}
        </div>
      </RSection>
    </div>
  );
}

function TabGaleria({ p }: { p: RunicProject }) {
  const [active, setActive] = useState(0);

  if (!p.media.length) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem", textAlign: "center" }}>
      <div style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "2.5rem", opacity: 0.12, marginBottom: "0.75rem" }}>ᚱ</div>
      <p style={{ color: MUTED, fontSize: "0.78rem" }}>Sin media disponible para este proyecto.</p>
    </div>
  );

  const item = p.media[active];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: "#000", aspectRatio: "16/9", border: `1px solid ${BORDER}` }}>
        {item.type === "video"
          ? <video src={item.src} controls autoPlay muted loop poster={item.thumbnail || undefined} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={item.src} alt={item.caption} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        }
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.4rem 0.65rem", background: "linear-gradient(transparent,rgba(0,0,0,0.75))", fontSize: "0.68rem", color: MUTED }}>
          {item.caption}
        </div>
      </div>
      {p.media.length > 1 && (
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {p.media.map((m, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ flexShrink: 0, width: 60, height: 42, borderRadius: 5, overflow: "hidden", border: `1.5px solid ${i === active ? ACCENT : "transparent"}`, cursor: "pointer", background: "#000" }}>
              {m.thumbnail
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={m.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(148,0,255,0.1)", color: ACCENT, fontSize: "1rem" }}>▶</div>
              }
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TabDesafios({ p }: { p: RunicProject }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT_MUTED, marginBottom: "0.25rem" }}>
        ᚲ Retos técnicos superados
      </div>
      {p.challenges.map((c, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(148,0,255,0.14)",
            borderLeft: "3px solid rgba(148,0,255,0.5)",
            borderRadius: "0 7px 7px 0",
            padding: "0.75rem 0.85rem 0.75rem 0.85rem",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "0.4rem", right: "0.6rem", fontSize: "2rem", fontWeight: 900, color: "rgba(148,0,255,0.06)", fontFamily: "monospace", lineHeight: 1 }}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <span style={{ color: ACCENT, fontFamily: "'Noto Sans Runic', serif", fontSize: "0.9rem", flexShrink: 0, marginTop: "0.1rem" }}>ᚠ</span>
            <p style={{ fontSize: "0.76rem", color: TEXT, lineHeight: 1.6, margin: 0 }}>{c}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TabSCC({ p }: { p: RunicProject }) {
  const ALL = ["SCC.E.1","SCC.E.2","SCC.E.3","SCC.E.4","SCC.E.5","SCC.E.6","SCC.E.7","SCC.E.8","SCC.E.9"];
  const covered = new Set(p.scc.map(s => s.code));
  const LEVEL_CFG = {
    básico:     { color: "#f59e0b", bar: 35 },
    intermedio: { color: "#cc66ff", bar: 65 },
    avanzado:   { color: "#00ff88", bar: 90 },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Mapa de cobertura */}
      <div>
        <div style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT_MUTED, marginBottom: "0.45rem" }}>
          ᚷ Cobertura — {p.scc.length}/{ALL.length} competencias
        </div>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {ALL.map(code => {
            const ok = covered.has(code);
            return (
              <div key={code} style={{
                fontSize: "0.62rem", fontFamily: "monospace",
                padding: "0.2rem 0.55rem", borderRadius: 4,
                border: `1px solid ${ok ? "rgba(148,0,255,0.6)" : "rgba(255,255,255,0.06)"}`,
                background: ok ? "rgba(148,0,255,0.16)" : "rgba(255,255,255,0.02)",
                color: ok ? "rgba(200,160,255,0.9)" : "#374151",
                boxShadow: ok ? "0 0 6px rgba(148,0,255,0.4)" : "none",
              }}>
                {code.replace("SCC.", "")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle */}
      {p.scc.map((scc, i) => {
        const lvl = LEVEL_CFG[scc.level];
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${lvl.color}18`, borderRadius: 7, padding: "0.7rem 0.85rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <div>
                <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.68rem", color: lvl.color }}>{scc.code}</span>
                <span style={{ fontSize: "0.66rem", color: MUTED, marginLeft: "0.4rem" }}>· {scc.title}</span>
              </div>
              <span style={{ fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.12rem 0.45rem", border: `1px solid ${lvl.color}28`, background: `${lvl.color}10`, color: lvl.color, borderRadius: 20 }}>
                {scc.level}
              </span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginBottom: "0.45rem" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${lvl.bar}%` }} transition={{ delay: i * 0.07 + 0.2, duration: 0.7 }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${lvl.color}70, ${lvl.color})`, borderRadius: 2 }} />
            </div>
            <p style={{ fontSize: "0.7rem", color: MUTED, lineHeight: 1.55, margin: 0 }}>{scc.evidence}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MODAL PRINCIPAL
// ═══════════════════════════════════════════════════════════

interface Props {
  project: RunicProject;
  onClose: () => void;
}

export default function RunicProjectModal({ project: p, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("vision");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case "vision":       return <TabVision p={p} />;
      case "metricas":     return <TabMetricas p={p} />;
      case "arquitectura": return <TabArquitectura p={p} />;
      case "galeria":      return <TabGaleria p={p} />;
      case "desafios":     return <TabDesafios p={p} />;
      case "scc":          return <TabSCC p={p} />;
    }
  }, [activeTab, p]);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
        }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Runas flotantes de fondo */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {["ᚠ","ᚢ","ᚦ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ"].map((rune, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${6 + (i * 8.2) % 88}%`,
              top:  `${5 + (i * 11.5) % 88}%`,
              fontFamily: "'Noto Sans Runic', serif",
              fontSize: `${0.9 + (i % 4) * 0.5}rem`,
              color: "rgba(148,0,255,0.09)",
              animation: `floatRune ${5 + i * 0.6}s ease-in-out ${i * 0.35}s infinite alternate`,
            }}>
              {rune}
            </div>
          ))}
        </div>

        {/* Nebulosa */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 40%, hsla(280,100%,50%,0.07) 0%, transparent 60%)",
        }} />

        {/* MODAL CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1100,
            maxHeight: "90vh",
            background: "rgba(11,8,21,0.98)",
            border: "1px solid rgba(148,0,255,0.28)",
            borderRadius: 16,
            boxShadow: "0 0 80px hsla(280,100%,50%,0.18), 0 0 200px hsla(280,100%,50%,0.06), 0 32px 80px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Línea superior con glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, hsl(280,100%,50%), hsl(280,100%,65%), hsl(280,100%,50%), transparent)",
            boxShadow: "0 0 20px hsla(280,100%,50%,0.8)",
            zIndex: 2,
          }} />

          {/* ── HEADER ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.1rem 0.6rem",
            borderBottom: "1px solid rgba(148,0,255,0.12)",
            flexShrink: 0,
            background: "rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              {/* Runa circular */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1.5px solid rgba(148,0,255,0.55)",
                background: "rgba(148,0,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 14px hsla(280,100%,50%,0.4)",
              }}>
                <span style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "1.1rem", color: "hsl(280,100%,60%)", filter: "drop-shadow(0 0 6px hsl(280,100%,50%))" }}>
                  {p.rune}
                </span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0, lineHeight: 1.2 }}>
                    {p.title}
                  </h2>
                  <span style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.12em", color: ACCENT_MUTED, padding: "0.1rem 0.45rem", border: "1px solid rgba(148,0,255,0.25)", borderRadius: 20 }}>
                    {p.runeName}
                  </span>
                </div>
                <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: MUTED, margin: 0 }}>{p.subtitle} · {p.period}</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 6, border: "1px solid rgba(148,0,255,0.25)",
              background: "transparent", color: MUTED, cursor: "pointer", fontSize: "0.85rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* ── CUERPO: dos paneles SIN GAP ── */}
          <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden", gap: 0, width: "100%" }}>

            {/* Panel izquierdo — 46% para que se vea el círculo completo */}
            <div style={{ width: "46%", flexShrink: 0, overflowY: "auto", scrollbarWidth: "none" }}>
              <LeftPanel p={p} />
            </div>

            {/* Panel derecho — 54% explícito para ocupar el espacio */}
            <div style={{ width: "54%", flexShrink: 0, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
              {/* Menú de runas */}
              <RunicWheelNav active={activeTab} onSelect={setActiveTab} />

              {/* Contenido */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "1rem 1.1rem",
                scrollbarWidth: "thin", scrollbarColor: "rgba(148,0,255,0.3) transparent",
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTab()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── STATUS BAR ── */}
          <div style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.35rem 1rem",
            borderTop: "1px solid rgba(148,0,255,0.1)",
            background: "rgba(0,0,0,0.4)",
            fontSize: "0.58rem", fontFamily: "monospace",
          }}>
            <span style={{ color: ACCENT_MUTED }}>
              {p.rune} {TABS.find(t => t.id === activeTab)?.runeName} — {TABS.find(t => t.id === activeTab)?.label}
            </span>
            <span style={{ color: "rgba(200,180,240,0.2)" }}>
              {p.scc.length}/9 SCC · ESC para cerrar
            </span>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes floatRune {
          0%   { transform: translateY(0px) rotate(0deg);    opacity: 0.07; }
          50%  { transform: translateY(-10px) rotate(8deg);  opacity: 0.15; }
          100% { transform: translateY(3px) rotate(-5deg);   opacity: 0.09; }
        }
      `}</style>
    </AnimatePresence>
  );
}
