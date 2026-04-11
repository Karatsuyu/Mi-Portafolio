"use client";
import { usePathname } from "next/navigation";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import { isWebGLAvailable } from "@/utils/webgl";

class CanvasErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; onError?: (error: unknown) => void; children: React.ReactNode },
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
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

const StarBackground = (props: any) => {
  const ref: any = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta/10;
    ref.current.rotation.y -= delta/15;
  })


  return (
    <group rotation={[0,0, Math.PI / 4]}>
        <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled
        {...props}
        >
            <PointMaterial
                transparent
              color="#fff"
                size={0.002}
                sizeAttenuation={true}
              depthWrite={false}
            />
        </Points>
    </group>
  )
};

const StarsCanvas = () => {
  const pathname = usePathname();
  // Hide star background on Classic routes only
  if (pathname?.startsWith("/classic")) {
    return null;
  }

  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (disabled || webglOk === false) return null;
  if (webglOk === null) return null;

  return (
    <CanvasErrorBoundary onError={() => setDisabled(true)}>
      <div className="w-full h-auto fixed inset-0 z-[20] pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 1] }}
          style={{ pointerEvents: "none" }}
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <StarBackground />
          </Suspense>
          <Preload all />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}

export default StarsCanvas;
