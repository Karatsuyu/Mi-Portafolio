"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";

type FormacionNode = {
  id: string;
  title: string;
  institution: string;
  description: string;
  tags: string[];
  type: "frontend" | "backend" | "otros";
  accentColor?: string;
  x: number;
  y: number;
  magnitude: number;
};

const FORMACION = [
  {
    id: "tecnologia-software",
    title: "Tecnología en Desarrollo de Software",
    institution: "Universidad del Valle — Sede Caicedonia",
    description:
      "Formación orientada al desarrollo de software con énfasis en programación, estructuras de datos, arquitectura de sistemas y gestión de proyectos. Estado: 6° semestre (en curso).",
    tags: [
      "Programación",
      "Estructuras de datos",
      "Arquitectura",
      "Gestión de proyectos",
      "Buenas prácticas",
    ],
    type: "otros",
    x: 0.16, y: 0.18,   // posición relativa en el mapa (0..1)
    magnitude: 1.0,       // brillo de la estrella
  },
  {
    id: "programacion-poo-eventos",
    title: "Programación (imperativa, POO y eventos)",
    institution: "Universidad del Valle",
    description:
      "Bases sólidas de programación: imperativa, orientación a objetos y programación orientada a eventos. Enfoque en lógica, diseño de clases y buenas prácticas.",
    tags: ["Java", "Python", "POO", "Eventos", "Buenas prácticas"],
    type: "otros",
    x: 0.36, y: 0.22,
    magnitude: 0.8,
  },
  {
    id: "algoritmos-estructuras",
    title: "Estructuras de Datos y Algoritmos",
    institution: "Universidad del Valle",
    description:
      "Algoritmos, análisis de complejidad y estructuras de datos para resolver problemas de forma eficiente y mantenible.",
    tags: ["Algoritmos", "Estructuras", "Complejidad", "Buenas prácticas"],
    type: "otros",
    x: 0.28, y: 0.42,
    magnitude: 0.85,
  },
  {
    id: "bases-datos",
    title: "Bases de Datos",
    institution: "Universidad del Valle",
    description:
      "Modelado relacional, SQL, normalización y diseño de bases de datos orientado a aplicaciones reales.",
    tags: ["SQL", "Diseño relacional", "Modelado", "Consultas"],
    type: "backend",
    x: 0.5, y: 0.36,
    magnitude: 0.75,
  },
  {
    id: "ingenieria-software",
    title: "Ingeniería de Software",
    institution: "Universidad del Valle",
    description:
      "Gestión de proyectos de software, ciclo de vida, pruebas, documentación y buenas prácticas de desarrollo para equipos.",
    tags: ["Ciclo de vida", "Pruebas", "Documentación", "Gestión", "Calidad"],
    type: "otros",
    x: 0.62, y: 0.46,
    magnitude: 0.9,
  },
  {
    id: "desarrollo-web",
    title: "Desarrollo Web",
    institution: "Universidad del Valle",
    description:
      "Construcción de interfaces web con HTML, CSS, JavaScript y frameworks, con enfoque en experiencias modernas y responsivas.",
    tags: ["HTML", "CSS", "JavaScript", "Frameworks", "UI"],
    type: "frontend",
    x: 0.74, y: 0.28,
    magnitude: 0.95,
  },

  {
    id: "apps-moviles",
    title: "Desarrollo de Aplicaciones Móviles",
    institution: "Universidad del Valle",
    description:
      "Desarrollo de aplicaciones móviles con enfoque en arquitectura, consumo de APIs y experiencia de usuario.",
    tags: ["React Native", "Arquitectura", "APIs", "UI/UX"],
    type: "otros",
    x: 0.86, y: 0.48,
    magnitude: 0.85,
  },
  {
    id: "sistemas-redes",
    title: "Sistemas Operativos y Redes",
    institution: "Universidad del Valle",
    description:
      "Fundamentos de sistemas operativos, redes y conceptos de infraestructura para construir software robusto.",
    tags: ["SO", "Redes", "Procesos", "TCP/IP"],
    type: "backend",
    accentColor: "#f97316",
    x: 0.46, y: 0.62,
    magnitude: 0.8,
  },
  {
    id: "fundamentos-matematicos",
    title: "Fundamentos de Computación",
    institution: "Universidad del Valle",
    description:
      "Base matemática y computacional: matemáticas discretas, álgebra lineal, cálculo, probabilidad y estadística aplicada.",
    tags: ["Discretas", "Álgebra", "Cálculo", "Probabilidad", "Estadística"],
    type: "otros",
    x: 0.18, y: 0.66,
    magnitude: 0.75,
  },
  {
    id: "proyecto-integrador",
    title: "Proyecto Integrador",
    institution: "Universidad del Valle",
    description:
      "Experiencia aplicada enfocada en construir soluciones reales: análisis, implementación, pruebas y entrega.",
    tags: ["Soluciones reales", "Trabajo en equipo", "Entrega", "Testing"],
    type: "otros",
    accentColor: "#f59e0b",
    x: 0.72, y: 0.72,
    magnitude: 0.9,
  },
  {
    id: "ciberseguridad",
    title: "Ciberseguridad (fundamentos)",
    institution: "Universidad del Valle",
    description:
      "Fundamentos de seguridad informática y concientización: buenas prácticas de protección de sistemas, ética y vulnerabilidades comunes.",
    tags: ["Seguridad", "Buenas prácticas", "Ética", "Vulnerabilidades"],
    type: "backend",
    accentColor: "#ef4444",
    x: 0.58, y: 0.84,
    magnitude: 0.85,
  },
  {
    id: "complementaria",
    title: "Formación Complementaria",
    institution: "Universidad del Valle",
    description:
      "Ética profesional, comunicación académica, ingeniería económica e impactos ambientales aplicados al desarrollo.",
    tags: ["Ética", "Comunicación", "Economía", "Impacto ambiental"],
    type: "otros",
    x: 0.30, y: 0.86,
    magnitude: 0.7,
  },
] satisfies FormacionNode[];

// Conexiones entre nodos (por id)
const CONNECTIONS: Array<[FormacionNode["id"], FormacionNode["id"]]> = [
  ["tecnologia-software", "programacion-poo-eventos"],
  ["tecnologia-software", "fundamentos-matematicos"],
  ["tecnologia-software", "algoritmos-estructuras"],
  ["tecnologia-software", "bases-datos"],
  ["programacion-poo-eventos", "algoritmos-estructuras"],
  ["programacion-poo-eventos", "desarrollo-web"],
  ["algoritmos-estructuras", "bases-datos"],
  ["algoritmos-estructuras", "ingenieria-software"],
  ["fundamentos-matematicos", "algoritmos-estructuras"],
  ["bases-datos", "ingenieria-software"],
  ["bases-datos", "desarrollo-web"],
  ["ingenieria-software", "desarrollo-web"],
  ["ingenieria-software", "apps-moviles"],
  ["desarrollo-web", "apps-moviles"],
  ["bases-datos", "sistemas-redes"],
  ["sistemas-redes", "ingenieria-software"],
  ["sistemas-redes", "ciberseguridad"],
  ["ingenieria-software", "proyecto-integrador"],
  ["desarrollo-web", "proyecto-integrador"],
  ["apps-moviles", "proyecto-integrador"],
  ["proyecto-integrador", "ciberseguridad"],
  ["fundamentos-matematicos", "complementaria"],
  ["complementaria", "ingenieria-software"],
  ["complementaria", "ciberseguridad"],
];

const TYPE_CONFIG = {
  frontend: { color: "#b49bff", label: "Frontend" },
  backend:  { color: "#7042f8", label: "Backend"  },
  otros:    { color: "#06b6d4", label: "Otros"    },
};

const clampByte = (v: number) => Math.max(0, Math.min(255, v));

const hash01 = (str: string) => {
  // FNV-1a (determinista, rápido)
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
};

const tweakHex = (hex: string, amount: number) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  // amount in [-0.2..0.2] approx
  const factor = 1 + amount;
  const rr = clampByte(Math.round(r * factor));
  const gg = clampByte(Math.round(g * factor));
  const bb = clampByte(Math.round(b * factor));

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
};

const NODE_COLOR_CACHE = new Map<string, string>();
const colorForNode = (node: FormacionNode) => {
  const cached = NODE_COLOR_CACHE.get(node.id);
  if (cached) return cached;

  const base = node.accentColor ?? TYPE_CONFIG[node.type as keyof typeof TYPE_CONFIG].color;
  const jitter = (hash01(node.id) - 0.5) * 0.14; // variación leve
  const c = tweakHex(base, jitter);
  NODE_COLOR_CACHE.set(node.id, c);
  return c;
};

// ── Canvas de constelaciones ────────────────────────────────
function ConstellationCanvas({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Evita scroll/pinch en touch mientras se arrastra
    canvas.style.touchAction = "none";

    // Mapa virtual (más grande que el canvas) para poder navegar arrastrando
    const WORLD_W = 1600;
    const WORLD_H = 980;
    const panRef = { x: 0, y: 0 };

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let raf: number;
    let hoverId: string | null = null;

    // Estado de arrastre
    let pointerDown = false;
    let dragMoved = false;
    let startX = 0;
    let startY = 0;
    let startPanX = 0;
    let startPanY = 0;

    const clampPan = () => {
      const maxX = Math.max(0, WORLD_W - canvas.width);
      const maxY = Math.max(0, WORLD_H - canvas.height);
      panRef.x = Math.max(0, Math.min(panRef.x, maxX));
      panRef.y = Math.max(0, Math.min(panRef.y, maxY));
    };

    const worldPos = (node: FormacionNode) => ({
      x: node.x * WORLD_W,
      y: node.y * WORLD_H,
    });

    const screenPos = (node: FormacionNode) => {
      const wp = worldPos(node);
      return {
        x: wp.x - panRef.x,
        y: wp.y - panRef.y,
      };
    };

    // Centrar vista inicial alrededor del contenido
    {
      const xs = FORMACION.map((n) => worldPos(n).x);
      const ys = FORMACION.map((n) => worldPos(n).y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      panRef.x = (minX + maxX) / 2 - canvas.width / 2;
      panRef.y = (minY + maxY) / 2 - canvas.height / 2;
      clampPan();
    }

    // colorForNode viene de helpers a nivel de módulo

    const hitTest = (mx: number, my: number) => {
      const wx = mx + panRef.x;
      const wy = my + panRef.y;
      for (const node of FORMACION) {
        const p = worldPos(node);
        if (Math.hypot(wx - p.x, wy - p.y) < 24) {
          return node.id;
        }
      }
      return null;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (pointerDown) {
        const dx = mx - startX;
        const dy = my - startY;
        if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
        panRef.x = startPanX - dx;
        panRef.y = startPanY - dy;
        clampPan();
        canvas.style.cursor = "grabbing";
        hoverId = null;
        return;
      }

      hoverId = hitTest(mx, my);
      canvas.style.cursor = hoverId ? "pointer" : "grab";
    };

    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      pointerDown = true;
      dragMoved = false;
      startX = mx;
      startY = my;
      startPanX = panRef.x;
      startPanY = panRef.y;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      canvas.style.cursor = "grabbing";
    };

    const onUp = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      pointerDown = false;
      canvas.style.cursor = "grab";

      if (!dragMoved) {
        const hit = hitTest(mx, my);
        if (hit) {
          onSelect(hit);
          return;
        }
        onSelect("");
      }
    };

    const onLeave = () => {
      hoverId = null;
      if (!pointerDown) canvas.style.cursor = "grab";
    };

    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      // No-op: el click se resuelve en onUp para diferenciarlo del drag
      void mx;
      void my;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;

      // Fondo sutil (para profundidad)
      const bg = ctx.createRadialGradient(W * 0.55, H * 0.45, 0, W * 0.55, H * 0.45, Math.max(W, H));
      bg.addColorStop(0, "rgba(255,255,255,0.02)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Estrellas de fondo ──────────────────────────────
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      for (let i = 0; i < 160; i++) {
        // seed determinista en el mundo
        const wx = ((i * 137.5) % 1) * WORLD_W;
        const wy = ((i * 73.1 + 0.3) % 1) * WORLD_H;
        const sx = wx - panRef.x;
        const sy = wy - panRef.y;
        if (sx < -10 || sy < -10 || sx > W + 10 || sy > H + 10) continue;
        const sr = 0.5 + ((i * 0.31) % 0.8);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Líneas de constelación ──────────────────────────
      const byId = new Map(FORMACION.map((n) => [n.id, n] as const));
      CONNECTIONS.forEach(([aId, bId]) => {
        const a = byId.get(aId);
        const b = byId.get(bId);
        if (!a || !b) return;
        const pa = screenPos(a);
        const pb = screenPos(b);
        const isActive =
          activeIdRef.current === a.id ||
          activeIdRef.current === b.id;

        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        const cA = colorForNode(a);
        const cB = colorForNode(b);
        grad.addColorStop(0, cA + (isActive ? "90" : "28"));
        grad.addColorStop(1, cB + (isActive ? "90" : "28"));

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isActive ? 1.5 : 0.7;
        ctx.stroke();

        // Partícula viajando por la línea
        const frac = (Math.sin(t + a.x * 7 + b.y * 3) * 0.5 + 0.5);
        const px = pa.x + (pb.x - pa.x) * frac;
        const py = pa.y + (pb.y - pa.y) * frac;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = cA + "cc";
        ctx.fill();
      });

      // ── Nodos de estrella ───────────────────────────────
      FORMACION.forEach((node) => {
        const p = screenPos(node);
        const cfg = TYPE_CONFIG[node.type as keyof typeof TYPE_CONFIG];
        const nodeColor = colorForNode(node);
        const isHover  = hoverId === node.id;
        const isActive = activeIdRef.current === node.id;
        const pulse = 1 + Math.sin(t * 1.8 + node.x * 10) * 0.15;
        const baseR = (isActive ? 14 : isHover ? 12 : 8) * node.magnitude * pulse;

        // Halo exterior
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, baseR * 3);
        halo.addColorStop(0, nodeColor + "40");
        halo.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * 3, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Estrella (cruz de destellos)
        ctx.strokeStyle = nodeColor + (isActive ? "ff" : "88");
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x - baseR * 2, p.y);
        ctx.lineTo(p.x + baseR * 2, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - baseR * 2);
        ctx.lineTo(p.x, p.y + baseR * 2);
        ctx.stroke();

        // Core
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, baseR);
        grad.addColorStop(0, "white");
        grad.addColorStop(0.3, nodeColor);
        grad.addColorStop(1, nodeColor + "00");
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Anillo si activo
        if (isActive) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, baseR + 6 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = nodeColor + "50";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Label encima
        ctx.font = `${isActive ? "bold " : ""}11px 'Inter', sans-serif`;
        ctx.fillStyle = isActive ? "white" : "rgba(200,200,220,0.65)";
        ctx.textAlign = "center";
        ctx.fillText(node.title.length > 20 ? node.title.slice(0, 18) + "…" : node.title, p.x, p.y - baseR - 8);
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, []); // eslint-disable-line

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ display: "block" }}
    />
  );
}

// ── Panel de detalle del nodo ───────────────────────────────
function NodeDetail({ node }: { node: typeof FORMACION[0] | null }) {
  if (!node) return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="text-4xl mb-4 opacity-30">✦</div>
      <p className="text-gray-600 text-sm">Haz clic en una estrella<br />para explorar su historia</p>
    </div>
  );

  const cfg = TYPE_CONFIG[node.type as keyof typeof TYPE_CONFIG];
  const detailColor = colorForNode(node);

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="p-6 h-full flex flex-col"
    >
      {/* Tipo badge */}
      <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full self-start mb-4"
        style={{ background: detailColor + "18", color: detailColor, border: `1px solid ${detailColor}30` }}>
        {cfg.label}
      </span>
      <h3 className="text-xl font-bold text-white mb-1">{node.title}</h3>
      <p className="text-sm mb-4" style={{ color: detailColor + "99" }}>{node.institution}</p>

      <div className="h-[1px] mb-4" style={{ background: `linear-gradient(90deg, ${detailColor}50, transparent)` }} />

      <p className="text-gray-400 text-sm leading-relaxed flex-1">{node.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {node.tags.map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-1 rounded-full"
            style={{ border: `1px solid ${detailColor}28`, color: detailColor + "90", background: detailColor + "0a" }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const Formacion = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeNode = FORMACION.find(f => f.id === activeId) ?? null;

  const handleSelect = (id: string) => setActiveId(prev => prev === id || !id ? null : id);

  return (
    <section id="formacion" className="flex flex-col items-center py-20 relative overflow-hidden">
      {/* Nebulosa fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] rounded-full bg-purple-900/12 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[200px] rounded-full bg-indigo-900/10 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="flex flex-col items-center mb-10 z-10 relative"
      >
        <motion.div variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-6">
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Mapa estelar del conocimiento</h1>
        </motion.div>
        <motion.h2 variants={slideInFromLeft(0.4)}
          className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
          Formación
        </motion.h2>
        <motion.p variants={slideInFromRight(0.5)}
          className="cursive text-[18px] text-gray-300 mt-3 text-center">
          Una constelación de aprendizaje continuo
        </motion.p>
      </motion.div>

      {/* Layout principal */}
      <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas de constelaciones — 2/3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden relative"
          style={{
            height: 440,
            border: "1px solid rgba(112,66,248,0.2)",
            background: "rgba(3,0,20,0.8)",
            boxShadow: "0 0 60px rgba(112,66,248,0.08)",
          }}
        >
          <ConstellationCanvas activeId={activeId} onSelect={handleSelect} />

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 flex gap-4">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 5px ${cfg.color}` }} />
                <span className="text-[10px] text-gray-500">{cfg.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Panel de detalle — 1/3 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl relative overflow-hidden"
          style={{
            height: 440,
            border: "1px solid rgba(112,66,248,0.15)",
            background: "rgba(3,0,20,0.7)",
          }}
        >
          <AnimatePresence mode="wait">
            <NodeDetail key={activeId} node={activeNode} />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Contador */}
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.6 }}
        className="text-gray-600 text-xs mt-6 z-10">
        {FORMACION.length} estrellas en la constelación · haz clic para explorar
      </motion.p>
    </section>
  );
};

export default Formacion;