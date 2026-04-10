'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  COMMITS,
  BRANCH_COLORS,
  COMMIT_ICONS,
  ACTIVE_BRANCHES,
  type GitCommit,
  type BranchName,
} from './FormacionData';

// ── Layout de branches ────────────────────────────────────────
// Cada branch tiene su columna X en el SVG
const BRANCH_X: Record<BranchName, number> = {
  main:              40,
  cursos:            90,
  certificaciones:   140,
  autodidacta:       190,
};

const NODE_RADIUS  = 8;
const ROW_HEIGHT   = 88;
const SVG_WIDTH    = 260;
const PADDING_TOP  = 24;

// ── Calcula la altura total del SVG ──────────────────────────
const SVG_HEIGHT = PADDING_TOP + COMMITS.length * ROW_HEIGHT + 40;

// ── Posición Y de cada commit ────────────────────────────────
const commitY = (i: number) => PADDING_TOP + i * ROW_HEIGHT + NODE_RADIUS;

// ── Línea principal (main) ───────────────────────────────────
function MainLine({ animated }: { animated: boolean }) {
  const totalLen = SVG_HEIGHT - PADDING_TOP - 20;

  return (
    <motion.line
      x1={BRANCH_X.main} y1={PADDING_TOP}
      x2={BRANCH_X.main} y2={SVG_HEIGHT - 20}
      stroke={BRANCH_COLORS.main}
      strokeWidth={1.5}
      strokeOpacity={0.25}
      initial={{ pathLength: 0 }}
      animate={animated ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    />
  );
}

// ── Líneas de branch secundarias ────────────────────────────
function BranchLines({ animated }: { animated: boolean }) {
  // Para cada branch secundario, dibuja su línea vertical
  // desde el primer commit hasta el último de esa rama
  const branches = (['cursos', 'certificaciones', 'autodidacta'] as BranchName[]);

  return (
    <>
      {branches.map(branch => {
        const branchCommits = COMMITS
          .map((c, i) => ({ c, i }))
          .filter(({ c }) => c.branch === branch);

        if (branchCommits.length === 0) return null;

        const firstIdx = branchCommits[0].i;
        const lastIdx  = branchCommits[branchCommits.length - 1].i;
        const x        = BRANCH_X[branch];
        const y1       = commitY(firstIdx);
        const y2       = commitY(lastIdx);
        const color    = BRANCH_COLORS[branch];

        return (
          <g key={branch}>
            {/* Línea fork desde main */}
            <motion.path
              d={`M ${BRANCH_X.main} ${commitY(firstIdx - 1 >= 0 ? firstIdx - 1 : firstIdx)}
                  C ${BRANCH_X.main} ${commitY(firstIdx)},
                    ${x} ${commitY(firstIdx) - 20},
                    ${x} ${y1}`}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.35}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={animated ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            />
            {/* Línea vertical de la rama */}
            <motion.line
              x1={x} y1={y1}
              x2={x} y2={y2}
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={animated ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
            />
          </g>
        );
      })}
    </>
  );
}

// ── Nodo de commit ────────────────────────────────────────────
function CommitNode({
  commit,
  index,
  animated,
  isSelected,
  onSelect,
}: {
  commit: GitCommit;
  index: number;
  animated: boolean;
  isSelected: boolean;
  onSelect: (c: GitCommit) => void;
}) {
  const x     = BRANCH_X[commit.branch];
  const y     = commitY(index);
  const color = BRANCH_COLORS[commit.branch];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={animated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{
        delay: 0.15 + index * 0.07,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect(commit)}
    >
      {/* Línea horizontal desde el branch al texto */}
      <line
        x1={x + NODE_RADIUS}
        y1={y}
        x2={SVG_WIDTH - 10}
        y2={y}
        stroke={color}
        strokeWidth={0.5}
        strokeOpacity={0.12}
        strokeDasharray="3 3"
      />

      {/* Glow externo (cuando seleccionado) */}
      {isSelected && (
        <circle
          cx={x} cy={y}
          r={NODE_RADIUS + 5}
          fill={color}
          fillOpacity={0.15}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.4}
        />
      )}

      {/* Círculo principal */}
      <circle
        cx={x} cy={y}
        r={commit.isMerge ? NODE_RADIUS + 2 : NODE_RADIUS}
        fill={isSelected ? color : '#0e1424'}
        stroke={color}
        strokeWidth={commit.isMerge ? 2 : 1.5}
        strokeOpacity={0.9}
      />

      {/* Ícono interno (para milestones/merges) */}
      {commit.isMerge && (
        <text
          x={x} y={y + 4}
          textAnchor="middle"
          fontSize={9}
          fill={isSelected ? '#000' : color}
          fontFamily="monospace"
        >
          ⬡
        </text>
      )}

      {/* Punto central (commits normales) */}
      {!commit.isMerge && (
        <circle
          cx={x} cy={y}
          r={3}
          fill={color}
          fillOpacity={isSelected ? 1 : 0.6}
        />
      )}
    </motion.g>
  );
}

// ── Label de commit (al costado del SVG) ────────────────────
function CommitLabel({
  commit,
  index,
  animated,
  isSelected,
  onSelect,
}: {
  commit: GitCommit;
  index: number;
  animated: boolean;
  isSelected: boolean;
  onSelect: (c: GitCommit) => void;
}) {
  const y     = commitY(index);
  const color = BRANCH_COLORS[commit.branch];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={animated ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{
        delay: 0.2 + index * 0.07,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onSelect(commit)}
      data-cursor-hover
      style={{
        position: 'absolute',
        top: y - 12,
        left: SVG_WIDTH + 16,
        right: 0,
        padding: '0.5rem 0.75rem',
        cursor: 'none',
        borderLeft: `2px solid ${isSelected ? color : color + '25'}`,
        background: isSelected ? `${color}08` : 'transparent',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {/* Hash + fecha */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.2rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: color,
          opacity: 0.7,
          letterSpacing: '0.06em',
        }}>
          {commit.id}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.56rem',
          color: 'rgba(200,216,232,0.2)',
        }}>
          {commit.date}
        </span>
        {commit.duration && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.54rem',
            color: 'rgba(200,216,232,0.15)',
          }}>
            · {commit.duration}
          </span>
        )}
      </div>

      {/* Título */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: isSelected ? '#fff' : 'rgba(200,216,232,0.75)',
        letterSpacing: '0.02em',
        marginBottom: '0.15rem',
        lineHeight: 1.2,
        transition: 'color 0.2s',
      }}>
        {commit.isMerge && (
          <span style={{ color, marginRight: '0.4rem', fontSize: '0.65rem' }}>
            ⬡ MERGE
          </span>
        )}
        {commit.title}
      </div>

      {/* Institución */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        color: 'rgba(200,216,232,0.3)',
      }}>
        {commit.institution}
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem',
        marginTop: '0.35rem',
      }}>
        {commit.tags.slice(0, 4).map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.54rem',
            color: `${color}80`,
            background: `${color}0a`,
            border: `1px solid ${color}18`,
            padding: '0.1rem 0.4rem',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Panel de detalle expandido ───────────────────────────────
function CommitDetail({ commit, onClose }: { commit: GitCommit; onClose: () => void }) {
  const color = BRANCH_COLORS[commit.branch];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'sticky',
        top: '5.5rem',
        background: 'rgba(8,12,20,0.95)',
        border: `1px solid ${color}30`,
        padding: '1.5rem',
        backdropFilter: 'blur(20px)',
        marginBottom: '1rem',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: color,
            letterSpacing: '0.12em',
            marginBottom: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ opacity: 0.5 }}>commit</span>
            <span>{commit.id}a8f2e1d</span>
            <span style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              padding: '0.1rem 0.5rem',
              opacity: 0.8,
            }}>
              {commit.branch}
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '0.2rem',
          }}>
            {COMMIT_ICONS[commit.type]} {commit.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: color,
            opacity: 0.6,
          }}>
            {commit.institution}
          </p>
        </div>

        <button
          onClick={onClose}
          data-cursor-hover
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(200,216,232,0.3)',
            background: 'transparent',
            border: '1px solid rgba(200,216,232,0.1)',
            padding: '0.3rem 0.7rem',
            cursor: 'none',
            flexShrink: 0,
            marginLeft: '1rem',
          }}
        >
          ✕
        </button>
      </div>

      {/* Línea divisora */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, ${color}40, transparent)`,
        marginBottom: '1rem',
      }} />

      {/* Descripción */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'rgba(200,216,232,0.6)',
        lineHeight: 1.8,
        marginBottom: '1rem',
      }}>
        {commit.description}
      </p>

      {/* Merge message */}
      {commit.mergeMessage && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: color,
          background: `${color}08`,
          border: `1px solid ${color}20`,
          padding: '0.6rem 0.8rem',
          marginBottom: '1rem',
          opacity: 0.8,
        }}>
          $ git log --oneline<br />
          <span style={{ color: '#fff', opacity: 0.7 }}>{commit.id}</span>{' '}
          {commit.mergeMessage}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {commit.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: color,
            background: `${color}10`,
            border: `1px solid ${color}25`,
            padding: '0.2rem 0.6rem',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(200,216,232,0.06)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
      }}>
        <span style={{ color: 'rgba(200,216,232,0.25)' }}>
          📅 {commit.date}
        </span>
        {commit.duration && (
          <span style={{ color: 'rgba(200,216,232,0.25)' }}>
            ⏱ {commit.duration}
          </span>
        )}
        {commit.url && (
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            style={{
              color: color,
              opacity: 0.6,
              textDecoration: 'none',
              marginLeft: 'auto',
              transition: 'opacity 0.2s',
            }}
          >
            ↗ ver institución
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Leyenda de branches ──────────────────────────────────────
function BranchLegend() {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.5rem',
      padding: '0.75rem 1rem',
      background: 'rgba(8,12,20,0.6)',
      border: '1px solid rgba(0,245,255,0.07)',
    }}>
      {ACTIVE_BRANCHES.map(b => (
        <div key={b.name} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'rgba(200,216,232,0.4)',
        }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: BRANCH_COLORS[b.name],
            boxShadow: `0 0 6px ${BRANCH_COLORS[b.name]}80`,
            flexShrink: 0,
          }} />
          <span style={{ color: BRANCH_COLORS[b.name], marginRight: 2 }}>
            {b.name}
          </span>
          <span style={{ opacity: 0.5 }}>— {b.label.split('—')[1]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────
export default function GitTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState<GitCommit | null>(null);

  const handleSelect = useCallback((c: GitCommit) => {
    setSelected(prev => prev?.id === c.id ? null : c);
  }, []);

  return (
    <div ref={containerRef}>
      <BranchLegend />

      {/* Detalle sticky */}
      <AnimatePresence>
        {selected && (
          <CommitDetail
            commit={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* Encabezado tipo git log */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'rgba(200,216,232,0.2)',
        marginBottom: '0.75rem',
        paddingLeft: SVG_WIDTH + 16,
        display: 'flex',
        gap: '2rem',
        letterSpacing: '0.08em',
      }}>
        <span>HASH</span>
        <span style={{ marginLeft: '1rem' }}>FECHA</span>
        <span style={{ marginLeft: '3.5rem' }}>TÍTULO</span>
      </div>

      {/* Área principal: SVG + labels */}
      <div style={{
        position: 'relative',
        minHeight: SVG_HEIGHT,
      }}>

        {/* SVG de las líneas y nodos */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: SVG_WIDTH }}>
          <svg
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            style={{ overflow: 'visible' }}
          >
            {/* Línea main */}
            <MainLine animated={isInView} />

            {/* Líneas de branches */}
            <BranchLines animated={isInView} />

            {/* Nodos de commits */}
            {COMMITS.map((commit, i) => (
              <CommitNode
                key={commit.id}
                commit={commit}
                index={i}
                animated={isInView}
                isSelected={selected?.id === commit.id}
                onSelect={handleSelect}
              />
            ))}
          </svg>
        </div>

        {/* Labels de commits (absolutos al lado del SVG) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}>
          {COMMITS.map((commit, i) => (
            <div key={commit.id} style={{ pointerEvents: 'auto' }}>
              <CommitLabel
                commit={commit}
                index={i}
                animated={isInView}
                isSelected={selected?.id === commit.id}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer: HEAD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: COMMITS.length * 0.07 + 0.5, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'rgba(0,245,255,0.35)',
          paddingLeft: SVG_WIDTH + 16,
          marginTop: '0.5rem',
          letterSpacing: '0.08em',
        }}
      >
        <span style={{ color: 'rgba(200,216,232,0.2)' }}>HEAD</span>
        {' → '}
        <span style={{ color: 'var(--cyan)' }}>main</span>
        {' · presente'}
      </motion.div>
    </div>
  );
}
