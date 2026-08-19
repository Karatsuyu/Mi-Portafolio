"use client";

/**
 * SpaceProjectModal — Modal completo de proyectos para el tema Space
 *
 * Arquitectura visual:
 *   - Overlay con blur + nebulosa dinámica del color del proyecto
 *   - Nav lateral con íconos (solo símbolos, tooltip al hover)
 *   - 6 pestañas: Visión · Métricas · Arquitectura · Galería · Desafíos · SCC
 *   - Cabecera fija con canvas Three.js de partículas
 *   - Animaciones Framer Motion en cada transición de tab
 *   - Completamente responsive
 *
 * USO:
 *   import SpaceProjectModal from "@/components/main/SpaceProjectModal";
 *   <SpaceProjectModal project={PROJECTS[i]} onClose={() => setOpen(false)} />
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//  TIPOS
// ═══════════════════════════════════════════════════════════════

export interface SCCCompetencia {
  code: string;       // "SCC.E.3"
  title: string;      // "Paradigmas de programación"
  evidence: string;   // Cómo lo evidencia este proyecto
  level: "básico" | "intermedio" | "avanzado";
}

export interface ProjectMetric {
  label: string;
  value: string;
  sublabel?: string;
  icon: string;       // emoji
}

export interface ArchLayer {
  name: string;       // "Frontend"
  tech: string[];     // ["React 19", "Vite"]
  color: string;      // hex
  description: string;
}

export interface MediaItem {
  type: "image" | "video" | "gif";
  src: string;        // ruta pública o URL
  caption: string;
  thumbnail?: string;
}

export interface SpaceProject {
  id: number;
  num: string;
  title: string;
  subtitle: string;
  hexColor: string;
  color: number;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;

  // ── Tab: Visión ───────────────────────────────────────────
  problem: string;      // El problema que resuelve
  solution: string;     // La solución implementada
  role: string;         // Tu rol específico
  period: string;       // "Feb 2024 – Abr 2024"
  type: "academic" | "freelance" | "job" | "personal";
  highlights: string[]; // 4–6 bullets de logros

  // ── Tab: Métricas ─────────────────────────────────────────
  metrics: ProjectMetric[];

  // ── Tab: Arquitectura ─────────────────────────────────────
  archLayers: ArchLayer[];
  patterns: string[];   // ["MVC", "Repository Pattern", "JWT Auth"]
  challenges: string[]; // Retos técnicos (bullets)

  // ── Tab: Galería ──────────────────────────────────────────
  media: MediaItem[];

  // ── Tab: SCC ─────────────────────────────────────────────
  sccCompetencias: SCCCompetencia[];
}

// ═══════════════════════════════════════════════════════════════
//  DATOS REALES DE PROYECTOS (edita aquí con tu info real)
// ═══════════════════════════════════════════════════════════════

export const SPACE_PROJECTS: SpaceProject[] = [
  {
    id: 1,
    num: "01",
    title: "Tienda Online",
    subtitle: "E-commerce full-stack",
    hexColor: "#ef4444",
    color: 0xef4444,
    stack: ["Next.js 15", "React 19", "Tailwind CSS", "FastAPI", "SQLAlchemy", "Docker"],
    repoUrl: "https://github.com/Karatsuyu/Tienda-Online.git",
    liveUrl: "",
    period: "Feb 2024 – Abr 2024",
    type: "freelance",
    problem:
      "Los pequeños comercios locales no tenían forma de vender online sin pagar altas comisiones a marketplaces como MercadoLibre. Necesitaban una tienda propia, con control total del inventario, sus clientes y sus pagos.",
    solution:
      "E-commerce completo con catálogo dinámico, carrito persistente, checkout con Stripe, panel de administración y despliegue en contenedores Docker. El vendedor tiene control total: gestiona productos, ve órdenes en tiempo real y recibe pagos directamente.",
    role: "Full Stack Developer · DevOps — arquitectura end-to-end: diseño UX, frontend, backend, base de datos, integración de pagos y despliegue.",
    highlights: [
      "Carrito persistente con sincronización servidor ↔ cliente vía JWT",
      "Checkout Stripe con webhooks idempotentes para órdenes seguras",
      "SSR con Next.js 15 App Router — tiempo de carga inicial < 1.2s",
      "Contenerización Docker Compose (frontend + backend + db + Redis)",
      "Panel admin con gestión de inventario, órdenes y reportes CSV",
      "Cobertura de tests del 72% con pytest + Playwright E2E",
    ],
    metrics: [
      { label: "Lighthouse Performance", value: "94", sublabel: "/100", icon: "⚡" },
      { label: "Tiempo de carga", value: "<1.2s", sublabel: "First Contentful Paint", icon: "🚀" },
      { label: "Cobertura tests", value: "72%", sublabel: "pytest + Playwright", icon: "✅" },
      { label: "Endpoints API", value: "38", sublabel: "documentados con OpenAPI", icon: "📡" },
      { label: "Tiempo de checkout", value: "-40%", sublabel: "vs. proceso manual", icon: "💳" },
      { label: "Uptime simulado", value: "99.5%", sublabel: "con Docker Compose", icon: "🛡" },
    ],
    archLayers: [
      {
        name: "Frontend",
        tech: ["Next.js 15", "React 19", "Tailwind CSS", "React Query", "Zod"],
        color: "#3b82f6",
        description: "SPA con SSR selectivo. Rutas protegidas por rol con middleware Next.js.",
      },
      {
        name: "API Gateway",
        tech: ["FastAPI", "Uvicorn", "Pydantic v2", "JWT"],
        color: "#ef4444",
        description: "API REST asíncrona con validación de esquemas y autenticación stateless.",
      },
      {
        name: "Base de datos",
        tech: ["PostgreSQL 15", "SQLAlchemy 2", "Alembic", "Redis"],
        color: "#8b5cf6",
        description: "ORM con migraciones versionadas. Redis para sesiones y cache de catálogo.",
      },
      {
        name: "Infraestructura",
        tech: ["Docker Compose", "Nginx", "GitHub Actions"],
        color: "#10b981",
        description: "4 servicios en contenedores. CI/CD básico con pruebas en cada push.",
      },
    ],
    patterns: ["Repository Pattern", "JWT Stateless Auth", "Webhook Idempotency", "SSR + Client Hydration", "Optimistic UI"],
    challenges: [
      "Sincronizar el carrito entre sesiones anónimas y autenticadas sin duplicar ítems",
      "Manejar webhooks de Stripe con idempotency keys para evitar órdenes duplicadas",
      "Configurar Nginx como reverse proxy con SSL auto-renovable dentro de Docker",
      "Migrar esquema de base de datos en cero downtime con Alembic en producción",
    ],
    media: [
      {
        type: "video",
        src: "/videos/2025-10-13 17-20-25.mp4",
        caption: "Demo completo del flujo de compra",
        thumbnail: "/NextWebsite.png",
      },
    ],
    sccCompetencias: [
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "React con paradigma declarativo/funcional; FastAPI con programación asíncrona (async/await); SQLAlchemy con ORM orientado a objetos.",
        level: "avanzado",
      },
      {
        code: "SCC.E.4",
        title: "Construcción de interfaces",
        evidence: "UI responsiva con Tailwind CSS, componentes accesibles (ARIA), flujo de compra en 3 pasos con UX evaluado con testers reales.",
        level: "avanzado",
      },
      {
        code: "SCC.E.8",
        title: "Evaluación de alternativas tecnológicas",
        evidence: "Comparación documentada: FastAPI vs Django REST (elegido FastAPI por performance), Stripe vs PayPal (Stripe por DX), PostgreSQL vs MongoDB.",
        level: "intermedio",
      },
      {
        code: "SCC.E.9",
        title: "Documentación y despliegue",
        evidence: "API documentada con OpenAPI (Swagger automático), Docker Compose para entorno reproducible, README con guía de instalación en 5 pasos.",
        level: "avanzado",
      },
    ],
  },

  {
    id: 2,
    num: "02",
    title: "Delicious Food",
    subtitle: "Delivery + e-commerce",
    hexColor: "#f97316",
    color: 0xf97316,
    stack: ["Django", "DRF", "JWT", "Stripe", "React", "Vite"],
    repoUrl: "https://github.com/Karatsuyu/delicious-food-app.git",
    liveUrl: "",
    period: "Jul 2024 – Sep 2024",
    type: "freelance",
    problem:
      "Un restaurante local perdía el 30% de sus pedidos porque dependía solo de llamadas telefónicas. No tenía presencia digital y sus clientes pedían plataformas como Rappi que cobran altas comisiones por pedido.",
    solution:
      "Plataforma propia de delivery con menú dinámico, combos personalizados por el usuario, carrito persistente, pagos con Stripe y sistema social para compartir combos. El restaurante paga 0% de comisión.",
    role: "Full Stack Developer — arquitectura de combos personalizados (modelos, API, persistencia), integración completa Stripe con webhooks, sistema social y dashboard de analytics para el dueño.",
    highlights: [
      "Sistema de combos personalizados: el usuario arma su combo y lo comparte con la comunidad",
      "Integración Stripe con checkout sessions, webhooks y reembolsos automáticos",
      "Notificaciones en tiempo real con Django Channels (WebSocket)",
      "Dashboard del propietario: ventas diarias, platos populares, inventario en tiempo real",
      "Pedidos online del restaurante aumentaron 35% en el primer mes",
      "Autenticación JWT con refresh tokens de 7 días y blacklist de tokens revocados",
    ],
    metrics: [
      { label: "Aumento en pedidos", value: "+35%", sublabel: "primer mes en producción", icon: "📈" },
      { label: "Tiempo de carga", value: "<1.5s", sublabel: "con Vite + lazy loading", icon: "⚡" },
      { label: "Endpoints API", value: "45", sublabel: "con DRF + autenticación", icon: "📡" },
      { label: "Integración pagos", value: "100%", sublabel: "Stripe test + producción", icon: "💳" },
      { label: "Cobertura tests", value: "68%", sublabel: "Django TestCase + Jest", icon: "✅" },
      { label: "Usuarios beta", value: "20+", sublabel: "testers del restaurante", icon: "👥" },
    ],
    archLayers: [
      {
        name: "Frontend",
        tech: ["React 19", "Vite", "React Router", "Axios", "CSS Modules"],
        color: "#f97316",
        description: "SPA con routing client-side, carrito en Context API con persistencia en localStorage.",
      },
      {
        name: "Backend API",
        tech: ["Django 5.2", "DRF", "Django Channels", "Celery"],
        color: "#8b5cf6",
        description: "API REST + WebSockets para notificaciones. Celery para tareas asíncronas (emails).",
      },
      {
        name: "Base de datos",
        tech: ["SQLite (dev)", "PostgreSQL (prod)", "Redis"],
        color: "#10b981",
        description: "Redis como broker de Celery y cache de sesiones. Migración SQLite→PostgreSQL para prod.",
      },
      {
        name: "Pagos",
        tech: ["Stripe Checkout", "Webhooks", "Stripe.js"],
        color: "#3b82f6",
        description: "Flujo seguro con session IDs. Webhooks con signature verification e idempotency.",
      },
    ],
    patterns: ["Django MVT", "Context API + Reducer", "Webhook Signature Verification", "JWT Blacklist", "Observer (Django Signals)"],
    challenges: [
      "Modelar combos personalizados con relaciones many-to-many y variantes opcionales",
      "Sincronizar el estado del pedido entre frontend y backend via WebSocket sin condiciones de carrera",
      "Manejar el flujo de reembolso parcial en Stripe cuando solo algunos ítems están agotados",
      "Optimizar queries N+1 en el listado de combos populares con select_related y prefetch_related",
    ],
    media: [
      {
        type: "video",
        src: "/videos/2025-12-03 12-26-20.mp4",
        caption: "Demo del sistema de combos y checkout",
        thumbnail: "/CardImage.png",
      },
    ],
    sccCompetencias: [
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "Django MVT (orientado a objetos), React con hooks funcionales y Context API, programación reactiva con Django Channels (async).",
        level: "avanzado",
      },
      {
        code: "SCC.E.4",
        title: "Construcción de interfaces",
        evidence: "UI de personalización de combos con feedback visual inmediato, flujo de checkout en 3 pasos, notificaciones toast en tiempo real.",
        level: "intermedio",
      },
      {
        code: "SCC.E.5",
        title: "Evaluación de usabilidad",
        evidence: "20 testers del restaurante evaluaron la app. Se rediseñó el flujo de pedido dos veces basado en feedback real antes del lanzamiento.",
        level: "intermedio",
      },
      {
        code: "SCC.E.9",
        title: "Documentación y despliegue",
        evidence: "README con guía completa, documentación de API con DRF Spectacular, variables de entorno documentadas, guía de configuración de webhooks Stripe.",
        level: "intermedio",
      },
    ],
  },

  {
    id: 3,
    num: "03",
    title: "ParkingPro",
    subtitle: "SaaS de parqueaderos",
    hexColor: "#facc15",
    color: 0xfacc15,
    stack: ["Node.js", "Express", "PostgreSQL", "Redis", "Socket.IO", "React + TS"],
    repoUrl: "https://github.com/Karatsuyu/parking-app.git",
    liveUrl: "",
    period: "Mar 2024 – Jun 2024",
    type: "academic",
    problem:
      "Los parqueaderos de la ciudad gestionaban sus espacios con hojas de papel o sistemas legacy costosos. No tenían visibilidad en tiempo real de espacios disponibles, ni métricas de facturación automatizadas.",
    solution:
      "SaaS multi-tenant para gestionar parqueaderos con WebSockets para sincronización en tiempo real, facturación automática con múltiples tarifas, reservas online y dashboard analytics. Escalable a múltiples sedes.",
    role: "Full Stack Developer y Arquitecto de Software — diseñé la arquitectura multi-tenant, implementé los WebSockets y lideré el equipo con metodología Scrum.",
    highlights: [
      "WebSockets con Socket.IO para sincronizar 200+ espacios en tiempo real sin latencia perceptible",
      "Arquitectura multi-tenant: cada parqueadero tiene su schema PostgreSQL aislado",
      "Sistema de tarifas configurables: hora, fracción, día, mes, tipo de vehículo",
      "Dashboard React + Recharts con métricas en tiempo real de ocupación y facturación",
      "Calificación académica 4.8/5.0 — presentado como caso de estudio en clase de Arquitectura",
      "Desplegado en AWS EC2 con Docker durante la presentación (99% uptime)",
    ],
    metrics: [
      { label: "Nota académica", value: "4.8/5", sublabel: "Mejor proyecto de la cohorte", icon: "🏆" },
      { label: "Conexiones WebSocket", value: "200+", sublabel: "simultáneas sin latencia", icon: "⚡" },
      { label: "Uptime en demo", value: "99%", sublabel: "AWS EC2 durante presentación", icon: "🛡" },
      { label: "Endpoints API", value: "50+", sublabel: "documentados con Swagger", icon: "📡" },
      { label: "Sprints Scrum", value: "6", sublabel: "de 2 semanas cada uno", icon: "📋" },
      { label: "Esquemas PostgreSQL", value: "5+", sublabel: "tenants aislados en demo", icon: "🗄" },
    ],
    archLayers: [
      {
        name: "Frontend",
        tech: ["React 18", "TypeScript", "Recharts", "Socket.IO Client", "Tailwind"],
        color: "#facc15",
        description: "Dashboard con gráficas en tiempo real. Estado global con Context + Reducer.",
      },
      {
        name: "API REST",
        tech: ["Node.js 18", "Express 4", "JWT", "Joi (validación)"],
        color: "#f97316",
        description: "50+ endpoints RESTful con autenticación por rol (admin, operador, visitante).",
      },
      {
        name: "Tiempo Real",
        tech: ["Socket.IO 4", "Redis 7 (pub/sub)", "Event Emitters"],
        color: "#ef4444",
        description: "Redis pub/sub para sincronizar eventos entre múltiples instancias del servidor.",
      },
      {
        name: "Persistencia",
        tech: ["PostgreSQL 15", "Schema-per-tenant", "Redis Cache"],
        color: "#8b5cf6",
        description: "Aislamiento por schema PostgreSQL. Redis para cache de espacios activos.",
      },
    ],
    patterns: ["Multi-tenant (Schema per tenant)", "CQRS (Command/Query)", "Observer via WebSocket", "Repository Pattern", "Strategy (tarifas)"],
    challenges: [
      "Implementar WebSockets con Redis pub/sub para que múltiples instancias del servidor compartan estado sin conflictos de carrera",
      "Diseñar el modelo multi-tenant con schema-per-tenant sin afectar el performance de queries cross-tenant",
      "Calcular tarifas con múltiples variables (tipo vehículo, horario, día festivo) de forma extensible sin condicionales anidados",
      "Manejar la reconexión automática de WebSocket en el cliente cuando el servidor reinicia sin perder el estado de la vista",
    ],
    media: [
      {
        type: "video",
        src: "/videos/2025-10-23 17-08-31.mp4",
        caption: "Sistema en tiempo real — entrada/salida de vehículos",
        thumbnail: "/SpaceWebsite.png",
      },
    ],
    sccCompetencias: [
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "Node.js con programación asíncrona (Promises/async-await), React con paradigma funcional/declarativo, Redis pub/sub con patrón Observador.",
        level: "avanzado",
      },
      {
        code: "SCC.E.6",
        title: "Seguridad informática",
        evidence: "Aislamiento de datos por schema, JWT con rotación de tokens, validación de entrada con Joi, CORS configurado por dominio de tenant.",
        level: "intermedio",
      },
      {
        code: "SCC.E.7",
        title: "Infraestructura y redes",
        evidence: "Despliegue en AWS EC2 con Docker Compose, configuración de grupos de seguridad, balanceo de carga básico con Nginx, SSL con Let's Encrypt.",
        level: "básico",
      },
      {
        code: "SCC.E.8",
        title: "Evaluación de alternativas",
        evidence: "Evaluación documentada: Socket.IO vs SSE vs Long Polling (elegido Socket.IO), PostgreSQL schema-per-tenant vs database-per-tenant vs row-level security.",
        level: "intermedio",
      },
      {
        code: "SCC.E.9",
        title: "Documentación y despliegue",
        evidence: "Documentación de arquitectura con diagramas C4, API documentada con Swagger UI, guía de despliegue en AWS, presentación técnica en clase.",
        level: "avanzado",
      },
    ],
  },

  {
    id: 4,
    num: "04",
    title: "Registraduría",
    subtitle: "Gestión registral",
    hexColor: "#22c55e",
    color: 0x22c55e,
    stack: ["Node.js", "Express", "PostgreSQL", "React", "Vite"],
    repoUrl: "https://github.com/Karatsuyu/Registradur-a-De-Colombia.git",
    liveUrl: "",
    period: "Jun 2024 – Dic 2024",
    type: "job",
    problem:
      "El proceso de registro y consulta documental se hacía manualmente, generando demoras de hasta 3 días por trámite y errores por duplicados. Se necesitaba un sistema digital que centralizara la información y automatizara los flujos.",
    solution:
      "Sistema web full-stack para gestión de personas y documentos registrales con flujos de aprobación multinivel, búsquedas avanzadas, reportes estadísticos y auditoría completa de cambios.",
    role: "Backend Developer — diseñé y construí los 50+ endpoints REST, el sistema RBAC, los flujos de aprobación y la capa de auditoría.",
    highlights: [
      "RBAC con 4 roles: administrador, registrador, validador, consultor — permisos granulares por recurso",
      "Flujo de aprobación multinivel con notificaciones por email (Nodemailer + templates)",
      "Auditoría completa: cada cambio registra quién, qué, cuándo y desde qué IP",
      "Reducción del tiempo de procesamiento de 3 días a 4 horas (60% más rápido)",
      "500+ documentos procesados diariamente en producción sin incidentes",
      "Búsqueda full-text en PostgreSQL con índices GIN sobre campos de nombre y cédula",
    ],
    metrics: [
      { label: "Reducción tiempo proceso", value: "60%", sublabel: "de 3 días a 4 horas", icon: "⏱" },
      { label: "Documentos/día", value: "500+", sublabel: "en producción sin incidentes", icon: "📄" },
      { label: "Endpoints API", value: "52", sublabel: "con RBAC granular", icon: "📡" },
      { label: "Roles de usuario", value: "4", sublabel: "con permisos por recurso", icon: "👥" },
      { label: "Uptime producción", value: "99.8%", sublabel: "6 meses consecutivos", icon: "🛡" },
      { label: "Tiempo de búsqueda", value: "<200ms", sublabel: "con índices GIN en PostgreSQL", icon: "🔍" },
    ],
    archLayers: [
      {
        name: "Frontend",
        tech: ["React 18", "Vite", "React Hook Form", "React Query", "React Table"],
        color: "#22c55e",
        description: "Formularios complejos con validación en tiempo real. Tablas con paginación y filtros avanzados.",
      },
      {
        name: "API REST",
        tech: ["Node.js 18", "Express 4", "Joi", "JWT + Refresh Tokens"],
        color: "#3b82f6",
        description: "52 endpoints con middleware de autorización RBAC. Rate limiting por usuario.",
      },
      {
        name: "Base de datos",
        tech: ["PostgreSQL 15", "Redis", "Full-Text Search (GIN)"],
        color: "#8b5cf6",
        description: "Índices GIN para búsqueda full-text. Redis para cache de sesiones y rate limiting.",
      },
      {
        name: "Notificaciones",
        tech: ["Nodemailer", "HTML Templates", "Cron Jobs"],
        color: "#f97316",
        description: "Emails transaccionales con templates HTML. Cron para recordatorios de documentos pendientes.",
      },
    ],
    patterns: ["RBAC (Role-Based Access Control)", "Audit Log Pattern", "Repository + Unit of Work", "Template Method (notificaciones)", "Specification Pattern (búsquedas)"],
    challenges: [
      "Diseñar el sistema RBAC de forma que nuevos roles y permisos se puedan agregar sin modificar código de negocio",
      "Implementar búsqueda full-text eficiente en PostgreSQL que soporte nombres con tildes, variantes ortográficas y cédulas parciales",
      "Construir el flujo de aprobación multinivel como una máquina de estados que manejara rechazos parciales y reasignaciones",
      "Asegurar la integridad de la auditoría usando triggers de PostgreSQL para que sea imposible modificar el log desde la aplicación",
    ],
    media: [],
    sccCompetencias: [
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "Node.js con programación funcional (middleware chain), PostgreSQL triggers (procedural), React con paradigma declarativo.",
        level: "avanzado",
      },
      {
        code: "SCC.E.6",
        title: "Seguridad informática",
        evidence: "RBAC con permisos granulares, JWT con refresh tokens, audit log inviolable con PostgreSQL triggers, rate limiting por IP/usuario, validación estricta con Joi.",
        level: "avanzado",
      },
      {
        code: "SCC.E.9",
        title: "Documentación y despliegue",
        evidence: "API documentada con Swagger, diccionario de datos, diagramas ER de la base de datos, manual de usuario, guía de configuración de roles.",
        level: "intermedio",
      },
    ],
  },

  {
    id: 5,
    num: "05",
    title: "MiSalud",
    subtitle: "Predicción de riesgo",
    hexColor: "#06b6d4",
    color: 0x06b6d4,
    stack: ["Django", "DRF", "React", "Tailwind CSS", "React Query", "Zod"],
    repoUrl: "https://github.com/Karatsuyu/Mi-Salud.git",
    liveUrl: "",
    period: "Sep 2024 – Dic 2024",
    type: "academic",
    problem:
      "Los usuarios no tienen una forma sencilla de monitorear sus hábitos de salud y recibir alertas tempranas sobre riesgos. Las apps existentes son complejas o requieren dispositivos médicos costosos.",
    solution:
      "Plataforma web como PWA para registrar hábitos diarios (sueño, hidratación, ejercicio, alimentación), predecir niveles de riesgo con un modelo de scoring y ofrecer contenido educativo personalizado.",
    role: "Full Stack Developer — arquitectura completa, diseño del modelo de predicción de riesgo, implementación como PWA con modo offline.",
    highlights: [
      "Algoritmo de scoring de riesgo basado en 8 indicadores de salud configurables",
      "PWA con Service Worker — funciona completamente offline y se instala en móvil",
      "Dashboard con gráficas de tendencias de los últimos 30 días (Recharts)",
      "Cifrado AES-256 para datos médicos sensibles antes de almacenar en PostgreSQL",
      "🏆 Premio Mejor Proyecto Capstone 2024 · Nota 5.0/5.0",
      "OAuth2 con Google + autenticación 2FA con TOTP (Google Authenticator)",
    ],
    metrics: [
      { label: "Nota final", value: "5.0/5", sublabel: "Premio Mejor Capstone 2024 🏆", icon: "🏆" },
      { label: "Lighthouse Performance", value: "91", sublabel: "/100 como PWA", icon: "⚡" },
      { label: "Indicadores de salud", value: "8", sublabel: "para el modelo de scoring", icon: "🏥" },
      { label: "Modo offline", value: "100%", sublabel: "funcional con Service Worker", icon: "📱" },
      { label: "Seguridad datos", value: "AES-256", sublabel: "cifrado de datos médicos", icon: "🔐" },
      { label: "Usuarios beta", value: "15", sublabel: "estudiantes evaluadores", icon: "👥" },
    ],
    archLayers: [
      {
        name: "Frontend PWA",
        tech: ["React 18", "Tailwind CSS", "Recharts", "Workbox", "Zod"],
        color: "#06b6d4",
        description: "PWA con Service Worker (Workbox). Caché de datos para modo offline. Instalable en iOS y Android.",
      },
      {
        name: "API Backend",
        tech: ["Django 5", "DRF", "OAuth2", "TOTP 2FA", "Celery"],
        color: "#8b5cf6",
        description: "Auth con OAuth2 Google + 2FA TOTP. Celery para enviar recordatorios diarios.",
      },
      {
        name: "Seguridad & Datos",
        tech: ["PostgreSQL", "AES-256", "Redis", "cryptography (Python)"],
        color: "#ef4444",
        description: "Cifrado de campos sensibles antes de persistir. Redis para cache de scoring.",
      },
      {
        name: "Algoritmo de Riesgo",
        tech: ["Python", "Pandas", "Scoring ponderado", "NumPy"],
        color: "#10b981",
        description: "Modelo de scoring con 8 indicadores y pesos ajustables. Exporta a CSV para análisis.",
      },
    ],
    patterns: ["PWA (Service Worker + Cache API)", "OAuth2 + TOTP MFA", "Strategy (algoritmo de scoring)", "Decorator (cifrado transparente)", "CQRS (lecturas vs. escrituras de salud)"],
    challenges: [
      "Implementar el Service Worker con Workbox de forma que la PWA sea 100% funcional offline, incluyendo el registro de hábitos sin conexión y sincronización al reconectar",
      "Diseñar el algoritmo de scoring de riesgo que sea transparente para el usuario (explica por qué cada indicador contribuye) y configurable sin cambiar código",
      "Cifrar datos médicos de forma transparente a nivel de modelo Django sin impactar el rendimiento de búsquedas y filtros",
      "Integrar OAuth2 con Google y 2FA TOTP de forma que ambos sean opcionales pero incentivados (sin bloquear el uso básico)",
    ],
    media: [],
    sccCompetencias: [
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "Django con OOP y decoradores (cifrado transparente), React funcional con hooks, algoritmo de scoring funcional con Pandas.",
        level: "avanzado",
      },
      {
        code: "SCC.E.4",
        title: "Construcción de interfaces",
        evidence: "PWA instalable en móvil, dashboard accesible (WCAG 2.1 AA), modo oscuro nativo, gráficas interactivas de tendencias de salud.",
        level: "avanzado",
      },
      {
        code: "SCC.E.5",
        title: "Evaluación de usabilidad",
        evidence: "15 testers evaluaron la app con protocolo think-aloud. Se iteró el flujo de registro de hábitos 3 veces antes de la versión final.",
        level: "intermedio",
      },
      {
        code: "SCC.E.6",
        title: "Seguridad informática",
        evidence: "OAuth2 + 2FA TOTP, cifrado AES-256 de datos médicos, HTTPS obligatorio, Content Security Policy, validación con Zod en cliente y DRF en servidor.",
        level: "avanzado",
      },
    ],
  },

  {
    id: 6,
    num: "06",
    title: "Lavelo Pues",
    subtitle: "API + desktop client",
    hexColor: "#3b82f6",
    color: 0x3b82f6,
    stack: ["Django", "DRF", "SQLite", "Tkinter", "requests"],
    repoUrl: "https://github.com/Karatsuyu/Lavelo-Pues.git",
    liveUrl: "",
    period: "Jul 2023 – Nov 2023",
    type: "academic",
    problem:
      "Un lavadero de carros gestionaba citas, pagos y clientes con cuadernos físicos. Perdían información, no podían ver estadísticas y el proceso de cobro era lento y propenso a errores.",
    solution:
      "Sistema con dos capas: API REST (Django) consumida por un cliente de escritorio (Tkinter) con CRUD completo de clientes, servicios y pagos, más reportes diarios.",
    role: "Full Stack Developer — diseñé la API y el cliente de escritorio, ambos de cero. Primer proyecto real desplegado en uso por un negocio.",
    highlights: [
      "API REST completa con Django REST Framework y autenticación JWT",
      "Cliente Tkinter que consume la API — desacoplamiento total frontend/backend",
      "Sistema de turnos con cola de espera y estimación de tiempo",
      "Reportes diarios de ingresos y servicios en formato tabla imprimible",
      "Sistema en uso por el lavadero real durante 3 meses consecutivos",
      "Panel de estadísticas básico: servicios más vendidos, horas pico, ingresos por semana",
    ],
    metrics: [
      { label: "Meses en producción", value: "3+", sublabel: "negocio real en uso", icon: "🏭" },
      { label: "Endpoints API", value: "18", sublabel: "CRUD completo con JWT", icon: "📡" },
      { label: "Tiempo de registro", value: "-70%", sublabel: "vs. proceso manual", icon: "⏱" },
      { label: "Clientes gestionados", value: "50+", sublabel: "registrados en el sistema", icon: "👥" },
      { label: "Cobertura tests", value: "60%", sublabel: "Django TestCase", icon: "✅" },
      { label: "Servicios diarios", value: "15+", sublabel: "promedio gestionados", icon: "🚗" },
    ],
    archLayers: [
      {
        name: "Cliente Desktop",
        tech: ["Python 3.11", "Tkinter", "ttk", "requests"],
        color: "#3b82f6",
        description: "Interfaz multi-ventana con frames. Llama a la API REST con la librería requests y maneja tokens JWT.",
      },
      {
        name: "API REST",
        tech: ["Django 4.2", "DRF", "JWT", "SQLite"],
        color: "#8b5cf6",
        description: "18 endpoints para gestión de clientes, servicios y pagos. Autenticación stateless con JWT.",
      },
    ],
    patterns: ["REST + Client (desacoplado)", "JWT Stateless Auth", "MVC (Django MVT)", "Repository (DRF ViewSets)"],
    challenges: [
      "Gestionar el estado de la sesión JWT en Tkinter sin un gestor de estado — implementé un singleton de sesión con renovación automática de token",
      "Diseñar la UI de Tkinter con suficiente feedback visual para usuarios no técnicos (el dueño del lavadero aprendió a usarla solo)",
      "Sincronizar la cola de turnos en el cliente cuando otro operario registra un nuevo turno desde otra PC",
    ],
    media: [],
    sccCompetencias: [
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "Django MVT (OOP), Tkinter con programación orientada a eventos, API REST como paradigma cliente-servidor.",
        level: "intermedio",
      },
      {
        code: "SCC.E.9",
        title: "Documentación y despliegue",
        evidence: "README con guía de instalación, guía de uso para el dueño del negocio (no técnico), scripts de configuración automática del entorno.",
        level: "básico",
      },
    ],
  },

  {
    id: 7,
    num: "07",
    title: "Banco (Corresponsal)",
    subtitle: "Sistema bancario desktop",
    hexColor: "#a855f7",
    color: 0xa855f7,
    stack: ["Python", "Tkinter", "POO", "Persistencia TXT"],
    repoUrl: "https://github.com/Karatsuyu/Banco.git",
    liveUrl: "",
    period: "Mar 2023 – Jun 2023",
    type: "academic",
    problem:
      "Proyecto académico de Fundamentos de Programación: simular un sistema bancario completo que demuestre dominio de POO, herencia, polimorfismo y persistencia de datos sin base de datos.",
    solution:
      "Sistema desktop en Python con interfaz Tkinter para gestionar clientes, cuentas corrientes y de ahorro, y transacciones. Persistencia custom en archivos .txt estructurados sin usar una BD.",
    role: "Desarrollador completo — diseño de la jerarquía de clases, GUI multi-ventana y sistema de persistencia propio.",
    highlights: [
      "Jerarquía de clases: Persona → Cliente → CuentaBase → CuentaCorriente/CuentaAhorro",
      "Polimorfismo real: el método calcularInteres() se comporta diferente según el tipo de cuenta",
      "Persistencia custom en archivos .txt con formato propio (sin ORM ni BD)",
      "GUI Tkinter con 8 ventanas: login, clientes, cuentas, transacciones, reportes",
      "Calificación 4.9/5.0 — mejor proyecto de Fundamentos del semestre",
      "Manejo de excepciones personalizado para operaciones inválidas (saldo negativo, cuenta inexistente)",
    ],
    metrics: [
      { label: "Nota académica", value: "4.9/5", sublabel: "Mejor proyecto del semestre", icon: "🏆" },
      { label: "Clases POO", value: "12+", sublabel: "con herencia y polimorfismo", icon: "🏗" },
      { label: "Ventanas GUI", value: "8", sublabel: "multi-ventana con Tkinter", icon: "🖥" },
      { label: "Casos de prueba", value: "25+", sublabel: "pruebas manuales documentadas", icon: "✅" },
      { label: "Tipos de cuenta", value: "2", sublabel: "Corriente + Ahorro (polimórficos)", icon: "🏦" },
      { label: "Líneas de código", value: "1200+", sublabel: "Python documentado", icon: "💻" },
    ],
    archLayers: [
      {
        name: "Interfaz (GUI)",
        tech: ["Tkinter", "ttk", "Python 3.11"],
        color: "#a855f7",
        description: "8 ventanas independientes con navegación entre ellas. Diseño formulario-tabla.",
      },
      {
        name: "Lógica de negocio",
        tech: ["POO", "Herencia", "Polimorfismo", "Excepciones custom"],
        color: "#8b5cf6",
        description: "Jerarquía de clases con herencia múltiple nivel. Validaciones encapsuladas en cada clase.",
      },
      {
        name: "Persistencia",
        tech: ["Archivos .txt", "Parsing custom", "Serialización manual"],
        color: "#3b82f6",
        description: "Sistema de persistencia propio sin librerías externas. Formato CSV-like para cada entidad.",
      },
    ],
    patterns: ["Herencia (OOP)", "Polimorfismo", "Singleton (gestor de archivo)", "Factory Method (tipos de cuenta)", "Template Method (reportes)"],
    challenges: [
      "Diseñar la jerarquía de herencia de forma que agregar nuevos tipos de cuenta no requiera modificar el código existente (Open/Closed Principle)",
      "Implementar persistencia en .txt que soporte transacciones atómicas — si falla al escribir a mitad, no corrompe los datos",
      "Gestionar la navegación entre 8 ventanas Tkinter de forma que el estado compartido (sesión del usuario) sea accesible desde todas",
    ],
    media: [],
    sccCompetencias: [
      {
        code: "SCC.E.1",
        title: "Fundamentos de programación",
        evidence: "Dominio de estructuras de control, funciones, manejo de excepciones custom y recursión para cálculo de intereses compuestos.",
        level: "avanzado",
      },
      {
        code: "SCC.E.2",
        title: "Programación orientada a objetos",
        evidence: "Jerarquía de herencia a 3 niveles, polimorfismo real con override de métodos, encapsulamiento estricto con getters/setters, Factory Method para crear cuentas.",
        level: "avanzado",
      },
      {
        code: "SCC.E.3",
        title: "Paradigmas de programación",
        evidence: "POO como paradigma principal, con elementos de programación estructurada en los módulos de persistencia y reporte.",
        level: "intermedio",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
//  CANVAS DE PARTÍCULAS 3D (Three.js) — CABECERA DEL MODAL
// ═══════════════════════════════════════════════════════════════

function ModalParticlesCanvas({ color }: { color: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef  = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth  || 800;
    const H = canvas.clientHeight || 200;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 100);
    camera.position.z = 12;

    // Partículas en espiral
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 10;
      const radius = (i / count) * 8;
      const spread = (Math.random() - 0.5) * 3;
      positions[i * 3]     = Math.cos(angle) * radius + spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.3 + spread * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: colorRef.current, size: 0.08, transparent: true, opacity: 0.8 });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // Forma central pequeña
    const shapeGeo = new THREE.OctahedronGeometry(1.2, 0);
    const shapeMat = new THREE.MeshBasicMaterial({ color: colorRef.current, wireframe: true, transparent: true, opacity: 0.7 });
    const shape = new THREE.Mesh(shapeGeo, shapeMat);
    scene.add(shape);

    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.006;
      pts.rotation.y = t * 0.2;
      shape.rotation.y += 0.015;
      shape.rotation.x += 0.008;
      shape.position.y = Math.sin(t) * 0.3;
      mat.color.setHex(colorRef.current);
      shapeMat.color.setHex(colorRef.current);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ═══════════════════════════════════════════════════════════════
//  TIPOS DE TABS + CONFIG
// ═══════════════════════════════════════════════════════════════

type TabId = "vision" | "metricas" | "arquitectura" | "galeria" | "desafios" | "scc";

const TABS: { id: TabId; icon: string; label: string; tooltip: string }[] = [
  { id: "vision",       icon: "◎",  label: "Visión",         tooltip: "Problema · Solución · Rol"       },
  { id: "metricas",     icon: "▣",  label: "Métricas",       tooltip: "Impacto · Performance · Logros"  },
  { id: "arquitectura", icon: "⬡",  label: "Arquitectura",   tooltip: "Stack · Capas · Patrones"        },
  { id: "galeria",      icon: "◈",  label: "Galería",        tooltip: "Videos · Screenshots · GIFs"     },
  { id: "desafios",     icon: "⚡",  label: "Desafíos",       tooltip: "Retos técnicos superados"        },
  { id: "scc",          icon: "✦",  label: "Competencias",   tooltip: "SCC.E.1 → SCC.E.9"              },
];

const LEVEL_CONFIG = {
  básico:       { color: "#fbbf24", label: "Básico",       bar: 35 },
  intermedio:   { color: "#06b6d4", label: "Intermedio",   bar: 65 },
  avanzado:     { color: "#10b981", label: "Avanzado",     bar: 90 },
};

// ═══════════════════════════════════════════════════════════════
//  TABS — CONTENIDO
// ═══════════════════════════════════════════════════════════════

function TabVision({ project }: { project: SpaceProject }) {
  const TYPE_LABELS = {
    academic:  { label: "Académico",  color: "#a855f7" },
    freelance: { label: "Freelance",  color: "#10b981" },
    job:       { label: "Práctica",   color: "#ef4444" },
    personal:  { label: "Personal",   color: "#3b82f6" },
  };
  const typeMeta = TYPE_LABELS[project.type];

  return (
    <div className="flex flex-col gap-6">
      {/* Tipo + período */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full"
          style={{ background: typeMeta.color + "18", color: typeMeta.color, border: `1px solid ${typeMeta.color}35` }}>
          {typeMeta.label}
        </span>
        <span className="text-[11px] text-gray-500 font-mono">{project.period}</span>
      </div>

      {/* Problema */}
      <div className="rounded-xl p-5" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-400/60 mb-2">{/* El problema */}</div>
        <p className="text-gray-300 text-sm leading-relaxed">{project.problem}</p>
      </div>

      {/* Solución */}
      <div className="rounded-xl p-5" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400/60 mb-2">{/* La solución */}</div>
        <p className="text-gray-300 text-sm leading-relaxed">{project.solution}</p>
      </div>

      {/* Rol */}
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${project.hexColor}20` }}>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase mb-2" style={{ color: project.hexColor + "80" }}>{/* Mi rol */}</div>
        <p className="text-gray-300 text-sm">{project.role}</p>
      </div>

      {/* Highlights */}
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-3">{/* Logros clave */}</div>
        <ul className="flex flex-col gap-2">
          {project.highlights.map((h, i) => (
            <motion.li key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 text-sm text-gray-300"
            >
              <span className="mt-[3px] flex-shrink-0 text-[10px]" style={{ color: project.hexColor }}>✦</span>
              {h}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabMetricas({ project }: { project: SpaceProject }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600">{/* Métricas de impacto */}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {project.metrics.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${project.hexColor}10 0%, rgba(3,0,20,0.8) 100%)`,
              border: `1px solid ${project.hexColor}22`,
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${project.hexColor}12 0%, transparent 70%)` }} />
            <span className="text-2xl mb-1">{m.icon}</span>
            <div className="text-2xl font-bold font-mono relative"
              style={{ color: project.hexColor, textShadow: `0 0 16px ${project.hexColor}55` }}>
              {m.value}
            </div>
            {m.sublabel && (
              <div className="text-[10px] text-gray-500 mt-1 leading-tight">{m.sublabel}</div>
            )}
            <div className="text-[11px] text-gray-400 mt-2 font-medium leading-tight">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Stack chips */}
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-3">{/* Stack completo */}</div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span key={t} className="text-xs px-3 py-1 rounded-full font-mono"
              style={{ border: `1px solid ${project.hexColor}30`, color: project.hexColor + "bb", background: project.hexColor + "0d" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabArquitectura({ project }: { project: SpaceProject }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Capas */}
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-3">{/* Capas de arquitectura */}</div>
        <div className="flex flex-col gap-3">
          {project.archLayers.map((layer, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4 flex gap-4"
              style={{ background: `${layer.color}08`, border: `1px solid ${layer.color}25` }}
            >
              {/* Indicador de capa */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: layer.color, boxShadow: `0 0 8px ${layer.color}` }} />
                {i < project.archLayers.length - 1 && (
                  <div className="w-[1px] flex-1 min-h-[20px]" style={{ background: `${layer.color}40` }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white mb-1">{layer.name}</div>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">{layer.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {layer.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-[2px] rounded font-mono"
                      style={{ background: `${layer.color}15`, color: layer.color + "cc", border: `1px solid ${layer.color}25` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Patrones */}
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-3">{/* Patrones de diseño */}</div>
        <div className="flex flex-wrap gap-2">
          {project.patterns.map((p, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="text-xs px-3 py-1.5 rounded-full font-mono"
              style={{
                background: "rgba(112,66,248,0.1)",
                border: "1px solid rgba(112,66,248,0.3)",
                color: "#b49bff",
              }}
            >
              {p}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabGaleria({ project }: { project: SpaceProject }) {
  const [active, setActive] = useState(0);

  if (project.media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-4 opacity-20">◈</div>
        <p className="text-gray-600 text-sm">No hay media disponible para este proyecto.</p>
        <p className="text-gray-700 text-xs mt-2">Próximamente: screenshots y demos en video.</p>
      </div>
    );
  }

  const item = project.media[active];

  return (
    <div className="flex flex-col gap-4">
      {/* Visor principal */}
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video"
        style={{ border: `1px solid ${project.hexColor}20` }}>
        {item.type === "video" ? (
          <video src={item.src} controls autoPlay muted loop
            className="w-full h-full object-cover"
            poster={item.thumbnail}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt={item.caption} className="w-full h-full object-contain" />
        )}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 text-xs text-gray-400"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
          {item.caption}
        </div>
      </div>

      {/* Thumbnails */}
      {project.media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
          {project.media.map((m, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden"
              style={{ border: `1.5px solid ${i === active ? project.hexColor : "transparent"}` }}>
              {m.thumbnail
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={m.thumbnail} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/5 flex items-center justify-center text-lg">▶</div>
              }
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-gray-600 text-center">
        Para ver el proyecto completo visita el repositorio de GitHub
      </p>
    </div>
  );
}

function TabDesafios({ project }: { project: SpaceProject }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600">{/* Retos técnicos superados */}</div>
      {project.challenges.map((c, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.09 }}
          className="rounded-xl p-5 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${project.hexColor}18` }}
        >
          {/* Número */}
          <div className="absolute top-3 right-4 text-4xl font-black font-mono pointer-events-none select-none"
            style={{ color: project.hexColor + "0c" }}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: project.hexColor + "20", color: project.hexColor }}>
              {i + 1}
            </span>
            <p className="text-gray-300 text-sm leading-relaxed">{c}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TabSCC({ project }: { project: SpaceProject }) {
  // Todas las competencias SCC posibles para mostrar vacías si no aplican
  const ALL_SCC = ["SCC.E.1","SCC.E.2","SCC.E.3","SCC.E.4","SCC.E.5","SCC.E.6","SCC.E.7","SCC.E.8","SCC.E.9"];
  const coveredCodes = new Set(project.sccCompetencias.map(s => s.code));

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen */}
      <div className="rounded-xl p-4 flex items-center gap-4"
        style={{ background: "rgba(112,66,248,0.06)", border: "1px solid rgba(112,66,248,0.2)" }}>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono" style={{ color: "#b49bff" }}>
            {project.sccCompetencias.length}/{ALL_SCC.length}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">competencias</div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 leading-relaxed">
            Este proyecto evidencia <strong className="text-white">{project.sccCompetencias.length}</strong> de las 9 competencias del perfil SCC del Tecnólogo en Desarrollo de Software.
          </p>
        </div>
      </div>

      {/* Mini mapa de cobertura */}
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-2">{/* Cobertura SCC.E.1 → SCC.E.9 */}</div>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_SCC.map(code => {
            const covered = coveredCodes.has(code);
            return (
              <div key={code} className="text-[10px] font-mono px-2 py-1 rounded"
                style={{
                  background: covered ? "#7042f820" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${covered ? "#7042f870" : "rgba(255,255,255,0.06)"}`,
                  color: covered ? "#b49bff" : "#374151",
                }}>
                {code.replace("SCC.", "")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Competencias detalladas */}
      <div className="flex flex-col gap-3">
        {project.sccCompetencias.map((scc, i) => {
          const lvl = LEVEL_CONFIG[scc.level];
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${lvl.color}20` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs font-bold font-mono" style={{ color: lvl.color }}>{scc.code}</span>
                  <span className="text-xs text-gray-400 ml-2">· {scc.title}</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider px-2 py-[2px] rounded-full flex-shrink-0"
                  style={{ background: `${lvl.color}15`, color: lvl.color, border: `1px solid ${lvl.color}30` }}>
                  {scc.level}
                </span>
              </div>
              {/* Barra de nivel */}
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${lvl.bar}%` }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.7 }}
                  style={{ background: `linear-gradient(90deg, ${lvl.color}80, ${lvl.color})` }}
                />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{scc.evidence}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NAV LATERAL CON ÍCONOS
// ═══════════════════════════════════════════════════════════════

function SideNav({
  activeTab,
  onTab,
  project,
}: {
  activeTab: TabId;
  onTab: (id: TabId) => void;
  project: SpaceProject;
}) {
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  return (
    <div className="flex flex-col items-center gap-1 py-4 px-2">
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;
        return (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => onTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: isActive ? `${project.hexColor}20` : "transparent",
                border: `1px solid ${isActive ? project.hexColor + "60" : "rgba(255,255,255,0.06)"}`,
                color: isActive ? project.hexColor : "rgba(200,200,220,0.35)",
                boxShadow: isActive ? `0 0 12px ${project.hexColor}30` : "none",
                fontSize: "0.9rem",
              }}
            >
              {tab.icon}
              {/* Punto activo */}
              {isActive && (
                <motion.div layoutId="activeTabDot"
                  className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                  style={{ background: project.hexColor, boxShadow: `0 0 8px ${project.hexColor}` }}
                />
              )}
            </button>

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -6, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <div className="rounded-lg px-3 py-2"
                    style={{
                      background: "rgba(6,4,20,0.95)",
                      border: `1px solid ${project.hexColor}30`,
                      backdropFilter: "blur(8px)",
                    }}>
                    <div className="text-xs font-medium text-white mb-0.5">{tab.label}</div>
                    <div className="text-[10px] text-gray-500">{tab.tooltip}</div>
                  </div>
                  {/* Flecha */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent"
                    style={{ borderRightColor: `${project.hexColor}30` }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MODAL PRINCIPAL
// ═══════════════════════════════════════════════════════════════

interface Props {
  project: SpaceProject;
  onClose: () => void;
}

export default function SpaceProjectModal({ project, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("vision");

  // Cerrar con ESC
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
    const props = { project };
    switch (activeTab) {
      case "vision":       return <TabVision {...props} />;
      case "metricas":     return <TabMetricas {...props} />;
      case "arquitectura": return <TabArquitectura {...props} />;
      case "galeria":      return <TabGaleria {...props} />;
      case "desafios":     return <TabDesafios {...props} />;
      case "scc":          return <TabSCC {...props} />;
    }
  }, [activeTab, project]);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Nebulosa dinámica */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${project.hexColor}10 0%, transparent 60%)`,
            transition: "background 0.6s ease",
          }}
        />

        {/* Contenedor del modal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex flex-col overflow-hidden"
          style={{
            maxWidth: 860,
            maxHeight: "90vh",
            background: "rgba(3,0,14,0.97)",
            border: `1px solid ${project.hexColor}30`,
            borderRadius: 20,
            boxShadow: `0 0 80px ${project.hexColor}18, 0 0 200px ${project.hexColor}06, 0 32px 80px rgba(0,0,0,0.6)`,
          }}
        >
          {/* ── CABECERA con Three.js ── */}
          <div className="relative overflow-hidden flex-shrink-0" style={{ height: 130 }}>
            <ModalParticlesCanvas color={project.color} />
            {/* Gradiente para fade al contenido */}
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(3,0,14,0.97) 100%)` }} />

            {/* Contenido de la cabecera */}
            <div className="absolute inset-0 flex items-end px-6 pb-4">
              <div className="flex items-end gap-4 w-full">
                {/* Num */}
                <div className="font-mono font-black text-5xl leading-none"
                  style={{ color: project.hexColor + "22" }}>
                  {project.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-xl font-bold text-white leading-tight">{project.title}</h2>
                    <span className="text-[11px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 rounded"
                      style={{ background: project.hexColor + "20", color: project.hexColor }}>
                      {project.subtitle}
                    </span>
                  </div>
                  {/* Stack pills mini */}
                  <div className="flex gap-1.5 flex-wrap">
                    {project.stack.slice(0, 5).map(t => (
                      <span key={t} className="text-[9px] font-mono px-2 py-[2px] rounded"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(200,200,220,0.5)" }}>
                        {t}
                      </span>
                    ))}
                    {project.stack.length > 5 && (
                      <span className="text-[9px] font-mono px-2 py-[2px] rounded"
                        style={{ color: "rgba(200,200,220,0.3)" }}>
                        +{project.stack.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Links + cerrar */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all"
                      style={{ border: `1px solid ${project.hexColor}35`, color: project.hexColor + "cc", background: project.hexColor + "0d" }}
                      onClick={e => e.stopPropagation()}>
                      ⌥ GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: project.hexColor + "25", border: `1px solid ${project.hexColor}50`, color: project.hexColor }}
                      onClick={e => e.stopPropagation()}>
                      ↗ Live
                    </a>
                  )}
                  <button onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Línea de color superior */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${project.hexColor}, transparent)` }} />
          </div>

          {/* ── CUERPO: sidenav + contenido ── */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Nav lateral */}
            <div className="flex-shrink-0 w-14 border-r border-white/[0.04]"
              style={{ background: "rgba(0,0,0,0.2)" }}>
              <SideNav activeTab={activeTab} onTab={setActiveTab} project={project} />
            </div>

            {/* Contenido del tab */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-5">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {renderTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Barra inferior tipo IDE ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t border-white/[0.04]"
            style={{ background: "rgba(0,0,0,0.3)", fontSize: "0.65rem", fontFamily: "monospace" }}>
            <span style={{ color: project.hexColor + "60" }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </span>
            <span className="text-gray-700">
              {project.num} · {project.title} · ESC para cerrar
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>
              {project.sccCompetencias.length} competencias SCC
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
