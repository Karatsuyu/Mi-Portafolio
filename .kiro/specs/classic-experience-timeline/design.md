# Design Document

## Overview

Este documento de diseño describe la arquitectura técnica e implementación de la sección de Experiencia del tema Classic, una interfaz de timeline vertical tipo CV ejecutivo con glassmorphism, animaciones CSS puras, y funcionalidades de filtrado interactivo para visualizar los 8 proyectos desarrollados entre 2023 y 2024.

### Feature Purpose

La sección de Experiencia permite a visitantes del portafolio y reclutadores visualizar la trayectoria completa de proyectos del desarrollador mediante un timeline cronológico vertical con diseño premium glassmorphism. El sistema proporciona:

- **Visualización Cronológica**: Timeline vertical con línea magenta y nodos circulares decorativos
- **Diseño Ejecutivo Premium**: Tarjetas glassmorphism con efectos backdrop-filter blur
- **Interactividad de Filtrado**: Sistema de filtros por tipo de proyecto (práctica, freelance, académico)
- **Animaciones CSS Puras**: Contadores animados de impacto sin dependencias de JavaScript
- **Responsividad Total**: Adaptación fluida desde desktop hasta móviles 320px
- **Soporte de Temas**: Compatibilidad con modo claro/oscuro del tema Classic

### Key Design Decisions

1. **CSS-Only Counter Animations**: Utilizamos `@property` CSS y `counter-reset` combinados con keyframes para implementar contadores animados sin manipulación de DOM JavaScript, logrando animaciones fluidas y ligeras.

2. **Intersection Observer para Triggers**: Empleamos Intersection Observer API para detectar entrada al viewport y activar animaciones mediante toggles de clases CSS, separando detección (JS) de animación (CSS).

3. **Glassmorphism Moderno**: Implementamos efectos glassmorphism con `backdrop-filter: blur()` y backgrounds rgba semi-transparentes para crear profundidad visual premium.

4. **React Hooks para Estado de Filtros**: Gestionamos el estado de filtros con useState hook de React, sin librerías externas de state management.

5. **Auto-Contenido Sin Dependencias**: Todos los componentes y datos residen dentro del directorio `/app/classic/experiencia/`, eliminando dependencias del componente Timeline compartido.

6. **FontAwesome para Iconografía**: Reutilizamos FontAwesome ya presente en el proyecto para íconos de nodos del timeline.

## Architecture

### Component Hierarchy

```
ExperienceSection (page.tsx)
├── StatsSum mary
│   ├── StatCounter (×3)
│   │   ├── Counter Value (CSS animated)
│   │   └── Counter Label
│   └── Intersection Observer (viewport trigger)
│
├── FilterSystem
│   ├── FilterButton (×4: Todos, Práctica, Freelance, Académico)
│   └── Filter State (React useState)
│
└── VerticalTimeline
    ├── Timeline Line (CSS pseudo-element)
    └── ProjectCard (×8)
        ├── TimelineNode
        │   ├── Node Circle
        │   └── FontAwesome Icon
        ├── Project Header
        │   ├── Title
        │   ├── Date/Quarter
        │   └── Type Badge
        ├── Project Description
        ├── TechChips (×5 max)
        ├── ImpactCounters (×3)
        │   ├── Counter Animation (CSS @property + keyframes)
        │   └── Intersection Observer Trigger
        └── Glassmorphism Container
```

### File Organization

```
app/classic/experiencia/
├── page.tsx                    # Main experience section component
├── projectsData.ts             # Project data array with 8 projects
└── components/
    ├── StatsSum mary.tsx        # Top statistics summary with animated counters
    ├── FilterSystem.tsx        # Filter buttons component
    ├── VerticalTimeline.tsx    # Timeline container
    ├── ProjectCard.tsx         # Individual project card
    ├── TimelineNode.tsx        # Circular node with icon
    ├── TechChip.tsx            # Technology chip badge
    └── ImpactCounter.tsx       # Animated counter component

app/classic/css/
└── styles.css                  # Extended with experience section styles
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules / CSS-in-File (styles.css)
- **Icons**: FontAwesome (already imported in layout)
- **Animations**: CSS Keyframes + @property
- **Intersection Detection**: Intersection Observer API
- **State Management**: React useState Hook

## Components and Interfaces

### Core Interfaces

#### Project Data Structure

```typescript
interface Project {
  id: string;
  title: string;
  date: string;              // Format: "YYYY QN"
  type: 'práctica' | 'freelance' | 'académico';
  technologies: string[];    // Max 5 displayed
  description: string;       // Max 150 characters
  metrics: ImpactMetric[];   // Max 3 metrics
}

interface ImpactMetric {
  value: number;             // Numeric value for counter animation
  unit?: string;             // Optional unit (e.g., "+", "%", "★")
  label: string;             // Descriptive label
}
```

#### Filter State

```typescript
type FilterType = 'all' | 'práctica' | 'freelance' | 'académico';

interface FilterState {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}
```

### Component Specifications

#### 1. ExperienceSection (page.tsx)

**Purpose**: Root component that orchestrates the entire experience section

**Responsibilities**:
- Manage filter state with useState hook
- Render StatsSum mary, FilterSystem, and VerticalTimeline
- Pass filter state and handlers to child components
- Provide semantic structure with section container

**Props**: None (page component)

**State**:
```typescript
const [activeFilter, setActiveFilter] = useState<FilterType>('all');
```

**Render Logic**:
```tsx
<section className="section experience-section">
  <h2>Experiencia de Proyectos</h2>
  <p className="subtitle">Timeline cronológico de proyectos 2023-2024</p>
  
  <StatsSum mary projects={projects} />
  
  <FilterSystem 
    activeFilter={activeFilter}
    onFilterChange={setActiveFilter}
  />
  
  <VerticalTimeline 
    projects={projects}
    activeFilter={activeFilter}
  />
</section>
```

#### 2. StatsSum mary Component

**Purpose**: Display top-level statistics with animated counters

**Props**:
```typescript
interface StatsSummaryProps {
  projects: Project[];
}
```

**Calculated Metrics**:
- Total Projects: `projects.length`
- Total Technologies: `new Set(projects.flatMap(p => p.technologies)).size`
- Years of Experience: `2024 - 2023 + 1 = 2`

**Animation Behavior**:
- Use Intersection Observer to detect first viewport entry
- Add class `is-visible` to trigger CSS counter animation
- Animation runs once (never repeats)

**CSS Class**: `.stats-summary`

**Responsive Layout**:
- Desktop (>768px): 3 columns horizontal
- Mobile (≤768px): 1 column vertical stack

#### 3. FilterSystem Component

**Purpose**: Render filter buttons and manage filter interactions

**Props**:
```typescript
interface FilterSystemProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}
```

**Buttons Configuration**:
```typescript
const filters = [
  { id: 'all', label: 'Todos', icon: 'fa-layer-group' },
  { id: 'práctica', label: 'Práctica', icon: 'fa-code' },
  { id: 'freelance', label: 'Freelance', icon: 'fa-briefcase' },
  { id: 'académico', label: 'Académico', icon: 'fa-graduation-cap' }
];
```

**CSS Classes**:
- Container: `.filter-system`
- Button: `.filter-btn`
- Active State: `.filter-btn.active`

**Button Styling**:
- Active: `background: var(--primary)`, `color: #ffffff`
- Inactive: `background: rgba(255, 0, 149, 0.1)`, `color: var(--primary)`

#### 4. VerticalTimeline Component

**Purpose**: Container for timeline line and project cards

**Props**:
```typescript
interface VerticalTimelineProps {
  projects: Project[];
  activeFilter: FilterType;
}
```

**Filtering Logic**:
```typescript
const filteredProjects = activeFilter === 'all' 
  ? projects 
  : projects.filter(p => p.type === activeFilter);
```

**Timeline Line Implementation**:
- Rendered as CSS pseudo-element `::before` on container
- Position: `absolute`, `left: 50px` (desktop), `left: 20px` (mobile)
- Dimensions: `width: 3px`, `height: 100%`
- Color: `background: var(--primary)` (#ff0095 dark, #2563eb light)

**CSS Class**: `.vertical-timeline`

**Animation States**:
- Cards entering: `.project-card.fade-in` (300ms fade + scale up)
- Cards exiting: `.project-card.fade-out` (300ms fade + scale down)

#### 5. ProjectCard Component

**Purpose**: Render individual project with glassmorphism design

**Props**:
```typescript
interface ProjectCardProps {
  project: Project;
}
```

**Structure**:
```tsx
<div className="project-card-container">
  <TimelineNode type={project.type} />
  
  <div className="project-card">
    <div className="project-header">
      <h3 className="project-title">{project.title}</h3>
      <span className="project-date">{project.date}</span>
      <span className={`project-badge ${project.type}`}>
        {project.type}
      </span>
    </div>
    
    <p className="project-description">{project.description}</p>
    
    <div className="tech-chips">
      {project.technologies.slice(0, 5).map(tech => (
        <TechChip key={tech} technology={tech} />
      ))}
      {project.technologies.length > 5 && (
        <span className="tech-more">
          +{project.technologies.length - 5} more
        </span>
      )}
    </div>
    
    <div className="impact-counters">
      {project.metrics.map(metric => (
        <ImpactCounter key={metric.label} metric={metric} />
      ))}
    </div>
  </div>
</div>
```

**Glassmorphism Styling**:
```css
.project-card {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 0, 149, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-left: 80px; /* Space for timeline node */
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 0, 149, 0.4);
}
```

**Type Badge Colors**:
- Práctica: `background: rgba(59, 130, 246, 0.2)`, `color: #3b82f6`
- Freelance: `background: rgba(16, 185, 129, 0.2)`, `color: #10b981`
- Académico: `background: rgba(168, 85, 247, 0.2)`, `color: #a855f7`

**Responsive Margins**:
- Desktop (>768px): `margin-left: 80px`
- Mobile (≤768px): `margin-left: 60px`

#### 6. TimelineNode Component

**Purpose**: Circular node with FontAwesome icon on timeline

**Props**:
```typescript
interface TimelineNodeProps {
  type: 'práctica' | 'freelance' | 'académico';
}
```

**Icon Mapping**:
```typescript
const iconMap = {
  práctica: 'fa-code',
  freelance: 'fa-briefcase',
  académico: 'fa-graduation-cap'
};
```

**Styling**:
```css
.timeline-node {
  position: absolute;
  left: 50px; /* Desktop */
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  border: 3px solid rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.timeline-node i {
  font-size: 1.2rem;
  color: #ffffff;
}
```

