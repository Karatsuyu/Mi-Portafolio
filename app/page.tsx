import type { Metadata } from "next";
import Hero from "@/components/main/Hero";
import Skills from "@/components/main/Skills";
import Encryption from "@/components/main/Encryption";
import Projects from "@/components/main/Projects";
import SpaceExperiencia from "@/components/main/SpaceExperiencia";
import Formacion from "@/components/main/Formacion";
import Certificados from "@/components/main/Certificados";
import Contacto from "@/components/main/Contacto";
import { PersonJsonLd, WebSiteJsonLd, ProfilePageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Portafolio profesional de Julián Estiven Gutiérrez - Tecnólogo en Desarrollo de Software. Explora mis proyectos, habilidades y experiencia en desarrollo Full-Stack | Professional portfolio of Julián Estiven Gutiérrez - Software Development Technologist. Explore my projects, skills and Full-Stack development experience.',
  openGraph: {
    title: 'Julián Gutiérrez | Portafolio Profesional - Professional Portfolio',
    description: 'Portafolio interactivo con tema espacial - Interactive portfolio with space theme',
  },
  alternates: {
    canonical: 'https://tu-dominio.com',
  },
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <PersonJsonLd />
      <WebSiteJsonLd />
      <ProfilePageJsonLd />
      
      <main className="h-full w-full">
        <div className="flex flex-col gap-20">
          <Hero />
          <Skills />
          <Encryption />
          <Projects />
          <SpaceExperiencia />
          <Formacion />
          <Certificados />
          <Contacto />
        </div>
      </main>
    </>
  );
}