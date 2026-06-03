'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { usePrakritiStore } from '../store/prakritiStore';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { useRouter } from 'next/navigation';
import { getJyotishProfile } from '../utils/jyotishData';

import { PRAKRITI_QUESTIONS, DOSHA_DETAILS, DOSHA_MAP, DOSHA_ICONS } from './quizData';
import { calculatePercentagesFromScores, getDominantDosha } from './utils';

export default function PrakritiPage() {
  const router = useRouter();
  const { setPrakriti } = usePrakritiStore();
  const { user, setDoshaComposition } = useUserStore();
  const { cycle } = useCycleStore();
  const jyotish = getJyotishProfile(user?.dateOfBirth);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [answers, setAnswers] = useState<Array<'v' | 'p' | 'k' | null>>([]);
  const [selectedOption, setSelectedOption] = useState<number | 'skip' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Tab & Context States for Results page
  const [activeTab, setActiveTab] = useState<'overview' | 'bodymind' | 'diet' | 'lifestyle' | 'rhythms' | 'jyotish'>('overview');
  const [dualCtx, setDualCtx] = useState<'pri' | 'sec'>('pri');

  // Rhythm Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // BMI States
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null);

  // Copy success indicator
  const [copied, setCopied] = useState(false);

  // Check saved state on mount or user load to show results directly if taken
  useEffect(() => {
    const saved = localStorage.getItem('prakriti');
    let parsed: { vata: number; pitta: number; kapha: number } | null = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if ((!parsed || !parsed.vata) && user?.doshaComposition && user?.dominantDosha) {
      parsed = user.doshaComposition;
      localStorage.setItem('prakriti', JSON.stringify(user.doshaComposition));
      localStorage.setItem('dominantPrakriti', user.dominantDosha);
    }

    if (parsed) {
      if (parsed.vata !== undefined && parsed.pitta !== undefined && parsed.kapha !== undefined) {
        const total = parsed.vata + parsed.pitta + parsed.kapha;
        if (total > 0) {
          setScores({
            Vata: Math.round((parsed.vata / 100) * 18),
            Pitta: Math.round((parsed.pitta / 100) * 18),
            Kapha: Math.round((parsed.kapha / 100) * 18),
          });
          setSubmitted(true);
        }
      }
    }
  }, [user]);

  // Load checklist state when submitted is true
  useEffect(() => {
    if (submitted) {
      try {
        const stored = localStorage.getItem('ojas_checklist_state');
        if (stored) setChecklist(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, [submitted]);


  const handleSelectOption = (index: number | 'skip') => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    let answerValue: 'v' | 'p' | 'k' | null = null;
    if (selectedOption !== 'skip') {
      const dosha = question.opts[selectedOption].d as 'Vata' | 'Pitta' | 'Kapha';
      answerValue = dosha.charAt(0).toLowerCase() as 'v' | 'p' | 'k';
    }

    const newAnswers = [...answers, answerValue];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < PRAKRITI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = { v: 0, p: 0, k: 0 };
      let total = 0;
      newAnswers.forEach(answer => {
        if (answer !== null) {
          score[answer] += 1;
          total += 1;
        }
      });

      if (total === 0) {
        alert("Please answer at least a few questions to get your Prakriti result.");
        setAnswers(answers);
        return;
      }

      const result = {
        v: total > 0 ? score.v / total : 0,
        p: total > 0 ? score.p / total : 0,
        k: total > 0 ? score.k / total : 0,
      };

      const finalScores = {
        Vata: Math.round(result.v * 18),
        Pitta: Math.round(result.p * 18),
        Kapha: Math.round(result.k * 18),
      };

      setScores(finalScores);
      handleSubmit(finalScores);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    
    const newAnswers = [...answers];
    newAnswers.pop();
    
    setAnswers(newAnswers);
    setSelectedOption(null);
    setCurrentQuestion(currentQuestion - 1);
  };

  // Keyboard navigation for the quiz
  useEffect(() => {
    if (submitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing in form inputs
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'a') {
        setSelectedOption(0);
      } else if (key === 'b') {
        setSelectedOption(1);
      } else if (key === 'c') {
        setSelectedOption(2);
      } else if (key === 's') {
        setSelectedOption('skip');
      } else if (e.key === 'ArrowRight') {
        if (selectedOption !== null) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQuestion > 0) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted, selectedOption, currentQuestion, handleNext, handleBack]);

  const handleSubmit = (finalScores: typeof scores) => {
    const calculatedPrakriti = calculatePercentagesFromScores(finalScores);
    const dominantPrakriti = getDominantDosha(calculatedPrakriti);

    setPrakriti(calculatedPrakriti);
    setDoshaComposition(calculatedPrakriti, dominantPrakriti);
    setSubmitted(true);
  };

  const handleRetake = () => {
    const confirmRetake = window.confirm("Are you sure? This will replace your current Prakriti results.");
    if (!confirmRetake) return;

    setScores({ Vata: 0, Pitta: 0, Kapha: 0 });
    setAnswers([]);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCalculatedBmi(null);
    localStorage.removeItem('prakriti');
    localStorage.removeItem('dominantPrakriti');
    localStorage.removeItem('prakriti_quiz_progress');
    localStorage.removeItem('prakriti_quiz_answers');

    setDoshaComposition({ vata: 0, pitta: 0, kapha: 0 }, '');
  };

  const getNextStepRouteAndLabel = () => {
    const isFemale = user?.gender !== 'male';
    const hasCycle = cycle?.startDate || user?.menstrualCycleStart;
    const hasMusic = (user?.musicPreferences && user.musicPreferences.length > 0) || (typeof window !== 'undefined' && localStorage.getItem('musicPreferencesSet') === 'true');

    if (isFemale && !hasCycle) {
      return { route: '/cycle', label: 'CONTINUE TO MOON SYNC →' };
    } else if (!hasMusic) {
      return { route: '/music', label: 'CONTINUE TO SOUND SANCTUARY →' };
    } else {
      return { route: '/dashboard', label: 'GO TO DASHBOARD →' };
    }
  };

  const handleToggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem('ojas_checklist_state', JSON.stringify(updated));
  };

  const handleCalculateBmi = () => {
    let w = 0;
    let h = 0;
    if (bmiUnit === 'metric') {
      const kg = parseFloat(weightKg);
      const cm = parseFloat(heightCm);
      if (kg > 0 && cm > 0) {
        w = kg;
        h = cm / 100;
      }
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      if (lbs > 0 && (ft > 0 || inch > 0)) {
        w = lbs * 0.453592;
        h = (ft * 12 + inch) * 0.0254;
      }
    }

    if (w > 0 && h > 0) {
      setCalculatedBmi(w / (h * h));
    }
  };

  const handleCopyLink = () => {
    const shareURL = `${window.location.origin}/prakriti#r/${domKey}/${scores.Vata}-${scores.Pitta}-${scores.Kapha}/${encodeURIComponent(user?.name || 'Soul')}`;
    navigator.clipboard.writeText(shareURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const progress = ((currentQuestion + 1) / PRAKRITI_QUESTIONS.length) * 100;
  const question = PRAKRITI_QUESTIONS[currentQuestion];

  // Calculated parameters for results
  const tot = 18;
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const dominantDoshaName = sortedScores[0][0] as 'Vata' | 'Pitta' | 'Kapha';
  const secondaryDoshaName = sortedScores[1][0] as 'Vata' | 'Pitta' | 'Kapha';

  const domKey = DOSHA_MAP[dominantDoshaName] as 'v' | 'p' | 'k';
  const secKey = DOSHA_MAP[secondaryDoshaName] as 'v' | 'p' | 'k';

  const domPct = Math.round((scores[dominantDoshaName] / tot) * 100);
  const secPct = Math.round((scores[secondaryDoshaName] / tot) * 100);
  const isDual = secPct >= 28;

  const d = DOSHA_DETAILS[domKey];
  const s = DOSHA_DETAILS[secKey];

  const bV = Math.round((scores.Vata / tot) * 100);
  const bP = Math.round((scores.Pitta / tot) * 100);
  const bK = Math.round((scores.Kapha / tot) * 100);

  // Active details to show in cards based on Dual Context selection
  const activeDosha = dualCtx === 'pri' ? d : s;
  const activeKey = dualCtx === 'pri' ? domKey : secKey;

  // SVG Chart calculation parameters
  // Radius r=30, Circumference C = 188.5
  const circ = 188.5;
  const vataLength = (bV / 100) * circ;
  const pittaLength = (bP / 100) * circ;
  const kaphaLength = (bK / 100) * circ;

  // BMI calculations
  const bmiShift = -2.0 * (scores.Vata / 18) + 2.5 * (scores.Kapha / 18);
  const getBmiAssessment = (bmiVal: number) => {
    const s_under = 16.0 + bmiShift;
    const under = 18.5 + bmiShift;
    const over = 25.0 + bmiShift;
    const obese = 30.0 + bmiShift;

    if (bmiVal < s_under) {
      return {
        state: 'Severely Underweight',
        sanskrit: 'Atikarshya / Severe Dhatu Kshaya',
        color: '#ef4444',
        advice: domKey === 'v' 
          ? 'Vata depletion requires deep, warm nourishment (ghee, root veg, cooked grains).' 
          : 'Aggressive tissue depletion detected. Strongly prioritize heavy, grounding foods.'
      };
    } else if (bmiVal < under) {
      return {
        state: 'Underweight',
        sanskrit: 'Karshya / Ama Deficiency',
        color: '#c06080',
        advice: domKey === 'v' 
          ? 'This is common for Vata constitutions, but ensure you maintain internal strength. Add healthy fats to every meal.' 
          : 'Below ideal weight for your body type. Focus on rebuilding tissues (Brimhana therapy).'
      };
    } else if (bmiVal < over) {
      return {
        state: 'Ideal / Balanced',
        sanskrit: 'Sama Agni',
        color: '#2a6840',
        advice: 'Your weight perfectly aligns with your Prakriti balance. Maintain your current daily rhythms.'
      };
    } else if (bmiVal < obese) {
      return {
        state: 'Overweight',
        sanskrit: 'Sthula / Ama Accumulation',
        color: '#c06080',
        advice: domKey === 'k' 
          ? 'Kapha is naturally denser, but you are leaning past ideal. Increase daily movement and favor warm, spiced, light foods.' 
          : 'Ama (toxins) may be accumulating. Favor fasting or lighter, easily digestible meals.'
      };
    } else {
      return {
        state: 'Obese',
        sanskrit: 'Atisthula / Medo Roga',
        color: '#ef4444',
        advice: 'Significant tissue accumulation. Daily vigorous exercise (Vyayama) and strict Kapha-reducing diet recommended.'
      };
    }
  };

  const getBmiColor = (bmiVal: number) => {
    return getBmiAssessment(bmiVal).color;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/10 transition-colors duration-500">
        <div>
          <Header />

          {/* Sticky Pane Selector Sub-tabs */}
          <div className="sticky top-[73px] z-30 bg-[#F4EFEA]/95 dark:bg-primary/95 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/80 py-3 mb-8 animate-fade-rise">
            <div className="max-w-2xl mx-auto px-4 flex justify-between gap-1 overflow-x-auto scrollbar-none">
              {([
                { id: 'overview', label: 'Overview' },
                { id: 'bodymind', label: 'Body & Mind' },
                { id: 'diet', label: 'Diet' },
                { id: 'lifestyle', label: 'Lifestyle' },
                { id: 'rhythms', label: 'Rhythms' },
                { id: 'jyotish', label: 'Jyotish' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary dark:bg-[#FAF6F0] text-white dark:text-primary shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-200/30 dark:bg-stone-800/40 hover:bg-stone-200/60 dark:hover:bg-stone-800/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Dosha Focus Toggle Banner (if dual-dosha) */}
          {isDual && activeTab !== 'overview' && (
            <div className="max-w-2xl mx-auto px-6 mb-6 animate-fade-rise">
              <div className="bg-surface-container-low dark:bg-stone-900/60 border border-orange-200/30 dark:border-stone-800 p-2 rounded-2xl flex justify-between gap-2 shadow-sm">
                <button
                  onClick={() => setDualCtx('pri')}
                  className={`flex-1 py-3 px-4 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                    dualCtx === 'pri'
                      ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-bold border border-stone-200 dark:border-stone-800 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-secondary mb-0.5">PRIMARY</span>
                  <span className="font-serif italic text-base">{d.name} · {domPct}%</span>
                </button>
                <button
                  onClick={() => setDualCtx('sec')}
                  className={`flex-1 py-3 px-4 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                    dualCtx === 'sec'
                      ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-bold border border-stone-200 dark:border-stone-800 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-secondary mb-0.5">SECONDARY</span>
                  <span className="font-serif italic text-base">{s.name} · {secPct}%</span>
                </button>
              </div>
            </div>
          )}

          <main className="max-w-2xl mx-auto px-6 pb-16 w-full space-y-8">
            
            {/* OVERVIEW PANE */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Hero Card */}
                <div className="w-full bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] text-center flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary font-semibold mb-4 block">
                    NAMASTE, {user?.name?.toUpperCase() || 'BEAUTIFUL SOUL'} 🙏
                  </span>

                  {isDual ? (
                    <>
                      {/* Dual Icons */}
                      <div className="flex items-center gap-4 text-4xl mb-6">
                        <span className="w-16 h-16 rounded-full bg-white/55 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 flex items-center justify-center shadow-sm animate-float">
                          {DOSHA_ICONS[domKey]}
                        </span>
                        <span className="text-stone-300 font-serif font-light text-2xl">×</span>
                        <span className="w-16 h-16 rounded-full bg-white/55 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 flex items-center justify-center shadow-sm animate-float" style={{ animationDelay: '1.5s' }}>
                          {DOSHA_ICONS[secKey]}
                        </span>
                      </div>

                      <h1 className="text-4xl font-normal font-headline-md text-primary dark:text-[#FAF6F0] leading-tight mb-4">
                        <span style={{ color: d.color }}>{d.name}</span>
                        <span className="text-stone-300 font-light font-sans mx-2">–</span>
                        <span style={{ color: s.color }}>{s.name}</span>
                      </h1>
                      
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-bold mb-4 block">
                        Dual Dosha Prakriti
                      </span>

                      <p className="text-stone-500 dark:text-stone-400 font-inter text-sm leading-relaxed max-w-lg mb-6">
                        Most people carry a <strong>dual dosha constitution</strong>. Your primary is <strong style={{ color: d.color }}>{d.name} ({domPct}%)</strong> with a significant secondary <strong style={{ color: s.color }}>{s.name} ({secPct}%)</strong>.
                        Switch categories above or use the toggles to review localized guidelines for both.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Single Icon */}
                      <div className="w-20 h-20 rounded-full bg-white/50 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 flex items-center justify-center text-4xl shadow-sm animate-float mb-6">
                        {DOSHA_ICONS[domKey]}
                      </div>

                      <h1 className="text-4xl sm:text-5xl font-normal font-headline-md text-primary dark:text-[#FAF6F0] leading-tight mb-2">
                        <span style={{ color: d.color }}>{d.name} Predominance</span>
                      </h1>

                      <p className="text-stone-400 font-mono text-[10px] uppercase tracking-widest mb-6">
                        {d.element}
                      </p>

                      <p className="text-stone-500 dark:text-stone-400 font-inter text-sm leading-relaxed max-w-lg mb-6">
                        Your constitution shows strong single-dosha predominance ({domPct}% {d.name}). Classical texts note this is relatively rare and denotes clear energy alignment.
                      </p>

                      <p className="text-stone-700 dark:text-stone-300 font-serif italic text-base leading-relaxed max-w-xl p-5 bg-surface-container-low dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-2xl mb-6">
                        &ldquo;{d.desc}&rdquo;
                      </p>
                    </>
                  )}

                  {/* Score row pills */}
                  <div className="flex flex-wrap justify-center gap-3 w-full border-t border-stone-200/30 dark:border-stone-800 pt-6 mt-2">
                    <span className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${domKey === 'v' ? 'bg-[#2e6e96]/10 border-[#2e6e96]/30 text-[#2e6e96] font-bold' : 'bg-white/50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {DOSHA_ICONS.v} VATA {scores.Vata}/{tot}
                    </span>
                    <span className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${domKey === 'p' ? 'bg-[#b04020]/10 border-[#b04020]/30 text-[#b04020] font-bold' : 'bg-white/50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {DOSHA_ICONS.p} PITTA {scores.Pitta}/{tot}
                    </span>
                    <span className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${domKey === 'k' ? 'bg-[#2a6840]/10 border-[#2a6840]/30 text-[#2a6840] font-bold' : 'bg-white/50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {DOSHA_ICONS.k} KAPHA {scores.Kapha}/{tot}
                    </span>
                  </div>
                </div>

                {/* Dual Description Grid (if dual-dosha) */}
                {isDual && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-6 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{DOSHA_ICONS[domKey]}</span>
                        <div>
                          <h4 className="font-serif italic text-lg text-stone-900 dark:text-[#FAF6F0] font-normal">Primary · {d.name}</h4>
                          <span className="text-[9px] font-mono text-secondary uppercase tracking-wider">{domPct}% Predominance</span>
                        </div>
                      </div>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mb-3 font-inter">
                        {d.desc}
                      </p>
                      <p className="text-stone-400 font-mono text-[9px] uppercase tracking-widest">{d.element}</p>
                    </div>

                    <div className="bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-6 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{DOSHA_ICONS[secKey]}</span>
                        <div>
                          <h4 className="font-serif italic text-lg text-stone-900 dark:text-[#FAF6F0] font-normal">Secondary · {s.name}</h4>
                          <span className="text-[9px] font-mono text-secondary uppercase tracking-wider">{secPct}% Predominance</span>
                        </div>
                      </div>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mb-3 font-inter">
                        {s.desc}
                      </p>
                      <p className="text-stone-400 font-mono text-[9px] uppercase tracking-widest">{s.element}</p>
                    </div>
                  </div>
                )}

                {/* Classical Reference Card */}
                <div className="p-6 bg-surface-container-low dark:bg-stone-950/60 border border-orange-100/50 dark:border-stone-850 rounded-3xl text-xs md:text-sm text-[#8A5A44] dark:text-stone-350 font-inter leading-relaxed italic shadow-[inset_0_1px_3px_rgba(28,25,22,0.01)]">
                  <p className="font-mono text-[10px] uppercase tracking-wider font-semibold mb-3 not-italic text-secondary">
                    📜 CLASSICAL SAMHITA REFERENCE
                  </p>
                  <div>
                    <strong>{d.name}:</strong> {d.classical}
                  </div>
                  {isDual && (
                    <div className="mt-4 pt-4 border-t border-orange-200/20">
                      <strong>{s.name}:</strong> {s.classical}
                    </div>
                  )}
                </div>

                {/* Doughnut Chart & Breakdown card */}
                <div className="w-full bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] flex flex-col items-center">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-6 block self-start">
                    📊 DOSHA SCORE BREAKDOWN
                  </span>

                  {/* SVG-based Doughnut Chart */}
                  <div className="relative w-44 h-44 mb-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Vata Arc */}
                      {bV > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          fill="transparent"
                          stroke="#2e6e96"
                          strokeWidth="12"
                          strokeDasharray={`${vataLength} ${circ}`}
                          strokeDashoffset="0"
                          className="transition-all duration-1000 ease-out"
                        />
                      )}
                      {/* Pitta Arc */}
                      {bP > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          fill="transparent"
                          stroke="#b04020"
                          strokeWidth="12"
                          strokeDasharray={`${pittaLength} ${circ}`}
                          strokeDashoffset={`-${vataLength}`}
                          className="transition-all duration-1000 ease-out"
                        />
                      )}
                      {/* Kapha Arc */}
                      {bK > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          fill="transparent"
                          stroke="#2a6840"
                          strokeWidth="12"
                          strokeDasharray={`${kaphaLength} ${circ}`}
                          strokeDashoffset={`-${vataLength + pittaLength}`}
                          className="transition-all duration-1000 ease-out"
                        />
                      )}
                    </svg>
                    {/* Centered Emoji Icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl animate-float">{DOSHA_ICONS[domKey]}</span>
                    </div>
                  </div>

                  {/* Relative progress lines */}
                  <div className="w-full space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-1.5 text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2e6e96]" /> Vata</span>
                        <span>{bV}%</span>
                      </div>
                      <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2e6e96] h-full rounded-full transition-all duration-1000" style={{ width: `${bV}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-1.5 text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#b04020]" /> Pitta</span>
                        <span>{bP}%</span>
                      </div>
                      <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#b04020] h-full rounded-full transition-all duration-1000" style={{ width: `${bP}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-1.5 text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2a6840]" /> Kapha</span>
                        <span>{bK}%</span>
                      </div>
                      <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2a6840] h-full rounded-full transition-all duration-1000" style={{ width: `${bK}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 font-mono leading-relaxed mt-6 uppercase tracking-wider">
                    CCRAS/AYUSH validated Prakriti assessment framework · 18 questions across Physical (Q1–6), Physiological (Q7–12) and Psychological (Q13–18).
                  </p>
                </div>

                {/* Experimental Dosha-Adjusted BMI Calculator Card */}
                <div className="w-full bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">⚖️</span>
                    <h3 className="font-serif italic text-xl text-stone-900 dark:text-[#FAF6F0] font-normal">Dosha-Adjusted BMI (Experimental)</h3>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                    Standard BMI assumes all frames are identical. Ayurveda recognizes **Vata** is naturally lighter and **Kapha** is naturally denser. Your unique Dosha shift adjusts your ideal weight zone by <strong className="text-stone-900 dark:text-[#FAF6F0]">{bmiShift > 0 ? '+' : ''}{bmiShift.toFixed(1)}</strong> points.
                  </p>

                  {/* Toggle Metric / Imperial */}
                  <div className="flex gap-2 p-1 bg-stone-200/35 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-850 rounded-2xl mb-6">
                    <button
                      onClick={() => { setBmiUnit('metric'); setCalculatedBmi(null); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        bmiUnit === 'metric' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => { setBmiUnit('imperial'); setCalculatedBmi(null); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        bmiUnit === 'imperial' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>

                  {/* Metric Inputs */}
                  {bmiUnit === 'metric' ? (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">WEIGHT (KG)</label>
                        <input
                          type="number"
                          placeholder="e.g. 70"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-secondary transition-all duration-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">HEIGHT (CM)</label>
                        <input
                          type="number"
                          placeholder="e.g. 175"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-secondary transition-all duration-300 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">WEIGHT (LBS)</label>
                        <input
                          type="number"
                          placeholder="e.g. 150"
                          value={weightLbs}
                          onChange={(e) => setWeightLbs(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-secondary transition-all duration-300 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">HEIGHT (FT)</label>
                          <input
                            type="number"
                            placeholder="e.g. 5"
                            value={heightFt}
                            onChange={(e) => setHeightFt(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-secondary transition-all duration-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">HEIGHT (IN)</label>
                          <input
                            type="number"
                            placeholder="e.g. 9"
                            value={heightIn}
                            onChange={(e) => setHeightIn(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-secondary transition-all duration-300 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCalculateBmi}
                    className="w-full py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary hover:bg-secondary text-white transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    CALCULATE ADJUSTED BMI
                  </button>

                  {/* BMI Result Output Block */}
                  {calculatedBmi !== null && calculatedBmi > 0 && (
                    <div className="mt-8 pt-8 border-t border-stone-200/50 animate-fade-rise">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <span className="text-4xl sm:text-5xl font-serif text-stone-950 font-normal block leading-none">{calculatedBmi.toFixed(1)}</span>
                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block mt-1">Standard BMI</span>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-base font-serif italic block font-bold"
                            style={{ color: getBmiColor(calculatedBmi) }}
                          >
                            {getBmiAssessment(calculatedBmi).state}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block mt-0.5">
                            {getBmiAssessment(calculatedBmi).sanskrit}
                          </span>
                        </div>
                      </div>

                      {/* Custom Horizontal Gauge Chart */}
                      {(() => {
                        const underBound = 18.5 + bmiShift;
                        const overBound = 25.0 + bmiShift;

                        // Bounds clamping to 0-40 range for layout
                        const pctFill = Math.max(0, Math.min(100, (calculatedBmi / 40) * 100));
                        const idealLeft = Math.max(0, (underBound / 40) * 100);
                        const idealWidth = ((overBound - underBound) / 40) * 100;

                        return (
                          <div className="mb-6">
                            <div className="relative h-2 bg-stone-200/70 border border-stone-300/40 rounded-full my-8">
                              {/* Ideal Zone */}
                              <div
                                className="absolute h-full rounded-md border-x-2 border-emerald-500 bg-emerald-500/10"
                                style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }}
                              />
                              {/* Pin Marker */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full shadow-md bg-stone-950 border border-white transition-all duration-700"
                                style={{ left: `${pctFill}%` }}
                              >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-secondary text-white px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-bold">YOU</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase tracking-widest mt-2">
                              <span>&lt; {underBound.toFixed(1)}</span>
                              <span className="text-emerald-700 font-semibold">Dosha Ideal Zone</span>
                              <span>&gt; {overBound.toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Insight Advice Block */}
                      <div className="p-4 bg-surface-container-low border border-orange-100/50 rounded-2xl text-xs sm:text-sm text-[#8A5A44] leading-relaxed">
                        <strong className="block text-secondary font-mono text-[9px] uppercase tracking-wider font-bold mb-1">AYURVEDIC INSIGHT</strong>
                        {getBmiAssessment(calculatedBmi).advice}
                      </div>
                    </div>
                  )}
                </div>

                {/* Shareable Result URL card */}
                <div className="w-full bg-surface-container-low border border-orange-200/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔗</span>
                    <div>
                      <h4 className="font-serif italic text-base text-stone-900 font-normal">Share Your Prakriti</h4>
                      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Let others discover their vital constitution</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-stone-900 hover:bg-secondary text-white transition-all duration-300 cursor-pointer text-center"
                  >
                    {copied ? '✅ COPIED!' : 'COPY LINK'}
                  </button>
                </div>
              </div>
            )}

            {/* BODY & MIND PANE */}
            {activeTab === 'bodymind' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Traits Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-4 block">
                    ✨ PERSONALITY TRAITS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeDosha.traits.map((trait, i) => (
                      <span key={i} className="px-3 py-1 bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border border-stone-200/20 dark:border-stone-850">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-4 block">
                    🔍 WHY THIS IS YOUR PRAKRITI
                  </span>
                  <p className="text-stone-700 font-serif italic text-base leading-relaxed">
                    &ldquo;{activeDosha.why}&rdquo;
                  </p>
                </div>

                {/* Imbalance Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    ⚠️ EARLY WARNING SIGNS OF IMBALANCE
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    When **{activeDosha.name}** becomes aggravated in your constitution, these are the early biological warning signs to watch for.
                  </p>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeDosha.imbalance.map((item, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 border border-stone-200/30 rounded-2xl text-stone-700 font-inter text-xs hover:border-secondary/30 transition-all duration-300 flex items-center gap-3">
                        <span className="text-orange-300">✦</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DIET PANE */}
            {activeTab === 'diet' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Diet Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    🍽️ DIET — ĀHĀRA GUIDE
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    <strong>Principle:</strong> {activeDosha.foods.principle}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Favour Columns */}
                    <div className="p-5 bg-emerald-50/20 border border-emerald-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <span>✓</span> FAVOUR
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.foods.prefer.map((food, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reduce Columns */}
                    <div className="p-5 bg-orange-50/20 border border-orange-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span>✕</span> REDUCE / AVOID
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.foods.avoid.map((food, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Herb Dravyaguna Panel */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    🌿 CLASSICAL HERBS — DRAVYAGUNA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    These botanical herbs have been utilized for centuries to balance **{activeDosha.name}** dosha. Always consult a qualified Vaidya practitioner before initiating herbal protocols.
                  </p>

                  <div className="space-y-4">
                    {activeDosha.herbs.map((herb, idx) => (
                      <div key={idx} className="p-4 bg-white/60 border border-stone-200/40 rounded-2xl flex items-start gap-4 hover:border-secondary/30 transition-all duration-300">
                        <span className="text-3xl p-2 bg-stone-50 border border-stone-200/30 rounded-xl">{herb.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-serif italic text-base text-stone-900 font-bold">{herb.name}</h4>
                            <span className="text-[10px] text-stone-400 font-mono italic">{herb.sanskrit}</span>
                          </div>
                          <p className="text-xs text-stone-500 font-inter leading-relaxed mt-1">
                            {herb.use}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LIFESTYLE PANE */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Lifestyle Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    🌅 LIFESTYLE — VIHĀRA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    <strong>Principle:</strong> {activeDosha.lifestyle.principle}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 bg-emerald-50/20 border border-emerald-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <span>✓</span> FAVOUR
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.lifestyle.prefer.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-orange-50/20 border border-orange-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span>✕</span> REDUCE / AVOID
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.lifestyle.avoid.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Seasons Panel */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    🍂 SEASONAL GUIDANCE — RITUCHARYA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    Your **{activeDosha.name}** side requires specific seasonal adjustments to stay balanced year-round.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeDosha.seasons.map((season, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-3xl border transition-all duration-500 ${
                          season.active
                            ? 'bg-surface-container-low border-orange-300 shadow-sm'
                            : 'bg-white/50 border-stone-200/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{season.icon}</span>
                          <span className="font-serif italic font-bold text-stone-900 text-base">{season.name}</span>
                          {season.active && (
                            <span className="px-2 py-0.5 bg-secondary text-white text-[8px] font-mono font-bold uppercase rounded-full tracking-widest ml-auto">PEAK</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed font-inter">
                          {season.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RHYTHMS PANE */}
            {activeTab === 'rhythms' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Exercise Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    🏃 EXERCISE — VYĀYĀMA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    <strong>Principle:</strong> {activeDosha.exercise.principle}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 bg-emerald-50/20 border border-emerald-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <span>✓</span> FAVOUR
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.exercise.prefer.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-orange-50/20 border border-orange-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span>✕</span> REDUCE / AVOID
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.exercise.avoid.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dinacharya Rhythm Panel Checklists */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary font-semibold mb-3 block">
                    ⏰ DAILY RHYTHM — DINACHARYA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    Aligning your day to the dosha clock is one of Ayurveda&apos;s most powerful practices. Tap items to check off your daily synchronization.
                  </p>

                  <div className="space-y-3">
                    {activeDosha.rhythm.map((item, idx) => {
                      const chkId = `chk-${activeKey}-${idx}`;
                      const isChecked = !!checklist[chkId];
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleChecklist(chkId)}
                          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-surface-container-low border-secondary text-stone-900'
                              : 'bg-white/60 border-stone-200/40 text-stone-700 hover:border-secondary/30'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-secondary border-secondary text-white' : 'border-stone-300 bg-stone-50'
                            }`}>
                              {isChecked && <span className="text-[10px] font-bold">✓</span>}
                            </div>
                            <div className="flex-1">
                              <span className="text-[10px] font-mono font-bold tracking-wider block text-stone-400">{item.time}</span>
                              <span className={`text-xs font-inter leading-relaxed ${isChecked ? 'line-through text-stone-400 font-light' : 'font-medium'}`}>{item.action}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* JYOTISH PANE */}
            {activeTab === 'jyotish' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Birth Chart Overview Card */}
                <div className="w-full bg-[#1C1C1A] border border-stone-850 rounded-3xl p-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.3)] text-[#FAF6F0]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-tertiary font-bold mb-3 block">
                    JANMA KUNDALI · BIRTH CHART SUMMARY
                  </span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-6 border-y border-white/5 py-6">
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-stone-400">Sun Sign</div>
                      <div className="text-lg font-serif italic mt-1 text-[#FAF6F0]">{jyotish.sunSign.english}</div>
                      <div className="text-[9px] font-mono text-stone-500">{jyotish.sunSign.rashi} Rashi</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-stone-400">Moon Sign</div>
                      <div className="text-lg font-serif italic mt-1 text-[#FAF6F0]">{jyotish.moonSign.english}</div>
                      <div className="text-[9px] font-mono text-stone-500">{jyotish.moonSign.rashi} Rashi</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-stone-400">Ascendant</div>
                      <div className="text-lg font-serif italic mt-1 text-[#FAF6F0]">{jyotish.lagna.english}</div>
                      <div className="text-[9px] font-mono text-stone-500">{jyotish.lagna.rashi} Rashi</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-stone-400">Nakshatra</div>
                      <div className="text-lg font-serif italic mt-1 text-[#FAF6F0]">{jyotish.nakshatra}</div>
                    </div>
                  </div>

                  <p className="text-stone-300 text-sm font-serif italic leading-relaxed">
                    &ldquo;{jyotish.insightQuote}&rdquo;
                  </p>
                </div>

                {/* Prakriti & Jyotish Overlap Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-tertiary font-bold mb-3 block">
                    GRAHA-DOSHA SYNERGY · ELEMENTAL OVERLAP
                  </span>
                  
                  <p className="text-xs text-stone-500 font-inter leading-relaxed mb-6">
                    Ayurvedic constitutions (Prakriti) and Vedic astrology (Jyotish) are twin disciplines. Prakriti reflects the physical manifestation of elements, while Jyotish outlines their cosmic origins.
                  </p>

                  <div className="space-y-4">
                    {/* Vata Row */}
                    <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 block">VATA · AIR & ETHER</span>
                          <span className="text-xs font-mono text-stone-400">Governed by ☿ Mercury + ♀ Venus</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full font-mono text-xs font-bold">
                          Prakriti: {scores.Vata} pts
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-inter">
                        Mercury governs raw intellect and nervous flow (Vata), while Venus directs sensory refinement. 
                        {jyotish.sunSign.english === 'Gemini' || jyotish.moonSign.english === 'Gemini' ? (
                          <span className="text-tertiary font-medium ml-1">Your Gemini placement heightens Mercury&apos;s mental stimulation, correlating with your Vata scores.</span>
                        ) : (
                          <span className="text-stone-505 ml-1">Your birth placements show steady Vata mental resonance.</span>
                        )}
                      </p>
                    </div>

                    {/* Pitta Row */}
                    <div className="p-5 bg-tertiary/5 border border-[#C27A5D]/10 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-wider text-tertiary block">PITTA · FIRE</span>
                          <span className="text-xs font-mono text-stone-400">Governed by ☉ Sun + ♂ Mars</span>
                        </div>
                        <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full font-mono text-xs font-bold">
                          Prakriti: {scores.Pitta} pts
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-inter">
                        Sun represents raw metabolic fire (Agni), and Mars controls directional drive and transformation (Pitta).
                        {jyotish.sunSign.english === 'Aries' || jyotish.sunSign.english === 'Leo' ? (
                          <span className="text-tertiary font-medium ml-1">Your fiery solar placement fuels Agni directly, complementing your Pitta scores.</span>
                        ) : (
                          <span className="text-stone-505 ml-1">Your birth planets suggest a balanced metabolic fire.</span>
                        )}
                      </p>
                    </div>

                    {/* Kapha Row */}
                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-600 block">KAPHA · WATER & EARTH</span>
                          <span className="text-xs font-mono text-stone-400">Governed by ☽ Moon + ♃ Jupiter</span>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-650 rounded-full font-mono text-xs font-bold text-emerald-600">
                          Prakriti: {scores.Kapha} pts
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-inter">
                        Moon governs bodily fluids and emotional attachment (Kapha), while Jupiter expands wisdom and physical tissue.
                        {jyotish.moonSign.english === 'Scorpio' || jyotish.lagna.english === 'Cancer' ? (
                          <span className="text-tertiary font-medium ml-1">Your Lagna/Moon water elements add intuitive depth that grounds physical tissues.</span>
                        ) : (
                          <span className="text-stone-505 ml-1">Your planetary matrix supports stable Kapha expansion.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Disclaimer Block */}
            <p className="text-[10px] text-stone-400 font-mono text-center tracking-wider leading-relaxed mt-12 mb-8">
              🪷 Based on classical Charaka Samhita and Sushruta Samhita guidelines · for educational awareness only, not clinical medical diagnosis.
            </p>

            {/* Recalibrate / Retake bottom CTA */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8">
              <button
                onClick={handleRetake}
                className="flex-1 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] border border-stone-300 hover:border-stone-500 bg-white/40 text-stone-600 hover:text-stone-900 transition-all duration-300 cursor-pointer shadow-sm text-center"
              >
                ↺ RETAKE ANALYSIS
              </button>
              <button
                onClick={() => router.push(getNextStepRouteAndLabel().route)}
                className="flex-1 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-primary hover:bg-secondary text-white transition-all duration-300 cursor-pointer shadow-md text-center"
              >
                {getNextStepRouteAndLabel().label}
              </button>
            </div>

          </main>
        </div>

        <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
          <div>PHASE / CALIBRATION</div>
          <div>© OJAS RITUAL MMXXVI</div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-foreground flex flex-col justify-between selection:bg-secondary-fixed/20 transition-colors duration-500">
      <div>
        <Header />

        <main className="max-w-3xl mx-auto px-6 py-10 md:py-16 w-full animate-fade-rise">
          {/* Header Row: Eyebrow + Q Counter + Category */}
          <div className="flex flex-col mb-8 relative">
            <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 mb-3 block">
              PRAKRITI ASSESSMENT
            </span>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl md:text-[50px] font-serif text-secondary-fixed leading-none">
                Q {String(currentQuestion + 1).padStart(2, '0')} / {PRAKRITI_QUESTIONS.length}
              </h2>
              <div className="border border-white/20 rounded-full px-4 py-1.5 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
                {question.cat}
              </div>
            </div>
          </div>

          {/* Dotted Progress Bar */}
          <div className="w-full relative h-4 flex items-center mb-14">
            {/* Background track line */}
            <div className="absolute left-0 right-0 h-[2px] bg-white/10 z-0 rounded-full"></div>
            
            {/* Fill track line */}
            <div 
              className="absolute left-0 h-[2px] bg-secondary-fixed z-10 transition-all duration-700 rounded-full"
              style={{ width: `${(currentQuestion / (PRAKRITI_QUESTIONS.length - 1)) * 100}%` }}
            ></div>

            {/* Dots overlay */}
            <div className="absolute inset-0 flex justify-between items-center z-20">
              {PRAKRITI_QUESTIONS.map((_, idx) => {
                const isPassed = idx <= currentQuestion;
                const isCurrent = idx === currentQuestion;
                return (
                  <div 
                    key={idx}
                    className={`rounded-full transition-all duration-500 ${
                      isCurrent 
                        ? 'w-4 h-4 bg-secondary-fixed shadow-[0_0_12px_rgba(255,182,203,0.6)]' 
                        : isPassed 
                          ? 'w-2 h-2 bg-secondary-fixed' 
                          : 'w-1.5 h-1.5 bg-white/20'
                    }`}
                  ></div>
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-[28px] md:text-[34px] font-quote italic text-secondary-fixed mb-10 font-normal leading-snug max-w-2xl">
            {question.text}
          </h3>

          {/* Answer Options */}
          <div className="space-y-4 mb-6">
            {question.opts.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full px-6 py-5 text-left border rounded-[14px] transition-all duration-300 font-inter text-sm md:text-[15px] cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-white/5 border-secondary-fixed/60 text-white font-medium shadow-[0_0_20px_rgba(255,182,203,0.05)]'
                      : 'bg-transparent border-white/10 text-white/70 hover:border-white/30 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-secondary-fixed border-secondary-fixed' : 'border-white/40'
                  }`} />
                  <span className="leading-relaxed">{option.t}</span>
                </button>
              );
            })}
          </div>

          {/* Skip Button (Pill style) */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => handleSelectOption('skip')}
              className={`px-8 py-3.5 rounded-full border transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer ${
                selectedOption === 'skip'
                  ? 'border-secondary-fixed text-secondary-fixed bg-secondary-fixed/5 font-bold'
                  : 'border-white/20 text-white/70 hover:border-white/40'
              }`}
            >
              I CAN'T RELATE TO ANY OF THESE →
            </button>
          </div>

          {/* Skip Warning */}
          {(() => {
            const currentSkips = answers.filter(a => a === null).length + (selectedOption === 'skip' ? 1 : 0);
            if (currentSkips === 5) {
              return (
                <div className="mb-8 p-5 bg-white/5 border border-white/10 text-white/60 text-sm md:text-[15px] text-center rounded-[14px] font-quote italic animate-fade-rise">
                  Answer based on your natural tendency before stress or lifestyle changes — the more you answer, the more accurate your result.
                </div>
              );
            }
            return null;
          })()}

          {/* Footer Area: Fact Box + Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-white/10 pt-8 mt-4 min-h-[80px]">
            {/* Fact Text on the left */}
            <div className="max-w-[60%]">
              {selectedOption !== null && (
                <p className="font-mono text-[9px] text-white/40 tracking-widest leading-[1.8] animate-fade-rise">
                  {question.fact}
                </p>
              )}
            </div>

            {/* Navigation Buttons on the right */}
            <div className="flex items-center gap-4 flex-shrink-0 self-end">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className={`text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
                  currentQuestion === 0
                    ? 'text-white/20 cursor-not-allowed opacity-0 pointer-events-none'
                    : 'text-white/40 hover:text-white cursor-pointer'
                }`}
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`px-8 py-3.5 rounded-[12px] border transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${
                  selectedOption !== null
                    ? 'border-ojas-green text-ojas-green-dark bg-ojas-green-light hover:bg-ojas-cream cursor-pointer font-bold'
                    : 'border-white/10 text-white/20 cursor-not-allowed'
                }`}
              >
                {currentQuestion === PRAKRITI_QUESTIONS.length - 1 ? 'FINISH' : 'NEXT'} →
              </button>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-white/20 tracking-wider">
        <div>PHASE / ASSESSMENT</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}