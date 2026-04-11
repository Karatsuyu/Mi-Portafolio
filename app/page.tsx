import Hero from "@/components/main/Hero";
import Skills from "@/components/main/Skills";
import Encryption from "@/components/main/Encryption";
import Projects from "@/components/main/Projects";
import Formacion from "@/components/main/Formacion";
import Certificados from "@/components/main/Certificados";
import Contacto from "@/components/main/Contacto";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Encryption />
        <Projects />
        <Formacion />
        <Certificados />
        <Contacto />
      </div>
    </main>
  );
}