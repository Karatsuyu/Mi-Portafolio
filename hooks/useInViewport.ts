"use client";

import { useEffect, useState, RefObject } from "react";

/**
 * Hook para detectar si un elemento está en el viewport
 * Útil para pausar animaciones fuera de la vista
 */
export function useInViewport(
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
}
