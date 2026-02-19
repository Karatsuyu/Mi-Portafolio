export default function ClassicCertificados() {
  return (
    <section className="section">
      <h2>Certificados</h2>
      <div className="project-grid">
        <div className="project-card">
          <div className="pdf-preview-container">
            <canvas id="pdf-canvas-preview"></canvas>
          </div>
          <h3>Desarrollo de Software con IA</h3>
          <p>Certificado en desarrollo de software con herramientas de inteligencia artificial.</p>
          <button className="btn open-modal-btn" data-modal="modal1">Ver Certificado</button>
        </div>
      </div>

      {/* Modales */}
      <div id="modal1" className="cert-modal">
        <div className="cert-modal-overlay"></div>
        <div className="cert-modal-content">
          <button className="cert-modal-close" aria-label="Cerrar">&times;</button>
          <div className="cert-modal-body">
            <canvas id="pdf-canvas-modal-1"></canvas>
          </div>
        </div>
      </div>

      <div id="modal2" className="cert-modal">
        <div className="cert-modal-overlay"></div>
        <div className="cert-modal-content">
          <button className="cert-modal-close" aria-label="Cerrar">&times;</button>
          <div className="cert-modal-body">
            <canvas id="pdf-canvas-modal-2"></canvas>
          </div>
        </div>
      </div>

      <div id="modal3" className="cert-modal">
        <div className="cert-modal-overlay"></div>
        <div className="cert-modal-content">
          <button className="cert-modal-close" aria-label="Cerrar">&times;</button>
          <div className="cert-modal-body">
            <canvas id="pdf-canvas-modal-3"></canvas>
          </div>
        </div>
      </div>

      {/* PDF.js */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    </section>
  );
}
