'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';
import { useSleepStore, SleepLog } from '../store/sleepStore';

// ─── Moon phase data ──────────────────────────────────────────────────────────
const MOON_ICONS: Record<string, string> = {
  'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
  'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
  'Last Quarter': '🌗', 'Waning Crescent': '🌘',
};
const getMoonIcon = (phase: string) => MOON_ICONS[phase] ?? '🌙';

// ─── Sleep depth icons / labels ───────────────────────────────────────────────
const DEPTH_META: Record<string, { icon: string; label: string; color: string }> = {
  restless:  { icon: '🌑', label: 'Restless',  color: 'text-red-400'           },
  light:     { icon: '🌒', label: 'Light',     color: 'text-amber-500'          },
  deep:      { icon: '🌕', label: 'Deep',      color: 'text-emerald-500'        },
  dreamless: { icon: '🌙', label: 'Dreamless', color: 'text-blue-400'           },
};

const ENERGY_META: Record<string, { label: string; color: string }> = {
  refreshed: { label: '✦ Refreshed', color: 'text-emerald-500 dark:text-emerald-400' },
  groggy:    { label: '◎ Groggy',    color: 'text-amber-600 dark:text-amber-400'     },
  anxious:   { label: '~ Anxious',   color: 'text-red-500 dark:text-red-400'         },
};

const DREAM_LABELS: Record<string, string> = {
  vivid: 'Vivid', anxious: 'Anxious', peaceful: 'Peaceful',
  intense: 'Intense', confusing: 'Confusing', nodreams: 'No Dreams',
};

// ─── Pattern insight generator ────────────────────────────────────────────────
function generatePattern(logs: SleepLog[]): string {
  if (logs.length < 3) return 'Log at least 3 nights to reveal your sleep pattern insights.';
  const deepCount  = logs.filter(l => l.sleepDepth === 'deep').length;
  const restCount  = logs.filter(l => l.sleepDepth === 'restless').length;
  const gibbous    = logs.filter(l => l.moonPhase === 'Waning Gibbous').length;
  const deepGibbous= logs.filter(l => l.sleepDepth === 'deep' && l.moonPhase === 'Waning Gibbous').length;
  if (deepGibbous > 0 && gibbous > 0)
    return `You sleep most deeply on Waning Gibbous nights (${deepGibbous}/${gibbous} nights). Your Vata spikes mid-week — try early dinners on Tuesdays and Wednesdays.`;
  if (deepCount > restCount)
    return `Your sleep is predominantly deep (${deepCount} nights). Strong Kapha energy supports your restoration. Maintain your evening routine.`;
  if (restCount > logs.length / 2)
    return `Restless nights are frequent (${restCount} of ${logs.length}). Vata is elevated — a consistent 10 PM bedtime and Abhyanga oil massage will help.`;
  return `Your sleep pattern is mixed. Track for 7 days to reveal dosha-aligned recommendations.`;
}

// ─── Format date ──────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─── Demo seed logs (only used if no real logs exist) ────────────────────────
const DEMO_LOGS: SleepLog[] = [
  { date: '2026-05-22', sleepDepth: 'deep',     wakingEnergy: 'refreshed', dreamThemes: ['peaceful'],          hoursSlept: 8,  moonPhase: 'Waning Gibbous'   },
  { date: '2026-05-21', sleepDepth: 'light',    wakingEnergy: 'groggy',    dreamThemes: ['vivid', 'confusing'],hoursSlept: 6,  moonPhase: 'Waning Gibbous'   },
  { date: '2026-05-20', sleepDepth: 'restless', wakingEnergy: 'anxious',   dreamThemes: ['anxious'],           hoursSlept: 5,  moonPhase: 'Full Moon'        },
  { date: '2026-05-19', sleepDepth: 'deep',     wakingEnergy: 'refreshed', dreamThemes: ['peaceful'],          hoursSlept: 8,  moonPhase: 'Waxing Gibbous'   },
  { date: '2026-05-18', sleepDepth: 'dreamless',wakingEnergy: 'groggy',    dreamThemes: ['nodreams'],          hoursSlept: 9,  moonPhase: 'Waxing Gibbous'   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SleepHistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { logs: realLogs } = useSleepStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isMounted) return null;

  const logs: SleepLog[] = realLogs.length > 0 ? realLogs.slice(0, 30) : DEMO_LOGS;
  const patternInsight = generatePattern(logs);

  return (
    <div className="relative min-h-screen w-full bg-[#F0EBE3] dark:bg-[#12100E] text-[#1C1917] dark:text-[#FAF6F0] transition-colors duration-300">
      <Header />

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-14 md:py-20 space-y-10">

        {/* ── Return link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
        >
          ← Return to Dashboard
        </Link>

        {/* ── Page header */}
        <div className="animate-fade-rise">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C27A5D] font-bold mb-4">
            SLEEP ARCHIVE
          </div>
          <h1 className="text-4xl md:text-5xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight mb-4">
            Nightly <em className="italic text-[#C27A5D]">Sleep</em> History
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            30-day restoration archive, aligned with lunar phases and your {user?.dominantDosha || 'Pitta'} Prakriti.
          </p>
        </div>

        {/* ── Pattern Insight Card */}
        <Card className="bg-[#1C1C1A] dark:bg-[#111110] !text-[#FAF6F0] border-0">
          <div className="relative z-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C27A5D]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-3">
              PATTERN INSIGHT · LAST {logs.length} NIGHTS
            </div>
            <p className="text-base text-stone-300 leading-relaxed max-w-lg">
              {patternInsight}
            </p>
          </div>
        </Card>

        {/* ── Timeline Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 items-center px-2">
          {['DATE', 'DEPTH', 'HOURS', 'DREAM', 'MOON'].map(h => (
            <div key={h} className="text-[8px] font-mono uppercase tracking-[0.25em] text-stone-400 font-semibold">
              {h}
            </div>
          ))}
        </div>

        {/* ── Log rows */}
        <div className="space-y-3">
          {logs.map((log, idx) => {
            const depth = log.sleepDepth ? DEPTH_META[log.sleepDepth] : null;
            const energy = log.wakingEnergy ? ENERGY_META[log.wakingEnergy] : null;
            const topDream = log.dreamThemes[0] ? DREAM_LABELS[log.dreamThemes[0]] : '—';
            return (
              <div
                key={log.date}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 items-center bg-white/50 dark:bg-stone-900/60 border border-stone-200/40 dark:border-stone-800/80 rounded-2xl px-5 py-4 transition-all duration-300 hover:border-[#C27A5D]/30 ${idx === 0 ? 'ring-1 ring-[#C27A5D]/20' : ''}`}
              >
                {/* Date */}
                <div className="min-w-[90px]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {formatDate(log.date)}
                  </div>
                  {idx === 0 && (
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#C27A5D]">TODAY</span>
                  )}
                </div>

                {/* Depth + Energy */}
                <div className="flex flex-col gap-0.5">
                  <div className={`text-sm font-mono font-semibold ${depth?.color ?? 'text-stone-500'}`}>
                    {depth?.icon} {depth?.label ?? '—'}
                  </div>
                  {energy && (
                    <div className={`text-[9px] font-mono uppercase tracking-wider ${energy.color}`}>
                      {energy.label}
                    </div>
                  )}
                </div>

                {/* Hours */}
                <div className="text-center">
                  <div className="text-lg font-cormorant italic font-semibold text-[#1C1917] dark:text-[#FAF6F0]">
                    {log.hoursSlept ?? '—'}
                  </div>
                  <div className="text-[8px] font-mono text-stone-400 uppercase">HRS</div>
                </div>

                {/* Dream theme */}
                <div className="min-w-[80px]">
                  <span className="px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full border bg-stone-100/80 dark:bg-stone-800/50 border-stone-200/60 dark:border-stone-700 text-stone-600 dark:text-stone-400">
                    {topDream}
                  </span>
                </div>

                {/* Moon phase */}
                <div className="text-center min-w-[48px]">
                  <div className="text-xl">{getMoonIcon(log.moonPhase)}</div>
                  <div className="text-[7px] font-mono text-stone-400 uppercase leading-tight mt-0.5 max-w-[48px] text-center">
                    {log.moonPhase.split(' ').slice(-1)[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {logs.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🌙</div>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                No sleep logs yet. Complete your morning check-in to begin tracking.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-block text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30"
              >
                GO TO DASHBOARD →
              </Link>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] font-mono text-stone-400 tracking-wider">
        <div>SLEEP ARCHIVE / {logs.length} NIGHTS</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}
