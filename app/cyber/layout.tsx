import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Julián Gutiérrez — Cyber Portfolio | Desarrollador Full-Stack',
  description: 'Portafolio cyberpunk con estética neon - Full Stack Developer especializado en React, Node.js y Three.js | Cyberpunk portfolio with neon aesthetics',
  openGraph: {
    title: 'Julián Gutiérrez — Cyber Portfolio',
    description: 'Full Stack Developer · Cyber Edition · Estética Cyberpunk',
  },
  alternates: {
    canonical: 'https://tu-dominio.com/cyber',
  },
};

export default function CyberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Importa el CSS solo para esta ruta */}
      <div className="cyber-root">
        {children}
      </div>
    </>
  );
}