export default function ClassicContacto() {
  return (
    <section className="section">
      <h2 className="tituloCentroC">Contactos</h2>

      <div className="social-links">
        <a href="mailto:julian.estiven.gutierrez@correounivalle.edu.co" aria-label="Email"><i className="fas fa-envelope"></i></a>
        <a href="tel:+573234378971" aria-label="Teléfono"><i className="fas fa-phone"></i></a>
        <a href="https://www.google.com/maps/place/El+Vergel,+G%C3%A9nova,+Quind%C3%ADo/@4.1953196,-75.8069597,14z" target="_blank" rel="noopener" aria-label="Ubicación"><i className="fas fa-map-marker-alt"></i></a>
        <a href="https://github.com/Karatsuyu" target="_blank" rel="noopener" aria-label="GitHub"><i className="fab fa-github"></i></a>
        <a href="https://www.linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382/" target="_blank" rel="noopener" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
        <a href="https://wa.me/573234378971" target="_blank" rel="noopener" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
        <a href="https://www.instagram.com/tabjulian07/" target="_blank" rel="noopener" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        <a href="https://x.com/JulinTabar7259" target="_blank" rel="noopener" aria-label="X"><i className="fab fa-x-twitter"></i></a>
      </div>

      <div className="contact-form-container">
        <h3>Envíame un mensaje</h3>
        <form id="contactForm" className="contact-form">
          <div className="form-group">
            <label htmlFor="username">Nombre completo *</label>
            <input type="text" id="username" name="username" required minLength={2} maxLength={100} placeholder="Tu nombre completo" />
            <span className="error-message" id="username-error"></span>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input type="email" id="email" name="email" required placeholder="tu@email.com" />
            <span className="error-message" id="email-error"></span>
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje *</label>
            <textarea id="message" name="message" required minLength={10} maxLength={2000} rows={6} placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)"></textarea>
            <div className="char-counter">
              <span id="char-count">0</span>/2000 caracteres
            </div>
            <span className="error-message" id="message-error"></span>
          </div>

          <button type="submit" className="submit-btn" id="submitBtn">
            <i className="fas fa-paper-plane"></i>
            <span className="btn-text">Enviar Mensaje</span>
            <div className="spinner" style={{ display: "none" }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          </button>
        </form>

        <div id="responseMessage" className="response-message" style={{ display: "none" }}></div>
      </div>
    </section>
  );
}
