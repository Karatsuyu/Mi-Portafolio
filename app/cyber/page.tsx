'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlitchHero    from '@/components/cyber/GlitchHero';
import FloatingPanels from '@/components/cyber/FloatingPanels';

// Carga dinámica (evita SSR para canvas)
const CodeParticles  = dynamic(() => import('@/components/cyber/CodeParticles'),  { ssr: false });
const HologramFigure = dynamic(() => import('@/components/cyber/HologramFigure'), { ssr: false });
const CustomCursor   = dynamic(() => import('@/components/cyber/CustomCursor'),   { ssr: false });

// ── Navbar del tema Cyber ────────────────────────────────────
function CyberNav() {
  return (
    <nav className="cyber-nav">
      <Link href="/cyber" className="cyber-nav-logo" aria-label="Inicio">
        TN.dev
      </Link>

      <ul className="cyber-nav-links">
        {[
          ['Proyectos',    '/cyber/proyectos'],
          ['Habilidades',  '/cyber/habilidades'],
          ['Formación',    '/cyber/formacion'],
          ['Certificados', '/cyber/certificados'],
          ['Contacto',     '/cyber/contacto'],
        ].map(([label, href]) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>

      {/* Selector de temas (vuelve a la raíz) */}
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'rgba(0,245,255,0.4)',
          letterSpacing: '0.12em',
          textDecoration: 'none',
          border: '1px solid rgba(0,245,255,0.15)',
          padding: '0.35rem 0.8rem',
          transition: 'color 0.2s, border-color 0.2s',
        }}
      >
        ⟵ temas
      </Link>
    </nav>
  );
}

// ── Status bar tipo IDE ──────────────────────────────────────
function StatusBar() {
  return (
    <motion.footer
      className="cyber-statusbar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      <span className="cyber-statusbar-item">
        <span className="dot" />
        online
      </span>
      <span className="cyber-statusbar-item">
        ⬡ cyber-portfolio v3.0
      </span>
      <span className="cyber-statusbar-item" style={{ marginLeft: 'auto' }}>
        next.js 13 · react 18 · three.js
      </span>
      <span className="cyber-statusbar-item">
        UTF-8
      </span>
      <span className="cyber-statusbar-item">
        TypeScript
      </span>
    </motion.footer>
  );
}

// ── Decoración: coordenadas tipo HUD ─────────────────────────
function HudDecorations() {
  return (
    <>
      {/* Esquina superior izquierda */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'fixed',
          top: '5rem',
          left: '2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(0,245,255,0.2)',
          lineHeight: 1.8,
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        <div>SYS: ONLINE</div>
        <div>LOC: 4.7110° N, 74.0721° W</div>
        <div>STACK: REACT / NODE / TS</div>
        <div>STATUS: OPEN_TO_WORK</div>
      </motion.div>

      {/* Esquina inferior izquierda */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          left: '2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(0,245,255,0.18)',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        © {new Date().getFullYear()} — ALL RIGHTS RESERVED
      </motion.div>

      {/* Líneas de esquina decorativas */}
      <CornerLines />
    </>
  );
}

function CornerLines() {
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 6,
    pointerEvents: 'none',
  };
  const lineH: React.CSSProperties = {
    position: 'absolute',
    height: '1px',
    width: '40px',
    background: 'rgba(0,245,255,0.3)',
  };
  const lineV: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '40px',
    background: 'rgba(0,245,255,0.3)',
  };

  return (
    <>
      {/* Top-left */}
      <div style={{ ...style, top: '4.5rem', left: '1.5rem' }}>
        <div style={{ ...lineH, top: 0, left: 0 }} />
        <div style={{ ...lineV, top: 0, left: 0 }} />
      </div>
      {/* Top-right */}
      <div style={{ ...style, top: '4.5rem', right: '1.5rem' }}>
        <div style={{ ...lineH, top: 0, right: 0 }} />
        <div style={{ ...lineV, top: 0, right: 0 }} />
      </div>
      {/* Bottom-left */}
      <div style={{ ...style, bottom: '2rem', left: '1.5rem' }}>
        <div style={{ ...lineH, bottom: 0, left: 0 }} />
        <div style={{ ...lineV, bottom: 0, left: 0 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ ...style, bottom: '2rem', right: '1.5rem' }}>
        <div style={{ ...lineH, bottom: 0, right: 0 }} />
        <div style={{ ...lineV, bottom: 0, right: 0 }} />
      </div>
    </>
  );
}

// ── Página principal ─────────────────────────────────────────
export default function CyberPage() {
  return (
    <>
      {/* Cursor custom */}
      <CustomCursor />

      {/* Vignette */}
      <div className="cyber-vignette" aria-hidden />

      {/* Lluvia de código (fondo) */}
      <CodeParticles />

      {/* Figura 3D central */}
      <HologramFigure />

      {/* Navbar */}
      <CyberNav />

      {/* Decoraciones HUD */}
      <HudDecorations />

      {/* Hero text (izquierda) */}
      <GlitchHero />

      {/* Paneles de navegación (derecha) */}
      <FloatingPanels />

      {/* Status bar (abajo) */}
      <StatusBar />
    </>
  );
}