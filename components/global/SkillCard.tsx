"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SkillCardProps {
  name: string;
  level: number;
  icon?: string;
  category: string;
  theme?: "space" | "classic" | "runic" | "gamer";
}

export const SkillCard: React.FC<SkillCardProps> = ({
  name,
  level,
  icon,
  category,
  theme = "space"
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case "classic":
        return {
          container: "classic-card hover:shadow-lg",
          name: "classic-heading",
          category: "classic-text text-sm",
          progress: "bg-blue-500",
          progressBg: "bg-gray-200"
        };
      case "runic":
        return {
          container: "runic-card rune-glow hover:shadow-amber-400/20",
          name: "runic-heading",
          category: "runic-text text-sm",
          progress: "bg-gradient-to-r from-amber-500 to-yellow-500",
          progressBg: "bg-stone-700"
        };
      case "gamer":
        return {
          container: "gamer-card hover:scale-105",
          name: "gamer-heading font-bold tracking-wide",
          category: "gamer-text text-xs font-mono",
          progress: "bg-gradient-to-r from-cyan-400 to-pink-500",
          progressBg: "bg-gray-800"
        };
      default:
        return {
          container: "bg-[#0c0c0c] border border-[#7042f861] hover:border-[#7042f8]",
          name: "text-white font-bold",
          category: "text-gray-400 text-sm",
          progress: "bg-gradient-to-r from-purple-500 to-cyan-500",
          progressBg: "bg-gray-700"
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg ${themeClasses.container} transition-all duration-300`}
    >
      <div className="flex items-center mb-4">
        {icon && (
          <div className="w-12 h-12 mr-4 relative">
            <Image
              src={icon}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className={`text-lg ${themeClasses.name}`}>
            {name}
          </h3>
          <p className={themeClasses.category}>
            {category}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${themeClasses.name}`}>
            {level}%
          </span>
        </div>
      </div>
      
      <div className={`w-full rounded-full h-2 ${themeClasses.progressBg}`}>
        <motion.div
          className={`h-2 rounded-full ${themeClasses.progress}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};