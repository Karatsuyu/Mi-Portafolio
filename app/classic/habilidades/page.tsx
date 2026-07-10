import SkillFlipCard from './SkillFlipCard';
import "../styles/habilidades.css";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaPaintBrush, FaDatabase, FaPython, FaJava, FaGithub, FaDocker } from 'react-icons/fa';
import { SKILL_LEVELS } from '@/constants';


export default function ClassicHabilidades() {
  const skills = [
    { percent: SKILL_LEVELS["HTML5"], color: "#ff8c00", label: "HTML5", icon: <FaHtml5 /> },
    { percent: SKILL_LEVELS["CSS3"], color: "#007bff", label: "CSS3", icon: <FaCss3Alt /> },
    { percent: SKILL_LEVELS["JavaScript"], color: "#ffe600", label: "JavaScript", icon: <FaJs /> },
    { percent: SKILL_LEVELS["React"], color: "#61dafb", label: "React", icon: <FaReact /> },
    { percent: SKILL_LEVELS["Figma"], color: "#e91e63", label: "UX/UI", icon: <FaPaintBrush /> },
    { percent: SKILL_LEVELS["PostgreSQL"], color: "#00758f", label: "SQL", icon: <FaDatabase /> },
    { percent: SKILL_LEVELS["Python"], color: "#3776ab", label: "Python", icon: <FaPython /> },
    { percent: 65, color: "#007396", label: "Java", icon: <FaJava /> },
    { percent: SKILL_LEVELS["GitHub"], color: "#ffffff", label: "GitHub", icon: <FaGithub /> },
    { percent: SKILL_LEVELS["Docker"], color: "#2496ed", label: "Docker", icon: <FaDocker /> },
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
