'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import ExperienciaCyber from '@/components/cyber/experiencia/ExperienciaCyber';

// Carga dinámica para componentes que usan canvas/three.js
const CodeParticles = dynamic(() => import('@/components/cyber/CodeParticles'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/cyber/CustomCursor'), { ssr: false });

// ── Navbar del tema Cyber ────────────────────────────────────
function CyberNav() {
  return (
    <nav className="cyber-nav">
      <Link href="/cyber" className="cyber-nav-logo" aria-label="Inicio">
        TN.dev
      </Link>

      <ul className="cyber-nav-links">
        {[
          ['Proyectos', '/cyber/proyectos'],
          ['Experiencia', '/cyber/experiencia'],
          ['Habilidades', '/cyber/habilidades'],
          ['Formación', '/cyber/formacion'],
          ['Certificados', '/cyber/certificados'],
          ['Contacto', '/cyber/contacto'],
        ].map(([label, href]) => (
          <li key={href}>
            <Link href={href} className={href === '/cyber/experiencia' ? 'active' : ''}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

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

export default function ExperienciaPage() {
  return (
    <>
      <CustomCursor />
      <div className="cyber-vignette" aria-hidden />
      <CodeParticles />
      <CyberNav />
      
      <main style={{ paddingTop: '5rem', minHeight: '100vh' }}>
        <ExperienciaCyber />
      </main>
    </>
  );
}
