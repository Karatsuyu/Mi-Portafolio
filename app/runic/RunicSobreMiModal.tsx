"use client";

/**
 * RunicSobreMiModal — Modal "Sobre mí" para el tema Runic
 *
 * Concepto: "El Grimorio del Desarrollador"
 *
 * Layout de 3 zonas:
 *   IZQUIERDA (32%): Panel de identidad — foto/avatar + nombre + título +
 *                    bio + datos de contacto. Fondo glassmorphism con
 *                    anillo orbital SVG animado.
 *
 *   CENTRO    (68%): Constelación de competencias SCC — 9 nodos estelares
 *                    conectados con líneas SVG que viajan partículas.
 *                    Al hacer clic/hover en un nodo, se expande el detalle
 *                    de la competencia en un panel inferior.
 *
 *   FONDO:          Canvas de estrellas con parallax al mover el mouse.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Datos del desarrollador ───────────────────────────────────

const DEV = {
  name: "Julián Estiven Gutiérrez Tabares",
  title: "Tecnólogo en Desarrollo de Software",
  university: "Universidad del Valle",
  email: "julian.estiven.gutierrez@correounivalle.edu.co",
  github: "github.com/Karatsuyu",
  linkedin: "linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382",
  location: "Colombia",
  bio: [
    "Tecnólogo en Desarrollo de Software formado en la Universidad del Valle, apasionado por la tecnología, la innovación y la creación de soluciones digitales que generen impacto.",
    "Mi enfoque principal está en el desarrollo de software de calidad, la experiencia del usuario (UX/UI) y la aplicación de buenas prácticas en todo el ciclo de vida del desarrollo.",
    "Busco siempre ir más allá de lo aprendido, investigando nuevas herramientas, patrones de diseño y tendencias que me permitan ofrecer productos escalables y sostenibles.",
  ],
  values: ["Autodidacta", "Proactivo", "Adaptable", "Detallista"],
};

// ── Competencias SCC ─────────────────────────────────────────

interface SCC {
  code: string;
  title: string;
  definition: string;
  rune: string;
  color: string;
  // Posición en la constelación (porcentaje del área)
  x: number;
  y: number;
  // Nodos con los que se conecta
  connections: string[];
}

// Pentagram star layout:
//   5 outer tips  → E.1(top), E.3(upper-right), E.9(lower-right), E.7(lower-left), E.6(upper-left)
//   4 inner nodes → E.4(inner-upper-right), E.8(inner-right), E.5(inner-left), E.2(inner-upper-left)
// Connections trace the 5 lines of the pentagram star.

const SCC_LIST: SCC[] = [
  {
    code: "SCC.E.1",
    title: "Fundamentos de Computación",
    definition: "Utilizo los conocimientos fundamentales en teoría de la computación en la construcción de sistemas basados en TIC.",
    rune: "ᚠ",
    color: "#a855f7",
    x: 50, y: 8,
    connections: ["SCC.E.2", "SCC.E.4"],
  },
  {
    code: "SCC.E.2",
    title: "Calidad de Software",
    definition: "Evalúo factores de calidad estandarizados durante la valoración de uno o varios productos de software.",
    rune: "ᚢ",
    color: "#06b6d4",
    x: 40, y: 36,
    connections: ["SCC.E.1", "SCC.E.4", "SCC.E.5", "SCC.E.6"],
  },
  {
    code: "SCC.E.3",
    title: "Paradigmas y Lenguajes",
    definition: "Selecciono y utilizo diferentes paradigmas y lenguajes de programación al construir sistemas basados en TIC.",
    rune: "ᚦ",
    color: "#8b5cf6",
    x: 90, y: 37,
    connections: ["SCC.E.4", "SCC.E.8"],
  },
  {
    code: "SCC.E.4",
    title: "Diseño de Interfaces",
    definition: "Aplico conceptos y principios implicados en el proceso de diseño de interfaces gráficas de usuario durante el desarrollo de aplicaciones software.",
    rune: "ᚱ",
    color: "#f59e0b",
    x: 60, y: 36,
    connections: ["SCC.E.1", "SCC.E.2", "SCC.E.3", "SCC.E.8"],
  },
  {
    code: "SCC.E.5",
    title: "Evaluación de Usabilidad",
    definition: "Aplico técnicas de evaluación de usabilidad que permiten medir la calidad de la experiencia que tienen los usuarios al interactuar con el software que desarrollo.",
    rune: "ᚲ",
    color: "#10b981",
    x: 34, y: 55,
    connections: ["SCC.E.2", "SCC.E.6", "SCC.E.7", "SCC.E.9"],
  },
  {
    code: "SCC.E.6",
    title: "Infraestructura de TIC",
    definition: "Implemento proyectos de infraestructura de TIC comprendiendo las características propias de las tecnologías de transporte de datos.",
    rune: "ᚷ",
    color: "#ef4444",
    x: 10, y: 37,
    connections: ["SCC.E.2", "SCC.E.5"],
  },
  {
    code: "SCC.E.7",
    title: "Servicios de Infraestructura",
    definition: "Diseño y despliego soluciones de servicios de infraestructura tecnológica orientadas a resolver requerimientos de clientes.",
    rune: "ᚹ",
    color: "#f97316",
    x: 25, y: 84,
    connections: ["SCC.E.5", "SCC.E.8"],
  },
  {
    code: "SCC.E.8",
    title: "Resolución de Problemas",
    definition: "Resuelvo problemas desde el nivel tecnológico identificando diferentes alternativas de solución y desarrollando sistemas basados en TIC.",
    rune: "ᚺ",
    color: "#3b82f6",
    x: 66, y: 55,
    connections: ["SCC.E.3", "SCC.E.4", "SCC.E.7", "SCC.E.9"],
  },
  {
    code: "SCC.E.9",
    title: "Desarrollo Integral de Proyectos",
    definition: "Desarrollo proyectos analizando, modelando, diseñando, evaluando, gestionando, documentando, desplegando e implementando sistemas basados en TIC.",
    rune: "ᚾ",
    color: "#ec4899",
    x: 75, y: 84,
    connections: ["SCC.E.5", "SCC.E.8"],
  },
];

// ── Canvas de estrellas con parallax ─────────────────────────

function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = canvas.offsetWidth || 900;
    let H = canvas.offsetHeight || 600;
    canvas.width = W;
    canvas.height = H;

    // Capas de estrellas con parallax
    const layers = [0.006, 0.015, 0.028].map((speed, li) => ({
      speed,
      stars: Array.from({ length: [100, 55, 25][li] }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: [0.5, 0.9, 1.4][li] + Math.random() * 0.4,
        b: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.5,
      })),
    }));

    let t = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - r.left) / W - 0.5,
        y: (e.clientY - r.top) / H - 0.5,
      };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      // Nebulosa de fondo
      const grad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.55);
      grad.addColorStop(0, "hsla(280,100%,50%,0.06)");
      grad.addColorStop(0.5, "hsla(280,100%,40%,0.03)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      layers.forEach(layer => {
        const ox = mouse.current.x * layer.speed * W;
        const oy = mouse.current.y * layer.speed * H;
        layer.stars.forEach(star => {
          const twinkle = Math.sin(t * star.speed + star.phase) * 0.3 + 0.7;
          const alpha = star.b * twinkle;
          let sx = (star.x + ox) % W;
          let sy = (star.y + oy) % H;
          if (sx < 0) sx += W;
          if (sy < 0) sy += H;

          ctx.beginPath();
          ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,200,255,${alpha})`;
          ctx.fill();

          // Destellos en estrellas grandes
          if (star.r > 1.2 && twinkle > 0.9) {
            ctx.strokeStyle = `rgba(220,200,255,${alpha * 0.4})`;
            ctx.lineWidth = 0.4;
            const len = star.r * 2.5;
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
      W = canvas.offsetWidth || 900;
      H = canvas.offsetHeight || 600;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ── Anillo orbital del panel bio ─────────────────────────────

function BioOrbitalRing() {
  return (
    <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.35 }}>
      <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(280,100%,55%)" strokeWidth="0.6" strokeDasharray="8 5"
        style={{ transformOrigin: "100px 100px", animation: "runicRingOuter 30s linear infinite" }} />
      <circle cx="100" cy="100" r="75" fill="none" stroke="hsl(280,100%,65%)" strokeWidth="0.4" strokeDasharray="3 8"
        style={{ transformOrigin: "100px 100px", animation: "runicRingOuter 18s linear infinite reverse" }} />
      {/* Puntos cardinales */}
      {[[100,10],[190,100],[100,190],[10,100]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="hsl(280,100%,65%)" fillOpacity="0.7" />
      ))}
    </svg>
  );
}

// ── Constelación SCC interactiva ─────────────────────────────

function ConstellationSCC({
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  selected: string | null;
  hovered: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 340 });

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setDims({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const pos = useCallback((scc: SCC) => ({
    x: (scc.x / 100) * dims.w,
    y: (scc.y / 100) * dims.h,
  }), [dims]);

  // Deduplicate connections
  const drawnLines = new Set<string>();
  const lines: { from: SCC; to: SCC }[] = [];
  SCC_LIST.forEach(scc => {
    scc.connections.forEach(targetCode => {
      const target = SCC_LIST.find(s => s.code === targetCode);
      if (!target) return;
      const key = [scc.code, target.code].sort().join("-");
      if (drawnLines.has(key)) return;
      drawnLines.add(key);
      lines.push({ from: scc, to: target });
    });
  });

  return (
    <svg
      ref={svgRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        {SCC_LIST.map(scc => (
          <filter key={scc.code} id={`node-glow-${scc.code.replace(".", "")}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
      </defs>

      {/* Líneas de constelación */}
      {lines.map(({ from, to }) => {
        const f = pos(from);
        const t = pos(to);
        const isActive = selected === from.code || selected === to.code ||
                         hovered === from.code || hovered === to.code;
        const activeColor = selected === from.code || hovered === from.code ? from.color : to.color;
        return (
          <g key={`${from.code}-${to.code}`}>
            {/* Línea base */}
            <line
              x1={f.x} y1={f.y} x2={t.x} y2={t.y}
              stroke={isActive ? activeColor : "rgba(200,180,240,0.15)"}
              strokeWidth={isActive ? 1.2 : 0.6}
              strokeOpacity={isActive ? 0.8 : 1}
            />
            {/* Partícula viajando (solo líneas activas) */}
            {isActive && (
              <circle r="2" fill={activeColor} fillOpacity="0.9">
                <animateMotion dur="2.5s" repeatCount="indefinite"
                  path={`M${f.x},${f.y} L${t.x},${t.y}`} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Nodos estelares */}
      {SCC_LIST.map(scc => {
        const { x, y } = pos(scc);
        const isSelected = selected === scc.code;
        const isHovered  = hovered === scc.code;
        const isActive   = isSelected || isHovered;
        const r = isSelected ? 22 : isHovered ? 19 : 15;

        return (
          <g key={scc.code}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(scc.code)}
            onMouseEnter={() => onHover(scc.code)}
            onMouseLeave={() => onHover(null)}
          >
            {/* Halo exterior */}
            <circle cx={x} cy={y} r={r + 8} fill={scc.color}
              fillOpacity={isActive ? 0.12 : 0.04}
              style={{ transition: "all 0.3s" }} />

            {/* Anillo */}
            <circle cx={x} cy={y} r={r + 3} fill="none"
              stroke={scc.color}
              strokeWidth={isActive ? 1.2 : 0.5}
              strokeOpacity={isActive ? 0.7 : 0.25}
              strokeDasharray={isActive ? "none" : "4 3"}
              style={{ transition: "all 0.3s" }}
            />

            {/* Cuerpo del nodo */}
            <circle cx={x} cy={y} r={r} fill={scc.color}
              fillOpacity={isActive ? 0.25 : 0.1}
              stroke={scc.color}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeOpacity={isActive ? 0.9 : 0.4}
              filter={isActive ? `url(#node-glow-${scc.code.replace(".", "")})` : undefined}
              style={{ transition: "all 0.3s" }}
            />

            {/* Runa */}
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Noto Sans Runic', serif"
              fontSize={isActive ? 14 : 11}
              fill={scc.color}
              fillOpacity={isActive ? 1 : 0.7}
              style={{ transition: "all 0.3s", userSelect: "none",
                filter: isActive ? `drop-shadow(0 0 4px ${scc.color})` : "none" }}
            >
              {scc.rune}
            </text>

            {/* Código debajo del nodo */}
            <text x={x} y={y + r + 10} textAnchor="middle"
              fontFamily="monospace" fontSize="8"
              fill={scc.color} fillOpacity={isActive ? 0.9 : 0.45}
              style={{ transition: "all 0.3s", userSelect: "none" }}
            >
              {scc.code.replace("SCC.", "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Panel de competencia seleccionada ────────────────────────

function SCCDetailPanel({ scc, onClose }: { scc: SCC; onClose: () => void }) {
  return (
    <motion.div
      key={scc.code}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        flexShrink: 0,
        padding: "0.9rem 1.1rem",
        background: `linear-gradient(135deg, ${scc.color}12 0%, rgba(11,8,21,0.95) 60%)`,
        border: `1px solid ${scc.color}35`,
        borderTop: `2px solid ${scc.color}70`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Glow top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${scc.color}, transparent)`,
        boxShadow: `0 0 12px ${scc.color}`,
      }} />

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Cerrar detalle"
        style={{
          position: "absolute",
          top: 6, right: 8,
          width: 20, height: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${scc.color}18`,
          border: `1px solid ${scc.color}40`,
          borderRadius: 4,
          color: scc.color,
          fontSize: "0.6rem",
          cursor: "pointer",
          lineHeight: 1,
          padding: 0,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${scc.color}40`;
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "scale(1.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${scc.color}18`;
          e.currentTarget.style.color = scc.color;
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        ✕
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", paddingRight: "1.2rem" }}>
        {/* Runa grande */}
        <div style={{
          flexShrink: 0,
          width: 44, height: 44, borderRadius: "50%",
          border: `1.5px solid ${scc.color}60`,
          background: `${scc.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 16px ${scc.color}40`,
        }}>
          <span style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "1.4rem", color: scc.color }}>
            {scc.rune}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <span style={{
              fontFamily: "monospace", fontWeight: 700, fontSize: "0.65rem",
              color: scc.color, letterSpacing: "0.1em",
            }}>
              {scc.code}
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${scc.color}50, transparent)` }} />
          </div>
          <h4 style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700, margin: "0 0 0.3rem", lineHeight: 1.3 }}>
            {scc.title}
          </h4>
          <p style={{ color: "rgba(220,200,255,0.62)", fontSize: "0.72rem", lineHeight: 1.65, margin: 0 }}>
            {scc.definition}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Panel de bio ─────────────────────────────────────────────

function BioPanel() {
  return (
    <div style={{
      position: "relative",
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      padding: "1.5rem 1.25rem",
      overflow: "hidden",
    }}>
      {/* Anillo orbital decorativo */}
      <BioOrbitalRing />

      {/* Avatar / Runa central */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "linear-gradient(135deg, hsl(280,100%,40%), hsl(300,80%,30%))",
        border: "2px solid hsl(280,100%,55%)",
        boxShadow: "0 0 30px hsla(280,100%,50%,0.5), inset 0 0 20px hsla(280,100%,50%,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2, marginBottom: "1rem",
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "2rem", color: "hsl(280,100%,80%)" }}>
          ᚷ
        </span>
      </div>

      {/* Nombre */}
      <h2 style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(0.85rem, 2vw, 1rem)",
        color: "#fff",
        textAlign: "center",
        margin: "0 0 0.2rem",
        lineHeight: 1.2,
        position: "relative", zIndex: 2,
      }}>
        {DEV.name}
      </h2>

      <p style={{
        fontFamily: "monospace",
        fontSize: "0.62rem",
        color: "hsl(280,100%,65%)",
        textAlign: "center",
        margin: "0 0 0.15rem",
        letterSpacing: "0.06em",
        position: "relative", zIndex: 2,
      }}>
        {DEV.title}
      </p>

      <p style={{
        fontSize: "0.6rem",
        color: "rgba(200,180,240,0.45)",
        fontFamily: "monospace",
        textAlign: "center",
        margin: "0 0 0.9rem",
        position: "relative", zIndex: 2,
      }}>
        {DEV.university}
      </p>

      {/* Divisor rúnico */}
      <div style={{
        width: "70%", height: 1,
        background: "linear-gradient(90deg, transparent, hsl(280,100%,55%,0.6), transparent)",
        boxShadow: "0 0 8px hsl(280,100%,50%,0.3)",
        marginBottom: "0.85rem",
        position: "relative", zIndex: 2,
      }} />

      {/* Bio */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        scrollbarWidth: "none",
        position: "relative", zIndex: 2,
        textAlign: "left",
      }}>
        {DEV.bio.map((para, i) => (
          <p key={i} style={{
            fontSize: "0.7rem",
            color: "rgba(220,200,255,0.62)",
            lineHeight: 1.7,
            margin: "0 0 0.6rem",
          }}>
            {para}
          </p>
        ))}

        {/* Valores */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.65rem" }}>
          {DEV.values.map(v => (
            <span key={v} style={{
              fontSize: "0.58rem",
              padding: "0.15rem 0.55rem",
              border: "1px solid hsl(280,100%,55%,0.3)",
              color: "hsl(280,100%,65%)",
              background: "hsl(280,100%,50%,0.08)",
              borderRadius: 20,
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}>
              ✦ {v}
            </span>
          ))}
        </div>

        {/* Contacto */}
        <div style={{ marginTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {[
            { icon: "✉", label: DEV.email },
            { icon: "⌥", label: DEV.github },
            { icon: "◈", label: DEV.location },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              fontSize: "0.6rem", color: "rgba(200,180,240,0.45)",
              fontFamily: "monospace",
            }}>
              <span style={{ color: "hsl(280,100%,60%)", fontSize: "0.7rem", flexShrink: 0 }}>{icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MODAL PRINCIPAL ───────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function RunicSobreMiModal({ onClose }: Props) {
  const [selectedSCC, setSelectedSCC] = useState<string | null>(null);
  const [hoveredSCC,  setHoveredSCC]  = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // El panel de detalle solo se abre al hacer clic
  const activeDetailSCC = SCC_LIST.find(s => s.code === selectedSCC) ?? null;
  // La barra de estado y los highlights reaccionan tanto al clic como al hover
  const activeStatusSCC = SCC_LIST.find(s => s.code === (selectedSCC || hoveredSCC)) ?? null;

  const handleSelect = useCallback((code: string) => {
    setSelectedSCC(prev => prev === code ? null : code);
  }, []);

  // ESC para cerrar
  useEffect(() => {
    const fn = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Estilos locales */}
      <style>{`
        @keyframes runicRingOuter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .rsm-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .runic-modal-body-container {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
          .runic-bio-panel-wrapper {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(148,0,255,0.15) !important;
            min-height: 300px;
          }
          .runic-constellation-wrapper {
            min-height: 380px;
          }
        }
      `}</style>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
        }}
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div style={{
          pointerEvents: "auto",
          position: "relative",
          width: "100%",
          maxWidth: 960,
          maxHeight: "92vh",
          background: "rgba(8,5,20,0.97)",
          border: "1px solid rgba(148,0,255,0.35)",
          borderRadius: 18,
          boxShadow: "0 0 100px hsla(280,100%,50%,0.2), 0 0 200px hsla(280,100%,50%,0.07), 0 40px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>

          {/* ── Starfield de fondo ── */}
          <StarfieldCanvas />

          {/* ── Línea superior de glow ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 10,
            background: "linear-gradient(90deg, transparent, hsl(280,100%,55%), hsl(300,70%,60%), hsl(280,100%,55%), transparent)",
            boxShadow: "0 0 20px hsl(280,100%,50%)",
          }} />

          {/* ── Runas flotantes decorativas ── */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden" }}>
            {["ᚠ","ᚢ","ᚦ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ"].map((r, i) => (
              <span key={i} style={{
                position: "absolute",
                fontFamily: "'Noto Sans Runic', serif",
                fontSize: `${0.8 + (i % 3) * 0.4}rem`,
                color: "rgba(148,0,255,0.07)",
                left: `${7 + (i * 12.5) % 85}%`,
                top: `${8 + (i * 11.3) % 82}%`,
                animation: `runicRingOuter ${20 + i * 3}s linear ${i * 0.7}s infinite`,
                transformOrigin: "center",
              }}>
                {r}
              </span>
            ))}
          </div>

          {/* ── HEADER ── */}
          <div style={{
            position: "relative", zIndex: 5, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.8rem 1.2rem",
            borderBottom: "1px solid rgba(148,0,255,0.15)",
            background: "rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "1.1rem", color: "hsl(280,100%,60%)" }}>ᚷ</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(200,180,240,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Grimorio del Desarrollador
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(200,180,240,0.25)" }}>
                {activeStatusSCC ? activeStatusSCC.code : "haz clic en un nodo · ESC para cerrar"}
              </span>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                style={{
                  width: 28, height: 28, border: "1px solid rgba(148,0,255,0.3)",
                  background: "transparent", color: "rgba(200,180,240,0.4)",
                  borderRadius: 6, cursor: "pointer", fontSize: "0.8rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "hsl(280,100%,55%)";
                  e.currentTarget.style.background = "rgba(148,0,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(200,180,240,0.4)";
                  e.currentTarget.style.borderColor = "rgba(148,0,255,0.3)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── CUERPO: dos paneles ── */}
          <div
            className="runic-modal-body-container"
            style={{
              position: "relative", zIndex: 5,
              flex: 1, display: "flex", minHeight: 0,
              overflow: "hidden",
            }}
          >

            {/* ── Panel izquierdo: Bio ── */}
            <div
              className="runic-bio-panel-wrapper"
              style={{
                width: "32%", flexShrink: 0,
                borderRight: "1px solid rgba(148,0,255,0.15)",
                background: "rgba(0,0,0,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <BioPanel />
            </div>

            {/* ── Panel derecho: Constelación SCC ── */}
            <div
              className="runic-constellation-wrapper"
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden",
              }}
            >

              {/* Cabecera de la constelación */}
              <div style={{
                padding: "0.75rem 1.1rem 0.5rem",
                borderBottom: "1px solid rgba(148,0,255,0.1)",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 3, height: 12, background: "hsl(280,100%,55%)", boxShadow: "0 0 6px hsl(280,100%,50%)", borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#fff", letterSpacing: "0.06em" }}>
                    Competencias Profesionales
                  </span>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(148,0,255,0.4), transparent)" }} />
                  <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(200,180,240,0.3)" }}>
                    9 / 9 — SCC.E.1 → SCC.E.9
                  </span>
                </div>
                <p style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(200,180,240,0.3)", margin: "0.3rem 0 0", letterSpacing: "0.04em" }}>
                  Haz clic en un nodo estelar para ver la definición de la competencia
                </p>
              </div>

              {/* Área de la constelación */}
              <div style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                minHeight: 0,
              }}>
                <ConstellationSCC
                  selected={selectedSCC}
                  hovered={hoveredSCC}
                  onSelect={handleSelect}
                  onHover={setHoveredSCC}
                />

                {/* Hint cuando no hay selección */}
                <AnimatePresence>
                  {!activeDetailSCC && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{
                        position: "absolute", bottom: "1rem", left: 0, right: 0,
                        textAlign: "center",
                        fontFamily: "monospace", fontSize: "0.6rem",
                        color: "rgba(200,180,240,0.2)",
                        pointerEvents: "none",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ᚠ ᚢ ᚦ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ — 9 sellos de competencia
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Panel de detalle de competencia seleccionada */}
              <AnimatePresence>
                {activeDetailSCC && (
                  <SCCDetailPanel scc={activeDetailSCC} onClose={() => setSelectedSCC(null)} />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Status bar ── */}
          <div style={{
            position: "relative", zIndex: 5, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.32rem 1.1rem",
            borderTop: "1px solid rgba(148,0,255,0.1)",
            background: "rgba(0,0,0,0.35)",
            fontFamily: "monospace", fontSize: "0.57rem",
          }}>
            <span style={{ color: "rgba(148,0,255,0.5)" }}>
              ᚷ {DEV.name}
            </span>
            <span style={{ color: "rgba(200,180,240,0.2)" }}>
              {activeStatusSCC
                ? `${activeStatusSCC.code} — ${activeStatusSCC.title}`
                : `${DEV.university} · ${DEV.title}`}
            </span>
            <span style={{ color: "rgba(148,0,255,0.35)" }}>
              9 competencias SCC · ESC para cerrar
            </span>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}
