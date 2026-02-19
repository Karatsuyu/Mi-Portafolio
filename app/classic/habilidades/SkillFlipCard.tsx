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

  // This state will now just toggle between 0 and the target percent
  const [progressBarPercent, setProgressBarPercent] = useState(0);

  const circumference = 283; // This value is based on the SVG path length.
  const offset = circumference - (circumference * progressBarPercent) / 100;

  useEffect(() => {
    // This effect handles the CSS transition for the progress bar
    if (isFlipped) {
      // Set the target for the CSS transition after a short delay
      const timer = setTimeout(() => {
        setProgressBarPercent(skill.percent);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setProgressBarPercent(0);
    }
  }, [isFlipped, skill.percent]);

  useEffect(() => {
    // This effect handles the number animation
    if (isFlipped) {
      const timer = setTimeout(() => {
        if (skill.percent === 0) {
          setAnimatedNumber(0);
          return;
        }

        let currentNum = 0;
        const increment = skill.percent / 60; // Animate over ~1.5s (matches CSS transition)

        const interval = setInterval(() => {
          currentNum += increment;
          if (currentNum >= skill.percent) {
            setAnimatedNumber(skill.percent);
            clearInterval(interval);
          } else {
            setAnimatedNumber(currentNum);
          }
        }, 25);
        return () => clearInterval(interval);
      }, 300); // Delay to sync with card flip animation
      return () => clearTimeout(timer);
    } else {
      setAnimatedNumber(0);
    }
  }, [isFlipped, skill.percent]);


  return (
    <div
      className="flip-card"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          {skill.icon}
          <span>{skill.label}</span>
        </div>
        <div className="flip-card-back">
          <div className="skill-progress">
            <svg viewBox="0 -7 180 97">
              <path className="bg" d="M10 80 A80 80 0 0 1 170 80"></path>
              <path
                className="progress"
                d="M10 80 A80 80 0 0 1 170 80"
                stroke={skill.color}
                style={{ strokeDashoffset: offset }}
              ></path>
            </svg>
            <div className="info">
              <div className="percent">{Math.round(animatedNumber)}%</div>
              <div className="label">{skill.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillFlipCard;