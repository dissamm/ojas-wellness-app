'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { usePrakritiStore } from '../store/prakritiStore';
import { useUserStore } from '../store/userStore';
import { calculatePercentagesFromScores, getDominantDosha } from './utils';
import { PrakritiQuiz } from '../components/prakriti/PrakritiQuiz';
import { PrakritiResults } from '../components/prakriti/PrakritiResults';

export default function PrakritiPage() {
  const { setPrakriti } = usePrakritiStore();
  const { user, setDoshaComposition } = useUserStore();
  
  const [submitted, setSubmitted] = useState(false);

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
          setSubmitted(true);
        }
      }
    }
  }, [user]);

  const handleSubmit = (finalScores: { Vata: number; Pitta: number; Kapha: number }) => {
    const calculatedPrakriti = calculatePercentagesFromScores(finalScores);
    const dominantPrakriti = getDominantDosha(calculatedPrakriti);

    setPrakriti(calculatedPrakriti);
    setDoshaComposition(calculatedPrakriti, dominantPrakriti);
    setSubmitted(true);
  };

  if (submitted) {
    return <PrakritiResults />;
  }

  return (
    <div className="min-h-screen bg-transparent text-surface-cream flex flex-col justify-between selection:bg-secondary-fixed/20 transition-colors duration-500">
      <div>
        <Header />
        <PrakritiQuiz onComplete={handleSubmit} />
      </div>

      <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-white/20 tracking-wider">
        <div>PHASE / ASSESSMENT</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}