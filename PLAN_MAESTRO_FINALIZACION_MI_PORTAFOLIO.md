# PLAN MAESTRO DE FINALIZACIÓN --- MI PORTAFOLIO

> **Objetivo:** terminar, estabilizar, profesionalizar y preparar para\
> release el portafolio actual sin rehacer funcionalidades que ya\
> existen.

---

# ÍNDICE

1. Principios del plan
2. Estado real actual
3. Etapa 1 --- Deuda técnica
4. Etapa 2 --- Seguridad
5. Etapa 3 --- Arquitectura de datos
6. Etapa 4 --- Proyectos y Case Studies
7. Etapa 5 --- Multimedia y demos
8. Etapa 6 --- SEO
9. Etapa 7 --- Accesibilidad
10. Etapa 8 --- Rendimiento
11. Etapa 9 --- QA Responsive
12. Etapa 10 --- CV
13. Etapa 11 --- Contacto
14. Etapa 12 --- README y documentación
15. Etapa 13 --- Analytics y visitas
16. Etapa 14 --- Testing y CI/CD
17. Etapa 15 --- Internacionalización
18. Características opcionales
19. Orden exacto de implementación
20. Checklist de release

---

# 1. PRINCIPIOS DEL PLAN

## 1.1. Este plan NO busca

- Rehacer los cuatro temas.
- Crear otra sección de experiencia.
- Crear otro sistema de proyectos.
- Crear otro sistema de habilidades.
- Crear otro CV.
- Reemplazar componentes que ya funcionan únicamente por cambiar la\
  arquitectura.
- Añadir extras antes de cerrar problemas críticos.
- Simplificar el proyecto hasta convertirlo en un portafolio\
  tradicional.

## 1.2. Principio central

El proyecto debe tratarse como:

> **Un portafolio con cuatro experiencias visuales diferentes,**\
> **componentes compartidos y datos que deben mantenerse consistentes.**

Toda mejora debe respetar:

1. La identidad visual de Space.
2. La identidad visual de Classic.
3. La identidad visual de Runic.
4. La identidad visual de Cyber.
5. La arquitectura que ya funciona.
6. La reutilización de datos.
7. La estabilidad del proyecto.

## 1.3. Orden de prioridad

1. Estabilidad.
2. Seguridad.
3. Consistencia.
4. Calidad profesional de los proyectos.
5. SEO.
6. Accesibilidad.
7. Rendimiento.
8. QA responsive.
9. Documentación.
10. Analytics, testing, CI/CD e i18n.
11. Extras.

---

# 2. ESTADO REAL ACTUAL DEL PROYECTO

## 2.1. Arquitectura ya implementada

- [x] Next.js.
- [x] React.
- [x] TypeScript.
- [x] Tailwind CSS.
- [x] Framer Motion.
- [x] Three.js / WebGL.
- [x] Supabase.
- [x] React PDF.
- [x] Sistema de múltiples temas.
- [x] Rutas y componentes por tema.
- [x] Componentes compartidos.
- [x] Datos parcialmente centralizados.

## 2.2. Cuatro temas ya implementados

- [x] Space.
- [x] Classic.
- [x] Runic.
- [x] Cyber.

## 2.3. Secciones principales ya implementadas

- [x] Hero.
- [x] Sobre mí.
- [x] Habilidades.
- [x] Proyectos.
- [x] Experiencia.
- [x] Formación.
- [x] Certificados.
- [x] Contacto.
- [x] CV.

## 2.4. Proyectos ya implementados

- [x] `UNIFIED_PROJECTS`.
- [x] Datos ordenados.
- [x] Timeline de proyectos.
- [x] Modal para Space.
- [x] Modal para Runic.
- [x] Modal para Cyber.
- [x] Implementación para Classic.
- [x] Vídeos de proyectos.

## 2.5. Habilidades ya implementadas

- [x] `UNIFIED_SKILLS`.
- [x] Categorías.
- [x] Niveles.
- [x] Años.
- [x] Iconos.
- [x] Representaciones visuales específicas.

## 2.6. Experiencia ya implementada

- [x] Timeline.
- [x] Experience.
- [x] SpaceExperiencia.
- [x] Experiencia Cyber.
- [x] Experiencia Classic.
- [x] Interacciones.
- [x] Selección y detalle.
- [x] Trabajo responsive existente.

## 2.7. Formación y certificados

- [x] Secciones implementadas.
- [x] Datos asociados.
- [x] Diseños específicos por tema.

## 2.8. CV

- [x] `CVDocument.tsx`.
- [x] PDF.
- [x] Generación/endpoint.
- [x] Descarga integrada.

## 2.9. Contacto

- [x] Formulario.
- [x] Validación.
- [x] Estados loading/success/error.
- [x] API `/api/contact`.
- [x] Integración con Supabase.
- [x] Versiones para los temas.

## 2.10. APIs existentes

- [x] `/api/contact`.
- [x] `/api/projects`.
- [x] `/api/visits`.

## 2.11. Responsive

El responsive ya existe.

La tarea pendiente no es "hacer responsive", sino:

> **auditar todos los tamaños y corregir casos concretos.**

## 2.12. Animaciones

- [x] Three.js.
- [x] Canvas.
- [x] Partículas.
- [x] Orbitales.
- [x] SVG.
- [x] Framer Motion.
- [x] Animaciones CSS.
- [x] Efectos específicos por tema.

---

# 3. ETAPA 1 --- CERRAR DEUDA TÉCNICA

**Prioridad: CRÍTICA**

## 3.1. Crear punto estable

Antes de modificar:

1. Hacer commit del estado actual.
2. Crear rama de trabajo si es necesario.
3. Opcionalmente crear un tag.

Ejemplo:

```text
portfolio-pre-finalization
```

- [ ] Punto estable creado.

## 3.2. Ejecutar TypeScript

```bash
npx tsc --noEmit
```

Objetivo:

```text
0 errores
```

### Revisar especialmente

Archivos auxiliares o experimentales como:

```text
Space_Projects_fix.tsx
Qwen_*.jsx
proyectos_page.tsx
```

Para cada archivo:

1. ¿Se usa?
2. ¿Es una versión anterior?
3. ¿Es un prototipo?
4. ¿Debe integrarse?
5. ¿Debe archivarse?
6. ¿Debe eliminarse?

Corregir:

- imports rotos;

- módulos inexistentes;

- tipos `any` innecesarios;

- componentes duplicados.

- [ ] `tsc --noEmit` sin errores.

## 3.3. Limpiar código muerto

No eliminar archivos automáticamente.

Primero determinar si forman parte del flujo real.

- [ ] Sin archivos experimentales accidentalmente incluidos.
- [ ] Sin componentes duplicados sin propósito.
- [ ] Sin imports innecesarios.

## 3.4. Lint

Ejecutar el comando configurado.

- [ ] 0 errores.
- [ ] Warnings revisados uno por uno.
- [ ] No silenciar problemas sin entenderlos.

## 3.5. Build

```bash
npm run build
```

Revisar:

- rutas;
- imports;
- variables de entorno;
- componentes client/server;
- imágenes;
- APIs;
- CV.
- [ ] Build exitoso.

## 3.6. Consola de producción

Buscar:

- errores;

- hydration mismatch;

- recursos que no cargan;

- errores de API;

- vídeos;

- WebGL;

- navegación.

- [ ] Sin errores relevantes.

---

# 4. ETAPA 2 --- SEGURIDAD DE APIs Y SUPABASE

**Prioridad: CRÍTICA**

## 4.1. Auditar `/api/contact`

El formulario ya existe. Solo debe endurecerse.

Validar en servidor:

- nombre;

- email;

- mensaje;

- longitud mínima;

- longitud máxima;

- payload máximo;

- normalización de entradas.

- [ ] Validación server-side completa.

## 4.2. Revisar `GET /api/contact`

Auditar prioritariamente.

Si permite consultar mensajes privados públicamente, debe cambiarse.

### Opción A

Eliminar GET si no es necesario.

### Opción B

Protegerlo mediante autenticación y autorización.

Nunca permitir que un visitante público pueda leer mensajes privados.

- [ ] Endpoint eliminado o protegido.

## 4.3. Rate limiting

Aplicar a:

- `/api/contact`;

- otros endpoints vulnerables al abuso.

- [ ] Solicitudes ilimitadas bloqueadas.

## 4.4. Anti-spam

Implementar primero:

1. Honeypot.
2. Rate limiting.
3. Validación server-side.

Añadir CAPTCHA/Turnstile solo si realmente es necesario.

- [ ] Protección básica contra bots.

## 4.5. Auditoría de Supabase

Revisar:

- RLS;

- políticas;

- tablas públicas;

- permisos;

- service role.

- [ ] Secretos no expuestos.

- [ ] Datos privados protegidos.

- [ ] Políticas mínimas necesarias.

## 4.6. Variables de entorno

Revisar:

```text
.env
.env.local
variables de despliegue
```

- [ ] Secretos fuera de Git.
- [ ] `.gitignore` correcto.
- [ ] Variables públicas únicamente cuando corresponde.

## 4.7. Headers de seguridad

Evaluar:

- Content-Security-Policy.

- X-Content-Type-Options.

- Referrer-Policy.

- Permissions-Policy.

- [ ] Configurados sin romper recursos necesarios.

---

# 5. ETAPA 3 --- CONSOLIDAR LA ARQUITECTURA DE DATOS

**Prioridad: ALTA**

No crear otra arquitectura. Terminar la unificación existente.

## 5.1. Inventario

Revisar:

```text
constants/projects.ts
ProjectsData.ts
SkillsData.ts
CertificadosData.ts
ContactData.ts
constants/index.ts
```

Crear una tabla de:

- dominio;

- fuente actual;

- fuente definitiva.

- [ ] Inventario completado.

## 5.2. Información personal central

Centralizar:

```text
name
professionalTitle
shortDescription
email
github
linkedin
location
cvUrl
availability
```

- [ ] Una fuente principal de información personal.

## 5.3. Proyectos

`UNIFIED_PROJECTS` ya existe.

Eliminar duplicaciones de:

- título;

- descripción;

- tecnologías;

- URLs;

- vídeos;

- imágenes.

- [ ] Una fuente principal por proyecto.

## 5.4. Decidir `/api/projects`

Elegir una arquitectura:

### Opción A --- Estática

Fuente central del repositorio.

### Opción B --- Supabase como CMS

Fuente remota para administrar proyectos.

No mantener dos fuentes de verdad sin sincronización clara.

- [ ] Arquitectura definitiva elegida.

## 5.5. Habilidades

Revisar:

- duplicados;
- niveles;
- años;
- categorías.

Los porcentajes pueden conservarse visualmente, pero el significado debe\
poder traducirse a:

```text
Básico
Intermedio
Avanzado
Especializado
```

- [ ] Skills consistentes y defendibles.

## 5.6. Certificados

Modelo recomendado:

```text
id
name
issuer
date
credentialId
credentialUrl
category
expiration
image
```

- [ ] Datos consistentes entre temas.

## 5.7. Experiencia y formación

Modelo:

```text
Datos centrales
    ↓
Adaptador Space
Adaptador Classic
Adaptador Runic
Adaptador Cyber
```

- [ ] Un cambio de contenido no obliga a editarlo cuatro veces.

---

# 6. ETAPA 4 --- PROYECTOS Y CASE STUDIES

**Prioridad: MUY ALTA**

## 6.1. Elegir 3--4 proyectos principales

No todos necesitan el mismo nivel de detalle.

- [ ] Proyectos principales seleccionados.

## 6.2. Estructura de cada Case Study

1. Resumen.
2. Problema.
3. Objetivo.
4. Rol.
5. Solución.
6. Arquitectura.
7. Tecnologías.
8. Decisiones técnicas.
9. Funcionalidades.
10. Desafíos.
11. Solución de desafíos.
12. Resultados reales.
13. Evidencia.

### Arquitectura

Representar la arquitectura real, por ejemplo:

```text
Frontend
   ↓
API
   ↓
Backend
   ↓
Base de datos
```

### Resultados

Solo datos reales:

- módulos;
- endpoints;
- funcionalidades;
- pruebas;
- Lighthouse;
- tiempos medidos.

Nunca inventar usuarios o porcentajes.

## 6.3. Integrar en modales existentes

Ampliar datos con:

```text
problem
objective
solution
architecture
technicalDecisions
features
challenges
results
media
```

Cada tema lo representa a su manera.

- [ ] Datos compartidos.
- [ ] Identidad visual conservada.
- [ ] Proyectos principales documentados.

---

# 7. ETAPA 5 --- SISTEMA MULTIMEDIA Y DEMOS

**Prioridad: ALTA**

## 7.1. Galería

Ampliar el proyecto:

```text
images[]
video
```

Cada imagen:

```text
src
alt
caption
type
```

## 7.2. Screenshots

Por proyecto principal:

- [ ] Imagen principal.
- [ ] 2--5 capturas útiles.
- [ ] Alt descriptivo.

## 7.3. Vídeos

Optimizar:

- formato;
- peso;
- poster;
- preload;
- lazy loading.

## 7.4. Demos

Priorizar los 3 proyectos principales.

Ideal:

```text
GitHub
Vídeo
Screenshots
Demo, si aplica
```

---

# 8. ETAPA 6 --- SEO

**Prioridad: MUY ALTA**

## 8.1. Idioma global

Revisar:

```html
<html lang="en">
```

Usar el idioma real del contenido principal.

## 8.2. Metadata global

Definir:

- title;
- description;
- metadata base;
- autor.

## 8.3. Metadata por página

Configurar para:

- inicio;
- proyectos;
- experiencia;
- habilidades;
- formación;
- certificados;
- contacto.

## 8.4. Open Graph

- [ ] `og:title`.
- [ ] `og:description`.
- [ ] `og:image`.
- [ ] `og:type`.
- [ ] URL.

## 8.5. Twitter/X Cards

- [ ] Configuradas.

## 8.6. Canonical

- [ ] URL canónica.

## 8.7. Sitemap

- [ ] Rutas públicas indexables.

## 8.8. robots.txt

- [ ] Rutas permitidas y excluidas.

## 8.9. JSON-LD

Evaluar:

- `Person`;

- `WebSite`;

- `CreativeWork`;

- `SoftwareApplication` cuando corresponda.

- [ ] SEO completo.

---

# 9. ETAPA 7 --- ACCESIBILIDAD

**Prioridad: ALTA**

## 9.1. Teclado

Probar:

- Tab;
- Shift + Tab;
- Enter;
- Escape;
- Space.

Revisar:

- navegación;
- modales;
- botones;
- formularios;
- cambio de tema.

## 9.2. Focus

Todo elemento interactivo debe tener focus visible.

- [ ] Focus accesible.

## 9.3. Modales

Cada modal debe:

- recibir foco;

- mantenerlo correctamente;

- cerrar con Escape;

- devolver foco al disparador;

- usar semántica adecuada.

- [ ] Gestión de foco.

## 9.4. ARIA

Auditar:

```text
aria-label
aria-expanded
aria-controls
aria-hidden
role
```

## 9.5. Imágenes

- [ ] Alt útil para imágenes informativas.
- [ ] Tratamiento correcto de decorativas.

## 9.6. Contraste

Auditar especialmente:

- Cyber;
- Runic;
- texto sobre vídeo;
- texto sobre fondos animados;
- hover.

## 9.7. Reduced Motion

Implementar:

```css
@media (prefers-reduced-motion: reduce)
```

Reducir:

- partículas;

- orbitales;

- parallax;

- transiciones intensas;

- autoplay no esencial.

- [ ] Soporte completo sin destruir el diseño.

---

# 10. ETAPA 8 --- RENDIMIENTO

**Prioridad: ALTA**

## 10.1. Medir primero

Auditar:

- Performance.
- Accessibility.
- Best Practices.
- SEO.
- Core Web Vitals.

## 10.2. Vídeos

Revisar:

- `blackhole.webm`;
- vídeos de proyectos;
- fondos.

Optimizar:

- formato;
- peso;
- poster;
- carga diferida.

## 10.3. Imágenes

Revisar:

- dimensiones;
- peso;
- formato;
- lazy loading.

## 10.4. Three.js/WebGL

Evaluar:

- carga por ruta;
- imports dinámicos;
- pausa fuera de viewport;
- dispositivos modestos.

## 10.5. Canvas y partículas

Considerar:

- pausa cuando la pestaña no está visible;
- menor densidad en móvil;
- reduced motion.

## 10.6. JavaScript

Revisar componentes client-side y carga dinámica.

## 10.7. Fuentes

Revisar:

- familias;
- pesos;
- duplicados;
- carga.

### Objetivo inicial

Métrica                           Objetivo

---

Performance        90+ cuando sea realista\
Accessibility                          95+\
Best Practices                         95+\
SEO                                    95+

---

# 11. ETAPA 9 --- QA RESPONSIVE

**Prioridad: ALTA**

Probar:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px
1920px
```

En:

- [ ] Space.
- [ ] Classic.
- [ ] Runic.
- [ ] Cyber.

## Checklist

### Hero

- [ ] Texto.
- [ ] CTA.
- [ ] Fondo.
- [ ] Canvas/WebGL.

### Navegación

- [ ] Menú.
- [ ] Botones.
- [ ] Cierre.

### Proyectos

- [ ] Cards.
- [ ] Modales.
- [ ] Vídeos.
- [ ] Galería.

### Experiencia

- [ ] Timeline.
- [ ] Scroll.
- [ ] Interacciones.

### Contacto

- [ ] Inputs.
- [ ] Teclado móvil.
- [ ] Estados.

### General

- [ ] Sin scroll horizontal accidental.
- [ ] Sin texto cortado.
- [ ] Sin superposiciones incorrectas.
- [ ] Sin controles demasiado pequeños.

---

# 12. ETAPA 10 --- CV

**Prioridad: MEDIA/ALTA**

No crear otro CV.

## Revisar

- nombre;
- título;
- experiencia;
- proyectos;
- tecnologías;
- certificados;
- enlaces.

## Calidad

- [ ] 1--2 páginas aproximadamente según contenido.
- [ ] Legible.
- [ ] Links clicables.
- [ ] Consistente con el portafolio.
- [ ] Buena lectura ATS cuando sea posible.

---

# 13. ETAPA 11 --- CONTACTO

**Prioridad: MEDIA/ALTA**

El contacto ya funciona.

Cerrar:

- [ ] `idle`.
- [ ] `loading`.
- [ ] `success`.
- [ ] `error`.
- [ ] Validación consistente cliente/servidor.
- [ ] Mensajes claros.
- [ ] Errores junto al campo.
- [ ] Seguridad.
- [ ] Anti-spam.

---

# 14. ETAPA 12 --- README Y DOCUMENTACIÓN

**Prioridad: ALTA**

Reemplazar README genérico.

Debe contener:

```text
Mi Portafolio
├── Descripción
├── Características
├── Tecnologías
├── Arquitectura
├── Los cuatro temas
├── Estructura
├── Instalación
├── Variables de entorno
├── Desarrollo
├── Build
├── APIs
├── Supabase
├── Deploy
└── Autor
```

## Arquitectura

Explicar:

```text
Datos centrales
      ↓
Componentes compartidos
      ↓
Adaptaciones visuales
      ↓
Space / Classic / Runic / Cyber
```

## APIs

Documentar:

- `/api/contact`;
- `/api/projects`, si permanece;
- `/api/visits`.

Para cada una:

- propósito;

- método;

- entrada;

- salida;

- seguridad.

- [ ] README finalizado.

---

# 15. ETAPA 13 --- ANALYTICS Y VISITAS

**Prioridad: MEDIA**

Implementar después de estabilizar.

## Elegir una solución

- Google Analytics.
- Plausible.
- Umami.

No instalar varias sin necesidad.

## Eventos

```text
page_view
project_open
project_repository_click
project_live_demo
cv_download
contact_submit
theme_change
```

## API de visitas

Ya existe.

Decidir:

- [ ] Mostrar contador.
- [ ] Usarla internamente.
- [ ] Eliminarla si no aporta valor.

Si se muestra:

- definir qué cuenta como visita;
- evitar duplicados;
- decidir total o por página.

---

# 16. ETAPA 14 --- TESTING Y CI/CD

**Prioridad: MEDIA**

## Testing prioritario

### Formularios

- validación;
- envío;
- error;
- éxito.

### Proyectos

- apertura;
- cierre;
- navegación.

### Navegación

- rutas;
- menú;
- cambio de tema.

### CV

- generación/descarga.

### APIs

- validación;
- errores;
- seguridad.

## Accesibilidad

Añadir pruebas automatizadas cuando aporten valor.

## CI/CD

Pipeline:

```text
Push
 ↓
Install
 ↓
Typecheck
 ↓
Lint
 ↓
Tests
 ↓
Build
 ↓
Deploy
```

- [ ] Pipeline configurado.

---

# 17. ETAPA 15 --- INTERNACIONALIZACIÓN

**Prioridad: MEDIA / OPCIONAL**

Solo después del núcleo.

Posible estructura:

```text
/es
/en
```

No traducir automáticamente sin revisión profesional.

La arquitectura puede permitir:

```text
title.es
title.en
```

o una estrategia equivalente.

- [ ] Implementar únicamente si realmente se necesita.

---

# 18. CARACTERÍSTICAS OPCIONALES

No bloquean la release:

- [ ] Blog.
- [ ] Testimonios reales.
- [ ] Newsletter.
- [ ] Reacciones.
- [ ] PWA.
- [ ] GitHub Stats.

## Regla

No implementar ninguna antes de cerrar los bloques críticos.

---

# 19. ORDEN EXACTO DE IMPLEMENTACIÓN

## BLOQUE 1 --- ESTABILIDAD Y SEGURIDAD

1. [ ] Crear punto estable.
2. [ ] Ejecutar TypeScript.
3. [ ] Corregir errores.
4. [ ] Revisar archivos experimentales.
5. [ ] Limpiar código muerto.
6. [ ] Ejecutar lint.
7. [ ] Ejecutar build.
8. [ ] Revisar consola.
9. [ ] Auditar `/api/contact`.
10. [ ] Proteger/eliminar `GET /api/contact`.
11. [ ] Implementar rate limiting.
12. [ ] Implementar anti-spam.
13. [ ] Auditar RLS.
14. [ ] Revisar variables de entorno.
15. [ ] Revisar headers de seguridad.

## BLOQUE 2 --- CONSISTENCIA

16. [ ] Inventario de fuentes.
17. [ ] Centralizar información personal.
18. [ ] Consolidar proyectos.
19. [ ] Decidir `/api/projects`.
20. [ ] Consolidar habilidades.
21. [ ] Consolidar certificados.
22. [ ] Consolidar experiencia.
23. [ ] Consolidar formación.
24. [ ] Verificar los cuatro temas.

## BLOQUE 3 --- PROYECTOS PROFESIONALES

25. [ ] Elegir 3--4 proyectos principales.
26. [ ] Definir estructura Case Study.
27. [ ] Problema.
28. [ ] Objetivo.
29. [ ] Solución.
30. [ ] Arquitectura.
31. [ ] Decisiones técnicas.
32. [ ] Funcionalidades.
33. [ ] Desafíos.
34. [ ] Soluciones a desafíos.
35. [ ] Resultados reales.
36. [ ] Integrar en modales.
37. [ ] Screenshots.
38. [ ] Optimizar vídeos.
39. [ ] Demos donde correspondan.

## BLOQUE 4 --- SEO Y ACCESIBILIDAD

40. [ ] Corregir idioma global.
41. [ ] Metadata global.
42. [ ] Metadata por página.
43. [ ] Open Graph.
44. [ ] Twitter Cards.
45. [ ] Canonical.
46. [ ] Sitemap.
47. [ ] Robots.
48. [ ] JSON-LD.
49. [ ] Teclado.
50. [ ] Focus.
51. [ ] Modales accesibles.
52. [ ] ARIA.
53. [ ] Alt.
54. [ ] Contraste.
55. [ ] Reduced motion.

## BLOQUE 5 --- RENDIMIENTO Y QA

56. [ ] Medición inicial.
57. [ ] Vídeos.
58. [ ] Imágenes.
59. [ ] Three.js/WebGL.
60. [ ] Canvas y partículas.
61. [ ] JavaScript client-side.
62. [ ] Fuentes.
63. [ ] QA 320.
64. [ ] QA 375.
65. [ ] QA 390.
66. [ ] QA 430.
67. [ ] QA 768.
68. [ ] QA 1024.
69. [ ] QA 1280.
70. [ ] QA 1440.
71. [ ] QA 1920.
72. [ ] Repetir en los cuatro temas.

## BLOQUE 6 --- CIERRE PROFESIONAL

73. [ ] Comparar CV y portafolio.
74. [ ] Revisar enlaces CV.
75. [ ] Revisar PDF.
76. [ ] UX final del contacto.
77. [ ] Reemplazar README.
78. [ ] Documentar arquitectura.
79. [ ] Documentar APIs.
80. [ ] Documentar variables de entorno.

## BLOQUE 7 --- POST-RELEASE TÉCNICO

81. [ ] Elegir Analytics.
82. [ ] Eventos.
83. [ ] Decidir contador de visitas.
84. [ ] Tests prioritarios.
85. [ ] Tests de accesibilidad.
86. [ ] CI/CD.
87. [ ] Evaluar i18n.

---

# 20. CHECKLIST DE RELEASE FINAL

## Estabilidad

- [ ] TypeScript sin errores.
- [ ] Lint limpio.
- [ ] Build exitoso.
- [ ] Sin errores relevantes en consola.

## Seguridad

- [ ] Mensajes protegidos.
- [ ] Rate limiting.
- [ ] Anti-spam.
- [ ] Validación server-side.
- [ ] RLS revisado.
- [ ] Secretos fuera del repositorio.

## Datos

- [ ] Fuentes de verdad definidas.
- [ ] Sin duplicación innecesaria.
- [ ] Cuatro temas consistentes.

## Proyectos

- [ ] Proyectos principales documentados.
- [ ] Problema y solución.
- [ ] Arquitectura.
- [ ] Decisiones técnicas.
- [ ] Screenshots.
- [ ] Vídeos optimizados.
- [ ] Repositorios.
- [ ] Demos donde correspondan.

## SEO

- [ ] Metadata.
- [ ] Open Graph.
- [ ] Twitter Cards.
- [ ] Canonical.
- [ ] Sitemap.
- [ ] Robots.
- [ ] JSON-LD.

## Accesibilidad

- [ ] Teclado.
- [ ] Focus.
- [ ] Modales.
- [ ] ARIA.
- [ ] Alt.
- [ ] Contraste.
- [ ] Reduced motion.

## Rendimiento

- [ ] Medición.
- [ ] Vídeos.
- [ ] Imágenes.
- [ ] WebGL.
- [ ] Canvas/partículas.
- [ ] Fuentes.

## Responsive

- [ ] 320\.
- [ ] 375\.
- [ ] 390\.
- [ ] 430\.
- [ ] 768\.
- [ ] 1024\.
- [ ] 1280\.
- [ ] 1440\.
- [ ] 1920\.
- [ ] Space.
- [ ] Classic.
- [ ] Runic.
- [ ] Cyber.

## Documentación

- [ ] README.
- [ ] Arquitectura.
- [ ] APIs.
- [ ] Variables de entorno.

---

# RESULTADO ESPERADO

Al completar los bloques 1 al 6, el proyecto debe estar en estado de:

> **RELEASE PROFESIONAL**

Es decir:

- visualmente completo;
- funcionalmente estable;
- con datos consistentes;
- con proyectos demostrables;
- seguro en sus partes públicas;
- optimizado;
- accesible;
- responsive;
- preparado para indexación;
- documentado.

El Bloque 7 y las características opcionales pueden continuar después de\
publicar sin impedir que el portafolio sea presentado profesionalmente.

---

# REGLA FINAL DE IMPLEMENTACIÓN

Cada punto se trabajará así:

```text
1. Revisar el estado actual
        ↓
2. Determinar exactamente qué falta
        ↓
3. Implementar únicamente lo necesario
        ↓
4. Probar
        ↓
5. Verificar que no rompió otro tema
        ↓
6. Ejecutar typecheck/lint/build cuando corresponda
        ↓
7. Marcar como completado
        ↓
8. Pasar al siguiente punto
```

**No se debe avanzar añadiendo funcionalidades nuevas sin verificar**\
**primero el estado real de lo que ya existe.**
