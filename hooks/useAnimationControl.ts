"use client";

import { useEffect, useRef } from "react";

/**
 * Hook para controlar animaciones CSS basado en visibilidad del elemento
 * Agrega clase 'is-visible' cuando el elemento está en viewport
 * Útil para pausar animaciones pesadas fuera de pantalla
 */
export function useAnimationControl<T extends HTMLElement = HTMLElement>(threshold: number = 0.1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
        } else {
          element.classList.remove('is-visible');
        }
      },
      {
        threshold,
        rootMargin: '50px', // Activar un poco antes de entrar
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return ref;
}
