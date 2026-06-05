'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { usePrakritiStore } from '../store/prakritiStore';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { useRouter } from 'next/navigation';
import { getJyotishProfile } from '../utils/jyotishData';
import { PrakritiResult } from '../components/flows/PrakritiResult';


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
    return <PrakritiResult />;
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