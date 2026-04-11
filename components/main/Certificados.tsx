"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";

const CERTIFICADOS = [
  {
    id: "meta-fe",
    title: "Meta Front-End Developer",
    issuer: "Meta / Coursera",
    issuerShort: "META",
    date: "Sep 2023",
    description:
      "Especialización oficial de Meta en 9 cursos. React avanzado, JavaScript profesional, accesibilidad web y principios de UX/UI.",
    skills: ["React", "JavaScript", "HTML/CSS", "UX Design"],
    verifyUrl: "https://coursera.org",
    color: "#7042f8",
    featured: true,
  },
  {
    id: "aws-ccp",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    issuerShort: "AWS",
    date: "Nov 2023",
    expiry: "Nov 2026",
    description:
      "Fundamentos de cloud computing en AWS. Servicios core: EC2, S3, RDS, Lambda, IAM. Arquitectura cloud y seguridad.",
    skills: ["AWS", "Cloud", "EC2", "S3", "Lambda"],
    verifyUrl: "https://aws.amazon.com/certification",
    color: "#06b6d4",
    featured: true,
  },
  {
    id: "google-ux",
    title: "Google UX Design Certificate",
    issuer: "Google / Coursera",
    issuerShort: "GGL",
    date: "Jun 2023",
    description:
      "Proceso completo de diseño UX: investigación, wireframing, prototipado en Figma y pruebas de usabilidad.",
    skills: ["UX Research", "Figma", "Prototyping"],
    color: "#8b5cf6",
    featured: false,
  },
  {
    id: "next-vercel",
    title: "Next.js & Vercel Certified",
    issuer: "Vercel",
    issuerShort: "VCL",
    date: "Mar 2024",
    description:
      "Next.js 14 con App Router, Server Components, Streaming y deployment avanzado con Edge Functions.",
    skills: ["Next.js", "Vercel", "Edge", "ISR"],
    verifyUrl: "https://vercel.com",
    color: "#a855f7",
    featured: true,
  },
  {
    id: "docker",
    title: "Docker & Kubernetes Essentials",
    issuer: "Linux Foundation",
    issuerShort: "LF",
    date: "Feb 2023",
    description:
      "Containerización con Docker y orquestación con Kubernetes. CI/CD pipelines y deployments.",
    skills: ["Docker", "Kubernetes", "CI/CD", "Linux"],
    color: "#0ea5e9",
    featured: false,
  },
  {
    id: "ts-pro",
    title: "TypeScript Pro Masterclass",
    issuer: "Total TypeScript",
    issuerShort: "TTS",
    date: "Ene 2023",
    description:
      "TypeScript avanzado: generics complejos, conditional types, template literal types y type-safety patterns.",
    skills: ["TypeScript", "Generics", "Type System"],
    color: "#6366f1",
    featured: false,
  },
];

interface CardProps {
  cert: typeof CERTIFICADOS[0];
  index: number;
  onSelect: (c: typeof CERTIFICADOS[0]) => void;
  selected: boolean;
}

const CertCard = ({ cert, index, onSelect, selected }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -6, scale: 1.02 }}
    onClick={() => onSelect(cert)}
    className="relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 group"
    style={{
      borderColor: selected ? cert.color : "#2A0E6180",
      background: selected
        ? `linear-gradient(135deg, ${cert.color}18, #030014)`
        : "rgba(3,0,20,0.6)",
      boxShadow: selected
        ? `0 0 30px ${cert.color}40, 0 0 60px ${cert.color}10`
        : "0 4px 20px rgba(0,0,0,0.3)",
    }}
  >
    {/* Glow de fondo */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${cert.color}18 0%, transparent 65%)`,
      }}
    />

    {/* Esquina cortada decorativa */}
    <div
      className="absolute top-0 right-0 w-0 h-0"
      style={{
        borderStyle: "solid",
        borderWidth: "0 28px 28px 0",
        borderColor: `transparent ${cert.color}60 transparent transparent`,
      }}
    />

    {cert.featured && (
      <div
        className="absolute top-[14px] right-[-20px] text-[9px] font-bold uppercase tracking-widest text-white px-6 rotate-45"
        style={{ background: cert.color }}
      >
        Top
      </div>
    )}

    <div className="relative z-10 p-5">
      {/* Avatar emisor */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold tracking-wider"
          style={{
            background: `linear-gradient(135deg, ${cert.color}25, ${cert.color}10)`,
            border: `1px solid ${cert.color}40`,
            color: cert.color,
          }}
        >
          {cert.issuerShort}
        </div>
        <span className="text-[11px] text-gray-500">{cert.date}</span>
      </div>

      {/* Línea de color */}
      <div
        className="w-8 h-[2px] mb-3 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }}
      />

      <h3 className="text-base font-bold text-white mb-1 leading-snug">{cert.title}</h3>
      <p className="text-xs mb-3" style={{ color: `${cert.color}99` }}>{cert.issuer}</p>
      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{cert.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {cert.skills.map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-[2px] rounded-full"
            style={{
              border: `1px solid ${cert.color}25`,
              color: `${cert.color}90`,
              background: `${cert.color}0a`,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#7042f820]">
        {cert.expiry ? (
          <span className="text-[10px] text-gray-600">Válido hasta {cert.expiry}</span>
        ) : (
          <span className="text-[10px] text-gray-600">Sin caducidad</span>
        )}
        {cert.verifyUrl ? (
          <span className="text-[10px] flex items-center gap-1" style={{ color: `${cert.color}80` }}>
            <span className="w-[5px] h-[5px] rounded-full bg-green-400 animate-pulse inline-block" />
            verificable
          </span>
        ) : (
          <span className="text-[10px] text-gray-600">completado</span>
        )}
      </div>
    </div>
  </motion.div>
);

// Panel de detalle lateral
const DetailPanel = ({
  cert,
  onClose,
}: {
  cert: typeof CERTIFICADOS[0];
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 40 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="rounded-xl border p-6 sticky top-24"
    style={{
      borderColor: `${cert.color}40`,
      background: `linear-gradient(135deg, ${cert.color}10, rgba(3,0,20,0.95))`,
      boxShadow: `0 0 40px ${cert.color}20`,
    }}
  >
    <button
      onClick={onClose}
      className="text-gray-500 text-xs hover:text-white transition-colors mb-4 float-right"
    >
      ✕ cerrar
    </button>

    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold mb-4 clear-right"
      style={{
        background: `linear-gradient(135deg, ${cert.color}30, ${cert.color}10)`,
        border: `1px solid ${cert.color}50`,
        color: cert.color,
      }}
    >
      {cert.issuerShort}
    </div>

    <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
    <p className="text-sm mb-4" style={{ color: `${cert.color}80` }}>{cert.issuer}</p>

    <div
      className="h-[1px] mb-4"
      style={{ background: `linear-gradient(90deg, ${cert.color}50, transparent)` }}
    />

    <p className="text-gray-300 text-sm leading-relaxed mb-5">{cert.description}</p>

    <div className="flex flex-wrap gap-2 mb-5">
      {cert.skills.map((s) => (
        <span
          key={s}
          className="text-xs px-3 py-1 rounded-full"
          style={{
            border: `1px solid ${cert.color}30`,
            color: cert.color,
            background: `${cert.color}0d`,
          }}
        >
          {s}
        </span>
      ))}
    </div>

    <div className="text-xs text-gray-500 space-y-2 mb-5">
      <div className="flex justify-between">
        <span>Emisor</span>
        <span className="text-gray-300">{cert.issuer}</span>
      </div>
      <div className="flex justify-between">
        <span>Fecha</span>
        <span className="text-gray-300">{cert.date}</span>
      </div>
      {cert.expiry && (
        <div className="flex justify-between">
          <span>Vence</span>
          <span className="text-gray-300">{cert.expiry}</span>
        </div>
      )}
    </div>

    {cert.verifyUrl && (
      <a
        href={cert.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full py-2 rounded-lg text-sm font-medium text-black transition-opacity hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${cert.color}, #a855f7)` }}
      >
        ↗ Verificar credencial
      </a>
    )}
  </motion.div>
);

const Certificados = () => {
  const [selected, setSelected] = useState<typeof CERTIFICADOS[0] | null>(null);

  const handleSelect = (cert: typeof CERTIFICADOS[0]) => {
    setSelected((prev) => (prev?.id === cert.id ? null : cert));
  };

  return (
    <section
      id="certificados"
      className="flex flex-col items-center justify-center py-20 relative overflow-hidden"
    >
      {/* Fondo nebulosa */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] rounded-full bg-purple-900/10 blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col items-center mb-12 z-10 relative"
      >
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-6"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Logros certificados</h1>
        </motion.div>

        <motion.h2
          variants={slideInFromLeft(0.4)}
          className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center"
        >
          Certificados
        </motion.h2>
        <motion.p
          variants={slideInFromRight(0.5)}
          className="cursive text-[18px] text-gray-300 mt-3 text-center"
        >
          Conocimiento validado por las mejores organizaciones del universo tech
        </motion.p>
      </motion.div>

      {/* Layout: grid + detalle */}
      <div className={`relative z-10 w-full max-w-6xl px-6 ${selected ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "block"}`}>
        {/* Grid de cards */}
        <div className={`${selected ? "lg:col-span-2" : ""}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTIFICADOS.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
                onSelect={handleSelect}
                selected={selected?.id === cert.id}
              />
            ))}
          </div>
        </div>

        {/* Panel de detalle */}
        <AnimatePresence>
          {selected && (
            <div className="lg:col-span-1">
              <DetailPanel cert={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="text-gray-600 text-xs mt-8 z-10"
      >
        Haz clic en cualquier certificado para ver el detalle
      </motion.p>
    </section>
  );
};

export default Certificados;