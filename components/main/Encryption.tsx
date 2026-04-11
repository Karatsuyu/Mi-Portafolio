"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { slideInFromTop } from "@/utils/motion";

// Símbolos de código / tecnología que flotan y se "escriben"
const SYMBOLS = [
  "01", "{}","</>","fn()","=>","&&","||","!=","==","++",
  "∑","λ","π","Ω","∞","⊕","⊗","∇","∂","∫",
  "git","npm","sql","api","jsx","tsx","css","ssh","env",
  "const","let","var","def","pub","use","mod","impl",
];

function FloatingSymbols() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items: { el: HTMLSpanElement; x: number; y: number; vx: number; vy: number; opacity: number; dop: number }[] = [];

    for (let i = 0; i < 40; i++) {
      const span = document.createElement("span");
      span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      span.style.cssText = `
        position: absolute;
        font-family: 'Courier New', monospace;
        font-size: ${10 + Math.random() * 10}px;
        color: rgb(${Math.random() > 0.5 ? "180,155,255" : "112,66,248"});
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
      `;
      el.appendChild(span);
      items.push({
        el: span,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        opacity: Math.random(),
        dop: (Math.random() - 0.5) * 0.006,
      });
    }

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      items.forEach(item => {
        item.x += item.vx; item.y += item.vy;
        item.opacity += item.dop;
        if (item.opacity > 0.6) { item.opacity = 0.6; item.dop *= -1; }
        if (item.opacity < 0.05) { item.opacity = 0.05; item.dop *= -1; }
        if (item.x < 0) item.x = 100; if (item.x > 100) item.x = 0;
        if (item.y < 0) item.y = 100; if (item.y > 100) item.y = 0;
        item.el.style.left    = item.x + "%";
        item.el.style.top     = item.y + "%";
        item.el.style.opacity = item.opacity.toString();
        // Regenerar símbolo ocasionalmente
        if (Math.random() < 0.002) {
          item.el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      items.forEach(i => i.el.remove());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
}

const Encryption = () => {
  return (
    <div className="flex flex-row relative items-center justify-center min-h-[60vh] w-full h-full overflow-hidden">
      {/* Símbolos flotantes (reemplaza el rol decorativo) */}
      <FloatingSymbols />

      {/* Título */}
      <div className="absolute w-auto h-auto top-8 z-[5]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInFromTop}
          className="text-[40px] font-medium text-center text-gray-200"
        >
          Rendimiento
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            {" "}&{" "}
          </span>
          Seguridad
        </motion.div>
      </div>

      {/* Centro: candado + texto — mantenido del original */}
      <div className="flex flex-col items-center justify-center z-[20] w-auto h-auto">
        <div className="flex flex-col items-center group cursor-pointer w-auto h-auto">
          {/* Candado SVG reemplaza el Image para no depender del asset */}
          <motion.svg
            initial={{ y: 0 }}
            whileHover={{ y: 24 }}
            transition={{ duration: 0.2 }}
            width="50" height="50" viewBox="0 0 50 50" fill="none"
            className="translate-y-5 group-hover:translate-y-11 transition-all duration-200"
          >
            <rect x="10" y="20" width="30" height="6" rx="3" fill="#b49bff" opacity="0.6"/>
          </motion.svg>

          <motion.svg
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            width="70" height="70" viewBox="0 0 70 70" fill="none" className="z-10"
          >
            <rect x="8" y="26" width="54" height="38" rx="8" fill="#1a0533" stroke="#7042f8" strokeWidth="1.5"/>
            <circle cx="35" cy="42" r="6" fill="#7042f8" opacity="0.8"/>
            <rect x="32" y="42" width="6" height="10" rx="3" fill="#b49bff"/>
            {/* Arco del candado */}
            <path d="M18 26 V18 A17 17 0 0 1 52 18 V26" fill="none" stroke="#7042f8" strokeWidth="1.5"/>
          </motion.svg>
        </div>

        <div className="Welcome-box px-[15px] py-[4px] z-[20] border my-[20px] border-[#7042f88b] opacity-[0.9]">
          <h1 className="Welcome-text text-[12px]">Encriptación</h1>
        </div>
      </div>

      <div className="absolute z-[20] bottom-[10px] px-[5px]">
        <div className="cursive text-[20px] font-medium text-center text-gray-300">
          Asegura tus datos con encriptación de extremo a extremo
        </div>
      </div>

      {/* Video original mantenido */}
      <div className="w-full flex items-start justify-center absolute z-0">
        <video loop muted autoPlay playsInline preload="false"
          className="w-full h-auto" src="/encryption.webm" />
      </div>
    </div>
  );
};

export default Encryption;