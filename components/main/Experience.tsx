"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { slideInFromLeft, slideInFromTop } from '@/utils/motion';
import Timeline from '@/components/shared/Timeline';

export default function Experience() {
  return (
    <section
      id="experiencia"
      className="flex flex-col items-center justify-center py-20 relative overflow-hidden"
    >
      {/* Fondo con efecto de partículas */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />
      </div>

      <div className="w-full max-w-7xl px-6 z-10">
        {/* Header de la sección */}
        <motion.div
          variants={slideInFromTop}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center mb-12"
        >
          <div className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-2">
            Timeline
          </div>
          <h2 className="text-5xl md:text-6xl font-thin text-white/90 mb-4">
            Experiencia
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <p className="text-gray-400 text-center mt-6 max-w-2xl">
            Recorrido cronológico de proyectos desarrollados desde 2023 hasta 2024.
            Haz clic en cada proyecto para ver detalles completos.
          </p>
        </motion.div>

        {/* Timeline horizontal */}
        <motion.div
          variants={slideInFromLeft(0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Timeline variant="space" />
        </motion.div>
      </div>
    </section>
  );
}
