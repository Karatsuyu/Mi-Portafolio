"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar si la página está visible (no en otra pestaña)
 * Útil para pausar animaciones cuando el usuario cambia de pestaña
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}
