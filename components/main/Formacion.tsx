"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";

const FORMACION = [
  {
    id: "ingenieria",
    year: "2020 – Presente",
    title: "Ingeniería de Sistemas",
    institution: "Universidad Nacional de Colombia",
    description: "Fundamentos de programación, algoritmos, estructuras de datos, bases de datos, redes y arquitectura de software.",
    tags: ["Java", "C++", "SQL", "Redes", "Algoritmos"],
    type: "degree",
    x: 0.18, y: 0.22,   // posición relativa en el canvas de constelaciones
    magnitude: 1.0,       // brillo de la estrella
  },
  {
    id: "webdev",
    year: "2021",
    title: "Web Developer Bootcamp",
    institution: "Udemy — Colt Steele",
    description: "HTML5, CSS3, JavaScript ES6+, Node.js, Express y MongoDB. Base completa del stack web moderno.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
    type: "course",
    x: 0.38, y: 0.55,
    magnitude: 0.8,
  },
  {
    id: "react",
    year: "2021",
    title: "React — The Complete Guide",
    institution: "Udemy — Maximilian",
    description: "React Hooks, Context API, Redux Toolkit, React Router, testing con Jest y patrones de arquitectura.",
    tags: ["React", "Redux", "Hooks", "Testing"],
    type: "course",
    x: 0.62, y: 0.3,
    magnitude: 0.85,
  },
  {
    id: "typescript",
    year: "2022",
    title: "TypeScript Avanzado",
    institution: "Documentación oficial",
    description: "Tipos avanzados, generics, decoradores, utility types y migración de proyectos JS a TS estricto.",
    tags: ["TypeScript", "Generics", "OOP"],
    type: "self",
    x: 0.5, y: 0.68,
    magnitude: 0.75,
  },
  {
    id: "nextjs",
    year: "2023",
    title: "Next.js 13 App Router",
    institution: "Vercel Docs + proyectos",
    description: "App Router, Server Components, Streaming, Data Fetching patterns y deployment en Vercel.",
    tags: ["Next.js 13", "Server Components", "Vercel"],
    type: "self",
    x: 0.78, y: 0.58,
    magnitude: 0.9,
  },
  {
    id: "threejs",
    year: "2023",
    title: "Three.js & React Three Fiber",
    institution: "Three.js Journey",
    description: "Escenas 3D en la web, shaders GLSL, física, animaciones y optimización de rendimiento.",
    tags: ["Three.js", "R3F", "GLSL", "WebGL"],
    type: "course",
    x: 0.28, y: 0.8,
    magnitude: 1.1,
  },
];

// Conexiones entre nodos (índices)
const CONNECTIONS = [
  [0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [2, 3], [4, 5],
];

const TYPE_CONFIG = {
  degree:  { color: "#b49bff", label: "Título"       },
  course:  { color: "#06b6d4", label: "Curso"        },
  self:    { color: "#7042f8", label: "Autodidacta"  },
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

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let raf: number;
    let hoverId: string | null = null;

    const getPos = (node: typeof FORMACION[0]) => ({
      x: node.x * canvas.width,
      y: node.y * canvas.height,
    });

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      hoverId = null;
      for (const node of FORMACION) {
        const p = getPos(node);
        if (Math.hypot(mx - p.x, my - p.y) < 24) {
          hoverId = node.id;
          break;
        }
      }
      canvas.style.cursor = hoverId ? "pointer" : "default";
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (const node of FORMACION) {
        const p = getPos(node);
        if (Math.hypot(mx - p.x, my - p.y) < 24) {
          onSelect(node.id);
          return;
        }
      }
      onSelect("");
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;

      // ── Estrellas de fondo ──────────────────────────────
      // (estáticas, pintadas una vez)
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let i = 0; i < 120; i++) {
        // seed determinista
        const sx = ((i * 137.5) % 1) * W;
        const sy = ((i * 73.1 + 0.3) % 1) * H;
        const sr = 0.5 + ((i * 0.31) % 0.8);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Líneas de constelación ──────────────────────────
      CONNECTIONS.forEach(([a, b]) => {
        const pa = getPos(FORMACION[a]);
        const pb = getPos(FORMACION[b]);
        const isActive =
          activeIdRef.current === FORMACION[a].id ||
          activeIdRef.current === FORMACION[b].id;

        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        const cA = TYPE_CONFIG[FORMACION[a].type as keyof typeof TYPE_CONFIG].color;
        const cB = TYPE_CONFIG[FORMACION[b].type as keyof typeof TYPE_CONFIG].color;
        grad.addColorStop(0, cA + (isActive ? "90" : "28"));
        grad.addColorStop(1, cB + (isActive ? "90" : "28"));

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isActive ? 1.5 : 0.7;
        ctx.stroke();

        // Partícula viajando por la línea
        const frac = (Math.sin(t + a * 0.7 + b * 0.3) * 0.5 + 0.5);
        const px = pa.x + (pb.x - pa.x) * frac;
        const py = pa.y + (pb.y - pa.y) * frac;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = cA + "cc";
        ctx.fill();
      });

      // ── Nodos de estrella ───────────────────────────────
      FORMACION.forEach((node) => {
        const p = getPos(node);
        const cfg = TYPE_CONFIG[node.type as keyof typeof TYPE_CONFIG];
        const isHover  = hoverId === node.id;
        const isActive = activeIdRef.current === node.id;
        const pulse = 1 + Math.sin(t * 1.8 + node.x * 10) * 0.15;
        const baseR = (isActive ? 14 : isHover ? 12 : 8) * node.magnitude * pulse;

        // Halo exterior
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, baseR * 3);
        halo.addColorStop(0, cfg.color + "40");
        halo.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR * 3, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Estrella (cruz de destellos)
        ctx.strokeStyle = cfg.color + (isActive ? "ff" : "88");
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
        grad.addColorStop(0.3, cfg.color);
        grad.addColorStop(1, cfg.color + "00");
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Anillo si activo
        if (isActive) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, baseR + 6 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = cfg.color + "50";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Label encima
        ctx.font = `${isActive ? "bold " : ""}11px 'Inter', sans-serif`;
        ctx.fillStyle = isActive ? "white" : "rgba(200,200,220,0.65)";
        ctx.textAlign = "center";
        ctx.fillText(node.title.length > 20 ? node.title.slice(0, 18) + "…" : node.title, p.x, p.y - baseR - 8);

        ctx.font = "10px monospace";
        ctx.fillStyle = cfg.color + "99";
        ctx.fillText(node.year, p.x, p.y + baseR + 14);
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
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
        style={{ background: cfg.color + "18", color: cfg.color, border: `1px solid ${cfg.color}30` }}>
        {cfg.label}
      </span>

      <div className="text-xs text-gray-600 mb-1 font-mono">{node.year}</div>
      <h3 className="text-xl font-bold text-white mb-1">{node.title}</h3>
      <p className="text-sm mb-4" style={{ color: cfg.color + "99" }}>{node.institution}</p>

      <div className="h-[1px] mb-4" style={{ background: `linear-gradient(90deg, ${cfg.color}50, transparent)` }} />

      <p className="text-gray-400 text-sm leading-relaxed flex-1">{node.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {node.tags.map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-1 rounded-full"
            style={{ border: `1px solid ${cfg.color}28`, color: cfg.color + "90", background: cfg.color + "0a" }}>
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