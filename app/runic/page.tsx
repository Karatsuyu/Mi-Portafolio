"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Head from 'next/head';
import './css/style.css';
import './styles/animations.css';
import { useDynamicEffects } from './hooks/useDynamicEffects';


// --- SUB-COMPONENTES Y HOOKS DE LÓGICA (DEFINIDOS ANTES DE USAR) ---

const RunicContactForm = () => {
    const [formData, setFormData] = useState({ username: '', email: '', message: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};
        if (formData.username.trim().length < 2) newErrors.username = 'El nombre debe tener al menos 2 caracteres';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = 'Por favor ingresa un email válido';
        if (formData.message.trim().length < 10) newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
        if (formData.message.length > 2000) newErrors.message = 'El mensaje no puede exceder 2000 caracteres';
        return newErrors;
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        setStatus('loading');
        try {
            const response = await fetch('https://mi-hoja-de-vida.onrender.com/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(formData)
            });

            if(response.ok) {
                const result = await response.json();
                setStatus('success');
                setResponseMessage(result.message || '¡Mensaje enviado con éxito! Te responderé pronto.');
                setFormData({ username: '', email: '', message: '' });
            } else {
                const result = await response.json();
                setStatus('error');
                setResponseMessage(result.detail || 'Error al enviar el mensaje. Inténtalo de nuevo.');
            }
        } catch (error) {
            setStatus('error');
            setResponseMessage('Error de conexión al enviar el mensaje.');
        }
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <div className="runic-contact-form">
            <h2 className="form-header">Envíame un mensaje</h2>
            <form id="contactForm" className="contact-form-futuristic" onSubmit={handleSubmit} noValidate>
                 <div className="form-group">
                    <label htmlFor="username" className="form-label">Nombre completo *</label>
                    <input type="text" id="username" name="username" className="form-input" placeholder="Tu nombre completo" required minLength={2} value={formData.username} onChange={handleInputChange} />
                    {errors.username && <span className="error-message show">{errors.username}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Correo electrónico *</label>
                    <input type="email" id="email" name="email" className="form-input" placeholder="tu@email.com" required value={formData.email} onChange={handleInputChange} />
                    {errors.email && <span className="error-message show">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Mensaje *</label>
                    <textarea id="message" name="message" className="form-input form-textarea" placeholder="Escribe tu mensaje aquí..." required minLength={10} maxLength={2000} value={formData.message} onChange={handleInputChange}></textarea>
                    <div className="char-counter">{formData.message.length}/2000 caracteres</div>
                    {errors.message && <span className="error-message show">{errors.message}</span>}
                  </div>
                  <button type="submit" className="submit-btn-runic" id="submitBtn" disabled={status === 'loading'}>
                    {status !== 'loading' ? (
                        <><svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4L12 12L4 4M12 12L20 20M12 12L4 20"/></svg><span className="btn-text">ENVIAR MENSAJE</span></>
                    ) : (<div className="spinner" style={{display: 'block'}}><i className="fas fa-spinner fa-spin"></i></div>)}
                  </button>
            </form>
            { (status === 'success' || status === 'error') && <div id="responseMessage" className={`response-message ${status}`} style={{ display: 'block' }}>{responseMessage}</div>}
        </div>
    );
};

interface Project {
    video: string;
    title: string;
    desc: string;
    tech: string;
    role: string;
    challenge: string;
    link: string;
}

const Carousel3D = ({ projects }: { projects: Project[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const innerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    
    const dragState = useRef({ isDragging: false, startX: 0, currentTranslate: 0 });
    const totalCards = projects.length;
    const angle = 45;

    const updateCarousel = useCallback((newIndex: number) => {
        const resolvedIndex = ((newIndex % totalCards) + totalCards) % totalCards;
        if (innerRef.current) {
            const rotation = resolvedIndex * -angle;
            innerRef.current.style.transform = `rotateY(${rotation}deg)`;
        }
        if (cardsRef.current.length) {
            cardsRef.current.forEach((card, idx) => {
                card?.classList.toggle('active', idx === resolvedIndex);
                if (idx !== resolvedIndex) card?.classList.remove('flipped');
            });
        }
        setCurrentIndex(resolvedIndex);
    }, [totalCards, angle]);

    useEffect(() => {
        updateCarousel(0);
    }, [updateCarousel]);

    useEffect(() => {
        const getPositionX = (e: MouseEvent | TouchEvent) => 'clientX' in e ? e.clientX : e.touches[0].clientX;
        const handleDragStart = (e: MouseEvent | TouchEvent) => {
            dragState.current.isDragging = true;
            dragState.current.startX = getPositionX(e);
            dragState.current.currentTranslate = 0;
            if (innerRef.current) {
                innerRef.current.classList.add('grabbing');
                innerRef.current.style.transition = 'none';
            }
        };

        const handleDragMove = (e: MouseEvent | TouchEvent) => {
            if (!dragState.current.isDragging || !innerRef.current) return;
            const currentTranslate = getPositionX(e) - dragState.current.startX;
            dragState.current.currentTranslate = currentTranslate;
            const dragAmount = currentTranslate / 50;
            const baseRotation = currentIndex * -angle;
            const dragRotation = dragAmount * angle;
            innerRef.current.style.transform = `rotateY(${baseRotation + dragRotation}deg)`;
        };

        const handleDragEnd = () => {
            if (!dragState.current.isDragging) return;
            dragState.current.isDragging = false;
            if (innerRef.current) {
                innerRef.current.classList.remove('grabbing');
                innerRef.current.style.transition = 'transform 0.6s ease-out';
            }
            const dragDelta = dragState.current.currentTranslate / 50;
            if (Math.abs(dragDelta) > 0.3) {
                updateCarousel(currentIndex + (dragDelta > 0 ? -1 : 1));
            } else {
                updateCarousel(currentIndex);
            }
            dragState.current.currentTranslate = 0;
        };

        const el = innerRef.current;
        if (el) {
            el.addEventListener('mousedown', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            el.addEventListener('mouseleave', handleDragEnd);
            el.addEventListener('touchstart', handleDragStart, { passive: true });
            document.addEventListener('touchmove', handleDragMove, { passive: true });
            document.addEventListener('touchend', handleDragEnd);
            return () => {
                el.removeEventListener('mousedown', handleDragStart);
                document.removeEventListener('mousemove', handleDragMove);
                document.removeEventListener('mouseup', handleDragEnd);
                el.removeEventListener('mouseleave', handleDragEnd);
                el.removeEventListener('touchstart', handleDragStart);
                document.removeEventListener('touchmove', handleDragMove);
                document.removeEventListener('touchend', handleDragEnd);
            };
        }
    }, [currentIndex, updateCarousel, angle]);

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (Math.abs(dragState.current.currentTranslate) < 5) {
            cardsRef.current[index]?.classList.toggle('flipped');
        }
        e.stopPropagation();
    };

    return (
        <div className="carousel-3d-container">
            <div className="carousel-3d-inner" ref={innerRef}>
                {projects.map((p, i) => (
                    <div className="carousel-3d-card" key={i} style={{ '--index': i } as React.CSSProperties} ref={(el) => (cardsRef.current[i] = el)}>
                        <div className="card-content" onClick={(e) => handleCardClick(e, i)}>
                            <div className="card-glow"></div>
                            <div className="card-inner">
                                <div className="card-front">
                                    <video className="card-thumb" autoPlay muted loop playsInline src={p.video} key={p.video}></video>
                                    <h3>{p.title}</h3><p>{p.desc}</p>
                                </div>
                                <div className="card-back">
                                    <h3>Tecnologías</h3><p>{p.tech}</p>
                                    <p><strong>Mi rol:</strong> {p.role}</p>
                                    <p><strong>Reto:</strong> {p.challenge}</p>
                                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="card-link" onClick={e => e.stopPropagation()}>Ver en GitHub →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---

const RunicPage = () => {
    const [activeColor, setActiveColor] = useState('magenta');
    const [isColorDropdownActive, setColorDropdownActive] = useState(false);
    const [isStyleDropdownActive, setStyleDropdownActive] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCertModalOpen, setCertModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');

    const colorSelectorRef = useRef<HTMLLIElement>(null);
    const styleSelectorRef = useRef<HTMLLIElement>(null);

    useDynamicEffects();

    useEffect(() => {
        const colorHues = {
            magenta: 280, yellow: 60, blue: 240, red: 0, orange: 30, green: 120, cyan: 180, pink: 300, purple: 270,
        };
        type ColorKey = keyof typeof colorHues;
        const hue = colorHues[activeColor as ColorKey];
        if (hue === undefined) return;

        document.documentElement.style.setProperty('--accent-hue', hue.toString());
        document.documentElement.style.setProperty('--accent', `hsl(${hue}, 100%, 50%)`);
        document.documentElement.style.setProperty('--accent-glow', `hsla(${hue}, 100%, 50%, 0.95)`);
        document.documentElement.style.setProperty('--accent-light', `hsla(${hue}, 100%, 80%, 0.25)`);
        document.documentElement.style.setProperty('--accent-dark', `hsla(${hue}, 100%, 30%, 0.7)`);
        document.documentElement.style.setProperty('--accent-muted', `hsla(${hue}, 100%, 60%, 0.5)`);
        
        localStorage.setItem('selectedColor', activeColor);
    }, [activeColor]);

    useEffect(() => {
        const savedColor = localStorage.getItem('selectedColor');
        if (savedColor) setActiveColor(savedColor);

        const handleClickOutside = (event: MouseEvent) => {
            if (colorSelectorRef.current && !colorSelectorRef.current.contains(event.target as Node)) setColorDropdownActive(false);
            if (styleSelectorRef.current && !styleSelectorRef.current.contains(event.target as Node)) setStyleDropdownActive(false);
        };
        document.addEventListener('click', handleClickOutside);

        const sections = Array.from(document.querySelectorAll<HTMLElement>('#home, main .section')).filter(s => s?.id);
        const onScroll = () => {
            const viewportRef = window.scrollY + window.innerHeight * 0.4;
            let bestMatch = { id: 'home', distance: Infinity };
            for(const s of sections) {
                const rect = s.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const bottom = rect.bottom + window.scrollY;
                if (viewportRef >= top && viewportRef <= bottom) { bestMatch = { id: s.id, distance: 0 }; break; }
                const dist = Math.abs((top + bottom) / 2 - viewportRef);
                if (dist < bestMatch.distance) bestMatch = { id: s.id, distance: dist };
            };
            setActiveSection(bestMatch.id);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            setMobileMenuOpen(false);
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
        }
    };
    
    const navItems = ['Home', 'Formación', 'Proyectos', 'Habilidades', 'Certificados', 'Contactos'];
    const contactSpheres = [
      { icon: 'fas fa-envelope', title: 'Email', href: 'mailto:julian.estiven.gutierrez@correounivalle.edu.co', rune: 'ᚠ' },
      { icon: 'fas fa-phone', title: 'Teléfono', href: 'tel:+573234378971', rune: 'ᚢ' },
      { icon: 'fas fa-map-marker-alt', title: 'Ubicación', href: 'https://www.google.com/maps/place/El+Vergel,+G%C3%A9nova,+Quind%C3%ADo/@4.1953196,-75.8069597,14z', rune: 'ᚦ' },
      { icon: 'fab fa-github', title: 'GitHub', href: 'https://github.com/Karatsuyu', rune: 'ᚨ' },
      { icon: 'fab fa-linkedin', title: 'LinkedIn', href: 'https://www.linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382/', rune: 'ᚱ' },
      { icon: 'fab fa-whatsapp', title: 'WhatsApp', href: 'https://wa.me/573234378971', rune: 'ᚲ' },
      { icon: 'fab fa-instagram', title: 'Instagram', href: 'https://www.instagram.com/tabjulian07/', rune: 'ᚷ' },
      { icon: 'fab fa-x-twitter', title: 'X', href: 'https://x.com/JulinTabar7259', rune: 'ᚹ' },
    ];
    const projects = [
        { video: "/videos/2025-10-13 17-20-25.mp4", title: "Tienda Online (E-commerce Full-Stack)", desc: "Plataforma web para explorar productos, ver detalles y realizar compras.", tech: "Next.js 15, React 19, Tailwind CSS 3.4, FastAPI, SQLAlchemy 2, Docker Compose", role: "End-to-end", challenge: "Flujo completo de compra", link: "https://github.com/Karatsuyu/Tienda-Online.git" },
        { video: "/videos/2025-12-03 12-26-20.mp4", title: "Delicious Food - Delivery de Comida", desc: "Plataforma de pedidos de comida con combos personalizados, pagos Stripe y comunidad social.", tech: "Django 5.2.6, DRF, SQLite, JWT, Stripe, React 19, Vite", role: "Full-Stack", challenge: "Personalización, pagos seguros", link: "https://github.com/Karatsuyu/delicious-food-app.git" },
        { video: "/videos/2025-10-23 17-08-31.mp4", title: "ParkingPro SaaS - Gestión de Parqueaderos", desc: "Plataforma SaaS con control en tiempo real, facturación automática y dashboard analytics.", tech: "Node.js 18, Express, PostgreSQL 15, Redis 7, Socket.IO, React 18", role: "Full-stack architect", challenge: "Sistema en tiempo real con WebSockets", link: "https://github.com/Karatsuyu/parking-app.git" },
        { video: "/videos/2025-10-21 09-59-56.mp4", title: "Sistema de Gestión Registral", desc: "Sistema web para gestionar personas, documentos y generar reportes estadísticos.", tech: "Node.js, Express, PostgreSQL, React (Vite), MVC", role: "Desarrollador full-stack único", challenge: "Gestionar datos con integridad", link: "https://github.com/Karatsuyu/Registradur-a-De-Colombia.git" },
        { video: "/videos/2025-12-03 15-27-11.mp4", title: "MiSalud - Health Risk Prediction App", desc: "Plataforma para registrar hábitos, contenido educativo y predicciones de salud.", tech: "Django 4, DRF, SimpleJWT, React, Vite, Tailwind CSS", role: "Full-stack", challenge: "Dashboard, predicciones ML", link: "https://github.com/Karatsuyu/Mi-Salud.git" },
        { video: "/videos/2025-10-23 18-00-50.mp4", title: "Portfolio Profesional Web Full-Stack", desc: "Sitio web responsive con sidebar, 8 proyectos, animaciones y modo oscuro/claro.", tech: "HTML5, CSS3, JavaScript Vanilla, Responsive Design", role: "Diseño HTML, componentes CSS", challenge: "Maquetación responsiva, tema día/noche", link: "https://github.com/Karatsuyu/Mi-Hoja-De-Vida.git" },
        { video: "/videos/1014 (1)(1).mp4", title: "App Cliente-Servidor de Lavadero", desc: "App para gestionar clientes y servicios: Backend REST + Frontend Tkinter.", tech: "Django 5.x, DRF, Python Tkinter (GUI), SQLite", role: "Diseñador frontend Tkinter", challenge: "CRUD completo vía API", link: "https://github.com/Karatsuyu/Lavelo-Pues.git" },
        { video: "/videos/1014 (1).mp4", title: "Sistema de Gestión Bancaria", desc: "Sistema desktop para gestionar clientes, cuentas y transacciones.", tech: "Python 3.x, Tkinter (GUI), Archivos .txt, POO", role: "Desarrollador full-stack único", challenge: "Persistencia custom, multi-ventana", link: "https://github.com/Karatsuyu/Banco.git" }
    ];

    const openModal = (src: string) => {
        setModalImageSrc(src);
        setCertModalOpen(true);
    };

    return (
        <>
            <Head><title>Hoja de vida — Julián Gutiérrez</title><meta name="viewport" content="width=device-width,initial-scale=1" /></Head>
            <div data-theme="dark">
                <header className="top hero">
                    <nav className="top-nav">
                      <button className="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menú" onClick={() => setMobileMenuOpen(true)}><i className="fa-solid fa-bars"></i></button>
                      <div className="container nav-inner">
                        <ul className="nav-links">
                          {navItems.map(item => {
                              const hrefId = (item === 'Formación' ? 'educacion' : item.toLowerCase().replace('ó', 'o'));
                              return <li key={item}><a href={`#${hrefId}`} onClick={(e) => handleNavClick(e, `#${hrefId}`)} className={`nav-link ${activeSection === hrefId ? 'active' : ''}`}>{item}</a></li>
                          })}
                          <li className="color-selector-wrapper" ref={colorSelectorRef}>
                            <button className="color-selector-btn" onClick={() => setColorDropdownActive(p => !p)}>Colores</button>
                            <div className={`color-dropdown ${isColorDropdownActive ? 'active' : ''}`}>
                                {Object.keys( { magenta: '', purple: '', red: '', orange: '', yellow: '', green: '', cyan: '', blue: '', pink: '' }).map(c => 
                                    <button key={c} className="color-option" data-color={c} onClick={() => { setActiveColor(c); setColorDropdownActive(false); }}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </button>
                                )}
                            </div>
                          </li>
                          <li className="style-selector-wrapper" ref={styleSelectorRef}>
                            <button className="style-selector-btn" onClick={() => setStyleDropdownActive(p => !p)}>Estilo</button>
                            <div className={`style-dropdown ${isStyleDropdownActive ? 'active' : ''}`}>
                                <a href="../" className="style-option">Space</a>
                                <a href="../classic" className="style-option">Classic</a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </nav>
                    <div className="menu-nebula" aria-hidden="true"></div>
                    <div className="hero-inner container" id="home">
                      <div className="home-nebula" aria-hidden="true"></div>
                      <div className="hero-left">
                        <div className="radar-container">
                          <div className="radar-glow"></div>
                          <svg className="radar-svg" viewBox="0 0 500 500"><circle cx="250" cy="250" r="220" className="circle-outer" /><g className="ticks"></g><line x1="250" y1="40" x2="250" y2="460" className="radial" /><line x1="40" y1="250" x2="460" y2="250" className="radial" /><line x1="110" y1="110" x2="390" y2="390" className="radial" /><line x1="110" y1="390" x2="390" y2="110" className="radial" /></svg>
                          <div className="center-circle"><img src="/runic/assets/1756766660817.png" alt="Center Image" className="center-image" /></div>
                          <div className="outer-rune-circle"><div className="runes">{'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊ'.split('').map((rune, i) => <span key={i} style={{'--i': i} as React.CSSProperties}>{rune}</span>)}</div></div>
                          <div className="outer-rune-border"></div>
                        </div>
                      </div>
                      <div className="hero-right">
                        <h1 className="hero-title">Hola, soy <span className="accent">Julián Gutierrez</span></h1>
                        <h2 className="hero-sub">Soy <span className="accent">Tecnologo en desarrollado de Software</span></h2>
                        <p className="hero-text">Soy un Tecnólogo en Desarrollo de Software formado en la Universidad del Valle, apasionado por la tecnología, la innovación y la creación de soluciones digitales que generen impacto...</p>
                        <p className="hero-text">Durante mi formación, he adquirido conocimientos sólidos en programación estructurada y orientada a objetos, diseño de bases de datos, desarrollo web (frontend y backend)...</p>
                      </div>
                    </div>
                </header>

                <main className="container main-grid">
                    <section id="educacion" className="section">
                        <h2>Formación</h2>
                        <div className="training-grid">
                            <div className="training-card"><h3>Programación Orientada a Objetos</h3><p>Java, Python</p></div>
                            <div className="training-card"><h3>Programación Orientada a Eventos</h3><p>Python</p></div>
                            <div className="training-card"><h3>Desarrollo Web</h3><p>HTML, CSS, JavaScript, frameworks</p></div>
                            <div className="training-card"><h3>Desarrollo de Aplicaciones Móviles</h3><p>React Native</p></div>
                            <div className="training-card"><h3>Estructuras de Datos y Algoritmos</h3><p>Fundamentos y optimización</p></div>
                            <div className="training-card"><h3>Bases de Datos</h3><p>SQL, diseño relacional</p></div>
                            <div className="training-card"><h3>Ingeniería de Software</h3><p>Ciclo de vida, pruebas, documentación</p></div>
                            <div className="training-card"><h3>Sistemas Operativos y Redes</h3><p>Conceptos de SO y redes</p></div>
                            <div className="training-card"><h3>Diseño de Interfaces Humano-Computador</h3><p>Principios de diseño centrado en usuario</p></div>
                        </div>
                    </section>

                    <section id="proyectos" className="section">
                        <h2>Proyectos</h2>
                        <p>Proyectos destacados — arrastra para desplazarte y haz clic en una tarjeta para ver detalles.</p>
                        <Carousel3D projects={projects} />
                    </section>

                    <section id="habilidades" className="section runes-section">
                        <div className="runes-background-pattern"></div>
                        <div className="floating-runes" id="floatingRunesSection"></div>
                        <div className="runes-container">
                            <div className="runes-header"><h1>Habilidades</h1></div>
                            <div className="skills-container">
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-html5"></i></div><h3>HTML5</h3><div className="skill-level"><div className="skill-progress" style={{width:"50%"}}></div></div><p className="skill-description">Lenguaje de marcado que estructura la web moderna.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-css3-alt"></i></div><h3>CSS3</h3><div className="skill-level"><div className="skill-progress" style={{width:"50%"}}></div></div><p className="skill-description">Estilos y animaciones que dan vida a interfaces.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-js"></i></div><h3>JavaScript</h3><div className="skill-level"><div className="skill-progress" style={{width:"23%"}}></div></div><p className="skill-description">Interactividad y lógica para experiencias dinámicas.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-react"></i></div><h3>React</h3><div className="skill-level"><div className="skill-progress" style={{width:"19%"}}></div></div><p className="skill-description">Componentes modernos para interfaces reactivas.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fas fa-paint-brush"></i></div><h3>UX/UI</h3><div className="skill-level"><div className="skill-progress" style={{width:"70%"}}></div></div><p className="skill-description">Diseño enfocado en la experiencia del usuario.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fas fa-database"></i></div><h3>SQL</h3><div className="skill-level"><div className="skill-progress" style={{width:"50%"}}></div></div><p className="skill-description">Gestión de bases de datos relacionales.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-python"></i></div><h3>Python</h3><div className="skill-level"><div className="skill-progress" style={{width:"78%"}}></div></div><p className="skill-description">Lenguaje versátil para múltiples aplicaciones.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-java"></i></div><h3>Java</h3><div className="skill-level"><div className="skill-progress" style={{width:"65%"}}></div></div><p className="skill-description">Programación orientada a objetos robusta.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-github"></i></div><h3>GitHub</h3><div className="skill-level"><div className="skill-progress" style={{width:"40%"}}></div></div><p className="skill-description">Control de versiones y colaboración.</p></div>
                                <div className="rune-skill"><div className="rune-symbol"><i className="fab fa-docker"></i></div><h3>Docker</h3><div className="skill-level"><div className="skill-progress" style={{width:"10%"}}></div></div><p className="skill-description">Containerización de aplicaciones.</p></div>
                            </div>
                        </div>
                    </section>

                    <section id="certificados" className="section certificates-section">
                        <div className="circuit-background" aria-hidden="true"><div className="circuit-container"></div></div>
                        <div className="certificates-content">
                            <h2>Certificados</h2>
                            <p>Certificaciones y cursos completados.</p>
                            <div className="certificates-grid">
                                <div className="certificate-card" data-certificate="cert1" onClick={() => openModal('/path/to/cert1.png')}>
                                    <div className="cert-inner"><div className="cert-front">
                                        <div className="cert-icon">📜</div>
                                        <h3>Certificado 1</h3>
                                        <p className="cert-issuer">Plataforma educativa</p>
                                        <p className="cert-year">2025</p>
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="contacto" className="section contact-section">
                        <h2>Contactos</h2>
                        <div className="hanging-spheres-container">
                            <div className="background-stars-contact" aria-hidden="true"></div>
                            <div className="hanging-spheres">
                                {contactSpheres.map(s => (
                                    <div className="sphere-container" key={s.title}>
                                        <div className="string-wrapper"><span className="rune-start">{s.rune}</span><div className="string"></div></div>
                                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="sphere" title={s.title}><i className={s.icon}></i></a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <RunicContactForm />
                    </section>
                </main>

                <footer className="footer">
                    <p className="footer-copyright">© {new Date().getFullYear()} Todos los derechos reservados</p>
                </footer>

                {isCertModalOpen && (
                    <div className="certificate-modal active" id="certificateModal" onClick={() => setCertModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setCertModalOpen(false)}>&times;</button>
                            <img id="modalImage" src={modalImageSrc} alt="Certificado" />
                        </div>
                    </div>
                )}
                 <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                    <button className="mobile-menu-close" id="mobileMenuClose" aria-label="Cerrar menú" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                    {navItems.map(item => {
                         const hrefId = (item === 'Formación' ? 'educacion' : item.toLowerCase().replace('ó', 'o'));
                         return <a key={item} href={`#${hrefId}`} onClick={(e) => handleNavClick(e, `#${hrefId}`)}>{item}</a>
                    })}
                </div>
            </div>
        </>
    );
};

export default RunicPage;