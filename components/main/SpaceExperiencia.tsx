"use client";

/***
 * SpaceExperiencia — Sección de Experiencia para el estilo Space
 *
 * Concepto visual:
 *  • Fondo: campo de estrellas animado en canvas (parallax con el mouse)
 *  • Timeline: línea horizontal que conecta nodos-planeta
 *  • Cada nodo es un planeta/cuerpo celeste único (forma, color, anillo)
 *  • Al seleccionar un nodo la constelación lo "enfoca": las líneas
 *    entre nodos conectados brillan y viajan partículas por ellas
 *  • Card de detalle se abre con animación de "materialización" desde
 *    el planeta seleccionado hacia abajo
 *  • Fondo nebulosa cambia de tono según el planeta activo
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/utils/motion";

// ═══════════════════════════════════════════════════════════════
//  DATOS
// ═══════════════════════════════════════════════════════════════

type ExpType = "job" | "freelance" | "academic" | "volunteer" | "opensource";

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
  githubUrl?: string;
  liveUrl?: string;
  grade?: string;

  // Identidad visual del "planeta"
  planetColor: string;      // color base
  planetColor2: string;     // color secundario (gradiente)
  hasRing: boolean;         // ¿tiene anillo tipo saturno?
  ringTilt: number;         // inclinación del anillo en grados
  size: number;             // tamaño relativo 1.0 = base
  glowColor: string;        // color del resplandor
  constellation: number[];  // índices de nodos conectados
}

const ITEMS: ExpItem[] = [
  {
    id: "bancario",
    num: "08",
    year: "2023",
    title: "Sistema Bancario",
    role: "Desarrollador Backend · POO",
    entity: "Proyecto Académico",
    period: "Mar 2023 – Jun 2023",
    type: "academic",
    description:
      "Sistema de gestión bancaria orientado a objetos con interfaz gráfica de escritorio. Manejo de cuentas, transferencias y reportes estadísticos.",
    bullets: [
      "Arquitectura POO con herencia múltiple y polimorfismo avanzado",
      "Interfaz Tkinter con 12 pantallas de navegación fluida",
      "Persistencia con archivos JSON y validación estricta",
      "Suite de tests unitarios con cobertura del 85%",
    ],
    stack: ["Python", "Tkinter", "POO", "JSON", "unittest"],
    result: "Calificación 4.9/5.0 — mejor proyecto del semestre",
    grade: "4.9/5.0",
    planetColor: "#6c3483",
    planetColor2: "#1a0533",
    hasRing: false,
    ringTilt: 0,
    size: 1.0,
    glowColor: "#a855f7",
    constellation: [1],
  },
  {
    id: "lavadero",
    num: "07",
    year: "2023",
    title: "Lavadero App",
    role: "Full Stack Developer",
    entity: "Proyecto Académico",
    period: "Jul 2023 – Nov 2023",
    type: "academic",
    description:
      "App full stack para gestión de lavaderos de vehículos con API REST y cliente de escritorio simultáneo conectados en tiempo real.",
    bullets: [
      "API REST con Django REST Framework y autenticación JWT",
      "Cliente de escritorio Tkinter consumiendo la API",
      "Sistema de turnos con polling en tiempo real",
      "Panel admin con estadísticas de ventas y gráficas",
    ],
    stack: ["Django", "DRF", "Tkinter", "PostgreSQL", "JWT"],
    result: "Desplegado y en uso en negocio real durante 3 meses",
    githubUrl: "https://github.com/",
    planetColor: "#0e4a6e",
    planetColor2: "#061a2e",
    hasRing: true,
    ringTilt: 20,
    size: 1.1,
    glowColor: "#06b6d4",
    constellation: [0, 2],
  },
  {
    id: "portfolio-web",
    num: "06",
    year: "2024",
    title: "Portfolio Web",
    role: "Frontend Developer",
    entity: "Proyecto Personal",
    period: "Ene 2024 – Feb 2024",
    type: "freelance",
    description:
      "Portfolio personal responsive con animaciones CSS avanzadas, tema oscuro nativo y rendimiento optimizado al máximo sin frameworks.",
    bullets: [
      "Diseño 100% responsive: mobile, tablet y desktop",
      "Animaciones CSS sin librerías — 0 dependencias externas",
      "Score Lighthouse 98/100 en performance y accesibilidad",
      "WCAG 2.1 AA — accesibilidad completa con screen readers",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "GSAP", "Lighthouse"],
    result: "Score 98/100 · 0 dependencias · Carga < 1s",
    liveUrl: "https://",
    planetColor: "#7a5800",
    planetColor2: "#2a1800",
    hasRing: false,
    ringTilt: 0,
    size: 0.85,
    glowColor: "#f59e0b",
    constellation: [1, 3],
  },
  {
    id: "tienda",
    num: "01",
    year: "2024",
    title: "Tienda Online",
    role: "Full Stack Developer",
    entity: "Proyecto Freelance",
    period: "Feb 2024 – Abr 2024",
    type: "freelance",
    description:
      "E-commerce completo con carrito persistente, pagos Stripe, panel admin y despliegue en contenedores Docker en VPS propio.",
    bullets: [
      "Frontend Next.js con SSR, ISR y rutas protegidas por rol",
      "API FastAPI asíncrona con SQLAlchemy y migraciones Alembic",
      "Integración Stripe Checkout con webhooks idempotentes",
      "Docker Compose + Nginx reverse proxy en VPS",
    ],
    stack: ["Next.js", "FastAPI", "Docker", "PostgreSQL", "Stripe"],
    result: "Cliente activo — 200+ productos · 50+ ventas/mes",
    githubUrl: "https://github.com/",
    liveUrl: "https://",
    planetColor: "#064e3b",
    planetColor2: "#022c22",
    hasRing: true,
    ringTilt: 15,
    size: 1.2,
    glowColor: "#10b981",
    constellation: [2, 4],
  },
  {
    id: "parking",
    num: "03",
    year: "2024",
    title: "ParkingPro SaaS",
    role: "Full Stack Developer · Arquitecto",
    entity: "Práctica Profesional · Ingeniería de Software",
    period: "Mar 2024 – Jun 2024",
    type: "job",
    description:
      "SaaS de gestión de parqueaderos con tiempo real, multi-tenancy y panel analítico. Proyecto líder de la cohorte presentado como caso de estudio.",
    bullets: [
      "API REST Node.js + PostgreSQL con arquitectura multi-tenant",
      "WebSockets (Socket.IO) para 200+ conexiones simultáneas",
      "Dashboard React + D3.js con métricas en tiempo real",
      "Metodología Scrum — 6 sprints de 2 semanas, 0 deuda técnica",
    ],
    stack: ["Node.js", "PostgreSQL", "Socket.IO", "React", "D3.js", "AWS"],
    result: "Nota 4.8/5.0 · Caso de estudio en clase de Arquitectura",
    grade: "4.8/5.0",
    githubUrl: "https://github.com/",
    planetColor: "#4a1d96",
    planetColor2: "#1e0850",
    hasRing: true,
    ringTilt: 25,
    size: 1.35,
    glowColor: "#8b5cf6",
    constellation: [3, 5],
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
      "Módulo de gestión documental para entidad registral con flujos de aprobación multinivel, auditoría completa y exportación.",
    bullets: [
      "API REST Express + PostgreSQL con 40+ endpoints documentados",
      "Sistema RBAC con roles y permisos granulares por recurso",
      "Flujo de aprobación con notificaciones en tiempo real",
      "Reducción del tiempo de procesamiento documental un 60%",
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "Redis", "Nodemailer"],
    result: "En producción — 500+ documentos procesados por día",
    planetColor: "#7c1d1d",
    planetColor2: "#300a0a",
    hasRing: false,
    ringTilt: 0,
    size: 1.1,
    glowColor: "#ef4444",
    constellation: [4, 6],
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
      "Plataforma de pedidos online para restaurante con menú dinámico, pagos Stripe, reembolsos automáticos y panel del propietario.",
    bullets: [
      "SPA React con carrito persistente y checkout en 2 pasos",
      "Backend Django + DRF con gestión de pedidos en tiempo real",
      "Integración Stripe con reembolsos y facturación automática",
      "Dashboard propietario: ventas, platos top, inventario en vivo",
    ],
    stack: ["Django", "React", "Stripe", "Tailwind", "Celery", "Redis"],
    result: "Pedidos online del restaurante aumentaron 35% en 30 días",
    githubUrl: "https://github.com/",
    liveUrl: "https://",
    planetColor: "#7c3900",
    planetColor2: "#2a1200",
    hasRing: true,
    ringTilt: 18,
    size: 1.0,
    glowColor: "#f97316",
    constellation: [5, 7],
  },
  {
    id: "misalud",
    num: "05",
    year: "2024",
    title: "MiSalud",
    role: "Full Stack Developer · Capstone",
    entity: "Proyecto Académico — Capstone Final",
    period: "Sep 2024 – Dic 2024",
    type: "academic",
    description:
      "App de salud digital con seguimiento de signos vitales, citas médicas, expediente clínico electrónico y cifrado de datos sensibles.",
    bullets: [
      "Django REST Framework con autenticación OAuth2 + 2FA",
      "Frontend React + Tailwind como PWA con modo offline completo",
      "Gráficas de signos vitales en tiempo real con Recharts + WebSocket",
      "Cifrado AES-256 para todos los datos médicos sensibles (HIPAA-inspired)",
    ],
    stack: ["Django", "React", "Tailwind", "PostgreSQL", "PWA", "WebSocket"],
    result: "🏆 Premio Mejor Proyecto Capstone 2024 · Nota 5.0/5.0",
    grade: "5.0/5.0",
    githubUrl: "https://github.com/",
    planetColor: "#0c3547",
    planetColor2: "#051520",
    hasRing: true,
    ringTilt: 30,
    size: 1.3,
    glowColor: "#22d3ee",
    constellation: [6],
  },
];

// ═══════════════════════════════════════════════════════════════
//  TIPOS → META
// ═══════════════════════════════════════════════════════════════

const TYPE_META: Record<ExpType, { label: string; icon: string; color: string }> = {
  job:        { label: "Práctica",    icon: "◈", color: "#f87171" },
  freelance:  { label: "Freelance",   icon: "◆", color: "#4ade80" },
  academic:   { label: "Académico",   icon: "✦", color: "#c084fc" },
  volunteer:  { label: "Voluntario",  icon: "♡", color: "#fbbf24" },
  opensource: { label: "Open Source", icon: "⊕", color: "#38bdf8" },
};

// ═══════════════════════════════════════════════════════════════
//  STARFIELD CANVAS — campo de estrellas con parallax del mouse
// ═══════════════════════════════════════════════════════════════

function StarfieldCanvas({ activeGlow }: { activeGlow: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    // Capas de estrellas (diferente velocidad parallax)
    const layers = [0.008, 0.02, 0.04].map((speed, li) => ({
      speed,
      stars: Array.from({ length: [120, 60, 30][li] }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: [0.6, 1.0, 1.6][li] + Math.random() * [0.4, 0.6, 0.8][li],
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
      })),
    }));

    let t = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / W - 0.5,
        y: (e.clientY - rect.top)  / H - 0.5,
      };
    };

    window.addEventListener("mousemove", onMove);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // Nebulosa dinámica según planeta activo
      const grad = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.6);
      grad.addColorStop(0,   activeGlow + "18");
      grad.addColorStop(0.4, activeGlow + "08");
      grad.addColorStop(1,   "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      layers.forEach((layer) => {
        const ox = mouseRef.current.x * layer.speed * W;
        const oy = mouseRef.current.y * layer.speed * H;

        layer.stars.forEach((star) => {
          const twinkle = Math.sin(t * star.twinkleSpeed + star.twinklePhase) * 0.35 + 0.65;
          const alpha   = star.brightness * twinkle;

          let sx = star.x + ox;
          let sy = star.y + oy;

          // wrap
          if (sx < 0) sx += W; if (sx > W) sx -= W;
          if (sy < 0) sy += H; if (sy > H) sy -= H;

          ctx.beginPath();
          ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();

          // Destellos en estrellas grandes
          if (star.r > 1.5 && twinkle > 0.85) {
            ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
            ctx.lineWidth = 0.5;
            const len = star.r * 3;
            ctx.beginPath();
            ctx.moveTo(sx - len, sy); ctx.lineTo(sx + len, sy);
            ctx.moveTo(sx, sy - len); ctx.lineTo(sx, sy + len);
            ctx.stroke();
          }
        });
      });
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [activeGlow]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ═══════════════════════════════════════════════════════════════
//  PLANETA SVG — cada proyecto es un cuerpo celeste único
// ═══════════════════════════════════════════════════════════════

function PlanetSVG({
  item,
  size,
  active,
  hovered,
}: {
  item: ExpItem;
  size: number;
  active: boolean;
  hovered: boolean;
}) {
  const px = size;  // píxeles base
  const gId = `pg-${item.id}`;
  const hId = `ph-${item.id}`;

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      overflow="visible"
    >
      <defs>
        <radialGradient id={gId} cx="38%" cy="32%">
          <stop offset="0%"   stopColor={item.planetColor}  stopOpacity="1" />
          <stop offset="60%"  stopColor={item.planetColor}  stopOpacity="0.9" />
          <stop offset="100%" stopColor={item.planetColor2} stopOpacity="1" />
        </radialGradient>

        <radialGradient id={hId} cx="50%" cy="50%">
          <stop offset="0%"   stopColor={item.glowColor} stopOpacity={active ? "0.55" : hovered ? "0.3" : "0.12"} />
          <stop offset="100%" stopColor={item.glowColor} stopOpacity="0" />
        </radialGradient>

        <filter id={`blur-${item.id}`}>
          <feGaussianBlur stdDeviation={active ? "4" : "2"} />
        </filter>
      </defs>

      {/* Halo de resplandor */}
      <ellipse
        cx={px / 2} cy={px / 2}
        rx={px * 0.7} ry={px * 0.7}
        fill={`url(#${hId})`}
      />

      {/* Anillo (Saturno-style) */}
      {item.hasRing && (
        <g transform={`rotate(${item.ringTilt} ${px / 2} ${px / 2})`}>
          <ellipse
            cx={px / 2} cy={px / 2}
            rx={px * 0.52} ry={px * 0.12}
            fill="none"
            stroke={item.glowColor}
            strokeWidth={active ? 2 : 1}
            strokeOpacity={active ? 0.7 : hovered ? 0.5 : 0.25}
          />
          <ellipse
            cx={px / 2} cy={px / 2}
            rx={px * 0.44} ry={px * 0.09}
            fill="none"
            stroke={item.glowColor}
            strokeWidth={0.5}
            strokeOpacity={active ? 0.4 : 0.15}
          />
        </g>
      )}

      {/* Cuerpo del planeta */}
      <circle
        cx={px / 2} cy={px / 2}
        r={px * 0.36}
        fill={`url(#${gId})`}
      />

      {/* Textura de superficie (líneas de latitud) */}
      {[0.28, 0.18, 0.06, -0.08].map((dy, i) => (
        <ellipse
          key={i}
          cx={px / 2}
          cy={px / 2 + dy * px}
          rx={Math.sqrt(Math.max(0, (px * 0.36) ** 2 - (dy * px) ** 2)) * 0.95}
          ry={Math.abs(dy * px) * 0.18 + 1}
          fill="none"
          stroke={item.glowColor}
          strokeWidth={0.6}
          strokeOpacity={0.15}
        />
      ))}

      {/* Brillo especular */}
      <circle
        cx={px * 0.38} cy={px * 0.34}
        r={px * 0.08}
        fill="white"
        fillOpacity={0.12}
        filter={`url(#blur-${item.id})`}
      />

      {/* Corona activa */}
      {(active || hovered) && (
        <circle
          cx={px / 2} cy={px / 2}
          r={px * 0.39}
          fill="none"
          stroke={item.glowColor}
          strokeWidth={active ? 1.5 : 0.8}
          strokeOpacity={active ? 0.8 : 0.4}
          strokeDasharray="4 3"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${px / 2} ${px / 2}`}
            to={`360 ${px / 2} ${px / 2}`}
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NODO DE PLANETA EN EL TIMELINE
// ═══════════════════════════════════════════════════════════════

function PlanetNode({
  item,
  index,
  isActive,
  isHovered,
  onClick,
  onHover,
}: {
  item: ExpItem;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}) {
  const meta    = TYPE_META[item.type];
  const pxSize  = Math.round(56 * item.size);

  return (
    <motion.div
      className="relative flex flex-col items-center flex-shrink-0 cursor-pointer group"
      style={{ width: pxSize + 48 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Año flotante encima */}
      <motion.div
        animate={{ opacity: isActive || isHovered ? 1 : 0.35, y: isActive ? -2 : 0 }}
        transition={{ duration: 0.25 }}
        className="text-[10px] font-mono mb-2 tracking-widest"
        style={{ color: isActive ? item.glowColor : "rgba(200,200,220,0.4)" }}
      >
        {item.year}
      </motion.div>

      {/* Planeta */}
      <motion.div
        animate={{
          scale: isActive ? 1.18 : isHovered ? 1.08 : 1,
          filter: isActive
            ? `drop-shadow(0 0 18px ${item.glowColor}aa)`
            : isHovered
            ? `drop-shadow(0 0 10px ${item.glowColor}66)`
            : "none",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10"
      >
        <PlanetSVG item={item} size={pxSize} active={isActive} hovered={isHovered} />
      </motion.div>

      {/* Tipo badge */}
      <motion.div
        animate={{ opacity: isActive || isHovered ? 1 : 0.4 }}
        className="mt-2 flex items-center gap-1"
      >
        <span className="text-[11px]" style={{ color: meta.color }}>
          {meta.icon}
        </span>
        <span className="text-[9px] font-mono tracking-[0.15em] uppercase" style={{ color: meta.color + "cc" }}>
          {meta.label}
        </span>
      </motion.div>

      {/* Nombre del proyecto */}
      <motion.div
        animate={{
          color: isActive ? "#ffffff" : isHovered ? "rgba(255,255,255,0.85)" : "rgba(180,170,220,0.55)",
          scale: isActive ? 1.04 : 1,
        }}
        className="mt-1 text-[11px] font-semibold text-center leading-tight max-w-[90px]"
        transition={{ duration: 0.2 }}
      >
        {item.title}
      </motion.div>

      {/* Nodo en la línea de tiempo */}
      <div className="mt-3 relative z-10">
        <motion.div
          animate={{
            width: isActive ? 10 : isHovered ? 8 : 6,
            height: isActive ? 10 : isHovered ? 8 : 6,
            boxShadow: isActive
              ? `0 0 12px ${item.glowColor}, 0 0 24px ${item.glowColor}44`
              : isHovered
              ? `0 0 8px ${item.glowColor}88`
              : "none",
          }}
          className="rounded-full"
          style={{ background: isActive ? item.glowColor : item.glowColor + "60" }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  LÍNEA DE CONSTELACIÓN (SVG encima del timeline)
// ═══════════════════════════════════════════════════════════════

function ConstellationLine({
  activeIdx,
  hoveredIdx,
  nodePositions,
  items,
}: {
  activeIdx: number;
  hoveredIdx: number;
  nodePositions: number[];
  items: ExpItem[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const LINE_Y = 32; // Y de la línea dentro del SVG overlay

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });

    return () => ro.disconnect();
  }, []);

  if (!dims.w || nodePositions.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute pointer-events-none"
      style={{ top: 0, left: 0, width: dims.w, height: dims.h, overflow: "visible" }}
    >
      <defs>
        {items.map((item) => (
          <filter key={item.id} id={`glow-line-${item.id}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {/* Línea base del timeline */}
      <line
        x1={nodePositions[0] ?? 0}
        y1={LINE_Y}
        x2={nodePositions[nodePositions.length - 1] ?? dims.w}
        y2={LINE_Y}
        stroke="rgba(112,66,248,0.2)"
        strokeWidth={1}
      />

      {/* Segmentos entre nodos */}
      {items.map((item, i) => {
        item.constellation.forEach(() => {}); // used below
        return null;
      })}

      {nodePositions.slice(0, -1).map((x1, i) => {
        const x2    = nodePositions[i + 1];
        const isAct = i === activeIdx || i + 1 === activeIdx;
        const isHov = i === hoveredIdx || i + 1 === hoveredIdx;
        const col   = isAct
          ? items[activeIdx]?.glowColor ?? "#7042f8"
          : isHov
          ? items[hoveredIdx]?.glowColor ?? "#7042f8"
          : "rgba(112,66,248,0.3)";

        return (
          <g key={i}>
            <line
              x1={x1} y1={LINE_Y}
              x2={x2} y2={LINE_Y}
              stroke={col}
              strokeWidth={isAct ? 1.5 : 0.8}
              strokeOpacity={isAct ? 0.9 : isHov ? 0.6 : 0.3}
              filter={isAct ? `url(#glow-line-${items[i]?.id})` : undefined}
            />

            {/* Partícula viajando (solo activo) */}
            {isAct && (
              <circle r={2.5} fill={col}>
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M${x1},${LINE_Y} L${x2},${LINE_Y}`}
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* Marcas de año */}
      {["2023", "2024"].map((y) => {
        const firstIdx = items.findIndex((it) => it.year === y);
        if (firstIdx < 0 || !nodePositions[firstIdx]) return null;

        return (
          <g key={y}>
            <line
              x1={nodePositions[firstIdx]} y1={LINE_Y - 10}
              x2={nodePositions[firstIdx]} y2={LINE_Y + 10}
              stroke="rgba(180,155,255,0.4)"
              strokeWidth={1}
            />
            <text
              x={nodePositions[firstIdx]}
              y={LINE_Y + 22}
              textAnchor="middle"
              fontSize={9}
              fill="rgba(180,155,255,0.5)"
              fontFamily="monospace"
              letterSpacing="0.15em"
            >
              {y}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CARD DE DETALLE — materialización desde el planeta
// ═══════════════════════════════════════════════════════════════

function DetailCard({
  item,
  onClose,
}: {
  item: ExpItem;
  onClose: () => void;
}) {
  const meta = TYPE_META[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden"
      style={{
        border: `1px solid ${item.glowColor}35`,
        background: `linear-gradient(135deg, ${item.planetColor}25 0%, rgba(3,0,20,0.97) 55%)`,
        boxShadow: `0 0 80px ${item.glowColor}18, 0 0 160px ${item.glowColor}08, inset 0 0 40px ${item.glowColor}06`,
        borderRadius: 16,
      }}
    >
      {/* Nebulosa interior */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 30%, ${item.glowColor}12 0%, transparent 60%)`,
        }}
      />

      {/* Línea superior de color */}
      <div
        className="h-[1px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${item.glowColor}80 30%, ${item.glowColor} 50%, ${item.glowColor}80 70%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Columna izquierda: identidad + bullets ── */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-start gap-5 mb-6">
            {/* Planeta mini */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0 mt-1"
            >
              <PlanetSVG item={item} size={64} active hovered={false} />
            </motion.div>

            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className="text-[9px] font-mono tracking-[0.2em] px-2 py-[3px] uppercase"
                  style={{
                    color: meta.color,
                    border: `1px solid ${meta.color}35`,
                    background: `${meta.color}12`,
                  }}
                >
                  {meta.icon} {meta.label}
                </span>

                <span className="text-[9px] font-mono text-gray-600 tracking-wider">
                  {item.period}
                </span>

                {item.grade && (
                  <span
                    className="text-[9px] font-mono px-2 py-[3px] tracking-wider"
                    style={{
                      color: item.glowColor,
                      border: `1px solid ${item.glowColor}35`,
                      background: `${item.glowColor}10`,
                    }}
                  >
                    ★ {item.grade}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white mb-1 leading-tight">
                {item.title}
              </h2>
              <p className="text-sm font-medium mb-1" style={{ color: item.glowColor + "cc" }}>
                {item.role}
              </p>
              <p className="text-xs text-gray-500">{item.entity}</p>
            </div>
          </div>

          {/* Línea divisora */}
          <div
            className="h-[1px] mb-5"
            style={{
              background: `linear-gradient(90deg, ${item.glowColor}50, ${item.glowColor}15, transparent)`,
            }}
          />

          {/* Descripción */}
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Bullets con icono de estrella */}
          <ul className="flex flex-col gap-3">
            {item.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <span
                  className="mt-[3px] flex-shrink-0 text-[10px]"
                  style={{ color: item.glowColor }}
                >
                  ✦
                </span>
                {b}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ── Columna derecha: stack + resultado + links ── */}
        <div className="flex flex-col gap-4">
          {/* Stack completo */}
          <div
            className="p-4 rounded-xl"
            style={{
              border: `1px solid ${item.glowColor}18`,
              background: `${item.glowColor}06`,
            }}
          >
            <div
              className="text-[9px] font-mono tracking-[0.2em] uppercase mb-3"
              style={{ color: item.glowColor + "70" }}
            >
              {/* stack tecnológico */}
            </div>
            <div className="flex flex-wrap gap-2">
              {item.stack.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-1 rounded font-mono"
                  style={{
                    border: `1px solid ${item.glowColor}25`,
                    color: item.glowColor + "cc",
                    background: item.glowColor + "0d",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Resultado */}
          {item.result && (
            <div
              className="p-4 rounded-xl"
              style={{
                border: `1px solid ${item.glowColor}25`,
                background: `linear-gradient(135deg, ${item.glowColor}10, transparent)`,
              }}
            >
              <div
                className="text-[9px] font-mono tracking-[0.2em] uppercase mb-2"
                style={{ color: item.glowColor + "70" }}
              >
                {/* resultado */}
              </div>
              <p className="text-sm text-white leading-relaxed">{item.result}</p>
            </div>
          )}

          {/* Grade grande */}
          {item.grade && (
            <div
              className="flex items-center justify-center py-5 rounded-xl"
              style={{
                border: `1px solid ${item.glowColor}20`,
                background: `${item.glowColor}08`,
              }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-4xl font-bold font-mono"
                  style={{
                    color: item.glowColor,
                    textShadow: `0 0 30px ${item.glowColor}88`,
                  }}
                >
                  {item.grade}
                </motion.div>
                <div className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest font-mono">
                  Calificación final
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-col gap-2 mt-auto">
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-mono transition-all"
                style={{
                  border: `1px solid ${item.glowColor}30`,
                  color: item.glowColor + "cc",
                  background: `${item.glowColor}0a`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${item.glowColor}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${item.glowColor}0a`;
                }}
              >
                ⌥ Ver en GitHub
              </a>
            )}

            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-mono transition-all"
                style={{
                  background: `linear-gradient(90deg, ${item.glowColor}30, ${item.glowColor}15)`,
                  border: `1px solid ${item.glowColor}50`,
                  color: item.glowColor,
                }}
              >
                ↗ Ver demo live
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 text-xs font-mono transition-colors"
        style={{ color: "rgba(200,200,220,0.3)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = item.glowColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(200,200,220,0.3)";
        }}
      >
        ✕ cerrar
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STATS BAR
// ═══════════════════════════════════════════════════════════════

function StatsBar() {
  const counts = useMemo(
    () => ({
      total:      ITEMS.length,
      job:        ITEMS.filter(e => e.type === "job").length,
      freelance:  ITEMS.filter(e => e.type === "freelance").length,
      academic:   ITEMS.filter(e => e.type === "academic").length,
    }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex gap-6 justify-center mb-12 flex-wrap"
    >
      {[
        { val: counts.total,     label: "proyectos",  color: "#b49bff" },
        { val: counts.job,       label: "prácticas",  color: "#f87171" },
        { val: counts.freelance, label: "freelance",  color: "#4ade80" },
        { val: counts.academic,  label: "académicos", color: "#c084fc" },
      ].map((s) => (
        <div key={s.label} className="flex flex-col items-center">
          <span
            className="text-3xl font-bold font-mono"
            style={{ color: s.color, textShadow: `0 0 20px ${s.color}55` }}
          >
            {s.val}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-600 mt-1">
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function SpaceExperiencia({
  onProjectClick,
}: {
  onProjectClick?: (item: ExpItem) => void;
}) {
  const [activeId,  setActiveId]  = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const trackRef     = useRef<HTMLDivElement>(null);
  const nodeRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const [nodeXs, setNodeXs] = useState<number[]>([]);

  const activeItem  = ITEMS.find(e => e.id === activeId)  ?? null;
  const activeIdx   = ITEMS.findIndex(e => e.id === activeId);
  const hoveredIdx  = ITEMS.findIndex(e => e.id === hoveredId);
  const activeGlow  = activeItem?.glowColor ?? "#7042f8";

  // Calcular posiciones X de los nodos para las líneas de constelación
  useEffect(() => {
    const recalc = () => {
      const track = trackRef.current;
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const xs = nodeRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.left - trackRect.left + r.width / 2 + track.scrollLeft;
      });
      setNodeXs(xs);
    };

    recalc();
    window.addEventListener("resize", recalc);
    trackRef.current?.addEventListener("scroll", recalc, { passive: true });

    return () => {
      window.removeEventListener("resize", recalc);
      trackRef.current?.removeEventListener("scroll", recalc);
    };
  }, []);

  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();

    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") =>
    trackRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });

  const handleSelect = useCallback(
    (id: string) => {
      const next = activeId === id ? null : id;
      setActiveId(next);

      if (next && onProjectClick) {
        const item = ITEMS.find(e => e.id === next);
        if (item) onProjectClick(item);
      }

      // Scroll al nodo activo
      if (next) {
        const idx = ITEMS.findIndex(e => e.id === next);
        const el  = nodeRefs.current[idx];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    },
    [activeId, onProjectClick]
  );

  // ESC para cerrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="experiencia"
      className="relative flex flex-col items-center py-20 overflow-hidden"
      style={{ minHeight: "80vh" }}
    >
      {/* ── Starfield de fondo ── */}
      <div className="absolute inset-0 z-0">
        <StarfieldCanvas activeGlow={activeGlow} />
      </div>

      {/* Nebulosa fija */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
          style={{
            width: 800, height: 400,
            background: `radial-gradient(ellipse, ${activeGlow}12 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ── Header ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center mb-10 px-6"
      >
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-6"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Trayectoria estelar</h1>
        </motion.div>

        <motion.h2
          variants={slideInFromLeft(0.4)}
          className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center mb-2"
        >
          Experiencia
        </motion.h2>

        <motion.p
          variants={slideInFromRight(0.5)}
          className="cursive text-[18px] text-gray-300 text-center"
        >
          Cada proyecto, un planeta en mi constelación
        </motion.p>
      </motion.div>

      {/* ── Stats ── */}
      <div className="relative z-10 w-full">
        <StatsBar />
      </div>

      {/* ── Timeline horizontal ── */}
      <div className="relative z-10 w-full max-w-[1200px] px-4">
        {/* Botones de navegación */}
        <AnimatePresence>
          {canLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-[60px] z-30 w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{
                background: "rgba(3,0,20,0.9)",
                border: "1px solid rgba(180,155,255,0.3)",
                color: "#b49bff",
                boxShadow: "6px 0 24px rgba(3,0,20,0.8)",
              }}
            >
              ‹
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-[60px] z-30 w-9 h-9 flex items-center justify-center rounded-full transition-all"
              style={{
                background: "rgba(3,0,20,0.9)",
                border: "1px solid rgba(180,155,255,0.3)",
                color: "#b49bff",
                boxShadow: "-6px 0 24px rgba(3,0,20,0.8)",
              }}
            >
              ›
            </motion.button>
          )}
        </AnimatePresence>

        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-14 z-20 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(3,0,20,1), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-14 z-20 pointer-events-none"
          style={{ background: "linear-gradient(270deg, rgba(3,0,20,1), transparent)" }}
        />

        {/* Wrapper relativo para el SVG de constelación */}
        <div className="relative">
          {/* SVG de líneas de constelación */}
          <ConstellationLine
            activeIdx={activeIdx}
            hoveredIdx={hoveredIdx}
            nodePositions={nodeXs}
            items={ITEMS}
          />

          {/* Track scrolleable */}
          <div
            ref={trackRef}
            className="flex items-end gap-4 overflow-x-auto scrollbar-hidden px-10 pb-8"
            style={{ scrollSnapType: "x proximity" }}
          >
            {ITEMS.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[i] = el; }}
                style={{ scrollSnapAlign: "center" }}
              >
                <PlanetNode
                  item={item}
                  index={i}
                  isActive={activeId === item.id}
                  isHovered={hoveredId === item.id}
                  onClick={() => handleSelect(item.id)}
                  onHover={setHoveredId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel de detalle ── */}
      <div className="relative z-10 w-full max-w-[1200px] px-4 mt-4">
        <AnimatePresence mode="wait">
          {activeItem && (
            <DetailCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveId(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-8 text-[11px] font-mono text-gray-700 tracking-widest"
      >
        {ITEMS.length} cuerpos celestes · click para explorar · ESC para cerrar
      </motion.p>
    </section>
  );
}
