(function(){
  const onReady = (fn) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function initMobileMenu(){
    const btn = qs('#mobileMenuBtn');
    const sidebar = qs('.sidebar');
    if(!btn || !sidebar) return;
    btn.addEventListener('click', ()=>{
      sidebar.classList.toggle('mobile-open');
    });
    // Close when clicking a nav link (mobile UX)
    qsa('.nav-menu a, .nav-menu button').forEach(el=>{
      el.addEventListener('click', ()=>{
        sidebar.classList.remove('mobile-open');
      });
    });
  }

  function initImageModal(){
    const img = qs('.profile img');
    const modal = qs('#imgModal');
    if(!img || !modal) return;
    const modalImg = qs('.img-modal__image', modal);
    const closeBtn = qs('.img-modal__close', modal);

    const open = () => {
      modal.classList.add('is-open');
      modalImg.src = img.getAttribute('src') || '';
      modal.setAttribute('aria-hidden', 'false');
    };
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    img.style.cursor = 'zoom-in';
    img.addEventListener('click', open);
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) close();
    });
    closeBtn && closeBtn.addEventListener('click', close);
  }

  function initStyleDropdown(){
    const toggleBtn = qs('#styleToggleBtn');
    const menu = qs('#styleDropdown');
    if(!toggleBtn || !menu) return;

    function toggle(){
      menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
    toggleBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      toggle();
    });
    document.addEventListener('click', ()=>{
      if(menu.style.display === 'block') menu.style.display = 'none';
    });
  }

  // ==========================
  // Toggle de tema (Día/Noche) - New logic from user
  // ==========================
  function initThemeToggle(){
    const THEME_KEY = 'classic-theme'; // Using classic-theme as per existing localStorage usage
    const body = document.body;
    const btn = document.getElementById('themeToggle');

    // Función para aplicar el tema y actualizar el botón
    function applyTheme(theme) {
      if (theme === 'light') {
        body.setAttribute('data-theme', 'light');
      } else {
        body.removeAttribute('data-theme');
      }
      if (btn) {
        const icon = btn.querySelector('i');
        const text = btn.querySelector('.text');
        if (body.getAttribute('data-theme') === 'light') {
          if (icon) icon.className = 'fas fa-moon icon';
          if (text) text.textContent = 'Modo Noche';
        } else {
          if (icon) icon.className = 'fas fa-sun icon';
          if (text) text.textContent = 'Modo Día';
        }
      }
    }

    // Cargar el tema guardado al iniciar la página
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved || 'dark');

    if (btn) {
      btn.addEventListener('click', (e) => {
        const isLight = body.getAttribute('data-theme') === 'light';
        const next = isLight ? 'dark' : 'light';

        // Coordenadas del botón para iniciar la animación desde ahí
        const rect = btn.getBoundingClientRect();
        const cx = Math.round(rect.left + rect.width / 2);
        const cy = Math.round(rect.top + rect.height / 2);

        // Calcular el radio máximo necesario para cubrir toda la pantalla
        const vw = Math.max(window.innerWidth, document.documentElement.clientWidth);
        const vh = Math.max(window.innerHeight, document.documentElement.clientHeight);
        const farthestX = Math.max(cx, vw - cx);
        const farthestY = Math.max(cy, vh - cy);
        const maxRadius = Math.ceil(Math.hypot(farthestX, farthestY));

        // 1. Cambiar inmediatamente el tema para que los elementos ya estén listos debajo del overlay
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);

        // 2. Crear el div.theme-reveal y lo añade a la página
        const reveal = document.createElement('div');
        reveal.className = 'theme-reveal';
        // El overlay se pinta del color "antiguo" para ocultar el nuevo tema
        reveal.style.setProperty('--overlay-bg', next === 'light' ? '#000000' : '#ffffff');
        reveal.style.setProperty('--cx', cx + 'px');
        reveal.style.setProperty('--cy', cy + 'px');
        document.body.appendChild(reveal);

        const DURATION = 700; // Duración de la animación en milisegundos
        const start = performance.now();

        // 3. Función de animación que se ejecuta en cada frame
        function step(now) {
          const elapsed = now - start;
          const t = Math.min(1, elapsed / DURATION);
          // Función de easing para que la animación sea más suave
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const currentR = Math.floor(eased * maxRadius);
          
          // Actualiza el radio del círculo transparente en el CSS
          reveal.style.setProperty('--r', currentR + 'px');
          
          if (t < 1) {
            requestAnimationFrame(step); // Continuar la animación
          } else {
            reveal.remove(); // Limpiar el overlay al terminar
          }
        }

        // Iniciar la animación
        requestAnimationFrame(step);
      });
    }
  }

  function initContactForm(){
    const form = qs('#contactForm');
    if(!form) return;
    const nameInput = qs('#username');
    const emailInput = qs('#email');
    const msgInput = qs('#message');
    const charCount = qs('#char-count');
    const submitBtn = qs('#submitBtn');
    const spinner = submitBtn ? qs('.spinner', submitBtn) : null;
    const responseBox = qs('#responseMessage');

    const setCounter = () => { if(charCount && msgInput) charCount.textContent = String(msgInput.value.length); };
    msgInput && msgInput.addEventListener('input', setCounter);
    setCounter();

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if(!nameInput || !emailInput || !msgInput || !submitBtn || !responseBox) return;

      responseBox.style.display = 'none';
      responseBox.className = 'response-message';

      submitBtn.disabled = true;
      if(spinner) spinner.style.display = 'block';

      try{
        const payload = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: msgInput.value.trim(),
        };
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(()=>({ message: 'OK' }));
        if(!res.ok){ throw new Error(data?.message || 'Error al enviar'); }
        responseBox.textContent = data?.message || 'Mensaje enviado correctamente. ¡Gracias!';
        responseBox.classList.add('success');
        responseBox.style.display = 'block';
        form.reset();
        setCounter();
      }catch(err){
        responseBox.textContent = (err && err.message) ? err.message : 'No se pudo enviar el mensaje.';
        responseBox.classList.add('error');
        responseBox.style.display = 'block';
      }finally{
        submitBtn.disabled = false;
        if(spinner) spinner.style.display = 'none';
      }
    });
  }

  // Optional: PDF.js lazy loader. To enable, add data-pdf-src to a canvas or container.
  function initPdfPreviews(){
    const previewCanvas = qs('#pdf-canvas-preview');
    const modals = qsa('.cert-modal');
    const openBtns = qsa('.open-modal-btn');

    // Modal open/close handling (image/pdf containers)
    modals.forEach(modal => {
      const overlay = qs('.cert-modal-overlay', modal);
      const closeBtn = qs('.cert-modal-close', modal);
      const close = ()=> modal.classList.remove('is-open');
      overlay && overlay.addEventListener('click', close);
      closeBtn && closeBtn.addEventListener('click', close);
    });

    openBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-modal');
        if(!id) return;
        const modal = qs('#'+id);
        if(modal) modal.classList.add('is-open');
      });
    });

    const anyPdf = previewCanvas && (previewCanvas.dataset.pdfSrc || previewCanvas.getAttribute('data-pdf-src'));
    if(!anyPdf){
      // No data-pdf-src provided; skip pdf.js to avoid errors
      return;
    }

    function loadPdfJs(){
      return new Promise((resolve, reject)=>{
        if(window.pdfjsLib) return resolve(window.pdfjsLib);
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload = ()=> resolve(window.pdfjsLib);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    function renderPdfToCanvas(url, canvas){
      return loadPdfJs().then((pdfjsLib)=>{
        if(!pdfjsLib || !canvas) return;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        return pdfjsLib.getDocument(url).promise.then((pdf)=> pdf.getPage(1)).then((page)=>{
          const viewport = page.getViewport({ scale: 1.3 });
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width; canvas.height = viewport.height;
          const renderContext = { canvasContext: ctx, viewport };
          return page.render(renderContext).promise;
        });
      }).catch((e)=>{ console.warn('No se pudo renderizar PDF:', e); });
    }

    // Preview canvas
    if(previewCanvas){
      const url = previewCanvas.dataset.pdfSrc;
      if(url) renderPdfToCanvas(url, previewCanvas);
    }

    // Modal canvases (use data-pdf-src on each canvas if needed)
    qsa('.cert-modal canvas').forEach((c)=>{
      const url = c.dataset.pdfSrc;
      if(url) renderPdfToCanvas(url, c);
    });
  }

  onReady(()=>{
    initMobileMenu();
    initImageModal();
    initStyleDropdown();
    initThemeToggle(); // This will now use the new logic
    initContactForm();
    initPdfPreviews();
    // Initialize flip-card backs with semi-circular progress bars
    (function initSkillProgress(){
      const cards = qsa('.flip-card');
      cards.forEach(card=>{
        const percent = Number(card.getAttribute('data-percent') || '0');
        const color = card.getAttribute('data-color') || getComputedStyle(document.body).getPropertyValue('--primary') || '#ff0095';
        const label = card.getAttribute('data-label') || '';
        const back = qs('.flip-card-back', card);
        if(!back) return;
        
        // The length of a semi-circle with radius 80 is π * 80 ≈ 251.3. We'll use 252.
        const semiCircleLength = 252;

        back.innerHTML = `
          <div class="skill-progress" aria-label="${label}">
            <svg viewBox="0 0 180 100" preserveAspectRatio="xMidYMid meet">
              <path class="bg" d="M10,90 A80,80 0 0 1 170,90" />
              <path class="progress" d="M10,90 A80,80 0 0 1 170,90" stroke="${color}" style="stroke-dasharray: ${semiCircleLength}; stroke-dashoffset: ${semiCircleLength};" />
            </svg>
            <div class="info">
              <div class="percent">${percent}%</div>
              <div class="label">${label}</div>
            </div>
          </div>`;
          
        const progressEl = qs('.progress', back);
        
        // Calculate the offset based on the percentage for the semi-circle
        const offset = semiCircleLength - (semiCircleLength * Math.max(0, Math.min(100, percent)) / 100);

        // Animate the progress bar when the card is hovered/flipped
        card.addEventListener('mouseenter', ()=>{
          if(progressEl) progressEl.style.strokeDashoffset = String(offset);
        });
        card.addEventListener('mouseleave', ()=>{
          if(progressEl) progressEl.style.strokeDashoffset = String(semiCircleLength);
        });
      });
    })();
  });
})();