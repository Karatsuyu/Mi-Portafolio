"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  theme?: "space" | "classic" | "runic" | "gamer";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  technologies,
  githubUrl,
  liveUrl,
  theme = "space"
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case "classic":
        return {
          container: "classic-card hover:shadow-lg",
          title: "classic-heading",
          text: "classic-text",
          button: "classic-button text-white text-sm",
          tech: "bg-blue-100 text-blue-800"
        };
      case "runic":
        return {
          container: "runic-card rune-glow hover:shadow-amber-400/20",
          title: "runic-heading",
          text: "runic-text",
          button: "runic-button text-black text-sm",
          tech: "bg-amber-800 text-amber-200"
        };
      case "gamer":
        return {
          container: "gamer-card rgb-border hover:scale-105",
          title: "gamer-heading font-bold tracking-wide",
          text: "gamer-text font-mono",
          button: "gamer-button text-black text-sm tracking-wider",
          tech: "bg-gradient-to-r from-cyan-400 to-pink-500 text-black"
        };
      default:
        return {
          container: "bg-[#0c0c0c] border border-[#7042f861] hover:border-[#7042f8]",
          title: "text-white font-bold",
          text: "text-gray-300",
          button: "button-primary text-white text-sm",
          tech: "bg-purple-900 text-purple-300"
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-lg overflow-hidden ${themeClasses.container} transition-all duration-300`}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className={`text-xl mb-3 ${themeClasses.title}`}>
          {title}
        </h3>
        
        <p className={`mb-4 ${themeClasses.text}`}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${themeClasses.tech}`}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-lg ${themeClasses.button} transition-all`}
            >
              GitHub
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-lg ${themeClasses.button} transition-all`}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};