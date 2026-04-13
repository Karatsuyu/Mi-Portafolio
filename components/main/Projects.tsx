"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromTop } from "@/utils/motion";

// ── Datos de proyectos ──────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    num: "01",
    title: "Tienda Online",
    subtitle: "E-commerce full-stack",
    description:
      "Plataforma web para explorar productos, ver detalles y realizar compras (carrito, autenticación, checkout y órdenes).",
    stack: [
      "Next.js 15",
      "React 19",
      "Tailwind CSS",
      "FastAPI",
      "SQLAlchemy",
      "Docker",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/Tienda-Online.git",
    color: 0xef4444,
    hexColor: "#ef4444",
  },
  {
    id: 2,
    num: "02",
    title: "Delicious Food",
    subtitle: "Delivery + e-commerce",
    description:
      "App full-stack de pedidos con combos personalizados, carrito persistente, pagos con Stripe y notificaciones.",
    stack: [
      "Django",
      "DRF",
      "JWT",
      "Stripe",
      "React",
      "Vite",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/delicious-food-app.git",
    color: 0xf97316,
    hexColor: "#f97316",
  },
  {
    id: 3,
    num: "03",
    title: "ParkingPro",
    subtitle: "SaaS de parqueaderos",
    description:
      "SaaS para gestionar parqueaderos con entrada/salida en tiempo real, facturación, reservas online y analytics (WebSockets).",
    stack: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Redis",
      "Socket.IO",
      "React + TS",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/parking-app.git",
    color: 0xfacc15,
    hexColor: "#facc15",
  },
  {
    id: 4,
    num: "04",
    title: "Registraduría",
    subtitle: "Gestión registral",
    description:
      "Sistema web full-stack para gestionar personas y documentos, con búsquedas y reportes estadísticos.",
    stack: ["Node.js", "Express", "PostgreSQL", "React", "Vite"],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/Registradur-a-De-Colombia.git",
    color: 0x22c55e,
    hexColor: "#22c55e",
  },
  {
    id: 5,
    num: "05",
    title: "MiSalud",
    subtitle: "Predicción de riesgo",
    description:
      "Plataforma full-stack para hábitos y contenido educativo con predicciones de riesgo, dashboard y seguridad con JWT.",
    stack: [
      "Django",
      "DRF",
      "React",
      "Tailwind CSS",
      "React Query",
      "Zod",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/Mi-Salud.git",
    color: 0x06b6d4,
    hexColor: "#06b6d4",
  },
  {
    id: 6,
    num: "06",
    title: "Lavelo Pues",
    subtitle: "API + desktop client",
    description:
      "Backend REST para clientes/servicios y frontend de escritorio en Tkinter consumiendo la API (CRUD completo).",
    stack: [
      "Django",
      "DRF",
      "SQLite",
      "Tkinter",
      "requests",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/Lavelo-Pues.git",
    color: 0x3b82f6,
    hexColor: "#3b82f6",
  },
  {
    id: 7,
    num: "07",
    title: "Banco (Corresponsal)",
    subtitle: "Sistema bancario desktop",
    description:
      "Sistema desktop para gestionar clientes, cuentas y transacciones con persistencia custom en archivos .txt y GUI multi-ventana.",
    stack: ["Python", "Tkinter", "POO", "Persistencia TXT"],
    liveUrl: "",
    repoUrl: "https://github.com/Karatsuyu/Banco.git",
    color: 0xa855f7,
    hexColor: "#a855f7",
  },
];

// ── Escena Three.js: terreno wireframe + forma central ──────
function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement>, activeColor: number) {
  const sceneRef   = useRef<THREE.Scene | null>(null);
  const rendRef    = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef  = useRef<THREE.PerspectiveCamera | null>(null);
  const shapeRef   = useRef<THREE.Mesh | null>(null);
  const rafRef     = useRef<number>(0);
  const colorRef   = useRef(activeColor);
  colorRef.current = activeColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene + camera
    const scene  = new THREE.Scene();
    const W = canvas.clientWidth  || 800;
    const H = canvas.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 18, 48);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Terreno wireframe (izquierda + derecha) ────────────
    const makeHill = (offsetX: number) => {
      const geo = new THREE.PlaneGeometry(70, 60, 60, 60);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const h = Math.sin(x * 0.18) * Math.cos(z * 0.15) * 6
                + Math.sin(x * 0.35 + 1.2) * 3
                + Math.random() * 1.2;
        pos.setY(i, h);
      }
      geo.computeVertexNormals();
      const mat = new THREE.MeshBasicMaterial({
        color: 0x2a0e61,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2.8;
      mesh.position.set(offsetX, -6, -8);
      return mesh;
    };

    scene.add(makeHill(-30));
    scene.add(makeHill(30));

    // ── Forma central giratoria (estrella / icosaedro) ─────
    const shapeGeo = new THREE.OctahedronGeometry(4.5, 1);
    const shapeMat = new THREE.MeshBasicMaterial({
      color: colorRef.current,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const shape = new THREE.Mesh(shapeGeo, shapeMat);
    shape.position.set(0, 4, 0);
    scene.add(shape);
    shapeRef.current = shape;

    // Anillo exterior
    const ringGeo = new THREE.TorusGeometry(7, 0.06, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorRef.current,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Partículas doradas flotantes
    const ptCount = 320;
    const ptPositions = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      ptPositions[i * 3]     = (Math.random() - 0.5) * 80;
      ptPositions[i * 3 + 1] = Math.random() * 30 - 5;
      ptPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPositions, 3));
    const ptMat = new THREE.PointsMaterial({
      color: colorRef.current,
      size: 0.18,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    sceneRef.current  = scene;
    rendRef.current   = renderer;
    cameraRef.current = camera;

    // ── Animación ──────────────────────────────────────────
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.008;
      shape.rotation.y += 0.012;
      shape.rotation.x += 0.006;
      shape.position.y = 4 + Math.sin(t * 1.2) * 0.8;
      ring.rotation.z  += 0.004;
      particles.rotation.y += 0.0008;
      // Actualiza color dinámicamente
      (shapeMat as THREE.MeshBasicMaterial).color.setHex(colorRef.current);
      (ringMat  as THREE.MeshBasicMaterial).color.setHex(colorRef.current);
      (ptMat    as THREE.PointsMaterial).color.setHex(colorRef.current);
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []); // eslint-disable-line
}

// ── HUD overlay (texto estilo Cryptaris) ───────────────────
function HUDOverlay({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      {/* Top-left: número + título */}
      <motion.div
        key={project.id + "tl"}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="absolute top-6 left-8"
      >
        <div className="text-[11px] text-gray-500 tracking-[0.3em] uppercase mb-1">Mission</div>
        <div className="text-5xl font-thin text-white/20 leading-none">{project.num}</div>
        <div className="text-[11px] tracking-[0.2em] uppercase mt-1"
          style={{ color: project.hexColor }}>
          {project.subtitle}
        </div>
      </motion.div>

      {/* Bottom-left: línea de scan */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center px-8 gap-3">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="text-[9px] tracking-[0.3em] text-gray-600 uppercase">
          scanning...
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Top-right: crosshair */}
      <div className="absolute top-6 right-8 flex flex-col items-end gap-1">
        <div className="flex gap-1">
          <div className="w-4 h-[1px] bg-white/20" />
          <div className="w-[1px] h-4 bg-white/20" />
        </div>
        <div className="text-[9px] text-gray-600 tracking-[0.2em]">SYS:ACTIVE</div>
      </div>

      {/* Bordes de esquina */}
      {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos) => (
        <div key={pos} className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
          <div className="absolute top-0 left-0 w-8 h-[1px] bg-white/15" />
          <div className="absolute top-0 left-0 w-[1px] h-8 bg-white/15" />
        </div>
      ))}
    </div>
  );
}

// ── Card de info del proyecto ───────────────────────────────
function ProjectInfo({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-16"
    >
      <div className="max-w-md">
        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.map((t) => (
            <span key={t} className="text-[11px] px-2 py-1 rounded-full border"
              style={{ borderColor: project.hexColor + "40", color: project.hexColor + "cc", background: project.hexColor + "10" }}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pointer-events-auto">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded text-black font-semibold"
              style={{ background: project.hexColor }}>
              ↗ Demo
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded border text-gray-300"
              style={{ borderColor: project.hexColor + "50" }}>
              ⌥ Repo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Canvas wrapper ──────────────────────────────────────────
function TerrainCanvas({ activeColor }: { activeColor: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useThreeScene(canvasRef, activeColor);
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ── Componente principal ────────────────────────────────────
const Projects = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = PROJECTS[activeIdx];

  const VISIBLE_SELECTORS = 3;
  const [selectorStart, setSelectorStart] = useState(0);

  const maxSelectorStart = Math.max(0, PROJECTS.length - VISIBLE_SELECTORS);
  const clampSelectorStart = useCallback(
    (value: number) => Math.max(0, Math.min(value, maxSelectorStart)),
    [maxSelectorStart]
  );

  useEffect(() => {
    // Mantén el proyecto activo visible dentro de la ventana del carrusel
    if (activeIdx < selectorStart) {
      setSelectorStart(clampSelectorStart(activeIdx));
      return;
    }
    if (activeIdx >= selectorStart + VISIBLE_SELECTORS) {
      setSelectorStart(clampSelectorStart(activeIdx - (VISIBLE_SELECTORS - 1)));
    }
  }, [activeIdx, selectorStart, VISIBLE_SELECTORS, clampSelectorStart]);

  return (
    <section id="projects" className="flex flex-col items-center py-20 relative">
      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col items-center mb-10 z-10 relative"
      >
        <motion.div variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-6">
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">Misiones completadas</h1>
        </motion.div>
        <h2 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
          Proyectos
        </h2>
        <p className="text-gray-400 text-center mt-2 text-base">
          Selecciona una misión para explorarla
        </p>
      </motion.div>

      {/* Selector de proyectos */}
      <div className="flex items-center gap-3 mb-4 z-10 relative w-full max-w-5xl px-4">
        <button
          type="button"
          aria-label="Ver anteriores"
          onClick={() => {
            const nextStart = clampSelectorStart(selectorStart - 1);
            setSelectorStart(nextStart);
            if (activeIdx < nextStart || activeIdx >= nextStart + VISIBLE_SELECTORS) {
              setActiveIdx(nextStart);
            }
          }}
          disabled={selectorStart === 0}
          className="h-10 w-10 rounded-full border border-[#7042f861] bg-[#0300145e] text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ←
        </button>

        <div className="flex flex-1 gap-2 justify-center">
          {PROJECTS.slice(selectorStart, selectorStart + VISIBLE_SELECTORS).map((p) => {
            const idx = PROJECTS.findIndex((x) => x.id === p.id);
            const selected = idx === activeIdx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className="flex-1 min-w-0 rounded-xl border px-4 py-3 text-left transition-all duration-300"
                style={{
                  borderColor: selected ? p.hexColor : "#2A0E6160",
                  background: selected ? p.hexColor + "14" : "rgba(3,0,20,0.25)",
                  boxShadow: selected ? `0 0 20px ${p.hexColor}35` : "none",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="font-mono text-xs tracking-[0.2em]"
                    style={{ color: selected ? p.hexColor : "#6b7280" }}
                  >
                    {p.num}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] truncate"
                    style={{ color: selected ? p.hexColor : "#6b7280" }}
                  >
                    {p.subtitle}
                  </span>
                </div>
                <div
                  className="mt-2 text-sm font-medium truncate"
                  style={{ color: selected ? "#e5e7eb" : "#9ca3af" }}
                  title={p.title}
                >
                  {p.title}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Ver siguientes"
          onClick={() => {
            const nextStart = clampSelectorStart(selectorStart + 1);
            setSelectorStart(nextStart);
            if (activeIdx < nextStart || activeIdx >= nextStart + VISIBLE_SELECTORS) {
              setActiveIdx(nextStart);
            }
          }}
          disabled={selectorStart >= Math.max(0, PROJECTS.length - VISIBLE_SELECTORS)}
          className="h-10 w-10 rounded-full border border-[#7042f861] bg-[#0300145e] text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      {/* Escena 3D + HUD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden"
        style={{
          height: 440,
          border: `1px solid ${active.hexColor}25`,
          boxShadow: `0 0 60px ${active.hexColor}18, inset 0 0 60px rgba(0,0,0,0.5)`,
          background: "rgba(3,0,20,0.85)",
        }}
      >
        {/* Canvas Three.js */}
        <div className="absolute inset-0">
          <TerrainCanvas activeColor={active.color} />
        </div>

        {/* Glow central */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${active.hexColor}15 0%, transparent 65%)`,
            transition: "background 0.5s ease",
          }}
        />

        {/* HUD texto */}
        <HUDOverlay project={active} />

        {/* Info del proyecto */}
        <ProjectInfo key={active.id} project={active} />
      </motion.div>
    </section>
  );
};

export default Projects;