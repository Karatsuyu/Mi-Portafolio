"use client";

/**
 * CyberSobreMiModal — Modal "Sobre mí" para el tema Cyber
 *
 * Concepto: "DEVELOPER_PROFILE.exe"
 *
 * Layout tipo IDE de 3 paneles:
 *
 *   PANEL 1 — File Explorer (izquierda, 22%):
 *     Árbol de archivos del "sistema" del desarrollador.
 *     Cada nodo es una competencia SCC como módulo.
 *     Al hacer clic se carga el "archivo" en el editor.
 *
 *   PANEL 2 — Code Editor (centro, 50%):
 *     El perfil del desarrollador mostrado como código
 *     con syntax highlighting, números de línea y
 *     efecto typewriter al abrir el modal.
 *     Al seleccionar una SCC en el explorer, muestra
 *     la definición con el formato de un módulo TypeScript.
 *
 *   PANEL 3 — Terminal Output (derecha, 28%):
 *     Terminal con logs animados de las competencias.
 *     Barra de habilidades tipo carga de sistema.
 *
 *   BARRA DE TABS superior tipo VSCode.
 *   STATUS BAR inferior tipo IDE con info del "archivo".
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Paleta Cyber ─────────────────────────────────────────────
const C = {
  cyan:    "#00f5ff",
  green:   "#00ff88",
  purple:  "#a855f7",
  yellow:  "#f0e040",
  red:     "#ff2d6b",
  orange:  "#ff6b35",
  bg:      "rgba(3,4,10,0.99)",
  bgPanel: "rgba(6,8,16,0.95)",
  bgSide:  "rgba(4,5,12,0.97)",
  border:  "rgba(0,245,255,0.12)",
  borderB: "rgba(0,245,255,0.25)",
  text:    "rgba(200,216,232,0.75)",
  muted:   "rgba(200,216,232,0.3)",
  lineNum: "rgba(200,216,232,0.18)",
};

// ── Datos del desarrollador ───────────────────────────────────
const DEV = {
  name: "Julián Estiven Gutiérrez Tabares",
  handle: "Karatsuyu",
  title: "Tecnólogo en Desarrollo de Software",
  university: "Universidad del Valle",
  email: "julian.estiven.gutierrez@correounivalle.edu.co",
  github: "github.com/Karatsuyu",
  linkedin: "linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382",
  location: "Colombia",
};

// El perfil como código fuente (syntax highlighting manual)
const CODE_LINES = [
  { n: 1,  tokens: [{ t: "// DEVELOPER_PROFILE.ts — v2.0.4", c: C.muted }] },
  { n: 2,  tokens: [] },
  { n: 3,  tokens: [{ t: "import", c: C.purple }, { t: " { SCC } ", c: C.text }, { t: "from", c: C.purple }, { t: " '@uvalle/competencias';", c: C.yellow }] },
  { n: 4,  tokens: [{ t: "import", c: C.purple }, { t: " { Stack } ", c: C.text }, { t: "from", c: C.purple }, { t: " './technologies';", c: C.yellow }] },
  { n: 5,  tokens: [] },
  { n: 6,  tokens: [{ t: "export const ", c: C.purple }, { t: "developer", c: C.cyan }, { t: " = {", c: C.text }] },
  { n: 7,  tokens: [{ t: "  name: ", c: C.text }, { t: '"Julián Estiven Gutiérrez"', c: C.green }] },
  { n: 8,  tokens: [{ t: "  handle: ", c: C.text }, { t: '"@Karatsuyu"', c: C.green }] },
  { n: 9,  tokens: [{ t: "  title: ", c: C.text }, { t: '"Tecnólogo en Desarrollo de Software"', c: C.green }] },
  { n: 10, tokens: [{ t: "  university: ", c: C.text }, { t: '"Universidad del Valle"', c: C.green }] },
  { n: 11, tokens: [{ t: "  location: ", c: C.text }, { t: '"Colombia 🇨🇴"', c: C.green }] },
  { n: 12, tokens: [] },
  { n: 13, tokens: [{ t: "  /** Bio */", c: C.muted }] },
  { n: 14, tokens: [{ t: "  bio: [", c: C.text }] },
  { n: 15, tokens: [{ t: "    'Soy un Tecnólogo en Desarrollo de Software formado en la Universidad del Valle,',", c: C.yellow }] },
  { n: 16, tokens: [{ t: "    'apasionado por la tecnología, la innovación y la creación de soluciones digitales',", c: C.yellow }] },
  { n: 17, tokens: [{ t: "    'que generen impacto. Mi enfoque principal está orientado al desarrollo de software',", c: C.yellow }] },
  { n: 18, tokens: [{ t: "    'de calidad, la experiencia del usuario (UX/UI) y la aplicación de buenas prácticas',", c: C.yellow }] },
  { n: 19, tokens: [{ t: "    'en todo el ciclo de vida del desarrollo.',", c: C.yellow }] },
  { n: 20, tokens: [] },
  { n: 21, tokens: [{ t: "    'Durante mi formación, he adquirido conocimientos sólidos en programación estructurada',", c: C.yellow }] },
  { n: 22, tokens: [{ t: "    'y orientada a objetos, diseño de bases de datos, desarrollo web (frontend y backend),',", c: C.yellow }] },
  { n: 23, tokens: [{ t: "    'análisis de requerimientos, ingeniería de software y pruebas funcionales.',", c: C.yellow }] },
  { n: 24, tokens: [{ t: "    'Me interesa especialmente el diseño de interfaces intuitivas, la optimización del rendimiento',", c: C.yellow }] },
  { n: 25, tokens: [{ t: "    'de las aplicaciones y la integración de herramientas que mejoren la experiencia del usuario final.',", c: C.yellow }] },
  { n: 26, tokens: [] },
  { n: 27, tokens: [{ t: "    'Mi objetivo profesional es seguir creciendo como desarrollador, profundizando en tecnologías',", c: C.yellow }] },
  { n: 28, tokens: [{ t: "    'modernas del ecosistema web y móvil, así como en el diseño de arquitecturas eficientes',", c: C.yellow }] },
  { n: 29, tokens: [{ t: "    'y mantenibles. Me motiva la idea de formar parte de proyectos donde pueda contribuir',", c: C.yellow }] },
  { n: 30, tokens: [{ t: "    'a través de la creatividad, la lógica y la mejora continua, aportando soluciones que',", c: C.yellow }] },
  { n: 31, tokens: [{ t: "    'combinen funcionalidad, diseño y valor real para las personas.',", c: C.yellow }] },
  { n: 32, tokens: [] },
  { n: 33, tokens: [{ t: "    'Soy una persona autodidacta, proactiva y adaptable, con gran interés por el aprendizaje',", c: C.yellow }] },
  { n: 34, tokens: [{ t: "    'constante y la actualización tecnológica. Busco siempre ir más allá de lo aprendido,',", c: C.yellow }] },
  { n: 35, tokens: [{ t: "    'investigando nuevas herramientas, patrones de diseño y tendencias en desarrollo de software',", c: C.yellow }] },
  { n: 36, tokens: [{ t: "    'que me permitan ofrecer productos cada vez más profesionales, escalables y sostenibles.',", c: C.yellow }] },
  { n: 37, tokens: [{ t: "  ],", c: C.text }] },
  { n: 38, tokens: [] },
  { n: 39, tokens: [{ t: "  stack: ", c: C.text }, { t: "Stack", c: C.cyan }, { t: " = [", c: C.text }] },
  { n: 40, tokens: [{ t: "    'React', 'Next.js', 'TypeScript',", c: C.green }] },
  { n: 41, tokens: [{ t: "    'Django', 'FastAPI', 'Node.js',", c: C.green }] },
  { n: 42, tokens: [{ t: "    'PostgreSQL', 'Docker', 'AWS',", c: C.green }] },
  { n: 43, tokens: [{ t: "    'Three.js', 'Tailwind', 'Figma',", c: C.green }] },
  { n: 44, tokens: [{ t: "  ],", c: C.text }] },
  { n: 45, tokens: [] },
  { n: 46, tokens: [{ t: "  contact: {", c: C.text }] },
  { n: 47, tokens: [{ t: "    email: ", c: C.text }, { t: '"julian.estiven.gutierrez@correounivalle.edu.co"', c: C.cyan }] },
  { n: 48, tokens: [{ t: "    github: ", c: C.text }, { t: '"github.com/Karatsuyu"', c: C.cyan }] },
  { n: 49, tokens: [{ t: "    linkedin: ", c: C.text }, { t: '"linkedin.com/in/julian-estiven-gutierrez..."', c: C.cyan }] },
  { n: 50, tokens: [{ t: "  },", c: C.text }] },
  { n: 51, tokens: [] },
  { n: 52, tokens: [{ t: "  scc: ", c: C.text }, { t: "SCC[]", c: C.purple }, { t: " = loadCompetencias(),", c: C.text }] },
  { n: 53, tokens: [{ t: "};", c: C.text }] },
  { n: 54, tokens: [] },
  { n: 55, tokens: [{ t: "export default ", c: C.purple }, { t: "developer;", c: C.cyan }] },
];

// ── Competencias SCC ─────────────────────────────────────────
interface SCC {
  code: string;
  file: string;
  title: string;
  definition: string;
  color: string;
  icon: string;
  level: number;
}

const SCC_LIST: SCC[] = [
  { code: "SCC.E.1", file: "fundamentals.ts",   title: "Fundamentos de Computación",   definition: "Utilizo los conocimientos fundamentales en teoría de la computación en la construcción de sistemas basados en TIC.",                                                                                  color: C.purple,   icon: "⬡", level: 88 },
  { code: "SCC.E.2", file: "quality.ts",         title: "Calidad de Software",           definition: "Evalúo factores de calidad estandarizados durante la valoración de uno o varios productos de software.",                                                                                           color: C.cyan,     icon: "◈", level: 82 },
  { code: "SCC.E.3", file: "paradigms.ts",       title: "Paradigmas y Lenguajes",        definition: "Selecciono y utilizo diferentes paradigmas y lenguajes de programación al construir sistemas basados en TIC.",                                                                                     color: C.green,    icon: "▣", level: 90 },
  { code: "SCC.E.4", file: "interfaces.tsx",     title: "Diseño de Interfaces",          definition: "Aplico conceptos y principios implicados en el proceso de diseño de interfaces gráficas de usuario durante el desarrollo de aplicaciones software.",                                              color: C.yellow,   icon: "◎", level: 85 },
  { code: "SCC.E.5", file: "usability.test.ts",  title: "Evaluación de Usabilidad",     definition: "Aplico técnicas de evaluación de usabilidad que permiten medir la calidad de la experiencia que tienen los usuarios al interactuar con el software que desarrollo.",                             color: C.orange,   icon: "✦", level: 78 },
  { code: "SCC.E.6", file: "infrastructure.ts",  title: "Infraestructura de TIC",       definition: "Implemento proyectos de infraestructura de TIC comprendiendo las características propias de las tecnologías de transporte de datos.",                                                           color: C.red,      icon: "⬢", level: 72 },
  { code: "SCC.E.7", file: "services.deploy.ts", title: "Servicios de Infraestructura", definition: "Diseño y despliego soluciones de servicios de infraestructura tecnológica orientadas a resolver requerimientos de clientes.",                                                                     color: "#f97316",  icon: "◆", level: 75 },
  { code: "SCC.E.8", file: "problem.solving.ts", title: "Resolución de Problemas",      definition: "Resuelvo problemas desde el nivel tecnológico identificando diferentes alternativas de solución y desarrollando sistemas basados en TIC.",                                                       color: "#22d3ee",  icon: "⚡", level: 92 },
  { code: "SCC.E.9", file: "full.project.ts",    title: "Desarrollo Integral",          definition: "Desarrollo proyectos analizando, modelando, diseñando, evaluando, gestionando, documentando, desplegando e implementando sistemas basados en TIC.",                                              color: "#a3e635",  icon: "∞", level: 88 },
];

// ── Componentes HUD ───────────────────────────────────────────

function HUDCorners({ color = C.cyan, size = 12 }: { color?: string; size?: number }) {
  const s = { position: "absolute" as const, width: size, height: size };
  const b = `1.5px solid ${color}`;
  return (
    <>
      <div style={{ ...s, top: 0, left: 0, borderTop: b, borderLeft: b, boxShadow: `2px 2px 6px ${color}30` }} />
      <div style={{ ...s, top: 0, right: 0, borderTop: b, borderRight: b, boxShadow: `-2px 2px 6px ${color}30` }} />
      <div style={{ ...s, bottom: 0, left: 0, borderBottom: b, borderLeft: b, boxShadow: `2px -2px 6px ${color}30` }} />
      <div style={{ ...s, bottom: 0, right: 0, borderBottom: b, borderRight: b, boxShadow: `-2px -2px 6px ${color}30` }} />
    </>
  );
}

function SystemBar({ value, color, label }: { value: number; color: string; label: string }) {
  const segments = 20;
  const filled   = Math.round((value / 100) * segments);
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.18rem" }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: C.muted }}>{label}</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color, textShadow: `0 0 6px ${color}` }}>{value}%</span>
      </div>
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} style={{
            width: "100%",
            height: 6,
            background: i < filled ? color : "rgba(255,255,255,0.05)",
            boxShadow: i < filled ? `0 0 4px ${color}80` : "none",
            clipPath: "polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)",
            transition: `background 0.05s ${i * 20}ms`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Panel: File Explorer ──────────────────────────────────────
function FileExplorer({ selected, onSelect }: { selected: SCC | null; onSelect: (s: SCC) => void }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", scrollbarWidth: "none", padding: "0.5rem 0" }}>
      <div style={{ padding: "0.2rem 0.6rem 0.4rem", fontSize: "0.58rem", fontFamily: "monospace", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        📁 SCC/ — 9 modules
      </div>

      {SCC_LIST.map((scc, i) => {
        const isSelected = selected?.code === scc.code;
        return (
          <motion.div key={scc.code}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(scc)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.32rem 0.65rem",
              cursor: "pointer",
              background: isSelected ? `${scc.color}18` : "transparent",
              borderLeft: isSelected ? `2px solid ${scc.color}` : "2px solid transparent",
              transition: "all 0.18s",
            }}
            whileHover={{ background: `${scc.color}0d` }}
          >
            <span style={{ fontSize: "0.65rem", color: scc.color, flexShrink: 0, textShadow: isSelected ? `0 0 6px ${scc.color}` : "none" }}>
              {scc.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "monospace", fontSize: "0.62rem",
                color: isSelected ? "#fff" : C.text,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {scc.file}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: scc.color + "80" }}>
                {scc.code}
              </div>
            </div>
          </motion.div>
        );
      })}

      <div style={{ margin: "0.5rem 0.6rem", height: 1, background: C.border }} />
      <div style={{ padding: "0.2rem 0.6rem 0.3rem", fontSize: "0.58rem", fontFamily: "monospace", color: C.muted }}>
        📄 profile.ts
      </div>
    </div>
  );
}

// ── Panel: Code Editor ────────────────────────────────────────
function CodeEditor({ selectedSCC }: { selectedSCC: SCC | null }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const sccCode = selectedSCC ? [
    { n: 1,  tokens: [{ t: `// ${selectedSCC.file}`, c: C.muted }] },
    { n: 2,  tokens: [] },
    { n: 3,  tokens: [{ t: "/**", c: C.muted }] },
    { n: 4,  tokens: [{ t: ` * @module `, c: C.muted }, { t: selectedSCC.code, c: C.cyan }] },
    { n: 5,  tokens: [{ t: ` * @title  `, c: C.muted }, { t: `"${selectedSCC.title}"`, c: C.green }] },
    { n: 6,  tokens: [{ t: " */", c: C.muted }] },
    { n: 7,  tokens: [] },
    { n: 8,  tokens: [{ t: "export const ", c: C.purple }, { t: selectedSCC.code.replace(".", "_").replace(".", "_"), c: C.cyan }, { t: ": SCC = {", c: C.text }] },
    { n: 9,  tokens: [] },
    { n: 10, tokens: [{ t: "  code: ", c: C.text }, { t: `"${selectedSCC.code}"`, c: C.yellow }] },
    { n: 11, tokens: [] },
    { n: 12, tokens: [{ t: "  title: ", c: C.text }] },
    { n: 13, tokens: [{ t: `    "${selectedSCC.title}",`, c: C.green }] },
    { n: 14, tokens: [] },
    { n: 15, tokens: [{ t: "  /** @definition", c: C.muted }] },
    { n: 16, tokens: [{ t: `   * ${selectedSCC.definition.slice(0, 55)}`, c: C.muted }] },
    { n: 17, tokens: [{ t: `   * ${selectedSCC.definition.slice(55, 110)}`, c: C.muted }] },
    { n: 18, tokens: [{ t: `   * ${selectedSCC.definition.slice(110)}`, c: C.muted }] },
    { n: 19, tokens: [{ t: "   */", c: C.muted }] },
    { n: 20, tokens: [{ t: "  definition: `", c: C.text }, { t: selectedSCC.definition, c: C.yellow }, { t: "`,", c: C.text }] },
    { n: 21, tokens: [] },
    { n: 22, tokens: [{ t: "  level: ", c: C.text }, { t: `${selectedSCC.level}`, c: C.purple }, { t: " as Proficiency,", c: C.muted }] },
    { n: 23, tokens: [] },
    { n: 24, tokens: [{ t: "};", c: C.text }] },
    { n: 25, tokens: [] },
    { n: 26, tokens: [{ t: "export default ", c: C.purple }, { t: selectedSCC.code.replace(".", "_").replace(".", "_"), c: C.cyan }, { t: ";", c: C.text }] },
  ] : CODE_LINES;

  const lines = selectedSCC ? sccCode : CODE_LINES;

  return (
    <div ref={scrollRef}
      style={{ height: "100%", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: `${C.cyan}30 transparent` }}>

      {/* Scanlines decorativas */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.015) 2px, rgba(0,245,255,0.015) 4px)",
      }} />

      {/* Líneas de código */}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: "1rem" }}>
        {lines.map((line, i) => (
          <motion.div key={`${selectedSCC?.code}-${line.n}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.015 }}
            style={{
              display: "flex", alignItems: "flex-start",
              minHeight: "1.5rem",
              padding: "0.08rem 0",
            }}
          >
            <span style={{
              fontFamily: "monospace", fontSize: "0.62rem",
              color: C.lineNum,
              minWidth: "2.8rem", textAlign: "right",
              paddingRight: "1rem",
              userSelect: "none", flexShrink: 0,
            }}>
              {line.n}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.68rem", lineHeight: 1.5, flexWrap: "wrap", wordBreak: "break-word" }}>
              {line.tokens.length === 0 ? "\u00A0" : line.tokens.map((tok, j) => (
                <span key={j} style={{ color: tok.c }}>{tok.t}</span>
              ))}
            </span>
          </motion.div>
        ))}

        {/* Cursor parpadeante */}
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "2.8rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: C.muted }}>
            {lines.length + 1}
          </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{ fontFamily: "monospace", fontSize: "0.68rem", color: C.cyan, marginLeft: "1rem" }}
          >
            █
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Terminal ───────────────────────────────────────────
function TerminalPanel({ selectedSCC }: { selectedSCC: SCC | null }) {
  const [logs, setLogs] = useState<{ text: string; color: string }[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial = [
      { text: "> CyberDev OS v2.0.4 — BOOTING...", color: C.cyan },
      { text: "> Loading DEVELOPER_PROFILE...", color: C.muted },
      { text: "> [OK] profile.ts compiled", color: C.green },
      { text: "> [OK] 9 SCC modules detected", color: C.green },
      { text: "> [OK] Stack: 14 technologies", color: C.green },
      { text: "> READY — Click a module to inspect", color: C.yellow },
    ];
    initial.forEach((log, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, i * 180);
    });
  }, []);

  useEffect(() => {
    if (!selectedSCC) return;
    const newLogs = [
      { text: `> import ${selectedSCC.code}...`, color: C.muted },
      { text: `> [OK] ${selectedSCC.file} loaded`, color: C.green },
      { text: `> Proficiency: ${selectedSCC.level}%`, color: selectedSCC.color },
    ];
    newLogs.forEach((log, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
      }, i * 140);
    });
  }, [selectedSCC]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Terminal header */}
      <div style={{
        padding: "0.4rem 0.7rem",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: "0.4rem",
        flexShrink: 0,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.yellow }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: C.muted, marginLeft: "0.3rem" }}>
          terminal — zsh
        </span>
      </div>

      {/* Terminal output */}
      <div ref={termRef} style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.7rem", scrollbarWidth: "none" }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            fontFamily: "monospace", fontSize: "0.62rem",
            color: log.color, lineHeight: 1.55,
            marginBottom: "0.1rem",
          }}>
            {log.text}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: C.border, flexShrink: 0 }} />

      {/* Barras de sistema */}
      <div style={{ padding: "0.6rem 0.7rem", flexShrink: 0 }}>
        <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: C.muted, marginBottom: "0.5rem", letterSpacing: "0.12em" }}>
          SYSTEM LOAD — SCC MODULES
        </div>
        {(selectedSCC ? [selectedSCC, ...SCC_LIST.filter(s => s.code !== selectedSCC.code).slice(0, 4)] : SCC_LIST.slice(0, 5)).map(scc => (
          <SystemBar key={scc.code} value={scc.level} color={scc.color} label={scc.code} />
        ))}
      </div>
    </div>
  );
}

// ── Tabs del IDE ──────────────────────────────────────────────
function IDETabs({ selectedSCC, onClear }: { selectedSCC: SCC | null; onClear: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      borderBottom: `1px solid ${C.border}`,
      background: "rgba(0,0,0,0.3)",
      flexShrink: 0, overflowX: "auto",
    }}>
      {/* Tab fijo: profile.ts */}
      <div
        onClick={onClear}
        style={{
          display: "flex", alignItems: "center", gap: "0.35rem",
          padding: "0.45rem 0.85rem",
          cursor: "pointer",
          borderBottom: !selectedSCC ? `2px solid ${C.cyan}` : "2px solid transparent",
          background: !selectedSCC ? "rgba(0,245,255,0.06)" : "transparent",
          borderRight: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "0.65rem" }}>📄</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: !selectedSCC ? C.cyan : C.muted }}>
          profile.ts
        </span>
      </div>

      {/* Tab de SCC seleccionada */}
      <AnimatePresence>
        {selectedSCC && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              borderBottom: `2px solid ${selectedSCC.color}`,
              background: `${selectedSCC.color}08`,
              borderRight: `1px solid ${C.border}`,
              overflow: "hidden", flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "0.65rem", color: selectedSCC.color }}>{selectedSCC.icon}</span>
            <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: selectedSCC.color, whiteSpace: "nowrap" }}>
              {selectedSCC.file}
            </span>
            <span
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              style={{ fontSize: "0.6rem", color: C.muted, cursor: "pointer", marginLeft: "0.2rem" }}
            >
              ✕
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MODAL PRINCIPAL ───────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function CyberSobreMiModal({ onClose }: Props) {
  const [selectedSCC, setSelectedSCC] = useState<SCC | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fn = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleSelect = useCallback((scc: SCC) => {
    setSelectedSCC(prev => prev?.code === scc.code ? null : scc);
  }, []);

  const activeColor = selectedSCC?.color ?? C.cyan;

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes cyberScan {
          0%   { top: -2px; opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes cyberBlink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        .cyber-modal-wrapper,
        .cyber-modal-wrapper * {
          cursor: none !important;
        }
      `}</style>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="cyber-modal-wrapper"
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(12px)",
        }}
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="cyber-modal-wrapper"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div style={{
          pointerEvents: "auto",
          position: "relative",
          width: "100%", maxWidth: 1000,
          maxHeight: "92vh",
          background: C.bg,
          border: `1px solid ${activeColor}30`,
          boxShadow: `0 0 80px ${activeColor}18, 0 0 200px ${activeColor}06, 0 40px 80px rgba(0,0,0,0.8)`,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}>

          {/* Scanline animada */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: "1px",
            background: `linear-gradient(90deg, transparent, ${activeColor}60, transparent)`,
            zIndex: 20, pointerEvents: "none",
            animation: "cyberScan 4s linear infinite",
          }} />

          {/* Esquinas HUD */}
          <HUDCorners color={activeColor} size={16} />

          {/* Línea superior de glow */}
          <div style={{
            height: 2, flexShrink: 0,
            background: `linear-gradient(90deg, transparent, ${activeColor}, ${activeColor}, transparent)`,
            boxShadow: `0 0 16px ${activeColor}`,
            transition: "background 0.3s",
          }} />

          {/* ── ACTIVITY BAR (extremo izquierdo) ── */}
          <div style={{
            position: "absolute",
            top: 2, bottom: 0, left: 0,
            width: 36,
            background: "rgba(0,0,0,0.5)",
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: "2rem", gap: "1rem",
            zIndex: 5,
          }}>
            {["◈","⬡","▣","✦"].map((icon, i) => (
              <div key={i} style={{
                width: 24, height: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", color: i === 0 ? activeColor : C.muted,
                cursor: "pointer",
              }}>
                {icon}
              </div>
            ))}
          </div>

          {/* ── CUERPO DEL IDE ── */}
          <div style={{ flex: 1, display: "flex", marginLeft: 36, minHeight: 0, overflow: "hidden" }}>

            {/* PANEL 1: File Explorer */}
            <div style={{
              width: "20%", flexShrink: 0,
              borderRight: `1px solid ${C.border}`,
              background: C.bgSide,
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "0.45rem 0.6rem",
                borderBottom: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Explorer
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: C.muted }}>
                  {DEV.handle}
                </span>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <FileExplorer selected={selectedSCC} onSelect={handleSelect} />
              </div>
            </div>

            {/* PANEL 2 + PANEL 3 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

              {/* Tabs */}
              <IDETabs selectedSCC={selectedSCC} onClear={() => setSelectedSCC(null)} />

              {/* Editor + Terminal */}
              <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>

                {/* PANEL 2: Code Editor */}
                <div style={{
                  flex: 1,
                  background: C.bgPanel,
                  position: "relative",
                  overflow: "hidden",
                  borderRight: `1px solid ${C.border}`,
                }}>
                  <CodeEditor selectedSCC={selectedSCC} />
                </div>

                {/* PANEL 3: Terminal */}
                <div style={{
                  width: "30%", flexShrink: 0,
                  background: C.bgSide,
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <TerminalPanel selectedSCC={selectedSCC} />
                </div>
              </div>
            </div>
          </div>

          {/* ── STATUS BAR INFERIOR ── */}
          <div style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.28rem 1rem 0.28rem calc(36px + 0.6rem)",
            background: `${activeColor}18`,
            borderTop: `1px solid ${activeColor}30`,
            transition: "background 0.3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: activeColor, letterSpacing: "0.08em" }}>
                ⚡ CyberDev OS v2.0.4
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: C.muted }}>
                {selectedSCC ? `${selectedSCC.code} — ${selectedSCC.title}` : "profile.ts"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: C.muted }}>
                TypeScript · UTF-8
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: C.green }}>
                ● Ln {selectedSCC ? "20" : "55"} Col 1
              </span>
              <button onClick={onClose} style={{
                fontFamily: "monospace", fontSize: "0.55rem",
                background: "transparent", border: "none",
                color: C.muted, cursor: "pointer",
              }}>
                ESC ✕
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}
