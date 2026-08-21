export default function ClassicIndex() {
  return (
    <section className="section">
      <h1 className="classic-hero-title">
        Hola, soy <span className="highlight">Julián Estiven Gutierrez</span>
      </h1>
      <p className="subtitle">Tecnólogo en Desarrollo de Software – Universidad del Valle</p>
      <p>
        Soy un Tecnólogo en Desarrollo de Software formado en la Universidad del Valle, apasionado por la tecnología, la innovación y la creación de soluciones digitales que generen impacto. Mi enfoque principal está orientado al desarrollo de software de calidad, la experiencia del usuario (UX/UI) y la aplicación de buenas prácticas en todo el ciclo de vida del desarrollo.
      </p>
      <br />
      <p>
        Durante mi formación, he adquirido conocimientos sólidos en programación estructurada y orientada a objetos, diseño de bases de datos, desarrollo web (frontend y backend), análisis de requerimientos, ingeniería de software y pruebas funcionales. Me interesa especialmente el diseño de interfaces intuitivas, la optimización del rendimiento de las aplicaciones y la integración de herramientas que mejoren la experiencia del usuario final.
      </p>
      <br />
      <p>
        Mi objetivo profesional es seguir creciendo como desarrollador, profundizando en tecnologías modernas del ecosistema web y móvil, así como en el diseño de arquitecturas eficientes y mantenibles. Me motiva la idea de formar parte de proyectos donde pueda contribuir a través de la creatividad, la lógica y la mejora continua, aportando soluciones que combinen funcionalidad, diseño y valor real para las personas.
      </p>
      <br />
      <p>
        Soy una persona autodidacta, proactiva y adaptable, con gran interés por el aprendizaje constante y la actualización tecnológica. Busco siempre ir más allá de lo aprendido, investigando nuevas herramientas, patrones de diseño y tendencias en desarrollo de software que me permitan ofrecer productos cada vez más profesionales, escalables y sostenibles.
      </p>

      {/* ── Competencias Profesionales ── */}
      <div className="competencias-section">
        <div className="competencias-header">
          <div className="competencias-header-line" />
          <h2 className="competencias-title">
            <i className="fas fa-award" /> Competencias Profesionales
          </h2>
          <p className="competencias-subtitle">
            Competencias específicas adquiridas durante mi formación como Tecnólogo en Desarrollo de Software — Universidad del Valle
          </p>
          <div className="competencias-header-line" />
        </div>

        <div className="competencias-grid">
          {/* SCC.E.1 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.1</div>
            <h3 className="competencia-titulo">Fundamentos de Computación</h3>
            <p className="competencia-descripcion">
              Utilizo los conocimientos fundamentales en teoría de la computación en la construcción de sistemas basados en TIC.
            </p>
          </div>

          {/* SCC.E.2 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.2</div>
            <h3 className="competencia-titulo">Calidad de Software</h3>
            <p className="competencia-descripcion">
              Evalúo factores de calidad estandarizados durante la valoración de uno o varios productos de software.
            </p>
          </div>

          {/* SCC.E.3 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.3</div>
            <h3 className="competencia-titulo">Paradigmas y Lenguajes</h3>
            <p className="competencia-descripcion">
              Selecciono y utilizo diferentes paradigmas y lenguajes de programación al construir sistemas basados en TIC.
            </p>
          </div>

          {/* SCC.E.4 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.4</div>
            <h3 className="competencia-titulo">Diseño de Interfaces</h3>
            <p className="competencia-descripcion">
              Aplico conceptos y principios implicados en el proceso de diseño de interfaces gráficas de usuario durante el desarrollo de aplicaciones software.
            </p>
          </div>

          {/* SCC.E.5 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.5</div>
            <h3 className="competencia-titulo">Evaluación de Usabilidad</h3>
            <p className="competencia-descripcion">
              Aplico técnicas de evaluación de usabilidad que permiten medir la calidad de la experiencia que tienen los usuarios al interactuar con el software que desarrollo.
            </p>
          </div>

          {/* SCC.E.6 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.6</div>
            <h3 className="competencia-titulo">Infraestructura de TIC</h3>
            <p className="competencia-descripcion">
              Implemento proyectos de infraestructura de TIC comprendiendo las características propias de las tecnologías de transporte de datos.
            </p>
          </div>

          {/* SCC.E.7 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.7</div>
            <h3 className="competencia-titulo">Servicios de Infraestructura</h3>
            <p className="competencia-descripcion">
              Diseño y despliego soluciones de servicios de infraestructura tecnológica orientadas a resolver requerimientos de clientes.
            </p>
          </div>

          {/* SCC.E.8 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.8</div>
            <h3 className="competencia-titulo">Resolución de Problemas</h3>
            <p className="competencia-descripcion">
              Resuelvo problemas desde el nivel tecnológico identificando diferentes alternativas de solución y desarrollando sistemas basados en TIC.
            </p>
          </div>

          {/* SCC.E.9 */}
          <div className="competencia-card">
            <div className="competencia-code-badge">SCC.E.9</div>
            <h3 className="competencia-titulo">Desarrollo Integral de Proyectos</h3>
            <p className="competencia-descripcion">
              Desarrollo proyectos analizando, modelando, diseñando, evaluando, gestionando, documentando, desplegando e implementando sistemas basados en TIC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}