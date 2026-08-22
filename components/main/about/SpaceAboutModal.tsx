"use client";

/**
 * SpaceAboutModal — Modal "Sobre mí" avanzado para el tema Space
 * ────────────────────────────────────────────────────────────────
 * Misma información que app/classic/page.tsx (bio + Competencias
 * Profesionales), pero con una estructura y un lenguaje visual
 * completamente nuevos, a la altura del resto del tema Space:
 *
 *   1. Overlay con blur + nebulosa radial de fondo
 *   2. Marco de constelación animado en el borde del modal
 *      (estrellas titilando + líneas "fluyendo" por el perímetro)
 *   3. Sección bio: esfera de partículas (Fibonacci sphere) con
 *      anillos orbitales + arcos radiales de fondo, junto al texto
 *   4. Sección de Competencias: grid de tarjetas con insignia
 *      circular por código, animación de entrada escalonada y un
 *      patrón de circuito de fondo muy sutil
 *
 * Orden del contenido (igual que en Classic, solo cambia el estilo):
 *   bio → Competencias Profesionales → por cada una: código, título,
 *   descripción.
 *
 * USO:
 *   import SpaceAboutModal from "@/components/main/about/SpaceAboutModal";
 *   {open && <SpaceAboutModal onClose={() => setOpen(false)} />}
 */

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/solid";

import CosmicCanvas from "./CosmicCanvas";
import { BIO_NAME, BIO_ROLE, BIO_PARAGRAPHS, COMPETENCIAS } from "./aboutData";

export interface SpaceAboutModalProps {
  onClose: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SpaceAboutModal({ onClose }: SpaceAboutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
        {/* ── Overlay ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 50% 20%, rgba(139,92,246,0.18) 0%, transparent 60%)",
          }}
          onClick={onClose}
        />

        {/* ── Panel del modal ─────────────────────────────────── */}
        <motion.div
          className="relative w-full max-w-[1100px] max-h-[90vh] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          style={{
            background:
              "linear-gradient(180deg, rgba(17,10,34,0.96) 0%, rgba(8,5,18,0.98) 100%)",
            boxShadow:
              "0 0 0 1px rgba(168,85,247,0.15), 0 30px 100px rgba(88,28,135,0.45)",
          }}
        >
          {/* Fondo Cósmico Animado (Nebulosas, Supernovas, Estrellas Fugaces, Vía Láctea) */}
          <CosmicCanvas className="opacity-90" />

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-purple-400/60 hover:bg-purple-500/10 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="relative z-10 max-h-[90vh] overflow-y-auto scrollbar-hidden px-6 py-10 md:px-14 md:py-14">
            {/* ── Sección: Bio ──────────────────────────────────── */}
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 py-[6px] px-3 mb-4 rounded-full border border-[#7042f88b] bg-white/[0.02]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <SparklesIcon className="text-[#b49bff] h-4 w-4" />
                  <span className="text-[12px] text-gray-300 tracking-wide">Sobre mí</span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Hola, soy{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    {BIO_NAME}
                  </span>
                </motion.h2>

                <motion.p
                  className="text-gray-400 text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {BIO_ROLE}
                </motion.p>
              </div>

              <div className="space-y-4">
                {BIO_PARAGRAPHS.map((p, i) => (
                  <motion.p
                    key={i}
                    className="text-gray-300/90 text-sm md:text-[15px] leading-relaxed text-justify md:text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* ── Separador constelado ──────────────────────────── */}
            <div className="relative h-16 md:h-20 my-4">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke="url(#sep-grad)"
                  strokeWidth="1"
                  strokeDasharray="1 8"
                />
                <defs>
                  <linearGradient id="sep-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* ── Sección: Competencias Profesionales ───────────── */}
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Competencias{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Profesionales
                </span>
              </h3>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                Competencias específicas adquiridas durante mi formación como Tecnólogo en
                Desarrollo de Software — Universidad del Valle
              </p>
            </div>

            <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Patrón de circuito de fondo, muy sutil */}
              <div
                className="absolute inset-0 -z-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              {COMPETENCIAS.map((c, i) => (
                <motion.div
                  key={c.code}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  whileHover={{ y: -4 }}
                  className="relative z-10 rounded-xl p-5 border border-white/10 bg-white/[0.025] hover:border-purple-400/50 hover:bg-purple-500/[0.06] transition-colors group"
                >
                  {/* Insignia circular con el código */}
                  <div className="relative w-14 h-14 mb-4">
                    <div className="absolute inset-0 rounded-full border border-purple-400/40 group-hover:border-cyan-400/60 transition-colors" />
                    <div className="absolute inset-[3px] rounded-full border border-purple-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] font-mono font-semibold text-purple-300 group-hover:text-cyan-300 transition-colors">
                        {c.code}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-white font-semibold mb-2 text-[15px]">{c.title}</h4>
                  <p className="text-gray-400 text-[13px] leading-relaxed">{c.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>,
    document.body
  );
}
