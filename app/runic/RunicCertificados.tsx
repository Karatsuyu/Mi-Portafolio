"use client";

/**
 * RunicCertificados — Sección de certificados para el tema Runic
 *
 * Concepto visual: "Pergaminos de poder" — cada certificado es un
 * Sigil (sello mágico) grabado en piedra antigua con:
 *   - Anillos orbitales SVG animados por card (no Three.js global)
 *   - Runa identificadora única por certificado
 *   - Borde de "pergamino" con esquinas rúnicas
 *   - Al hacer hover: el sigil se ilumina y la runa orbita
 *   - Al hacer clic: modal de visor con imagen del cert + datos
 *   - Fondo: el circuit-background existente del tema (no se toca)
 *
 * DIFERENCIA vs otras secciones de certificados:
 *   Space → Hologramas con prisma de luz
 *   Cyber → Cards tipo tarjeta de crédito con HUD
 *   Classic → Cards con flip 3D
 *   Runic  → SIGILOS / SELLOS MÁGICOS con anillos orbitales SVG
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Datos reales de certificados ─────────────────────────────

interface Cert {
  id: string;
  rune: string;           // Runa nórdica identificadora
  runeName: string;       // Nombre de la runa
  title: string;          // Nombre del certificado
  issuer: string;         // Emisor
  platform: string;       // Plataforma (Coursera, AWS, etc.)
  year: string;
  category: "cloud" | "frontend" | "backend" | "ux" | "tools" | "language";
  credentialUrl?: string;
  imageSrc: string;       // Ruta al PDF/imagen del certificado
  skills: string[];       // Skills validadas
  sccEvidencia?: string;  // Competencia SCC que evidencia
}

const CATEGORY_META = {
  cloud:    { label: "Cloud",    color: "#06b6d4", icon: "☁" },
  frontend: { label: "Frontend", color: "#a855f7", icon: "◈" },
  backend:  { label: "Backend",  color: "#10b981", icon: "⬡" },
  ux:       { label: "UX/UI",    color: "#f59e0b", icon: "✦" },
  tools:    { label: "Herramientas", color: "#ef4444", icon: "⚙" },
  language: { label: "Idiomas",  color: "#3b82f6", icon: "◆" },
} as const;

const CERTS: Cert[] = [
  {
    id: "aws-cloud-practitioner",
    rune: "ᚠ", runeName: "Fehu",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    platform: "AWS",
    year: "2023",
    category: "cloud",
    imageSrc: "/certificates/aws-cloud-practitioner.png",
    credentialUrl: "https://www.credly.com/",
    skills: ["AWS EC2", "S3", "IAM", "Cloud Architecture", "Pricing"],
    sccEvidencia: "SCC.E.7 — Infraestructura y redes",
  },
  {
    id: "meta-frontend",
    rune: "ᚢ", runeName: "Uruz",
    title: "Meta Front-End Developer",
    issuer: "Meta",
    platform: "Coursera",
    year: "2023",
    category: "frontend",
    imageSrc: "/certificates/meta-frontend.png",
    credentialUrl: "https://www.coursera.org/",
    skills: ["React", "JavaScript", "HTML/CSS", "Figma", "UX"],
    sccEvidencia: "SCC.E.4 — Construcción de interfaces",
  },
  {
    id: "google-ux",
    rune: "ᚦ", runeName: "Thurisaz",
    title: "Google UX Design Certificate",
    issuer: "Google",
    platform: "Coursera",
    year: "2023",
    category: "ux",
    imageSrc: "/certificates/google-ux.png",
    credentialUrl: "https://www.coursera.org/",
    skills: ["UX Research", "Wireframing", "Prototyping", "Figma", "Usability"],
    sccEvidencia: "SCC.E.5 — Evaluación de usabilidad",
  },
  {
    id: "nextjs-vercel",
    rune: "ᚱ", runeName: "Raidho",
    title: "Next.js & Vercel Certified",
    issuer: "Vercel",
    platform: "Vercel",
    year: "2024",
    category: "frontend",
    imageSrc: "/certificates/nextjs-vercel.png",
    skills: ["Next.js", "App Router", "SSR", "ISR", "Edge Functions"],
    sccEvidencia: "SCC.E.3 — Paradigmas de programación",
  },
  {
    id: "docker-kubernetes",
    rune: "ᚲ", runeName: "Kenaz",
    title: "Docker & Kubernetes Essentials",
    issuer: "Linux Foundation",
    platform: "Linux Foundation",
    year: "2024",
    category: "tools",
    imageSrc: "/certificates/docker-kubernetes.png",
    skills: ["Docker", "Docker Compose", "Kubernetes", "Containers", "CI/CD"],
    sccEvidencia: "SCC.E.9 — Documentación y despliegue",
  },
  {
    id: "typescript-pro",
    rune: "ᚷ", runeName: "Gebo",
    title: "TypeScript Pro Masterclass",
    issuer: "Zero To Mastery",
    platform: "Zero To Mastery",
    year: "2024",
    category: "language",
    imageSrc: "/certificates/typescript-pro.png",
    skills: ["TypeScript", "Generics", "Type Guards", "Decorators", "Advanced Types"],
    sccEvidencia: "SCC.E.3 — Paradigmas de programación",
  },
];

// ── Anillos orbitales SVG (sin Three.js — más liviano) ──────

function SigilRings({ color, active }: { color: string; active: boolean }) {
  return (
    <svg
      className="runic-cert-rings"
      viewBox="0 0 160 160"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: active ? 1 : 0.45,
        transition: "opacity 0.35s ease",
      }}
    >
      <defs>
        <filter id={`glow-${color.replace("#", "")}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Anillo exterior lento */}
      <circle cx="80" cy="80" r="72" fill="none"
        stroke={color} strokeWidth="0.8" strokeOpacity={active ? 0.5 : 0.2}
        strokeDasharray="6 4"
        style={{ transformOrigin: "80px 80px", animation: "runicRingOuter 22s linear infinite" }}
      />

      {/* Anillo medio */}
      <circle cx="80" cy="80" r="58" fill="none"
        stroke={color} strokeWidth="1" strokeOpacity={active ? 0.7 : 0.3}
        strokeDasharray="12 6 2 6"
        style={{ transformOrigin: "80px 80px", animation: "runicRingMid 14s linear infinite reverse" }}
      />

      {/* Anillo interior */}
      <circle cx="80" cy="80" r="44" fill="none"
        stroke={color} strokeWidth="0.6" strokeOpacity={active ? 0.4 : 0.15}
        strokeDasharray="3 5"
        style={{ transformOrigin: "80px 80px", animation: "runicRingOuter 8s linear infinite" }}
      />

      {/* Puntos cardinales en el anillo exterior */}
      {[[80, 8], [152, 80], [80, 152], [8, 80]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={active ? 3 : 1.5}
          fill={color} fillOpacity={active ? 0.9 : 0.4}
          filter={active ? `url(#glow-${color.replace("#", "")})` : undefined}
        />
      ))}

      {/* Líneas de cuadrante (solo activo) */}
      {active && (
        <>
          <line x1="80" y1="8"  x2="80" y2="44"  stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="80" y1="116" x2="80" y2="152" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="8"  y1="80" x2="44" y2="80"  stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="116" y1="80" x2="152" y2="80" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
        </>
      )}

      {/* Octágono central tipo sello */}
      <polygon
        points="80,38 101,47 112,68 112,92 101,113 80,122 59,113 48,92 48,68 59,47"
        fill="none"
        stroke={color}
        strokeWidth={active ? 1.2 : 0.6}
        strokeOpacity={active ? 0.6 : 0.25}
      />
    </svg>
  );
}

// ── Card de certificado (Sigil) ──────────────────────────────

function SigilCard({ cert, onSelect }: { cert: Cert; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[cert.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="runic-sigil-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        "--cert-color": meta.color,
      } as React.CSSProperties}
    >
      {/* Anillos orbitales SVG */}
      <SigilRings color={meta.color} active={hovered} />

      {/* Esquinas rúnicas decorativas */}
      {["tl","tr","br","bl"].map(pos => (
        <div key={pos} className={`runic-corner runic-corner-${pos}`}
          style={{ borderColor: meta.color + (hovered ? "80" : "30") }} />
      ))}

      {/* Cuerpo central del sigil */}
      <div className="runic-sigil-body">

        {/* Runa + categoría */}
        <div className="runic-sigil-top">
          <span className="runic-sigil-rune"
            style={{ color: meta.color, textShadow: hovered ? `0 0 20px ${meta.color}` : "none" }}>
            {cert.rune}
          </span>
          <span className="runic-sigil-category"
            style={{ color: meta.color + "aa", borderColor: meta.color + "30" }}>
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* Línea decorativa */}
        <div className="runic-sigil-divider"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }} />

        {/* Título */}
        <h3 className="runic-sigil-title"
          style={{ color: hovered ? "#fff" : "rgba(230,220,255,0.9)" }}>
          {cert.title}
        </h3>

        {/* Emisor */}
        <p className="runic-sigil-issuer">{cert.issuer}</p>
        <p className="runic-sigil-platform">{cert.platform} · {cert.year}</p>

        {/* Skills chips */}
        <div className="runic-sigil-skills">
          {cert.skills.slice(0, 3).map(s => (
            <span key={s} className="runic-skill-chip"
              style={{ borderColor: meta.color + "35", color: meta.color + "cc", background: meta.color + "0d" }}>
              {s}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="runic-skill-chip" style={{ color: "rgba(200,180,240,0.35)", borderColor: "rgba(200,180,240,0.1)" }}>
              +{cert.skills.length - 3}
            </span>
          )}
        </div>

        {/* SCC evidencia */}
        {cert.sccEvidencia && (
          <div className="runic-sigil-scc"
            style={{ color: meta.color + "90", borderLeftColor: meta.color + "60" }}>
            ✦ {cert.sccEvidencia}
          </div>
        )}

        {/* Nombre de la runa */}
        <div className="runic-sigil-runename"
          style={{ color: meta.color + "50" }}>
          {cert.runeName}
        </div>
      </div>

      {/* Glow de fondo al hover */}
      <div className="runic-sigil-glow"
        style={{
          background: `radial-gradient(ellipse at center, ${meta.color}15 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }} />
    </motion.div>
  );
}

// ── Modal visor de certificado ────────────────────────────────

function CertModal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const meta = CATEGORY_META[cert.category];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1200,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(10px)",
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", inset: 0, zIndex: 1201,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
          pointerEvents: "none",
        }}
      >
        <div style={{
          pointerEvents: "auto",
          width: "100%", maxWidth: 640,
          background: "rgba(11,8,21,0.98)",
          border: `1px solid ${meta.color}40`,
          borderRadius: 16,
          boxShadow: `0 0 80px ${meta.color}20, 0 32px 80px rgba(0,0,0,0.7)`,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Línea superior */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${meta.color}, ${meta.color}, transparent)`,
            boxShadow: `0 0 16px ${meta.color}`,
          }} />

          {/* Cabecera */}
          <div style={{
            padding: "1.1rem 1.4rem",
            borderBottom: `1px solid ${meta.color}15`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              {/* Runa circular */}
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                border: `1.5px solid ${meta.color}60`,
                background: `${meta.color}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 16px ${meta.color}40`,
              }}>
                <span style={{ fontFamily: "'Noto Sans Runic', serif", fontSize: "1.3rem", color: meta.color }}>
                  {cert.rune}
                </span>
              </div>
              <div>
                <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  {cert.title}
                </h3>
                <p style={{ color: meta.color + "aa", fontSize: "0.72rem", margin: "0.15rem 0 0", fontFamily: "monospace" }}>
                  {cert.issuer} · {cert.platform} · {cert.year}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, border: `1px solid ${meta.color}30`,
              background: "transparent", color: "rgba(255,255,255,0.4)",
              borderRadius: 6, cursor: "pointer", fontSize: "0.9rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Imagen del certificado */}
          <div style={{
            margin: "1rem 1.4rem",
            borderRadius: 8, overflow: "hidden",
            border: `1px solid ${meta.color}25`,
            background: "#000", aspectRatio: "4/3",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cert.imageSrc}
              alt={cert.title}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                // Fallback si la imagen no existe
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  `<div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;color:${meta.color}40">
                    <span style="font-family:'Noto Sans Runic',serif;font-size:3rem">${cert.rune}</span>
                    <span style="font-size:0.75rem;font-family:monospace">Imagen no disponible</span>
                  </div>`;
              }}
            />
          </div>

          {/* Skills + SCC */}
          <div style={{ padding: "0 1.4rem 1.1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
              {cert.skills.map(s => (
                <span key={s} style={{
                  fontSize: "0.65rem", padding: "0.2rem 0.6rem", fontFamily: "monospace",
                  border: `1px solid ${meta.color}30`,
                  color: meta.color + "cc",
                  background: meta.color + "0d",
                  borderRadius: 4,
                }}>
                  {s}
                </span>
              ))}
            </div>

            {cert.sccEvidencia && (
              <div style={{
                fontSize: "0.7rem", padding: "0.5rem 0.75rem",
                background: `${meta.color}08`,
                border: `1px solid ${meta.color}20`,
                borderLeft: `3px solid ${meta.color}60`,
                color: meta.color + "99",
                fontFamily: "monospace",
                borderRadius: "0 6px 6px 0",
                marginBottom: "0.75rem",
              }}>
                ✦ {cert.sccEvidencia}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontSize: "0.72rem", padding: "0.45rem 1rem",
                    background: `linear-gradient(135deg, ${meta.color}30, ${meta.color}15)`,
                    border: `1px solid ${meta.color}50`,
                    color: meta.color,
                    borderRadius: 6, textDecoration: "none",
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    fontFamily: "monospace",
                  }}>
                  <span style={{ fontFamily: "'Noto Sans Runic', serif" }}>ᚠ</span>
                  Ver credencial
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Componente principal exportable ──────────────────────────

export default function RunicCertificados() {
  const [selected, setSelected] = useState<Cert | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(CERTS.map(c => c.category)))];
  const filtered = filter === "all" ? CERTS : CERTS.filter(c => c.category === filter);

  return (
    <>
      {/* Estilos locales inyectados */}
      <style>{`
        @keyframes runicRingOuter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes runicRingMid {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .runic-sigil-card {
          position: relative;
          cursor: pointer;
          width: 100%;
          aspect-ratio: 1;
          max-width: 260px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .runic-sigil-card:hover {
          transform: translateY(-6px) scale(1.03);
        }

        .runic-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-style: solid;
          border-width: 0;
          transition: border-color 0.3s ease;
          z-index: 4;
        }
        .runic-corner-tl { top: 8px; left: 8px; border-top-width: 1.5px; border-left-width: 1.5px; }
        .runic-corner-tr { top: 8px; right: 8px; border-top-width: 1.5px; border-right-width: 1.5px; }
        .runic-corner-br { bottom: 8px; right: 8px; border-bottom-width: 1.5px; border-right-width: 1.5px; }
        .runic-corner-bl { bottom: 8px; left: 8px; border-bottom-width: 1.5px; border-left-width: 1.5px; }

        .runic-sigil-body {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
          width: 100%;
          height: 100%;
          justify-content: center;
          gap: 0.4rem;
        }

        .runic-sigil-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .runic-sigil-rune {
          font-family: 'Noto Sans Runic', serif;
          font-size: 2.4rem;
          line-height: 1;
          transition: all 0.3s ease;
          display: block;
        }

        .runic-sigil-category {
          font-size: 0.58rem;
          font-family: monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.12rem 0.5rem;
          border: 1px solid;
          border-radius: 20px;
        }

        .runic-sigil-divider {
          width: 60%;
          height: 1px;
          margin: 0.2rem auto;
        }

        .runic-sigil-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          line-height: 1.3;
          margin: 0;
          transition: color 0.3s;
        }

        .runic-sigil-issuer {
          font-size: 0.65rem;
          color: rgba(200,180,240,0.6);
          margin: 0;
          font-weight: 600;
        }

        .runic-sigil-platform {
          font-size: 0.6rem;
          color: rgba(200,180,240,0.35);
          margin: 0;
          font-family: monospace;
        }

        .runic-sigil-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2rem;
          justify-content: center;
          margin-top: 0.2rem;
        }

        .runic-skill-chip {
          font-size: 0.55rem;
          padding: 0.1rem 0.4rem;
          border: 1px solid;
          border-radius: 3px;
          font-family: monospace;
        }

        .runic-sigil-scc {
          font-size: 0.58rem;
          font-family: monospace;
          padding: 0.25rem 0.5rem;
          border-left: 2px solid;
          text-align: left;
          width: 90%;
          line-height: 1.4;
          margin-top: 0.15rem;
          background: rgba(0,0,0,0.2);
        }

        .runic-sigil-runename {
          font-size: 0.55rem;
          font-family: monospace;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: auto;
        }

        .runic-sigil-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          transition: opacity 0.35s ease;
          z-index: 1;
        }

        /* Filtros de categoría */
        .runic-cert-filters {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .runic-cert-filter-btn {
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.04em;
        }

        /* Grid de sigilos */
        .runic-sigils-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
          align-items: center;
        }

        @media (max-width: 600px) {
          .runic-sigils-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
          .runic-sigil-rune { font-size: 1.8rem; }
          .runic-sigil-title { font-size: 0.65rem; }
        }
      `}</style>

      <div className="certificates-content">
        <h2 style={{ marginBottom: "0.5rem" }}>Certificados</h2>
        <p style={{ marginBottom: "1.5rem", color: "var(--muted)" }}>
          Sellos de conocimiento validado — haz clic para ver la credencial completa
        </p>

        {/* Filtros */}
        <div className="runic-cert-filters">
          {categories.map(cat => {
            const isActive = filter === cat;
            const meta = cat !== "all" ? CATEGORY_META[cat as keyof typeof CATEGORY_META] : null;
            const color = meta?.color ?? "hsl(280,100%,55%)";
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="runic-cert-filter-btn"
                style={{
                  background: isActive ? `${color}20` : "transparent",
                  border: isActive ? `1px solid ${color}60` : "1px solid rgba(200,180,240,0.15)",
                  color: isActive ? color : "rgba(200,180,240,0.45)",
                  boxShadow: isActive ? `0 0 12px ${color}30` : "none",
                }}
              >
                {cat === "all" ? "Todos" : (meta ? `${meta.icon} ${meta.label}` : cat)}
              </button>
            );
          })}
        </div>

        {/* Grid de sigilos */}
        <div className="runic-sigils-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map(cert => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3 }}
              >
                <SigilCard cert={cert} onSelect={() => setSelected(cert)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contador */}
        <p style={{
          textAlign: "center", marginTop: "2rem",
          fontSize: "0.65rem", fontFamily: "monospace",
          color: "rgba(200,180,240,0.2)", letterSpacing: "0.15em",
        }}>
          {filtered.length} {filtered.length === 1 ? "sello" : "sellos"} de conocimiento · haz clic para explorar
        </p>
      </div>

      {/* Modal visor */}
      <AnimatePresence>
        {selected && (
          <CertModal
            key={selected.id}
            cert={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
