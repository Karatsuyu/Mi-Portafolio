'use client';

import { useRef, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import type { Project } from './ProjectsData';

interface Props {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

export default function ProjectCard3D({ project, index, onSelect }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs para el tilt 3D suave
  const rotX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotY = useSpring(0, { stiffness: 180, damping: 22 });
  const glowOpacity = useSpring(0, { stiffness: 120, damping: 20 });
  const liftY = useSpring(0, { stiffness: 200, damping: 25 });

  // Transformaciones derivadas
  const boxShadow = useTransform(
    glowOpacity,
    [0, 1],
    [
      '0 4px 24px rgba(0,0,0,0.4)',
      `0 20px 60px ${project.accent}30, 0 0 40px ${project.accent}18, inset 0 0 30px ${project.accent}06`,
    ]
  );

  const borderColor = useTransform(
    glowOpacity,
    [0, 1],
    [`${project.accent}18`, `${project.accent}55`]
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current!;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    rotX.set(-dy * 14);
    rotY.set(dx * 14);
    glowOpacity.set(1);
    liftY.set(-12);
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    glowOpacity.set(0);
    liftY.set(0);
    setIsHovered(false);
  };

  // Animación de entrada escalonada
  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        delay: index * 0.09,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => onSelect(project)}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          y: liftY,
          boxShadow,
          borderColor,
          transformStyle: 'preserve-3d',
          position: 'relative',
          background: 'rgba(8,12,20,0.85)',
          border: '1px solid',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          cursor: 'none',
          overflow: 'hidden',
          borderRadius: 0,
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
        data-cursor-hover
      >
        {/* Esquina cortada decorativa */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 17px 17px 0',
          borderColor: `transparent ${project.accent}88 transparent transparent`,
          zIndex: 3,
        }} />

        {/* Línea de scan animada al hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ top: '-2px', opacity: 0.8 }}
              animate={{ top: '102%', opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'linear' }}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
                zIndex: 4,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Glow background interior */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 0%, ${project.accent}08 0%, transparent 65%)`,
            opacity: glowOpacity,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Contenido */}
        <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem' }}>

          {/* Header: categoría + año */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: project.accent,
              background: `${project.accent}12`,
              border: `1px solid ${project.accent}30`,
              padding: '0.2rem 0.6rem',
            }}>
              {project.category}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(200,216,232,0.3)',
            }}>
              {project.year}
            </span>
          </div>

          {/* Título */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.02em',
            marginBottom: '0.3rem',
            lineHeight: 1.2,
          }}>
            {project.title}
          </h3>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: project.accent,
            opacity: 0.7,
            marginBottom: '0.85rem',
            letterSpacing: '0.05em',
          }}>
            {project.subtitle}
          </p>

          {/* Descripción */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'rgba(200,216,232,0.55)',
            lineHeight: 1.7,
            marginBottom: '1rem',
          }}>
            {project.description}
          </p>

          {/* Stack pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginBottom: '1rem',
          }}>
            {project.stack.slice(0, 4).map(tech => (
              <span key={tech} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.57rem',
                color: 'rgba(200,216,232,0.5)',
                background: 'rgba(200,216,232,0.05)',
                border: '1px solid rgba(200,216,232,0.1)',
                padding: '0.15rem 0.5rem',
              }}>
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.57rem',
                color: 'rgba(200,216,232,0.3)',
                padding: '0.15rem 0.5rem',
              }}>
                +{project.stack.length - 4}
              </span>
            )}
          </div>

          {/* Métricas (si tiene) */}
          {project.metrics && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(200,216,232,0.06)',
              marginBottom: '1rem',
            }}>
              {project.metrics.map(m => (
                <div key={m.label}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    color: project.accent,
                    fontWeight: 700,
                    textShadow: `0 0 12px ${project.accent}66`,
                  }}>
                    {m.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    color: 'rgba(200,216,232,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: project.accent,
              letterSpacing: '0.1em',
            }}
          >
            <span>Ver proyecto</span>
            <motion.span
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ——→
            </motion.span>
          </motion.div>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '-2rem',
            transform: 'rotate(-45deg)',
            background: project.accent,
            color: '#000',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '0.25rem 2.5rem',
            zIndex: 5,
          }}>
            FEATURED
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}