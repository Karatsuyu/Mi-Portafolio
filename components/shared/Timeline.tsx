"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_TIMELINE, ProjectTimeline } from '@/constants/projects';

interface TimelineProps {
  variant?: 'space' | 'classic' | 'runic' | 'cyber';
  onProjectClick?: (project: ProjectTimeline) => void;
}

export default function Timeline({ variant = 'space', onProjectClick }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`timeline-wrapper timeline-${variant}`}>
      {/* Botones de navegación */}
      <button 
        className="timeline-nav timeline-nav-left"
        onClick={() => handleScroll('left')}
        aria-label="Scroll izquierda"
      >
        ‹
      </button>
      <button 
        className="timeline-nav timeline-nav-right"
        onClick={() => handleScroll('right')}
        aria-label="Scroll derecha"
      >
        ›
      </button>

      {/* Timeline horizontal */}
      <div className="timeline-container" ref={scrollRef}>
        <div className="timeline-track">
          {PROJECTS_TIMELINE.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="timeline-item"
              onClick={() => onProjectClick?.(project)}
            >
              {/* Punto en la línea */}
              <div className="timeline-dot" style={{ backgroundColor: project.hexColor }} />
              
              {/* Tarjeta del proyecto */}
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <span className="timeline-year" style={{ color: project.hexColor }}>
                    {project.year}
                  </span>
                  <span className="timeline-num">{project.num}</span>
                </div>
                
                <h3 className="timeline-title">{project.title}</h3>
                <p className="timeline-subtitle">{project.subtitle}</p>
                
                {/* Stack técnico resumido */}
                <div className="timeline-tech">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="timeline-tech-badge">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="timeline-tech-more">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                {/* Link al proyecto */}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver proyecto →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
