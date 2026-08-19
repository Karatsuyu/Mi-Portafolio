# 🔍 DIAGNÓSTICO: Lag en Hero Section (Runic) + StarBackground en otros temas

**Fecha**: 2025-01-XX  
**Análisis solicitado**: Solo diagnóstico, sin implementar soluciones

---

## 🚨 PROBLEMA 1: Hero Section (Home) va lentísimo en Runic

### Causas Identificadas:

#### 1. **150 ESTRELLAS con animaciones complejas** (CAUSA PRINCIPAL)
**Ubicación**: `useDynamicEffects.ts` → función `nebulaStars()`
```typescript
const starCount = 150;  // ← 150 ESTRELLAS GENERADAS
for (let i = 0; i < starCount; i++) {
  // Cada estrella tiene:
  // - starTwinkle animation (variable 4-10s)
  // - starGlow animation (variable 1.4-4.4s)
  // - filter: drop-shadow()
  // - box-shadow
  // - mix-blend-mode: screen
}
```

**Impacto**:
- 150 elementos DOM creados dinámicamente
- 300 animaciones CSS corriendo simultáneamente (2 por estrella)
- `filter: drop-shadow()` en cada estrella (GPU-heavy)
- `box-shadow` en cada estrella (GPU-heavy)
- `mix-blend-mode: screen` fuerza stacking contexts separados

**Estado actual**:
- ✅ Se agregó `.is-visible` class control
- ❌ PERO las estrellas se generan en el `home-nebula` que está DENTRO del `#home` con ref
- ❌ Las 150 estrellas se crean apenas carga la página (useEffect inicial)
- ✅ Sí se pausan cuando scrolleas fuera PERO el lag inicial ya existe

---

#### 2. **16 Runas rotando continuamente**
**Ubicación**: `.outer-rune-circle` → 16 caracteres runic
```css
.outer-rune-circle {
  animation: rotateCircle 20s linear infinite;  /* Rota todo el círculo */
}
.outer-rune-circle .runes span {
  transform: rotate(...) translate(...) rotate(...);  /* Transform en cada runa */
  filter: drop-shadow(0 0 6px var(--accent-glow));  /* GPU-heavy */
}
```

**Impacto**:
- 16 elementos con `filter: drop-shadow()` cada uno
- Rotación continua del contenedor padre (20s infinite)
- 16 transforms individuales calculándose continuamente

---

#### 3. **60 Ticks del radar SVG**
**Ubicación**: `useDynamicEffects.ts` → función `radarTicks()`
```typescript
for (let i = 0; i < 360; i += 6) {  // 360/6 = 60 ticks
  // Crea 60 líneas SVG con clase .tick
}
```

**Impacto**: Menor, pero aún son 60 elementos SVG adicionales

---

#### 4. **Múltiples layers con filter y blur**
- `.radar-glow`: `filter: blur(30px)` + gradiente radial grande
- `.center-image`: `filter: drop-shadow()` doble
- `.menu-nebula`: `filter: blur(6px)` fixed position
- `.home-nebula`: gradientes múltiples + `filter: blur(3px)`

**Impacto**: Cada `filter` fuerza una nueva layer en GPU

---

#### 5. **Animaciones sin pausa inicial**
```css
.home-nebula .star {
  animation-play-state: paused;
}

.home-nebula.is-visible .star {
  animation-play-state: running;
}
```

**Problema**: 
- Las 150 estrellas se crean con `animation-play-state: paused` por defecto
- PERO cuando el hero entra en viewport (que es INMEDIATAMENTE al cargar), se activan TODAS
- No hay delay/stagger, todas se activan al mismo tiempo

---

### 📊 Resumen de Lag en Hero:

| Elemento | Cantidad | Animaciones | Filters GPU-heavy |
|----------|----------|-------------|-------------------|
| **Estrellas nebulosa** | 150 | 300 (2 cada una) | 150x drop-shadow + box-shadow |
| **Runas rotando** | 16 | 1 (rotate parent) | 16x drop-shadow |
| **Radar ticks SVG** | 60 | 0 | 0 |
| **Layers con filter** | 4 | 1 (menu drift) | 4x blur/drop-shadow |
| **TOTAL** | **230 elementos** | **302 animaciones** | **170 filters** |

---

## 🚨 PROBLEMA 2: StarBackground (Space) cargándose en otros temas

### ✅ BUENAS NOTICIAS: NO está cargándose en Runic/Cyber

**Verificación en código**:

```typescript
// components/global/LayoutContent.tsx
export default function LayoutContent({ children }) {
  const pathname = usePathname();

  // ✅ CORRECTO: Runic y Cyber retornan solo children
  if (pathname && (pathname.startsWith("/runic") || pathname.startsWith("/cyber"))) {
    return <>{children}</>;
  }

  // ⚠️ StarBackground SOLO se carga aquí (Space y Classic)
  return (
    <>
      <StarsCanvas />  {/* ← Solo para Space/Classic */}
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
```

**Conclusión**: 
- ✅ **StarBackground (Three.js) NO se carga en Runic**
- ✅ **StarBackground (Three.js) NO se carga en Cyber**
- ⚠️ **StarBackground SÍ se carga en Classic** (pero Classic es ligero)

**PERO** hay confusión de nombres:
- `StarBackground` = Three.js component (Space theme)
- `.home-nebula .star` = Estrellas CSS de Runic (diferentes, hechas con `<span>`)

Son cosas completamente diferentes. El lag de Runic NO es por StarBackground de Three.js.

---

## 💡 SOLUCIONES PROPUESTAS (No implementadas aún)

### Para el Lag del Hero de Runic:

#### Opción 1: Reducir cantidad de estrellas (FÁCIL - Alto impacto)
```typescript
// useDynamicEffects.ts
const starCount = 150;  // ← Reducir a 50-80
```
**Impacto**: Reducción de 70-100 elementos y 140-200 animaciones
**Riesgo visual**: Menor - aún habrá suficientes estrellas

---

#### Opción 2: Eliminar `filter: drop-shadow()` de las estrellas (MEDIO - Alto impacto)
```css
.home-nebula .star {
  /* ANTES */
  filter: drop-shadow(0 0 12px var(--accent-glow));
  box-shadow: 0 0 10px var(--accent-glow);
  
  /* DESPUÉS */
  /* filter: drop-shadow() removido */
  box-shadow: 0 0 10px var(--accent-glow);  /* Suficiente con box-shadow */
}
```
**Impacto**: Eliminación de 150 operaciones GPU-heavy
**Riesgo visual**: Muy menor - box-shadow es suficiente para el glow

---

#### Opción 3: Stagger la activación de animaciones (MEDIO - Medio impacto)
```typescript
// En useDynamicEffects, al crear cada estrella:
rune.style.animationPlayState = 'paused';
setTimeout(() => {
  rune.style.animationPlayState = 'running';
}, i * 20);  // Activar progresivamente
```
**Impacto**: Reduce carga inicial, las animaciones se activan gradualmente
**Riesgo visual**: Ninguno - usuario no notará el stagger de 20ms

---

#### Opción 4: Lazy-generate las estrellas (COMPLEJO - Alto impacto)
- No crear las 150 estrellas inmediatamente
- Crear solo 30-40 inicialmente
- Agregar más progresivamente en siguientes frames

**Impacto**: Carga inicial muchísimo menor
**Complejidad**: Alta - requiere refactor de useDynamicEffects

---

#### Opción 5: Eliminar `filter: drop-shadow()` de runas rotando (FÁCIL - Medio impacto)
```css
.outer-rune-circle .runes span {
  /* filter: drop-shadow(0 0 6px var(--accent-glow)); */ /* ← Remover */
  text-shadow: 0 0 8px var(--accent-glow);  /* Suficiente */
}
```
**Impacto**: Eliminación de 16 operaciones GPU-heavy
**Riesgo visual**: Ninguno - text-shadow es suficiente

---

#### Opción 6: Reducir complejidad del radar (FÁCIL - Bajo impacto)
```typescript
// Reducir ticks de 60 a 30
for (let i = 0; i < 360; i += 12) {  // 360/12 = 30 ticks
```
**Impacto**: 30 elementos menos
**Riesgo visual**: Menor - el radar sigue viéndose detallado

---

### Para StarBackground en Classic (Opcional):

#### Opción 7: Solo cargar StarBackground en Space
```typescript
// LayoutContent.tsx
if (pathname && (pathname.startsWith("/runic") || 
                 pathname.startsWith("/cyber") ||
                 pathname.startsWith("/classic"))) {
  return <>{children}</>;
}
```
**Nota**: Esto es opcional, Classic no reporta lag actualmente

---

## 🎯 RECOMENDACIÓN PRIORIZADA

### Alto impacto + Fácil implementación:
1. ✅ **Reducir estrellas de 150 → 60** (Opción 1)
2. ✅ **Eliminar `filter: drop-shadow()` de estrellas** (Opción 2)
3. ✅ **Eliminar `filter: drop-shadow()` de runas rotando** (Opción 5)

**Resultado esperado**: 
- 90 elementos menos (150→60 estrellas)
- 180 animaciones menos
- 166 filters GPU-heavy eliminados (150 estrellas + 16 runas)
- **~70-80% mejora de performance** en hero section

### Medio impacto + Complejidad media:
4. ⚠️ **Stagger activación de animaciones** (Opción 3)
5. ⚠️ **Reducir ticks del radar 60→30** (Opción 6)

### Bajo impacto (no prioritario):
6. ❌ **StarBackground solo en Space** (Opción 7) - Classic no tiene problemas

---

## 📝 NOTAS FINALES

### Verificado:
- ✅ StarBackground (Three.js) **NO se carga en Runic**
- ✅ StarBackground (Three.js) **NO se carga en Cyber**
- ⚠️ StarBackground (Three.js) **SÍ se carga en Classic** (pero es opcional optimizar)

### Problema real:
- ❌ **150 estrellas CSS con 300 animaciones + 150 filters** en Runic hero
- ❌ **16 runas con drop-shadow** rotando continuamente
- ❌ **Todas las animaciones se activan simultáneamente** al cargar

### Causa del lag:
- No es Three.js
- No es StarBackground de Space
- Es la **combinación de 150 estrellas CSS + filters GPU-heavy + animaciones simultáneas**

---

**DIAGNÓSTICO COMPLETO - Esperando instrucciones para implementar soluciones**
