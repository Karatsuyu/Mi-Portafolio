// src/app/layout.tsx
import './css/style.css';
import './styles/animations.css';
import './styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Hoja de vida — Julián Gutiérrez | Portfolio Rúnico',
  description: 'Portafolio profesional con diseño místico y rúnico de Julián Gutiérrez, Tecnólogo en Desarrollo de Software | Professional portfolio with mystical and runic design',
  alternates: {
    canonical: 'https://tu-dominio.com/runic',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@300;400;600&family=Noto+Sans+Runic&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}