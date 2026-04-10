// ============================================================
//  FORMACIÓN — historial educativo como git log
//  Cada entrada es un "commit" en la línea de tiempo
//  branch: qué rama es (main, cursos, certificaciones, etc.)
//  type: determina el ícono y color del nodo
// ============================================================

export type CommitType =
  | 'degree'        // título universitario / técnico
  | 'bootcamp'      // bootcamp intensivo
  | 'course'        // curso online / presencial
  | 'certification' // certificación oficial
  | 'self'          // aprendizaje autodidacta
  | 'milestone';    // hito importante (primer trabajo, etc.)

export type BranchName =
  | 'main'          // formación principal
  | 'cursos'        // cursos complementarios
  | 'certificaciones'
  | 'autodidacta';

export interface GitCommit {
  id: string;           // hash corto (se muestra en el log)
  type: CommitType;
  branch: BranchName;
  date: string;         // "2024-03" formato año-mes
  title: string;        // nombre del estudio
  institution: string;  // dónde
  description: string;  // qué aprendiste
  tags: string[];       // tecnologías / temas
  isMerge?: boolean;    // commit de merge (terminar algo importante)
  mergeMessage?: string;
  duration?: string;    // "6 meses", "2 años", etc.
  url?: string;         // link al certificado / institución
}

// ── Paleta de colores por branch ────────────────────────────
export const BRANCH_COLORS: Record<BranchName, string> = {
  main:              '#00f5ff',
  cursos:            '#00ff88',
  certificaciones:   '#a855f7',
  autodidacta:       '#f0e040',
};

// ── Iconos por tipo de commit ────────────────────────────────
export const COMMIT_ICONS: Record<CommitType, string> = {
  degree:        '⬡',
  bootcamp:      '⚡',
  course:        '◈',
  certification: '★',
  self:          '</>',
  milestone:     '◆',
};

// ── Tu historial (edita esto) ────────────────────────────────
// IMPORTANTE: ordena de más antiguo (arriba) a más reciente (abajo)
// El timeline se dibuja de arriba a abajo cronológicamente

export const COMMITS: GitCommit[] = [
  // ── Rama main: formación formal ─────────────────────────
  {
    id: 'a1b2c3',
    type: 'degree',
    branch: 'main',
    date: '2020-02',
    title: 'Ingeniería de Sistemas',
    institution: 'Universidad Nacional de Colombia',
    description: 'Fundamentos de programación, algoritmos, estructuras de datos, bases de datos relacionales, redes y arquitectura de software.',
    tags: ['Java', 'C++', 'SQL', 'Redes', 'Algoritmos'],
    duration: '5 años (en curso)',
    url: 'https://unal.edu.co',
  },
  // ── Rama cursos: inicio del stack web ───────────────────
  {
    id: 'd4e5f6',
    type: 'course',
    branch: 'cursos',
    date: '2021-06',
    title: 'The Web Developer Bootcamp',
    institution: 'Udemy — Colt Steele',
    description: 'HTML5, CSS3, JavaScript ES6+, Node.js, Express y MongoDB. Base completa del stack web moderno.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
    duration: '3 meses',
    url: 'https://udemy.com',
  },
  {
    id: 'g7h8i9',
    type: 'course',
    branch: 'cursos',
    date: '2021-10',
    title: 'React — The Complete Guide',
    institution: 'Udemy — Maximilian Schwarzmüller',
    description: 'React Hooks, Context API, Redux, React Router, testing con Jest y patrones de arquitectura en aplicaciones grandes.',
    tags: ['React', 'Redux', 'Hooks', 'Jest'],
    duration: '2 meses',
  },
  // ── Autodidacta: TypeScript ──────────────────────────────
  {
    id: 'j1k2l3',
    type: 'self',
    branch: 'autodidacta',
    date: '2022-01',
    title: 'TypeScript en profundidad',
    institution: 'Documentación oficial + proyectos propios',
    description: 'Tipos avanzados, generics, decoradores, utility types y migración de proyectos JS a TS.',
    tags: ['TypeScript', 'OOP', 'Generics'],
    duration: '4 meses',
  },
  // ── Merge: primer trabajo ────────────────────────────────
  {
    id: 'm4n5o6',
    type: 'milestone',
    branch: 'main',
    date: '2022-06',
    title: 'Primer empleo como Developer',
    institution: 'Startup — Desarrollador Frontend',
    description: 'Primer rol profesional como desarrollador. Stack: React + TypeScript + Node.js.',
    tags: ['React', 'TypeScript', 'Node.js', 'Git'],
    isMerge: true,
    mergeMessage: "Merge branch 'cursos' into main — listo para producción",
    duration: '1 año',
  },
  // ── Certificaciones ─────────────────────────────────────
  {
    id: 'p7q8r9',
    type: 'certification',
    branch: 'certificaciones',
    date: '2022-09',
    title: 'Meta Front-End Developer',
    institution: 'Coursera — Meta',
    description: 'Especialización oficial de Meta: React avanzado, accesibilidad web, testing, Figma y principios de UX.',
    tags: ['React', 'UX', 'Accessibility', 'Figma'],
    duration: '6 meses',
    url: 'https://coursera.org',
  },
  // ── Next.js y full stack ─────────────────────────────────
  {
    id: 's1t2u3',
    type: 'course',
    branch: 'cursos',
    date: '2023-02',
    title: 'Next.js 13 — App Router Mastery',
    institution: 'YouTube — Fireship + documentación',
    description: 'App Router, Server Components, Streaming, Data Fetching patterns, optimización y deployment en Vercel.',
    tags: ['Next.js', 'Server Components', 'Vercel'],
    duration: '2 meses',
  },
  // ── Three.js / 3D web ────────────────────────────────────
  {
    id: 'v4w5x6',
    type: 'self',
    branch: 'autodidacta',
    date: '2023-07',
    title: 'Three.js & React Three Fiber',
    institution: 'Bruno Simon — Three.js Journey + docs',
    description: 'Escenas 3D en la web, shaders GLSL, física, animaciones, postprocessing y optimización de rendimiento.',
    tags: ['Three.js', 'React Three Fiber', 'GLSL', 'WebGL'],
    duration: '3 meses',
    url: 'https://threejs-journey.com',
  },
  // ── AWS ──────────────────────────────────────────────────
  {
    id: 'y7z8a9',
    type: 'certification',
    branch: 'certificaciones',
    date: '2023-11',
    title: 'AWS Cloud Practitioner',
    institution: 'Amazon Web Services',
    description: 'Fundamentos de cloud computing, servicios core de AWS (EC2, S3, RDS, Lambda), seguridad y pricing.',
    tags: ['AWS', 'Cloud', 'S3', 'Lambda', 'EC2'],
    duration: '2 meses',
    url: 'https://aws.amazon.com/certification',
  },
  // ── Merge: seniority ─────────────────────────────────────
  {
    id: 'b2c3d4',
    type: 'milestone',
    branch: 'main',
    date: '2024-01',
    title: 'Full Stack Developer Senior',
    institution: 'Posición actual',
    description: 'Dominio completo del stack. Arquitectura de sistemas, liderazgo técnico y proyectos de alta complejidad.',
    tags: ['Full Stack', 'Arquitectura', 'Liderazgo'],
    isMerge: true,
    mergeMessage: "Merge branches 'certificaciones' + 'autodidacta' — nivel senior",
    duration: 'presente',
  },
];

// ── Ramas activas (para la leyenda) ─────────────────────────
export const ACTIVE_BRANCHES: { name: BranchName; label: string }[] = [
  { name: 'main',            label: 'main — formación formal'      },
  { name: 'cursos',          label: 'cursos — aprendizaje guiado'  },
  { name: 'certificaciones', label: 'certificaciones — oficiales'  },
  { name: 'autodidacta',     label: 'autodidacta — por cuenta propia' },
];
