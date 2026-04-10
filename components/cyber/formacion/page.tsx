'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { COMMITS, BRANCH_COLORS, ACTIVE_BRANCHES } from '@/components/cyber/formacion/FormacionData';

const GitTimeline  = dynamic(() => import('@/components/cyber/formacion/GitTimeline'),  { ssr: false });
const CustomCursor = dynamic(() => import('@/components/cyber/CustomCursor'),            { ssr: false });

// ── Stats del historial ──────────────────────────────────────
function GitStats() {
  const totalCommits   = COMMITS.length;
  const branches       = ACTIVE_BRANCHES.length;
  const merges         = COMMITS.filter(c => c.isMerge).length;
  const years          = new Date().getFullYear() - 2020;

  const stats = [
    { label: 'commits',  value: totalCommits, color: 'var(--cyan)'  },
    { label: 'branches', value: branches,     color: 'var(--green)' },
    { label: 'merges',   value: merges,       color: 'var(--purple2)' },
    { label: 'años',     value: `${years}+`,  color: 'var(--yellow)' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '0',
      border: '1px solid rgba(0,245,255,0.08)',
      marginBottom: '2rem',
      overflow: 'hidden',
    }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.07, duration: 0.45 }}
          style={{
            flex: 1,
            padding: '1rem',
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid rgba(0,245,255,0.06)' : 'none',
            background: 'rgba(8,12,20,0.8)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontWeight: 900,
            color: s.color as string,
            textShadow: `0 0 14px ${s.color as string}55`,
            lineHeight: 1,
          }}>
            {s.value}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(200,216,232,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '0.3rem',
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Simulación de comando git log ────────────────────────────
function GitLogHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        marginBottom: '1.75rem',
        padding: '0.75rem 1rem',
        background: 'rgba(6,10,16,0.9)',
        border: '1px solid rgba(0,245,255,0.07)',
        lineHeight: 1.9,
      }}
    >
      <span style={{ color: '#a855f7' }}>$ </span>
      <span style={{ color: 'rgba(200,216,232,0.5)' }}>git log </span>
      <span style={{ color: 'var(--cyan)', opacity: 0.7 }}>--all --graph --oneline --decorate</span>
      <br />
      <span style={{ color: 'rgba(200,216,232,0.2)', fontSize: '0.62rem' }}>
        # {COMMITS.length} commits · {ACTIVE_BRANCHES.length} branches · ordenado cronológicamente
      </span>
      <br />
      <span style={{ color: 'rgba(200,216,232,0.2)', fontSize: '0.62rem' }}>
        # click en cualquier commit para ver el detalle
      </span>
    </motion.div>
  );
}

// ── Página ───────────────────────────────────────────────────
export default function FormacionPage() {
  return (
    <>
      <CustomCursor />

      {/* Fondo */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 }} />

      {/* Grid sutil */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      <div className="cyber-vignette" />

      {/* Navbar */}
      <nav className="cyber-nav" style={{ zIndex: 100 }}>
        <Link href="/cyber" className="cyber-nav-logo">TN.dev</Link>
        <ul className="cyber-nav-links">
          {[
            ['← Inicio',     '/cyber'],
            ['Proyectos',    '/cyber/proyectos'],
            ['Habilidades',  '/cyber/habilidades'],
            ['Certificados', '/cyber/certificados'],
            ['Contacto',     '/cyber/contacto'],
          ].map(([l, h]) => (
            <li key={h}><Link href={h}>{l}</Link></li>
          ))}
        </ul>
      </nav>

      {/* Main */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        paddingTop: '5.5rem',
        paddingBottom: '5rem',
        paddingLeft:  'clamp(1.5rem, 5vw, 4rem)',
        paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
        minHeight: '100vh',
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '1.75rem' }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'rgba(0,245,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ color: 'rgba(200,216,232,0.2)' }}>~/portfolio</span>
            <span>/</span>
            formacion
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '0.6rem',
          }}>
            FORMACIÓN
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'rgba(200,216,232,0.35)',
            lineHeight: 1.6,
            maxWidth: '520px',
          }}>
            Historial de aprendizaje como{' '}
            <span style={{ color: 'var(--cyan)' }}>git log</span>
            {' '}— cada rama es una vía de formación
          </p>
        </motion.div>

        {/* Stats */}
        <GitStats />

        {/* Comando */}
        <GitLogHeader />

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GitTimeline />
        </motion.div>
      </main>

      {/* Status bar */}
      <footer className="cyber-statusbar" style={{ zIndex: 150 }}>
        <span className="cyber-statusbar-item">
          <span className="dot" />
          formacion.tsx
        </span>
        <span className="cyber-statusbar-item">⬡ git log</span>
        <span className="cyber-statusbar-item" style={{ marginLeft: 'auto' }}>
          {COMMITS.length} commits · {ACTIVE_BRANCHES.length} branches
        </span>
      </footer>
    </>
  );
}
