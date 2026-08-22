"use client";

/**
 * ParticleGlobe
 * ────────────────────────────────────────────────────────────────
 * Esfera hecha de puntos distribuidos con el algoritmo de Fibonacci
 * (distribución uniforme real, no aleatoria — por eso se ven anillos
 * limpios en los polos, igual que en tu imagen de referencia), con
 * rotación lenta y un par de anillos orbitales tipo "globo terráqueo
 * tecnológico" (inspirado en las referencias de Nexora).
 *
 * Se pausa automáticamente cuando la pestaña no está visible
 * (usePageVisibility) y libera todos los recursos de Three.js al
 * desmontar, igual que el resto de canvases del proyecto.
 */

import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { usePageVisibility } from "@/hooks/usePageVisibility";

export interface ParticleGlobeProps {
  size?: number;
  count?: number;
  color?: string;
}

export default function ParticleGlobe({
  size = 220,
  count = 1100,
  color = "#a78bfa",
}: ParticleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = usePageVisibility();
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    // ── Esfera de puntos (distribución de Fibonacci) ────────────
    const positions = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.028,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Anillo ecuatorial fino (acento tipo "globo tecnológico") ─
    const ringGeo = new THREE.RingGeometry(1.35, 1.36, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#22d3ee"),
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);

    const ring2 = new THREE.Mesh(ringGeo.clone(), ringMat.clone());
    ring2.scale.setScalar(1.18);
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.15;
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.z = 0.4;
    scene.add(ring2);

    let rafId: number;
    let disposed = false;
    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;
      const delta = clock.getDelta();
      points.rotation.y += delta * 0.12;
      ring.rotation.z += delta * 0.05;
      ring2.rotation.z -= delta * 0.03;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [size, count, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none"
      aria-hidden
    />
  );
}
