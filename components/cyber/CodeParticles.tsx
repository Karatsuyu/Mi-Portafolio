'use client';

import { useEffect, useRef } from 'react';

// Mezcla de caracteres: código real + katakana + símbolos
const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノ' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
  '0123456789{}[]()<>/\\|;:.,!@#$%^&*+=~`?' +
  'constletvarfunctionreturnimportexportclassasyncawait';

const FONT_SIZE = 13;

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
  opacity: number;
  color: 'cyan' | 'green' | 'purple';
}

export default function CodeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let cols: Column[] = [];
    let animId: number;

    const colorMap = {
      cyan:   '#00f5ff',
      green:  '#00ff88',
      purple: '#a855f7',
    };

    const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const initColumns = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;

      const numCols = Math.floor(W / (FONT_SIZE * 1.6));
      const colorOptions: Column['color'][] = ['cyan', 'green', 'cyan', 'cyan', 'purple'];

      cols = Array.from({ length: numCols }, (_, i) => ({
        x:      i * FONT_SIZE * 1.6,
        y:      Math.random() * -H,
        speed:  0.4 + Math.random() * 1.2,
        chars:  Array.from({ length: 24 }, randomChar),
        length: 8 + Math.floor(Math.random() * 16),
        opacity: 0.4 + Math.random() * 0.6,
        color:  colorOptions[Math.floor(Math.random() * colorOptions.length)],
      }));
    };

    const draw = () => {
      // Trail fade
      ctx.fillStyle = 'rgba(3,4,10,0.08)';
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      cols.forEach(col => {
        // Actualiza chars aleatoriamente
        if (Math.random() < 0.05) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = randomChar();
        }

        for (let i = 0; i < col.length; i++) {
          const charY = col.y - i * FONT_SIZE;
          if (charY < 0 || charY > H) continue;

          // Head char: más brillante
          const isHead = i === 0;
          const alpha  = isHead
            ? col.opacity
            : col.opacity * (1 - i / col.length) * 0.7;

          const hexColor = colorMap[col.color];

          ctx.globalAlpha = alpha;

          if (isHead) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = hexColor;
            ctx.shadowBlur  = 8;
          } else {
            ctx.fillStyle   = hexColor;
            ctx.shadowBlur  = 0;
          }

          ctx.fillText(col.chars[i % col.chars.length], col.x, charY);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur  = 0;

        col.y += col.speed;

        // Reset cuando sale de pantalla
        if (col.y - col.length * FONT_SIZE > H) {
          col.y      = Math.random() * -200;
          col.speed  = 0.4 + Math.random() * 1.2;
          col.length = 8 + Math.floor(Math.random() * 16);
        }
      });

      animId = requestAnimationFrame(draw);
    };

    initColumns();
    draw();

    const onResize = () => initColumns();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="code-rain-canvas"
      aria-hidden
    />
  );
}