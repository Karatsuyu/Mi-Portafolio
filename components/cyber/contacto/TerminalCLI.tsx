'use client';

import {
  useState, useRef, useEffect, useCallback, KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  COMMANDS, WELCOME_LINES, CONTACT,
  type TerminalLine, type LineType,
} from './ContactData';

// ── Colores por tipo de línea ────────────────────────────────
const LINE_COLORS: Record<LineType, string> = {
  default:   'rgba(200,216,232,0.6)',
  success:   '#00ff88',
  info:      'rgba(0,245,255,0.7)',
  warning:   '#f0e040',
  error:     '#ff2d6b',
  highlight: '#ffffff',
  muted:     'rgba(200,216,232,0.28)',
  prompt:    '#a855f7',
};

// ── Extrae todos los nombres de comandos (para autocomplete) ─
const ALL_CMDS = COMMANDS.flatMap(c => [c.cmd, ...(c.alias ?? [])]).sort();

// ── Encuentra un comando por nombre ─────────────────────────
function findCommand(input: string) {
  const trimmed = input.trim().split(/\s+/)[0].toLowerCase();
  return COMMANDS.find(
    c => c.cmd === trimmed || c.alias?.includes(trimmed)
  );
}

// ── Extrae el argumento de --send ────────────────────────────
function extractSendArg(input: string): string {
  const match = input.match(/--send\s+"?(.+?)"?\s*$/i) ??
                input.match(/send\s+"?(.+?)"?\s*$/i);
  return match?.[1]?.trim() ?? '';
}

// ── Una línea del output ─────────────────────────────────────
function OutputLine({ line, idx }: { line: TerminalLine & { isPrompt?: boolean; promptText?: string }; idx: number }) {
  if (line.isPrompt) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          lineHeight: 1.7,
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.25rem',
        }}
      >
        <span style={{ color: '#a855f7', userSelect: 'none' }}>visitor@cyber:~$</span>
        <span style={{ color: '#ffffff' }}>{line.promptText}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.12, delay: idx * 0.018 }}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.73rem',
        lineHeight: 1.7,
        color: LINE_COLORS[line.type ?? 'default'],
        whiteSpace: 'pre',
        minHeight: line.text === '' ? '0.5rem' : undefined,
      }}
    >
      {line.text}
    </motion.div>
  );
}

// ── Formulario de envío ──────────────────────────────────────
function SendForm({
  initialMessage,
  onSent,
  onCancel,
}: {
  initialMessage: string;
  onSent: (lines: TerminalLine[]) => void;
  onCancel: () => void;
}) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState('');

  const inputStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: '#fff',
    background: 'rgba(0,245,255,0.04)',
    border: '1px solid rgba(0,245,255,0.18)',
    padding: '0.55rem 0.8rem',
    width: '100%',
    outline: 'none',
    letterSpacing: '0.03em',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'rgba(0,245,255,0.5)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    marginBottom: '0.3rem',
    display: 'block',
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('  ✖ Todos los campos son requeridos');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('  ✖ Email inválido');
      return;
    }

    setSending(true);
    setError('');

    try {
      // Envía al endpoint Supabase que ya tienes en tu proyecto
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error('Server error');

      onSent([
        { text: '', type: 'default' },
        { text: '  ╔══════════════════════════════════════════╗', type: 'success' },
        { text: '  ║  ✔ MENSAJE ENVIADO CORRECTAMENTE         ║', type: 'success' },
        { text: '  ╠══════════════════════════════════════════╣', type: 'success' },
        { text: `  ║  De: ${name.slice(0,37).padEnd(37)}║`, type: 'default' },
        { text: `  ║  A:  ${CONTACT.email.slice(0,37).padEnd(37)}║`, type: 'default' },
        { text: `  ║  ⏱ Respuesta en: ${CONTACT.responseTime.padEnd(25)}║`, type: 'default' },
        { text: '  ╚══════════════════════════════════════════╝', type: 'success' },
        { text: '', type: 'default' },
        { text: '  ¡Gracias por escribir! Te responderé pronto.', type: 'muted' },
        { text: '', type: 'default' },
      ]);
    } catch {
      onSent([
        { text: '', type: 'default' },
        { text: '  ✖ Error al enviar. Intenta por email directamente:', type: 'error' },
        { text: `  → ${CONTACT.email}`, type: 'highlight' },
        { text: '', type: 'default' },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      style={{
        margin: '0.5rem 0 0.5rem 1rem',
        padding: '1.1rem',
        border: '1px solid rgba(0,245,255,0.14)',
        background: 'rgba(0,245,255,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        color: 'rgba(0,245,255,0.5)',
        letterSpacing: '0.12em',
        marginBottom: '0.25rem',
      }}>
        // formulario de contacto — Ctrl+Enter para enviar · Esc para cancelar
      </div>

      <div>
        <label style={labelStyle}>Nombre</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre completo"
          style={{ ...inputStyle, caretColor: 'var(--cyan)' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,245,255,0.45)')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(0,245,255,0.18)')}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
            if (e.key === 'Escape') onCancel();
          }}
        />
      </div>

      <div>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          style={{ ...inputStyle, caretColor: 'var(--cyan)' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,245,255,0.45)')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(0,245,255,0.18)')}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
            if (e.key === 'Escape') onCancel();
          }}
        />
      </div>

      <div>
        <label style={labelStyle}>Mensaje</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="¿En qué puedo ayudarte?"
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical',
            caretColor: 'var(--cyan)',
            minHeight: 72,
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,245,255,0.45)')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(0,245,255,0.18)')}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); handleSubmit(); }
            if (e.key === 'Escape') onCancel();
          }}
        />
      </div>

      {error && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: '#ff2d6b',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <motion.button
          onClick={handleSubmit}
          disabled={sending}
          data-cursor-hover
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: '#000',
            background: sending ? 'rgba(0,245,255,0.4)' : 'var(--cyan)',
            border: 'none',
            padding: '0.5rem 1.25rem',
            cursor: 'none',
            clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',
            transition: 'background 0.2s',
          }}
        >
          {sending ? '⟳ enviando...' : '▶ ENVIAR — Ctrl+Enter'}
        </motion.button>

        <button
          onClick={onCancel}
          data-cursor-hover
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.63rem',
            color: 'rgba(200,216,232,0.3)',
            background: 'transparent',
            border: '1px solid rgba(200,216,232,0.1)',
            padding: '0.5rem 0.9rem',
            cursor: 'none',
            letterSpacing: '0.08em',
            transition: 'color 0.15s',
          }}
        >
          Esc — cancelar
        </button>
      </div>
    </motion.div>
  );
}

// ── Tipo de entrada en el historial ─────────────────────────
interface HistoryEntry {
  id:          number;
  promptText?: string;       // lo que escribió el usuario (si es prompt)
  lines?:      TerminalLine[];
  isPrompt?:   boolean;
  showForm?:   boolean;
  formMessage?:string;
}

let entryId = 0;
const nextId = () => ++entryId;

// ── Terminal principal ───────────────────────────────────────
export default function TerminalCLI() {
  const [history,    setHistory]    = useState<HistoryEntry[]>([]);
  const [input,      setInput]      = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);  // historial de comandos
  const [histIdx,    setHistIdx]    = useState(-1);            // navegación ↑↓
  const [suggestion, setSuggestion] = useState('');            // autocompletado Tab
  const [showForm,   setShowForm]   = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const inputRef    = useRef<HTMLInputElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Init: mostrar bienvenida ─────────────────────────────
  useEffect(() => {
    setHistory([{ id: nextId(), lines: WELCOME_LINES }]);
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  // ── Auto-scroll al fondo ─────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, showForm]);

  // ── Autocompletado con Tab ───────────────────────────────
  const updateSuggestion = useCallback((val: string) => {
    if (!val.trim() || val.includes(' ')) { setSuggestion(''); return; }
    const match = ALL_CMDS.find(c => c.startsWith(val.toLowerCase()) && c !== val.toLowerCase());
    setSuggestion(match ? match.slice(val.length) : '');
  }, []);

  const handleInputChange = (val: string) => {
    setInput(val);
    setHistIdx(-1);
    updateSuggestion(val);
  };

  // ── Ejecuta un comando ───────────────────────────────────
  const execute = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Guarda en historial de comandos
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)]);

    // Entrada del prompt al historial de display
    const promptEntry: HistoryEntry = {
      id: nextId(),
      isPrompt: true,
      promptText: trimmed,
    };

    const cmd = findCommand(trimmed);

    if (!cmd) {
      setHistory(prev => [...prev, promptEntry, {
        id: nextId(),
        lines: [
          { text: '', type: 'default' },
          { text: `  ✖ Comando no encontrado: '${trimmed.split(' ')[0]}'`, type: 'error' },
          { text: '  → Escribe help para ver los comandos disponibles', type: 'muted' },
          { text: '', type: 'default' },
        ],
      }]);
      setInput(''); setSuggestion('');
      return;
    }

    // Comando --clear
    if (cmd.cmd === '--clear') {
      setHistory([{ id: nextId(), lines: WELCOME_LINES }]);
      setInput(''); setSuggestion(''); setShowForm(false);
      return;
    }

    // Acción de abrir URL
    if (cmd.action && cmd.action !== 'send-form') {
      const urls: Record<string, string | undefined> = {
        'open-email':    `mailto:${CONTACT.email}`,
        'open-linkedin': CONTACT.linkedin,
        'open-github':   CONTACT.github,
        'open-twitter':  CONTACT.twitter,
        'open-website':  CONTACT.website,
      };
      const url = urls[cmd.action];
      if (url) {
        // Pequeño delay para que el output aparezca primero
        setTimeout(() => window.open(url, '_blank', 'noopener'), 600);
      }

      // Copia email al portapapeles
      if (cmd.action === 'open-email') {
        navigator.clipboard.writeText(CONTACT.email).catch(() => {});
      }
    }

    // Comando --send → abre formulario
    if (cmd.action === 'send-form') {
      const msg = extractSendArg(trimmed);
      setHistory(prev => [...prev, promptEntry, {
        id: nextId(),
        lines: cmd.output(CONTACT),
      }]);
      setFormMessage(msg);
      setShowForm(true);
      setInput(''); setSuggestion('');
      return;
    }

    // Output normal
    setHistory(prev => [...prev, promptEntry, {
      id: nextId(),
      lines: cmd.output(CONTACT),
    }]);
    setInput(''); setSuggestion('');
  }, []);

  // ── Manejo de teclado ────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    // Tab → autocompletar
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        const completed = input + suggestion;
        setInput(completed);
        setSuggestion('');
      }
      return;
    }

    // Enter → ejecutar
    if (e.key === 'Enter') {
      execute(input);
      return;
    }

    // ↑ → historial anterior
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(newIdx);
      const cmd = cmdHistory[newIdx] ?? '';
      setInput(cmd);
      updateSuggestion(cmd);
      return;
    }

    // ↓ → historial siguiente
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      const cmd = newIdx === -1 ? '' : cmdHistory[newIdx] ?? '';
      setInput(cmd);
      updateSuggestion(cmd);
      return;
    }

    // Escape → cancela formulario
    if (e.key === 'Escape' && showForm) {
      setShowForm(false);
    }
  }, [suggestion, input, execute, histIdx, cmdHistory, updateSuggestion, showForm]);

  const handleFormSent = (lines: TerminalLine[]) => {
    setShowForm(false);
    setHistory(prev => [...prev, { id: nextId(), lines }]);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setHistory(prev => [...prev, {
      id: nextId(),
      lines: [
        { text: '', type: 'default' },
        { text: '  ✖ Formulario cancelado', type: 'muted' },
        { text: '', type: 'default' },
      ],
    }]);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        background: '#060a10',
        border: '1px solid rgba(0,245,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,245,255,0.04)',
      }}
    >
      {/* ── Barra de título ──────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        background: '#08090f',
        borderBottom: '1px solid rgba(0,245,255,0.07)',
        flexShrink: 0,
      }}>
        {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.63rem',
          color: 'rgba(200,216,232,0.25)',
          marginLeft: '0.75rem',
          letterSpacing: '0.05em',
        }}>
          terminal — contacto
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(0,245,255,0.3)',
          letterSpacing: '0.1em',
        }}>
          bash · UTF-8
        </span>
      </div>

      {/* ── Output scrollable ────────────────────────────── */}
      <div
        onClick={() => !showForm && inputRef.current?.focus()}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.85rem 1rem 0.5rem',
          cursor: showForm ? 'default' : 'none',
        }}
      >
        {history.map(entry => (
          <div key={entry.id}>
            {entry.isPrompt && (
              <OutputLine
                line={{ text: '', isPrompt: true, promptText: entry.promptText } as any}
                idx={0}
              />
            )}
            {entry.lines?.map((line, i) => (
              <OutputLine key={i} line={line} idx={i} />
            ))}
          </div>
        ))}

        {/* Formulario inline */}
        <AnimatePresence>
          {showForm && (
            <SendForm
              initialMessage={formMessage}
              onSent={handleFormSent}
              onCancel={handleFormCancel}
            />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Línea de input ───────────────────────────────── */}
      {!showForm && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1rem',
          borderTop: '1px solid rgba(0,245,255,0.07)',
          background: '#06090f',
          flexShrink: 0,
          position: 'relative',
        }}>
          {/* Prompt */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.73rem',
            color: '#a855f7',
            userSelect: 'none',
            flexShrink: 0,
          }}>
            visitor@cyber:~$
          </span>

          {/* Input + sugerencia */}
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.73rem',
                color: '#fff',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                caretColor: 'var(--cyan)',
                letterSpacing: '0.03em',
                position: 'relative',
                zIndex: 2,
              }}
            />
            {/* Sugerencia fantasma (Tab para completar) */}
            {suggestion && (
              <span style={{
                position: 'absolute',
                left: `${input.length * 0.442}rem`,
                top: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.73rem',
                color: 'rgba(0,245,255,0.25)',
                pointerEvents: 'none',
                zIndex: 1,
                letterSpacing: '0.03em',
              }}>
                {suggestion}
              </span>
            )}
          </div>

          {/* Hint Tab */}
          {suggestion && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'rgba(0,245,255,0.3)',
              background: 'rgba(0,245,255,0.06)',
              border: '1px solid rgba(0,245,255,0.12)',
              padding: '0.1rem 0.4rem',
              flexShrink: 0,
              letterSpacing: '0.08em',
            }}>
              Tab
            </span>
          )}
        </div>
      )}
    </div>
  );
}
