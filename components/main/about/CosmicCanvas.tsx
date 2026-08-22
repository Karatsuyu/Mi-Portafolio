"use client";

import React, { useEffect, useRef } from "react";
import { usePageVisibility } from "@/hooks/usePageVisibility";

export default function CosmicCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = usePageVisibility();
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let animationFrameId: number;
    let isDisposed = false;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const TAU = Math.PI * 2;

    // ============ PALETA DE COLORES ESTELARES ============
    const STAR_PALETTES = [
      // Azules calientes (tipo O/B)
      { h: 220, s: 100, l: 80, weight: 15 },
      { h: 210, s: 95, l: 75, weight: 12 },
      { h: 230, s: 90, l: 85, weight: 10 },
      // Blanco-azuladas (tipo A)
      { h: 205, s: 60, l: 92, weight: 14 },
      { h: 200, s: 40, l: 95, weight: 12 },
      // Blancas puras
      { h: 0, s: 0, l: 100, weight: 10 },
      // Amarillas (tipo G - como el Sol)
      { h: 45, s: 90, l: 80, weight: 8 },
      { h: 50, s: 85, l: 75, weight: 6 },
      { h: 40, s: 95, l: 85, weight: 5 },
      // Naranjas (tipo K)
      { h: 25, s: 95, l: 70, weight: 6 },
      { h: 18, s: 90, l: 65, weight: 5 },
      { h: 30, s: 100, l: 75, weight: 4 },
      // Rojas (tipo M - gigantes rojas)
      { h: 5, s: 90, l: 60, weight: 5 },
      { h: 355, s: 85, l: 55, weight: 4 },
      { h: 15, s: 95, l: 65, weight: 3 },
      // Exóticas: púrpuras/magentas
      { h: 280, s: 80, l: 75, weight: 3 },
      { h: 300, s: 75, l: 70, weight: 2 },
      { h: 320, s: 85, l: 75, weight: 2 },
      // Cyan/turquesa
      { h: 175, s: 85, l: 75, weight: 3 },
      { h: 185, s: 90, l: 80, weight: 2 },
      // Verde esmeralda (raras)
      { h: 140, s: 70, l: 70, weight: 1 },
      { h: 160, s: 80, l: 75, weight: 1 },
    ];

    function pickStarColor() {
      const totalWeight = STAR_PALETTES.reduce((s, p) => s + p.weight, 0);
      let r = Math.random() * totalWeight;
      for (const p of STAR_PALETTES) {
        r -= p.weight;
        if (r <= 0) {
          return {
            h: p.h + rand(-8, 8),
            s: p.s + rand(-10, 10),
            l: p.l + rand(-5, 5),
          };
        }
      }
      return { h: 0, s: 0, l: 100 };
    }

    function hslStr(h: number, s: number, l: number, a: number) {
      return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }

    // ============ NEBULOSAS ============
    class Nebula {
      x = Math.random() * (W || 800);
      y = Math.random() * (H || 600);
      radius = rand(180, 450) * DPR;
      hue = rand(180, 340);
      hue2 = this.hue + rand(-40, 40);
      hue3 = this.hue + rand(60, 120);
      phase = Math.random() * TAU;
      speed = rand(0.0002, 0.0008);
      drift = { x: rand(-0.05, 0.05), y: rand(-0.05, 0.05) };
      opacity = rand(0.08, 0.18);

      update() {
        this.phase += this.speed;
        this.x += this.drift.x * DPR;
        this.y += this.drift.y * DPR;
        if (this.x < -this.radius) this.x = W + this.radius;
        if (this.x > W + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = H + this.radius;
        if (this.y > H + this.radius) this.y = -this.radius;
      }

      draw() {
        if (!ctx) return;
        const pulse = 1 + Math.sin(this.phase) * 0.15;
        const r = Math.max(10, this.radius * pulse);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        grad.addColorStop(0, hslStr(this.hue, 85, 65, this.opacity * 0.9));
        grad.addColorStop(0.25, hslStr(this.hue2, 75, 55, this.opacity * 0.6));
        grad.addColorStop(0.55, hslStr(this.hue3, 65, 45, this.opacity * 0.25));
        grad.addColorStop(1, hslStr(this.hue, 60, 30, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, TAU);
        ctx.fill();
      }
    }

    // ============ ESTRELLAS DE FONDO ============
    class BackgroundStar {
      x = Math.random() * (W || 800);
      y = Math.random() * (H || 600);
      size = Math.pow(Math.random(), 3) * 1.8 * DPR + 0.3 * DPR;
      baseOpacity = rand(0.25, 0.95);
      phase = Math.random() * TAU;
      twinkleSpeed = rand(0.005, 0.03);
      color = pickStarColor();

      update() {
        this.phase += this.twinkleSpeed;
      }

      draw() {
        if (!ctx) return;
        const twinkle = 0.5 + 0.5 * Math.sin(this.phase);
        const a = this.baseOpacity * (0.4 + 0.6 * twinkle);
        const c = this.color;
        ctx.fillStyle = hslStr(c.h, c.s, c.l, a);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TAU);
        ctx.fill();

        if (this.size > 1.2 * DPR) {
          const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
          glow.addColorStop(0, hslStr(c.h, c.s, c.l, a * 0.4));
          glow.addColorStop(1, hslStr(c.h, c.s, c.l, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, TAU);
          ctx.fill();
        }
      }
    }

    // ============ VÍA LÁCTEA ============
    class MilkyWay {
      stars: Array<{
        x: number;
        y: number;
        size: number;
        opacity: number;
        color: { h: number; s: number; l: number };
      }> = [];

      constructor() {
        const count = 1200;
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          const cx = t * (W || 800);
          const cy = (H || 600) * 0.3 + t * (H || 600) * 0.4;
          const spread = rand(40, 180) * DPR;
          const angle = Math.random() * TAU;
          const r = Math.pow(Math.random(), 0.5) * spread;
          const col = pickStarColor();
          this.stars.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r * 0.4,
            size: Math.pow(Math.random(), 2) * 1.2 * DPR + 0.2 * DPR,
            opacity: rand(0.1, 0.55) * (1 - Math.abs(Math.sin(angle)) * 0.5),
            color: col,
          });
        }
      }

      draw() {
        if (!ctx) return;
        const grad = ctx.createLinearGradient(0, H * 0.2, W, H * 0.8);
        grad.addColorStop(0, "rgba(100, 130, 220, 0.025)");
        grad.addColorStop(0.3, "rgba(180, 120, 200, 0.03)");
        grad.addColorStop(0.6, "rgba(200, 150, 180, 0.03)");
        grad.addColorStop(1, "rgba(120, 160, 220, 0.025)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        for (const s of this.stars) {
          ctx.globalAlpha = s.opacity;
          ctx.fillStyle = hslStr(s.color.h, s.color.s, s.color.l, 1);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    // ============ ESTRELLAS PRINCIPALES ============
    class MainStar {
      x = rand(40 * DPR, Math.max(80 * DPR, W - 40 * DPR));
      y = rand(40 * DPR, Math.max(80 * DPR, H - 40 * DPR));
      baseSize = rand(1.8, 3.6) * DPR;
      phase = Math.random() * TAU;
      twinkleSpeed = rand(0.01, 0.03);
      color = pickStarColor();
      vx = rand(-0.05, 0.05) * DPR;
      vy = rand(-0.05, 0.05) * DPR;
      isPulsar = Math.random() < 0.08;
      pulsarPhase = Math.random() * TAU;

      update() {
        this.phase += this.twinkleSpeed;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        if (this.isPulsar) this.pulsarPhase += 0.05;
      }

      draw() {
        if (!ctx) return;
        const twinkle = 0.6 + 0.4 * Math.sin(this.phase);
        const size = this.baseSize * (0.8 + 0.4 * twinkle);
        const c = this.color;

        // Glow externo
        const glowSize = size * 8;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
        grad.addColorStop(0, hslStr(c.h, c.s, Math.min(c.l + 15, 98), 0.7 * twinkle));
        grad.addColorStop(0.2, hslStr(c.h, c.s, c.l, 0.35 * twinkle));
        grad.addColorStop(0.5, hslStr(c.h, c.s * 0.9, c.l * 0.8, 0.1 * twinkle));
        grad.addColorStop(1, hslStr(c.h, c.s, c.l, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, TAU);
        ctx.fill();

        // Núcleo brillante
        ctx.fillStyle = hslStr(c.h, Math.max(c.s - 20, 0), Math.min(c.l + 10, 98), twinkle);
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, TAU);
        ctx.fill();

        // Rayos de difracción
        if (this.baseSize > 2.4 * DPR) {
          ctx.strokeStyle = hslStr(c.h, c.s, Math.min(c.l + 15, 95), 0.35 * twinkle);
          ctx.lineWidth = 0.5 * DPR;
          const rayLen = size * 6.5;
          ctx.beginPath();
          ctx.moveTo(this.x - rayLen, this.y);
          ctx.lineTo(this.x + rayLen, this.y);
          ctx.moveTo(this.x, this.y - rayLen);
          ctx.lineTo(this.x + rayLen, this.y);
          ctx.stroke();

          ctx.strokeStyle = hslStr(c.h, c.s, Math.min(c.l + 15, 95), 0.15 * twinkle);
          const dRay = rayLen * 0.55;
          ctx.beginPath();
          ctx.moveTo(this.x - dRay, this.y - dRay);
          ctx.lineTo(this.x + dRay, this.y + dRay);
          ctx.moveTo(this.x - dRay, this.y + dRay);
          ctx.lineTo(this.x + dRay, this.y - dRay);
          ctx.stroke();
        }

        // Onda pulsar
        if (this.isPulsar) {
          const wave = (this.pulsarPhase % TAU) / TAU;
          const waveRadius = wave * 50 * DPR;
          const waveOpacity = (1 - wave) * 0.5;
          ctx.strokeStyle = hslStr(c.h, c.s, c.l, waveOpacity);
          ctx.lineWidth = 1 * DPR;
          ctx.beginPath();
          ctx.arc(this.x, this.y, waveRadius, 0, TAU);
          ctx.stroke();
        }
      }
    }

    // ============ ESTRELLAS FUGACES ============
    class ShootingStar {
      active = false;
      cooldown = rand(150, 450);
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      life = 0;
      maxLife = 60;
      trail: Array<{ x: number; y: number }> = [];
      size = 2 * DPR;
      color = pickStarColor();

      reset() {
        this.active = false;
        this.cooldown = rand(150, 450);
      }

      activate() {
        this.active = true;
        const angle = rand(-Math.PI / 4, Math.PI / 4) + (Math.random() < 0.5 ? Math.PI : 0);
        const side = Math.floor(Math.random() * 2);
        if (side === 0) {
          this.x = rand(0, W);
          this.y = rand(0, H * 0.3);
        } else {
          this.x = rand(W * 0.7, W);
          this.y = rand(0, H * 0.5);
        }
        this.vx = Math.cos(angle) * rand(8, 13) * DPR;
        this.vy = Math.sin(angle) * rand(8, 13) * DPR;
        this.life = 0;
        this.maxLife = rand(35, 75);
        this.trail = [];
        this.size = rand(1.5, 2.8) * DPR;
        this.color = pickStarColor();
        if (Math.random() < 0.4) this.color = { h: 0, s: 0, l: 100 };
      }

      update() {
        if (!this.active) {
          this.cooldown--;
          if (this.cooldown <= 0) this.activate();
          return;
        }
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 20) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (
          this.life >= this.maxLife ||
          this.x < -50 ||
          this.x > W + 50 ||
          this.y < -50 ||
          this.y > H + 50
        ) {
          this.reset();
        }
      }

      draw() {
        if (!this.active || !ctx) return;
        const fade = 1 - this.life / this.maxLife;
        const c = this.color;

        for (let i = 0; i < this.trail.length; i++) {
          const t = i / this.trail.length;
          const p = this.trail[i];
          const a = t * fade * 0.85;
          const s = this.size * t;
          ctx.fillStyle = hslStr(c.h, c.s, c.l, a);
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, TAU);
          ctx.fill();
        }

        ctx.fillStyle = hslStr(c.h, Math.max(c.s - 30, 0), Math.min(c.l + 10, 99), fade);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TAU);
        ctx.fill();

        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
        g.addColorStop(0, hslStr(c.h, c.s, c.l, 0.5 * fade));
        g.addColorStop(1, hslStr(c.h, c.s, c.l, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 5, 0, TAU);
        ctx.fill();
      }
    }

    // ============ POLVO CÓSMICO ============
    class CosmicDust {
      x = Math.random() * (W || 800);
      y = Math.random() * (H || 600);
      size = rand(0.3, 1.1) * DPR;
      vx = rand(-0.1, 0.1) * DPR;
      vy = rand(-0.1, 0.1) * DPR;
      opacity = rand(0.1, 0.35);
      phase = Math.random() * TAU;
      color = pickStarColor();

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += 0.01;
        if (this.x < 0) this.x = W;
        if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H;
        if (this.y > H) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        const a = this.opacity * (0.5 + 0.5 * Math.sin(this.phase));
        const c = this.color;
        ctx.fillStyle = hslStr(c.h, c.s, c.l, a);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TAU);
        ctx.fill();
      }
    }

    // ============ SUPERNOVA ============
    class Supernova {
      active = false;
      cooldown = rand(500, 1200);
      x = 0;
      y = 0;
      life = 0;
      maxLife = 160;
      hue = rand(180, 340);
      hue2 = this.hue + rand(30, 90);

      trigger() {
        this.active = true;
        this.x = rand(W * 0.1, W * 0.9);
        this.y = rand(H * 0.1, H * 0.9);
        this.life = 0;
        this.maxLife = 160;
        this.hue = rand(180, 340);
        this.hue2 = this.hue + rand(30, 90);
      }

      update() {
        if (!this.active) {
          this.cooldown--;
          if (this.cooldown <= 0) this.trigger();
          return;
        }
        this.life++;
        if (this.life >= this.maxLife) this.active = false;
      }

      draw() {
        if (!this.active || !ctx) return;
        const t = this.life / this.maxLife;
        const r = Math.max(5, t * 280 * DPR);
        const intensity = Math.sin(t * Math.PI);

        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        grad.addColorStop(0, `hsla(0, 0%, 100%, ${intensity * 0.9})`);
        grad.addColorStop(0.15, hslStr(this.hue, 100, 85, intensity * 0.7));
        grad.addColorStop(0.4, hslStr(this.hue2, 90, 65, intensity * 0.4));
        grad.addColorStop(0.7, hslStr(this.hue, 80, 50, intensity * 0.15));
        grad.addColorStop(1, hslStr(this.hue, 80, 40, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, TAU);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5 * DPR * intensity, 0, TAU);
        ctx.fill();
      }
    }

    // ============ ESTADO Y CREACIÓN ============
    let nebulas: Nebula[] = [];
    let bgStars: BackgroundStar[] = [];
    let milkyWay: MilkyWay;
    let mainStars: MainStar[] = [];
    let shootingStars: ShootingStar[] = [];
    let dust: CosmicDust[] = [];
    let supernova: Supernova;

    function initElements() {
      nebulas = Array.from({ length: 6 }, () => new Nebula());
      bgStars = Array.from({ length: 650 }, () => new BackgroundStar());
      milkyWay = new MilkyWay();
      mainStars = Array.from({ length: 48 }, () => new MainStar());
      shootingStars = Array.from({ length: 3 }, () => new ShootingStar());
      dust = Array.from({ length: 160 }, () => new CosmicDust());
      supernova = new Supernova();
    }

    // ============ MOUSE TRACKING ============
    const mouse = { x: -9999, y: -9999, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (clientX >= 0 && clientX <= rect.width && clientY >= 0 && clientY <= rect.height) {
        mouse.x = clientX * DPR;
        mouse.y = clientY * DPR;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // ============ RESIZE ============
    function handleResize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = (rect.width || window.innerWidth) * DPR;
      H = canvas.height = (rect.height || window.innerHeight) * DPR;
      initElements();
    }

    handleResize();
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // ============ CONEXIONES CONSTELARES ============
    function drawConnections() {
      if (!ctx) return;
      const maxDist = 180 * DPR;
      const mouseRadius = 220 * DPR;
      ctx.lineWidth = 0.8 * DPR;

      for (let i = 0; i < mainStars.length; i++) {
        const a = mainStars[i];
        for (let j = i + 1; j < mainStars.length; j++) {
          const b = mainStars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            let mouseBoost = 0;
            if (mouse.active) {
              const dMouseA = Math.hypot(a.x - mouse.x, a.y - mouse.y);
              const dMouseB = Math.hypot(b.x - mouse.x, b.y - mouse.y);
              if (dMouseA < mouseRadius && dMouseB < mouseRadius) {
                mouseBoost = (1 - Math.max(dMouseA, dMouseB) / mouseRadius) * 0.6;
              }
            }

            const fade = 1 - dist / maxDist;
            const alpha = fade * 0.4 + mouseBoost;

            const ac = a.color;
            const bc = b.color;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, hslStr(ac.h, ac.s, Math.min(ac.l + 10, 95), alpha));
            grad.addColorStop(0.5, hslStr((ac.h + bc.h) / 2, (ac.s + bc.s) / 2, 92, alpha * 1.3));
            grad.addColorStop(1, hslStr(bc.h, bc.s, Math.min(bc.l + 10, 95), alpha));

            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            if (alpha > 0.35) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const midHue = (ac.h + bc.h) / 2;
              ctx.fillStyle = hslStr(midHue, 100, 92, alpha * 0.6);
              ctx.beginPath();
              ctx.arc(mx, my, 1.2 * DPR, 0, TAU);
              ctx.fill();
            }
          }
        }
      }
    }

    // ============ INTERACCIÓN MOUSE ============
    function drawMouseAura() {
      if (!mouse.active || !ctx) return;
      const r = 180 * DPR;
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r);
      grad.addColorStop(0, "rgba(200, 210, 255, 0.12)");
      grad.addColorStop(0.5, "rgba(160, 180, 255, 0.04)");
      grad.addColorStop(1, "rgba(150, 180, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, r, 0, TAU);
      ctx.fill();

      ctx.lineWidth = 0.6 * DPR;
      for (const s of mainStars) {
        const d = Math.hypot(s.x - mouse.x, s.y - mouse.y);
        if (d < r) {
          const alpha = (1 - d / r) * 0.6;
          const c = s.color;
          ctx.strokeStyle = hslStr(c.h, c.s, Math.min(c.l + 15, 95), alpha);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }
      }
    }

    // ============ LOOP PRINCIPAL ============
    function animate() {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisibleRef.current || !ctx) return;

      // Fondo cósmico profundo
      const bgGrad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.8
      );
      bgGrad.addColorStop(0, "#0a0e24");
      bgGrad.addColorStop(0.4, "#050818");
      bgGrad.addColorStop(1, "#010208");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Nebulosas
      ctx.globalCompositeOperation = "screen";
      nebulas.forEach((n) => {
        n.update();
        n.draw();
      });
      ctx.globalCompositeOperation = "source-over";

      // Vía Láctea
      if (milkyWay) milkyWay.draw();

      // Estrellas de fondo
      bgStars.forEach((s) => {
        s.update();
        s.draw();
      });

      // Polvo cósmico
      dust.forEach((d) => {
        d.update();
        d.draw();
      });

      // Conexiones
      drawConnections();

      // Estrellas principales con bloom
      ctx.globalCompositeOperation = "lighter";
      mainStars.forEach((s) => {
        s.update();
        s.draw();
      });
      ctx.globalCompositeOperation = "source-over";

      // Supernova
      if (supernova) {
        supernova.update();
        if (supernova.active) {
          ctx.globalCompositeOperation = "lighter";
          supernova.draw();
          ctx.globalCompositeOperation = "source-over";
        }
      }

      // Estrellas fugaces
      shootingStars.forEach((s) => {
        s.update();
        s.draw();
      });

      // Aura del mouse
      drawMouseAura();

      // Viñeta
      const vignette = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.3,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.75
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);
    }

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
