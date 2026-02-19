// src/app/layout.tsx
import './css/style.css';
import './styles/animations.css';
import type { Metadata } from 'next';

export const metadata = {
  title: 'Hoja de vida — Julián Gutiérrez',
  description: 'Portafolio profesional de Julián Gutiérrez, Tecnólogo en Desarrollo de Software',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        {/* Fuentes */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}