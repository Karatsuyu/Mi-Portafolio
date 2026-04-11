"use client";

import React from "react";
import { motion } from "framer-motion";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-center px-10 md:px-20 mt-40 w-full z-[20]"
    >
      {/* Texto izquierda */}
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Fullstack Developer Portfolio</h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-5xl md:text-6xl font-bold text-white max-w-[600px]"
        >
          <span>
            Construyendo
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {" "}experiencias{" "}
            </span>
            que impactan
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          Soy un Ingeniero Full Stack con experiencia en desarrollo Web, Móvil y Software.
          Especializado en React, Next.js, Node.js y tecnologías modernas del ecosistema JavaScript.
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-row gap-4 flex-wrap"
        >
          <a
            href="#projects"
            className="py-2 px-6 button-primary text-center text-white cursor-pointer rounded-lg"
          >
            Ver Proyectos
          </a>
          <a
            href="#contacto"
            className="py-2 px-6 border border-[#7042f88b] text-center text-gray-300 cursor-pointer rounded-lg hover:border-purple-400 hover:text-white transition-colors"
          >
            Contáctame
          </a>
        </motion.div>

        {/* Stats rápidas */}
        <motion.div
          variants={slideInFromLeft(1.2)}
          className="flex flex-row gap-8 mt-4"
        >
          {[
            { value: "3+",  label: "años exp."   },
            { value: "20+", label: "proyectos"   },
            { value: "10+", label: "tecnologías" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {s.value}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Imagen derecha */}
      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center"
      >
        <Image
          src="/mainIconsdark.svg"
          alt="work icons"
          height={650}
          width={650}
          priority
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;