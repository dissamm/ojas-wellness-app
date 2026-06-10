'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';
import { getJyotishProfile } from '../utils/jyotishData';

interface TransitRitual {
  id: string;
  time: string;
  duration: number;
  activity: string;
  description: string;
  dosha: string[];
  planetaryTag: string;
}

export default function JyotishPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const [addedTransitIds, setAddedTransitIds] = useState<Record<string, boolean>>({});
  const [healthInsightExpanded, setHealthInsightExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ojas_custom_transit_rituals');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const activeMap: Record<string, boolean> = {};
          parsed.forEach((r: TransitRitual) => {
            activeMap[r.id] = true;
          });
          setAddedTransitIds(activeMap);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isMounted]);

  if (!isMounted) return null;

  const jyotish = getJyotishProfile(user?.dateOfBirth);

  const transitsList: TransitRitual[] = [
    {
      id: 'transit-mercury',
      time: '08:00 AM',
      duration: 15,
      activity: '☿ Mercury Rx Alignment',
      description: 'Double your Nadi Shodhana practice. Soothes scattered thinking, communication errors, and tech issues.',
      dosha: ['Vata'],
      planetaryTag: '☿ Mercury Rx · Grounding',
    },
    {
      id: 'transit-venus',
      time: '09:30 AM',
      duration: 20,
      activity: '♀ Venus Sensory Ritual',
      description: 'Sensory pleasures restore balance. Favour music, good food, and beauty in your rituals.',
      dosha: ['Pitta'],
      planetaryTag: '♀ Venus in Taurus · Soothing',
    },
    {
      id: 'transit-mars',
      time: '05:00 PM',
      duration: 15,
      activity: '♂ Mars Cooling Practice',
      description: 'Competitive energy peaks. Avoid overexertion. Sheetali Pranayama recommended.',
      dosha: ['Pitta'],
      planetaryTag: '♂ Mars in Leo · Pitta Cooling',
    },
    {
      id: 'transit-jupiter',
      time: '11:00 AM',
      duration: 30,
      activity: '♃ Jupiter Learning Ritual',
      description: 'Philosophical growth period. Excellent for learning and new wellness practices.',
      dosha: ['Vata'],
      planetaryTag: '♃ Jupiter in Gemini · Vata Expansion',
    },
  ];

  const handleAddRitual = (transit: TransitRitual) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('ojas_custom_transit_rituals');
    let list = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    if (!list.some((r: TransitRitual) => r.id === transit.id)) {
      list.push({
        id: transit.id,
        time: transit.time,
        duration: transit.duration,
        activity: transit.activity,
        description: transit.description,
        dosha: transit.dosha,
        planetaryTag: transit.planetaryTag,
      });
      localStorage.setItem('ojas_custom_transit_rituals', JSON.stringify(list));
      setAddedTransitIds((prev) => ({ ...prev, [transit.id]: true }));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-14 md:py-20 space-y-10">
        {/* Return Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
        >
          ← Return to Dashboard
        </Link>

        {/* Page Header */}
        <div className="animate-fade-rise">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary font-bold mb-4">
            VEDIC ASTROLOGY · JYOTISH
          </div>
          <h1 className="text-4xl md:text-5xl font-normal font-quote text-primary dark:text-on-primary leading-tight mb-4">
            Your <em className="italic text-secondary">Jyotish</em> Blueprint
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
            Your birth chart, planetary transits, and numerology woven into your daily Ayurvedic practice.
          </p>
        </div>

        {/* Section 1: Birth Chart Overview Card */}
        <div className="bg-primary dark:bg-[#111110] rounded-[32px] p-8 text-on-primary shadow-xl relative overflow-hidden transition-all duration-500 border border-stone-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-secondary font-bold mb-5">
            JANMA KUNDALI · BIRTH CHART
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-y border-white/5 py-6">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block mb-1">Sun Sign</span>
              <span className="text-lg font-serif italic text-white block">Mithuna ({jyotish.sunSign.english})</span>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block mb-1">Moon Sign</span>
              <span className="text-lg font-serif italic text-white block">Vrishchika ({jyotish.moonSign.english})</span>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block mb-1">Ascendant (Lagna)</span>
              <span className="text-lg font-serif italic text-white block">Karka ({jyotish.lagna.english})</span>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block mb-1">Nakshatra</span>
              <span className="text-lg font-serif italic text-white block">{jyotish.nakshatra}</span>
            </div>
          </div>

          <p className="text-stone-300 text-sm font-serif italic leading-relaxed mb-6">
            &ldquo;Your {jyotish.lagna.english} ascendant brings emotional depth to your {jyotish.sunSign.english} restlessness. The {jyotish.moonSign.english} moon gifts you transformative intuition.&rdquo;
          </p>

          <button
            onClick={() => setHealthInsightExpanded(!healthInsightExpanded)}
            className="text-[10px] font-mono uppercase tracking-wider text-secondary hover:text-white transition-colors cursor-pointer border-b border-secondary/30"
          >
            {healthInsightExpanded ? 'HIDE INSIGHTS ↑' : 'WHAT DOES THIS MEAN FOR MY HEALTH? →'}
          </button>

          {healthInsightExpanded && (
            <div className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/5 text-stone-300 text-xs leading-relaxed font-inter space-y-3 animate-fade-rise">
              <p>
                Having a <strong>Cancer Ascendant (Karka)</strong> rules your physical constitution via the Moon, increasing Kapha elements and emotional sensitivity. Your digestion is directly tied to your emotional environment.
              </p>
              <p>
                The <strong>Gemini Sun (Mithuna)</strong> introduces restless air and ether elements (Vata) into your cellular intelligence. This can manifest as an overactive mind, nervous digestion, or irregular sleep cycles, particularly during transit shifts.
              </p>
              <p>
                Your <strong>Scorpio Moon (Vrishchika)</strong> demands deep, intuitive processing. Unexpressed emotions directly affect your Pitta and digestion. Grounding practices (like Nadi Shodhana) and warm, nourishing spices are vital to bridge your restless mental state and deep water instincts.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Active Transits Card */}
        <Card className="relative overflow-hidden">
          <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-secondary font-bold mb-6">
            ACTIVE TRANSITS · THIS MONTH
          </div>

          <div className="space-y-6">
            {/* Transit 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200/50 dark:border-stone-800 pb-5 gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg">☿</span>
                  <span className="font-serif italic text-lg text-stone-900 dark:text-white font-medium">Mercury Retrograde</span>
                  <span className="text-[9px] font-mono text-stone-400">Until June 18</span>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full">
                    ⚠ VATA AGGRAVATING
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-inter">
                  <strong>Implication:</strong> Scattered thinking, communication errors, tech issues. Double your Nadi Shodhana practice.
                </p>
              </div>
              <button
                onClick={() => handleAddRitual(transitsList[0])}
                className={`px-4 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  addedTransitIds['transit-mercury']
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 active:scale-95'
                }`}
              >
                {addedTransitIds['transit-mercury'] ? '✓ ADDED TO RITUALS' : '+ ADD TO RITUALS'}
              </button>
            </div>

            {/* Transit 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200/50 dark:border-stone-800 pb-5 gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg">♀</span>
                  <span className="font-serif italic text-lg text-stone-900 dark:text-white font-medium">Venus in Taurus</span>
                  <span className="text-[9px] font-mono text-stone-400">Until July 4</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-605 dark:text-emerald-400 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full text-emerald-600">
                    ✦ PITTA SOOTHING
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-inter">
                  <strong>Implication:</strong> Sensory pleasures restore balance. Favour music, good food, and beauty in your rituals.
                </p>
              </div>
              <button
                onClick={() => handleAddRitual(transitsList[1])}
                className={`px-4 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  addedTransitIds['transit-venus']
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 active:scale-95'
                }`}
              >
                {addedTransitIds['transit-venus'] ? '✓ ADDED TO RITUALS' : '+ ADD TO RITUALS'}
              </button>
            </div>

            {/* Transit 3 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200/50 dark:border-stone-800 pb-5 gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg">♂</span>
                  <span className="font-serif italic text-lg text-stone-900 dark:text-white font-medium">Mars in Leo</span>
                  <span className="text-[9px] font-mono text-stone-400">Until July 20</span>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full">
                    🔥 PITTA ELEVATING
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-inter">
                  <strong>Implication:</strong> Competitive energy peaks. Avoid overexertion. Sheetali Pranayama recommended.
                </p>
              </div>
              <button
                onClick={() => handleAddRitual(transitsList[2])}
                className={`px-4 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  addedTransitIds['transit-mars']
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 active:scale-95'
                }`}
              >
                {addedTransitIds['transit-mars'] ? '✓ ADDED TO RITUALS' : '+ ADD TO RITUALS'}
              </button>
            </div>

            {/* Transit 4 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg">♃</span>
                  <span className="font-serif italic text-lg text-stone-900 dark:text-white font-medium">Jupiter in Gemini</span>
                  <span className="text-[9px] font-mono text-stone-400">Full year</span>
                  <span className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-650 dark:text-stone-400 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full">
                    ✦ VATA EXPANDING
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-inter">
                  <strong>Implication:</strong> Philosophical growth period. Excellent for learning and new wellness practices.
                </p>
              </div>
              <button
                onClick={() => handleAddRitual(transitsList[3])}
                className={`px-4 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  addedTransitIds['transit-jupiter']
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 active:scale-95'
                }`}
              >
                {addedTransitIds['transit-jupiter'] ? '✓ ADDED TO RITUALS' : '+ ADD TO RITUALS'}
              </button>
            </div>
          </div>
        </Card>

        {/* Section 3: Numerology Card */}
        <Card>
          <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-secondary font-bold mb-6">
            ANKA JYOTISH · NUMEROLOGY
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start mb-8">
            <div className="md:col-span-8 space-y-6">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  LIFE PATH NUMBER
                </span>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-serif font-semibold text-secondary">
                    {jyotish.lifePathNumber}
                  </span>
                  <span className="text-base font-serif italic text-stone-800 dark:text-white font-medium">
                    {jyotish.lifePathTagline}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-inter mt-2">
                  {jyotish.lifePathDescription} Introspection, spiritual seeking, and truth-finding define your natural rhythms.
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  PERSONAL YEAR NUMBER (2026)
                </span>
                <h4 className="text-lg font-serif italic text-stone-900 dark:text-white font-normal">
                  Year {jyotish.personalYearNumber}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-inter mt-1">
                  {jyotish.personalYearInsight}
                </p>
              </div>
            </div>

            <div className="md:col-span-4 p-5 bg-[var(--ojas-light-surface)] dark:bg-stone-950/20 border border-stone-200/50 dark:border-stone-800/80 rounded-2xl space-y-1">
              <span className="text-[8px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                POWER DAY THIS MONTH
              </span>
              <div className="text-3xl font-serif font-semibold text-stone-900 dark:text-white">
                June {jyotish.powerDay}
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed font-inter">
                Your numerological peak day for important decisions, new beginnings, and deep therapeutic practices.
              </p>
            </div>
          </div>

          <div className="border-t border-stone-200/50 dark:border-stone-800 pt-5">
            <span className="text-[8px] font-mono uppercase tracking-wider text-stone-400 block mb-3">
              LIFE PATH MATRIX
            </span>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
              {[
                { n: 1, label: 'Leader' },
                { n: 2, label: 'Peacemaker' },
                { n: 3, label: 'Creator' },
                { n: 4, label: 'Builder' },
                { n: 5, label: 'Explorer' },
                { n: 6, label: 'Nurturer' },
                { n: 7, label: 'Seeker' },
                { n: 8, label: 'Achiever' },
                { n: 9, label: 'Humanitarian' },
              ].map((item) => (
                <div
                  key={item.n}
                  className={`p-2.5 rounded-xl border text-center font-mono ${
                    item.n === jyotish.lifePathNumber
                      ? 'bg-secondary/10 border-secondary text-secondary font-bold'
                      : 'bg-white/40 dark:bg-stone-900/40 border-stone-200/40 dark:border-stone-800 text-stone-400'
                  }`}
                >
                  <div className="text-xs">{item.n}</div>
                  <div className="text-[7px] uppercase tracking-wider mt-0.5 truncate">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Section 4: Monthly Wellness Forecast Card */}
        <Card>
          <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-secondary font-bold mb-6">
            COSMIC WELLNESS FORECAST · JUNE 2026
          </div>

          <div className="space-y-4">
            {/* Week 1 */}
            <div className="p-4 bg-white/50 dark:bg-stone-900/30 border border-stone-200/30 dark:border-stone-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-stone-450 dark:text-stone-400">
                  WEEK 1 (JUN 1–7)
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-inter leading-relaxed">
                  Grounding week. Mercury shadow lifts. Ideal for beginning new rituals.
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full flex-shrink-0">
                VATA WATCH
              </span>
            </div>

            {/* Week 2 */}
            <div className="p-4 bg-white/50 dark:bg-stone-900/30 border border-stone-200/30 dark:border-stone-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-stone-450 dark:text-stone-400">
                  WEEK 2 (JUN 8–14)
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-inter leading-relaxed">
                  Creative surge. Venus trine favours artistic expression and music therapy.
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full flex-shrink-0">
                PITTA ELEVATED
              </span>
            </div>

            {/* Week 3 */}
            <div className="p-4 bg-white/50 dark:bg-stone-900/30 border border-stone-200/30 dark:border-stone-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-stone-450 dark:text-stone-400">
                  WEEK 3 (JUN 15–21)
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-inter leading-relaxed">
                  Mercury stations direct Jun 18. Avoid major decisions until Jun 20.
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full flex-shrink-0">
                VATA WATCH
              </span>
            </div>

            {/* Week 4 */}
            <div className="p-4 bg-white/50 dark:bg-stone-900/30 border border-stone-200/30 dark:border-stone-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-stone-450 dark:text-stone-400">
                  WEEK 4 (JUN 22–30)
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-inter leading-relaxed">
                  Mars energy peaks. Channel into Yoga and physical practice, not conflict.
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-450 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full flex-shrink-0">
                KAPHA SLUGGISH
              </span>
            </div>
          </div>
        </Card>

        {/* Section 5: Dosha-Planet Connection Matrix Card */}
        <Card>
          <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-secondary font-bold mb-6">
            GRAHA-DOSHA MATRIX
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-inter leading-relaxed">
              <thead>
                <tr className="border-b border-stone-200/50 dark:border-stone-800 text-stone-400 font-mono text-[9px] tracking-wider uppercase">
                  <th className="pb-3">PLANET (GRAHA)</th>
                  <th className="pb-3">GOVERNED DOSHA</th>
                  <th className="pb-3">ELEMENTAL RULERSHIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/30 dark:divide-stone-800">
                <tr className="hover:bg-secondary/5 transition-colors">
                  <td className="py-4 font-medium flex items-center gap-2">
                    <span>☿</span> Mercury + <span>♀</span> Venus
                  </td>
                  <td className="py-4 text-secondary font-mono uppercase tracking-wider font-bold">Vata</td>
                  <td className="py-4 text-stone-500">Air + Ether</td>
                </tr>
                <tr className="hover:bg-secondary/5 transition-colors">
                  <td className="py-4 font-medium flex items-center gap-2">
                    <span>☉</span> Sun + <span>♂</span> Mars
                  </td>
                  <td className="py-4 text-secondary font-mono uppercase tracking-wider font-bold">Pitta</td>
                  <td className="py-4 text-stone-500">Fire</td>
                </tr>
                <tr className="hover:bg-secondary/5 transition-colors">
                  <td className="py-4 font-medium flex items-center gap-2">
                    <span>☽</span> Moon + <span>♃</span> Jupiter
                  </td>
                  <td className="py-4 text-secondary font-mono uppercase tracking-wider font-bold">Kapha</td>
                  <td className="py-4 text-stone-500">Water + Earth</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-[var(--ojas-light-surface)] dark:bg-stone-950/20 border border-stone-200/50 dark:border-stone-800/80 rounded-2xl text-[11px] font-mono text-stone-500 dark:text-stone-400 flex items-start gap-3">
            <span className="text-secondary text-[13px]">☿</span>
            <p>
              <strong>Veda Note:</strong> Mercury is currently retrograde — your Vata constitution is especially sensitive this month. Prioritize nervous alignment practices.
            </p>
          </div>
        </Card>
      </main>

      <footer className="w-full max-w-4xl mx-auto px-6 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] font-mono text-stone-400 tracking-wider">
        <div>VEDIC BLUEPRINT / OJAS</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}
