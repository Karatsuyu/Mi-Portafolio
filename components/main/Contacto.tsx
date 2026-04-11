"use client";
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";

// ── Datos de contacto ───────────────────────────────────────
const CONTACTS = [
  {
    id: "github",
    label: "GitHub",
    color: "#c084fc",
    glowColor: "#a855f7",
    href: "https://github.com/",
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#818cf8",
    glowColor: "#6366f1",
    href: "https://linkedin.com/",
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "Twitter / X",
    color: "#a78bfa",
    glowColor: "#8b5cf6",
    href: "https://twitter.com/",
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#f472b6",
    glowColor: "#ec4899",
    href: "https://instagram.com/",
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    id: "discord",
    label: "Discord",
    color: "#7dd3fc",
    glowColor: "#38bdf8",
    href: "https://discord.com/",
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
      </svg>
    ),
  },
];

// ── Orbital ring definitions (different planes/tilts) ───────
const ORBITAL_RINGS = [
  { radiusX: 195, radiusY: 68, rotation: -15, speed: 0.35, direction: 1 },
  { radiusX: 215, radiusY: 78, rotation: 30, speed: 0.25, direction: -1 },
  { radiusX: 180, radiusY: 62, rotation: -45, speed: 0.30, direction: 1 },
  { radiusX: 235, radiusY: 82, rotation: 55, speed: 0.20, direction: -1 },
  { radiusX: 205, radiusY: 72, rotation: 5, speed: 0.40, direction: 1 },
];

// ── Stable random seeds for sparkle dots ────────────────────
const SPARKLE_SEEDS = Array.from({ length: 30 }, (_, i) => ({
  w: 1 + ((i * 7 + 3) % 25) / 10,
  h: 1 + ((i * 11 + 7) % 25) / 10,
  left: 15 + ((i * 13 + 5) % 70),
  top: 15 + ((i * 17 + 11) % 70),
  r: 200 + ((i * 7) % 55),
  g: 170 + ((i * 11) % 85),
  a: 0.3 + ((i * 3) % 7) / 10,
  dur: 1 + ((i * 7) % 20) / 10,
  delay: ((i * 13) % 20) / 10,
}));

const PARTICLE_SEEDS = Array.from({ length: 20 }, (_, i) => ({
  angle: (i / 20) * Math.PI * 2,
  r: 160 + ((i * 37) % 100),
  size: 0.5 + ((i * 13) % 15) / 10,
  opacity: 0.1 + ((i * 7) % 30) / 100,
  opA: 0.1 + ((i * 3) % 20) / 100,
  opB: 0.3 + ((i * 11) % 40) / 100,
  dur: 2 + ((i * 7) % 30) / 10,
}));

// ── Orbital Contact Node ────────────────────────────────────
function OrbitalContactNode({
  contact,
  ring,
  isPaused,
  onHover,
  onClick,
}: {
  contact: typeof CONTACTS[0];
  ring: typeof ORBITAL_RINGS[0];
  isPaused: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (!isPausedRef.current) {
        angleRef.current += ring.speed * ring.direction * dt;
      }

      const rotRad = (ring.rotation * Math.PI) / 180;
      const cosA = Math.cos(angleRef.current);
      const sinA = Math.sin(angleRef.current);
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);

      const rawX = cosA * ring.radiusX;
      const rawY = sinA * ring.radiusY;

      const x = rawX * cosR - rawY * sinR;
      const y = rawX * sinR + rawY * cosR;

      setPos({ x, y });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ring]);

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        left: `calc(50% + ${pos.x}px)`,
        top: `calc(50% + ${pos.y}px)`,
        transform: "translate(-50%, -50%)",
        zIndex: isPaused ? 30 : 10,
      }}
      onMouseEnter={() => onHover(contact.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(contact.id)}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: isPaused ? 74 : 54,
          height: isPaused ? 74 : 54,
          background: `radial-gradient(circle, ${contact.glowColor}40 0%, transparent 70%)`,
          filter: `blur(${isPaused ? 14 : 7}px)`,
        }}
      />

      {/* Main circle */}
      <motion.div
        className="relative rounded-full flex items-center justify-center cursor-pointer"
        style={{
          width: isPaused ? 52 : 42,
          height: isPaused ? 52 : 42,
          background: `radial-gradient(circle at 30% 30%, ${contact.color}30, ${contact.glowColor}15, #0b082090)`,
          border: `1.5px solid ${isPaused ? contact.color : contact.color + "50"}`,
          boxShadow: isPaused
            ? `0 0 20px ${contact.glowColor}60, 0 0 40px ${contact.glowColor}20, inset 0 0 15px ${contact.glowColor}20`
            : `0 0 8px ${contact.glowColor}20, inset 0 0 6px ${contact.glowColor}10`,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <div style={{ color: isPaused ? "#fff" : contact.color }} className="transition-colors duration-300">
          {contact.svgIcon}
        </div>
      </motion.div>

      {/* Label on hover */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute -bottom-8 whitespace-nowrap text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: `${contact.glowColor}25`,
              border: `1px solid ${contact.color}40`,
              color: contact.color,
              backdropFilter: "blur(8px)",
            }}
          >
            {contact.label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── SVG Orbital Rings (decorative) ──────────────────────────
function OrbitalRingsSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="-300 -300 600 600"
      style={{ zIndex: 5 }}
    >
      <defs>
        {ORBITAL_RINGS.map((ring, i) => (
          <linearGradient key={`grad-${i}`} id={`ringGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={CONTACTS[i].color} stopOpacity="0.05" />
            <stop offset="50%" stopColor={CONTACTS[i].color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={CONTACTS[i].color} stopOpacity="0.05" />
          </linearGradient>
        ))}
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {ORBITAL_RINGS.map((ring, i) => (
        <g key={i} transform={`rotate(${ring.rotation})`}>
          {/* Main orbital ring */}
          <ellipse
            cx="0"
            cy="0"
            rx={ring.radiusX}
            ry={ring.radiusY}
            fill="none"
            stroke={`url(#ringGrad${i})`}
            strokeWidth="1.2"
            filter="url(#ringGlow)"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={ring.direction > 0 ? "0 0 0" : "360 0 0"}
              to={ring.direction > 0 ? "360 0 0" : "0 0 0"}
              dur={`${60 + i * 10}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Secondary thin ring for depth */}
          <ellipse
            cx="0"
            cy="0"
            rx={ring.radiusX + 8}
            ry={ring.radiusY + 3}
            fill="none"
            stroke={CONTACTS[i].color}
            strokeWidth="0.3"
            opacity="0.15"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={ring.direction > 0 ? "0 0 0" : "360 0 0"}
              to={ring.direction > 0 ? "360 0 0" : "0 0 0"}
              dur={`${70 + i * 12}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
      ))}

      {/* Decorative particle dots */}
      {PARTICLE_SEEDS.map((p, i) => (
        <circle
          key={`dot-${i}`}
          cx={Math.cos(p.angle) * p.r}
          cy={Math.sin(p.angle) * p.r * 0.4}
          r={p.size}
          fill="#c084fc"
          opacity={p.opacity}
        >
          <animate
            attributeName="opacity"
            values={`${p.opA};${p.opB};${p.opA}`}
            dur={`${p.dur}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

// ── Central CSS Cosmic Orb ──────────────────────────────────
function CentralOrb({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ width: 160, height: 160, zIndex: 15 }}
      onClick={onClick}
    >
      {/* Outermost glow pulse */}
      <div className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)",
          transform: "scale(2.5)",
          animation: "cosmicPulse 4s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)",
          transform: "scale(2)",
          animation: "cosmicPulse 3s ease-in-out infinite 1s",
        }}
      />

      {/* Rotating conic background glow */}
      <div className="absolute rounded-full"
        style={{
          inset: -30,
          background: "conic-gradient(from 0deg, transparent, rgba(147,51,234,0.1), transparent, rgba(168,85,247,0.08), transparent)",
          animation: "orbSpin 10s linear infinite",
          filter: "blur(15px)",
        }}
      />

      {/* Main sphere */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: `radial-gradient(circle at 35% 28%, 
            rgba(220, 190, 255, 0.95) 0%, 
            rgba(180, 120, 255, 0.8) 15%,
            rgba(147, 51, 234, 0.75) 30%, 
            rgba(107, 33, 168, 0.85) 50%,
            rgba(59, 7, 100, 0.9) 70%,
            rgba(20, 5, 50, 0.95) 100%)`,
          boxShadow: `
            0 0 50px rgba(147, 51, 234, 0.5),
            0 0 100px rgba(139, 92, 246, 0.3),
            0 0 150px rgba(168, 85, 247, 0.15),
            inset 0 0 40px rgba(168, 85, 247, 0.4),
            inset -8px -8px 25px rgba(88, 28, 135, 0.6),
            inset 5px 5px 15px rgba(220, 190, 255, 0.1)
          `,
          transition: "box-shadow 0.5s ease",
        }}
      >
        {/* Nebula / galaxy texture inside the sphere */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(ellipse at 38% 32%, rgba(255,255,255,0.18) 0%, transparent 35%),
              radial-gradient(circle at 65% 60%, rgba(192,132,252,0.25) 0%, transparent 30%),
              radial-gradient(circle at 20% 65%, rgba(167,139,250,0.2) 0%, transparent 30%),
              radial-gradient(circle at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)
            `,
          }}
        />

        {/* Rotating inner nebula */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 45deg, transparent 0%, rgba(192,132,252,0.08) 15%, transparent 30%, rgba(147,51,234,0.06) 50%, transparent 65%, rgba(168,85,247,0.1) 80%, transparent 100%)",
            animation: "orbSpin 15s linear infinite reverse",
          }}
        />

        {/* Sparkle particles inside the orb */}
        {SPARKLE_SEEDS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.w,
              height: s.h,
              left: `${s.left}%`,
              top: `${s.top}%`,
              background: `rgba(${s.r}, ${s.g}, 255, ${s.a})`,
              animation: `twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Surface highlight (specularity) */}
        <div className="absolute rounded-full"
          style={{
            width: "45%",
            height: "35%",
            left: "18%",
            top: "10%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15), rgba(255,255,255,0.05), transparent)",
            filter: "blur(6px)",
            transform: "rotate(-15deg)",
          }}
        />

        {/* Secondary highlight */}
        <div className="absolute rounded-full"
          style={{
            width: "20%",
            height: "15%",
            right: "15%",
            bottom: "20%",
            background: "radial-gradient(ellipse, rgba(192,132,252,0.12), transparent)",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* Outer ring decoration (Saturn-like) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 220,
          height: 220,
        }}
      >
        <svg viewBox="0 0 220 220" className="w-full h-full">
          <defs>
            <linearGradient id="mainRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="30%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="110" cy="110" rx="108" ry="28" fill="none"
            stroke="url(#mainRingGrad)" strokeWidth="2.5" opacity="0.6"
            transform="rotate(-8, 110, 110)" />
          <ellipse cx="110" cy="110" rx="100" ry="25" fill="none"
            stroke="#c084fc" strokeWidth="0.5" opacity="0.2"
            transform="rotate(-8, 110, 110)" />
        </svg>
      </div>

      {/* Hover scale effect for the group */}
      <style jsx>{`
        .group:hover > div:first-child {
          transform: scale(2.8) !important;
        }
      `}</style>

      {/* Click hint */}
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span className="text-[10px] text-purple-400/60 tracking-[0.2em] uppercase">
          ✦ Click para explorar ✦
        </span>
      </motion.div>
    </div>
  );
}

// ── Radial Wheel Menu ───────────────────────────────────────
function RadialMenu({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const menuRadius = 160;
  const angleStep = (2 * Math.PI) / CONTACTS.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Dark backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(10,5,30,0.85) 0%, rgba(0,0,0,0.93) 100%)",
              backdropFilter: "blur(12px)",
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Decorative concentric rings */}
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border pointer-events-none"
              style={{
                width: menuRadius * 2 * (0.2 + ring * 0.22),
                height: menuRadius * 2 * (0.2 + ring * 0.22),
                borderColor: `rgba(147, 51, 234, ${0.18 - ring * 0.03})`,
                boxShadow: ring === 2 ? "0 0 20px rgba(147,51,234,0.05)" : "none",
              }}
              initial={{ scale: 0, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 60 }}
              transition={{ duration: 0.5, delay: ring * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
            />
          ))}

          {/* Rotating conic mandala */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 200,
              height: 200,
              background: "conic-gradient(from 0deg, transparent, rgba(147,51,234,0.06), transparent, rgba(168,85,247,0.04), transparent, rgba(139,92,246,0.06), transparent)",
              animation: "orbSpin 20s linear infinite",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Central glow orb */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 80,
              height: 80,
              background: "radial-gradient(circle, rgba(147,51,234,0.35) 0%, rgba(88,28,135,0.2) 40%, transparent 70%)",
              boxShadow: "0 0 60px rgba(147,51,234,0.3), 0 0 120px rgba(139,92,246,0.12)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          />

          {/* Inner bright core */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 20,
              height: 20,
              background: "radial-gradient(circle, rgba(220,190,255,0.7) 0%, rgba(168,85,247,0.3) 50%, transparent 100%)",
              boxShadow: "0 0 15px rgba(192,132,252,0.5)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />

          {/* Contact items arranged radially */}
          {CONTACTS.map((contact, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const x = Math.cos(angle) * menuRadius;
            const y = Math.sin(angle) * menuRadius;

            return (
              <motion.div
                key={contact.id}
                className="absolute flex flex-col items-center gap-2.5 cursor-pointer group"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 0.2, delay: (CONTACTS.length - 1 - i) * 0.03 },
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.08,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(contact.id);
                }}
              >
                {/* Connector line */}
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    width: 2,
                    height: menuRadius - 35,
                    left: "calc(50% - 1px)",
                    bottom: "50%",
                    transformOrigin: "bottom center",
                    transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
                  }}
                >
                  <defs>
                    <linearGradient id={`line-${contact.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="100%" stopColor={contact.color} stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <motion.rect
                    x="0" y="0" width="1" height="100%"
                    fill={`url(#line-${contact.id})`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    style={{ transformOrigin: "bottom" }}
                  />
                </svg>

                {/* Outer glow */}
                <div
                  className="absolute rounded-full transition-all duration-500 group-hover:scale-125"
                  style={{
                    width: 80,
                    height: 80,
                    background: `radial-gradient(circle, ${contact.glowColor}20 0%, transparent 70%)`,
                    filter: "blur(12px)",
                  }}
                />

                {/* Icon circle */}
                <motion.div
                  className="relative rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    width: 56,
                    height: 56,
                    background: `radial-gradient(circle at 30% 30%, ${contact.color}25, #0b082095)`,
                    border: `2px solid ${contact.color}50`,
                    boxShadow: `0 0 20px ${contact.glowColor}25, inset 0 0 15px ${contact.glowColor}10`,
                  }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: `0 0 35px ${contact.glowColor}60, 0 0 60px ${contact.glowColor}20, inset 0 0 20px ${contact.glowColor}25`,
                    borderColor: contact.color,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Rotating inner shimmer */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${contact.color}15, transparent, ${contact.color}10, transparent)`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <div style={{ color: contact.color }} className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {contact.svgIcon}
                  </div>
                </motion.div>

                {/* Label */}
                <motion.span
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: contact.color }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  {contact.label}
                </motion.span>
              </motion.div>
            );
          })}

          {/* Close button */}
          <motion.button
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300"
            style={{
              background: "rgba(147, 51, 234, 0.08)",
              border: "1px solid rgba(147, 51, 234, 0.25)",
              color: "rgba(192, 132, 252, 0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={onClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            whileHover={{
              background: "rgba(147, 51, 234, 0.15)",
              borderColor: "rgba(168, 85, 247, 0.5)",
              color: "#e9d5ff",
              boxShadow: "0 0 25px rgba(147, 51, 234, 0.2)",
            }}
          >
            <span>✕</span>
            <span>Cerrar</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Planet System (container) ───────────────────────────────
function PlanetSystem({
  onMoonHover,
  onMoonClick,
  onCenterClick,
}: {
  onMoonHover: (id: string | null) => void;
  onMoonClick: (id: string) => void;
  onCenterClick: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleHover = useCallback(
    (id: string | null) => {
      setHoveredId(id);
      onMoonHover(id);
    },
    [onMoonHover]
  );

  return (
    <div className="relative flex items-center justify-center" style={{ width: 520, height: 520 }}>
      {/* Nebula background glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(88,28,135,0.08) 0%, rgba(30,10,60,0.04) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* SVG Orbital Rings */}
      <OrbitalRingsSVG />

      {/* Central Cosmic Orb */}
      <CentralOrb onClick={onCenterClick} />

      {/* Orbiting Contact Nodes */}
      {CONTACTS.map((contact, i) => (
        <OrbitalContactNode
          key={contact.id}
          contact={contact}
          ring={ORBITAL_RINGS[i]}
          isPaused={hoveredId === contact.id}
          onHover={handleHover}
          onClick={onMoonClick}
        />
      ))}
    </div>
  );
}

// ── Formulario de contacto ──────────────────────────────────
type FormState = { name: string; email: string; message: string };
type Status = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim())    e.name    = "Requerido";
    if (!form.email.trim())   e.email   = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.message.trim()) e.message = "Requerido";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls = (field: keyof FormState) =>
    `w-full bg-[#03001440] border rounded-lg px-4 py-3 text-gray-200 text-sm placeholder-gray-600 outline-none transition-all focus:border-purple-500/70 focus:shadow-[0_0_0_1px_rgba(112,66,248,0.3)] ${
      errors[field] ? "border-red-500/50" : "border-[#2A0E61]"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-[#2A0E61] bg-[#03001460] backdrop-blur-sm p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-5">Enviar transmisión</h3>

      {status === "success" && (
        <div className="mb-4 p-3 rounded-lg border border-green-500/30 bg-green-900/20 text-green-300 text-sm">
          ✅ ¡Mensaje recibido! Te respondo pronto.
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-900/20 text-red-300 text-sm">
          ❌ Error. Intenta por email directo.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputCls("name")} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={inputCls("email")} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        <div>
          <textarea placeholder="Mensaje…" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className={`${inputCls("message")} resize-none`} />
          {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
        </div>
        <motion.button
          type="submit" disabled={status==="sending"}
          whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          className="w-full py-3 rounded-lg text-white font-medium text-sm button-primary disabled:opacity-60"
        >
          {status === "sending" ? "Enviando…" : "Enviar señal ✦"}
        </motion.button>
      </form>
    </motion.div>
  );
}

// ── Componente principal ────────────────────────────────────
const Contacto = () => {
  const [hoveredMoon, setHoveredMoon] = useState<string | null>(null);
  const [radialMenuOpen, setRadialMenuOpen] = useState(false);
  const activeMoon = CONTACTS.find(m => m.id === hoveredMoon) ?? null;

  const handleMoonClick = (id: string) => {
    const moon = CONTACTS.find(m => m.id === id);
    if (moon) window.open(moon.href, "_blank", "noopener");
  };

  const handleCenterClick = () => {
    setRadialMenuOpen(true);
  };

  const handleRadialSelect = (id: string) => {
    handleMoonClick(id);
    setRadialMenuOpen(false);
  };

  return (
    <section id="contacto" className="flex flex-col items-center py-20 pb-32 relative overflow-hidden">
      {/* Nebulosa */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-purple-900/15 blur-[160px]" />
      </div>

      {/* Header */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="flex flex-col items-center mb-14 z-10 relative"
      >
        <motion.div variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-6">
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Establece contacto</h1>
        </motion.div>
        <motion.h2 variants={slideInFromLeft(0.4)}
          className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
          Contacto
        </motion.h2>
        <motion.p variants={slideInFromRight(0.5)}
          className="cursive text-[18px] text-gray-300 mt-3 text-center">
          Órbita hacia mis redes o envía una transmisión directa
        </motion.p>
      </motion.div>

      {/* Layout: planeta + formulario */}
      <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Planeta orbital */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <PlanetSystem
            onMoonHover={setHoveredMoon}
            onMoonClick={handleMoonClick}
            onCenterClick={handleCenterClick}
          />

          {/* Tooltip del hover */}
          <AnimatePresence>
            {activeMoon && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="mt-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: activeMoon.color + "20",
                  border: `1px solid ${activeMoon.color}40`,
                  color: activeMoon.color,
                }}
              >
                ↗ Ir a {activeMoon.label}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-gray-600 text-xs mt-3 text-center">
            Pasa el cursor · click para abrir · click en la esfera para menú
          </p>
        </motion.div>

        {/* Formulario + info */}
        <div className="flex flex-col gap-5">
          {/* Info rápida */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/20 bg-green-900/10"
          >
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <div>
              <div className="text-green-400 text-sm font-semibold">Disponible ahora</div>
              <div className="text-gray-500 text-xs">Respuesta en &lt; 24 horas · Bogotá, Colombia</div>
            </div>
          </motion.div>

          <ContactForm />
        </div>
      </div>

      {/* Radial Menu Overlay */}
      <RadialMenu
        isOpen={radialMenuOpen}
        onClose={() => setRadialMenuOpen(false)}
        onSelect={handleRadialSelect}
      />
    </section>
  );
};

export default Contacto;