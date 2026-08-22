"use client";

/**
 * ConstellationFrame
 * ────────────────────────────────────────────────────────────────
 * Marco decorativo: estrellas conectadas por líneas trazando el
 * perímetro del modal, con pequeños "clusters" en las esquinas
 * (como constelaciones reales) y un par de líneas diagonales que
 * cruzan el marco para dar sensación de red estelar, no solo un
 * borde recto.
 *
 * Usa un viewBox 0-100 con preserveAspectRatio="none" para que el
 * marco se estire junto con el modal sin recalcular nada en JS —
 * las estrellas titilan y las líneas "fluyen" con stroke-dashoffset,
 * todo vía CSS (GPU, sin costo de render por frame).
 */

import React, { useMemo } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  delay: number;
}

// Puntos a lo largo del perímetro (0-100), con clusters en las esquinas.
const PERIMETER_POINTS: [number, number][] = [
  // esquina superior izquierda (cluster)
  [1, 4], [4, 1], [1, 1.5],
  [22, 0], [42, 0],
  // esquina superior derecha (cluster)
  [99, 1.5], [96, 1], [99, 4],
  [100, 30], [100, 55],
  // esquina inferior derecha (cluster)
  [99, 96], [96, 99], [99, 98.5],
  [78, 100], [58, 100],
  // esquina inferior izquierda (cluster)
  [1, 98.5], [4, 99], [1, 96],
  [0, 70], [0, 45],
];

// Conexiones entre puntos consecutivos del perímetro (índices)
const EDGES: [number, number][] = PERIMETER_POINTS.map((_, i) => [
  i,
  (i + 1) % PERIMETER_POINTS.length,
]);

export default function ConstellationFrame({ className = "" }: { className?: string }) {
  const stars = useMemo<Star[]>(
    () =>
      PERIMETER_POINTS.map(([x, y], i) => ({
        x,
        y,
        r: i % 3 === 0 ? 0.9 : 0.5,
        delay: (i * 0.37) % 4,
      })),
    []
  );

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="constellation-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Líneas del perímetro */}
      <g stroke="url(#constellation-line)" strokeWidth="0.12" strokeLinecap="round">
        {EDGES.map(([a, b], i) => {
          const p1 = PERIMETER_POINTS[a];
          const p2 = PERIMETER_POINTS[b];
          return (
            <line
              key={`e-${i}`}
              x1={p1[0]}
              y1={p1[1]}
              x2={p2[0]}
              y2={p2[1]}
              style={{
                strokeDasharray: 6,
                animation: `constellation-flow 3.5s linear infinite`,
                animationDelay: `${(i * 0.15) % 3.5}s`,
              }}
            />
          );
        })}
      </g>

      {/* Estrellas */}
      <g fill="#f3e8ff">
        {stars.map((s, i) => (
          <circle
            key={`s-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            style={{
              filter: "drop-shadow(0 0 1.2px #c084fc)",
              animation: `constellation-twinkle 2.6s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
              transformOrigin: `${s.x}px ${s.y}px`,
            }}
          />
        ))}
      </g>

      <style>{`
        @keyframes constellation-twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        @keyframes constellation-flow {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
