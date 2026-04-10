// ============================================================
//  HABILIDADES — cada "archivo" del IDE es una categoría
//  El código que se escribe solo = tus skills reales
//  Edita los niveles (0-100) y añade/quita skills
// ============================================================

export interface Skill {
  name: string;
  level: number;       // 0–100
  years?: number;
  highlight?: boolean; // aparece resaltado en el código
}

export interface SkillFile {
  filename: string;    // nombre del tab en el IDE
  language: string;    // para el syntax highlighting
  icon: string;        // emoji / símbolo del tab
  color: string;       // color del tab activo
  code: (skills: Skill[]) => string; // función que genera el código
  skills: Skill[];
}

// ── Generadores de código por categoría ─────────────────────

const frontendCode = (skills: Skill[]) => {
  const lines = skills.map(s =>
    `  ${s.name.padEnd(22)}: { level: ${String(s.level).padStart(3)}%, years: ${s.years ?? 1} },${s.highlight ? '  // ★ dominio avanzado' : ''}`
  ).join('\n');

  return `// frontend.config.ts
// Tecnologías de interfaz y experiencia de usuario

interface Skill {
  level: number;
  years: number;
}

const frontendSkills: Record<string, Skill> = {
${lines}
};

export function getTopSkills() {
  return Object.entries(frontendSkills)
    .filter(([, s]) => s.level >= 80)
    .sort(([, a], [, b]) => b.level - a.level);
}

export default frontendSkills;`;
};

const backendCode = (skills: Skill[]) => {
  const lines = skills.map(s =>
    `  "${s.name}": {${s.highlight ? ' /* core */' : ''}\n    proficiency: ${s.level},\n    experience: "${s.years ?? 1} year${(s.years ?? 1) > 1 ? 's' : ''}"\n  },`
  ).join('\n');

  return `// backend.service.ts
// Servicios, APIs y arquitectura de servidor

@Injectable()
export class BackendSkillsService {
  private readonly skills = {
${lines}
  };

  async getServerCapabilities(): Promise<string[]> {
    return Object.keys(this.skills)
      .filter(key => this.skills[key].proficiency > 75);
  }
}`;
};

const databaseCode = (skills: Skill[]) => {
  const lines = skills.map(s =>
    `  - name: ${s.name}\n    level: ${s.level}%\n    type: ${s.level >= 80 ? 'production' : 'familiar'}${s.highlight ? '\n    badge: "preferred"' : ''}`
  ).join('\n\n');

  return `# database.yml
# Gestión de datos y persistencia

databases:
${lines}

migrations:
  tool: "custom scripts + ORM"
  strategy: "zero-downtime"

monitoring:
  - query_performance
  - connection_pooling
  - index_optimization`;
};

const toolingCode = (skills: Skill[]) => {
  const lines = skills.map(s =>
    `  { name: '${s.name}', mastery: ${s.level} }${s.highlight ? ' // daily driver' : ''}`
  ).join(',\n');

  return `// tooling.ts
// Herramientas, DevOps y flujo de trabajo

const devTools = [
${lines}
];

const workflow = {
  versionControl:  'Git + GitHub / GitLab',
  cicd:            'GitHub Actions / Vercel',
  containerization:'Docker + Docker Compose',
  deployment:      'Vercel, Railway, VPS',
  methodology:     'Agile / Scrum',
};

export { devTools, workflow };`;
};

const realtimeCode = (skills: Skill[]) => {
  const lines = skills.map(s =>
    `  ${s.name.padEnd(18)}: { level: ${String(s.level).padStart(3)}%, years: ${s.years ?? 1} }${s.highlight ? ' // ★ shipped' : ''}`
  ).join('\n');

  return `// realtime.socket.ts
// Sistemas en tiempo real: eventos, sincronización y observabilidad

type RealtimeSkill = { level: number; years: number };

export const realtime = {
${lines}
} satisfies Record<string, RealtimeSkill>;

export function readiness() {
  const prod = Object.entries(realtime)
    .filter(([, s]) => s.level >= 75)
    .map(([k]) => k);

  return {
    productionReady: prod,
    transport: ['WebSocket', 'HTTP'],
    patterns: ['rooms', 'events', 'ack/retry', 'rate-limit'],
  };
}`;
};

// ── Archivos del IDE ─────────────────────────────────────────

export const SKILL_FILES: SkillFile[] = [
  {
    filename: 'frontend.config.ts',
    language: 'typescript',
    icon: '⚛',
    color: '#00f5ff',
    skills: [
      { name: 'HTML5 / CSS3',        level: 92, years: 4, highlight: true },
      { name: 'JavaScript (ES6+)',   level: 88, years: 4, highlight: true },
      { name: 'TypeScript',          level: 82, years: 2, highlight: true },
      { name: 'React',               level: 86, years: 3, highlight: true },
      { name: 'Next.js',             level: 80, years: 2, highlight: true },
      { name: 'Tailwind CSS',        level: 85, years: 2, highlight: true },
      { name: 'Vite',                level: 78, years: 2 },
      { name: 'Framer Motion',       level: 70, years: 1 },
      { name: 'Three.js / R3F',      level: 66, years: 1 },
      { name: 'Responsive UI',       level: 84, years: 4 },
    ],
    code: frontendCode,
  },
  {
    filename: 'backend.service.ts',
    language: 'typescript',
    icon: '⬡',
    color: '#00ff88',
    skills: [
      { name: 'Node.js',             level: 84, years: 3, highlight: true },
      { name: 'Express.js',          level: 82, years: 3, highlight: true },
      { name: 'Django',              level: 78, years: 2, highlight: true },
      { name: 'Django REST Framework', level: 76, years: 2 },
      { name: 'FastAPI',             level: 70, years: 1 },
      { name: 'REST APIs',           level: 86, years: 3, highlight: true },
      { name: 'JWT (SimpleJWT)',     level: 80, years: 2, highlight: true },
      { name: 'Socket.IO',           level: 74, years: 1 },
      { name: 'WebSockets',          level: 72, years: 1 },
    ],
    code: backendCode,
  },
  {
    filename: 'database.yml',
    language: 'yaml',
    icon: '◈',
    color: '#a855f7',
    skills: [
      { name: 'PostgreSQL',      level: 80, years: 2, highlight: true },
      { name: 'Redis',           level: 72, years: 1, highlight: true },
      { name: 'SQLite',          level: 75, years: 2 },
      { name: 'SQLAlchemy',      level: 70, years: 1 },
      { name: 'Supabase',        level: 62, years: 1 },
    ],
    code: databaseCode,
  },
  {
    filename: 'tooling.ts',
    language: 'typescript',
    icon: '⚙',
    color: '#f0e040',
    skills: [
      { name: 'Git / GitHub',       level: 85, years: 4, highlight: true },
      { name: 'Docker / Compose',   level: 78, years: 2, highlight: true },
      { name: 'VS Code',            level: 90, years: 4, highlight: true },
      { name: 'Linux / Bash',       level: 70, years: 2 },
      { name: 'Postman',            level: 80, years: 3 },
      { name: 'Vercel',             level: 72, years: 1 },
      { name: 'Railway',            level: 66, years: 1 },
      { name: 'Testing (basic)',    level: 58, years: 1 },
    ],
    code: toolingCode,
  },
  {
    filename: 'realtime.socket.ts',
    language: 'typescript',
    icon: '⟡',
    color: '#ff2d6b',
    skills: [
      { name: 'Socket.IO',       level: 74, years: 1, highlight: true },
      { name: 'WebSockets',      level: 72, years: 1, highlight: true },
      { name: 'Redis (pub/sub)', level: 68, years: 1 },
      { name: 'Realtime billing', level: 66, years: 1 },
      { name: 'Dashboards',      level: 70, years: 2 },
      { name: 'Rate limiting',   level: 65, years: 1 },
    ],
    code: realtimeCode,
  },
];

// ── Output del "terminal" al ejecutar el código ──────────────
// Cada archivo tiene su propio output simulado

export const TERMINAL_OUTPUTS: Record<string, string[]> = {
  'frontend.config.ts': [
    '$ npx ts-node frontend.config.ts',
    '',
    '✔ Compiled successfully',
    '✔ getTopSkills() →',
    '  [ HTML5/CSS3(92%), JavaScript(88%), React(86%),',
    '    Tailwind(85%), TypeScript(82%), Next.js(80%) ]',
    '',
    '→ 10 skills loaded · 5 at expert level',
    '→ Primary stack: React + Next.js + Tailwind',
  ],
  'backend.service.ts': [
    '$ npx ts-node backend.service.ts',
    '',
    '✔ BackendSkillsService initialized',
    '✔ getServerCapabilities() →',
    '  [ "REST APIs", "Node.js", "Express.js",',
    '    "Django", "JWT (SimpleJWT)" ]',
    '',
    '→ 9 skills loaded · 5 production-ready',
    '→ API design: RESTful + auth + real-time (Socket.IO)',
  ],
  'database.yml': [
    '$ yaml-lint database.yml && node run.js',
    '',
    '✔ YAML valid',
    '✔ Databases loaded:',
    '  production → PostgreSQL',
    '  familiar   → Redis, SQLite, Supabase',
    '',
    '→ 5 entries · preferred: PostgreSQL',
    '→ ORM: SQLAlchemy · migrations: scripted',
  ],
  'tooling.ts': [
    '$ npx ts-node tooling.ts',
    '',
    '✔ Dev environment loaded',
    '✔ Daily drivers: VS Code(90%), Git(85%), Postman(80%)',
    '✔ Containers: Docker + Compose',
    '✔ Deploy: Vercel + Railway',
    '',
    '→ 8 tools · workflow: Agile/Scrum',
    '→ Deployment: Vercel / Railway / VPS',
  ],
  'realtime.socket.ts': [
    '$ npx ts-node realtime.socket.ts',
    '',
    '✔ Realtime stack loaded',
    '✔ readiness() → productionReady:',
    '  [ "Socket.IO", "WebSockets" ]',
    '',
    '→ Events: rooms + broadcasts + acknowledgements',
    '→ Use-case: SaaS (Parking) with realtime dashboards',
  ],
};