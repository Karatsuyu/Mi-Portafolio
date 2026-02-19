
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
        if (!homeNebula) return;

        homeNebula.innerHTML = '';

        const starCount = 150;
        for (let i = 0; i < starCount; i++) {
            const s = document.createElement('span');
            s.className = 'star';
            s.style.left = `${Math.random() * 100}%`;
            s.style.top = `${Math.random() * 110 - 5}%`;

            const rand = Math.random();
            let size;
            if (rand < 0.6) {
                size = Math.random() * 1.5 + 1.5;
            } else if (rand < 0.85) {
                size = Math.random() * 2 + 3;
            } else {
                size = Math.random() * 3 + 5;
            }
            s.style.width = `${size}px`;
            s.style.height = `${size}px`;

            const dur = (Math.random() * 6 + 4).toFixed(2);
            const delay = (Math.random() * 8).toFixed(2);
            const glowDur = (Math.random() * 3 + 1.4).toFixed(2);
            s.style.setProperty('--star-dur', dur + 's');
            s.style.setProperty('--star-delay', delay + 's');
            s.style.setProperty('--star-glow-dur', glowDur + 's');

            s.style.opacity = '0';
            if (size > 4.5) s.style.opacity = '0.85';

            homeNebula.appendChild(s);
        }
    }, []);

    const circuitAnimation = useCallback(() => {
        const circuitContainer = document.querySelector('.circuit-container');
        if (!circuitContainer) return;

        const createCircuit = () => {
            circuitContainer.innerHTML = '';

            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'circuit-star';
                star.style.width = `${Math.random() * 2 + 0.5}px`;
                star.style.height = star.style.width;
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.opacity = `${Math.random() * 0.5 + 0.3}`;
                circuitContainer.appendChild(star);
            }

            const lines = [
                { x1: 0, y1: 30, x2: 100, y2: 30 }, { x1: 0, y1: 70, x2: 100, y2: 70 },
                { x1: 20, y1: 10, x2: 80, y2: 90 }, { x1: 80, y1: 10, x2: 20, y2: 90 },
                { x1: 0, y1: 50, x2: 50, y2: 50 }, { x1: 50, y1: 50, x2: 100, y2: 50 },
                { x1: 30, y1: 20, x2: 70, y2: 20 }, { x1: 30, y1: 80, x2: 70, y2: 80 },
                { x1: 10, y1: 10, x2: 10, y2: 90 }, { x1: 90, y1: 10, x2: 90, y2: 90 }
            ];

            lines.forEach(line => {
                const lineElement = document.createElement('div');
                lineElement.className = 'circuit-line';
                const dx = line.x2 - line.x1;
                const dy = line.y2 - line.y1;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                lineElement.style.width = `${length}%`;
                lineElement.style.left = `${line.x1}%`;
                lineElement.style.top = `${line.y1}%`;
                lineElement.style.transform = `rotate(${angle}deg)`;
                lineElement.style.animationDelay = `${Math.random() * 3}s`;
                circuitContainer.appendChild(lineElement);
            });

            const nodes = [
                { x: 50, y: 50 }, { x: 30, y: 20 }, { x: 70, y: 20 }, { x: 30, y: 80 },
                { x: 70, y: 80 }, { x: 10, y: 50 }, { x: 90, y: 50 }, { x: 20, y: 30 },
                { x: 80, y: 30 }, { x: 20, y: 70 }, { x: 80, y: 70 }, { x: 50, y: 30 },
                { x: 50, y: 70 }
            ];

            nodes.forEach(node => {
                const nodeElement = document.createElement('div');
                nodeElement.className = 'circuit-node';
                nodeElement.style.left = `${node.x}%`;
                nodeElement.style.top = `${node.y}%`;
                nodeElement.style.animationDelay = `${Math.random() * 2}s`;
                circuitContainer.appendChild(nodeElement);
            });

            for (let i = 0; i < 10; i++) {
                const pulse = document.createElement('div');
                pulse.className = 'circuit-pulse';
                pulse.style.left = `${Math.random() * 100}%`;
                pulse.style.top = `${Math.random() * 100}%`;
                pulse.style.animationDelay = `${Math.random() * 3}s`;
                circuitContainer.appendChild(pulse);
            }

            for (let i = 0; i < 3; i++) {
                const circle = document.createElement('div');
                circle.className = 'circuit-circle';
                circle.style.width = `${Math.random() * 200 + 100}px`;
                circle.style.height = circle.style.width;
                circle.style.left = `${Math.random() * 100 - 50}%`;
                circle.style.top = `${Math.random() * 100 - 50}%`;
                circle.style.animationDelay = `${Math.random() * 5}s`;
                circuitContainer.appendChild(circle);
            }
        };

        createCircuit();
        const intervalId = setInterval(createCircuit, 10000);

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
                for (let i = 0; i < 360; i += 6) {
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
        nebulaStars();
        const circuitCleanup = circuitAnimation(); // circuitAnimation returns a cleanup function
        contactStars();
        radarTicks();
        contactSpheresHoverEffect();

        return () => {
            if (circuitCleanup) circuitCleanup();
        };
    }, [floatingRunes, nebulaStars, circuitAnimation, contactStars, radarTicks, contactSpheresHoverEffect]);

    return {};
};
