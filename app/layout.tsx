import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "@/components/global/LayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://tu-dominio.com'), // TODO: Reemplazar con tu dominio real
  title: {
    default: 'Julián Estiven Gutiérrez | Tecnólogo en Desarrollo de Software',
    template: '%s | Julián Gutiérrez'
  },
  description: 'Portafolio profesional de Julián Estiven Gutiérrez Tabares - Tecnólogo en Desarrollo de Software especializado en desarrollo Full-Stack con React, Next.js, Node.js, Python y Django. Professional portfolio of Julián Estiven Gutiérrez Tabares - Software Development Technologist specialized in Full-Stack development.',
  keywords: [
    // Español
    'Julián Gutiérrez', 'Desarrollador Full-Stack', 'Tecnólogo en Desarrollo de Software',
    'React', 'Next.js', 'Node.js', 'Python', 'Django', 'TypeScript', 'JavaScript',
    'Portafolio desarrollador', 'Desarrollo web', 'Frontend', 'Backend',
    // English
    'Full-Stack Developer', 'Software Development Technologist',
    'Web Development', 'Developer Portfolio', 'Software Engineer'
  ],
  authors: [{ name: 'Julián Estiven Gutiérrez Tabares' }],
  creator: 'Julián Estiven Gutiérrez Tabares',
  publisher: 'Julián Estiven Gutiérrez Tabares',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    alternateLocale: ['en_US'],
    url: 'https://tu-dominio.com',
    siteName: 'Julián Gutiérrez - Portfolio',
    title: 'Julián Estiven Gutiérrez | Tecnólogo en Desarrollo de Software',
    description: 'Portafolio profesional - Full-Stack Developer especializado en React, Next.js, Node.js, Python y Django | Professional Portfolio - Full-Stack Developer',
    images: [
      {
        url: '/images/og-image.jpg', // TODO: Crear esta imagen
        width: 1200,
        height: 630,
        alt: 'Julián Gutiérrez - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julián Estiven Gutiérrez | Full-Stack Developer',
    description: 'Portafolio profesional - Tecnólogo en Desarrollo de Software | Professional Portfolio - Software Development Technologist',
    creator: '@JulinTabar7259',
    images: ['/images/og-image.jpg'], // TODO: Crear esta imagen
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://tu-dominio.com',
    languages: {
      'es-CO': 'https://tu-dominio.com',
      'en-US': 'https://tu-dominio.com',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}
      >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
