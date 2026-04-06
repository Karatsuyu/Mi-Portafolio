'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TITLES = [
  'Full Stack Developer',
  'Software Engineer',
  'UI/UX Craftsman',
  'React Architect',
  'Node.js Engineer',
];

// Cambia esto por tu nombre real
const YOUR_NAME    = 'Tu Nombre';
const YOUR_DESC    = 'Construyendo interfaces que no olvidas y sistemas que escalan. Especializado en React, Node.js y experiencias 3D en la web.';
const YOUR_TAGLINE = '< portfolio v3.0 — cyber edition />';

export default function GlitchHero() {
  const [displayTitle, setDisplayTitle] = useState('');
  const [titleIdx, setTitleIdx]         = useState(0);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [charIdx, setCharIdx]           = useState(0);

  // Typewriter loop
  useEffect(() => {
    const target  = TITLES[titleIdx];
    const delay   = isDeleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayTitle(target.slice(0, charIdx + 1));
        if (charIdx + 1 === target.length) {
          // Pausa antes de borrar
          setTimeout(() => setIsDeleting(true), 1800);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplayTitle(target.slice(0, charIdx - 1));
        if (charIdx === 0) {
          setIsDeleting(false);
          setTitleIdx(i => (i + 1) % TITLES.length);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, titleIdx]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden:   { opacity: 0, y: 24 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="cyber-hero">
      <motion.div
        className="cyber-hero-text"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tagline pre-nombre */}
        <motion.p className="cyber-hero-label" variants={itemVariants}>
          {YOUR_TAGLINE}
        </motion.p>

        {/* Nombre con efecto glitch */}
        <motion.h1
          className="cyber-hero-name glitch"
          data-text={YOUR_NAME}
          variants={itemVariants}
        >
          {YOUR_NAME}
        </motion.h1>

        {/* Título con typewriter */}
        <motion.p className="cyber-hero-title" variants={itemVariants}>
          {displayTitle}
          <span className="typewriter-cursor" aria-hidden />
        </motion.p>

        {/* Descripción */}
        <motion.p className="cyber-hero-desc" variants={itemVariants}>
          {YOUR_DESC}
        </motion.p>

        {/* CTAs */}
        <motion.div className="cyber-hero-actions" variants={itemVariants}>
          <Link href="/cyber/proyectos" className="cyber-btn">
            Ver proyectos
          </Link>
          <Link
            href="/cyber/contacto"
            className="cyber-btn"
            style={{
              borderColor: 'rgba(0,255,136,0.3)',
              color: 'var(--green)',
            }}
          >
            $ contactar
          </Link>
        </motion.div>

        {/* Stats rápidas */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(0,245,255,0.08)',
          }}
        >
          {[
            { value: '3+', label: 'años exp.' },
            { value: '20+', label: 'proyectos' },
            { value: '∞',   label: 'café' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                color: 'var(--cyan)',
                fontWeight: 700,
                textShadow: 'var(--glow-cyan)',
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}