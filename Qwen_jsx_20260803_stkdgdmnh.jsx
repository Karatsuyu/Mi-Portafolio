import React from "react";

// Las 24 runas del Futhark antiguo (las de tu imagen)
const RUNES = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ",
               "ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&display=swap');

.mrc-scene{
  position:relative;
  display:flex; align-items:center; justify-content:center;
  border-radius:50%;
  background:radial-gradient(circle at center, #17082b 0%, #0b0417 55%, #06020c 100%);
  box-shadow:0 0 60px rgba(160,32,240,.25), inset 0 0 40px rgba(160,32,240,.15);
}
.mrc-halo{
  position:absolute; width:72%; height:72%; border-radius:50%;
  background:radial-gradient(circle, rgba(194,107,255,.30) 0%, rgba(160,32,240,.12) 45%, transparent 70%);
  filter:blur(8px);
  animation:mrc-pulse 4s ease-in-out infinite;
}
.mrc-border{
  position:absolute; border-radius:50%;
  border:2px solid rgba(194,107,255,.8);
  animation:mrc-glow 3s ease-in-out infinite;
}
.mrc-ring{
  position:absolute; inset:0; pointer-events:none;
  animation:mrc-spin var(--speed,24s) linear infinite;
  will-change:transform;
}
.mrc-ring--inner{ animation-direction:reverse; }
.mrc-rune{
  position:absolute; left:50%; top:50%;
  font-family:'Noto Sans Runic', sans-serif;
  color:#eecbff; user-select:none;
  text-shadow:0 0 4px #f3dcff, 0 0 10px #c26bff, 0 0 22px #a020f0, 0 0 42px #7a00d6;
  animation:mrc-flicker 2.6s ease-in-out infinite;
}
.mrc-core{
  position:absolute; width:16%; height:16%; border-radius:50%;
  background:radial-gradient(circle, #f6e7ff 0%, #c26bff 40%, rgba(160,32,240,0) 75%);
  filter:blur(1px);
  animation:mrc-pulse 3s ease-in-out infinite;
}
@keyframes mrc-spin{ to{ transform:rotate(360deg); } }
@keyframes mrc-pulse{
  0%,100%{ transform:scale(1); opacity:.85; }
  50%{ transform:scale(1.1); opacity:1; }
}
@keyframes mrc-flicker{ 0%,100%{ opacity:1; } 50%{ opacity:.6; } }
@keyframes mrc-glow{
  0%,100%{ box-shadow:0 0 10px #a020f0, inset 0 0 10px rgba(160,32,240,.7); }
  50%{ box-shadow:0 0 22px #c26bff, inset 0 0 18px rgba(194,107,255,.9); }
}
`;

export default function MagicRuneCircle({ size = 420, speed = 24 }) {
  const outerR = size / 2 - size * 0.10;  // radio anillo exterior
  const innerR = size / 2 - size * 0.26;  // radio anillo interior

  return (
    <div className="mrc-scene" style={{ width: size, height: size }}>
      <style>{css}</style>

      <div className="mrc-halo" />
      <div className="mrc-border" style={{ inset: size * 0.015 }} />
      <div className="mrc-border" style={{ inset: size * 0.19 }} />

      {/* Anillo exterior: gira en sentido horario */}
      <div className="mrc-ring" style={{ "--speed": `${speed}s` }}>
        {RUNES.map((r, i) => (
          <span key={i} className="mrc-rune"
            style={{
              fontSize: size * 0.085,
              transform: `translate(-50%,-50%) rotate(${(360 / RUNES.length) * i}deg) translateY(-${outerR}px)`,
              animationDelay: `${-i * 0.2}s`,
            }}>
            {r}
          </span>
        ))}
      </div>

      {/* Anillo interior: gira al revés */}
      <div className="mrc-ring mrc-ring--inner" style={{ "--speed": `${speed * 1.6}s` }}>
        {RUNES.map((r, i) => (
          <span key={i} className="mrc-rune"
            style={{
              fontSize: size * 0.05,
              transform: `translate(-50%,-50%) rotate(${(360 / RUNES.length) * i + 7.5}deg) translateY(-${innerR}px)`,
              animationDelay: `${-i * 0.15}s`,
            }}>
            {r}
          </span>
        ))}
      </div>

      <div className="mrc-core" />
    </div>
  );
}