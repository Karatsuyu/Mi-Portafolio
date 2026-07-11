# Requirements Document

## Introduction

Esta especificación define una nueva sección de Experiencia completamente única para el tema Classic del portafolio profesional de Julián Estiven Gutiérrez Tabares. La sección reemplazará la implementación actual que utiliza el componente Timeline horizontal compartido por un diseño vertical tipo CV ejecutivo con glassmorphism, timeline vertical con línea lateral magenta, y funcionalidades interactivas de filtrado y animaciones de contadores, todo implementado exclusivamente con CSS y animaciones CSS (sin React Three Fiber ni canvas).

## Glossary

- **Classic_Theme**: El tema del portafolio con sidebar colapsible + contenido principal, estilo profesional con color primario magenta (#ff0095)
- **Experience_Section**: La sección de Experiencia ubicada en `/classic/experiencia/page.tsx`
- **Vertical_Timeline**: Línea vertical con nodos circulares que conecta las tarjetas de proyectos cronológicamente
- **Project_Card**: Tarjeta de proyecto estilo CV ejecutivo con efecto glassmorphism
- **Timeline_Node**: Nodo circular con ícono FontAwesome posicionado sobre la línea vertical del timeline
- **Impact_Counter**: Contador animado que incrementa desde 0 hasta el valor final al entrar en viewport
- **Tech_Chip**: Chip visual que representa una tecnología utilizada en un proyecto
- **Filter_System**: Sistema de filtros por tipo de proyecto (práctica, freelance, académico)
- **Stats_Summary**: Resumen estadístico con contadores animados de proyectos totales, tecnologías, y años de experiencia
- **Glassmorphism**: Efecto visual de vidrio esmerilado usando `backdrop-filter: blur()` y fondos semi-transparentes
- **Project_Type**: Clasificación del proyecto en una de tres categorías: práctica, freelance, o académico

## Requirements

### Requirement 1: Timeline Vertical con Línea Magenta

**User Story:** Como visitante del portafolio, quiero ver una línea de tiempo vertical con línea magenta lateral, para visualizar la progresión cronológica de los proyectos de manera clara y profesional.

#### Acceptance Criteria

1. THE Experience_Section SHALL render a vertical timeline layout with projects ordered chronologically from oldest (top) to newest (bottom)
2. THE Vertical_Timeline SHALL display a continuous vertical line of 3px width in color #ff0095 positioned on the left side of the timeline
3. WHEN the viewport width is greater than 768px, THE Vertical_Timeline SHALL position the line 50px from the left edge of the container
4. WHEN the viewport width is 768px or less, THE Vertical_Timeline SHALL position the line 20px from the left edge of the container
5. THE Vertical_Timeline SHALL extend from the first Timeline_Node to the last Timeline_Node
6. WHEN a Project_Card is rendered, THE Timeline_Node SHALL be positioned on the Vertical_Timeline line at the vertical center of the card

### Requirement 2: Tarjetas de Proyecto Estilo CV Ejecutivo

**User Story:** Como reclutador, quiero ver tarjetas de proyecto con estilo profesional CV ejecutivo, para evaluar rápidamente la experiencia del candidato.

#### Acceptance Criteria

1. THE Project_Card SHALL use a glassmorphism design with `background: rgba(0, 0, 0, 0.5)`, `backdrop-filter: blur(10px)`, and `border: 2px solid rgba(255, 0, 149, 0.3)`
2. THE Project_Card SHALL display the project title in font size 1.5rem with font weight 700 and color #ff0095
3. THE Project_Card SHALL display the project date/quarter in format "YYYY QN" (e.g., "2023 Q1") in font size 0.9rem and color #94a3b8
4. THE Project_Card SHALL display the project type badge (práctica/freelance/académico) with corresponding background color
5. THE Project_Card SHALL display a brief description of the project with maximum 150 characters
6. THE Project_Card SHALL display up to 5 Tech_Chip components representing the main technologies used
7. WHEN a user hovers over a Project_Card, THE card SHALL apply transform `translateY(-5px)` and increase shadow to `0 10px 30px rgba(255, 0, 149, 0.4)`
8. THE Project_Card SHALL have rounded corners with border-radius of 16px
9. THE Project_Card SHALL have left margin of 80px on viewport widths greater than 768px to provide space for the Timeline_Node
10. THE Project_Card SHALL have left margin of 60px on viewport widths of 768px or less

### Requirement 3: Nodos Circulares con Íconos FontAwesome

**User Story:** Como visitante del portafolio, quiero ver nodos circulares decorativos en la línea de tiempo, para identificar visualmente cada proyecto en el timeline.

#### Acceptance Criteria

1. THE Timeline_Node SHALL render as a circular element with diameter 40px
2. THE Timeline_Node SHALL have background color #ff0095 and border 3px solid rgba(0, 0, 0, 0.8)
3. THE Timeline_Node SHALL be positioned absolutely at the vertical center of its corresponding Project_Card
4. THE Timeline_Node SHALL be positioned at left: 50px on viewport widths greater than 768px
5. THE Timeline_Node SHALL be positioned at left: 20px on viewport widths of 768px or less
6. THE Timeline_Node SHALL contain a FontAwesome icon centered within the circle
7. WHEN the project type is "práctica", THE Timeline_Node SHALL display icon `fa-code`
8. WHEN the project type is "freelance", THE Timeline_Node SHALL display icon `fa-briefcase`
9. WHEN the project type is "académico", THE Timeline_Node SHALL display icon `fa-graduation-cap`
10. THE FontAwesome icon SHALL have font size 1.2rem and color #ffffff
11. THE Timeline_Node SHALL have z-index 10 to ensure it appears above the vertical line

### Requirement 4: Contador de Impacto Animado

**User Story:** Como visitante del portafolio, quiero ver contadores animados de impacto, para apreciar las métricas de cada proyecto de forma dinámica.

#### Acceptance Criteria

1. THE Project_Card SHALL display an Impact_Counter section showing up to 3 key metrics (e.g., "500+ Users", "15 Features", "98% Uptime")
2. WHEN a Project_Card enters the viewport for the first time, THE Impact_Counter SHALL animate from 0 to the final numeric value
3. THE Impact_Counter animation SHALL complete in 2 seconds with easing function `ease-out`
4. THE Impact_Counter SHALL use CSS counter animation implemented with CSS custom properties and keyframes
5. THE Impact_Counter SHALL display the numeric value in font size 1.8rem, font weight 700, and color #ff0095
6. THE Impact_Counter SHALL display the metric label below the number in font size 0.9rem and color #94a3b8
7. THE Impact_Counter metrics SHALL be displayed in a horizontal flex layout with gap 2rem

### Requirement 5: Chips de Tecnología

**User Story:** Como reclutador técnico, quiero ver chips visuales de tecnologías, para identificar rápidamente el stack técnico de cada proyecto.

#### Acceptance Criteria

1. THE Tech_Chip SHALL render as a small badge with padding `6px 12px`, border-radius `20px`, and font size `0.85rem`
2. THE Tech_Chip SHALL have background `rgba(255, 0, 149, 0.15)`, color `#ff0095`, and border `1px solid rgba(255, 0, 149, 0.3)`
3. WHEN a user hovers over a Tech_Chip, THE chip SHALL apply background `rgba(255, 0, 149, 0.25)` and transform `scale(1.05)`
4. THE Tech_Chip components SHALL be displayed in a flex wrap layout with gap `8px`
5. THE Project_Card SHALL display a maximum of 5 Tech_Chip components
6. WHEN a project has more than 5 technologies, THE Project_Card SHALL display a "+N more" indicator showing the count of additional technologies

### Requirement 6: Sistema de Filtros por Tipo

**User Story:** Como visitante del portafolio, quiero filtrar proyectos por tipo (práctica, freelance, académico), para enfocarme en la experiencia que me interesa.

#### Acceptance Criteria

1. THE Experience_Section SHALL display a Filter_System component above the timeline
2. THE Filter_System SHALL display 4 filter buttons: "Todos", "Práctica", "Freelance", "Académico"
3. WHEN the page loads, THE filter "Todos" SHALL be selected by default showing all projects
4. WHEN a user clicks a filter button, THE Filter_System SHALL apply the selected filter and visually highlight the active button
5. WHEN a filter is active (not "Todos"), THE Experience_Section SHALL display only Project_Card components matching the selected Project_Type
6. WHEN a filter is applied, THE hidden Project_Card components SHALL animate out with fade-out and scale-down effect over 300ms
7. WHEN a filter is removed or changed, THE newly visible Project_Card components SHALL animate in with fade-in and scale-up effect over 300ms
8. THE active filter button SHALL have background `#ff0095`, color `#ffffff`, and shadow `0 0 20px rgba(255, 0, 149, 0.5)`
9. THE inactive filter buttons SHALL have background `rgba(255, 0, 149, 0.1)`, color `#ff0095`, and border `1px solid rgba(255, 0, 149, 0.3)`
10. THE Filter_System SHALL use React useState hook to manage filter state without external state management libraries

### Requirement 7: Resumen Estadístico con Contadores Animados

**User Story:** Como visitante del portafolio, quiero ver un resumen estadístico animado en la parte superior, para obtener una visión general rápida de la experiencia total.

#### Acceptance Criteria

1. THE Experience_Section SHALL display a Stats_Summary component at the top of the page before the filter system
2. THE Stats_Summary SHALL display 3 animated counters in a horizontal grid layout
3. THE Stats_Summary SHALL display total projects count with label "Proyectos Completados"
4. THE Stats_Summary SHALL display unique technologies count with label "Tecnologías Dominadas"
5. THE Stats_Summary SHALL display years of experience (calculated as 2024 - 2023 + 1 = 2) with label "Años de Experiencia"
6. WHEN the Stats_Summary enters the viewport for the first time, THE counters SHALL animate from 0 to final value over 2.5 seconds
7. THE counter animation SHALL use CSS custom properties and keyframes with easing function `ease-out`
8. THE Stats_Summary counter values SHALL display in font size 3rem, font weight 700, and color #ff0095
9. THE Stats_Summary labels SHALL display in font size 1rem and color #94a3b8
10. THE Stats_Summary SHALL use glassmorphism design matching the Project_Card style
11. THE Stats_Summary SHALL have responsive layout changing from 3 columns on desktop to 1 column on mobile (viewport ≤ 768px)

### Requirement 8: Implementación Sin Canvas ni React Three Fiber

**User Story:** Como desarrollador del portafolio, quiero que todas las animaciones usen solo CSS, para mantener el rendimiento y evitar dependencias pesadas como React Three Fiber.

#### Acceptance Criteria

1. THE Experience_Section SHALL NOT import or use React Three Fiber library
2. THE Experience_Section SHALL NOT use HTML canvas element for rendering
3. THE Experience_Section SHALL implement all counter animations using CSS `@keyframes` and CSS custom properties
4. THE Experience_Section SHALL implement all hover effects using CSS `:hover` pseudo-class
5. THE Experience_Section SHALL implement all visibility-triggered animations using Intersection Observer API with CSS class toggles
6. THE Experience_Section SHALL implement all transitions using CSS `transition` property
7. THE glassmorphism effects SHALL use CSS `backdrop-filter: blur()` property exclusively

### Requirement 9: Datos de los 8 Proyectos

**User Story:** Como visitante del portafolio, quiero ver los 8 proyectos desarrollados entre 2023 y 2024, para conocer la trayectoria completa del desarrollador.

#### Acceptance Criteria

1. THE Experience_Section SHALL display project "Sistema Bancario" with date "2023 Q1", type "académico", technologies ["Java", "Spring Boot", "MySQL", "JUnit"], description "Sistema bancario con validación de transacciones y gestión de cuentas", and metrics ["3 módulos", "8 casos de uso", "95% cobertura"]
2. THE Experience_Section SHALL display project "Lavadero App" with date "2023 Q2", type "freelance", technologies ["React Native", "Firebase", "Redux", "Expo"], description "Aplicación móvil para gestión de servicios de lavandería con pagos en línea", and metrics ["500+ descargas", "4.5★ rating", "12 pantallas"]
3. THE Experience_Section SHALL display project "Portfolio Web" with date "2023 Q3", type "práctica", technologies ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], description "Portafolio personal con múltiples temas y animaciones avanzadas", and metrics ["4 temas", "20+ secciones", "100% responsive"]
4. THE Experience_Section SHALL display project "Tienda Online" with date "2023 Q4", type "académico", technologies ["Node.js", "Express", "MongoDB", "React"], description "E-commerce full-stack con carrito de compras y pasarela de pago", and metrics ["150+ productos", "3 roles usuario", "API RESTful"]
5. THE Experience_Section SHALL display project "ParkingPro SaaS" with date "2024 Q1", type "freelance", technologies ["Python", "Django", "PostgreSQL", "Docker"], description "Sistema SaaS de gestión de estacionamientos con reportes en tiempo real", and metrics ["10 clientes", "5000+ registros/día", "99.8% uptime"]
6. THE Experience_Section SHALL display project "Sistema Registral" with date "2024 Q2", type "académico", technologies ["Python", "Django", "SQLite", "Bootstrap"], description "Sistema administrativo de registro académico con gestión de estudiantes", and metrics ["8 módulos", "50+ formularios", "3 tipos usuario"]
7. THE Experience_Section SHALL display project "Delicious Food" with date "2024 Q3", type "freelance", technologies ["React Native", "Node.js", "MongoDB", "Google Maps API"], description "App de delivery de comida con geolocalización y seguimiento en tiempo real", and metrics ["200+ restaurantes", "1000+ usuarios", "4.7★ rating"]
8. THE Experience_Section SHALL display project "MiSalud" with date "2024 Q4", type "práctica", technologies ["React", "WebRTC", "Socket.io", "Node.js"], description "Plataforma de telemedicina con videollamadas y chat en tiempo real", and metrics ["15 especialidades", "50+ médicos", "Video HD"]

### Requirement 10: Compatibilidad con Tema Claro/Oscuro

**User Story:** Como visitante del portafolio, quiero que la sección de experiencia funcione correctamente en modo claro y oscuro, para disfrutar de mi preferencia de visualización.

#### Acceptance Criteria

1. WHEN the Classic_Theme is in dark mode (`data-theme="dark"`), THE Experience_Section SHALL use color palette with text #ffffff, background `rgba(0, 0, 0, 0.5)`, and primary #ff0095
2. WHEN the Classic_Theme is in light mode (`data-theme="light"`), THE Experience_Section SHALL use color palette with text #1e293b, background `rgba(255, 255, 255, 0.9)`, and primary #2563eb
3. WHEN the Classic_Theme is in light mode, THE Vertical_Timeline line SHALL use color #2563eb instead of #ff0095
4. WHEN the Classic_Theme is in light mode, THE Timeline_Node SHALL use background #2563eb instead of #ff0095
5. WHEN the Classic_Theme is in light mode, THE Tech_Chip SHALL use color #2563eb and background `rgba(37, 99, 235, 0.15)`
6. WHEN the Classic_Theme is in light mode, THE Impact_Counter numbers SHALL use color #2563eb
7. WHEN the Classic_Theme is in light mode, THE Stats_Summary counter values SHALL use color #2563eb
8. THE Experience_Section SHALL apply theme-specific styles using CSS attribute selector `[data-theme="light"]`

### Requirement 11: Diseño Responsivo para Móviles

**User Story:** Como visitante móvil del portafolio, quiero que la sección de experiencia se adapte a mi pantalla, para poder navegar cómodamente desde mi dispositivo.

#### Acceptance Criteria

1. WHEN the viewport width is 768px or less, THE Project_Card SHALL reduce left margin to 60px
2. WHEN the viewport width is 768px or less, THE Timeline_Node SHALL reduce size to 36px diameter
3. WHEN the viewport width is 768px or less, THE Stats_Summary SHALL change layout from 3 columns to 1 column stacked vertically
4. WHEN the viewport width is 768px or less, THE Project_Card title SHALL reduce font size to 1.2rem
5. WHEN the viewport width is 768px or less, THE Impact_Counter SHALL change layout from horizontal to vertical with gap 1rem
6. WHEN the viewport width is 768px or less, THE Impact_Counter values SHALL reduce font size to 1.5rem
7. WHEN the viewport width is 768px or less, THE Filter_System buttons SHALL reduce padding to `8px 16px` and font size to `0.85rem`
8. WHEN the viewport width is 768px or less, THE Tech_Chip SHALL reduce padding to `4px 8px` and font size to `0.75rem`
9. THE Experience_Section SHALL maintain readability and usability on viewport widths down to 320px

### Requirement 12: Auto-Contenido Sin Dependencias Externas

**User Story:** Como desarrollador del tema Classic, quiero que la sección de experiencia sea completamente autosuficiente, para evitar dependencias de componentes de otros temas.

#### Acceptance Criteria

1. THE Experience_Section SHALL NOT import components from `/components/shared/` directory
2. THE Experience_Section SHALL NOT import the existing `Timeline` component
3. THE Experience_Section SHALL define all project data within the `page.tsx` file or in a local data file within `/app/classic/experiencia/` directory
4. THE Experience_Section SHALL implement all custom components (Project_Card, Timeline_Node, Filter_System, Stats_Summary, Tech_Chip, Impact_Counter) within the `/app/classic/experiencia/` directory
5. THE Experience_Section CSS styles SHALL be defined exclusively in `/app/classic/css/styles.css` or in a dedicated `experiencia.css` file within `/app/classic/experiencia/`
6. THE Experience_Section SHALL use only dependencies already present in the project (React, Next.js, TypeScript, FontAwesome)
7. THE Experience_Section SHALL NOT add new npm packages or external libraries
