# Modal "Sobre mí" — Tema Space

## Archivos

```
components/main/about/aboutData.ts          → bio + las 9 competencias (edítalo aquí si cambia el texto)
components/main/about/ConstellationFrame.tsx → marco de estrellas conectadas para el borde
components/main/about/ParticleGlobe.tsx      → esfera de partículas (Three.js) decorativa
components/main/about/SpaceAboutModal.tsx    → el modal completo, ensambla todo lo anterior
```

No agregan dependencias nuevas: usan `three`, `framer-motion` y `@heroicons/react`,
que ya están en tu `package.json`.

## Uso

```tsx
"use client";
import { useState } from "react";
import SpaceAboutModal from "@/components/main/about/SpaceAboutModal";

export default function DondeSea() {
  const [openAbout, setOpenAbout] = useState(false);

  return (
    <>
      <button onClick={() => setOpenAbout(true)}>Sobre mí</button>
      {openAbout && <SpaceAboutModal onClose={() => setOpenAbout(false)} />}
    </>
  );
}
```

Tú decides desde dónde lo abres (un botón en el Hero, en el Navbar, etc.) —
el componente solo necesita `onClose`.

## Qué incluye

- **Marco de constelación**: estrellas titilando + líneas que "fluyen" por
  todo el perímetro del modal (SVG puro, se estira solo con el modal).
- **Esfera de partículas**: distribución real de Fibonacci (no aleatoria,
  por eso se ven anillos limpios en los polos, como tu imagen de
  referencia), con dos anillos orbitales tipo "globo tecnológico". Se
  pausa sola cuando cambias de pestaña y libera memoria al cerrar el modal.
- **Sección bio**: mismo texto que en Classic, con entrada animada
  escalonada por párrafo.
- **Competencias Profesionales**: las 9 tarjetas en el mismo orden que
  Classic (código → título → descripción), pero con insignia circular,
  hover con elevación + glow, patrón de circuito de fondo muy sutil, y
  animación de entrada escalonada al hacer scroll.

## Personalización rápida

- Colores: busca `purple-400` / `cyan-400` / `#a855f7` / `#22d3ee` en
  `SpaceAboutModal.tsx` y `ParticleGlobe.tsx` si quieres otra paleta.
- Cantidad de puntos de la esfera: prop `count` de `<ParticleGlobe />`
  (1100 por defecto — baja a ~600 si algún día lo usas en muchos lugares
  a la vez).
