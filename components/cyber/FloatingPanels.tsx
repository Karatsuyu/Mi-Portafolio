'use client';

import { useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

const PANELS = [
  {
    href:  '/cyber/proyectos',
    icon:  '⬡',
    name:  'Proyectos',
    desc:  'Cards 3D interactivas',
    line:  '01',
    color: 'var(--cyan)',
  },
  {
    href:  '/cyber/habilidades',
    icon:  '</>',
    name:  'Habilidades',
    desc:  'IDE live code editor',
    line:  '02',
    color: 'var(--green)',
  },
  {
    href:  '/cyber/formacion',
    icon:  'git',
    name:  'Formación',
    desc:  'Git timeline history',
    line:  '03',
    color: 'var(--purple2)',
  },
  {
    href:  '/cyber/certificados',
    icon:  '◈',
    name:  'Certificados',
    desc:  'Hologram vault 3D',
    line:  '04',
    color: 'var(--yellow)',
  },
  {
    href:  '/cyber/contacto',
    icon:  '$_',
    name:  'Contacto',
    desc:  'Terminal CLI',
    line:  '05',
    color: 'var(--red-neon)',
  },
];

// Panel individual con tilt 3D basado en posición del mouse
function PanelCard({ panel, index }: { panel: typeof PANELS[0]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Springs para tilt suave
  const rotX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotY = useSpring(0, { stiffness: 200, damping: 20 });
  const glow = useSpring(0, { stiffness: 150, damping: 25 });

  const boxShadow = useTransform(
    glow,
    [0, 1],
    ['0 0 0px transparent', `0 0 24px ${panel.color}33, inset 0 0 20px ${panel.color}08`]
  );

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);

    rotX.set(-dy * 12);
    rotY.set( dx * 12);
    glow.set(1);
  };

  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    glow.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={panel.href}
      className="cyber-panel"
      style={{
        rotateX: rotX,
        rotateY: rotY,
        boxShadow,
        borderColor: `${panel.color}22`,
        transformStyle: 'preserve-3d',
        perspective: 400,
      }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay:    0.4 + index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ x: -8 }}
    >
      <span
        className="cyber-panel-number"
        style={{ color: `${panel.color}55` }}
      >
        {panel.line}
      </span>

      <span
        className="cyber-panel-icon"
        style={{
          color: panel.color,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          textShadow: `0 0 10px ${panel.color}88`,
        }}
      >
        {panel.icon}
      </span>

      <span
        className="cyber-panel-name"
        style={{ color: panel.color }}
      >
        {panel.name}
      </span>

      <span className="cyber-panel-desc">{panel.desc}</span>

      {/* Línea decorativa inferior */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: '1px',
          background: panel.color,
          opacity: 0.4,
        }}
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}

export default function FloatingPanels() {
  return (
    <nav className="cyber-panel-container" aria-label="Secciones">
      {PANELS.map((panel, i) => (
        <PanelCard key={panel.href} panel={panel} index={i} />
      ))}
    </nav>
  );
}