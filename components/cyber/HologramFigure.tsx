'use client';

import { useEffect, useRef, Suspense, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Torus, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { isWebGLAvailable } from '@/utils/webgl';

const USE_SPLINE = true;
const SPLINE_SCENE_URL = 'https://prod.spline.design/vxWjLMlors8Buvrx/scene.splinecode';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

class ErrorBoundary extends (require('react').Component as typeof import('react').Component)<
  { onError?: (error: unknown) => void; fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ── Geometría central: esfera distorsionada holográfica ──────
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(state => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="#00f5ff"
          emissive="#001a2e"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.1}
          distort={0.35}
          speed={2}
          wireframe={false}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  );
}

// ── Anillos orbitales (como hologramas de datos) ─────────────
function OrbitalRing({ radius, tilt, color, speed }: {
  radius: number;
  tilt: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });

  return (
    <Torus
      ref={ref}
      args={[radius, 0.012, 8, 120]}
      rotation={[Math.PI / 2 + tilt, tilt * 0.5, 0]}
    >
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </Torus>
  );
}

// ── Partículas flotantes tipo datos ─────────────────────────
function DataParticles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const col  = new Float32Array(count * 3);
    const cyan   = new THREE.Color('#00f5ff');
    const green  = new THREE.Color('#00ff88');
    const purple = new THREE.Color('#a855f7');
    const palette = [cyan, green, purple];

    for (let i = 0; i < count; i++) {
      const r     = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ── Grilla holográfica de suelo ──────────────────────────────
function HologramGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame(state => {
    if (!gridRef.current) return;
    (gridRef.current.material as THREE.Material).opacity =
      0.15 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[20, 20, '#00f5ff', '#001a2e']}
      position={[0, -2.2, 0]}
    >
      <meshBasicMaterial transparent opacity={0.15} />
    </gridHelper>
  );
}

// ── Luz ambiental + point lights ─────────────────────────────
function Lights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(state => {
    const t = state.clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.7) * 3;
      light1Ref.current.position.y = Math.cos(t * 0.5) * 2;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.6) * -3;
      light2Ref.current.position.z = Math.sin(t * 0.4) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight ref={light1Ref} color="#00f5ff" intensity={3} distance={8} />
      <pointLight ref={light2Ref} color="#00ff88" intensity={2} distance={6} />
      <pointLight position={[0, 4, 0]} color="#a855f7" intensity={1.5} distance={10} />
    </>
  );
}

// ── Escena completa ──────────────────────────────────────────
function Scene() {
  return (
    <>
      <Lights />
      <Stars
        radius={30}
        depth={40}
        count={1500}
        factor={3}
        saturation={0.5}
        fade
        speed={0.4}
      />
      <CoreSphere />
      <OrbitalRing radius={2.0} tilt={0}    color="#00f5ff" speed={0.5}  />
      <OrbitalRing radius={2.5} tilt={0.5}  color="#00ff88" speed={-0.3} />
      <OrbitalRing radius={1.7} tilt={-0.8} color="#a855f7" speed={0.7}  />
      <DataParticles count={150} />
      <HologramGrid />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        makeDefault
      />
    </>
  );
}

function ThreeFallback() {
  if (!isWebGLAvailable()) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

// ── Componente exportado ─────────────────────────────────────
export default function HologramFigure() {
  const [splineEnabled, setSplineEnabled] = useState(USE_SPLINE);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (webglOk === false) return null;
  if (webglOk === null) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(45vw, 500px)',
        height: 'min(45vw, 500px)',
        zIndex: 8,
        pointerEvents: 'auto',
      }}
    >
      {/* Glow background */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {splineEnabled ? (
        <ErrorBoundary fallback={<ThreeFallback />} onError={() => setSplineEnabled(false)}>
          <Spline
            scene={SPLINE_SCENE_URL}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </ErrorBoundary>
      ) : (
        <ThreeFallback />
      )}

      {/* Label holográfico */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '-1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(0,245,255,0.4)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        ◈ hologram.render() ◈
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   NOTA: Para usar Spline en lugar de (o junto a) Three.js,
   reemplaza la sección <Canvas> por:

   import Spline from '@splinetool/react-spline';

   <Spline
     scene="https://prod.spline.design/vxWjLMlors8Buvrx/scene.splinecode"
     style={{ width: '100%', height: '100%' }}
     onLoad={(splineApp) => {
       // puedes acceder a la escena aquí
     }}
   />

   El componente Three.js de arriba es el fallback futurista
   integrado que no depende de Spline estando disponible.
──────────────────────────────────────────────────────────── */