// ============================================================
//  CERTIFICADOS — edita con tus certificados reales
//  Cada certificado tiene su color holográfico único
// ============================================================

export interface Certificado {
  id: string;
  title: string;
  issuer: string;
  issuerShort: string;   // 2-3 letras para el avatar
  date: string;          // "Mar 2024"
  expiry?: string;       // "Mar 2027" o undefined si no expira
  credentialId?: string;
  verifyUrl?: string;
  description: string;
  skills: string[];
  category: 'cloud' | 'frontend' | 'backend' | 'fullstack' | 'design' | 'data' | 'devops';
  // Colores del efecto holográfico (gradiente que rota)
  holoColors: [string, string, string];
  featured?: boolean;
}

export const CERT_CATEGORY_COLORS: Record<Certificado['category'], string> = {
  cloud:     '#00f5ff',
  frontend:  '#00ff88',
  backend:   '#a855f7',
  fullstack: '#f0e040',
  design:    '#ff2d6b',
  data:      '#ff9500',
  devops:    '#00c8d4',
};

export const CERTIFICADOS: Certificado[] = [
  {
    id: 'meta-frontend',
    title: 'Meta Front-End Developer',
    issuer: 'Meta / Coursera',
    issuerShort: 'META',
    date: 'Sep 2023',
    credentialId: 'META-FE-2023-001',
    verifyUrl: 'https://coursera.org/verify/XXXXXX',
    description: 'Especialización oficial de Meta en 9 cursos. React avanzado, JavaScript profesional, accesibilidad web, testing y principios de UX/UI.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'UX Design', 'Testing'],
    category: 'frontend',
    holoColors: ['#00ff88', '#00f5ff', '#a855f7'],
    featured: true,
  },
  {
    id: 'aws-ccp',
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issuerShort: 'AWS',
    date: 'Nov 2023',
    expiry: 'Nov 2026',
    credentialId: 'AWS-CCP-2023-XYZ',
    verifyUrl: 'https://aws.amazon.com/verification',
    description: 'Fundamentos de cloud computing en AWS. Servicios core: EC2, S3, RDS, Lambda, IAM. Arquitecturas cloud, seguridad y modelo de costos.',
    skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Lambda', 'IAM'],
    category: 'cloud',
    holoColors: ['#ff9500', '#ff2d6b', '#f0e040'],
    featured: true,
  },
  {
    id: 'google-ux',
    title: 'Google UX Design Certificate',
    issuer: 'Google / Coursera',
    issuerShort: 'GGL',
    date: 'Jun 2023',
    credentialId: 'GOOGLE-UX-2023-ABC',
    verifyUrl: 'https://coursera.org/verify/YYYYYY',
    description: 'Proceso completo de diseño UX: investigación de usuarios, wireframing, prototipado en Figma y pruebas de usabilidad.',
    skills: ['UX Research', 'Figma', 'Wireframing', 'Prototyping', 'Usability Testing'],
    category: 'design',
    holoColors: ['#ff2d6b', '#f0e040', '#00f5ff'],
  },
  {
    id: 'mongodb-associate',
    title: 'MongoDB Associate Developer',
    issuer: 'MongoDB University',
    issuerShort: 'MDB',
    date: 'Aug 2023',
    expiry: 'Aug 2026',
    credentialId: 'MDB-ASSOC-2023-DEF',
    verifyUrl: 'https://university.mongodb.com/verify',
    description: 'Desarrollo con MongoDB: modelado de documentos, operaciones CRUD, aggregation pipeline, índices, transacciones y integración con Node.js.',
    skills: ['MongoDB', 'NoSQL', 'Aggregation', 'Node.js', 'Atlas'],
    category: 'backend',
    holoColors: ['#00ff88', '#00c8d4', '#a855f7'],
  },
  {
    id: 'react-advanced',
    title: 'React — Advanced Patterns',
    issuer: 'Frontend Masters',
    issuerShort: 'FEM',
    date: 'Apr 2023',
    description: 'Patrones avanzados de React: compound components, render props, hooks personalizados, performance optimization y concurrent features.',
    skills: ['React', 'TypeScript', 'Custom Hooks', 'Performance', 'Patterns'],
    category: 'frontend',
    holoColors: ['#00f5ff', '#00ff88', '#f0e040'],
  },
  {
    id: 'docker-kubernetes',
    title: 'Docker & Kubernetes Essentials',
    issuer: 'Linux Foundation',
    issuerShort: 'LF',
    date: 'Feb 2023',
    credentialId: 'LF-DKE-2023-GHI',
    description: 'Containerización con Docker, orquestación con Kubernetes. Deployments, services, ingress, ConfigMaps, Secrets y CI/CD pipelines.',
    skills: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Linux'],
    category: 'devops',
    holoColors: ['#00c8d4', '#a855f7', '#ff2d6b'],
  },
  {
    id: 'typescript-pro',
    title: 'TypeScript Pro Masterclass',
    issuer: 'Total TypeScript',
    issuerShort: 'TTS',
    date: 'Jan 2023',
    description: 'TypeScript avanzado con Matt Pocock. Generics complejos, conditional types, template literal types, infer y patrones de type-safety.',
    skills: ['TypeScript', 'Generics', 'Type System', 'Zod', 'tRPC'],
    category: 'frontend',
    holoColors: ['#a855f7', '#00f5ff', '#00ff88'],
  },
  {
    id: 'nextjs-vercel',
    title: 'Next.js & Vercel Certified',
    issuer: 'Vercel',
    issuerShort: 'VCL',
    date: 'Mar 2024',
    credentialId: 'VCL-NEXT-2024-JKL',
    verifyUrl: 'https://vercel.com/certifications',
    description: 'Next.js 14 con App Router, Server Components, Streaming, optimización de imágenes y deployment avanzado en Vercel con Edge Functions.',
    skills: ['Next.js', 'Vercel', 'Edge Functions', 'Server Components', 'ISR'],
    category: 'fullstack',
    holoColors: ['#f0e040', '#ff9500', '#ff2d6b'],
    featured: true,
  },
];

// Categorías para el filtro
export const CERT_CATEGORIES = [
  { key: 'all',      label: 'Todos'     },
  { key: 'frontend', label: 'Frontend'  },
  { key: 'backend',  label: 'Backend'   },
  { key: 'cloud',    label: 'Cloud'     },
  { key: 'fullstack',label: 'Full Stack'},
  { key: 'design',   label: 'Design'    },
  { key: 'devops',   label: 'DevOps'    },
  { key: 'data',     label: 'Data'      },
] as const;
