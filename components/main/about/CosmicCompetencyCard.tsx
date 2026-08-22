"use client";

import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Competencia } from "./aboutData";

const COLOR_MAP = {
  purple: {
    accent: "#a855f7",
    accentRgb: "168, 85, 247",
    accent2: "#22d3ee",
    accent2Rgb: "34, 211, 238",
  },
  red: {
    accent: "#ff315f",
    accentRgb: "255, 49, 95",
    accent2: "#f472b6",
    accent2Rgb: "244, 114, 182",
  },
  cyan: {
    accent: "#22d3ee",
    accentRgb: "34, 211, 238",
    accent2: "#a855f7",
    accent2Rgb: "168, 85, 247",
  },
  green: {
    accent: "#22c55e",
    accentRgb: "34, 197, 94",
    accent2: "#22d3ee",
    accent2Rgb: "34, 211, 238",
  },
  pink: {
    accent: "#e879f9",
    accentRgb: "232, 121, 249",
    accent2: "#22d3ee",
    accent2Rgb: "34, 211, 238",
  },
  orange: {
    accent: "#fb923c",
    accentRgb: "251, 146, 60",
    accent2: "#f43f5e",
    accent2Rgb: "244, 63, 94",
  },
  blue: {
    accent: "#38bdf8",
    accentRgb: "56, 189, 248",
    accent2: "#a855f7",
    accent2Rgb: "168, 85, 247",
  },
  lime: {
    accent: "#4ade80",
    accentRgb: "74, 222, 128",
    accent2: "#22d3ee",
    accent2Rgb: "34, 211, 238",
  },
  magenta: {
    accent: "#ec4899",
    accentRgb: "236, 72, 153",
    accent2: "#a855f7",
    accent2Rgb: "168, 85, 247",
  },
};

interface CosmicCompetencyCardProps {
  competencia: Competencia;
  index: number;
}

export default function CosmicCompetencyCard({
  competencia,
  index,
}: CosmicCompetencyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const colors = COLOR_MAP[competencia.color] || COLOR_MAP.purple;

  // Generar constelación SVG única basada en el índice
  const constellationSvg = useMemo(() => {
    const points: Array<{ x: number; y: number }> = [];
    const numPoints = 8 + (index % 4);
    let s = (index + 1) * 1234 + 7;
    const pseudoRand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };

    for (let i = 0; i < numPoints; i++) {
      points.push({ x: pseudoRand() * 100, y: pseudoRand() * 100 });
    }

    const lines: React.ReactNode[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 32) {
          lines.push(
            <line
              key={`l-${i}-${j}`}
              x1={`${points[i].x}%`}
              y1={`${points[i].y}%`}
              x2={`${points[j].x}%`}
              y2={`${points[j].y}%`}
              stroke={colors.accent}
              strokeWidth="0.4"
              opacity="0.4"
            />
          );
        }
      }
    }

    const circles = points.map((p, i) => (
      <circle
        key={`c-${i}`}
        cx={`${p.x}%`}
        cy={`${p.y}%`}
        r={0.6 + (i % 3) * 0.3}
        fill={colors.accent}
        opacity="0.75"
      />
    ));

    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20 transition-opacity duration-400 group-hover:opacity-45"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines}
        {circles}
      </svg>
    );
  }, [index, colors.accent]);

  // Partículas flotantes ligeras
  const particles = useMemo(() => {
    return Array.from({ length: 4 }).map((_, p) => ({
      left: `${15 + p * 22}%`,
      top: `${20 + (p * 25) % 65}%`,
      size: 2 + (p % 2),
      delay: p * 1.5,
      duration: 6 + p * 1.5,
    }));
  }, []);

  // Manejo de 3D tilt y posición de la luz interactiva
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 5;
    const rotX = -((y - cy) / cy) * 5;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: 0.06 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] p-[2px] transition-all duration-300 transform-gpu min-h-[300px] sm:min-h-[310px] md:min-h-[320px]"
      style={
        {
          "--accent": colors.accent,
          "--accent-rgb": colors.accentRgb,
          "--accent-2": colors.accent2,
          "--accent-2-rgb": colors.accent2Rgb,
        } as React.CSSProperties
      }
    >
      {/* ── Borde Neón Giratorio ── */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from var(--angle, 0deg), transparent 0%, ${colors.accent} 20%, ${colors.accent2} 40%, transparent 60%, ${colors.accent} 80%, transparent 100%)`,
          animation: "rotateBorder 6s linear infinite",
        }}
      />

      {/* ── Glow Exterior Suave ── */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-[22px] blur-lg opacity-25 transition-opacity duration-400 group-hover:opacity-60"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${colors.accentRgb}, 0.5), transparent 70%)`,
        }}
      />

      {/* ── Contenedor Interior ── */}
      <div
        className="relative z-10 flex h-full w-full flex-col justify-between overflow-hidden rounded-[18px] p-5 sm:p-6"
        style={{
          background: `radial-gradient(ellipse at top left, rgba(${colors.accentRgb}, 0.14) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(${colors.accent2Rgb}, 0.08) 0%, transparent 50%), linear-gradient(145deg, rgba(16, 12, 28, 0.94), rgba(7, 5, 15, 0.92))`,
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 15px 40px rgba(0, 0, 0, 0.6)`,
        }}
      >
        {/* Luz que sigue al cursor */}
        <div
          className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            left: "var(--mouse-x, 50%)",
            top: "var(--mouse-y, 50%)",
            background: `radial-gradient(circle, rgba(${colors.accentRgb}, 0.25), transparent 70%)`,
          }}
        />

        {/* Constelación SVG de fondo */}
        {constellationSvg}

        {/* Partículas flotantes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: colors.accent,
                boxShadow: `0 0 6px ${colors.accent}`,
                animation: `floatParticle ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Tech lines */}
        <div
          className="pointer-events-none absolute top-0 left-6 h-[1px] w-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
            boxShadow: `0 0 8px ${colors.accent}`,
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-6 h-[1px] w-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
            boxShadow: `0 0 8px ${colors.accent}`,
          }}
        />

        {/* Estrellas de esquina */}
        <div className="pointer-events-none absolute top-3 left-3 h-2 w-2">
          <div
            className="h-full w-full rounded-full animate-pulse"
            style={{ background: colors.accent, boxShadow: `0 0 4px ${colors.accent}` }}
          />
        </div>
        <div className="pointer-events-none absolute top-3 right-3 h-2 w-2">
          <div
            className="h-full w-full rounded-full animate-pulse"
            style={{ background: colors.accent2, boxShadow: `0 0 4px ${colors.accent2}`, animationDelay: "0.6s" }}
          />
        </div>

        {/* ── Contenido Principal (Texto + Código) ── */}
        <div className="relative z-20 flex flex-col">
          {/* Badge Código */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider"
              style={{
                background: `rgba(${colors.accentRgb}, 0.12)`,
                border: `1px solid rgba(${colors.accentRgb}, 0.45)`,
                color: colors.accent,
                boxShadow: `0 0 12px rgba(${colors.accentRgb}, 0.15)`,
              }}
            >
              {competencia.code}
            </span>

            {/* Tag de categoría */}
            <span
              className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded border border-white/5 bg-white/[0.02]"
              style={{ color: colors.accent2 }}
            >
              {competencia.tag}
            </span>
          </div>

          {/* Título */}
          <h4 className="mt-3 text-[17px] sm:text-[18px] font-bold text-white leading-tight">
            {competencia.title}
          </h4>

          {/* Línea divisoria con degradado */}
          <div
            className="mt-2 h-[2px] w-12 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
              boxShadow: `0 0 8px ${colors.accent}`,
            }}
          />

          {/* Descripción */}
          <p className="mt-2.5 text-[13px] sm:text-[13.5px] text-white leading-relaxed font-normal">
            {competencia.description}
          </p>
        </div>

        {/* ── Objeto Espacial Decorativo (Mini Planeta y Órbita) ── */}
        <div className="relative mt-3 flex items-center justify-between pt-2 border-t border-white/10 z-20">
          {/* Badges de tecnología / símbolos */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {competencia.icons.map((ic, i) => (
              <span
                key={i}
                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border"
                style={{
                  background: `rgba(${colors.accentRgb}, 0.08)`,
                  borderColor: `rgba(${colors.accentRgb}, 0.25)`,
                  color: colors.accent,
                }}
              >
                {ic}
              </span>
            ))}
          </div>

          {/* Mini planeta con órbita */}
          <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
            {/* Órbita */}
            <div
              className="absolute w-11 h-4 rounded-full border border-dashed rotate-[-25deg]"
              style={{
                borderColor: `rgba(${colors.accentRgb}, 0.5)`,
                animation: "orbitRotate 8s linear infinite",
              }}
            />
            {/* Planeta */}
            <div
              className="w-5 h-5 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, #fff 5%, ${colors.accent} 45%, #05050b 90%)`,
                boxShadow: `0 0 10px rgba(${colors.accentRgb}, 0.6)`,
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotateBorder {
          to {
            --angle: 360deg;
          }
        }
        @keyframes orbitRotate {
          from {
            transform: rotate(-25deg);
          }
          to {
            transform: rotate(335deg);
          }
        }
        @keyframes floatParticle {
          0% {
            transform: translateY(20px) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 0.8;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-25px) scale(1);
            opacity: 0;
          }
        }
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </motion.div>
  );
}
