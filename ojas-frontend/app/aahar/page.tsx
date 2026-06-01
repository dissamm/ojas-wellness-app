'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useUserStore } from '../store/userStore';
import { usePrakritiStore } from '../store/prakritiStore';
import { getDominantDoshaLabel } from '../lib/dominantDosha';
import { HERBS_DATA, Herb } from '../data/herbsData';
import { useHerbStore } from '../store/herbStore';



// ─── Types ────────────────────────────────────────────────────────────────────
type MealAlignment = 'aligned' | 'neutral' | 'aggravating';
type AgniState = 'sharp' | 'slow' | 'irregular' | null;

interface Meal {
  time: string;
  label: string;
  foods: string;
  alignment: MealAlignment;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const MEALS: Meal[] = [
  { time: '7:00 AM',  label: 'Breakfast', foods: 'Warm oats, ghee, cardamom',       alignment: 'aligned'     },
  { time: '12:00 PM', label: 'Lunch',     foods: 'Rice, dal, steamed greens',        alignment: 'neutral'     },
  { time: '7:00 PM',  label: 'Dinner',    foods: 'Cold salad, raw tomatoes, coffee', alignment: 'aggravating' },
];

const SEASONAL_FOODS = [
  { name: 'Coconut Water',  dosha: 'PITTA' },
  { name: 'Cucumber',       dosha: 'PITTA' },
  { name: 'Coriander',      dosha: 'VATA'  },
  { name: 'Pomegranate',    dosha: 'KAPHA' },
  { name: 'Fennel Seeds',   dosha: 'PITTA' },
];

const ALIGNMENT_SCORE = 72; // % — today's dosha alignment

const AGNI_OPTIONS: { id: AgniState; label: string; icon: string }[] = [
  { id: 'sharp',    label: 'Sharp & Clear',   icon: '🔥' },
  { id: 'slow',     label: 'Slow & Heavy',    icon: '🌫️' },
  { id: 'irregular',label: 'Irregular',       icon: '〰️' },
];

const DOSHA_PILL_COLOR: Record<string, string> = {
  VATA:  'bg-blue-50 border-blue-200/60 text-blue-700  dark:bg-blue-900/20 dark:border-blue-800/40 dark:text-blue-300',
  PITTA: 'bg-orange-50 border-orange-200/60 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/40 dark:text-orange-300',
  KAPHA: 'bg-emerald-50 border-emerald-200/60 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/40 dark:text-emerald-300',
};

const ALIGNMENT_BADGE: Record<MealAlignment, { label: string; color: string }> = {
  aligned:     { label: 'Aligned',     color: 'bg-emerald-100 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40' },
  neutral:     { label: 'Neutral',     color: 'bg-amber-100 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40'             },
  aggravating: { label: 'Aggravating', color: 'bg-red-100 text-red-700 border-red-200/60 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40'                       },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Aahar() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { prakriti, dominantPrakriti } = usePrakritiStore();
  const [agni, setAgni] = useState<AgniState>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Herb states
  const { myStack, syncedToRituals, addHerb, removeHerb, setSynced } = useHerbStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [syncing, setSyncing] = useState(false);
  const [expandedHerbs, setExpandedHerbs] = useState<Record<string, boolean>>({});

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1000);
  };

  const handleAddHerb = (herb: Herb | { name: string; dosage?: string; timeOfDay: string; emoji: string; bestFor: string[] }) => {
    addHerb({
      name: herb.name,
      dosage: herb.dosage || '500mg',
      timeOfDay: herb.timeOfDay,
      emoji: herb.emoji,
      bestFor: herb.bestFor
    });
  };

  const filteredHerbs = HERBS_DATA.filter((herb) => {
    const matchesSearch = herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      herb.bestFor.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      herb.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = activeFilter === 'ALL' || 
      (activeFilter === 'VATA' && herb.dosha.Vata === 'beneficial') ||
      (activeFilter === 'PITTA' && herb.dosha.Pitta === 'beneficial') ||
      (activeFilter === 'KAPHA' && herb.dosha.Kapha === 'beneficial') ||
      herb.categories.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });


  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isMounted) return null;

  const dominantDosha = getDominantDoshaLabel(user, prakriti, dominantPrakriti);

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const statCards = [
    { label: 'Dominant Dosha', value: dominantDosha || 'Vata' },
    { label: 'Season',         value: 'Grishma (Summer)'       },
    { label: 'Agni Score',     value: '7 / 10'                 },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#F0EBE3] dark:bg-[#12100E] text-[#1C1917] dark:text-[#FAF6F0] transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <section className="mb-14 animate-fade-rise">

          {/* Small label */}
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C27A5D] font-bold mb-5">
            NOURISHMENT MATRIX
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-[1.07] tracking-tight mb-5">
            Daily <em className="italic text-[#C27A5D]">Aahar</em> Sanctuary
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed">
            Align your meals with your Prakriti, the seasonal rhythm, and your Agni&rsquo;s daily fire.
          </p>

          {/* Stat Cards Row */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="bg-white/50 dark:bg-stone-900/60 border border-stone-300/40 dark:border-stone-800/80 rounded-2xl px-6 py-5 shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]"
              >
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-1.5 font-semibold">
                  {s.label}
                </div>
                <div className="font-cormorant italic text-2xl text-[#C27A5D] font-semibold">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Two-Column Grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-10 md:gap-14 items-start">

          {/* ─── LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-rise">

            {/* Daily Food Log */}
            <Card>
              <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-6 font-semibold">
                🥗 DAILY FOOD LOG — TODAY
              </div>

              {/* Meal Timeline */}
              <div className="flex flex-col gap-0">
                {MEALS.map((meal, idx) => {
                  const badge = ALIGNMENT_BADGE[meal.alignment];
                  return (
                    <div key={meal.label} className="relative flex gap-5">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C27A5D] mt-1 flex-shrink-0 z-10" />
                        {idx < MEALS.length - 1 && (
                          <div className="w-px flex-1 bg-stone-200/60 dark:bg-stone-800 my-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-6 flex-1 ${idx === MEALS.length - 1 ? 'pb-0' : ''}`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold tracking-wider bg-[#C27A5D]/10 text-[#C27A5D] px-2 py-0.5 rounded">
                              {meal.time}
                            </span>
                            <span className="text-xs font-mono text-stone-600 dark:text-stone-300 font-semibold">
                              {meal.label}
                            </span>
                          </div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                          {meal.foods}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Button variant="primary" className="w-full text-[9px]">
                  + LOG A MEAL
                </Button>
              </div>
            </Card>

            {/* Dosha Alignment Score */}
            <Card>
              <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-6 font-semibold">
                DOSHA ALIGNMENT SCORE
              </div>

              <div className="flex justify-between text-xs font-mono mb-2 text-stone-600 dark:text-stone-400">
                <span>Today&rsquo;s Alignment</span>
                <span className="font-semibold text-[#C27A5D]">{ALIGNMENT_SCORE}%</span>
              </div>
              <div className="h-1.5 bg-stone-200/50 dark:bg-stone-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#C27A5D] rounded-full transition-all duration-1000"
                  style={{ width: `${ALIGNMENT_SCORE}%` }}
                />
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Your food choices today are <strong className="text-stone-800 dark:text-stone-200">mostly aligned</strong> with your Vata constitution. Dinner choices introduced some Pitta aggravation.
              </p>
            </Card>
          </div>

          {/* ─── RIGHT COLUMN ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* Seasonal Foods */}
            <Card>
              <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-1 font-semibold">
                RITUCHARYA · GRISHMA
              </div>
              <h2 className="font-cormorant italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal mb-6">
                Seasonal Foods
              </h2>

              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-6">
                During Grishma (Summer), favour cooling, light, and hydrating foods. Avoid pungent, salty, and heavy meals that stoke Pitta.
              </p>

              {/* Food Pill Tags */}
              <div className="flex flex-wrap gap-2.5 mb-8">
                {SEASONAL_FOODS.map((food) => (
                  <div
                    key={food.name}
                    className="flex items-center gap-2 bg-white/70 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800 rounded-full px-4 py-2"
                  >
                    <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                      {food.name}
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${DOSHA_PILL_COLOR[food.dosha]}`}>
                      {food.dosha}
                    </span>
                  </div>
                ))}
              </div>

              {/* Link CTA */}
              <div className="pt-4 border-t border-stone-200/20 dark:border-stone-800">
                <Link
                  href="/rituals"
                  className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  VIEW FULL SEASONAL GUIDE →
                </Link>
              </div>
            </Card>

            {/* Agni Check-in */}
            <Card>
              <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-1 font-semibold">
                AGNI CHECK-IN
              </div>
              <h2 className="font-cormorant italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal mb-6">
                How is your digestion today?
              </h2>

              {/* Selectable options */}
              <div className="flex flex-wrap gap-3 mb-8">
                {AGNI_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAgni(opt.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full border text-xs font-mono font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                      agni === opt.id
                        ? 'bg-[#1C1917] text-[#F4EFEA] border-[#1C1917] dark:bg-[#C27A5D] dark:border-[#C27A5D]'
                        : 'bg-white/50 dark:bg-stone-900/40 border-stone-300/60 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-[#C27A5D]/60 hover:text-[#C27A5D]'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>

              {agni && (
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-4 font-semibold animate-fade-rise">
                  ✓ Logged — {AGNI_OPTIONS.find(o => o.id === agni)?.label}
                </div>
              )}

              {/* Affirmation quote */}
              <div className="border-l border-[#C27A5D]/30 pl-5 py-1">
                <p className="font-cormorant italic text-xl text-stone-700 dark:text-stone-300 leading-relaxed">
                  &ldquo;A calm Agni is the root of all wellness.&rdquo;
                </p>
              </div>
            </Card>

          </div>
        </div>

        {/* ─── AUSHADHI · HERB & SUPPLEMENT GUIDE ───────────────────────────── */}
        <div className="border-t border-stone-300/30 dark:border-stone-850 my-16 md:my-20" />

        <section className="animate-fade-rise">
          {/* Section label */}
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C27A5D] font-bold mb-5">
            AUSHADHI · HERB & SUPPLEMENT GUIDE
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-1 font-semibold">
                AUSHADHI SANCTUARY
              </div>
              <h2 className="text-4xl md:text-5xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
                Your Herb <span className="font-cormorant italic text-[#C27A5D]">Stack</span>
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed mt-2">
                Ayurvedic herbs and supplements curated for your Vata constitution and current Agni state.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbs, e.g. Ashwagandha, Brahmi..."
                className="w-full pl-11 pr-5 py-3 rounded-full border border-stone-300/60 dark:border-stone-700 bg-white/50 dark:bg-stone-900/40 text-stone-800 dark:text-stone-250 placeholder-stone-400 text-xs font-mono focus:outline-none focus:border-[#C27A5D] focus:ring-1 focus:ring-[#C27A5D] transition-all duration-300"
              />
            </div>
          </div>

          {/* ─── Personalized Stack Recommendation Card (Dark #1C1C1A) ─────── */}
          <div className="bg-[#1C1C1A] dark:bg-[#111110] rounded-[32px] p-8 text-[#FAF6F0] mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#C27A5D]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-[#C27A5D] font-bold mb-4">
                YOUR PRAKRITI STACK · VATA OPTIMISED
              </div>
              <h3 className="text-2xl md:text-3xl font-normal font-cormorant text-[#FAF6F0] leading-tight mb-6">
                Recommended for you today
              </h3>

              {/* Grid of Recommended Pills */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                  { name: 'Ashwagandha', reason: 'Grounds elevated Vata anxiety', dosage: '500mg', timeOfDay: '09:30 PM', emoji: '🌿', bestFor: ['Anxiety', 'Sleep', 'Grounding'] },
                  { name: 'Brahmi', reason: 'Sharpens the quick Vata mind', dosage: '250mg', timeOfDay: '06:00 AM', emoji: '🌱', bestFor: ['Mental Clarity', 'Memory', 'Focus'] },
                  { name: 'Triphala', reason: 'Regulates Vata digestion', dosage: '1000mg', timeOfDay: '09:45 PM', emoji: '🍇', bestFor: ['Digestion', 'Detoxification', 'Bowel Regularity'] }
                ].map((rec) => {
                  const inStack = myStack.some(s => s.name === rec.name);
                  return (
                    <div key={rec.name} className="flex flex-col gap-2.5">
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex flex-col justify-between h-full hover:border-[#C27A5D]/40 transition duration-300">
                        <div className="text-sm font-semibold text-white flex items-center gap-2 mb-1.5">
                          <span className="text-lg">{rec.emoji}</span>
                          {rec.name}
                        </div>
                        <div className="text-[11px] text-stone-400 leading-normal">
                          {rec.reason}
                        </div>
                        <div className="text-[9px] font-mono text-stone-500 mt-2">
                          {rec.dosage} · {rec.timeOfDay}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddHerb(rec)}
                        disabled={inStack}
                        className={`text-[9px] font-mono uppercase tracking-wider text-left pl-1 transition-colors ${
                          inStack ? 'text-emerald-500' : 'text-[#C27A5D] hover:text-white'
                        }`}
                      >
                        {inStack ? '✓ ADDED TO STACK' : '+ ADD TO ROUTINE'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-stone-800/80 pt-4 flex justify-between items-center text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                <div>BASED ON YOUR PRAKRITI SCORE · VATA 94%</div>
              </div>
            </div>
          </div>

          {/* ─── Filter Row ────────────────────────────────────────────────── */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {['ALL', 'VATA', 'PITTA', 'KAPHA', 'SLEEP', 'DIGESTION', 'IMMUNITY', 'MIND', 'HORMONES'].map((pill) => {
              const isActive = activeFilter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveFilter(pill)}
                  className={`px-4.5 py-2 rounded-full border text-[9px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#C27A5D] text-white border-[#C27A5D]'
                      : 'bg-white/50 dark:bg-stone-900/40 border-stone-300/40 dark:border-stone-850 text-stone-600 dark:text-stone-400 hover:border-[#C27A5D]/40 hover:text-[#C27A5D]'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* ─── Main Sanctuary Split Layout ──────────────────────────────── */}
          <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-start">
            
            {/* Left Column: Herb Cards Grid */}
            <div className="lg:col-span-8">
              {filteredHerbs.length === 0 ? (
                <div className="bg-white/40 dark:bg-stone-900/20 border border-stone-300/20 dark:border-stone-850 rounded-[32px] p-12 text-center text-stone-500">
                  <span className="text-3xl block mb-3">🌱</span>
                  <p className="text-xs font-mono">No herbs match your search or filter options.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredHerbs.map((herb) => {
                    const inStack = myStack.some(s => s.name === herb.name);
                    const isExpanded = expandedHerbs[herb.name] || false;
                    return (
                      <div
                        key={herb.name}
                        className="bg-white dark:bg-stone-900 border border-stone-300/40 dark:border-stone-800/80 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] flex flex-col justify-between min-h-[340px]"
                      >
                        <div>
                          {/* Top Info */}
                          <div className="flex items-center gap-2.5 mb-3">
                            <span className="text-2xl">{herb.emoji}</span>
                            <h4 className="font-cormorant text-xl font-semibold text-stone-900 dark:text-stone-100">
                              {herb.name}
                            </h4>
                          </div>

                          {/* Dosha tag row */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(['Vata', 'Pitta', 'Kapha'] as const).map((dKey) => {
                              const status = herb.dosha[dKey];
                              let colorClass = '';
                              if (status === 'beneficial') {
                                if (dKey === 'Vata') colorClass = 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20';
                                else if (dKey === 'Pitta') colorClass = 'bg-[#C27A5D]/10 text-[#C27A5D] border-[#C27A5D]/20';
                                else colorClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                              } else if (status === 'neutral') {
                                colorClass = 'border-stone-200/60 dark:border-stone-800 text-stone-400 dark:text-stone-600 bg-transparent';
                              } else {
                                // aggravating
                                colorClass = 'border-stone-200/60 dark:border-stone-800 text-stone-400 dark:text-stone-600 bg-transparent pr-4 relative';
                              }

                              return (
                                <span
                                  key={dKey}
                                  className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded border flex items-center gap-1 ${colorClass}`}
                                >
                                  {dKey}
                                  {status === 'aggravating' && (
                                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block absolute right-1.5 top-[7px]" title="Aggravating" />
                                  )}
                                </span>
                              );
                            })}
                          </div>

                          {/* Attributes */}
                          <div className="space-y-2 mt-4 text-[11px] leading-relaxed border-t border-stone-100 dark:border-stone-800/40 pt-4">
                            <div>
                              <span className="font-mono text-stone-400 uppercase tracking-widest text-[9px] block">BEST FOR</span>
                              <span className="text-stone-700 dark:text-stone-300 font-semibold">{herb.bestFor.join(' · ')}</span>
                            </div>
                            <div className="mt-2.5">
                              <span className="font-mono text-stone-400 uppercase tracking-widest text-[9px] block">WHEN TO TAKE</span>
                              <span className="text-stone-600 dark:text-stone-400 font-medium">{herb.whenToTake} · {herb.dosage}</span>
                            </div>
                            <div className="mt-2.5">
                              <span className="font-mono text-stone-400 uppercase tracking-widest text-[9px] block">AGNI NOTE</span>
                              <span className="text-stone-500 dark:text-stone-400 italic">{herb.agniNote}</span>
                            </div>
                          </div>

                          {/* Contraindications Expandable drawer */}
                          <div className="mt-4">
                            <button
                              onClick={() => setExpandedHerbs(prev => ({ ...prev, [herb.name]: !isExpanded }))}
                              className="text-[9px] font-mono text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                            >
                              Contraindications {isExpanded ? '↑' : '↓'}
                            </button>
                            {isExpanded && (
                              <div className="text-[10px] text-red-600/80 dark:text-red-400/80 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 rounded-xl p-2.5 mt-2 font-mono leading-relaxed animate-fade-rise">
                                ⚠️ {herb.contraindications}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add to stack button */}
                        <button
                          onClick={() => handleAddHerb(herb)}
                          disabled={inStack}
                          className={`mt-6 text-center w-full px-4 py-2 border rounded-full text-[10px] font-mono font-bold uppercase tracking-wider block transition-all duration-300 cursor-pointer ${
                            inStack
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'border-[#C27A5D]/30 text-[#C27A5D] hover:bg-[#C27A5D] hover:text-white'
                          }`}
                        >
                          {inStack ? '✓ IN YOUR STACK' : '+ ADD TO MY STACK'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Persistent Saved Stack panel */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white dark:bg-stone-900 border border-stone-300/40 dark:border-stone-800/80 rounded-[32px] p-6 shadow-[0_4px_25px_-5px_rgba(28,25,22,0.03)]">
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-4 font-semibold">
                  MY AUSHADHI STACK
                </div>
                
                {myStack.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-stone-300/40 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/30">
                    <span className="text-2xl block mb-2">🌿</span>
                    <p className="text-[11px] leading-relaxed text-stone-400 px-4">
                      No herbs in your stack. Add recommendations or search the database to customize your daily nourishment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {myStack.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-[#FDF6EC]/30 dark:bg-stone-950/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.emoji}</span>
                          <div>
                            <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                              {item.name}
                            </div>
                            <div className="text-[9px] font-mono text-stone-400 dark:text-stone-500">
                              {item.dosage} · {item.timeOfDay}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeHerb(item.name)}
                          className="text-stone-400 hover:text-red-500 text-lg leading-none p-1 cursor-pointer select-none font-light"
                          aria-label={`Remove ${item.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sync Actions */}
                <button
                  onClick={handleSync}
                  disabled={myStack.length === 0 || syncing}
                  className="w-full mt-6 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1C1A] text-[#FAF6F0] hover:bg-[#C27A5D] hover:text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1C1C1A] disabled:hover:text-[#FAF6F0] cursor-pointer"
                >
                  {syncing ? 'SYNCING...' : syncedToRituals ? '✓ SYNCED' : 'SYNC TO MORNING RITUALS'}
                </button>

                <p className="text-[9px] text-stone-400 dark:text-stone-500 font-mono text-center mt-4 uppercase tracking-wider">
                  Your stack syncs with your Dinacharya schedule
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>


      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>NOURISHMENT / GRISHMA SEASON</div>
        <div>© OJAS AAHAR MMXXVI</div>
      </footer>
    </div>
  );
}
