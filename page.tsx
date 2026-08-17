"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ProjectType = "freelance" | "academic" | "job" | "personal";
interface Metric { label: string; value: string; sublabel?: string; bar: number; icon: string; }
interface ArchLayer { name: string; tech: string[]; description: string; color: string; }
interface SCCItem { code: string; title: string; evidence: string; level: "básico" | "intermedio" | "avanzado"; }
interface Project {
  id: string; num: string; title: string; subtitle: string;
  type: ProjectType; year: string; period: string;
  videoSrc: string; thumbnail?: string; stack: string[];
  repoUrl?: string; liveUrl?: string; summary: string;
  problem: string; solution: string; role: string;
  highlights: string[]; metrics: Metric[]; archLayers: ArchLayer[];
  patterns: string[]; challenges: string[]; scc: SCCItem[];
}

const TYPE_META: Record<ProjectType, { label: string; color: string }> = {
  freelance: { label: "Freelance",  color: "#10b981" },
  academic:  { label: "Académico",  color: "#a855f7" },
  job:       { label: "Práctica",   color: "#ef4444" },
  personal:  { label: "Personal",   color: "#3b82f6" },
};
const ALL_SCC = ["SCC.E.1","SCC.E.2","SCC.E.3","SCC.E.4","SCC.E.5","SCC.E.6","SCC.E.7","SCC.E.8","SCC.E.9"];
const LEVEL_CFG = {
  básico:     { color: "#f59e0b", bar: 35, label: "Básico" },
  intermedio: { color: "#3b82f6", bar: 65, label: "Intermedio" },
  avanzado:   { color: "#10b981", bar: 90, label: "Avanzado" },
};

const PROJECTS: Project[] = [
  {
    id:"tienda", num:"01", title:"Tienda Online", subtitle:"E-commerce full-stack sin comisiones",
    type:"freelance", year:"2024", period:"Feb 2024 – Abr 2024",
    videoSrc:"/videos/2025-10-13 17-20-25.mp4", thumbnail:"/NextWebsite.png",
    stack:["Next.js 15","React 19","FastAPI","Docker","PostgreSQL","Stripe"],
    repoUrl:"https://github.com/Karatsuyu/Tienda-Online.git",
    summary:"E-commerce completo para pequeños comercios sin comisiones de marketplaces. Control total del inventario, clientes y pagos propios.",
    problem:"Los comercios locales no podían vender online sin pagar comisiones del 25-30% a marketplaces. Sin control de inventario ni datos propios.",
    solution:"E-commerce propio con catálogo dinámico, carrito persistente, checkout Stripe, panel admin y Docker Compose. Comisión: 0%.",
    role:"Full Stack Developer · DevOps — arquitectura end-to-end: frontend Next.js, backend FastAPI, integración Stripe y contenedores Docker.",
    highlights:["Carrito persistente con sync servidor/cliente via JWT","Webhooks Stripe idempotentes para órdenes 100% seguras","SSR Next.js 15 App Router — carga < 1.2s","Docker Compose: 4 servicios contenerizados","Panel admin con inventario, órdenes y reportes CSV","Cobertura tests 72% con pytest + Playwright E2E"],
    metrics:[
      {label:"Lighthouse",    value:"94/100", sublabel:"Performance",   bar:94,  icon:"⚡"},
      {label:"Carga FCP",     value:"<1.2s",  sublabel:"First Paint",   bar:88,  icon:"🚀"},
      {label:"Tests",         value:"72%",    sublabel:"pytest + E2E",  bar:72,  icon:"✅"},
      {label:"Endpoints API", value:"38",     sublabel:"OpenAPI docs",  bar:100, icon:"📡"},
      {label:"Checkout",      value:"-40%",   sublabel:"Tiempo proc.",  bar:60,  icon:"💳"},
      {label:"Uptime",        value:"99.5%",  sublabel:"Docker Compose",bar:99,  icon:"🛡️"},
    ],
    archLayers:[
      {name:"Frontend",       tech:["Next.js 15","React 19","Tailwind","React Query"], description:"SPA con SSR selectivo y rutas protegidas por rol.", color:"#3b82f6"},
      {name:"API REST",       tech:["FastAPI","Pydantic v2","Uvicorn","JWT"],           description:"API async con validación de esquemas y auth stateless.", color:"#ff0095"},
      {name:"Base de datos",  tech:["PostgreSQL 15","SQLAlchemy 2","Alembic","Redis"], description:"ORM con migraciones. Redis para sesiones y caché.", color:"#a855f7"},
      {name:"Infraestructura",tech:["Docker Compose","Nginx","GitHub Actions"],         description:"4 servicios en contenedores. CI/CD básico.", color:"#10b981"},
    ],
    patterns:["Repository Pattern","JWT Stateless Auth","Webhook Idempotency","SSR + Client Hydration"],
    challenges:["Sincronizar carrito entre sesiones anónimas y autenticadas sin duplicar ítems al iniciar sesión.","Webhooks Stripe con idempotency keys para evitar órdenes duplicadas en reintentos.","Nginx SSL auto-renovable dentro de Docker Compose en VPS propio."],
    scc:[
      {code:"SCC.E.3",title:"Paradigmas",    evidence:"React declarativo, FastAPI asíncrono, SQLAlchemy OOP.", level:"avanzado"},
      {code:"SCC.E.4",title:"Interfaces",    evidence:"UI responsiva Tailwind, flujo 3 pasos evaluado con testers.", level:"avanzado"},
      {code:"SCC.E.8",title:"Alternativas",  evidence:"FastAPI vs Django REST, Stripe vs PayPal documentado.", level:"intermedio"},
      {code:"SCC.E.9",title:"Documentación", evidence:"OpenAPI auto, Docker reproducible, README en 5 pasos.", level:"avanzado"},
    ],
  },
  {
    id:"delicious", num:"02", title:"Delicious Food", subtitle:"Delivery con combos personalizados y pagos Stripe",
    type:"freelance", year:"2024", period:"Jul 2024 – Sep 2024",
    videoSrc:"/videos/2025-12-03 12-26-20.mp4", thumbnail:"/CardImage.png",
    stack:["Django 5.2","DRF","React 19","Stripe","Celery","Redis"],
    repoUrl:"https://github.com/Karatsuyu/delicious-food-app.git",
    summary:"Plataforma de delivery para restaurante local con combos personalizados y Stripe. Eliminó dependencia de marketplaces con comisión del 25-30%.",
    problem:"Restaurante perdía 30% de pedidos por teléfono. Rappi cobraba comisiones del 25-30% por pedido.",
    solution:"Plataforma propia de delivery con combos personalizados compartibles, pagos Stripe y dashboard del dueño. Comisión: 0%.",
    role:"Full Stack Developer — combos personalizados, Stripe con webhooks, WebSocket para tiempo real, analytics.",
    highlights:["Combos personalizados compartibles en la comunidad de usuarios","Stripe Checkout con reembolsos automáticos","WebSocket (Django Channels) para estado del pedido en tiempo real","Dashboard dueño: ventas, platos top, inventario en vivo","Pedidos online +35% en el primer mes de producción"],
    metrics:[
      {label:"Pedidos online",value:"+35%",  sublabel:"Primer mes", bar:75,  icon:"📈"},
      {label:"Carga FCP",    value:"<1.5s",  sublabel:"Vite lazy",  bar:85,  icon:"⚡"},
      {label:"Endpoints",    value:"45",     sublabel:"DRF + JWT",  bar:100, icon:"📡"},
      {label:"Tests",        value:"68%",    sublabel:"Django+Jest", bar:68,  icon:"✅"},
      {label:"Beta testers", value:"20+",    sublabel:"Restaurante", bar:80,  icon:"👥"},
      {label:"Pagos",        value:"100%",   sublabel:"Stripe prod", bar:100, icon:"💳"},
    ],
    archLayers:[
      {name:"Frontend", tech:["React 19","Vite","React Router","Axios"],         description:"SPA con carrito en Context API + persistencia localStorage.", color:"#3b82f6"},
      {name:"Backend",  tech:["Django 5.2","DRF","Django Channels","Celery"],   description:"REST + WebSockets. Celery para emails async.", color:"#ff0095"},
      {name:"Datos",    tech:["SQLite (dev)","PostgreSQL (prod)","Redis"],        description:"Redis como broker Celery y caché de sesiones.", color:"#a855f7"},
      {name:"Pagos",    tech:["Stripe Checkout","Webhooks","Stripe.js"],          description:"Flujo seguro con session IDs y signature verification.", color:"#10b981"},
    ],
    patterns:["Django MVT","Context API + Reducer","Webhook Signature Verification","Observer (Django Signals)"],
    challenges:["Modelar combos many-to-many con variantes opcionales sin explotar la complejidad del esquema.","Sincronizar estado del pedido via WebSocket sin condiciones de carrera.","Optimizar N+1 queries en combos populares con prefetch_related."],
    scc:[
      {code:"SCC.E.3",title:"Paradigmas",    evidence:"Django MVT (OOP), React hooks funcionales, Channels async.", level:"avanzado"},
      {code:"SCC.E.4",title:"Interfaces",    evidence:"UI combos con feedback inmediato, checkout 3 pasos.", level:"intermedio"},
      {code:"SCC.E.5",title:"Usabilidad",    evidence:"20 testers, rediseño flujo 2 veces antes de lanzar.", level:"intermedio"},
      {code:"SCC.E.9",title:"Documentación", evidence:"DRF Spectacular docs, README completo, guía webhooks Stripe.", level:"intermedio"},
    ],
  },
  {
    id:"parking", num:"03", title:"ParkingPro SaaS", subtitle:"Gestión de parqueaderos en tiempo real multi-tenant",
    type:"academic", year:"2024", period:"Mar 2024 – Jun 2024",
    videoSrc:"/videos/2025-10-23 17-08-31.mp4", thumbnail:"/SpaceWebsite.png",
    stack:["Node.js 18","Express","PostgreSQL 15","Redis 7","Socket.IO","React 18"],
    repoUrl:"https://github.com/Karatsuyu/parking-app.git",
    summary:"SaaS multi-tenant con WebSockets para 200+ espacios en tiempo real y dashboard analytics. Calificación 4.8/5.0 — caso de estudio en Arquitectura.",
    problem:"Parqueaderos gestionando espacios con papel. Sin visibilidad en tiempo real ni facturación automatizada.",
    solution:"SaaS multi-tenant con WebSockets para 200+ espacios, tarifas configurables y analytics. Escalable a múltiples sedes.",
    role:"Full Stack Developer y Arquitecto — multi-tenant schema-per-tenant, WebSockets Redis pub/sub, Scrum.",
    highlights:["WebSockets + Redis pub/sub — 200+ conexiones sin latencia perceptible","Multi-tenancy schema-per-tenant PostgreSQL (aislamiento total)","Tarifas configurables: hora, fracción, día, mes, tipo vehículo","Dashboard React + Recharts en tiempo real","Nota 4.8/5.0 — caso de estudio en Arquitectura de Software"],
    metrics:[
      {label:"Calificación",  value:"4.8/5",  sublabel:"Mejor cohorte",  bar:96,  icon:"🏆"},
      {label:"Conexiones WS", value:"200+",   sublabel:"Sin latencia",   bar:100, icon:"⚡"},
      {label:"Uptime demo",   value:"99%",    sublabel:"AWS EC2",         bar:99,  icon:"🛡️"},
      {label:"Endpoints",     value:"50+",    sublabel:"Swagger UI",      bar:100, icon:"📡"},
      {label:"Sprints Scrum", value:"6",      sublabel:"2 semanas c/u",  bar:100, icon:"📋"},
      {label:"Tenants PG",    value:"5+",     sublabel:"Schemas aislados",bar:100, icon:"🗄️"},
    ],
    archLayers:[
      {name:"Frontend",     tech:["React 18","TypeScript","Recharts","Socket.IO Client"], description:"Dashboard gráficas tiempo real. Context + Reducer.", color:"#3b82f6"},
      {name:"API REST",     tech:["Node.js 18","Express 4","JWT","Joi"],                  description:"50+ endpoints con auth por rol (admin/operador/visitante).", color:"#ff0095"},
      {name:"Tiempo Real",  tech:["Socket.IO 4","Redis 7 pub/sub","Event Emitters"],       description:"Redis pub/sub para sync entre múltiples instancias.", color:"#ef4444"},
      {name:"Persistencia", tech:["PostgreSQL 15","Schema-per-tenant","Redis Cache"],       description:"Aislamiento por schema PG. Redis caché espacios activos.", color:"#a855f7"},
    ],
    patterns:["Multi-tenant (Schema per tenant)","CQRS","Observer via WebSocket","Repository","Strategy (tarifas)"],
    challenges:["Redis pub/sub entre múltiples instancias sin race conditions al escalar.","Schema-per-tenant sin afectar performance de queries cross-tenant para reportes.","Reconexión WebSocket automática sin perder estado de la vista del operador."],
    scc:[
      {code:"SCC.E.3",title:"Paradigmas",     evidence:"Node.js async/await, React funcional, Redis Observer Pattern.", level:"avanzado"},
      {code:"SCC.E.6",title:"Seguridad",      evidence:"Schema isolation, JWT rotación, CORS por tenant, Joi.", level:"intermedio"},
      {code:"SCC.E.7",title:"Infraestructura",evidence:"AWS EC2 + Docker Compose, Nginx, SSL Let's Encrypt.", level:"básico"},
      {code:"SCC.E.8",title:"Alternativas",   evidence:"Socket.IO vs SSE vs Long Polling; schema vs row-level.", level:"intermedio"},
      {code:"SCC.E.9",title:"Documentación",  evidence:"Diagramas C4, Swagger UI, guía AWS, presentación técnica.", level:"avanzado"},
    ],
  },
  {
    id:"registral", num:"04", title:"Sistema Registral", subtitle:"Gestión documental con RBAC y auditoría inviolable",
    type:"job", year:"2024", period:"Jun 2024 – Dic 2024",
    videoSrc:"/videos/2025-10-21 09-59-56.mp4",
    stack:["Node.js 18","Express","PostgreSQL 15","React","Redis","JWT"],
    repoUrl:"https://github.com/Karatsuyu/Registradur-a-De-Colombia.git",
    summary:"Sistema registral con RBAC de 4 roles y auditoría inviolable. Redujo tiempo de procesamiento de 3 días a 4 horas. 500+ documentos/día en producción.",
    problem:"Proceso manual con demoras de 3 días por trámite y errores por duplicados. Necesidad de digitalizar flujos de aprobación multinivel.",
    solution:"Sistema con RBAC (4 roles), flujos de aprobación como máquina de estados, búsqueda GIN y auditoría con triggers PostgreSQL.",
    role:"Backend Developer — 52 endpoints REST, sistema RBAC, flujos aprobación, auditoría con PG triggers.",
    highlights:["RBAC 4 roles con permisos granulares por recurso","Auditoría inviolable con triggers PG — imposible modificar desde la app","Reducción tiempo procesamiento: 3 días → 4 horas (60%)","Búsqueda full-text GIN PostgreSQL — resultados < 200ms","500+ documentos/día en producción sin incidentes"],
    metrics:[
      {label:"Tiempo reducido",value:"60%",    sublabel:"3d → 4h",        bar:60,  icon:"⏱️"},
      {label:"Docs/día prod.", value:"500+",   sublabel:"Sin incidentes",  bar:100, icon:"📄"},
      {label:"Endpoints API",  value:"52",     sublabel:"RBAC granular",   bar:100, icon:"📡"},
      {label:"Roles sistema",  value:"4",      sublabel:"Permisos/recurso",bar:100, icon:"👥"},
      {label:"Uptime prod.",   value:"99.8%",  sublabel:"6 meses",         bar:99,  icon:"🛡️"},
      {label:"Búsqueda GIN",   value:"<200ms", sublabel:"Full-text PG",    bar:95,  icon:"🔍"},
    ],
    archLayers:[
      {name:"Frontend",      tech:["React 18","Vite","React Hook Form","React Table"],  description:"Formularios validación tiempo real. Tablas con paginación avanzada.", color:"#3b82f6"},
      {name:"API REST",      tech:["Node.js 18","Express","Joi","JWT + Refresh"],       description:"52 endpoints con middleware RBAC y rate limiting.", color:"#ff0095"},
      {name:"Base de datos", tech:["PostgreSQL 15","Redis","GIN Full-Text","Triggers"], description:"GIN para búsqueda. Triggers para auditoría inviolable.", color:"#a855f7"},
      {name:"Notificaciones",tech:["Nodemailer","HTML Templates","Cron Jobs"],           description:"Emails transaccionales. Cron para recordatorios pendientes.", color:"#10b981"},
    ],
    patterns:["RBAC","Audit Log Pattern","Repository + Unit of Work","State Machine","Specification Pattern"],
    challenges:["RBAC extensible sin modificar código al agregar roles nuevos (Open/Closed).","Flujo aprobación como máquina de estados con rechazos parciales y reasignaciones.","Auditoría con PG triggers — imposible modificar o eliminar desde la aplicación."],
    scc:[
      {code:"SCC.E.3",title:"Paradigmas",    evidence:"Node.js funcional (middleware), PG triggers procedural, React declarativo.", level:"avanzado"},
      {code:"SCC.E.6",title:"Seguridad",     evidence:"RBAC granular, JWT refresh, audit log PG inviolable, Joi validation.", level:"avanzado"},
      {code:"SCC.E.9",title:"Documentación", evidence:"Swagger, ER diagrams, manual usuario, guía configuración roles.", level:"intermedio"},
    ],
  },
  {
    id:"misalud", num:"05", title:"MiSalud", subtitle:"PWA de salud preventiva con predicción de riesgo",
    type:"academic", year:"2024", period:"Sep 2024 – Dic 2024",
    videoSrc:"/videos/2025-12-03 15-27-11.mp4",
    stack:["Django 5","DRF","React","Tailwind","PWA","PostgreSQL"],
    repoUrl:"https://github.com/Karatsuyu/Mi-Salud.git",
    summary:"PWA de salud digital con scoring de riesgo en 8 indicadores y modo offline completo. Premio Mejor Proyecto Capstone 2024 · Nota 5.0/5.0.",
    problem:"Sin forma simple de monitorear hábitos de salud. Apps médicas complejas o con dispositivos costosos.",
    solution:"PWA para registrar hábitos y predecir riesgo con 8 indicadores configurables. 100% funcional offline.",
    role:"Full Stack Developer — arquitectura completa, algoritmo scoring ponderado, PWA con Workbox offline.",
    highlights:["Scoring de riesgo con 8 indicadores configurables y ponderados","PWA offline 100% con Workbox — sincroniza al reconectar","OAuth2 Google + 2FA TOTP (Google Authenticator)","Cifrado AES-256 para datos médicos sensibles","🏆 Premio Mejor Proyecto Capstone 2024 · Nota 5.0/5.0"],
    metrics:[
      {label:"Calificación", value:"5.0/5",   sublabel:"Mejor Capstone 🏆",bar:100, icon:"🏆"},
      {label:"Lighthouse",   value:"91/100",  sublabel:"PWA score",        bar:91,  icon:"⚡"},
      {label:"Indicadores",  value:"8",       sublabel:"Scoring riesgo",   bar:100, icon:"🏥"},
      {label:"Offline",      value:"100%",    sublabel:"Service Worker",   bar:100, icon:"📱"},
      {label:"Seguridad",    value:"AES-256", sublabel:"Datos médicos",    bar:100, icon:"🔐"},
      {label:"Beta testers", value:"15",      sublabel:"Evaluadores",      bar:80,  icon:"👥"},
    ],
    archLayers:[
      {name:"Frontend PWA",tech:["React 18","Tailwind","Recharts","Workbox"],         description:"PWA instalable. Caché offline. Gráficas de tendencias 30 días.", color:"#3b82f6"},
      {name:"Backend",     tech:["Django 5","DRF","OAuth2","TOTP 2FA","Celery"],      description:"Auth OAuth2 + 2FA TOTP. Celery para recordatorios.", color:"#ff0095"},
      {name:"Seguridad",   tech:["PostgreSQL","AES-256","Redis","cryptography"],       description:"Cifrado campos sensibles antes de persistir.", color:"#ef4444"},
      {name:"Algoritmo",   tech:["Python","Pandas","Scoring ponderado","NumPy"],       description:"8 indicadores ajustables. Exporta a CSV.", color:"#a855f7"},
    ],
    patterns:["PWA (Service Worker + Cache API)","OAuth2 + TOTP MFA","Strategy (scoring)","Decorator (cifrado)"],
    challenges:["Service Worker offline con sync sin conflictos al reconectar.","Scoring transparente: el usuario entiende la contribución de cada indicador.","AES-256 transparente a nivel modelo sin afectar búsquedas."],
    scc:[
      {code:"SCC.E.3",title:"Paradigmas",  evidence:"Django OOP + decoradores, React funcional, Pandas scoring.", level:"avanzado"},
      {code:"SCC.E.4",title:"Interfaces",  evidence:"PWA instalable móvil, WCAG 2.1 AA, modo oscuro, gráficas.", level:"avanzado"},
      {code:"SCC.E.5",title:"Usabilidad",  evidence:"15 testers think-aloud, 3 iteraciones del flujo de registro.", level:"intermedio"},
      {code:"SCC.E.6",title:"Seguridad",   evidence:"OAuth2 + 2FA, AES-256, HTTPS, CSP, validación Zod + DRF.", level:"avanzado"},
    ],
  },
  {
    id:"lavelo", num:"06", title:"Lavelo Pues", subtitle:"API REST + cliente desktop desacoplado en producción real",
    type:"academic", year:"2023", period:"Jul 2023 – Nov 2023",
    videoSrc:"/videos/1014 (1)(1).mp4",
    stack:["Django 4.2","DRF","Tkinter","SQLite","JWT","requests"],
    repoUrl:"https://github.com/Karatsuyu/Lavelo-Pues.git",
    summary:"Sistema API REST + cliente Tkinter desacoplado para lavadero de vehículos. En uso real por el negocio durante 3 meses consecutivos.",
    problem:"Lavadero con cuadernos físicos. Sin estadísticas, información perdida y proceso de cobro lento.",
    solution:"API REST Django consumida por cliente Tkinter desacoplado. CRUD completo con reportes diarios imprimibles.",
    role:"Full Stack Developer — API DRF y cliente Tkinter desde cero. Primer proyecto en producción real.",
    highlights:["API REST completa con DRF y autenticación JWT","Cliente Tkinter desacoplado consumiendo la API con requests","Cola de turnos con estimación de tiempo","Reportes diarios de ingresos imprimibles","Sistema en uso real 3 meses consecutivos"],
    metrics:[
      {label:"Meses prod.",    value:"3+",    sublabel:"Negocio real",    bar:100, icon:"🏭"},
      {label:"Endpoints API",  value:"18",    sublabel:"CRUD + JWT",      bar:100, icon:"📡"},
      {label:"Tiempo registro",value:"-70%",  sublabel:"Vs. manual",      bar:70,  icon:"⏱️"},
      {label:"Clientes en DB", value:"50+",   sublabel:"Registrados",     bar:100, icon:"👥"},
      {label:"Tests",          value:"60%",   sublabel:"Django TestCase",  bar:60,  icon:"✅"},
      {label:"Servicios/día",  value:"15+",   sublabel:"Promedio",        bar:80,  icon:"🚗"},
    ],
    archLayers:[
      {name:"Cliente Desktop",tech:["Python 3.11","Tkinter","ttk","requests"], description:"Interfaz multi-ventana. Llama a la API con requests y maneja JWT.", color:"#3b82f6"},
      {name:"API REST",       tech:["Django 4.2","DRF","JWT","SQLite"],         description:"18 endpoints para clientes, servicios y pagos.", color:"#ff0095"},
    ],
    patterns:["REST + Client desacoplado","JWT Stateless Auth","MVC (Django MVT)","Repository (DRF ViewSets)"],
    challenges:["JWT en Tkinter sin gestor de estado — singleton con renovación automática.","UI Tkinter con feedback visual para usuarios no técnicos."],
    scc:[
      {code:"SCC.E.3",title:"Paradigmas",    evidence:"Django MVT (OOP), Tkinter orientado a eventos, REST cliente-servidor.", level:"intermedio"},
      {code:"SCC.E.9",title:"Documentación", evidence:"README instalación, manual dueño no técnico, scripts configuración.", level:"básico"},
    ],
  },
  {
    id:"banco", num:"07", title:"Sistema Bancario", subtitle:"Desktop POO avanzado con persistencia propia sin BD",
    type:"academic", year:"2023", period:"Mar 2023 – Jun 2023",
    videoSrc:"/videos/1014 (1).mp4",
    stack:["Python 3.11","Tkinter","POO","Archivos .txt","unittest"],
    repoUrl:"https://github.com/Karatsuyu/Banco.git",
    summary:"Sistema bancario desktop con herencia, polimorfismo real y persistencia en archivos .txt sin ORM. Calificación 4.9/5.0 — mejor proyecto del semestre.",
    problem:"Proyecto de Fundamentos: simular sistema bancario completo demostrando POO, herencia, polimorfismo y persistencia sin BD.",
    solution:"Desktop Python con jerarquía Persona→Cliente→CuentaBase→Corriente/Ahorro. Persistencia .txt con transacciones atómicas.",
    role:"Desarrollador completo — jerarquía de clases, GUI multi-ventana Tkinter y sistema de persistencia propio.",
    highlights:["Jerarquía POO: Persona → Cliente → CuentaBase → Corriente / Ahorro","Polimorfismo real: calcularInteres() diferente por tipo de cuenta","Persistencia .txt atómica sin ORM — no corrompe datos","8 ventanas Tkinter multi-ventana (login, clientes, cuentas, reportes)","Calificación 4.9/5.0 — mejor proyecto del semestre"],
    metrics:[
      {label:"Calificación",    value:"4.9/5",  sublabel:"Mejor semestre",  bar:98,  icon:"🏆"},
      {label:"Clases POO",      value:"12+",    sublabel:"Herencia 3 niv.", bar:100, icon:"🏗️"},
      {label:"Ventanas GUI",    value:"8",      sublabel:"Multi-ventana",   bar:100, icon:"🖥️"},
      {label:"Casos de prueba", value:"25+",    sublabel:"Documentados",    bar:100, icon:"✅"},
      {label:"Tipos de cuenta", value:"2",      sublabel:"Polimórficos",    bar:100, icon:"🏦"},
      {label:"Líneas código",   value:"1200+",  sublabel:"Python doc.",     bar:100, icon:"💻"},
    ],
    archLayers:[
      {name:"Interfaz GUI",  tech:["Tkinter","ttk","Python 3.11"],                             description:"8 ventanas independientes con navegación.", color:"#3b82f6"},
      {name:"Lógica POO",    tech:["Herencia","Polimorfismo","Encapsulamiento","Excepciones"], description:"Jerarquía 3 niveles. Validaciones encapsuladas.", color:"#ff0095"},
      {name:"Persistencia",  tech:["Archivos .txt","Parsing custom","Serialización manual"],   description:"Sin librerías. Formato propio. Transacciones atómicas.", color:"#a855f7"},
    ],
    patterns:["Herencia OOP","Polimorfismo","Singleton (gestor archivo)","Factory Method","Template Method (reportes)"],
    challenges:["Herencia extensible para nuevos tipos de cuenta sin modificar código (Open/Closed).","Persistencia .txt atómica — si falla a mitad no corrompe datos."],
    scc:[
      {code:"SCC.E.1",title:"Fundamentos",evidence:"Estructuras de control, funciones, excepciones custom y recursión.", level:"avanzado"},
      {code:"SCC.E.2",title:"POO",        evidence:"Herencia 3 niveles, polimorfismo real, encapsulamiento, Factory Method.", level:"avanzado"},
      {code:"SCC.E.3",title:"Paradigmas", evidence:"POO principal + estructurado en módulos de persistencia.", level:"intermedio"},
    ],
  },
];

// ─── MetricBar ───────────────────────────────────────────────
function MetricBar({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{label}</span>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#ff0095" }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }}
          style={{ height: "100%", background: "linear-gradient(90deg, #ff0095, #e91e63)", boxShadow: "0 0 8px rgba(255,0,149,0.5)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ─── SectionLabel ────────────────────────────────────────────
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(255,0,149,0.12)" }}>
      <div style={{ width: 3, height: 13, background: "#ff0095", boxShadow: "0 0 6px #ff0095", borderRadius: 2 }} />
      <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#ff0095", textShadow: "0 0 8px rgba(255,0,149,0.4)" }}>
        {children}
      </span>
    </div>
  );
}

// ─── DetailDrawer ────────────────────────────────────────────
function DetailDrawer({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const covered = new Set(p.scc.map(s => s.code));
  const tm = TYPE_META[p.type];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />

      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1001,
          width: "min(680px, 96vw)",
          background: "rgba(6,3,16,0.98)",
          border: "1px solid rgba(255,0,149,0.28)",
          borderRight: "none",
          boxShadow: "-8px 0 60px rgba(255,0,149,0.12), -2px 0 20px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}
      >
        {/* Glow top */}
        <div style={{ position: "sticky", top: 0, zIndex: 10, height: 2, background: "linear-gradient(90deg,transparent,#ff0095,#e91e63,#ff0095,transparent)", boxShadow: "0 0 16px rgba(255,0,149,0.8)", flexShrink: 0 }} />

        {/* Header */}
        <div style={{ position: "sticky", top: 2, zIndex: 10, padding: "1.1rem 1.4rem 0.85rem", background: "rgba(6,3,16,0.97)", borderBottom: "1px solid rgba(255,0,149,0.1)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.58rem", fontWeight: 600, padding: "0.15rem 0.6rem", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em", background: `${tm.color}18`, color: tm.color, border: `1px solid ${tm.color}35` }}>{tm.label}</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.28)", fontFamily: "monospace" }}>{p.period}</span>
              </div>
              <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.15rem" }}>{p.title}</h3>
              <p style={{ color: "#ff0095", fontSize: "0.72rem", margin: 0, opacity: 0.7 }}>{p.subtitle}</p>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, flexShrink: 0, border: "1px solid rgba(255,0,149,0.3)", background: "transparent", color: "rgba(255,255,255,0.4)", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem", marginTop: "0.65rem" }}>
            {p.stack.map(t => (
              <span key={t} style={{ fontSize: "0.62rem", padding: "0.15rem 0.5rem", background: "rgba(255,0,149,0.08)", border: "1px solid rgba(255,0,149,0.2)", color: "rgba(255,0,149,0.8)", borderRadius: 4, fontFamily: "monospace" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.1rem 1.4rem", flex: 1 }}>

          {/* Video */}
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,0,149,0.25)", marginBottom: "1.35rem", aspectRatio: "16/9", background: "#000" }}>
            <video src={p.videoSrc} controls autoPlay muted loop poster={p.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>

          {/* Problema / Solución */}
          <SLabel>El problema y la solución</SLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1.25rem" }}>
            <div style={{ padding: "0.75rem", borderRadius: 7, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.14)", borderLeft: "3px solid rgba(239,68,68,0.5)" }}>
              <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(239,68,68,0.6)", marginBottom: "0.35rem" }}>🔴 Problema</div>
              <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.6, margin: 0 }}>{p.problem}</p>
            </div>
            <div style={{ padding: "0.75rem", borderRadius: 7, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.14)", borderLeft: "3px solid rgba(16,185,129,0.5)" }}>
              <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(16,185,129,0.6)", marginBottom: "0.35rem" }}>✅ Solución</div>
              <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.6, margin: 0 }}>{p.solution}</p>
            </div>
          </div>

          {/* Rol */}
          <div style={{ padding: "0.6rem 0.85rem", borderRadius: 6, marginBottom: "1.25rem", background: "rgba(255,0,149,0.05)", border: "1px solid rgba(255,0,149,0.14)", borderLeft: "3px solid rgba(255,0,149,0.5)" }}>
            <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,0,149,0.6)" }}>👤 Mi rol · </span>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>{p.role}</span>
          </div>

          {/* Logros */}
          <SLabel>Logros destacados</SLabel>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {p.highlights.map((h, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", padding: "0.45rem 0.6rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 6, fontSize: "0.73rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>
                <span style={{ color: "#ff0095", flexShrink: 0, marginTop: "0.1rem" }}>▸</span>{h}
              </motion.li>
            ))}
          </ul>

          {/* Métricas */}
          <SLabel>Métricas de impacto</SLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>{p.metrics.map(m => <MetricBar key={m.label} value={m.bar} label={m.label} />)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
              {p.metrics.map((m, i) => (
                <div key={i} style={{ padding: "0.55rem 0.4rem", background: "rgba(255,0,149,0.06)", border: "1px solid rgba(255,0,149,0.14)", borderRadius: 6, textAlign: "center" }}>
                  <div style={{ fontSize: "0.95rem", marginBottom: "0.12rem" }}>{m.icon}</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "0.85rem", color: "#ff0095", textShadow: "0 0 10px rgba(255,0,149,0.5)", lineHeight: 1 }}>{m.value}</div>
                  {m.sublabel && <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", marginTop: "0.12rem" }}>{m.sublabel}</div>}
                  <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.45)", marginTop: "0.18rem", lineHeight: 1.2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Arquitectura */}
          <SLabel>Arquitectura del sistema</SLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "0.75rem" }}>
            {p.archLayers.map((layer, i) => (
              <div key={i} style={{ display: "flex", gap: "0.65rem", padding: "0.6rem 0.75rem", background: `${layer.color}08`, border: `1px solid ${layer.color}20`, borderRadius: 7 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: layer.color, boxShadow: `0 0 6px ${layer.color}` }} />
                  {i < p.archLayers.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 10, background: `${layer.color}30` }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "#fff", marginBottom: "0.15rem" }}>{layer.name}</div>
                  <p style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.5, margin: "0 0 0.35rem" }}>{layer.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.22rem" }}>
                    {layer.tech.map(t => <span key={t} style={{ fontSize: "0.58rem", padding: "0.08rem 0.38rem", background: `${layer.color}12`, color: `${layer.color}cc`, border: `1px solid ${layer.color}22`, borderRadius: 4, fontFamily: "monospace" }}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1.25rem" }}>
            {p.patterns.map((pt, i) => (
              <span key={i} style={{ fontSize: "0.65rem", padding: "0.22rem 0.6rem", border: "1px solid rgba(255,0,149,0.22)", color: "rgba(255,0,149,0.75)", background: "rgba(255,0,149,0.06)", borderRadius: 20, fontFamily: "monospace" }}>{pt}</span>
            ))}
          </div>

          {/* Desafíos */}
          <SLabel>Retos técnicos superados</SLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1.25rem" }}>
            {p.challenges.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", padding: "0.6rem 0.7rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,0,149,0.1)", borderLeft: "2px solid rgba(255,0,149,0.45)", borderRadius: "0 6px 6px 0", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "0.25rem", right: "0.5rem", fontSize: "1.6rem", fontWeight: 900, color: "rgba(255,0,149,0.05)", fontFamily: "monospace", lineHeight: 1 }}>{String(i + 1).padStart(2,"0")}</div>
                <div style={{ width: 5, height: 5, background: "#ff0095", borderRadius: "50%", flexShrink: 0, marginTop: "0.35rem", boxShadow: "0 0 5px #ff0095" }} />
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.6, margin: 0 }}>{c}</p>
              </div>
            ))}
          </div>

          {/* SCC */}
          <SLabel>Competencias SCC evidenciadas</SLabel>
          <div style={{ padding: "0.65rem", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,0,149,0.1)", borderRadius: 6, marginBottom: "0.65rem", fontFamily: "monospace" }}>
            <div style={{ fontSize: "0.55rem", color: "rgba(255,0,149,0.38)", marginBottom: "0.35rem", letterSpacing: "0.1em" }}>
              COBERTURA SCC.E.1→E.9 · {p.scc.length}/{ALL_SCC.length} competencias verificadas
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
              {ALL_SCC.map(code => {
                const ok = covered.has(code);
                return <span key={code} style={{ fontSize: "0.58rem", padding: "0.15rem 0.5rem", border: `1px solid ${ok ? "rgba(255,0,149,0.5)" : "rgba(255,255,255,0.06)"}`, background: ok ? "rgba(255,0,149,0.12)" : "rgba(255,255,255,0.02)", color: ok ? "rgba(255,0,149,0.88)" : "#374151", borderRadius: 4, boxShadow: ok ? "0 0 5px rgba(255,0,149,0.25)" : "none" }}>{ok ? "◆" : "◇"} {code.replace("SCC.","")}</span>;
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {p.scc.map((scc, i) => {
              const lvl = LEVEL_CFG[scc.level];
              return (
                <div key={i} style={{ padding: "0.65rem 0.8rem", background: "rgba(255,255,255,0.02)", border: `1px solid ${lvl.color}18`, borderRadius: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.28rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.68rem", color: lvl.color }}>{scc.code}</span>
                      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.38)" }}>· {scc.title}</span>
                    </div>
                    <span style={{ fontSize: "0.56rem", textTransform: "uppercase", padding: "0.1rem 0.45rem", borderRadius: 20, border: `1px solid ${lvl.color}28`, background: `${lvl.color}0e`, color: lvl.color, letterSpacing: "0.08em" }}>{lvl.label}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden", marginBottom: "0.38rem" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${lvl.bar}%` }} transition={{ delay: i * 0.06 + 0.2, duration: 0.7 }}
                      style={{ height: "100%", background: `linear-gradient(90deg, ${lvl.color}70, ${lvl.color})`, borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.55, margin: 0 }}>{scc.evidence}</p>
                </div>
              );
            })}
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "0.55rem" }}>
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: "0.78rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <i className="fab fa-github" />GitHub
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: "0.78rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <i className="fas fa-external-link-alt" />Ver demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── ProjectCard ─────────────────────────────────────────────
function ProjectCard({ project: p, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const tm = TYPE_META[p.type];

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} className="project-card"
      style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`, borderLeft: "4px solid var(--primary)" }}>

      <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: "1rem" }}>
        {/* Video thumbnail */}
        <div style={{ borderRadius: 8, overflow: "hidden", border: "2px solid var(--primary)", background: "#000", aspectRatio: "16/9", flexShrink: 0 }}>
          <video src={p.videoSrc} autoPlay muted loop playsInline poster={p.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(255,0,149,0.45)" }}>#{p.num}</span>
              <span style={{ fontSize: "0.58rem", fontWeight: 600, padding: "0.12rem 0.55rem", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em", background: `${tm.color}18`, color: tm.color, border: `1px solid ${tm.color}30` }}>{tm.label}</span>
              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{p.year}</span>
            </div>
            <h3 style={{ margin: "0 0 0.2rem", color: "#fff", fontSize: "0.95rem", fontWeight: 700 }}>{p.title}</h3>
            <p style={{ margin: "0 0 0.55rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>{p.summary}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.27rem", marginBottom: "0.65rem" }}>
              {p.stack.slice(0, 4).map(t => <span key={t} style={{ fontSize: "0.6rem", padding: "0.12rem 0.48rem", background: "rgba(255,0,149,0.08)", border: "1px solid rgba(255,0,149,0.18)", color: "rgba(255,0,149,0.78)", borderRadius: 4, fontFamily: "monospace" }}>{t}</span>)}
              {p.stack.length > 4 && <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.22)" }}>+{p.stack.length - 4} más</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            <button onClick={onOpen} className="btn" style={{ fontSize: "0.72rem", padding: "0.4rem 0.9rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <i className="fas fa-expand-alt" style={{ fontSize: "0.65rem" }} />Ver detalles completos
            </button>
            <button onClick={() => setExpanded(e => !e)}
              style={{ fontSize: "0.7rem", padding: "0.4rem 0.85rem", background: "transparent", border: "1px solid rgba(255,0,149,0.3)", color: "rgba(255,0,149,0.75)", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.28rem", fontFamily: "inherit" }}>
              <i className={`fas fa-chevron-${expanded ? "up" : "down"}`} style={{ fontSize: "0.6rem" }} />
              {expanded ? "Ocultar resumen" : "Ver resumen"}
            </button>
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "0.7rem", padding: "0.4rem 0.85rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", borderRadius: 6, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.28rem" }}>
                <i className="fab fa-github" />GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Acordeón */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32 }} style={{ overflow: "hidden" }}>
            <div style={{ marginTop: "0.85rem", paddingTop: "0.85rem", borderTop: "1px solid rgba(255,0,149,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,0,149,0.55)", marginBottom: "0.4rem" }}>▸ Logros principales</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.28rem" }}>
                  {p.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.52)" }}>
                      <span style={{ color: "#ff0095", flexShrink: 0 }}>✦</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,0,149,0.55)", marginBottom: "0.4rem" }}>▸ Métricas clave</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.28rem" }}>
                  {p.metrics.slice(0, 3).map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <span style={{ fontSize: "0.75rem" }}>{m.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff0095", minWidth: "3rem", fontFamily: "monospace" }}>{m.value}</span>
                      <span style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.32)" }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "0.7rem" }}>
              <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,0,149,0.55)", marginBottom: "0.35rem" }}>▸ SCC evidenciadas: {p.scc.length}/{ALL_SCC.length}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem" }}>
                {p.scc.map(s => <span key={s.code} style={{ fontSize: "0.58rem", padding: "0.12rem 0.48rem", fontFamily: "monospace", background: "rgba(255,0,149,0.1)", border: "1px solid rgba(255,0,149,0.28)", color: "rgba(255,0,149,0.82)", borderRadius: 4 }}>◆ {s.code.replace("SCC.","")}</span>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────
type FilterType = "all" | ProjectType;
const FILTERS: { key: FilterType; label: string }[] = [
  { key:"all",       label:"Todos"      },
  { key:"job",       label:"Prácticas"  },
  { key:"freelance", label:"Freelance"  },
  { key:"academic",  label:"Académico"  },
  { key:"personal",  label:"Personal"   },
];

export default function ClassicProyectos() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [detail, setDetail] = useState<Project | null>(null);
  const counts = {
    all:PROJECTS.length,
    job:PROJECTS.filter(p=>p.type==="job").length,
    freelance:PROJECTS.filter(p=>p.type==="freelance").length,
    academic:PROJECTS.filter(p=>p.type==="academic").length,
    personal:PROJECTS.filter(p=>p.type==="personal").length,
  };
  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.type === filter);

  return (
    <>
      <section className="section">
        <h2><i className="fas fa-code" style={{ marginRight: 10 }} />Proyectos</h2>
        <p className="subtitle">{PROJECTS.length} proyectos reales · «Ver detalles» abre SCC completas, métricas y arquitectura</p>

        {/* Filtros */}
        <div style={{ display:"flex", gap:"0.45rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:"0.38rem 0.9rem", borderRadius:20, border: filter===f.key ? "2px solid var(--primary)" : "1px solid rgba(255,0,149,0.22)", background: filter===f.key ? "linear-gradient(135deg,#ff0095,#e91e63)" : "transparent", color: filter===f.key ? "#fff" : "rgba(255,0,149,0.65)", fontFamily:"inherit", fontSize:"0.75rem", fontWeight:500, cursor:"pointer", boxShadow: filter===f.key ? "0 4px 16px rgba(255,0,149,0.3)" : "none", transition:"all 0.2s ease" }}>
              {f.label} <span style={{ opacity:0.6, fontSize:"0.65rem" }}>({counts[f.key]})</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.97 }} transition={{ duration:0.28, delay:i*0.04 }}>
                <ProjectCard project={p} index={i} onOpen={() => setDetail(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <p style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.18)", textAlign:"center", marginTop:"1.25rem", fontFamily:"monospace" }}>
          {filtered.length} {filtered.length===1?"proyecto":"proyectos"} · haz clic en «Ver detalles completos» para SCC + métricas + arquitectura
        </p>
      </section>

      <AnimatePresence>
        {detail && <DetailDrawer key={detail.id} project={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>
    </>
  );
}
