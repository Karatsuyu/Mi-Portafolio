'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CONTACT } from '@/components/cyber/contacto/ContactData';

const TerminalCLI  = dynamic(() => import('@/components/cyber/contacto/TerminalCLI'),  { ssr: false });
const CustomCursor = dynamic(() => import('@/components/cyber/CustomCursor'),            { ssr: false });

// ── Panel lateral de info ────────────────────────────────────
function InfoPanel() {
  const links = [
    { label: 'Email',    value: CONTACT.email,    href: `mailto:${CONTACT.email}`,  color: 'var(--cyan)'   },
    { label: 'LinkedIn', value: 'linkedin.com/in/tuusuario', href: CONTACT.linkedin, color: '#0a66c2'      },
    { label: 'GitHub',   value: 'github.com/tuusuario',       href: CONTACT.github,   color: 'var(--green)' },
    ...(CONTACT.twitter ? [{ label: 'Twitter', value: 'twitter.com/tuusuario', href: CONTACT.twitter, color: '#1da1f2' }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Status badge */}
      <div style={{
        padding: '1rem 1.1rem',
        background: CONTACT.available
          ? 'rgba(0,255,136,0.05)'
          : 'rgba(240,224,64,0.05)',
        border: `1px solid ${CONTACT.available ? 'rgba(0,255,136,0.2)' : 'rgba(240,224,64,0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
      }}>
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: CONTACT.available ? '#00ff88' : '#f0e040',
          boxShadow: CONTACT.available ? '0 0 8px #00ff88' : '0 0 8px #f0e040',
          animation: 'pulse-dot 2s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: CONTACT.available ? '#00ff88' : '#f0e040',
            letterSpacing: '0.08em',
          }}>
            {CONTACT.available ? 'DISPONIBLE' : 'NO DISPONIBLE'}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(200,216,232,0.3)',
            marginTop: '0.15rem',
          }}>
            {CONTACT.available ? 'Abierto a oportunidades' : 'Actualmente ocupado'}
          </div>
        </div>
      </div>

      {/* Info básica */}
      <div style={{
        padding: '1rem 1.1rem',
        background: 'rgba(8,12,20,0.7)',
        border: '1px solid rgba(0,245,255,0.07)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(200,216,232,0.2)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          // whois
        </p>

        {[
          { label: 'Nombre',    value: CONTACT.name     },
          { label: 'Rol',       value: CONTACT.role     },
          { label: 'Ubicación', value: CONTACT.location },
          { label: 'Timezone',  value: CONTACT.timezone },
          { label: 'Respuesta', value: CONTACT.responseTime },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.5rem',
            paddingBottom: '0.45rem',
            marginBottom: '0.45rem',
            borderBottom: '1px solid rgba(200,216,232,0.04)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
          }}>
            <span style={{ color: 'rgba(200,216,232,0.25)', flexShrink: 0 }}>{row.label}</span>
            <span style={{ color: 'rgba(200,216,232,0.6)', textAlign: 'right' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Links directos */}
      <div style={{
        padding: '1rem 1.1rem',
        background: 'rgba(8,12,20,0.7)',
        border: '1px solid rgba(0,245,255,0.07)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(200,216,232,0.2)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          // links directos
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              data-cursor-hover
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.63rem',
                color: link.color,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                background: `${link.color}08`,
                border: `1px solid ${link.color}18`,
                transition: 'background 0.18s, border-color 0.18s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${link.color}14`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${link.color}35`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${link.color}08`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${link.color}18`;
              }}
            >
              <span>{link.label}</span>
              <span style={{ opacity: 0.5, fontSize: '0.6rem' }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Hint de comandos */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(0,245,255,0.02)',
        border: '1px solid rgba(0,245,255,0.06)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'rgba(200,216,232,0.2)',
        lineHeight: 1.9,
      }}>
        <div style={{ color: 'rgba(0,245,255,0.3)', marginBottom: '0.4rem' }}>// comandos rápidos</div>
        {[
          ['help',       'ver todos los comandos'],
          ['--info',     'mi información'],
          ['--available','disponibilidad'],
          ['--send',     '"mensaje"  →  contactar'],
          ['↑ / ↓',      'historial de comandos'],
          ['Tab',        'autocompletar'],
        ].map(([cmd, desc]) => (
          <div key={cmd} style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: 'rgba(0,245,255,0.45)', minWidth: '5.5rem', flexShrink: 0 }}>{cmd}</span>
            <span>{desc}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Página ───────────────────────────────────────────────────
export default function ContactoPage() {
  return (
    <>
      <CustomCursor />

      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 }} />

      {/* Grid fondo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(168,85,247,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168,85,247,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '45px 45px',
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
            ['Formación',    '/cyber/formacion'],
            ['Certificados', '/cyber/certificados'],
          ].map(([l, h]) => (
            <li key={h}><Link href={h}>{l}</Link></li>
          ))}
        </ul>
      </nav>

      {/* Main */}
      <main style={{
        position: 'relative', zIndex: 10,
        paddingTop: '5.5rem', paddingBottom: '5rem',
        paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
        paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
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
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.15em', color: 'rgba(168,85,247,0.5)',
            textTransform: 'uppercase', marginBottom: '0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ color: 'rgba(200,216,232,0.2)' }}>~/portfolio</span>
            <span>/</span>contacto
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: 900, color: '#fff',
            lineHeight: 0.95, letterSpacing: '-0.02em',
            marginBottom: '0.6rem',
          }}>
            CONTACTO
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            color: 'rgba(200,216,232,0.35)', lineHeight: 1.6,
            maxWidth: '480px',
          }}>
            Terminal CLI interactivo — escribe{' '}
            <span style={{ color: 'var(--cyan)' }}>help</span>
            {' '}para empezar o{' '}
            <span style={{ color: 'var(--green)' }}>--send "tu mensaje"</span>
            {' '}para contactar directo
          </p>
        </motion.div>

        {/* Layout: terminal + panel */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr min(300px, 30%)',
          gap: '1.5rem',
          minHeight: 'clamp(420px, 60vh, 680px)',
          alignItems: 'start',
        }}>
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 'clamp(420px, 60vh, 680px)' }}
          >
            <TerminalCLI />
          </motion.div>

          {/* Info lateral */}
          <InfoPanel />
        </div>

        {/* Nota pie */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(200,216,232,0.12)', textAlign: 'center',
            marginTop: '1.5rem', letterSpacing: '0.08em',
          }}
        >
          // también puedes usar los links directos del panel · el terminal guarda historial de sesión
        </motion.p>
      </main>

      {/* Status bar */}
      <footer className="cyber-statusbar" style={{ zIndex: 150 }}>
        <span className="cyber-statusbar-item">
          <span className="dot" />contacto.tsx
        </span>
        <span className="cyber-statusbar-item">⬡ terminal CLI</span>
        <span className="cyber-statusbar-item" style={{ marginLeft: 'auto' }}>
          {CONTACT.available ? '● disponible' : '○ ocupado'} · {CONTACT.timezone}
        </span>
      </footer>
    </>
  );
}
