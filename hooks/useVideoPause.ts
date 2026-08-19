"use client";

import { useEffect, useRef } from "react";

/**
 * Hook para pausar videos cuando están fuera del viewport
 * Útil para optimizar rendimiento con múltiples videos en página
 */
export function useVideoPause<T extends HTMLElement = HTMLElement>(threshold: number = 0.1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Encontrar todos los videos dentro del elemento
        const videos = element.querySelectorAll('video');
        
        if (entry.isIntersecting) {
          // Play videos cuando entran al viewport
          videos.forEach(video => {
            if (video.paused && video.hasAttribute('autoplay')) {
              video.play().catch(() => {
                // Ignorar errores de autoplay si el navegador lo bloquea
              });
            }
          });
        } else {
          // Pausar videos cuando salen del viewport
          videos.forEach(video => {
            if (!video.paused) {
              video.pause();
            }
          });
        }
      },
      {
        threshold,
        rootMargin: '50px', // Activar un poco antes de salir
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return ref;
}
