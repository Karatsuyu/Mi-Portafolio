'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { CERT_CATEGORY_COLORS, type Certificado } from './CertificadosData';

interface Props {
  cert: Certificado;
  index: number;
  onSelect: (c: Certificado) => void;
}

export default function HologramCard({ cert, index, onSelect }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 }); // 0–1

  // Springs para tilt 3D
  const rotX   = useSpring(0, { stiffness: 160, damping: 18 });
  const rotY   = useSpring(0, { stiffness: 160, damping: 18 });
  const liftY  = useSpring(0, { stiffness: 200, damping: 22 });
  const glow   = useSpring(0, { stiffness: 100, damping: 20 });
  const holoOp = useSpring(0, { stiffness: 80,  damping: 18 });

  // Sombra dinámica según color de categoría
  const catColor = CERT_CATEGORY_COLORS[cert.category];
  const boxShadow = useTransform(
    glow,
    [0, 1],
    [
      '0 4px 30px rgba(0,0,0,0.5)',
      `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${cert.holoColors[0]}28, 0 0 80px ${cert.holoColors[1]}12`,
    ]
  );

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current!;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;   // 0–1
    const ny = (e.clientY - rect.top)  / rect.height;  // 0–1
    const dx = nx - 0.5;
    const dy = ny - 0.5;

    rotX.set(-dy * 18);
    rotY.set( dx * 18);
    liftY.set(-14);
    glow.set(1);
    holoOp.set(1);
    setMousePos({ x: nx, y: ny });
    setHovered(true);
  }, [rotX, rotY, liftY, glow, holoOp]);

  const onMouseLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    liftY.set(0);
    glow.set(0);
    holoOp.set(0);
    setMousePos({ x: 0.5, y: 0.5 });
    setHovered(false);
  }, [rotX, rotY, liftY, glow, holoOp]);

  // Gradiente holográfico que sigue al cursor
  // Simula el efecto prisma de las tarjetas holográficas reales
  const holoGradient = `
    radial-gradient(
      circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
      ${cert.holoColors[0]}55 0%,
      ${cert.holoColors[1]}33 25%,
      ${cert.holoColors[2]}22 50%,
      transparent 70%
    ),
    linear-gradient(
      ${105 + mousePos.x * 60}deg,
      ${cert.holoColors[0]}18 0%,
      ${cert.holoColors[1]}28 33%,
      ${cert.holoColors[2]}18 66%,
      ${cert.holoColors[0]}10 100%
    )
  `;

  // Brillo especular (punto de luz)
  const specularX = mousePos.x * 100;
  const specularY = mousePos.y * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 700 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => onSelect(cert)}
        data-cursor-hover
        style={{
          rotateX: rotX,
          rotateY: rotY,
          y: liftY,
          boxShadow,
          position: 'relative',
          background: 'rgba(10,14,24,0.92)',
          border: `1px solid ${catColor}20`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          cursor: 'none',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        }}
      >
        {/* ── Capa holográfica (efecto prisma) ────────────── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: holoGradient,
            opacity: holoOp,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 2,
            transition: 'background 0.05s',
          }}
        />

        {/* ── Brillo especular (punto de luz) ─────────────── */}
        <motion.div
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)`,
            left: `${specularX}%`,
            top:  `${specularY}%`,
            transform: 'translate(-50%, -50%)',
            opacity: holoOp,
            pointerEvents: 'none',
            zIndex: 3,
            transition: 'left 0.05s, top 0.05s',
          }}
        />

        {/* ── Línea de scan (hover) ────────────────────────── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ top: '-2px', opacity: 0.6 }}
              animate={{ top: '102%', opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'linear' }}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${cert.holoColors[0]}cc, ${cert.holoColors[1]}cc, transparent)`,
                zIndex: 4,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Esquina decorativa ───────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 15px 15px 0',
          borderColor: `transparent ${catColor}60 transparent transparent`,
          zIndex: 5,
        }} />

        {/* ── Contenido ────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 6, padding: '1.25rem' }}>

          {/* Header: avatar emisor + categoría */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            {/* Avatar del emisor */}
            <div style={{
              width: 44, height: 44,
              background: `linear-gradient(135deg, ${cert.holoColors[0]}22, ${cert.holoColors[1]}22)`,
              border: `1px solid ${cert.holoColors[0]}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '0.62rem',
              fontWeight: 700,
              color: cert.holoColors[0],
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}>
              {cert.issuerShort}
            </div>

            {/* Badge de categoría */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: catColor,
              background: `${catColor}12`,
              border: `1px solid ${catColor}25`,
              padding: '0.2rem 0.55rem',
            }}>
              {cert.category}
            </span>
          </div>

          {/* Título */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: hovered ? '#fff' : 'rgba(255,255,255,0.85)',
            letterSpacing: '0.02em',
            lineHeight: 1.25,
            marginBottom: '0.3rem',
            transition: 'color 0.2s',
          }}>
            {cert.title}
          </h3>

          {/* Emisor */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: cert.holoColors[0],
            opacity: 0.7,
            marginBottom: '0.75rem',
            letterSpacing: '0.04em',
          }}>
            {cert.issuer}
          </p>

          {/* Descripción (truncada) */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'rgba(200,216,232,0.4)',
            lineHeight: 1.6,
            marginBottom: '0.85rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {cert.description}
          </p>

          {/* Skills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3rem',
            marginBottom: '0.9rem',
          }}>
            {cert.skills.slice(0, 4).map(s => (
              <span key={s} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: 'rgba(200,216,232,0.45)',
                background: 'rgba(200,216,232,0.05)',
                border: '1px solid rgba(200,216,232,0.08)',
                padding: '0.12rem 0.45rem',
              }}>
                {s}
              </span>
            ))}
          </div>

          {/* Footer: fecha + indicador de verificación */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.65rem',
            borderTop: `1px solid rgba(200,216,232,0.06)`,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(200,216,232,0.25)',
            }}>
              {cert.date}
              {cert.expiry && (
                <span style={{ opacity: 0.6 }}> · válido hasta {cert.expiry}</span>
              )}
            </div>

            {cert.verifyUrl ? (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: cert.holoColors[0],
                opacity: 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <span style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: '#00ff88',
                  display: 'inline-block',
                  boxShadow: '0 0 5px #00ff88',
                }} />
                verificable
              </span>
            ) : (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: 'rgba(200,216,232,0.2)',
              }}>
                completado
              </span>
            )}
          </div>
        </div>

        {/* Featured ribbon */}
        {cert.featured && (
          <div style={{
            position: 'absolute',
            top: '1.1rem',
            left: '-2.2rem',
            transform: 'rotate(-45deg)',
            background: `linear-gradient(90deg, ${cert.holoColors[0]}, ${cert.holoColors[1]})`,
            color: '#000',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '0.2rem 2.5rem',
            zIndex: 7,
          }}>
            FEATURED
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
