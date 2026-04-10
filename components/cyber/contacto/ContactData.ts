// ============================================================
//  CONTACTO — datos y comandos del terminal CLI
//  Edita tus datos reales aquí
// ============================================================

export interface ContactInfo {
  name:       string;
  role:       string;
  email:      string;
  location:   string;
  linkedin:   string;
  github:     string;
  twitter?:   string;
  website?:   string;
  available:  boolean;   // muestra badge "disponible para trabajo"
  timezone:   string;    // "UTC-5 (Bogotá)"
  responseTime: string;  // "< 24 horas"
}

// ── TUS DATOS — edita esto ───────────────────────────────────
export const CONTACT: ContactInfo = {
  name:         'Tu Nombre',
  role:         'Full Stack Developer',
  email:        'tu@email.com',
  location:     'Bogotá, Colombia',
  linkedin:     'https://linkedin.com/in/tuusuario',
  github:       'https://github.com/tuusuario',
  twitter:      'https://twitter.com/tuusuario',
  website:      'https://tudominio.com',
  available:    true,
  timezone:     'UTC-5 (Bogotá)',
  responseTime: '< 24 horas',
};

// ── Respuestas de comandos ───────────────────────────────────
// Cada comando tiene: descripción, output (líneas), y acción opcional

export interface TerminalCommand {
  cmd:         string;          // nombre del comando
  alias?:      string[];        // alias alternativos
  description: string;          // texto en --help
  output:      (info: ContactInfo) => TerminalLine[];
  action?:     'open-email' | 'open-linkedin' | 'open-github' | 'open-twitter' | 'open-website' | 'send-form';
}

export type LineType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'highlight' | 'muted' | 'prompt';

export interface TerminalLine {
  text:   string;
  type?:  LineType;
  delay?: number;   // ms extra de delay antes de esta línea
}

// ── Definición de comandos disponibles ──────────────────────
export const COMMANDS: TerminalCommand[] = [
  {
    cmd: 'help',
    alias: ['--help', '-h', '?'],
    description: 'Muestra todos los comandos disponibles',
    output: () => [
      { text: '', type: 'default' },
      { text: '  Comandos disponibles:', type: 'info' },
      { text: '', type: 'default' },
      { text: '  --email          Muestra email de contacto', type: 'default' },
      { text: '  --linkedin       Abre perfil de LinkedIn',   type: 'default' },
      { text: '  --github         Abre perfil de GitHub',     type: 'default' },
      { text: '  --twitter        Abre perfil de Twitter',    type: 'default' },
      { text: '  --website        Abre portfolio web',        type: 'default' },
      { text: '  --info           Información general',       type: 'default' },
      { text: '  --available      Estado de disponibilidad',  type: 'default' },
      { text: '  --send [msg]     Envía un mensaje directo',  type: 'highlight' },
      { text: '  --clear          Limpia el terminal',        type: 'default' },
      { text: '  help             Muestra este mensaje',      type: 'default' },
      { text: '', type: 'default' },
      { text: '  💡 Tip: usa Tab para autocompletar comandos', type: 'muted' },
      { text: '', type: 'default' },
    ],
  },
  {
    cmd: '--email',
    alias: ['email'],
    description: 'Muestra el email de contacto',
    output: (info) => [
      { text: '', type: 'default' },
      { text: '  ┌─ Email de contacto ─────────────────────┐', type: 'info' },
      { text: `  │  ${info.email.padEnd(43)}│`, type: 'highlight' },
      { text: '  └─────────────────────────────────────────┘', type: 'info' },
      { text: '', type: 'default' },
      { text: `  ✔ Copiado al portapapeles`, type: 'success' },
      { text: `  → Tiempo de respuesta: ${info.responseTime}`, type: 'muted' },
      { text: '', type: 'default' },
    ],
    action: 'open-email',
  },
  {
    cmd: '--linkedin',
    alias: ['linkedin', 'li'],
    description: 'Abre el perfil de LinkedIn',
    output: (info) => [
      { text: '', type: 'default' },
      { text: '  Conectando con LinkedIn...', type: 'info' },
      { text: `  ↗ ${info.linkedin}`, type: 'highlight', delay: 200 },
      { text: '  ✔ Abriendo en nueva pestaña', type: 'success', delay: 400 },
      { text: '', type: 'default' },
    ],
    action: 'open-linkedin',
  },
  {
    cmd: '--github',
    alias: ['github', 'gh'],
    description: 'Abre el perfil de GitHub',
    output: (info) => [
      { text: '', type: 'default' },
      { text: '  Conectando con GitHub...', type: 'info' },
      { text: `  ↗ ${info.github}`, type: 'highlight', delay: 200 },
      { text: '  ✔ Abriendo repositorios públicos', type: 'success', delay: 400 },
      { text: '', type: 'default' },
    ],
    action: 'open-github',
  },
  {
    cmd: '--twitter',
    alias: ['twitter', 'x'],
    description: 'Abre el perfil de Twitter/X',
    output: (info) => [
      { text: '', type: 'default' },
      { text: '  Conectando con Twitter/X...', type: 'info' },
      { text: `  ↗ ${info.twitter ?? 'No disponible'}`, type: 'highlight', delay: 200 },
      { text: '  ✔ Abriendo perfil', type: 'success', delay: 400 },
      { text: '', type: 'default' },
    ],
    action: 'open-twitter',
  },
  {
    cmd: '--website',
    alias: ['website', 'web', 'portfolio'],
    description: 'Abre el portfolio web',
    output: (info) => [
      { text: '', type: 'default' },
      { text: '  Iniciando conexión...', type: 'info' },
      { text: `  ↗ ${info.website ?? 'No disponible'}`, type: 'highlight', delay: 200 },
      { text: '  ✔ Portfolio cargado', type: 'success', delay: 400 },
      { text: '', type: 'default' },
    ],
    action: 'open-website',
  },
  {
    cmd: '--info',
    alias: ['info', 'whoami', 'about'],
    description: 'Información general de contacto',
    output: (info) => [
      { text: '', type: 'default' },
      { text: '  ╔══════════════════════════════════════════╗', type: 'info' },
      { text: `  ║  ${info.name.padEnd(42)}║`, type: 'highlight' },
      { text: `  ║  ${info.role.padEnd(42)}║`, type: 'info' },
      { text: '  ╠══════════════════════════════════════════╣', type: 'info' },
      { text: `  ║  📍 ${info.location.padEnd(38)}║`, type: 'default' },
      { text: `  ║  🕐 ${info.timezone.padEnd(38)}║`, type: 'default' },
      { text: `  ║  ⚡ Respuesta: ${info.responseTime.padEnd(28)}║`, type: 'default' },
      { text: '  ╚══════════════════════════════════════════╝', type: 'info' },
      { text: '', type: 'default' },
    ],
  },
  {
    cmd: '--available',
    alias: ['available', 'status', 'hire'],
    description: 'Muestra el estado de disponibilidad',
    output: (info) => info.available
      ? [
          { text: '', type: 'default' },
          { text: '  ╔══════════════════════════════════════════╗', type: 'success' },
          { text: '  ║  ● DISPONIBLE PARA NUEVOS PROYECTOS      ║', type: 'success' },
          { text: '  ╠══════════════════════════════════════════╣', type: 'success' },
          { text: '  ║  Modalidad: Remoto / Híbrido             ║', type: 'default' },
          { text: '  ║  Tipo: Freelance / Tiempo completo       ║', type: 'default' },
          { text: `  ║  Contacto: ${info.email.padEnd(31)}║`, type: 'highlight' },
          { text: '  ╚══════════════════════════════════════════╝', type: 'success' },
          { text: '', type: 'default' },
          { text: '  → Usa --send "tu mensaje" para contactar', type: 'muted' },
          { text: '', type: 'default' },
        ]
      : [
          { text: '', type: 'default' },
          { text: '  ● No disponible actualmente', type: 'warning' },
          { text: '  → Aún puedes enviar un mensaje con --send', type: 'muted' },
          { text: '', type: 'default' },
        ],
  },
  {
    cmd: '--send',
    alias: ['send', 'msg', 'message', 'contact'],
    description: 'Envía un mensaje — uso: --send "tu mensaje"',
    output: () => [
      { text: '', type: 'default' },
      { text: '  Iniciando formulario de contacto...', type: 'info' },
      { text: '  ✔ Formulario listo', type: 'success', delay: 300 },
      { text: '', type: 'default' },
    ],
    action: 'send-form',
  },
  {
    cmd: '--clear',
    alias: ['clear', 'cls'],
    description: 'Limpia el terminal',
    output: () => [],
  },
];

// ── Mensaje de bienvenida ────────────────────────────────────
export const WELCOME_LINES: TerminalLine[] = [
  { text: '  ╔══════════════════════════════════════════════╗', type: 'info' },
  { text: '  ║   CYBER PORTFOLIO — CONTACT TERMINAL v1.0   ║', type: 'highlight' },
  { text: '  ╚══════════════════════════════════════════════╝', type: 'info' },
  { text: '', type: 'default' },
  { text: '  Bienvenido al terminal de contacto.', type: 'default' },
  { text: '  Escribe help para ver los comandos disponibles.', type: 'muted' },
  { text: '', type: 'default' },
];
