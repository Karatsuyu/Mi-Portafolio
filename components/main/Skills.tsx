"use client";
import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/utils/motion";
import Image from "next/image";

// ── Datos de habilidades con niveles ────────────────────────
const SKILL_GROUPS = [
  {
    category: "Frontend",
    color: "#b49bff",
    glow: "rgba(180,155,255,0.4)",
    skills: [
      { name: "React",        level: 92, icon: "/react.png"       },
      { name: "Next.js",      level: 88, icon: "/next.png"        },
      { name: "TypeScript",   level: 85, icon: "/ts.png"          },
      { name: "Tailwind CSS", level: 90, icon: "/tailwind.png"    },
      { name: "HTML5",        level: 95, icon: "/html.png"        },
      { name: "CSS3",         level: 90, icon: "/css.png"         },
      { name: "Redux",        level: 78, icon: "/redux.png"       },
      { name: "Framer Motion",level: 75, icon: "/framer.png"      },
    ],
  },
  {
    category: "Backend",
    color: "#7042f8",
    glow: "rgba(112,66,248,0.4)",
    skills: [
      { name: "Node.js",      level: 85, icon: "/node-js.png"     },
      { name: "Express",      level: 82, icon: "/express.png"     },
      { name: "PostgreSQL",   level: 75, icon: "/postger.png"     },
      { name: "MongoDB",      level: 80, icon: "/mongodb.png"     },
      { name: "Firebase",     level: 72, icon: "/Firebase.png"    },
      { name: "GraphQL",      level: 65, icon: "/graphql.png"     },
      { name: "Prisma",       level: 70, icon: "/prisma.webp"     },
    ],
  },
  {
    category: "Otros",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.4)",
    skills: [
      { name: "Three.js",     level: 70, icon: "/react.png"       },
      { name: "React Native", level: 68, icon: "/ReactNative .png" },
      { name: "Docker",       level: 62, icon: "/docker.webp"     },
      { name: "Figma",        level: 78, icon: "/figma.png"       },
      { name: "Git",          level: 88, icon: "/gitwhite.png"    },
      { name: "Go",           level: 45, icon: "/go.png"          },
    ],
  },
];

// ── Canvas de partículas de fondo ───────────────────────────
function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      color: ["#b49bff", "#7042f8", "#06b6d4"][Math.floor(Math.random() * 3)],
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "80";
        ctx.fill();
      });
      // Líneas de conexión
      pts.forEach((a, i) => pts.slice(i + 1).forEach((b) => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(112,66,248,${0.12 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

// ── Barra de habilidad individual ───────────────────────────
function SkillBar({ skill, color, glow, index }: {
  skill: { name: string; level: number; icon: string };
  color: string;
  glow: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-1">
        {/* Ícono pequeño */}
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
          <Image src={skill.icon} alt={skill.name} width={20} height={20}
            className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-sm text-gray-300 flex-1 group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <span className="text-xs font-mono" style={{ color }}>{skill.level}%</span>
      </div>

      {/* Track */}
      <div className="ml-9 h-[6px] rounded-full bg-white/5 overflow-hidden relative">
        {/* Brillo de fondo */}
        <div className="absolute inset-0 rounded-full" style={{ background: `${color}10` }} />
        {/* Barra animada */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: index * 0.06 + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${glow}`,
          }}
        >
          {/* Destello en la punta */}
          <div className="absolute right-0 top-0 bottom-0 w-3 rounded-full"
            style={{ background: `radial-gradient(circle, white 0%, ${color} 60%, transparent 100%)`, opacity: 0.8 }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Grupo de categoría ──────────────────────────────────────
function SkillGroup({ group, groupIndex }: {
  group: typeof SKILL_GROUPS[0];
  groupIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: groupIndex * 0.15, duration: 0.6 }}
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        borderColor: group.color + "25",
        background: "rgba(3,0,20,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Glow interior esquina */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${group.color}12 0%, transparent 70%)` }} />

      {/* Header categoría */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: group.color, boxShadow: `0 0 8px ${group.color}` }} />
        <h3 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: group.color }}>
          {group.category}
        </h3>
        <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />
        <span className="text-xs text-gray-600">{group.skills.length} skills</span>
      </div>

      {/* Barras */}
      <div className="flex flex-col gap-4">
        {group.skills.map((skill, i) => (
          <SkillBar key={skill.name} skill={skill} color={group.color} glow={group.glow} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Componente principal ────────────────────────────────────
const Skills = () => {
  // Stats globales
  const totalSkills = SKILL_GROUPS.reduce((a, g) => a + g.skills.length, 0);
  const avgLevel = Math.round(
    SKILL_GROUPS.flatMap(g => g.skills).reduce((a, s) => a + s.level, 0) /
    SKILL_GROUPS.flatMap(g => g.skills).length
  );

  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center py-20 relative overflow-hidden"
    >
      {/* Partículas de fondo */}
      <div className="absolute inset-0 z-0">
        <ParticlesBg />
      </div>

      {/* Nebulosa */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-purple-900/15 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col items-center mb-12 z-10 relative"
      >
        <motion.div variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-6">
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Tecnologías dominadas</h1>
        </motion.div>
        <motion.h2 variants={slideInFromLeft(0.4)}
          className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
          Habilidades
        </motion.h2>
        <motion.p variants={slideInFromRight(0.5)}
          className="cursive text-[18px] text-gray-300 mt-3 text-center">
          Cada barra mide mi nivel real de dominio
        </motion.p>

        {/* Stats rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex gap-8 mt-6"
        >
          {[
            { val: totalSkills, label: "tecnologías" },
            { val: avgLevel + "%", label: "nivel promedio" },
            { val: "3+", label: "años" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {s.val}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Grid de grupos */}
      <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SKILL_GROUPS.map((group, i) => (
          <SkillGroup key={group.category} group={group} groupIndex={i} />
        ))}
      </div>

      {/* Video de fondo — mantenido del original */}
      <div className="w-full h-full absolute z-0">
        <div className="w-full h-full z-[-10] opacity-15 absolute flex items-center justify-center">
          <video className="w-full h-auto" preload="false" playsInline loop muted autoPlay src="/cards-video.webm" />
        </div>
      </div>
    </section>
  );
};

export default Skills;