import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tu Nombre — Cyber Portfolio',
  description: 'Full Stack Developer · React · Node.js · Three.js',
  openGraph: {
    title: 'Tu Nombre — Cyber Portfolio',
    description: 'Full Stack Developer · Cyber Edition',
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