"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  src: string;
  title: string;
  description: string;
  stack?: string[];
  liveUrl?: string;
  repoUrl?: string;
}

const ProjectCard = ({ src, title, description, stack = [], liveUrl, repoUrl }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-[#2A0E61] bg-[#030014] group flex-1 min-w-[280px]"
      style={{
        boxShadow: hovered
          ? "0 0 30px rgba(112,66,248,0.3), 0 0 60px rgba(112,66,248,0.1)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Imagen con overlay */}
      <div className="relative overflow-hidden">
        <Image
          src={src}
          alt={title}
          width={1000}
          height={600}
          className="w-full object-cover h-[200px] group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay gradiente al hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#7042f820] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        {/* Links al hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 flex gap-2"
        >
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#7042f8]/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full hover:bg-purple-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              ↗ Demo
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0300145e] backdrop-blur-sm border border-[#7042f861] text-white text-xs px-3 py-1 rounded-full hover:border-purple-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              ⌥ Repo
            </a>
          )}
        </motion.div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Línea decorativa púrpura */}
        <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 mb-3 group-hover:w-full transition-all duration-500" />

        <h1 className="text-xl font-semibold text-white mb-2">{title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {/* Stack de tecnologías */}
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {stack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-2 py-1 rounded-full border border-[#7042f840] text-purple-300/70 bg-[#7042f810]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;