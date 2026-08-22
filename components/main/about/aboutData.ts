/**
 * aboutData.ts — Contenido del modal "Sobre mí" del tema Space
 *
 * Misma información que ya existe en app/classic/page.tsx (bio +
 * Competencias Profesionales), separada en un archivo de datos para
 * que sea fácil de mantener sincronizada entre temas sin tocar el
 * componente visual.
 */

export const BIO_NAME = "Julián Estiven Gutiérrez";
export const BIO_ROLE = "Tecnólogo en Desarrollo de Software – Universidad del Valle";

export const BIO_PARAGRAPHS: string[] = [
  "Soy un Tecnólogo en Desarrollo de Software formado en la Universidad del Valle, apasionado por la tecnología, la innovación y la creación de soluciones digitales que generen impacto. Mi enfoque principal está orientado al desarrollo de software de calidad, la experiencia del usuario (UX/UI) y la aplicación de buenas prácticas en todo el ciclo de vida del desarrollo.",
  "Durante mi formación, he adquirido conocimientos sólidos en programación estructurada y orientada a objetos, diseño de bases de datos, desarrollo web (frontend y backend), análisis de requerimientos, ingeniería de software y pruebas funcionales. Me interesa especialmente el diseño de interfaces intuitivas, la optimización del rendimiento de las aplicaciones y la integración de herramientas que mejoren la experiencia del usuario final.",
  "Mi objetivo profesional es seguir creciendo como desarrollador, profundizando en tecnologías modernas del ecosistema web y móvil, así como en el diseño de arquitecturas eficientes y mantenibles. Me motiva la idea de formar parte de proyectos donde pueda contribuir a través de la creatividad, la lógica y la mejora continua, aportando soluciones que combinen funcionalidad, diseño y valor real para las personas.",
  "Soy una persona autodidacta, proactiva y adaptable, con gran interés por el aprendizaje constante y la actualización tecnológica. Busco siempre ir más allá de lo aprendido, investigando nuevas herramientas, patrones de diseño y tendencias en desarrollo de software que me permitan ofrecer productos cada vez más profesionales, escalables y sostenibles.",
];

export interface Competencia {
  code: string;
  title: string;
  description: string;
  color: "purple" | "red" | "cyan" | "green" | "pink" | "orange" | "blue" | "lime" | "magenta";
  tag: string;
  icons: string[];
}

export const COMPETENCIAS: Competencia[] = [
  {
    code: "SCC.E.1",
    title: "Fundamentos de Computación",
    description:
      "Utilizo los conocimientos fundamentales en teoría de la computación en la construcción de sistemas basados en TIC.",
    color: "purple",
    tag: "Teoría",
    icons: ["</>", "∑"],
  },
  {
    code: "SCC.E.2",
    title: "Calidad de Software",
    description:
      "Evalúo factores de calidad estandarizados durante la valoración de uno o varios productos de software.",
    color: "red",
    tag: "Calidad",
    icons: ["✓", "⚙"],
  },
  {
    code: "SCC.E.3",
    title: "Paradigmas y Lenguajes",
    description:
      "Selecciono y utilizo diferentes paradigmas y lenguajes de programación al construir sistemas basados en TIC.",
    color: "cyan",
    tag: "Paradigmas",
    icons: ["JS", "Py", "TS"],
  },
  {
    code: "SCC.E.4",
    title: "Diseño de Interfaces",
    description:
      "Aplico conceptos y principios implicados en el proceso de diseño de interfaces gráficas de usuario durante el desarrollo de aplicaciones software.",
    color: "green",
    tag: "Diseño UX",
    icons: ["UI", "✦"],
  },
  {
    code: "SCC.E.5",
    title: "Evaluación de Usabilidad",
    description:
      "Aplico técnicas de evaluación de usabilidad que permiten medir la calidad de la experiencia que tienen los usuarios al interactuar con el software que desarrollo.",
    color: "pink",
    tag: "Usabilidad",
    icons: ["UX", "◎"],
  },
  {
    code: "SCC.E.6",
    title: "Infraestructura de TIC",
    description:
      "Implemento proyectos de infraestructura de TIC comprendiendo las características propias de las tecnologías de transporte de datos.",
    color: "orange",
    tag: "Infraestructura",
    icons: ["◉", "⇄"],
  },
  {
    code: "SCC.E.7",
    title: "Servicios de Infraestructura",
    description:
      "Diseño y despliego soluciones de servicios de infraestructura tecnológica orientadas a resolver requerimientos de clientes.",
    color: "blue",
    tag: "Servicios",
    icons: ["▣", "⬡"],
  },
  {
    code: "SCC.E.8",
    title: "Resolución de Problemas",
    description:
      "Resuelvo problemas desde el nivel tecnológico identificando diferentes alternativas de solución y desarrollando sistemas basados en TIC.",
    color: "lime",
    tag: "Soluciones",
    icons: ["⚡", "✓"],
  },
  {
    code: "SCC.E.9",
    title: "Desarrollo Integral de Proyectos",
    description:
      "Desarrollo proyectos analizando, modelando, diseñando, evaluando, gestionando, documentando, desplegando e implementando sistemas basados en TIC.",
    color: "magenta",
    tag: "Proyectos",
    icons: ["◈", "⚙"],
  },
];
