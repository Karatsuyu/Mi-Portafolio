"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS_TIMELINE } from "@/constants/projects";

// ═══════════════════════════════════════════════════════════════
//  TIPOS
// ═══════════════════════════════════════════════════════════════
export type ExperienciaItem = {
  id: number;
  num: string;
  year: string;
  title: string;
  role: string;
  entity: string;
  period: string;
  type: "job" | "freelance" | "academic" | "volunteer" | "opensource";
  description: string;
  bullets: string[];
  stack: string[];
  result?: string;
  githubUrl?: string;
  liveUrl?: string;
  grade?: string;
  accentColor: string;
  pixelIcon: string;
};

const TYPE_META = {
  job:        { label: "PRÁCTICA",    glyph: "▸JOB",   dim: "#ff2d6b" },
  freelance:  { label: "FREELANCE",   glyph: "▸FRL",   dim: "#00ff88" },
  academic:   { label: "ACADÉMICO",   glyph: "▸ACK",   dim: "#a855f7" },
  volunteer:  { label: "VOLUNTARIO",  glyph: "▸VOL",   dim: "#f0e040" },
  opensource: { label: "OPEN SOURCE", glyph: "▸OSS",   dim: "#06b6d4" },
} as const;

// Mapear proyectos de constants a ExperienciaItem
const EXPERIENCIAS: ExperienciaItem[] = PROJECTS_TIMELINE.map((p, idx) => ({
  id: p.id,
  num: p.num,
  year: p.year,
  title: p.title,
  role: p.role,
  entity: "Proyecto Académico",
  period: `${p.month} ${p.year}`,
  type: idx < 2 ? "academic" : idx < 4 ? "freelance" : "academic",
  description: p.description,
  bullets: [
    p.challenge,
    `Stack: ${p.techStack.slice(0, 3).join(", ")}`,
    `Duración: ${p.duration || "2-3 meses"}`,
  ],
  stack: p.techStack,
  result: p.challenge,
  githubUrl: p.repoUrl,
  liveUrl: p.liveUrl,
  accentColor: p.hexColor,
  pixelIcon: ["₿", "◉", "◈", "▣", "⊕", "⬡", "◆", "✦"][idx % 8],
}));

// ═══════════════════════════════════════════════════════════════
//  ASCII PANEL DE FONDO
// ═══════════════════════════════════════════════════════════════
function AsciiPanel({ color, active }: { color: string; active: boolean }) {
  const rows = useMemo(() => [
    `┌─────────────────────────┐`,
    `│ ░░░░░░░░░░░░░░░░░░░░░░░ │`,
    `│ ░  ┌──────────────┐  ░ │`,
    `│ ░  │ ${active ? "████████████" : "░░░░░░░░░░░░"} │  ░ │`,
    `│ ░  │ ${active ? "██████████░░" : "░░░░░░░░░░░░"} │  ░ │`,
    `│ ░  │ ${active ? "████░░░░░░░░" : "░░░░░░░░░░░░"} │  ░ │`,
    `│ ░  └──────────────┘  ░ │`,
    `│ ░░░░░░░░░░░░░░░░░░░░░░░ │`,
    `│  [${active ? "SYS:ACTIVE " : "SYS:STANDBY"}]  [ OK ] │`,
    `└─────────────────────────┘`,
  ], [active]);

  return (
    <pre
      className="text-[7px] leading-[1.4] select-none pointer-events-none transition-all duration-500"
      style={{
        color: active ? color + "70" : color + "18",
        fontFamily: "'Courier New', monospace",
        textShadow: active ? `0 0 6px ${color}40` : "none",
      }}
    >
      {rows.join("\n")}
    </pre>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PIXEL NUM ICON
// ═══════════════════════════════════════════════════════════════
function PixelNumIcon({ num, color, active }: { num: string; color: string; active: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 56,
        height: 56,
        border: `1px solid ${active ? color + "80" : color + "20"}`,
        background: active ? color + "10" : "transparent",
        transition: "all 0.3s",
        boxShadow: active ? `0 0 16px ${color}40, inset 0 0 16px ${color}08` : "none",
      }}
    >
      <div className="absolute inset-0 grid grid-cols-4 gap-[2px] p-[6px] pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1px] transition-all duration-300"
            style={{
              background: active && i % 3 !== 0 ? color + "60" : color + "12",
              aspectRatio: "1",
            }}
          />
        ))}
      </div>
      <span
        className="relative z-10 font-mono font-bold text-lg tracking-tight"
        style={{
          color: active ? color : color + "50",
          textShadow: active ? `0 0 8px ${color}` : "none",
        }}
      >
        {num}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TARJETA DE EXPERIENCIA
// ═══════════════════════════════════════════════════════════════
function ExperienciaCard({
  item,
  isActive,
  onClick,
}: {
  item: ExperienciaItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const meta = TYPE_META[item.type];

  return (
    <motion.div
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{ width: 300 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="mb-1 flex justify-end pr-1">
        <AsciiPanel color={item.accentColor} active={isActive} />
      </div>

      <div
        className="relative overflow-hidden transition-all duration-400"
        style={{
          border: `1px solid ${isActive ? item.accentColor + "70" : item.accentColor + "18"}`,
          background: isActive
            ? `linear-gradient(135deg, ${item.accentColor}0e 0%, rgba(3,0,20,0.95) 60%)`
            : "rgba(8,4,28,0.85)",
          boxShadow: isActive
            ? `0 0 40px ${item.accentColor}22, 0 0 80px ${item.accentColor}0a, inset 0 0 30px ${item.accentColor}06`
            : "none",
          backdropFilter: "blur(16px)",
          clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
        }}
      >
        <div
          className="absolute top-0 right-0 w-0 h-0 pointer-events-none"
          style={{
            borderStyle: "solid",
            borderWidth: "0 15px 15px 0",
            borderColor: `transparent ${isActive ? item.accentColor + "80" : item.accentColor + "20"} transparent transparent`,
          }}
        />

        {isActive && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${item.accentColor}80, transparent)`,
            }}
          />
        )}

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <PixelNumIcon num={item.num} color={item.accentColor} active={isActive} />
            <div className="flex flex-col items-end gap-1">
              <span
                className="text-[9px] font-mono tracking-[0.2em] px-2 py-[2px]"
                style={{
                  color: meta.dim,
                  border: `1px solid ${meta.dim}30`,
                  background: `${meta.dim}10`,
                }}
              >
                {meta.glyph}
              </span>
              <span className="text-[10px] font-mono text-gray-600">{item.year}</span>
            </div>
          </div>
          <motion.div
            className="h-[1px] mb-4"
            style={{
              background: `linear-gradient(90deg, ${item.accentColor}${isActive ? "80" : "20"}, transparent)`,
            }}
            animate={{ width: isActive ? "100%" : "40%" }}
            transition={{ duration: 0.4 }}
          />

          <h3
            className="font-bold text-base leading-tight mb-1 transition-colors duration-300"
            style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}
          >
            {item.title}
          </h3>
          <p
            className="text-xs mb-1 font-mono transition-colors duration-300"
            style={{ color: item.accentColor + (isActive ? "cc" : "60") }}
          >
            {item.role}
          </p>
          <p className="text-[11px] text-gray-600 mb-3">{item.entity}</p>

          <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-[5px] mb-4">
            {item.stack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-[2px] font-mono"
                style={{
                  border: `1px solid ${item.accentColor}28`,
                  color: item.accentColor + "90",
                  background: item.accentColor + "08",
                }}
              >
                {t}
              </span>
            ))}
            {item.stack.length > 3 && (
              <span
                className="text-[10px] px-2 py-[2px] font-mono"
                style={{ color: "rgba(200,200,220,0.3)", border: "1px solid rgba(200,200,220,0.1)" }}
              >
                +{item.stack.length - 3}
              </span>
            )}
          </div>
          {item.result && (
            <div
              className="text-[10px] font-mono px-2 py-1 rounded"
              style={{
                background: item.accentColor + "0d",
                borderLeft: `2px solid ${item.accentColor}60`,
                color: item.accentColor + "99",
              }}
            >
              ✦ {item.result}
            </div>
          )}

          {(item.githubUrl || item.liveUrl) && (
            <div className="flex gap-2 mt-3">
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] px-3 py-1 font-mono transition-all"
                  style={{
                    border: `1px solid ${item.accentColor}35`,
                    color: item.accentColor + "90",
                    background: item.accentColor + "0a",
                  }}
                >
                  ⌥ GitHub
                </a>
              )}
              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] px-3 py-1 font-mono transition-all"
                  style={{
                    background: item.accentColor + "20",
                    color: item.accentColor,
                    border: `1px solid ${item.accentColor}50`,
                  }}
                >
                  ↗ Live
                </a>
              )}
            </div>
          )}
        </div>

        <div
          className="absolute bottom-3 right-4 text-5xl pointer-events-none select-none font-mono"
          style={{
            color: item.accentColor + (isActive ? "12" : "06"),
            transform: "rotate(-12deg)",
          }}
        >
          {item.pixelIcon}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PANEL DE DETALLE EXPANDIDO
// ═══════════════════════════════════════════════════════════════
function DetailPanel({ item, onClose }: { item: ExperienciaItem; onClose: () => void }) {
  const meta = TYPE_META[item.type];
  const borderTop = `╔${"═".repeat(50)}╗`;
  const borderBottom = `╚${"═".repeat(50)}╝`;
  const borderMid = `╠${"═".repeat(50)}╣`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full mt-6 overflow-hidden"
      style={{
        border: `1px solid ${item.accentColor}40`,
        background: `linear-gradient(135deg, ${item.accentColor}08 0%, rgba(3,0,20,0.98) 50%)`,
        boxShadow: `0 0 60px ${item.accentColor}15, 0 0 120px ${item.accentColor}06`,
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      <div
        className="h-[1px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accentColor}, ${item.accentColor}, transparent)`,
        }}
      />

      <div className="px-6 pt-4 pb-0">
        <pre
          className="text-[8px] leading-[1.3] select-none"
          style={{ color: item.accentColor + "35", fontFamily: "monospace" }}
        >
          {`${borderTop}\n║  PROJECT_ID: ${item.num}  ·  TYPE: ${meta.glyph.slice(1)}  ·  YEAR: ${item.year}  ·  STATUS: COMPLETED${" ".repeat(3)}║\n${borderMid}`}
        </pre>
      </div>
      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-5">
            <PixelNumIcon num={item.num} color={item.accentColor} active />
            <div>
              <span
                className="text-[9px] font-mono tracking-[0.2em] px-2 py-[2px] mb-2 inline-block"
                style={{ color: meta.dim, border: `1px solid ${meta.dim}30`, background: `${meta.dim}10` }}
              >
                {meta.label}
              </span>
              <h2 className="text-2xl font-bold text-white mb-1">{item.title}</h2>
              <p className="font-mono text-sm" style={{ color: item.accentColor + "cc" }}>
                {item.role}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.entity} · {item.period}</p>
            </div>
          </div>

          <div
            className="h-[1px] mb-5"
            style={{ background: `linear-gradient(90deg, ${item.accentColor}50, transparent)` }}
          />

          <p className="text-gray-300 text-sm leading-relaxed mb-5">{item.description}</p>

          <ul className="flex flex-col gap-2 mb-5">
            {item.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="flex items-start gap-3 text-sm text-gray-400"
              >
                <span className="mt-[2px] flex-shrink-0 font-mono text-xs" style={{ color: item.accentColor }}>
                  ▸
                </span>
                {b}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {item.stack.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 font-mono"
                style={{
                  border: `1px solid ${item.accentColor}30`,
                  color: item.accentColor + "bb",
                  background: item.accentColor + "0e",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {item.result && (
            <div className="p-4" style={{ border: `1px solid ${item.accentColor}25`, background: item.accentColor + "0a" }}>
              <div className="text-[10px] font-mono tracking-widest mb-2" style={{ color: item.accentColor + "60" }}>
                {/* RESULTADO */}
              </div>
              <p className="text-sm text-white leading-relaxed">{item.result}</p>
            </div>
          )}

          {item.grade && (
            <div className="flex items-center justify-center py-4" style={{ border: `1px solid ${item.accentColor}20` }}>
              <div className="text-center">
                <div
                  className="text-4xl font-bold font-mono"
                  style={{ color: item.accentColor, textShadow: `0 0 20px ${item.accentColor}` }}
                >
                  {item.grade}
                </div>
                <div className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">Calificación</div>
              </div>
            </div>
          )}

          <pre className="text-[7px] leading-[1.35] select-none" style={{ color: item.accentColor + "30", fontFamily: "monospace" }}>
            {`  ┌────────────────┐
│  ${item.pixelIcon}  SYS:ONLINE  │
│  ▓▓▓▓▓▓▓▓▓░░░  │
│  CPU: 87%       │
│  MEM: 2.1 GB    │
│  ┌──────────┐   │
│  │ ${item.num} BUILD │   │
│  │  ✓ PASS  │   │
│  └──────────┘   │
└────────────────┘`}
          </pre>

          <div className="flex flex-col gap-2">
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 font-mono text-sm transition-all"
                style={{
                  border: `1px solid ${item.accentColor}35`,
                  color: item.accentColor + "cc",
                  background: item.accentColor + "0a",
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
                className="flex items-center justify-center gap-2 py-2 font-mono text-sm transition-all"
                style={{
                  background: `linear-gradient(90deg, ${item.accentColor}25, ${item.accentColor}10)`,
                  border: `1px solid ${item.accentColor}50`,
                  color: item.accentColor,
                }}
              >
                ↗ Ver demo live
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <pre className="text-[8px] leading-[1.3] select-none" style={{ color: item.accentColor + "25", fontFamily: "monospace" }}>
          {borderBottom}
        </pre>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-5 font-mono text-xs transition-colors"
        style={{ color: "rgba(200,200,220,0.3)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = item.accentColor)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(200,200,220,0.3)")}
      >
        ✕ ESC
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HORIZONTAL TIMELINE
// ═══════════════════════════════════════════════════════════════
function HorizontalTimeline({
  items,
  activeId,
  onSelect,
}: {
  items: ExperienciaItem[];
  activeId: number | null;
  onSelect: (id: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
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

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  useEffect(() => {
    if (!activeId) return;
    const idx = items.findIndex((i) => i.id === activeId);
    if (idx < 0) return;
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - 40, behavior: "smooth" });
    }
  }, [activeId, items]);

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {canLeft && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 font-mono text-sm transition-all"
            style={{
              background: "rgba(3,0,20,0.9)",
              border: "1px solid rgba(112,66,248,0.35)",
              color: "#b49bff",
              boxShadow: "4px 0 20px rgba(3,0,20,0.8)",
            }}
          >
            ‹
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canRight && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 font-mono text-sm transition-all"
            style={{
              background: "rgba(3,0,20,0.9)",
              border: "1px solid rgba(112,66,248,0.35)",
              color: "#b49bff",
              boxShadow: "-4px 0 20px rgba(3,0,20,0.8)",
            }}
          >
            ›
          </motion.button>
        )}
      </AnimatePresence>

      <div
        className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, rgba(3,0,20,1) 0%, transparent 100%)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, rgba(3,0,20,1) 0%, transparent 100%)" }}
      />

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scrollbar-hidden px-12 pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.5, ease: "easeOut" }}
            style={{ scrollSnapAlign: "start" }}
          >
            <ExperienciaCard item={item} isActive={activeId === item.id} onClick={() => onSelect(item.id)} />
          </motion.div>
        ))}
      </div>
      <div className="relative mx-12 mt-2 h-6">
        <div className="absolute top-3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {["2023", "2024"].map((y) => {
          const firstOfYear = items.findIndex((it) => it.year === y);
          if (firstOfYear < 0) return null;
          const pct = (firstOfYear / (items.length - 1)) * 100;
          return (
            <div key={y} className="absolute top-0 flex flex-col items-center" style={{ left: `${pct}%`, transform: "translateX(-50%)" }}>
              <div className="w-[1px] h-3 bg-purple-500/50" />
              <span className="text-[9px] font-mono text-purple-400/50 mt-[2px]">{y}</span>
            </div>
          );
        })}

        {items.map((item, i) => {
          const pct = (i / (items.length - 1)) * 100;
          return (
            <motion.div
              key={item.id}
              className="absolute top-[10px] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer"
              style={{
                left: `${pct}%`,
                background: activeId === item.id ? item.accentColor : item.accentColor + "30",
                boxShadow: activeId === item.id ? `0 0 8px ${item.accentColor}` : "none",
                transition: "all 0.3s",
              }}
              onClick={() => onSelect(item.id)}
              whileHover={{ scale: 1.5 }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STATS HEADER
// ═══════════════════════════════════════════════════════════════
function StatsHeader() {
  const stats = [
    { val: EXPERIENCIAS.length, label: "Proyectos", color: "#b49bff" },
    { val: EXPERIENCIAS.filter((e) => e.type === "job").length, label: "Prácticas", color: "#ff2d6b" },
    { val: EXPERIENCIAS.filter((e) => e.type === "freelance").length, label: "Freelance", color: "#00ff88" },
    { val: EXPERIENCIAS.filter((e) => e.type === "academic").length, label: "Académicos", color: "#a855f7" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-4 gap-[1px] w-full max-w-2xl mx-auto mb-10"
      style={{ background: "rgba(112,66,248,0.1)", border: "1px solid rgba(112,66,248,0.12)" }}
    >
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center py-4 px-2" style={{ background: "rgba(3,0,20,0.85)" }}>
          <span className="text-2xl font-bold font-mono" style={{ color: s.color, textShadow: `0 0 14px ${s.color}55` }}>
            {s.val}
          </span>
          <span className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function ExperienciaCyber() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = EXPERIENCIAS.find((e) => e.id === activeId) ?? null;

  const handleSelect = useCallback(
    (id: number) => {
      const next = activeId === id ? null : id;
      setActiveId(next);
    },
    [activeId]
  );

  const handleClose = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="experiencia" className="flex flex-col items-center py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-purple-900/10 blur-[160px]" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[200px] rounded-full bg-indigo-900/08 blur-[120px]" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className="absolute font-mono text-[9px]"
            style={{
              left: `${((i * 137.5) % 100)}%`,
              top: `${((i * 73.1 + 12) % 100)}%`,
              color: "rgba(112,66,248,0.06)",
              transform: `rotate(${i * 17}deg)`,
            }}
          >
            {["░", "▒", "▓", "█", "┼", "╬", "◈", "⊕"][i % 8]}
          </span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-10 z-10 relative w-full px-6"
      >
        <h2 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center mb-2">
          Experiencia
        </h2>
        <p className="text-[18px] text-gray-300 text-center">Línea de tiempo de proyectos y prácticas</p>
      </motion.div>

      <div className="relative z-10 w-full px-6">
        <StatsHeader />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] px-2">
        <HorizontalTimeline items={EXPERIENCIAS} activeId={activeId} onSelect={handleSelect} />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] px-6">
        <AnimatePresence mode="wait">
          {activeItem && <DetailPanel key={activeItem.id} item={activeItem} onClose={handleClose} />}
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="relative z-10 text-gray-700 text-xs mt-8 font-mono"
      >
        {EXPERIENCIAS.length} entradas · scroll horizontal · click para expandir · ESC para cerrar
      </motion.p>
    </section>
  );
}
