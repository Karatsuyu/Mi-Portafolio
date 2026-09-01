"use client";

/**
 * Classic → /classic/certificados
 *
 * Grid 3 columnas con cards de certificados.
 * Cada card: logo emisor + nombre + badge categoría + año + skills + botón.
 * Modal React con AnimatePresence — imagen + datos + link a credencial.
 * Filtros por categoría arriba.
 * Compatible con tema claro/oscuro del Classic.
 */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Tipos ───────────────────────────────────────────────────

type CertCategory = "cloud" | "frontend" | "backend" | "ux" | "tools" | "data";

interface Cert {
  id: string;
  title: string;
  issuer: string;
  platform: string;
  year: string;
  category: CertCategory;
  imageSrc: string;       // /public/certificates/xxx.png
  credentialUrl?: string;
  skills: string[];
  sccCode?: string;       // Competencia SCC que evidencia
  featured?: boolean;
}

// ── Datos reales ─────────────────────────────────────────────

const CATEGORY_META: Record<CertCategory, { label: string; color: string; icon: string }> = {
  cloud:    { label: "Cloud",          color: "#06b6d4", icon: "☁" },
  frontend: { label: "Frontend",       color: "#ff0095", icon: "◈" },
  backend:  { label: "Backend",        color: "#10b981", icon: "⬡" },
  ux:       { label: "UX/UI",          color: "#f59e0b", icon: "✦" },
  tools:    { label: "Herramientas",   color: "#a855f7", icon: "⚙" },
  data:     { label: "Datos",          color: "#3b82f6", icon: "◆" },
};

const CERTS: Cert[] = [
  {
    id: "aws-cloud",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    platform: "AWS",
    year: "2023",
    category: "cloud",
    imageSrc: "/certificates/aws-cloud-practitioner.png",
    credentialUrl: "https://www.credly.com/",
    skills: ["AWS EC2", "S3", "IAM", "Cloud Architecture", "Pricing"],
    sccCode: "SCC.E.7",
    featured: true,
  },
  {
    id: "meta-frontend",
    title: "Meta Front-End Developer",
    issuer: "Meta",
    platform: "Coursera",
    year: "2023",
    category: "frontend",
    imageSrc: "/certificates/meta-frontend.png",
    credentialUrl: "https://www.coursera.org/",
    skills: ["React", "JavaScript", "HTML/CSS", "Figma", "UX"],
    sccCode: "SCC.E.4",
    featured: true,
  },
  {
    id: "google-ux",
    title: "Google UX Design Certificate",
    issuer: "Google",
    platform: "Coursera",
    year: "2023",
    category: "ux",
    imageSrc: "/certificates/google-ux.png",
    credentialUrl: "https://www.coursera.org/",
    skills: ["UX Research", "Wireframing", "Prototyping", "Figma", "Usability"],
    sccCode: "SCC.E.5",
  },
  {
    id: "nextjs-vercel",
    title: "Next.js & Vercel Certified",
    issuer: "Vercel",
    platform: "Vercel",
    year: "2024",
    category: "frontend",
    imageSrc: "/certificates/nextjs-vercel.png",
    skills: ["Next.js", "App Router", "SSR", "ISR", "Edge Functions"],
    sccCode: "SCC.E.3",
  },
  {
    id: "docker-kubernetes",
    title: "Docker & Kubernetes Essentials",
    issuer: "Linux Foundation",
    platform: "Linux Foundation",
    year: "2024",
    category: "tools",
    imageSrc: "/certificates/docker-kubernetes.png",
    skills: ["Docker", "Docker Compose", "Kubernetes", "Containers", "CI/CD"],
    sccCode: "SCC.E.9",
  },
  {
    id: "typescript-pro",
    title: "TypeScript Pro Masterclass",
    issuer: "Zero To Mastery",
    platform: "Zero To Mastery",
    year: "2024",
    category: "frontend",
    imageSrc: "/certificates/typescript-pro.png",
    skills: ["TypeScript", "Generics", "Type Guards", "Decorators"],
    sccCode: "SCC.E.3",
  },
];

// ── Filtros ──────────────────────────────────────────────────

type FilterKey = "all" | CertCategory;
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",      label: "Todos" },
  { key: "cloud",    label: "Cloud" },
  { key: "frontend", label: "Frontend" },
  { key: "backend",  label: "Backend" },
  { key: "ux",       label: "UX/UI" },
  { key: "tools",    label: "Herramientas" },
  { key: "data",     label: "Datos" },
];

// ── Modal de certificado ──────────────────────────────────────

function CertModal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const meta = CATEGORY_META[cert.category];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{`
        .classic-cert-modal-card::-webkit-scrollbar {
          width: 6px;
        }
        .classic-cert-modal-card::-webkit-scrollbar-track {
          background: rgba(6, 3, 16, 0.7);
        }
        .classic-cert-modal-card::-webkit-scrollbar-thumb {
          background: rgba(255, 0, 149, 0.5);
          border-radius: 4px;
        }
        .classic-cert-modal-card::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 0, 149, 0.8);
        }
      `}</style>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2.5rem 1rem",
          pointerEvents: "none",
        }}
      >
        <div
          className="classic-cert-modal-card"
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 580,
            maxHeight: "calc(100vh - 5rem)",
            background: "rgba(6,3,16,0.98)",
            border: "1px solid rgba(255,0,149,0.35)",
            borderRadius: 14,
            overflowY: "auto",
            boxShadow: "0 0 60px rgba(255,0,149,0.2), 0 32px 80px rgba(0,0,0,0.85)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Línea superior magenta */}
          <div style={{
            position: "sticky", top: 0, zIndex: 11,
            height: 2, flexShrink: 0,
            background: "linear-gradient(90deg, transparent, #ff0095, #e91e63, #ff0095, transparent)",
            boxShadow: "0 0 16px rgba(255,0,149,0.8)",
          }} />

          {/* Header */}
          <div style={{
            position: "sticky", top: 2, zIndex: 10,
            background: "rgba(6,3,16,0.96)",
            backdropFilter: "blur(12px)",
            padding: "0.9rem 1.25rem 0.8rem",
            borderBottom: "1px solid rgba(255,0,149,0.15)",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
            flexShrink: 0,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 600, padding: "0.15rem 0.6rem",
                  borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em",
                  background: `${meta.color}18`, color: meta.color,
                  border: `1px solid ${meta.color}35`,
                }}>
                  {meta.icon} {meta.label}
                </span>
                {cert.featured && (
                  <span style={{
                    fontSize: "0.58rem", padding: "0.12rem 0.5rem",
                    background: "linear-gradient(90deg, #ff0095, #e91e63)",
                    color: "#fff", borderRadius: 20, fontWeight: 700,
                  }}>
                    ★ Destacado
                  </span>
                )}
                <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                  {cert.year}
                </span>
              </div>
              <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: "0 0 0.15rem", lineHeight: 1.3 }}>
                {cert.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", margin: 0 }}>
                {cert.issuer} · {cert.platform}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              style={{
                width: 30, height: 30, flexShrink: 0,
                border: "1px solid rgba(255,0,149,0.3)",
                background: "rgba(255,0,149,0.08)", color: "rgba(255,255,255,0.7)",
                borderRadius: 6, cursor: "pointer", fontSize: "0.85rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,0,149,0.25)";
                e.currentTarget.style.borderColor = "rgba(255,0,149,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                e.currentTarget.style.background = "rgba(255,0,149,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,0,149,0.3)";
              }}
            >
              ✕
            </button>
          </div>

          {/* Imagen del certificado */}
          <div style={{
            margin: "0.85rem 1.25rem",
            borderRadius: 8, overflow: "hidden",
            border: "1px solid rgba(255,0,149,0.2)",
            background: "#000",
            maxHeight: "260px",
            minHeight: "160px",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            flexShrink: 0,
          }}>
            {!imgError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cert.imageSrc}
                alt={cert.title}
                style={{ width: "100%", maxHeight: "260px", objectFit: "contain", display: "block" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", opacity: 0.35 }}>{meta.icon}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,0,149,0.75)" }}>{cert.title}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>Imagen no disponible</div>
              </div>
            )}
          </div>

          {/* Skills + SCC + links */}
          <div style={{ padding: "0 1.25rem 1.25rem", flexShrink: 0 }}>
            {/* Skills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.7rem" }}>
              {cert.skills.map(s => (
                <span key={s} style={{
                  fontSize: "0.65rem", padding: "0.18rem 0.55rem",
                  background: "rgba(255,0,149,0.08)",
                  border: "1px solid rgba(255,0,149,0.2)",
                  color: "rgba(255,0,149,0.85)",
                  borderRadius: 4, fontFamily: "monospace",
                }}>
                  {s}
                </span>
              ))}
            </div>

            {/* SCC */}
            {cert.sccCode && (
              <div style={{
                fontSize: "0.7rem", padding: "0.45rem 0.7rem",
                background: "rgba(255,0,149,0.05)",
                border: "1px solid rgba(255,0,149,0.15)",
                borderLeft: "3px solid rgba(255,0,149,0.5)",
                color: "rgba(255,0,149,0.75)",
                fontFamily: "monospace",
                borderRadius: "0 6px 6px 0",
                marginBottom: "0.85rem",
              }}>
                ✦ Evidencia competencia {cert.sccCode}
              </div>
            )}

            {/* Botón credencial */}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  width: "fit-content",
                }}
              >
                <i className="fas fa-external-link-alt" />
                Ver credencial verificada
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}

// ── Card de certificado ───────────────────────────────────────

function CertCard({ cert, index, onOpen }: { cert: Cert; index: number; onOpen: () => void }) {
  const ref  = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [imgError, setImgError] = useState(false);
  const meta = CATEGORY_META[cert.category];

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onOpen}
    >
      {/* Badge destacado */}
      {cert.featured && (
        <div style={{
          position: "absolute", top: "0.7rem", right: "0.7rem", zIndex: 2,
          fontSize: "0.58rem", padding: "0.12rem 0.5rem",
          background: "linear-gradient(90deg, #ff0095, #e91e63)",
          color: "#fff", borderRadius: 20, fontWeight: 700,
        }}>
          ★ Destacado
        </div>
      )}

      {/* Preview del certificado */}
      <div style={{
        width: "100%", aspectRatio: "4/3",
        background: `linear-gradient(135deg, ${meta.color}12, rgba(0,0,0,0.5))`,
        border: `1px solid ${meta.color}25`,
        borderRadius: 8,
        marginBottom: "0.85rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={cert.imageSrc}
            alt={cert.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 7 }}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback cuando no hay imagen */
          <div style={{
            display: "flex",
            position: "absolute", inset: 0,
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "0.5rem",
          }}>
            <span style={{ fontSize: "2.5rem", color: meta.color, opacity: 0.4 }}>{meta.icon}</span>
            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "rgba(255,255,255,0.25)" }}>
              {cert.platform}
            </span>
          </div>
        )}

        {/* Overlay hover */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s",
            borderRadius: 7,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.45)";
            const span = (e.currentTarget as HTMLDivElement).querySelector("span");
            if (span) span.style.opacity = "1";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0)";
            const span = (e.currentTarget as HTMLDivElement).querySelector("span");
            if (span) span.style.opacity = "0";
          }}
        >
          <span style={{
            fontFamily: "var(--font-sans, sans-serif)",
            fontSize: "0.75rem", color: "#fff",
            background: "rgba(255,0,149,0.85)", padding: "0.4rem 1rem",
            borderRadius: 6, opacity: 0, transition: "opacity 0.25s",
            pointerEvents: "none",
          }}>
            Ver certificado
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Categoría + año */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{
            fontSize: "0.6rem", fontWeight: 600, padding: "0.12rem 0.55rem",
            borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em",
            background: `${meta.color}18`, color: meta.color,
            border: `1px solid ${meta.color}30`,
          }}>
            {meta.icon} {meta.label}
          </span>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            {cert.year}
          </span>
        </div>

        {/* Título */}
        <h3 style={{ margin: "0 0 0.2rem", fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.3, color: "var(--text, #fff)" }}>
          {cert.title}
        </h3>

        {/* Emisor */}
        <p style={{ margin: "0 0 0.65rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
          {cert.issuer} · {cert.platform}
        </p>

        {/* Skills chips — primeras 3 + contador */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.75rem" }}>
          {cert.skills.slice(0, 3).map(s => (
            <span key={s} style={{
              fontSize: "0.6rem", padding: "0.1rem 0.45rem",
              background: "rgba(255,0,149,0.07)",
              border: "1px solid rgba(255,0,149,0.18)",
              color: "rgba(255,0,149,0.78)",
              borderRadius: 4, fontFamily: "monospace",
            }}>
              {s}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.22)" }}>
              +{cert.skills.length - 3}
            </span>
          )}
        </div>

        {/* SCC badge */}
        {cert.sccCode && (
          <div style={{
            fontSize: "0.62rem", fontFamily: "monospace",
            color: "rgba(255,0,149,0.6)",
            marginTop: "auto",
            borderTop: "1px solid rgba(255,0,149,0.1)",
            paddingTop: "0.5rem",
          }}>
            ✦ {cert.sccCode}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────

export default function ClassicCertificados() {
  const [filter,   setFilter]   = useState<FilterKey>("all");
  const [selected, setSelected] = useState<Cert | null>(null);

  const counts: Record<FilterKey, number> = {
    all:      CERTS.length,
    cloud:    CERTS.filter(c => c.category === "cloud").length,
    frontend: CERTS.filter(c => c.category === "frontend").length,
    backend:  CERTS.filter(c => c.category === "backend").length,
    ux:       CERTS.filter(c => c.category === "ux").length,
    tools:    CERTS.filter(c => c.category === "tools").length,
    data:     CERTS.filter(c => c.category === "data").length,
  };

  const filtered = filter === "all" ? CERTS : CERTS.filter(c => c.category === filter);

  return (
    <>
      <section className="section">
        <h2>
          <i className="fas fa-certificate" style={{ marginRight: 10 }} />
          Certificados
        </h2>
        <p className="subtitle" style={{ marginBottom: "1.5rem" }}>
          {CERTS.length} certificaciones verificadas · haz clic en una card para ver la credencial completa
        </p>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {FILTERS.filter(f => counts[f.key] > 0 || f.key === "all").map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                padding: "0.38rem 0.85rem", borderRadius: 20, fontFamily: "inherit",
                fontSize: "0.73rem", fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s ease",
                border: filter === f.key ? "2px solid var(--primary)" : "1px solid rgba(255,0,149,0.22)",
                background: filter === f.key ? "linear-gradient(135deg,#ff0095,#e91e63)" : "transparent",
                color: filter === f.key ? "#fff" : "rgba(255,0,149,0.65)",
                boxShadow: filter === f.key ? "0 4px 16px rgba(255,0,149,0.3)" : "none",
              }}>
              {f.label}
              <span style={{ opacity: 0.65, fontSize: "0.62rem", marginLeft: "0.25rem" }}>
                ({counts[f.key]})
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, i) => (
              <motion.div key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
              >
                <CertCard cert={cert} index={i} onOpen={() => setSelected(cert)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p style={{
          fontSize: "0.68rem", color: "rgba(255,255,255,0.18)",
          textAlign: "center", marginTop: "1.25rem", fontFamily: "monospace",
        }}>
          {filtered.length} {filtered.length === 1 ? "certificado" : "certificados"} · haz clic para ver la credencial
        </p>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <CertModal key={selected.id} cert={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
