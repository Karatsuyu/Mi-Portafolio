'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PROJECTS, CATEGORIES, type Project } from '@/components/cyber/proyectos/ProjectsData';

const ProjectCard3D = dynamic(
  () => import('@/components/cyber/proyectos/ProjectCard3D'),
  { ssr: false }
);
const CodeParticles = dynamic(
  () => import('@/components/cyber/CodeParticles'),
  { ssr: false }
);
const CustomCursor = dynamic(
  () => import('@/components/cyber/CustomCursor'),
  { ssr: false }
);

// ── Panel de detalle (slide-in desde la derecha) ─────────────
function DetailPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 32 }}
      style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 'min(520px, 92vw)',
        background: 'rgba(8,12,20,0.96)',
        borderLeft: `1px solid ${project.accent}30`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 200,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Glow top */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
        flexShrink: 0,
      }} />

      <div style={{ padding: '2rem', flex: 1 }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          data-cursor-hover
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'rgba(200,216,232,0.4)',
            background: 'transparent',
            border: '1px solid rgba(200,216,232,0.12)',
            padding: '0.4rem 1rem',
            cursor: 'none',
            marginBottom: '2rem',
            letterSpacing: '0.1em',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,245,255,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,216,232,0.4)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,216,232,0.12)';
          }}
        >
          ✕ cerrar
        </button>

        {/* Categoría + año */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: project.accent,
            background: `${project.accent}12`,
            border: `1px solid ${project.accent}30`,
            padding: '0.25rem 0.75rem',
          }}>
            {project.category}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'rgba(200,216,232,0.3)',
            padding: '0.25rem 0.75rem',
            border: '1px solid rgba(200,216,232,0.1)',
          }}>
            {project.year}
          </span>
        </div>

        {/* Título */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1,
          marginBottom: '0.5rem',
          letterSpacing: '-0.01em',
        }}>
          {project.title}
        </h2>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: project.accent,
          opacity: 0.7,
          letterSpacing: '0.06em',
          marginBottom: '1.5rem',
        }}>
          {project.subtitle}
        </p>

        {/* Línea divisora */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, ${project.accent}40, transparent)`,
          marginBottom: '1.5rem',
        }} />

        {/* Descripción larga */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'rgba(200,216,232,0.65)',
          lineHeight: 1.8,
          marginBottom: '1.75rem',
        }}>
          {project.longDescription}
        </p>

        {/* Métricas */}
        {project.metrics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: `${project.accent}15`,
            border: `1px solid ${project.accent}20`,
            marginBottom: '1.75rem',
            padding: '1px',
          }}>
            {project.metrics.map(m => (
              <div key={m.label} style={{
                background: 'rgba(8,12,20,0.9)',
                padding: '1rem',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: project.accent,
                  textShadow: `0 0 16px ${project.accent}55`,
                }}>
                  {m.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'rgba(200,216,232,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '0.25rem',
                }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stack completo */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(200,216,232,0.25)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Stack tecnológico
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.stack.map(tech => (
              <span key={tech} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'rgba(200,216,232,0.6)',
                background: 'rgba(200,216,232,0.05)',
                border: '1px solid rgba(200,216,232,0.12)',
                padding: '0.3rem 0.75rem',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                color: project.accent,
                background: `${project.accent}12`,
                border: `1px solid ${project.accent}40`,
                padding: '0.65rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                transition: 'background 0.2s',
              }}
            >
              ↗ Live demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                color: 'rgba(200,216,232,0.5)',
                background: 'transparent',
                border: '1px solid rgba(200,216,232,0.15)',
                padding: '0.65rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              ⌥ Repositorio
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Backdrop oscuro para el panel ────────────────────────────
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3,4,10,0.6)',
        backdropFilter: 'blur(2px)',
        zIndex: 190,
        cursor: 'none',
      }}
    />
  );
}

// ── Filtros de categoría ─────────────────────────────────────
function CategoryFilters({
  active,
  onChange,
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '2.5rem',
    }}>
      {Object.entries(CATEGORIES).map(([key, cat]) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            data-cursor-hover
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isActive ? '#000' : cat.color,
              background: isActive ? cat.color : 'transparent',
              border: `1px solid ${isActive ? cat.color : cat.color + '35'}`,
              padding: '0.4rem 1rem',
              cursor: 'none',
              transition: 'all 0.2s',
              clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export default function ProyectosPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <CustomCursor />

      {/* Fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        zIndex: 0,
      }} />

      {/* Code rain tenue */}
      <div style={{ opacity: 0.08, position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <CodeParticles />
      </div>

      {/* Vignette */}
      <div className="cyber-vignette" />

      {/* Grilla de fondo tipo blueprint */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Navbar */}
      <nav className="cyber-nav" style={{ zIndex: 100 }}>
        <Link href="/cyber" className="cyber-nav-logo">TN.dev</Link>
        <ul className="cyber-nav-links">
          {[
            ['← Inicio',      '/cyber'],
            ['Habilidades',   '/cyber/habilidades'],
            ['Formación',     '/cyber/formacion'],
            ['Certificados',  '/cyber/certificados'],
            ['Contacto',      '/cyber/contacto'],
          ].map(([label, href]) => (
            <li key={href}><Link href={href}>{label}</Link></li>
          ))}
        </ul>
      </nav>

      {/* Contenido principal */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        paddingTop: '6rem',
        paddingBottom: '5rem',
        paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
        paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
        minHeight: '100vh',
      }}>
        {/* Header de página */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '3rem' }}
        >
          {/* Breadcrumb */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'rgba(0,245,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ color: 'rgba(200,216,232,0.2)' }}>~/portfolio</span>
            <span>/</span>
            proyectos
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}>
            PROYECTOS
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'rgba(200,216,232,0.4)',
            lineHeight: 1.6,
            maxWidth: '520px',
          }}>
            {PROJECTS.length} proyectos en producción · hover para previsualizar · click para detalle
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CategoryFilters active={activeCategory} onChange={setActiveCategory} />
        </motion.div>

        {/* Grid de cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {filtered.map((project, i) => (
              <ProjectCard3D
                key={project.id}
                project={project}
                index={i}
                onSelect={setSelectedProject}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Estado vacío */}
        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(200,216,232,0.2)',
              textAlign: 'center',
              padding: '4rem 0',
            }}
          >
            {'// no projects found in this category'}
          </motion.p>
        )}
      </main>

      {/* Panel de detalle */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <Backdrop onClick={() => setSelectedProject(null)} />
            <DetailPanel
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Status bar */}
      <footer className="cyber-statusbar" style={{ zIndex: 150 }}>
        <span className="cyber-statusbar-item">
          <span className="dot" />
          {filtered.length} proyectos
        </span>
        <span className="cyber-statusbar-item">⬡ proyectos.tsx</span>
        <span className="cyber-statusbar-item" style={{ marginLeft: 'auto' }}>
          {activeCategory !== 'all' ? `filter: ${activeCategory}` : 'all categories'}
        </span>
      </footer>
    </>
  );
}