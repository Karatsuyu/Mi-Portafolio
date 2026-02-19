import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./css/styles.css";

export const metadata: Metadata = {
  title: "Portfolio Clásico",
  description: "Layout con sidebar + contenido principal (estilo clásico)",
};

export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button className="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menú">
        <i className="fas fa-bars" />
      </button>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <img src="/images/1756766660817.png" alt="Foto de perfil" />
          <h2 className="name">Julián Estiven Gutierrez</h2>
          <p className="title">Tecnólogo en Desarrollo de Software</p>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <Link href="/classic" className="nav-link">
                <i className="fas fa-home icon" />
                <span className="text">Inicio</span>
              </Link>
            </li>
            <li>
              <Link href="/classic/formacion" className="nav-link">
                <i className="fas fa-graduation-cap icon" />
                <span className="text">Formación</span>
              </Link>
            </li>
            <li>
              <Link href="/classic/proyectos" className="nav-link">
                <i className="fas fa-code icon" />
                <span className="text">Proyectos</span>
              </Link>
            </li>
            <li>
              <Link href="/classic/habilidades" className="nav-link">
                <i className="fas fa-laptop-code icon" />
                <span className="text">Habilidades</span>
              </Link>
            </li>
            <li>
              <Link href="/classic/certificados" className="nav-link">
                <i className="fas fa-award icon" />
                <span className="text">Certificados</span>
              </Link>
            </li>
            <li>
              <Link href="/classic/contacto" className="nav-link">
                <i className="fas fa-envelope icon" />
                <span className="text">Contacto</span>
              </Link>
            </li>
            <li>
              <button id="themeToggle" className="nav-link" style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}>
                <i className="fas fa-sun icon" />
                <span className="text">Modo Día</span>
              </button>
            </li>
            <li style={{ position: "relative" }}>
              <button
                className="nav-link"
                id="styleToggleBtn"
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
              >
                <i className="fas fa-palette icon" />
                <span className="text" style={{ position: "relative" }}>
                  Estilo
                  <div
                    id="styleDropdown"
                    className="style-dropdown-menu"
                    style={{ display: "none", position: "absolute", left: 0, top: "100%", background: "rgba(30,41,59,0.95)", border: "1px solid rgba(255,0,153,0.2)", borderRadius: 8, marginTop: 5, minWidth: 150, zIndex: 100, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}
                  >
                    <Link href="/gamer" className="style-dropdown-item" style={{ display: "block", padding: "10px 15px", color: "#ffffff", textDecoration: "none" }}>
                      Neon
                    </Link>
                  </div>
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">{children}</main>

      {/* Modal de imagen para la foto de perfil */}
      <div id="imgModal" className="img-modal" aria-hidden="true">
        <button className="img-modal__close" aria-label="Cerrar imagen">
          &times;
        </button>
        <img className="img-modal__image" alt="Foto de perfil ampliada" />
      </div>

      {/* Script de interacciones del estilo clásico */}
      <Script src="/classic/js/scripts.js" strategy="afterInteractive" />

    </>
  );
}