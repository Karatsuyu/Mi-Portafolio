'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  CERTIFICADOS,
  CERT_CATEGORIES,
  CERT_CATEGORY_COLORS,
  type Certificado,
} from '@/components/cyber/certificados/CertificadosData';

const HologramCard = dynamic(
  () => import('@/components/cyber/certificados/HologramCard'),
  { ssr: false }
);
const CustomCursor = dynamic(() => import('@/components/cyber/CustomCursor'), { ssr: false });

// ── Panel de detalle ─────────────────────────────────────────
function CertDetail({
  cert,
  onClose,
}: {
  cert: Certificado;
  onClose: () => void;
}) {
  const catColor = CERT_CATEGORY_COLORS[cert.category];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 'min(480px, 92vw)',
        background: 'rgba(6,10,16,0.97)',
        borderLeft: `1px solid ${cert.holoColors[0]}25`,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        zIndex: 200,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: 'sticky', top: 0, flexShrink: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${cert.holoColors[0]}, ${cert.holoColors[1]}, transparent)`,
      }} />

      <div style={{ padding: '1.75rem', flex: 1 }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          data-cursor-hover
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'rgba(200,216,232,0.35)',
            background: 'transparent',
            border: '1px solid rgba(200,216,232,0.1)',
            padding: '0.38rem 0.9rem',
            cursor: 'none',
            marginBottom: '1.75rem',
            letterSpacing: '0.1em',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = cert.holoColors[0];
            (e.currentTarget as HTMLButtonElement).style.borderColor = cert.holoColors[0] + '40';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,216,232,0.35)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,216,232,0.1)';
          }}
        >
          ✕ cerrar
        </button>

        {/* Avatar grande + info */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{
            width: 64, height: 64, flexShrink: 0,
            background: `linear-gradient(135deg, ${cert.holoColors[0]}20, ${cert.holoColors[1]}20)`,
            border: `1px solid ${cert.holoColors[0]}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem', fontWeight: 700,
            color: cert.holoColors[0],
            letterSpacing: '0.06em',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Mini holo effect en el avatar */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${cert.holoColors[0]}15, ${cert.holoColors[1]}10, ${cert.holoColors[2]}08)`,
              animation: 'holoShift 3s ease infinite',
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>{cert.issuerShort}</span>
          </div>

          <div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: catColor,
              background: `${catColor}12`,
              border: `1px solid ${catColor}25`,
              padding: '0.18rem 0.55rem',
              display: 'inline-block',
              marginBottom: '0.5rem',
            }}>
              {cert.category}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '0.3rem',
            }}>
              {cert.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: cert.holoColors[0],
              opacity: 0.65,
            }}>
              {cert.issuer}
            </p>
          </div>
        </div>

        {/* Divisor holográfico */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, ${cert.holoColors[0]}40, ${cert.holoColors[1]}20, transparent)`,
          marginBottom: '1.25rem',
        }} />

        {/* Descripción */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.73rem',
          color: 'rgba(200,216,232,0.6)',
          lineHeight: 1.8,
          marginBottom: '1.5rem',
        }}>
          {cert.description}
        </p>

        {/* Skills */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(200,216,232,0.22)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.65rem',
          }}>
            Habilidades validadas
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {cert.skills.map(s => (
              <span key={s} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.63rem',
                color: cert.holoColors[0],
                background: `${cert.holoColors[0]}0e`,
                border: `1px solid ${cert.holoColors[0]}28`,
                padding: '0.28rem 0.7rem',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Credential info */}
        <div style={{
          background: 'rgba(200,216,232,0.03)',
          border: '1px solid rgba(200,216,232,0.07)',
          padding: '1rem',
          marginBottom: '1.25rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(200,216,232,0.22)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '0.65rem',
          }}>
            Credencial
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {[
              { label: 'Emisor',       val: cert.issuer                  },
              { label: 'Fecha',        val: cert.date                    },
              { label: 'Vencimiento',  val: cert.expiry ?? 'No expira'   },
              { label: 'ID',           val: cert.credentialId ?? '—'     },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.63rem',
                borderBottom: '1px solid rgba(200,216,232,0.04)',
                paddingBottom: '0.4rem',
              }}>
                <span style={{ color: 'rgba(200,216,232,0.25)' }}>{row.label}</span>
                <span style={{ color: 'rgba(200,216,232,0.6)' }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón verificar */}
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: '#000',
              background: `linear-gradient(90deg, ${cert.holoColors[0]}, ${cert.holoColors[1]})`,
              textDecoration: 'none',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              transition: 'opacity 0.2s',
            }}
          >
            ↗ Verificar credencial
          </a>
        )}
      </div>

      <style>{`
        @keyframes holoShift {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1;   }
        }
      `}</style>
    </motion.div>
  );
}

// ── Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(3,4,10,0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 190, cursor: 'none',
      }}
    />
  );
}

// ── Filtros ──────────────────────────────────────────────────
function Filters({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
      {CERT_CATEGORIES.map(cat => {
        const isActive = active === cat.key;
        const color = cat.key === 'all'
          ? 'var(--cyan)'
          : CERT_CATEGORY_COLORS[cat.key as Certificado['category']] ?? 'var(--cyan)';

        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            data-cursor-hover
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isActive ? '#000' : color,
              background: isActive ? color : 'transparent',
              border: `1px solid ${isActive ? color : color + '30'}`,
              padding: '0.38rem 0.9rem',
              cursor: 'none',
              transition: 'all 0.18s',
              clipPath: 'polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)',
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Stats ────────────────────────────────────────────────────
function VaultStats() {
  const total      = CERTIFICADOS.length;
  const verified   = CERTIFICADOS.filter(c => c.verifyUrl).length;
  const featured   = CERTIFICADOS.filter(c => c.featured).length;
  const categories = new Set(CERTIFICADOS.map(c => c.category)).size;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: '1px',
      background: 'rgba(0,245,255,0.06)',
      border: '1px solid rgba(0,245,255,0.07)',
      marginBottom: '2rem',
    }}>
      {[
        { label: 'Certificados', value: total,      color: 'var(--cyan)'   },
        { label: 'Verificables', value: verified,   color: 'var(--green)'  },
        { label: 'Destacados',   value: featured,   color: 'var(--yellow)' },
        { label: 'Categorías',   value: categories, color: 'var(--purple2)'},
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.07, duration: 0.45 }}
          style={{
            background: 'rgba(8,12,20,0.9)',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem,2.5vw,1.6rem)',
            fontWeight: 900,
            color: s.color as string,
            textShadow: `0 0 14px ${s.color as string}55`,
          }}>
            {s.value}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.56rem',
            color: 'rgba(200,216,232,0.22)',
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

// ── Página ───────────────────────────────────────────────────
export default function CertificadosPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<Certificado | null>(null);

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? CERTIFICADOS
      : CERTIFICADOS.filter(c => c.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      <CustomCursor />

      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 }} />

      {/* Partículas de luz flotantes (CSS puro) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 2, height: 2,
              borderRadius: '50%',
              background: ['#00f5ff', '#00ff88', '#a855f7', '#f0e040'][i % 4],
              left:   `${5 + (i * 17) % 90}%`,
              top:    `${10 + (i * 23) % 80}%`,
              opacity: 0.4,
              animation: `floatDot ${4 + (i % 4)}s ease-in-out ${i * 0.4}s infinite alternate`,
              boxShadow: `0 0 4px ${['#00f5ff','#00ff88','#a855f7','#f0e040'][i % 4]}`,
            }}
          />
        ))}
      </div>

      <div className="cyber-vignette" />

      {/* Grid fondo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* CSS para partículas */}
      <style>{`
        @keyframes floatDot {
          from { transform: translateY(0px) scale(1);   }
          to   { transform: translateY(-18px) scale(1.4); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="cyber-nav" style={{ zIndex: 100 }}>
        <Link href="/cyber" className="cyber-nav-logo">TN.dev</Link>
        <ul className="cyber-nav-links">
          {[
            ['← Inicio',    '/cyber'],
            ['Proyectos',   '/cyber/proyectos'],
            ['Habilidades', '/cyber/habilidades'],
            ['Formación',   '/cyber/formacion'],
            ['Contacto',    '/cyber/contacto'],
          ].map(([l, h]) => (
            <li key={h}><Link href={h}>{l}</Link></li>
          ))}
        </ul>
      </nav>

      {/* Main */}
      <main style={{
        position: 'relative', zIndex: 10,
        paddingTop: '5.5rem', paddingBottom: '5rem',
        paddingLeft: 'clamp(1.5rem,5vw,4rem)',
        paddingRight: 'clamp(1.5rem,5vw,4rem)',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          style={{ marginBottom: '1.75rem' }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.15em', color: 'rgba(0,245,255,0.4)',
            textTransform: 'uppercase', marginBottom: '0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ color: 'rgba(200,216,232,0.2)' }}>~/portfolio</span>
            <span>/</span>certificados
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem,5vw,3.5rem)',
            fontWeight: 900, color: '#fff',
            lineHeight: 0.95, letterSpacing: '-0.02em',
            marginBottom: '0.6rem',
          }}>
            CERTIFICADOS
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            color: 'rgba(200,216,232,0.35)', lineHeight: 1.6,
            maxWidth: '500px',
          }}>
            Hologram vault — pasa el cursor sobre las tarjetas para activar el efecto prisma
          </p>
        </motion.div>

        <VaultStats />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Filters active={activeCategory} onChange={setActiveCategory} />
        </motion.div>

        {/* Grid de tarjetas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.1rem',
            }}
          >
            {filtered.map((cert, i) => (
              <HologramCard
                key={cert.id}
                cert={cert}
                index={i}
                onSelect={setSelected}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'rgba(200,216,232,0.18)', textAlign: 'center',
            padding: '4rem 0',
          }}>
            // no certificates in this category
          </p>
        )}
      </main>

      {/* Panel detalle */}
      <AnimatePresence>
        {selected && (
          <>
            <Backdrop onClick={() => setSelected(null)} />
            <CertDetail cert={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>

      <footer className="cyber-statusbar" style={{ zIndex: 150 }}>
        <span className="cyber-statusbar-item">
          <span className="dot" />hologram-vault.tsx
        </span>
        <span className="cyber-statusbar-item">⬡ {filtered.length} certificados</span>
        <span className="cyber-statusbar-item" style={{ marginLeft: 'auto' }}>
          {activeCategory !== 'all' ? `filter: ${activeCategory}` : 'all categories'}
        </span>
      </footer>
    </>
  );
}
