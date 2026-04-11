"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

interface Props {
  src: string;
  width: number;
  height: number;
  index: number;
  skill_name?: string;
}

const SkillDataProvider = ({ src, width, height, index, skill_name }: Props) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const imageVariants = {
    hidden:  { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1,   y: 0  },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      variants={imageVariants}
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 group"
      title={skill_name}
    >
      <div className="p-3 rounded-xl border border-[#7042f830] bg-[#0300140d] group-hover:border-purple-500/50 group-hover:bg-[#7042f810] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
        <Image
          src={src}
          width={width}
          height={height}
          alt={skill_name ?? "skill"}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      {skill_name && (
        <span className="text-[11px] text-gray-500 group-hover:text-purple-300 transition-colors text-center max-w-[80px] leading-tight">
          {skill_name}
        </span>
      )}
    </motion.div>
  );
};

export default SkillDataProvider;