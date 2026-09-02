import SkillFlipCard from './SkillFlipCard';
import "../styles/habilidades.css";
import Image from 'next/image';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaPaintBrush, FaDatabase, FaPython, FaJava, FaGithub, FaDocker, FaGitAlt, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiRedux, SiMui, SiFramer, SiExpress, SiDjango, SiMongodb, SiMysql, SiFirebase, SiGraphql, SiPrisma, SiStripe, SiSlack, SiTrello } from 'react-icons/si';
import { SKILL_LEVELS } from '@/constants';


export default function ClassicHabilidades() {
  const skills = [
    // ── Originales (ya estaban) ───────────────────────────────
    { percent: SKILL_LEVELS["HTML5"],      color: "#ff8c00", label: "HTML5",        icon: <FaHtml5 /> },
    { percent: SKILL_LEVELS["CSS3"],       color: "#007bff", label: "CSS3",         icon: <FaCss3Alt /> },
    { percent: SKILL_LEVELS["JavaScript"], color: "#ffe600", label: "JavaScript",   icon: <FaJs /> },
    { percent: SKILL_LEVELS["React"],      color: "#61dafb", label: "React",        icon: <FaReact /> },
    { percent: SKILL_LEVELS["Figma"],      color: "#e91e63", label: "UX/UI",        icon: <FaPaintBrush /> },
    { percent: SKILL_LEVELS["PostgreSQL"], color: "#00758f", label: "SQL",          icon: <FaDatabase /> },
    { percent: SKILL_LEVELS["Python"],     color: "#3776ab", label: "Python",       icon: <FaPython /> },
    { percent: 65,                         color: "#007396", label: "Java",         icon: <FaJava /> },
    { percent: SKILL_LEVELS["GitHub"],     color: "#ffffff", label: "GitHub",       icon: <FaGithub /> },
    { percent: SKILL_LEVELS["Docker"],     color: "#2496ed", label: "Docker",       icon: <FaDocker /> },

    // ── Frontend nuevas ───────────────────────────────────────
    { percent: SKILL_LEVELS["TypeScript"],    color: "#3178c6", label: "TypeScript",    icon: <SiTypescript /> },
    { percent: SKILL_LEVELS["Next.js"], color: "#e2e8f0", label: "Next.js", icon: <Image src="/next.png" alt="Next.js" width={36} height={36} style={{ objectFit: "contain" }} /> },
    { percent: SKILL_LEVELS["Tailwind CSS"],  color: "#06b6d4", label: "Tailwind CSS",  icon: <SiTailwindcss /> },
    { percent: SKILL_LEVELS["Redux"],         color: "#764abc", label: "Redux",         icon: <SiRedux /> },
    { percent: SKILL_LEVELS["Material UI"],   color: "#007fff", label: "Material UI",   icon: <SiMui /> },
    { percent: SKILL_LEVELS["Framer Motion"], color: "#bb4b96", label: "Framer Motion", icon: <SiFramer /> },
    {
      percent: SKILL_LEVELS["React Query"],
      color: "#ff4154",
      label: "React Query",
      icon: <Image src="/reactquery.png" alt="React Query" width={36} height={36} style={{ objectFit: "contain" }} />,
    },

    // ── Backend nuevas ────────────────────────────────────────
    { percent: SKILL_LEVELS["Node.js"],   color: "#339933", label: "Node.js",   icon: <FaNodeJs /> },
    { percent: SKILL_LEVELS["Express"],   color: "#cccccc", label: "Express",   icon: <SiExpress /> },
    { percent: SKILL_LEVELS["Django"],    color: "#44b78b", label: "Django",    icon: <SiDjango /> },
    {
      percent: SKILL_LEVELS["FastAPI"] ?? 75,
      color: "#009688",
      label: "FastAPI",
      icon: <Image src="/python.svg" alt="FastAPI" width={36} height={36} style={{ objectFit: "contain" }} />,
    },
    { percent: SKILL_LEVELS["MongoDB"],  color: "#47a248", label: "MongoDB",  icon: <SiMongodb /> },
    { percent: SKILL_LEVELS["MySQL"],    color: "#4479a1", label: "MySQL",    icon: <SiMysql /> },
    { percent: SKILL_LEVELS["Firebase"], color: "#ffca28", label: "Firebase", icon: <SiFirebase /> },
    { percent: SKILL_LEVELS["GraphQL"],  color: "#e10098", label: "GraphQL",  icon: <SiGraphql /> },
    { percent: SKILL_LEVELS["Prisma"],   color: "#5a67d8", label: "Prisma",   icon: <SiPrisma /> },

    // ── Herramientas nuevas ───────────────────────────────────
    { percent: SKILL_LEVELS["Git"],          color: "#f05032", label: "Git",          icon: <FaGitAlt /> },
    { percent: SKILL_LEVELS["Three.js"], color: "#ffffff", label: "Three.js", icon: <Image src="/react.png" alt="Three.js" width={36} height={36} style={{ objectFit: "contain" }} /> },
    { percent: SKILL_LEVELS["React Native"], color: "#61dafb", label: "React Native", icon: <FaReact /> },
    { percent: SKILL_LEVELS["Stripe"],       color: "#635bff", label: "Stripe",       icon: <SiStripe /> },
    {
      percent: SKILL_LEVELS["ClickUp"] ?? 85,
      color: "#7b68ee",
      label: "ClickUp",
      icon: <Image src="/clickup.svg" alt="ClickUp" width={36} height={36} style={{ objectFit: "contain" }} />,
    },
    { percent: SKILL_LEVELS["Slack"],  color: "#e01e5a", label: "Slack",  icon: <SiSlack /> },
    { percent: SKILL_LEVELS["Trello"], color: "#0052cc", label: "Trello", icon: <SiTrello /> },
  ];

  return (
    <section className="section">
      <h2>Habilidades Técnicas</h2>
      <div className="skills-grid">
        <div><h4>Lenguajes</h4><p>Java, Python, JavaScript, SQL</p></div>
        <div><h4>Frontend</h4><p>HTML5, CSS3, React, Responsive Design</p></div>
        <div><h4>Backend</h4><p>Node.js, Django, Spring Boot</p></div>
        <div><h4>Bases de Datos</h4><p>MySQL, PostgreSQL, MongoDB</p></div>
        <div><h4>Herramientas</h4><p>Git, GitHub, Postman, Figma, Docker (básico)</p></div>
        <div><h4>Metodologías</h4><p>Scrum, Kanban, TDD, Trello, Pruebas unitarias/integración</p></div>
      </div>

      <h3>Habilidades Blandas</h3>
      <p>Comunicación efectiva, trabajo en equipo, responsabilidad, autodidactismo, resolución de problemas.</p>
      <p><strong>Idiomas:</strong> Español (nativo), Inglés (B1 – intermedio)</p>
      <br />
      <br />
      <h2>Medición de Habilidades</h2>

      <div className="skills-flip-grid">
        {skills.map((skill, idx) => (
          <SkillFlipCard key={idx} skill={skill} />
        ))}
      </div>
    </section>
  );
}
