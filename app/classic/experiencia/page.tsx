"use client";

/***
 * Classic → /classic/experiencia
 * 
 * Diseño: Timeline vertical con línea lateral magenta (#ff0095).
 * Cada entrada tiene:
 *   - Nodo circular con ícono FontAwesome
 *   - Card con glassmorphism oscuro (igual que .section del estilo)
 *   - Badge de tipo (práctica / freelance / académico)
 *   - Bullets de logros
 *   - Chips de stack tecnológico
 *   - Contador animado de resultado clave
 *   - Barra de impacto visual
 * 
 * Sin dependencias externas nuevas — solo CSS del tema + animaciones CSS.
 */

import React, { useEffect, useRef, useState } from "react";

// ── Tipos ──────────────────────────────────────────────────────

type ExpType = "job" | "freelance" | "academic" | "volunteer";

interface ExpItem {
  id: string;
  num: string;
  year: string;
  title: string;
  role: string;
  entity: string;
  period: string;
  type: ExpType;
  description: string;
  bullets: string[];
  stack: string[];
  result?: string;
  impactLabel?: string;  // "40% más rápido"
  impactNum?: number;    // número que se anima (ej: 40)
  impactSuffix?: string; // "%", "x", "+"
  githubUrl?: string;
  liveUrl?: string;
  grade?: string;
  faIcon: string;        // clase FontAwesome completa
}

// ── Datos reales del proyecto ──────────────────────────────────

const ITEMS: ExpItem[] = [
  {
    id: "bancario",
    num: "08",
    year: "2023",
    title: "Sistema Bancario",
    role: "Desarrollador Full Stack",
    entity: "Proyecto Académico · Universidad del Valle",
    period: "Mar 2023 – Jun 2023",
    type: "academic",
    description:
      "Sistema de gestión bancaria orientado a objetos con interfaz gráfica de escritorio. Manejo de cuentas, transferencias y reportes estadísticos completos.",
    bullets: [
      "Arquitectura POO con herencia múltiple y polimorfismo avanzado",
      "Interfaz Tkinter con 12 pantallas de navegación fluida",
      "Persistencia con archivos estructurados y validación robusta",
      "Suite de tests unitarios con cobertura del 85%",
    ],
    stack: ["Python", "Tkinter", "POO", "JSON", "unittest"],
    result: "Calificación 4.9/5.0 — mejor proyecto del semestre",
    impactLabel: "calificación",
    impactNum: 49,
    impactSuffix: "/5",
    grade: "4.9/5.0",
    githubUrl: "https://github.com/Karatsuyu/Banco.git",
    faIcon: "fas fa-university",
  },
  {
    id: "lavadero",
    num: "07",
    year: "2023",
    title: "Lavadero App",
    role: "Desarrollador Full Stack",
    entity: "Proyecto Académico · Universidad del Valle",
    period: "Jul 2023 – Nov 2023",
    type: "academic",
    description:
      "App full stack para gestión de lavaderos de vehículos con API REST Django y cliente de escritorio Tkinter conectados en tiempo real.",
    bullets: [
      "API REST con Django REST Framework y autenticación JWT",
      "Cliente de escritorio Tkinter consumiendo la API en tiempo real",
      "Sistema de turnos con polling y actualización automática",
      "Panel admin con estadísticas de ventas y gráficas diarias",
    ],
    stack: ["Django", "DRF", "Tkinter", "PostgreSQL", "JWT"],
    result: "Sistema en uso en negocio real durante 3 meses",
    impactLabel: "meses en producción",
    impactNum: 3,
    impactSuffix: "+",
    githubUrl: "https://github.com/Karatsuyu/Lavelo-Pues.git",
    faIcon: "fas fa-car",
  },
  {
    id: "portfolio-web",
    num: "06",
    year: "2024",
    title: "Portfolio Web Multi-Estilo",
    role: "Frontend Developer · Designer",
    entity: "Proyecto Personal",
    period: "Ene 2024 – Feb 2024",
    type: "freelance",
    description:
      "Portfolio personal con 4 temas visuales radicalmente distintos (Space, Classic, Runic, Cyber). Cada tema es un sistema de diseño completo e independiente.",
    bullets: [
      "4 sistemas de diseño completamente independientes en un solo proyecto",
      "Next.js 13 App Router con SSR y rutas dinámicas por tema",
      "Animaciones Three.js, Framer Motion y Canvas API",
      "Score Lighthouse 94/100 en performance — responsive total",
    ],
    stack: ["Next.js", "TypeScript", "Three.js", "Framer Motion", "Tailwind"],
    result: "Score Lighthouse 94/100 · 4 temas · 0 bugs críticos",
    impactLabel: "temas visuales únicos",
    impactNum: 4,
    impactSuffix: "",
    liveUrl: "/",
    faIcon: "fas fa-palette",
  },
  {
    id: "tienda",
    num: "01",
    year: "2024",
    title: "Tienda Online",
    role: "Full Stack Developer · DevOps",
    entity: "Proyecto Freelance",
    period: "Feb 2024 – Abr 2024",
    type: "freelance",
    description:
      "E-commerce completo con carrito persistente, pagos Stripe reales, panel admin y despliegue en contenedores Docker en VPS propio.",
    bullets: [
      "Frontend Next.js 15 con SSR, ISR y rutas protegidas por rol",
      "API FastAPI asíncrona con SQLAlchemy 2 y migraciones Alembic",
      "Integración Stripe Checkout con webhooks idempotentes",
      "Docker Compose + Nginx reverse proxy en VPS propio",
    ],
    stack: ["Next.js", "FastAPI", "Docker", "PostgreSQL", "Stripe", "Redis"],
    result: "Cliente activo — 200+ productos · 50+ ventas/mes",
    impactLabel: "ventas mensuales",
    impactNum: 50,
    impactSuffix: "+",
    githubUrl: "https://github.com/Karatsuyu/Tienda-Online.git",
    faIcon: "fas fa-shopping-cart",
  },
  {
    id: "parking",
    num: "03",
    year: "2024",
    title: "ParkingPro SaaS",
    role: "Full Stack Developer · Arquitecto de Software",
    entity: "Práctica Profesional · Ingeniería de Software",
    period: "Mar 2024 – Jun 2024",
    type: "job",
    description:
      "SaaS de gestión de parqueaderos con tiempo real, multi-tenancy y panel analítico. Presentado como caso de estudio en clase de Arquitectura.",
    bullets: [
      "API REST Node.js + PostgreSQL 15 con arquitectura multi-tenant",
      "WebSockets con Socket.IO para 200+ conexiones simultáneas",
      "Dashboard React + Recharts con métricas en tiempo real",
      "Metodología Scrum — 6 sprints de 2 semanas, 0 deuda técnica",
    ],
    stack: ["Node.js", "PostgreSQL", "Socket.IO", "React", "Recharts", "AWS"],
    result: "Nota 4.8/5.0 · Caso de estudio en Arquitectura de Software",
    impactLabel: "conexiones WebSocket",
    impactNum: 200,
    impactSuffix: "+",
    grade: "4.8/5.0",
    githubUrl: "https://github.com/Karatsuyu/parking-app.git",
    faIcon: "fas fa-parking",
  },
  {
    id: "registral",
    num: "04",
    year: "2024",
    title: "Sistema Registral",
    role: "Backend Developer",
    entity: "Práctica Profesional",
    period: "Jun 2024 – Dic 2024",
    type: "job",
    description:
      "Módulo de gestión documental para entidad registral con flujos de aprobación multinivel, auditoría completa y reducción drástica del tiempo de procesamiento.",
    bullets: [
      "API REST Express + PostgreSQL con 50+ endpoints documentados",
      "Sistema RBAC con roles y permisos granulares por recurso",
      "Flujo de aprobación multinivel con notificaciones en tiempo real",
      "Reducción del tiempo de procesamiento documental un 60%",
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "Redis", "JWT", "Nodemailer"],
    result: "En producción — 500+ documentos procesados por día",
    impactLabel: "reducción en tiempo de proceso",
    impactNum: 60,
    impactSuffix: "%",
    githubUrl: "https://github.com/Karatsuyu/Registradur-a-De-Colombia.git",
    faIcon: "fas fa-file-alt",
  },
  {
    id: "delicious",
    num: "02",
    year: "2024",
    title: "Delicious Food",
    role: "Full Stack Developer",
    entity: "Freelance — Restaurante Local",
    period: "Jul 2024 – Sep 2024",
    type: "freelance",
    description:
      "Plataforma de pedidos online para restaurante con menú dinámico, combos personalizados, pagos Stripe y panel del propietario con analíticas.",
    bullets: [
      "SPA React 19 + Vite con carrito persistente y checkout en 2 pasos",
      "Backend Django 5 + DRF con gestión de pedidos en tiempo real",
      "Integración Stripe completa: checkout, webhooks y reembolsos",
      "Dashboard propietario: ventas, platos populares, inventario",
    ],
    stack: ["Django", "React", "Stripe", "Tailwind", "Celery", "Redis"],
    result: "Pedidos online del restaurante aumentaron 35% en 30 días",
    impactLabel: "aumento en pedidos online",
    impactNum: 35,
    impactSuffix: "%",
    githubUrl: "https://github.com/Karatsuyu/delicious-food-app.git",
    faIcon: "fas fa-utensils",
  },
  {
    id: "misalud",
    num: "05",
    year: "2024",
    title: "MiSalud",
    role: "Full Stack Developer · Capstone Final",
    entity: "Proyecto Académico · Universidad del Valle",
    period: "Sep 2024 – Dic 2024",
    type: "academic",
    description:
      "App de salud digital con seguimiento de signos vitales, citas médicas, expediente clínico electrónico y cifrado AES-256 para datos médicos sensibles.",
    bullets: [
      "Django REST Framework con autenticación OAuth2 + 2FA",
      "Frontend React + Tailwind como PWA con modo offline completo",
      "Gráficas de signos vitales con Recharts + WebSocket en tiempo real",
      "Cifrado AES-256 para datos médicos sensibles (HIPAA-inspired)",
    ],
    stack: ["Django", "React", "Tailwind", "PostgreSQL", "PWA", "WebSocket"],
    result: "🏆 Premio Mejor Proyecto Capstone 2024 · Nota 5.0/5.0",
    impactLabel: "calificación",
    impactNum: 50,
    impactSuffix: "/5",
    grade: "5.0/5.0",
    githubUrl: "https://github.com/Karatsuyu/Mi-Salud.git",
    faIcon: "fas fa-heartbeat",
  },
];

const TYPE_META: Record<
  ExpType,
  { label: string; color: string; bg: string; border: string }
> = {
  job:       { label: "Práctica Profesional", color: "#ff6b9d", bg: "rgba(255,107,157,0.12)", border: "rgba(255,107,157,0.35)" },
  freelance: { label: "Freelance",            color: "#34d399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.30)" },
  academic:  { label: "Académico",            color: "#a78bfa", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.30)" },
  volunteer: { label: "Voluntario",           color: "#fbbf24", bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.30)" },
};

// ── Contador animado ───────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix,
  active,
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const [val, setVal] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    let start = 0;
    const step = () => {
      start += Math.ceil(target / 30);
      if (start >= target) { setVal(target); return; }
      setVal(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);

  // Format: if suffix is "/5" show as X.X/5
  const display =
    suffix === "/5"
      ? (val / 10).toFixed(1)
      : val;

  return (
    <span>
      {display}
      {suffix !== "/5" ? suffix : "/5"}
    </span>
  );
}

// ── Card de experiencia ────────────────────────────────────────

function ExpCard({ item, index }: { item: ExpItem; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const [vis,  setVis]  = useState(false);
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[item.type];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } },
      { threshold: 0.15 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`exp-item ${vis ? "exp-visible" : ""} ${isLeft ? "exp-left" : "exp-right"}`}
      style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
    >
      {/* Nodo en la línea */}
      <div className="exp-node">
        <div className="exp-node-ring" />
        <div className="exp-node-core">
          <i className={item.faIcon} />
        </div>
      </div>

      {/* Card */}
      <div className={`exp-card ${open ? "exp-card-open" : ""}`}>
        {/* Header */}
        <div className="exp-card-header" onClick={() => setOpen(o => !o)}>
          <div className="exp-card-header-left">
            {/* Badge tipo */}
            <span
              className="exp-badge"
              style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
            >
              {meta.label}
            </span>
            {/* Año */}
            <span className="exp-year">{item.year} · {item.period}</span>
          </div>
          {/* Número */}
          <span className="exp-num">{item.num}</span>
        </div>

        {/* Título + rol */}
        <div className="exp-card-body">
          <h3 className="exp-title">{item.title}</h3>
          <p className="exp-role">{item.role}</p>
          <p className="exp-entity">
            <i className="fas fa-building" style={{ marginRight: 6, opacity: 0.5 }} />
            {item.entity}
          </p>

          {/* Barra de impacto visual */}
          {item.impactNum && (
            <div className="exp-impact">
              <div className="exp-impact-top">
                <span className="exp-impact-label">{item.impactLabel}</span>
                <span className="exp-impact-value">
                  <AnimatedCounter
                    target={item.impactNum}
                    suffix={item.impactSuffix ?? ""}
                    active={vis}
                  />
                </span>
              </div>
              <div className="exp-impact-bar">
                <div
                  className="exp-impact-fill"
                  style={{
                    width: vis ? `${Math.min(item.impactNum, 100)}%` : "0%",
                    transitionDelay: `${index * 0.1 + 0.4}s`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Descripción */}
          <p className="exp-desc">{item.description}</p>

          {/* Acordeón: bullets + stack */}
          <div className={`exp-details ${open ? "exp-details-open" : ""}`}>
            <ul className="exp-bullets">
              {item.bullets.map((b, i) => (
                <li key={i}>
                  <span className="exp-bullet-dot">▸</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Stack */}
            <div className="exp-stack">
              {item.stack.map((t) => (
                <span key={t} className="exp-chip">
                  {t}
                </span>
              ))}
            </div>

            {/* Resultado */}
            {item.result && (
              <div className="exp-result">
                <i className="fas fa-star" style={{ marginRight: 6 }} />
                {item.result}
              </div>
            )}

            {/* Grade */}
            {item.grade && (
              <div className="exp-grade">
                <span className="exp-grade-label">Calificación</span>
                <span className="exp-grade-val">{item.grade}</span>
              </div>
            )}

            {/* Links */}
            {(item.githubUrl || item.liveUrl) && (
              <div className="exp-links">
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn exp-btn"
                  >
                    <i className="fab fa-github" style={{ marginRight: 6 }} />
                    GitHub
                  </a>
                )}
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn exp-btn exp-btn-outline"
                  >
                    <i className="fas fa-external-link-alt" style={{ marginRight: 6 }} />
                    Ver Live
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Toggle acordeón */}
          <button
            className="exp-toggle"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
          >
            {open ? (
              <>
                <i className="fas fa-chevron-up" style={{ marginRight: 6 }} />
                Mostrar menos
              </>
            ) : (
              <>
                <i className="fas fa-chevron-down" style={{ marginRight: 6 }} />
                Ver detalles
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stats resumen ──────────────────────────────────────────────

function StatsRow() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } },
      { threshold: 0.3 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const stats = [
    { val: ITEMS.length,                                      suffix: "",  label: "Proyectos" },
    { val: ITEMS.filter(e => e.type === "job").length,        suffix: "",  label: "Prácticas" },
    { val: ITEMS.filter(e => e.type === "freelance").length,  suffix: "",  label: "Freelance"  },
    { val: ITEMS.filter(e => e.type === "academic").length,   suffix: "",  label: "Académicos" },
  ];

  return (
    <div ref={ref} className="exp-stats">
      {stats.map((s) => (
        <div key={s.label} className="exp-stat-item">
          <span className="exp-stat-val">
            <AnimatedCounter target={s.val} suffix={s.suffix} active={vis} />
          </span>
          <span className="exp-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Filtro de tipo ─────────────────────────────────────────────

const FILTERS: { key: ExpType | "all"; label: string }[] = [
  { key: "all",       label: "Todos"     },
  { key: "job",       label: "Prácticas" },
  { key: "freelance", label: "Freelance" },
  { key: "academic",  label: "Académico" },
];

// ── Página principal ───────────────────────────────────────────

export default function ClassicExperiencia() {
  const [filter, setFilter] = useState<ExpType | "all">("all");

  const filtered = filter === "all"
    ? ITEMS
    : ITEMS.filter(i => i.type === filter);

  return (
    <>
      {/* Estilos locales — extienden el sistema existente del Classic */}
      <style>{`
/* ── Variables locales ──────────────────────────── */
.exp-section {
  --exp-primary: #ff0095;
  --exp-line-w: 2px;
  --exp-node-size: 44px;
}

/* ── Stats ─────────────────────────────────────── */
.exp-stats {
  display: flex;
  gap: 0;
  border: 1px solid rgba(255,0,149,0.25);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
}

.exp-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 0.75rem;
  border-right: 1px solid rgba(255,0,149,0.15);
  transition: background 0.25s;
}

.exp-stat-item:last-child { border-right: none; }
.exp-stat-item:hover { background: rgba(255,0,149,0.06); }

.exp-stat-val {
  font-size: 2rem;
  font-weight: 800;
  color: var(--exp-primary, #ff0095);
  text-shadow: 0 0 20px rgba(255,0,149,0.5);
  line-height: 1;
}

.exp-stat-label {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 0.35rem;
}

/* ── Filtros ───────────────────────────────────── */
.exp-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.exp-filter-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 20px;
  border: 1px solid rgba(255,0,149,0.3);
  background: transparent;
  color: rgba(255,255,255,0.55);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.22s ease;
  font-family: 'Inter', sans-serif;
}

.exp-filter-btn:hover {
  border-color: #ff0095;
  color: #ff0095;
  background: rgba(255,0,149,0.08);
}

.exp-filter-btn.active {
  background: linear-gradient(135deg, #ff0095, #e91e63);
  border-color: #ff0095;
  color: #fff;
  box-shadow: 0 4px 16px rgba(255,0,149,0.35);
}

/* ── Timeline wrapper ──────────────────────────── */
.exp-timeline {
  position: relative;
  padding: 1rem 0 2rem;
}

/* Línea central */
.exp-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: var(--exp-line-w, 2px);
  transform: translateX(-50%);
  background: linear-gradient(to bottom,
    transparent,
    #ff0095 8%,
    rgba(255,0,149,0.4) 50%,
    #ff0095 92%,
    transparent);
  box-shadow: 0 0 12px rgba(255,0,149,0.3);
}

/* ── Item de timeline ──────────────────────────── */
.exp-item {
  position: relative;
  width: 46%;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.55s ease var(--delay, 0s),
              transform 0.55s ease var(--delay, 0s);
}

.exp-visible {
  opacity: 1;
  transform: translateY(0);
}

.exp-left  { margin-right: auto; margin-left: 2%; }
.exp-right { margin-left: auto;  margin-right: 2%; }

/* ── Nodo ──────────────────────────────────────── */
.exp-node {
  position: absolute;
  top: 18px;
  width: var(--exp-node-size, 44px);
  height: var(--exp-node-size, 44px);
}

.exp-left  .exp-node { right: -10%; }
.exp-right .exp-node { left: -10%; }

.exp-node-ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,0,149,0.4);
  animation: exp-pulse 2.5s ease-in-out infinite;
}

@keyframes exp-pulse {
  0%,100% { opacity: 0.4; transform: scale(1);    box-shadow: none; }
  50%      { opacity: 1;   transform: scale(1.12); box-shadow: 0 0 16px rgba(255,0,149,0.4); }
}

.exp-node-core {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff0095, #e91e63);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 0 20px rgba(255,0,149,0.5), 0 4px 12px rgba(0,0,0,0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.exp-item:hover .exp-node-core {
  transform: scale(1.12);
  box-shadow: 0 0 30px rgba(255,0,149,0.7), 0 6px 20px rgba(0,0,0,0.4);
}

/* Línea conectora nodo → card */
.exp-left  .exp-node::after,
.exp-right .exp-node::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 26px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,0,149,0.6), transparent);
}

.exp-left  .exp-node::after { right: -26px; }
.exp-right .exp-node::after { left: -26px; transform: rotate(180deg); }

/* ── Card ──────────────────────────────────────── */
.exp-card {
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,0,149,0.2);
  border-radius: 14px;
  backdrop-filter: blur(14px);
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
}

.exp-card::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,0,149,0.06), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.exp-card:hover::before { left: 100%; }

.exp-card:hover,
.exp-card-open {
  border-color: rgba(255,0,149,0.55);
  box-shadow: 0 0 30px rgba(255,0,149,0.15), 0 8px 32px rgba(0,0,0,0.3);
  transform: translateY(-3px);
}

/* Header de card */
.exp-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.1rem 0.5rem;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid rgba(255,0,149,0.08);
}

.exp-card-header:hover { background: rgba(255,0,149,0.04); }

.exp-card-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.exp-badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.exp-year {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.05em;
}

.exp-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: rgba(255,0,149,0.18);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* Body */
.exp-card-body { padding: 0.8rem 1.1rem 1rem; }

.exp-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.2rem;
  line-height: 1.3;
}

.exp-role {
  font-size: 0.8rem;
  color: #ff0095;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.exp-entity {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.85rem;
}

/* Barra de impacto */
.exp-impact {
  margin-bottom: 0.85rem;
}

.exp-impact-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.35rem;
}

.exp-impact-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.exp-impact-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ff0095;
  text-shadow: 0 0 12px rgba(255,0,149,0.5);
}

.exp-impact-bar {
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

.exp-impact-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #ff0095, #e91e63);
  box-shadow: 0 0 8px rgba(255,0,149,0.6);
  transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
}

/* Descripción */
.exp-desc {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.65;
  margin-bottom: 0;
}

/* Detalles acordeón */
.exp-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1);
}

.exp-details-open { max-height: 800px; }

/* Bullets */
.exp-bullets {
  list-style: none;
  padding: 0;
  margin: 0.85rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.exp-bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.55;
}

.exp-bullet-dot {
  color: #ff0095;
  font-size: 0.65rem;
  margin-top: 0.18rem;
  flex-shrink: 0;
}

/* Stack chips */
.exp-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
}

.exp-chip {
  font-size: 0.68rem;
  padding: 0.22rem 0.65rem;
  border-radius: 20px;
  border: 1px solid rgba(255,0,149,0.25);
  color: rgba(255,0,149,0.85);
  background: rgba(255,0,149,0.07);
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* Resultado */
.exp-result {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.7);
  background: rgba(255,0,149,0.08);
  border-left: 3px solid #ff0095;
  padding: 0.55rem 0.75rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

/* Grade */
.exp-grade {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255,0,149,0.2);
  border-radius: 8px;
  background: rgba(255,0,149,0.05);
  margin-bottom: 0.75rem;
}

.exp-grade-label {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.exp-grade-val {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ff0095;
  text-shadow: 0 0 14px rgba(255,0,149,0.5);
}

/* Links */
.exp-links { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem; }
.exp-btn { font-size: 0.78rem !important; padding: 0.5rem 1rem !important; }
.exp-btn-outline {
  background: transparent !important;
  border: 2px solid rgba(255,0,149,0.5) !important;
  color: #ff0095 !important;
}
.exp-btn-outline:hover {
  background: rgba(255,0,149,0.12) !important;
  border-color: #ff0095 !important;
}

/* Toggle */
.exp-toggle {
  margin-top: 0.65rem;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(255,0,149,0.7);
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  padding: 0;
  transition: color 0.2s;
}

.exp-toggle:hover { color: #ff0095; }

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 700px) {
  .exp-timeline::before { left: 22px; }
  .exp-item { width: 85%; margin-left: 55px !important; margin-right: 0 !important; }
  .exp-left .exp-node,
  .exp-right .exp-node { left: -45px; right: auto; }
  .exp-left .exp-node::after,
  .exp-right .exp-node::after { left: 44px; right: auto; transform: none; }
  .exp-stats { flex-wrap: wrap; }
  .exp-stat-item { min-width: 45%; }
}

/* ── Tema claro ─────────────────────────────────── */
body[data-theme="light"] .exp-card {
  background: rgba(255,255,255,0.85);
  border-color: rgba(37,99,235,0.3);
}
body[data-theme="light"] .exp-card:hover,
body[data-theme="light"] .exp-card-open {
  border-color: rgba(37,99,235,0.55);
  box-shadow: 0 0 30px rgba(37,99,235,0.15), 0 8px 32px rgba(0,0,0,0.3);
}
body[data-theme="light"] .exp-title { color: var(--dark, #1e293b); }
body[data-theme="light"] .exp-role { color: #2563eb; }
body[data-theme="light"] .exp-desc  { color: rgba(30,41,59,0.7); }
body[data-theme="light"] .exp-bullets li { color: rgba(30,41,59,0.75); }
body[data-theme="light"] .exp-stats {
  background: rgba(255,255,255,0.8);
  border-color: rgba(37,99,235,0.3);
}
body[data-theme="light"] .exp-stat-item {
  border-right-color: rgba(37,99,235,0.15);
}
body[data-theme="light"] .exp-stat-item:hover {
  background: rgba(37,99,235,0.06);
}
body[data-theme="light"] .exp-stat-val {
  color: #2563eb;
  text-shadow: 0 0 20px rgba(37,99,235,0.5);
}
body[data-theme="light"] .exp-stat-label { color: rgba(30,41,59,0.5); }
body[data-theme="light"] .exp-year { color: rgba(30,41,59,0.4); }
body[data-theme="light"] .exp-entity { color: rgba(30,41,59,0.45); }
body[data-theme="light"] .exp-impact-label { color: rgba(30,41,59,0.4); }
body[data-theme="light"] .exp-impact-value {
  color: #2563eb;
  text-shadow: 0 0 12px rgba(37,99,235,0.5);
}
body[data-theme="light"] .exp-impact-fill {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  box-shadow: 0 0 8px rgba(37,99,235,0.6);
}
body[data-theme="light"] .exp-result { 
  color: rgba(30,41,59,0.7);
  background: rgba(37,99,235,0.08);
  border-left-color: #2563eb;
}
body[data-theme="light"] .exp-grade {
  border-color: rgba(37,99,235,0.2);
  background: rgba(37,99,235,0.05);
}
body[data-theme="light"] .exp-grade-val {
  color: #2563eb;
  text-shadow: 0 0 14px rgba(37,99,235,0.5);
}
body[data-theme="light"] .exp-chip {
  color: #2563eb;
  background: rgba(37,99,235,0.07);
  border-color: rgba(37,99,235,0.25);
}
body[data-theme="light"] .exp-bullet-dot {
  color: #2563eb;
}
body[data-theme="light"] .exp-filter-btn {
  border-color: rgba(37,99,235,0.3);
  color: rgba(30,41,59,0.7);
}
body[data-theme="light"] .exp-filter-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: rgba(37,99,235,0.08);
}
body[data-theme="light"] .exp-filter-btn.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: #2563eb;
  color: #fff;
  box-shadow: 0 4px 16px rgba(37,99,235,0.35);
}
body[data-theme="light"] .exp-node-core {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 0 20px rgba(37,99,235,0.5), 0 4px 12px rgba(0,0,0,0.4);
}
body[data-theme="light"] .exp-item:hover .exp-node-core {
  box-shadow: 0 0 30px rgba(37,99,235,0.7), 0 6px 20px rgba(0,0,0,0.4);
}
body[data-theme="light"] .exp-node-ring {
  border-color: rgba(37,99,235,0.4);
}
body[data-theme="light"] .exp-timeline::before {
  background: linear-gradient(to bottom,
    transparent,
    #2563eb 8%,
    rgba(37,99,235,0.4) 50%,
    #2563eb 92%,
    transparent);
  box-shadow: 0 0 12px rgba(37,99,235,0.3);
}
body[data-theme="light"] .exp-node::after {
  background: linear-gradient(90deg, rgba(37,99,235,0.6), transparent);
}
body[data-theme="light"] .exp-toggle {
  color: rgba(37,99,235,0.7);
}
body[data-theme="light"] .exp-toggle:hover {
  color: #2563eb;
}
body[data-theme="light"] .exp-btn-outline {
  border-color: rgba(37,99,235,0.5) !important;
  color: #2563eb !important;
}
body[data-theme="light"] .exp-btn-outline:hover {
  background: rgba(37,99,235,0.12) !important;
  border-color: #2563eb !important;
}
body[data-theme="light"] .exp-card-header {
  border-bottom-color: rgba(37,99,235,0.08);
}
body[data-theme="light"] .exp-card-header:hover {
  background: rgba(37,99,235,0.04);
}
      `}</style>

      <section className="section exp-section">
        {/* Título de sección */}
        <h2>
          <i className="fas fa-briefcase" style={{ marginRight: 12, opacity: 0.85 }} />
          Experiencia
        </h2>
        <p className="subtitle" style={{ marginBottom: "2rem" }}>
          Trayectoria profesional y académica — proyectos que generan impacto real
        </p>

        {/* Stats */}
        <StatsRow />

        {/* Filtros */}
        <div className="exp-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`exp-filter-btn ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="exp-timeline">
          {filtered.map((item, i) => (
            <ExpCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Footer de sección */}
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "1rem" }}>
          {filtered.length} {filtered.length === 1 ? "entrada" : "entradas"} · haz clic en «Ver detalles» para expandir
        </p>
      </section>
    </>
  );
}
