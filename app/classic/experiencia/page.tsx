"use client";

import Timeline from '@/components/shared/Timeline';

export default function ClassicExperiencia() {
  return (
    <section className="section">
      <h2>Experiencia de Proyectos</h2>
      <p className="subtitle">
        Timeline cronológico de proyectos desarrollados desde 2023 hasta 2024
      </p>
      <br />
      <p>
        A continuación se presenta un recorrido visual de los proyectos más relevantes que he desarrollado,
        ordenados cronológicamente desde el más antiguo al más reciente. Cada proyecto representa un desafío
        técnico y una oportunidad de aprendizaje que ha contribuido a mi formación como desarrollador full-stack.
      </p>
      <br />
      
      <Timeline variant="classic" />
      
      <br />
      <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
        💡 Haz clic en "Ver proyecto →" para acceder al repositorio en GitHub
      </p>
    </section>
  );
}
