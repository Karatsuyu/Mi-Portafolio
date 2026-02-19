export default function ClassicProyectos() {
  return (
    <section className="section">
      <h2>Proyectos</h2>
      <div className="project-grid">
        {/* Cards de proyecto con video (los archivos pueden no existir en /public/videos) */}
        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/2025-10-13 17-20-25.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>Tienda Online (E‑commerce full‑stack)</h3>
          <p>Plataforma web para explorar productos, ver detalles y realizar compras.(Carrito, autenticación, etc)</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Next.js 15 (App Router), React 19, Tailwind CSS 3.4, FastAPI, Uvicorn, SQLAlchemy 2, Alembic (migraciones), Docker Compose</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p>End‑to‑end: definición de producto, UX/UI, desarrollo frontend y backend, modelado de datos y migraciones, integración de servicios (DB/Redis/ES), contenedores y entornos, pruebas y despliegue.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p>Flujo completo de compra: catálogo, búsqueda/filtrado, PDP, carrito, checkout y órdenes.</p>
          <a href="https://github.com/Karatsuyu/Tienda-Online.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>

        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/2025-12-03 12-26-20.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>Delicious Food es una aplicación web full-stack de delivery/pedidos de comida con funcionalidades de e-commerce gastronómico.</h3>
          <p>Es una plataforma de pedidos de comida que permite a los usuarios explorar el menú, crear combos personalizados, gestionar su carrito de compras con pagos via Stripe, compartir combos con la comunidad, y recibir notificaciones en tiempo real.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Django 5.2.6 + Django REST Framework, SQLite (desarrollo), Django CORS Headers, JWT para autenticación, Stripe para pagos, React 19.1.1, Vite (build tool), React Router DOM, Axios para API calls, Stripe.js para checkout, CSS modules</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p>Desarrollador Full-Stack - Implementaste la arquitectura completa de combos personalizados (modelos, API, persistencia), integración total de Stripe (checkout sessions, webhooks, confirmación de pagos), sistema social de combos públicos con estadísticas y perfiles de usuario, y interfaz de usuario avanzada con carrito persistente, personalizador visual, y flujos de pago end-to-end.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p>La aplicación busca crear una plataforma moderna de delivery que va más allá del pedido tradicional, permitiendo a los usuarios personalizar sus experiencias gastronómicas</p>
          <a href="https://github.com/Karatsuyu/delicious-food-app.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>

        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/2025-10-23 17-08-31.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>SaaS Full-Stack de Gestión Empresarial de Parqueaderos (ParkingPro)</h3>
          <p>Plataforma SaaS empresarial completa para gestionar parqueaderos con control en tiempo real de entrada/salida, facturación automática con múltiples tarifas, reservas online y dashboard analytics con WebSockets.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Node.js 18 + Express, PostgreSQL 15, Redis 7, Socket.IO, JWT, bcrypt. React 18 + TypeScript, TailwindCSS, Zustand, React Query, Recharts(Vite, Docker)</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p>full-stack developer y architect responsable de: Diseño y arquitectura del sistema completo (15+ tablas DB, 50+ endpoints), Backend API empresarial con 7 servicios principales, Frontend moderno con 10+ páginas planificadas</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p>Flujo completo de compra: catálogo, búsqueda/filtrado, PDP, carrito, checkout y órdenes.</p>
          <a href="https://github.com/Karatsuyu/parking-app.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>

        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/2025-10-21 09-59-56.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>Aplicación de gestión registral (Sistema de Información de Registro de Personas / Registraduría electrónica).</h3>
          <p>Sistema web full-stack para gestionar personas, documentos y generar reportes estadísticos</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Node.js + Express, PostgreSQL (pg), estructura MVC (models/controllers/routes). React (Vite), JSX, fetch/axios via servicios (API client).</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p> Desarrollador full-stack único: diseño de esquema DB, implementación backend y frontend, insercion de datos y pruebas locales</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p> Registrar y mantener datos de personas y documentos con integridad y búsquedas. Generar reportes y estadísticas útiles (por tipo de documento, por departamento, por sexo).</p>
          <a href="https://github.com/Karatsuyu/Registradur-a-De-Colombia.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>

        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/2025-12-03 15-27-11.mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>Aplicación de salud preventiva / bienestar personal (Health Risk Prediction App)</h3>
          <p>MiSalud es una plataforma full‑stack para registrar hábitos, consumir contenido educativo y obtener predicciones de riesgo de salud basadas en historial personal.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Django 4 + Django REST Framework, SimpleJWT para tokens, Python venv, SQLite, React + Vite, Tailwind CSS + PostCSS, React Query, React Hook Form, Zod, lucide‑react, Recharts.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p>Desarrollador full‑stack responsable: diseño y arquitectura, models/serializers/views en backend, API, frontend (UI/UX, validación, estado), integración ML, seguridad (consentimientos/GDPR), y despliegue local/testing.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p> Una solución integral: protege el acceso con JWT y consentimiento GDPR, ofrece un dashboard con métricas, historial y recomendaciones personalizadas. Permite CRUD y seguimiento de hábitos con predicciones basadas en datos, incluye un centro de contenido educativo y notificaciones. Dispone de panel admin en Django y una UI responsiva para administración y uso diario.</p>
          <a href="https://github.com/Karatsuyu/Mi-Salud.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>

        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/1014 (1)(1).mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>Aplicación cliente-servidor de gestión para una empresa de lavado de autos</h3>
          <p>Aplicación para gestionar clientes y servicios: el backend expone endpoints REST para crear/leer/actualizar/eliminar clientes y servicios. El frontend es una aplicación de escritorio en Tkinter que consume la API local para operaciones CRUD. Usa SQLite como almacenamiento local en el servidor.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Django 5.x, Django REST Framework, sqlite3, django-cors-headers, Python Tkinter (GUI), requests para consumir la API, threading para operaciones en segundo plano.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p> Diseñador de parte del frontend en Tkinter, responsable de la implementación de la interfaz gráfica y la lógica de consumo de la API y parte del backend REST</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p> Permitir CRUD completo de clientes y servicios vía API REST, por medio de una interfaz gráfica intuitiva en Tkinter.</p>
          <a href="https://github.com/Karatsuyu/Lavelo-Pues.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>

        <div className="project-card">
          <video className="project-video" autoPlay muted loop playsInline>
            <source src="/videos/1014 (1).mp4" type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          <h3>Sistema de Gestión Bancaria de Corresponsal</h3>
          <p>Sistema bancario desktop que permite a un corresponsal gestionar clientes, cuentas y transacciones (depósitos/retiros).</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Tecnologías:</strong></p>
          <p>Python puro (Python 3.x), Tkinter (interfaz gráfica nativa), Archivos de texto plano (.txt) con serialización manual, Programación Orientada a Objetos (POO) con herencia</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Mi rol:</strong></p>
          <p> Desarrollador Full-Stack único - Responsable del diseño completo de arquitectura, implementación de modelo de datos (10+ clases con herencia), lógica de negocio, persistencia custom, interfaz gráfica multi-ventana, y sistema de autenticación.</p>
          <br />
          <p className="titilo-descripcion-proyectos"><strong>Retos:</strong></p>
          <p> Gestionar operaciones bancarias básicas (clientes, cuentas, transacciones)</p>
          <a href="https://github.com/Karatsuyu/Banco.git" target="_blank" className="btn">Ver en GitHub</a>
        </div>
      </div>
    </section>
  );
}
