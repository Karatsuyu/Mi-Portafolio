'use client';

import {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILL_FILES, TERMINAL_OUTPUTS, type SkillFile } from './SkillsData';

// ── Syntax highlighter liviano (sin dependencia externa) ─────
// Resalta: keywords, strings, comentarios, números, tipos
function highlight(code: string, language: string): React.ReactNode[] {
  const lines = code.split('\n');

  // Patrones por tipo (orden importa: más específico primero)
  const patterns: Array<{ regex: RegExp; className: string }> = [
    // Comentarios
    { regex: /(\/\/.*$|#.*$)/gm,                    className: 'syn-comment'  },
    // Strings
    { regex: /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g,    className: 'syn-string'   },
    // Keywords TypeScript/JS
    { regex: /\b(const|let|var|function|return|export|default|import|from|interface|type|class|extends|implements|async|await|new|this|typeof|keyof|Record|Promise|Injectable|private|readonly|public|protected)\b/g,
      className: 'syn-keyword' },
    // Keywords YAML
    { regex: /^(\s*[\w-]+)(?=\s*:)/gm,              className: 'syn-yaml-key' },
    // Tipos/nombres de clase (PascalCase)
    { regex: /\b([A-Z][a-zA-Z0-9]*)\b/g,            className: 'syn-type'     },
    // Números
    { regex: /\b(\d+)\b/g,                          className: 'syn-number'   },
    // Decoradores
    { regex: /(@\w+)/g,                             className: 'syn-decorator'},
    // Operadores / puntuación especial
    { regex: /([{}[\]();,])/g,                      className: 'syn-punct'    },
  ];

  return lines.map((line, li) => {
    // Parseo simple: construimos spans
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Comentarios (toda la línea)
    const commentMatch = remaining.match(/^(\s*)(\/\/.*$|#.*$)/);
    if (commentMatch) {
      parts.push(
        <span key={key++} style={{ color: '#4a6070', fontStyle: 'italic' }}>
          {remaining}
        </span>
      );
      return (
        <div key={li} style={{ display: 'flex' }}>
          <span style={{ userSelect: 'none', color: '#1e3040', minWidth: '2.5rem', paddingRight: '1rem', textAlign: 'right' }}>
            {li + 1}
          </span>
          <span style={{ flex: 1 }}>{parts}</span>
        </div>
      );
    }

    // Strings
    const stringParts: React.ReactNode[] = [];
    const stringRegex = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = stringRegex.exec(remaining)) !== null) {
      if (m.index > lastIdx) {
        stringParts.push(remaining.slice(lastIdx, m.index));
      }
      stringParts.push(
        <span key={key++} style={{ color: '#00ff88' }}>{m[0]}</span>
      );
      lastIdx = m.index + m[0].length;
    }
    if (lastIdx < remaining.length) stringParts.push(remaining.slice(lastIdx));

    // Procesamos cada parte de texto plano para keywords/números
    const processText = (text: string): React.ReactNode => {
      const kwRegex = /\b(const|let|var|function|return|export|default|import|from|interface|type|class|extends|implements|async|await|new|this|typeof|keyof|Record|Promise|Injectable|private|readonly|public|protected)\b/g;
      const numRegex = /\b(\d+)\b/g;
      const decorRegex = /(@\w+)/g;
      const typeRegex = /\b([A-Z][a-zA-Z0-9]{2,})\b/g;
      const punctRegex = /([{}[\]();])/g;

      const allMatches: Array<{ idx: number; end: number; node: React.ReactNode }> = [];

      const collect = (re: RegExp, color: string) => {
        re.lastIndex = 0;
        let mr: RegExpExecArray | null;
        while ((mr = re.exec(text)) !== null) {
          allMatches.push({
            idx: mr.index,
            end: mr.index + mr[0].length,
            node: <span key={key++} style={{ color }}>{mr[0]}</span>,
          });
        }
      };

      collect(kwRegex,    '#a855f7');
      collect(decorRegex, '#f0e040');
      collect(typeRegex,  '#00c8d4');
      collect(numRegex,   '#ff9500');
      collect(punctRegex, '#4a6080');

      // Eliminar overlaps y ordenar
      allMatches.sort((a, b) => a.idx - b.idx);
      const merged: typeof allMatches = [];
      for (const m of allMatches) {
        if (merged.length === 0 || m.idx >= merged[merged.length - 1].end) {
          merged.push(m);
        }
      }

      if (merged.length === 0) return text;

      const result: React.ReactNode[] = [];
      let pos = 0;
      for (const m of merged) {
        if (m.idx > pos) result.push(text.slice(pos, m.idx));
        result.push(m.node);
        pos = m.end;
      }
      if (pos < text.length) result.push(text.slice(pos));
      return <>{result}</>;
    };

    const finalParts: React.ReactNode[] = stringParts.map((part, i) =>
      typeof part === 'string' ? <span key={i}>{processText(part)}</span> : part
    );

    return (
      <div key={li} style={{ display: 'flex', minHeight: '1.45em' }}>
        <span style={{
          userSelect: 'none',
          color: '#1e3040',
          minWidth: '2.5rem',
          paddingRight: '1rem',
          textAlign: 'right',
          flexShrink: 0,
        }}>
          {li + 1}
        </span>
        <span style={{ flex: 1 }}>{finalParts}</span>
      </div>
    );
  });
}

// ── Hook: typewriter que escribe código línea a línea ────────
function useCodeTypewriter(targetCode: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const idxRef   = useRef(0);

  useEffect(() => {
    // Reset cuando cambia el código target
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
  }, [targetCode]);

  useEffect(() => {
    if (!active || done) return;

    const tick = () => {
      const i = idxRef.current;
      if (i >= targetCode.length) {
        setDone(true);
        return;
      }

      // Escribe de a 1–3 chars por tick para velocidad variable
      const chunk = targetCode.slice(i, i + 2);
      idxRef.current += chunk.length;
      setDisplayed(targetCode.slice(0, idxRef.current));

      // Pausa en saltos de línea para efecto de "pensar"
      const nextChar = targetCode[idxRef.current];
      const delay = nextChar === '\n' ? speed * 4 : speed;
      timerRef.current = setTimeout(tick, delay);
    };

    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [active, targetCode, done, speed]);

  return { displayed, done };
}

// ── Barra de título del IDE ──────────────────────────────────
function TitleBar() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.6rem 1rem',
      background: '#0a0e18',
      borderBottom: '1px solid rgba(0,245,255,0.08)',
      flexShrink: 0,
    }}>
      {/* Botones de semáforo */}
      {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => (
        <div key={i} style={{
          width: 11, height: 11,
          borderRadius: '50%',
          background: c,
          opacity: 0.8,
        }} />
      ))}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'rgba(200,216,232,0.3)',
        marginLeft: '0.75rem',
        letterSpacing: '0.05em',
      }}>
        cyber-portfolio — skills editor
      </span>
      {/* Indicador de lenguaje */}
      <span style={{
        marginLeft: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        color: 'rgba(0,245,255,0.35)',
        letterSpacing: '0.1em',
      }}>
        TypeScript · UTF-8 · LF
      </span>
    </div>
  );
}

// ── Tabs del IDE ─────────────────────────────────────────────
function TabBar({
  files,
  activeIdx,
  onChange,
}: {
  files: SkillFile[];
  activeIdx: number;
  onChange: (i: number) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(0,245,255,0.08)',
      background: '#080c14',
      flexShrink: 0,
    }}>
      {files.map((f, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={f.filename}
            onClick={() => onChange(i)}
            data-cursor-hover
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.04em',
              color: active ? '#fff' : 'rgba(200,216,232,0.35)',
              background: active ? '#0e1424' : 'transparent',
              border: 'none',
              borderRight: '1px solid rgba(0,245,255,0.06)',
              borderBottom: active ? `2px solid ${f.color}` : '2px solid transparent',
              padding: '0.6rem 1.2rem',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, background 0.15s',
              flexShrink: 0,
            }}
          >
            <span style={{
              color: active ? f.color : 'rgba(200,216,232,0.2)',
              fontSize: '0.75rem',
              transition: 'color 0.15s',
            }}>
              {f.icon}
            </span>
            {f.filename}
            {/* Dot de "modificado" */}
            <span style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: f.color,
              opacity: active ? 0.7 : 0,
              marginLeft: 2,
              transition: 'opacity 0.15s',
            }} />
          </button>
        );
      })}
    </div>
  );
}

// ── Panel de skill bars (sidebar derecha) ───────────────────
function SkillBarsPanel({ file }: { file: SkillFile }) {
  return (
    <div style={{
      width: 220,
      borderLeft: '1px solid rgba(0,245,255,0.07)',
      padding: '1rem',
      overflowY: 'auto',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        color: 'rgba(200,216,232,0.2)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '0.25rem',
      }}>
        {'// skill levels'}
      </p>

      {file.skills.map((skill, i) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: skill.highlight ? file.color : 'rgba(200,216,232,0.5)',
            }}>
              {skill.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: skill.highlight ? file.color : 'rgba(200,216,232,0.25)',
            }}>
              {skill.level}%
            </span>
          </div>

          {/* Barra de nivel */}
          <div style={{
            height: 3,
            background: 'rgba(200,216,232,0.07)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ delay: i * 0.06 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '100%',
                background: skill.highlight
                  ? file.color
                  : `${file.color}60`,
                borderRadius: 2,
                boxShadow: skill.highlight ? `0 0 6px ${file.color}80` : 'none',
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Panel terminal (abajo) ───────────────────────────────────
function TerminalPanel({
  filename,
  isRunning,
  isVisible,
}: {
  filename: string;
  isRunning: boolean;
  isVisible: boolean;
}) {
  const output = TERMINAL_OUTPUTS[filename] ?? [];
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) {
      setVisibleLines([]);
      return;
    }
    setVisibleLines([]);
    let i = 0;
    const timer = setInterval(() => {
      if (i < output.length) {
        setVisibleLines(prev => [...prev, output[i] ?? '']);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [isRunning, filename]);

  // Auto-scroll
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [visibleLines]);

  if (!isVisible) return null;

  return (
    <div style={{
      borderTop: '1px solid rgba(0,245,255,0.08)',
      background: '#060a10',
      flexShrink: 0,
    }}>
      {/* Tab terminal */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.4rem 1rem',
        borderBottom: '1px solid rgba(0,245,255,0.05)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'rgba(0,245,255,0.4)',
          letterSpacing: '0.1em',
        }}>
          TERMINAL
        </span>
        {isRunning && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 6px #00ff88',
              display: 'inline-block',
            }}
          />
        )}
      </div>

      {/* Output */}
      <div
        ref={panelRef}
        style={{
          padding: '0.75rem 1rem',
          height: 150,
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          lineHeight: 1.7,
        }}
      >
        <AnimatePresence>
          {visibleLines.map((line, i) => (
            (() => {
              const safeLine = typeof line === 'string' ? line : '';

              return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                color: safeLine.startsWith('✔')
                  ? '#00ff88'
                  : safeLine.startsWith('→')
                  ? 'rgba(0,245,255,0.6)'
                  : safeLine.startsWith('$')
                  ? '#a855f7'
                  : safeLine.startsWith('  [')
                  ? 'rgba(240,224,64,0.7)'
                  : 'rgba(200,216,232,0.45)',
              }}
            >
              {safeLine || '\u00a0'}
            </motion.div>
              );
            })()
          ))}
        </AnimatePresence>

        {/* Cursor parpadeante si está corriendo */}
        {isRunning && visibleLines.length < output.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: 'rgba(0,245,255,0.6)' }}
          >
            █
          </motion.span>
        )}
      </div>
    </div>
  );
}

// ── Componente principal IDE ─────────────────────────────────
export default function IDEWindow() {
  const [activeTab, setActiveTab] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [hasRun, setHasRun] = useState<Record<number, boolean>>({});

  const currentFile = SKILL_FILES[activeTab];
  const targetCode = useMemo(
    () => currentFile.code(currentFile.skills),
    [currentFile]
  );

  const { displayed, done } = useCodeTypewriter(targetCode, true, 12);

  const handleRun = useCallback(() => {
    if (isRunning) return;
    setShowTerminal(true);
    setIsRunning(true);
    setHasRun(prev => ({ ...prev, [activeTab]: true }));
    const outputLen = TERMINAL_OUTPUTS[currentFile.filename]?.length ?? 0;
    setTimeout(() => setIsRunning(false), outputLen * 130 + 500);
  }, [isRunning, activeTab, currentFile.filename]);

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setIsRunning(false);
  };

  // Highlighted code
  const highlightedLines = useMemo(
    () => highlight(displayed, currentFile.language),
    [displayed, currentFile.language]
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0e1424',
      border: '1px solid rgba(0,245,255,0.1)',
      overflow: 'hidden',
      boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.04)',
    }}>
      {/* Barra de título */}
      <TitleBar />

      {/* Tabs */}
      <TabBar files={SKILL_FILES} activeIdx={activeTab} onChange={handleTabChange} />

      {/* Cuerpo: editor + sidebar */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Editor */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '1rem 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          lineHeight: 1.6,
          color: 'rgba(200,216,232,0.8)',
          background: '#0e1424',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {highlightedLines}

              {/* Cursor de escritura al final */}
              {!done && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{
                    display: 'inline-block',
                    width: 8, height: '1em',
                    background: currentFile.color,
                    verticalAlign: 'text-bottom',
                    marginLeft: 1,
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar de skill bars */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SkillBarsPanel file={currentFile} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Barra inferior: botón Run + info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 1rem',
        background: '#080c14',
        borderTop: '1px solid rgba(0,245,255,0.07)',
        flexShrink: 0,
      }}>
        {/* Botón Run */}
        <motion.button
          onClick={handleRun}
          data-cursor-hover
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            color: '#000',
            background: currentFile.color,
            border: 'none',
            padding: '0.35rem 1rem',
            cursor: 'none',
            opacity: isRunning ? 0.5 : 1,
            clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
            transition: 'opacity 0.2s',
          }}
        >
          ▶ RUN
        </motion.button>

        {/* Toggle terminal */}
        {hasRun[activeTab] && (
          <button
            onClick={() => setShowTerminal(v => !v)}
            data-cursor-hover
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'rgba(200,216,232,0.3)',
              background: 'transparent',
              border: '1px solid rgba(200,216,232,0.1)',
              padding: '0.3rem 0.75rem',
              cursor: 'none',
              letterSpacing: '0.1em',
              transition: 'color 0.15s',
            }}
          >
            {showTerminal ? '⌃ ocultar terminal' : '⌄ terminal'}
          </button>
        )}

        {/* Indicador de escritura */}
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(200,216,232,0.2)',
        }}>
          {done ? `${targetCode.split('\n').length} líneas · listo` : 'escribiendo...'}
        </span>

        {/* Lenguaje */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: `${currentFile.color}70`,
        }}>
          {currentFile.language}
        </span>
      </div>

      {/* Terminal */}
      <TerminalPanel
        filename={currentFile.filename}
        isRunning={isRunning}
        isVisible={showTerminal}
      />
    </div>
  );
}