'use client';

import { useState, useEffect } from 'react';
import { useSleepStore, SleepDepth, WakingEnergy, DreamTheme, SleepLog, toLocalDateStr } from '../store/sleepStore';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SleepCheckinModalProps {
  userName: string;
  dominantDosha: string;
  moonPhase: string;
  onClose: () => void;
  onComplete: (log: SleepLog) => void;
}

// ─── Pill helper ─────────────────────────────────────────────────────────────
function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border transition-all duration-300 cursor-pointer active:scale-[0.97] ${
        active
          ? 'bg-[#C27A5D] text-white border-[#C27A5D]'
          : 'bg-white/60 dark:bg-stone-900/50 border-stone-300/60 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-[#C27A5D]/60 hover:text-[#C27A5D]'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Insight generator ───────────────────────────────────────────────────────
function generateInsight(
  depth: SleepDepth,
  energy: WakingEnergy,
  themes: DreamTheme[],
  dosha: string
): string {
  if (depth === 'restless' || energy === 'anxious' || themes.includes('anxious')) {
    return `Your Vata is elevated. Tonight's rituals will include Ashwagandha tea and a grounding Abhyanga to settle the nervous system.`;
  }
  if (depth === 'deep' && energy === 'refreshed') {
    return `Your Agni is strong this morning. Ideal conditions for focused work, movement, and your most demanding tasks.`;
  }
  if (themes.includes('intense') || energy === 'groggy') {
    return `Pitta energy is active. Keep meals cooling today — favour coconut water and coriander. Avoid heavy afternoon sun.`;
  }
  if (depth === 'dreamless' || themes.includes('nodreams')) {
    return `A Kapha night — deep and still. Move your body this morning to activate your metabolism and lift natural sluggishness.`;
  }
  if (themes.includes('vivid')) {
    return `${dosha} mind was active last night. Grounding practices — bare feet on earth, warm oil, slow breath — will stabilise your day.`;
  }
  return `Your sleep pattern is within balance. Continue your ${dosha}-aligned evening routine for consistent restoration.`;
}

// ─── Moon phase icon ─────────────────────────────────────────────────────────
const MOON_ICONS: Record<string, string> = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘',
};
const getMoonIcon = (phase: string) => MOON_ICONS[phase] ?? '🌙';

// ─── Component ────────────────────────────────────────────────────────────────
export function SleepCheckinModal({
  userName,
  dominantDosha,
  moonPhase,
  onClose,
  onComplete,
}: SleepCheckinModalProps) {
  const { addLog } = useSleepStore();

  // Form state
  const [sleepDepth, setSleepDepth] = useState<SleepDepth>(null);
  const [wakingEnergy, setWakingEnergy] = useState<WakingEnergy>(null);
  const [dreamThemes, setDreamThemes] = useState<DreamTheme[]>([]);
  const [hoursSlept, setHoursSlept] = useState<number | null>(null);

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [insight, setInsight] = useState('');
  const [autoCloseTimer, setAutoCloseTimer] = useState(3);

  // Auto-close timer after submission
  useEffect(() => {
    if (!submitted) return;
    const iv = setInterval(() => {
      setAutoCloseTimer((t) => {
        if (t <= 1) { clearInterval(iv); onClose(); }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [submitted, onClose]);

  const toggleDreamTheme = (theme: DreamTheme) => {
    setDreamThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleSubmit = () => {
    const log: SleepLog = {
      date: toLocalDateStr(),
      sleepDepth,
      wakingEnergy,
      dreamThemes,
      hoursSlept,
      moonPhase,
    };
    addLog(log);
    setInsight(generateInsight(sleepDepth, wakingEnergy, dreamThemes, dominantDosha));
    setSubmitted(true);
    onComplete(log);
  };

  const isReady = sleepDepth || wakingEnergy || dreamThemes.length > 0 || hoursSlept;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={submitted ? onClose : undefined}
    >
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-[var(--ojas-dark-text)]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#F0EBE3] dark:bg-[var(--ojas-dark-text)] rounded-[32px] shadow-2xl border border-stone-200/40 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C27A5D]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-8 md:p-10">

          {/* ── Dismiss button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors text-lg cursor-pointer"
            aria-label="Close check-in"
          >
            ×
          </button>

          {submitted ? (
            /* ── Post-submission confirmation ─────────────────────── */
            <div className="text-center py-4">
              <div className="text-4xl mb-4">{getMoonIcon(moonPhase)}</div>
              <h2 className="text-3xl md:text-4xl font-instrument-serif italic font-normal text-[var(--ojas-dark-text)] dark:text-[var(--ojas-light-surface)] mb-1">
                Logged.
              </h2>
              <p className="text-xl font-serif italic text-stone-500 dark:text-stone-400 mb-8">
                Rest acknowledged.
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6 max-w-sm mx-auto">
                {insight}
              </p>
              <div className="mb-8 px-4 py-3 bg-[var(--ojas-light-surface)] dark:bg-stone-900/60 border border-amber-500/20 rounded-2xl text-left max-w-sm mx-auto flex items-start gap-2.5">
                <span className="text-[14px] text-[#C27A5D]">☽</span>
                <div className="text-[11px] font-mono leading-normal text-stone-500 dark:text-stone-400">
                  <span className="font-bold text-stone-700 dark:text-stone-300 block mb-0.5">COSMIC INFLUENCE</span>
                  ☽ Waning Gibbous + Mercury Rx may explain the scattered dream themes logged this week
                </div>
              </div>
              <a
                href="/sleep"
                className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                VIEW SLEEP HISTORY →
              </a>
              <p className="text-[9px] font-mono text-stone-400 mt-6 uppercase tracking-wider">
                Closing in {autoCloseTimer}s · Tap anywhere to dismiss
              </p>
            </div>
          ) : (
            /* ── Multi-step form ───────────────────────────────────── */
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{getMoonIcon(moonPhase)}</span>
                <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#C27A5D] font-bold">
                  MORNING RITUAL · SLEEP ARCHIVE
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-instrument-serif font-normal text-[var(--ojas-dark-text)] dark:text-[var(--ojas-light-surface)] leading-tight mb-2 mt-3">
                Good morning, <em className="italic text-[#C27A5D]">{userName}</em>.<br />
                How did you sleep?
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
                A 60-second log to align your day with last night&rsquo;s restoration.
              </p>

              {/* ── Step 1: Sleep Depth */}
              <div className="mb-7">
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold mb-3">
                  SLEEP DEPTH
                </div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: 'restless', label: '🌑 Restless' },
                    { id: 'light',    label: '🌒 Light'    },
                    { id: 'deep',     label: '🌕 Deep'     },
                    { id: 'dreamless',label: '🌙 Dreamless'},
                  ] as { id: SleepDepth; label: string }[]).map((o) => (
                    <Pill key={o.id!} active={sleepDepth === o.id} onClick={() => setSleepDepth(o.id)}>
                      {o.label}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* ── Step 2: Waking Energy */}
              <div className="mb-7">
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold mb-3">
                  WAKING ENERGY
                </div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: 'refreshed', label: '✦ Refreshed & Clear'   },
                    { id: 'groggy',    label: '◎ Groggy & Heavy'       },
                    { id: 'anxious',   label: '~ Anxious & Unsettled'  },
                  ] as { id: WakingEnergy; label: string }[]).map((o) => (
                    <Pill key={o.id!} active={wakingEnergy === o.id} onClick={() => setWakingEnergy(o.id)}>
                      {o.label}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* ── Step 3: Dream Themes (multi-select) */}
              <div className="mb-7">
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold mb-1">
                  DREAM THEMES
                </div>
                <div className="text-[9px] font-mono text-stone-400 mb-3">SELECT ALL THAT FELT TRUE</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {([
                    { id: 'vivid',     label: 'Vivid & Story-like'       },
                    { id: 'anxious',   label: 'Anxious or Chasing'        },
                    { id: 'peaceful',  label: 'Peaceful & Still'          },
                    { id: 'intense',   label: 'Intense & Heated'          },
                    { id: 'confusing', label: 'Confusing & Scattered'     },
                    { id: 'nodreams',  label: 'No Dreams Recalled'        },
                  ] as { id: DreamTheme; label: string }[]).map((o) => (
                    <Pill key={o.id} active={dreamThemes.includes(o.id)} onClick={() => toggleDreamTheme(o.id)}>
                      {o.label}
                    </Pill>
                  ))}
                </div>
                <p className="text-[9px] text-stone-400 font-mono leading-relaxed">
                  Vata types often dream vividly. Pitta types dream intensely. Kapha types sleep deep and dreamless.
                </p>
              </div>

              {/* ── Step 4: Hours Slept */}
              <div className="mb-8">
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold mb-3">
                  HOURS SLEPT
                </div>
                <div className="flex flex-wrap gap-2">
                  {[4, 5, 6, 7, 8, 9, 10].map((h) => (
                    <Pill key={h} active={hoursSlept === h} onClick={() => setHoursSlept(h)}>
                      {h}
                    </Pill>
                  ))}
                </div>
              </div>

              {/* Affirmation */}
              <div className="border-l border-[#C27A5D]/30 pl-4 py-1 mb-8">
                <p className="font-serif italic text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
                  &ldquo;Sleep is the first medicine. Honour the restoration.&rdquo;
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleSubmit}
                disabled={!isReady}
                className={`w-full py-4 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.25em] transition-all duration-300 active:scale-[0.98] ${
                  isReady
                    ? 'bg-[var(--ojas-dark-text)] text-[var(--ojas-cream-bg)] hover:bg-[#C27A5D] cursor-pointer'
                    : 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'
                }`}
              >
                COMPLETE MORNING LOG
              </button>
              <p className="text-center text-[9px] text-stone-400 font-mono mt-3">
                Takes less than 60 seconds · Personalises your daily rituals
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
