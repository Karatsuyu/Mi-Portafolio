'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SKILL_FILES } from '@/components/cyber/habilidades/SkillsData';

const IDEWindow   = dynamic(() => import('@/components/cyber/habilidades/IDEWindow'),   { ssr: false });
const CustomCursor = dynamic(() => import('@/components/cyber/CustomCursor'),            { ssr: false });

// ── Contador animado de número ───────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 40);
        if (start >= target) { setVal(target); return; }
        setVal(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Stats overview ───────────────────────────────────────────
const STATS = [
  { label: 'Tecnologías',   value: 38,  suffix: ''   },
  { label: 'Años exp.',     value: 4,   suffix: '+'  },
  { label: 'Proyectos',     value: 6,   suffix: ''   },
  { label: 'Commits',       value: 2,   suffix: ''   },
];

function StatsRow() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1px',
      background: 'rgba(0,245,255,0.08)',
      border: '1px solid rgba(0,245,255,0.08)',
      marginBottom: '2rem',
    }}>
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
          style={{
            background: 'rgba(8,12,20,0.9)',
            padding: '1.25rem 1rem',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 900,
            color: 'var(--cyan)',
            textShadow: 'var(--glow-cyan)',
            lineHeight: 1,
          }}>
            <AnimatedCounter target={s.value} suffix={s.suffix} />
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(200,216,232,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '0.35rem',
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Leyenda de categorías ────────────────────────────────────
function CategoryLegend() {
  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
    }}>
      {SKILL_FILES.map(f => (
        <div key={f.filename} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'rgba(200,216,232,0.45)',
        }}>
          <span style={{ color: f.color, fontSize: '0.75rem' }}>{f.icon}</span>
          <span>{f.filename}</span>
        </div>
      ))}
    </div>
  );
}

// ── Página ───────────────────────────────────────────────────
export default function HabilidadesPage() {
  return (
    <>
      <CustomCursor />

      {/* Fondo */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 }} />

      {/* Grid de fondo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div className="cyber-vignette" />

      {/* Navbar */}
      <nav className="cyber-nav" style={{ zIndex: 100 }}>
        <Link href="/cyber" className="cyber-nav-logo">TN.dev</Link>
        <ul className="cyber-nav-links">
          {[
            ['← Inicio',     '/cyber'],
            ['Proyectos',    '/cyber/proyectos'],
            ['Formación',    '/cyber/formacion'],
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
        paddingBottom: '4rem',
        paddingLeft:  'clamp(1.5rem, 4vw, 3rem)',
        paddingRight: 'clamp(1.5rem, 4vw, 3rem)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
            habilidades
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
            HABILIDADES
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'rgba(200,216,232,0.35)',
            lineHeight: 1.6,
            maxWidth: '500px',
          }}>
            Stack técnico completo · presiona{' '}
            <span style={{ color: 'var(--green)' }}>▶ RUN</span>
            {' '}para ejecutar cada archivo y ver el output en terminal
          </p>
        </motion.div>

        {/* Stats */}
        <StatsRow />

        {/* Leyenda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CategoryLegend />
        </motion.div>

        {/* IDE — ocupa el resto del viewport */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: 1,
            minHeight: 'clamp(400px, 55vh, 620px)',
            borderRadius: 0,
          }}
        >
          <IDEWindow />
        </motion.div>

        {/* Nota pie de página */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(200,216,232,0.15)',
            textAlign: 'center',
            marginTop: '1.5rem',
            letterSpacing: '0.08em',
          }}
        >
          {'// el código se escribe en tiempo real · cambia de tab para explorar cada categoría'}
        </motion.p>
      </main>

      {/* Status bar */}
      <footer className="cyber-statusbar" style={{ zIndex: 150 }}>
        <span className="cyber-statusbar-item">
          <span className="dot" />
          habilidades.tsx
        </span>
        <span className="cyber-statusbar-item">⬡ IDE mode</span>
        <span className="cyber-statusbar-item" style={{ marginLeft: 'auto' }}>
          TypeScript · 4 archivos
        </span>
      </footer>
    </>
  );
}
