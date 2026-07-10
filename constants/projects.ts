// ══════════════════════════════════════════════════════════════════
// PROYECTOS - Fuente única de verdad para todos los temas
// ══════════════════════════════════════════════════════════════════

export interface ProjectTimeline {
  id: number;
  num: string;
  title: string;
  subtitle: string;
  year: string; // Año o periodo (ej: "2024", "2023-2024")
  month?: string; // Mes opcional para mayor precisión
  date: Date; // Para ordenamiento
  techStack: string[]; // Stack técnico resumido
  hexColor: string;
  repoUrl: string;
  liveUrl?: string;
  video?: string; // Para tema Runic
  // Datos extendidos para modales (Fase 4)
  description: string;
  role: string;
  challenge: string;
  duration?: string;
}

export const UNIFIED_PROJECTS: ProjectTimeline[] = [
  {
    id: 1,
    num: "01",
    title: "Tienda Online",
    subtitle: "E-commerce Full-Stack",
    year: "2024",
    month: "Octubre",
    date: new Date("2024-10-01"),
    techStack: ["Next.js 15", "React 19", "FastAPI", "Docker"],
    hexColor: "#ef4444",
    repoUrl: "https://github.com/Karatsuyu/Tienda-Online.git",
    liveUrl: "",
    video: "/videos/2025-10-13 17-20-25.mp4",
    description: "Plataforma web para explorar productos, ver detalles y realizar compras con carrito, autenticación y checkout.",
    role: "Desarrollador Full-Stack End-to-End",
    challenge: "Implementar flujo completo de compra con autenticación y gestión de sesiones.",
    duration: "3 meses",
  },
  {
    id: 2,
    num: "02",
    title: "Delicious Food",
    subtitle: "Delivery + E-commerce",
    year: "2024",
    month: "Diciembre",
    date: new Date("2024-12-01"),
    techStack: ["Django", "DRF", "React", "Stripe"],
    hexColor: "#f97316",
    repoUrl: "https://github.com/Karatsuyu/delicious-food-app.git",
    liveUrl: "",
    video: "/videos/2025-12-03 12-26-20.mp4",
    description: "Plataforma de pedidos de comida con combos personalizados, pagos con Stripe y comunidad social.",
    role: "Desarrollador Full-Stack",
    challenge: "Integración de pagos seguros con Stripe y personalización de productos.",
    duration: "4 meses",
  },
  {
    id: 3,
    num: "03",
    title: "ParkingPro SaaS",
    subtitle: "Gestión de Parqueaderos",
    year: "2024",
    month: "Octubre",
    date: new Date("2024-10-01"),
    techStack: ["Node.js", "PostgreSQL", "Socket.IO", "React"],
    hexColor: "#facc15",
    repoUrl: "https://github.com/Karatsuyu/parking-app.git",
    liveUrl: "",
    video: "/videos/2025-10-23 17-08-31.mp4",
    description: "Plataforma SaaS con control en tiempo real, facturación automática y dashboard analytics.",
    role: "Arquitecto Full-Stack",
    challenge: "Sistema en tiempo real con WebSockets para múltiples usuarios simultáneos.",
    duration: "5 meses",
  },
  {
    id: 4,
    num: "04",
    title: "Sistema Registral",
    subtitle: "Gestión de Personas y Documentos",
    year: "2024",
    month: "Octubre",
    date: new Date("2024-10-01"),
    techStack: ["Node.js", "Express", "PostgreSQL", "React"],
    hexColor: "#22c55e",
    repoUrl: "https://github.com/Karatsuyu/Registradur-a-De-Colombia.git",
    liveUrl: "",
    video: "/videos/2025-10-21 09-59-56.mp4",
    description: "Sistema web para gestionar personas, documentos y generar reportes estadísticos.",
    role: "Desarrollador Full-Stack Único",
    challenge: "Gestionar integridad de datos y generar reportes complejos.",
    duration: "3 meses",
  },
  {
    id: 5,
    num: "05",
    title: "MiSalud",
    subtitle: "Health Risk Prediction",
    year: "2024",
    month: "Diciembre",
    date: new Date("2024-12-01"),
    techStack: ["Django", "DRF", "React", "Tailwind"],
    hexColor: "#06b6d4",
    repoUrl: "https://github.com/Karatsuyu/Mi-Salud.git",
    liveUrl: "",
    video: "/videos/2025-12-03 15-27-11.mp4",
    description: "Plataforma para registrar hábitos, contenido educativo y predicciones de salud con ML.",
    role: "Desarrollador Full-Stack",
    challenge: "Dashboard interactivo y predicciones con Machine Learning.",
    duration: "4 meses",
  },
  {
    id: 6,
    num: "06",
    title: "Portfolio Web",
    subtitle: "CV Profesional Full-Stack",
    year: "2024",
    month: "Octubre",
    date: new Date("2024-10-01"),
    techStack: ["HTML5", "CSS3", "JavaScript"],
    hexColor: "#8b5cf6",
    repoUrl: "https://github.com/Karatsuyu/Mi-Hoja-De-Vida.git",
    liveUrl: "",
    video: "/videos/2025-10-23 18-00-50.mp4",
    description: "Sitio web responsive con sidebar, 8 proyectos, animaciones y modo oscuro/claro.",
    role: "Diseñador Frontend HTML/CSS",
    challenge: "Maquetación responsive completa y tema día/noche sin frameworks.",
    duration: "2 meses",
  },
  {
    id: 7,
    num: "07",
    title: "Lavadero App",
    subtitle: "Cliente-Servidor",
    year: "2023",
    month: "Noviembre",
    date: new Date("2023-11-01"),
    techStack: ["Django", "DRF", "Python Tkinter"],
    hexColor: "#ec4899",
    repoUrl: "https://github.com/Karatsuyu/Lavelo-Pues.git",
    liveUrl: "",
    video: "/videos/1014 (1)(1).mp4",
    description: "App para gestionar clientes y servicios: Backend REST + Frontend Desktop Tkinter.",
    role: "Diseñador Frontend Tkinter",
    challenge: "CRUD completo vía API REST con interfaz desktop.",
    duration: "2 meses",
  },
  {
    id: 8,
    num: "08",
    title: "Sistema Bancario",
    subtitle: "Gestión Desktop",
    year: "2023",
    month: "Octubre",
    date: new Date("2023-10-01"),
    techStack: ["Python", "Tkinter", "POO"],
    hexColor: "#14b8a6",
    repoUrl: "https://github.com/Karatsuyu/Banco.git",
    liveUrl: "",
    video: "/videos/1014 (1).mp4",
    description: "Sistema desktop para gestionar clientes, cuentas y transacciones bancarias.",
    role: "Desarrollador Full-Stack Único",
    challenge: "Persistencia custom con archivos .txt y arquitectura multi-ventana.",
    duration: "2 meses",
  },
];

// Ordenar proyectos por fecha (más reciente primero)
export const PROJECTS_SORTED = [...UNIFIED_PROJECTS].sort(
  (a, b) => b.date.getTime() - a.date.getTime()
);

// Ordenar proyectos por fecha (más antiguo primero) para timeline
export const PROJECTS_TIMELINE = [...UNIFIED_PROJECTS].sort(
  (a, b) => a.date.getTime() - b.date.getTime()
);
