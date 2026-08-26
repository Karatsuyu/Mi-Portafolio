
import { useEffect, useCallback } from 'react';

export const useDynamicEffects = () => {

    const floatingRunes = useCallback(() => {
        const floatingRunesSection = document.getElementById('floatingRunesSection');
        if (!floatingRunesSection) return;

        // Clear previous runes
        floatingRunesSection.innerHTML = '';

        const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];
        const count = 26;
        for (let i = 0; i < count; i++) {
            const rune = document.createElement('div');
            rune.className = 'floating-rune';
            rune.textContent = runes[Math.floor(Math.random() * runes.length)];

            const tx = (Math.random() * 160 - 80).toFixed(2) + 'vw';
            const ty = (Math.random() * 120 - 60).toFixed(2) + 'vh';
            rune.style.setProperty('--tx', tx);
            rune.style.setProperty('--ty', ty);

            rune.style.left = `${Math.random() * 100}%`;
            rune.style.top = `${Math.random() * 100}%`;

            const delay = (Math.random() * 12).toFixed(2) + 's';
            const dur = (Math.random() * 22 + 12).toFixed(2) + 's';
            rune.style.animationDelay = delay;
            rune.style.setProperty('--dur', dur);
            rune.style.animationDuration = dur;

            const size = (Math.random() * 2 + 1.2).toFixed(2) + 'rem';
            rune.style.fontSize = size;
            rune.style.opacity = '0';

            floatingRunesSection.appendChild(rune);
        }
    }, []);

    const nebulaStars = useCallback(() => {
        const homeNebula = document.querySelector('.home-nebula');
        if (!homeNebula) {
            console.warn('home-nebula not found');
            return;
        }

        // Limpiar canvas previo si existe
        const existingCanvas = homeNebula.querySelector('canvas');
        if (existingCanvas) existingCanvas.remove();

        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'rune-canvas';
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Canvas context not available');
            return;
        }

        homeNebula.appendChild(canvas);
        console.log('Canvas created and appended');

        // Runas completas
        const runes = ['ᚠ', 'ᚡ', 'ᚢ', 'ᚣ', 'ᚤ', 'ᚥ', 'ᚦ', 'ᚧ', 'ᚨ', 'ᚩ', 'ᚪ', 'ᚫ', 'ᚬ', 'ᚭ', 'ᚮ', 'ᚯ', 
                      'ᚰ', 'ᚱ', 'ᚲ', 'ᚳ', 'ᚴ', 'ᚵ', 'ᚶ', 'ᚷ', 'ᚸ', 'ᚹ', 'ᚺ', 'ᚻ', 'ᚼ', 'ᚽ', 'ᚾ', 'ᚿ',
                      'ᛀ', 'ᛁ', 'ᛂ', 'ᛃ', 'ᛄ', 'ᛅ', 'ᛆ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛋ', 'ᛌ', 'ᛍ', 'ᛎ', 'ᛏ',
                      'ᛐ', 'ᛑ', 'ᛒ', 'ᛓ', 'ᛔ', 'ᛕ', 'ᛖ', 'ᛗ', 'ᛘ', 'ᛙ', 'ᛚ', 'ᛛ', 'ᛜ', 'ᛝ', 'ᛞ', 'ᛟ',
                      'ᛠ', 'ᛡ', 'ᛢ', 'ᛣ', 'ᛤ', 'ᛥ', 'ᛦ', 'ᛧ', 'ᛨ', 'ᛩ', 'ᛪ'];

        let W: number, H: number;
        
        // Función para obtener el hue actual directamente del CSS
        const getCurrentHue = (): number => {
            const accentHue = getComputedStyle(document.documentElement).getPropertyValue('--accent-hue').trim();
            const hue = parseInt(accentHue);
            return isNaN(hue) ? 280 : hue;
        };
        
        // Log inicial
        console.log(`[Canvas Runes] Initial hue: ${getCurrentHue()}`);

        const resize = () => {
            const rect = homeNebula.getBoundingClientRect();
            W = canvas.width = rect.width * window.devicePixelRatio;
            H = canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            console.log(`Canvas resized: ${rect.width}x${rect.height}, DPR: ${window.devicePixelRatio}`);
        };

        class Rune {
            layer: number;
            size: number;
            x: number;
            y: number;
            vy: number;
            vx: number;
            rotation: number;
            rotationSpeed: number;
            char: string;
            opacity: number;
            maxOpacity: number;
            life: number;
            maxLife: number;
            pulse: number;
            pulseSpeed: number;

            constructor(layer: number) {
                this.layer = layer; // 0=far, 1=mid, 2=near
                this.pulse = 0;
                this.pulseSpeed = 0;
                this.size = 0;
                this.x = 0;
                this.y = 0;
                this.vy = 0;
                this.vx = 0;
                this.rotation = 0;
                this.rotationSpeed = 0;
                this.char = '';
                this.opacity = 0;
                this.maxOpacity = 0;
                this.life = 0;
                this.maxLife = 0;
                this.reset(true);
            }

            reset(initial = false) {
                const layerScale = [0.5, 0.8, 1.1][this.layer];
                this.size = (20 + Math.random() * 40) * layerScale * window.devicePixelRatio;
                this.x = Math.random() * W;
                this.y = initial ? Math.random() * H : H + this.size;
                this.vy = -(0.15 + Math.random() * 0.4) * layerScale * window.devicePixelRatio;
                this.vx = (Math.random() - 0.5) * 0.2 * window.devicePixelRatio;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.004;
                this.char = runes[Math.floor(Math.random() * runes.length)];
                this.opacity = 0;
                // Opacidad optimizada para visibilidad
                this.maxOpacity = [0.4, 0.6, 0.8][this.layer] * (0.8 + Math.random() * 0.2);
                this.life = 0;
                this.maxLife = 600 + Math.random() * 600;
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.01 + Math.random() * 0.02;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.pulse += this.pulseSpeed;
                this.life++;

                // fade in / out
                const fadeIn = 120;
                const fadeOut = 180;
                if (this.life < fadeIn) {
                    this.opacity = (this.life / fadeIn) * this.maxOpacity;
                } else if (this.life > this.maxLife - fadeOut) {
                    this.opacity = ((this.maxLife - this.life) / fadeOut) * this.maxOpacity;
                } else {
                    this.opacity = this.maxOpacity;
                }

                // Pulso sinusoidal suave
                this.opacity *= 0.7 + 0.3 * Math.sin(this.pulse);

                if (this.life >= this.maxLife || this.y < -this.size * 2) {
                    this.reset();
                }
            }

            draw(context: CanvasRenderingContext2D, currentHue: number) {
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.rotation);
                context.font = `${this.size}px serif`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                
                // Primera pasada con shadow grande - USA EL HUE ACTUAL
                context.shadowColor = `hsla(${currentHue}, 100%, 70%, ${this.opacity})`;
                context.shadowBlur = 40 * window.devicePixelRatio;
                context.fillStyle = `hsla(${currentHue}, 70%, 80%, ${this.opacity})`;
                context.fillText(this.char, 0, 0);

                // Segunda pasada para brillo intenso - USA EL HUE ACTUAL
                context.shadowBlur = 60 * window.devicePixelRatio;
                context.fillStyle = `hsla(${currentHue}, 100%, 90%, ${this.opacity * 0.6})`;
                context.fillText(this.char, 0, 0);
                
                context.restore();
            }
        }

        const runeList: Rune[] = [];
        // OPTIMIZADO: Reducido de [40, 30, 15] a [20, 15, 10] = 45 runas total (47% menos)
        const counts = [20, 15, 10]; // lejos, medio, cerca
        
        for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < counts[layer]; i++) {
                runeList.push(new Rune(layer));
            }
        }
        
        console.log(`Created ${runeList.length} runes`);

        let animationFrameId: number;
        let lastFrameTime = performance.now();
        const targetFPS = 60;
        const frameInterval = 1000 / targetFPS;
        
        const animate = (currentTime: number) => {
            const deltaTime = currentTime - lastFrameTime;
            
            // Throttle a 60 FPS máximo
            if (deltaTime < frameInterval) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }
            
            lastFrameTime = currentTime - (deltaTime % frameInterval);
            
            // Limpiar canvas
            ctx.clearRect(0, 0, W, H);

            // Runas ordenadas por capa (lejos primero) - OPTIMIZADO: sort solo una vez
            if (runeList.length > 0 && runeList[0].life % 100 === 0) {
                runeList.sort((a, b) => a.layer - b.layer);
            }
            
            runeList.forEach(r => {
                r.update();
                r.draw(ctx, getCurrentHue()); // Leer el hue actual del CSS en cada frame
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        animate(performance.now());
        console.log('Animation started');

        // Cleanup
        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            console.log('Canvas cleanup');
        };
    }, []);

    const circuitAnimation = useCallback(() => {
        const circuitContainer = document.querySelector('.circuit-container');
        if (!circuitContainer) return;

        const createCircuit = () => {
            circuitContainer.innerHTML = '';

            for (let i = 0; i < 90; i++) {
                const star = document.createElement('div');
                star.className = 'circuit-star';
                const size = Math.random() * 2.2 + 0.8;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.opacity = `${Math.random() * 0.7 + 0.2}`;
                star.style.animationDelay = `${Math.random() * 4}s`;
                star.style.animationDuration = `${Math.random() * 3 + 2}s`;
                circuitContainer.appendChild(star);
            }
        };

        createCircuit();
        const intervalId = setInterval(createCircuit, 15000);

        return () => clearInterval(intervalId);
    }, []);

    const contactStars = useCallback(() => {
      const backgroundStars = document.querySelector('.background-stars-contact');
      if (!backgroundStars) return;

      backgroundStars.innerHTML = '';
      
      for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'star-contact';
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.5 + 0.3}`;
        backgroundStars.appendChild(star);
      }
    }, []);

    const radarTicks = useCallback(() => {
        try {
            const svg = document.querySelector('.radar-svg');
            const ticksGroup = svg && svg.querySelector('.ticks');
            if (svg && ticksGroup) {
                ticksGroup.innerHTML = ''; // Clear existing ticks
                const ns = 'http://www.w3.org/2000/svg';
                // Reducido de 360/6=60 a 360/12=30 ticks para mejor performance
                for (let i = 0; i < 360; i += 12) {
                    const rad = i * Math.PI / 180;
                    const x1 = 250 + Math.cos(rad) * 220;
                    const y1 = 250 + Math.sin(rad) * 220;
                    const x2 = 250 + Math.cos(rad) * 210;
                    const y2 = 250 + Math.sin(rad) * 210;
                    const line = document.createElementNS(ns, 'line');
                    line.setAttribute('x1', x1.toString());
                    line.setAttribute('y1', y1.toString());
                    line.setAttribute('x2', x2.toString());
                    line.setAttribute('y2', y2.toString());
                    line.setAttribute('class', 'tick');
                    ticksGroup.appendChild(line);
                }
            }
        } catch (e) {
            console.warn('Radar ticks generation failed', e);
        }
    }, []);

    const contactSpheresHoverEffect = useCallback(() => {
        const spheres = document.querySelectorAll('.contact-section .sphere');
        spheres.forEach((sphere) => {
            sphere.addEventListener('mouseenter', () => {
                const randomX = (Math.random() - 0.5) * 4;
                const randomY = (Math.random() - 0.5) * 4;
                (sphere as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px) scale(1.1)`;
            });
            
            sphere.addEventListener('mouseleave', () => {
                (sphere as HTMLElement).style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }, []);

    useEffect(() => {
        floatingRunes();
        const nebulaCleanup = nebulaStars(); // nebulaStars returns a cleanup function
        const circuitCleanup = circuitAnimation(); // circuitAnimation returns a cleanup function
        contactStars();
        radarTicks();
        contactSpheresHoverEffect();

        return () => {
            if (nebulaCleanup) nebulaCleanup();
            if (circuitCleanup) circuitCleanup();
        };
    }, [floatingRunes, nebulaStars, circuitAnimation, contactStars, radarTicks, contactSpheresHoverEffect]);

    return {};
};
