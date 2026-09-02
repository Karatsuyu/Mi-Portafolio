"use client";
import React, { useState, useEffect } from 'react';

interface Skill {
  label: string;
  percent: number;
  color: string;
  icon: JSX.Element;
}

interface SkillFlipCardProps {
  skill: Skill;
}

const SkillFlipCard: React.FC<SkillFlipCardProps> = ({ skill }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const [progressBarPercent, setProgressBarPercent] = useState(0);

  // Para un semicírculo con radio 80: perímetro = π * 80 ≈ 251.327
  const pathLength = 252;
  const offset = pathLength - (pathLength * progressBarPercent) / 100;

  useEffect(() => {
    let animFrame: number;
    let timer: NodeJS.Timeout;

    if (isFlipped) {
      // Breve retardo para sincronizar con la vuelta de la tarjeta
      timer = setTimeout(() => {
        setProgressBarPercent(skill.percent);

        const startTime = performance.now();
        const duration = 1200; // 1.2 segundos

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Curva de aceleración suave (easeOutCubic)
          const eased = 1 - Math.pow(1 - progress, 3);
          setAnimatedNumber(Math.round(eased * skill.percent));

          if (progress < 1) {
            animFrame = requestAnimationFrame(step);
          } else {
            setAnimatedNumber(skill.percent);
          }
        };

        animFrame = requestAnimationFrame(step);
      }, 180);
    } else {
      setProgressBarPercent(0);
      setAnimatedNumber(0);
    }

    return () => {
      clearTimeout(timer);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isFlipped, skill.percent]);

  return (
    <div
      className="flip-card"
      data-percent={skill.percent}
      data-color={skill.color}
      data-label={skill.label}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          {skill.icon}
          <span>{skill.label}</span>
        </div>
        <div className="flip-card-back">
          <div className="skill-progress" aria-label={skill.label}>
            <svg viewBox="0 0 180 100" preserveAspectRatio="xMidYMid meet">
              <path className="bg" d="M10,90 A80,80 0 0 1 170,90" />
              <path
                className="progress"
                d="M10,90 A80,80 0 0 1 170,90"
                stroke={skill.color}
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: offset,
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              />
            </svg>
            <div className="info">
              <div className="percent" style={{ color: skill.color }}>
                {animatedNumber}%
              </div>
              <div className="label">{skill.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillFlipCard;