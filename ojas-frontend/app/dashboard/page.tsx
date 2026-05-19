'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { usePrakritiStore } from '../store/prakritiStore';
import { useCycleStore } from '../store/cycleStore';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';
import { getRitualsForDosha, getTopThreeRituals } from '../utils/ritualsData';

// Custom, fine-line SVG Blooming Lotus Logo (replicated from design system)
const LotusLogo = ({ size = "lg", animated = true }) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-28 h-28"
  };

  return (
    <div className={`${sizes[size as keyof typeof sizes]} relative group ${animated ? 'animate-lotus-float' : ''}`}>
      <svg 
        className={`w-full h-full ${animated ? 'lotus-interactive' : ''}`}
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Center Petal */}
        <path 
          className="petal-center"
          d="M50,85 C50,85 42,65 50,50 C58,65 50,85 50,85Z" 
          fill="url(#centerGradient)"
          opacity="0"
          style={{ 
            animation: animated ? 'bloom-center 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
            transformOrigin: '50px 85px'
          }}
        />
        
        {/* Inner Left Petal */}
        <path 
          className="petal-left-inner"
          d="M50,85 C50,85 28,75 22,58 C34,52 44,70 50,85Z" 
          fill="url(#innerGradient)"
          opacity="0"
          style={{ 
            animation: animated ? 'bloom-left-inner 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none',
            transformOrigin: '50px 85px'
          }}
        />
        
        {/* Inner Right Petal */}
        <path 
          className="petal-right-inner"
          d="M50,85 C50,85 72,75 78,58 C66,52 56,70 50,85Z" 
          fill="url(#innerGradient)"
          opacity="0"
          style={{ 
            animation: animated ? 'bloom-right-inner 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none',
            transformOrigin: '50px 85px'
          }}
        />
        
        {/* Outer Left Petal */}
        <path 
          className="petal-left-outer"
          d="M50,85 C50,85 18,80 12,58 C28,48 40,68 50,85Z" 
          fill="url(#outerGradient)"
          opacity="0"
          style={{ 
            animation: animated ? 'bloom-left-outer 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none',
            transformOrigin: '50px 85px'
          }}
        />
        
        {/* Outer Right Petal */}
        <path 
          className="petal-right-outer"
          d="M50,85 C50,85 82,80 88,58 C72,48 60,68 50,85Z" 
          fill="url(#outerGradient)"
          opacity="0"
          style={{ 
            animation: animated ? 'bloom-right-outer 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none',
            transformOrigin: '50px 85px'
          }}
        />
        
        {/* Subtle Glow */}
        <circle 
          cx="50" 
          cy="55" 
          r="30" 
          fill="url(#glowGradient)" 
          opacity="0.25"
          className="animate-pulse"
        />
        
        <defs>
          <radialGradient id="centerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F5D0A9" />
            <stop offset="60%" stopColor="#C27A5D" />
            <stop offset="100%" stopColor="#A8573C" />
          </radialGradient>
          
          <radialGradient id="innerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#C27A5D" />
          </radialGradient>
          
          <radialGradient id="outerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#FDBA74" />
          </radialGradient>
          
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5D0A9" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#C27A5D" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const { prakriti, dominantPrakriti } = usePrakritiStore();
  const { cycle } = useCycleStore();
  const { currentEnergy, currentMood, dailyAffirmation } = useAppStore();
  const { user } = useUserStore();
  
  const [greeting, setGreeting] = useState("Good morning");

  // State for Live ML Model prediction
  const [predictedMood, setPredictedMood] = useState<number | null>(null);
  const [moodType, setMoodType] = useState<string>('');
  const [cycleDay, setCycleDay] = useState<number>(9);
  const [cyclePhase, setCyclePhase] = useState<string>('Follicular');
  const [moonPhase, setMoonPhase] = useState<string>('Waxing Crescent');
  const [moonIllumination, setMoonIllumination] = useState<number>(35);
  const [recommendedSongs, setRecommendedSongs] = useState<string[]>([]);

  // Derive Dominant Dosha string safely
  let dominantDoshaText = "Pitta";
  if (user?.dominantDosha) {
    dominantDoshaText = user.dominantDosha;
  } else if (dominantPrakriti) {
    dominantDoshaText = dominantPrakriti;
  } else if (prakriti) {
    const entries = Object.entries(prakriti);
    const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    dominantDoshaText = dominant.charAt(0).toUpperCase() + dominant.slice(1);
  }

  const allRituals = getRitualsForDosha(dominantDoshaText, cyclePhase, true);
  const topThreeRituals = getTopThreeRituals(allRituals);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch Live ML predictions based on stored cycle
  useEffect(() => {
    const fetchPrediction = async () => {
      const today = new Date();
      let day = 9;

      const length = cycle?.cycleLengthDays || 28;
      if (cycle && cycle.startDate) {
        const last = new Date(cycle.startDate);
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        day = (diffDays % length) + 1;
        if (day < 1) day = 1;
        if (day > length) day = length;
      }
      
      setCycleDay(day);

      try {
        const response = await fetch('http://localhost:5000/api/predict-mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cycle_day: day,
            date: today.toISOString().split('T')[0],
            estrogen: 50,
            prakriti: dominantDoshaText,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setPredictedMood(data.predicted_mood);
          setMoodType(data.mood_type);
          setCyclePhase(data.cycle_phase);
          setMoonPhase(data.moon_phase);
          setMoonIllumination(data.moon_illumination);
          if (data.recommended_songs) {
            setRecommendedSongs(data.recommended_songs);
          }
        }
      } catch (err) {
        console.warn("Dashboard Failed to fetch mood prediction, using offline math fallback: ", err);
        // Clean mock fallback
        const quarterLength = Math.floor(length / 4);
        let phase = 'Follicular';
        if (day <= 5) phase = 'Menstrual';
        else if (day <= quarterLength * 2) phase = 'Follicular';
        else if (day <= quarterLength * 2.5) phase = 'Ovulatory';
        else phase = 'Luteal';

        setCyclePhase(phase);
        setPredictedMood(7);
        setMoodType('Calm');
        setMoonPhase('Waxing Gibbous');
        setMoonIllumination(75);
      }
    };

    fetchPrediction();
  }, [cycle, dominantDoshaText]);

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  // Map values for Pitta/Vata/Kapha
  const vataVal = user?.doshaComposition?.vata || prakriti?.vata || 35;
  const pittaVal = user?.doshaComposition?.pitta || prakriti?.pitta || 45;
  const kaphaVal = user?.doshaComposition?.kapha || prakriti?.kapha || 20;

  return (
    <div className="min-h-screen bg-background text-foreground font-inter selection:bg-[#C27A5D]/10 flex flex-col justify-between transition-colors duration-500">
      <div>
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-14 w-full">
          {/* Main 2-Column Responsive Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-10 md:gap-14 items-start">
            
            {/* LEFT COLUMN: Logo, Greeting, Copy and Affirmation */}
            <div className="lg:col-span-5 flex flex-col gap-10 md:gap-12 animate-fade-rise">
              
              {/* Logo block */}
              <div className="flex flex-col gap-6 items-start">
                <LotusLogo size="xl" animated={true} />
                
                {/* Active Date Tag */}
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold">
                  {formattedDate}
                </div>

                {/* Main Editorial Greeting */}
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-instrument-serif text-[#1C1917] dark:text-[#FAF6F0] leading-[1.08] tracking-tight text-balance">
                  {greeting}, <span className="italic text-[#C27A5D]">{user?.name || "Ananya"}</span>. The <span className="italic">sun</span> finds you in <span className="italic">resonance</span>.
                </h1>

                {/* Subtext description */}
                <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed max-w-md">
                  Your vitality is peaking. Today is an invitation to move with the natural rhythm of your <strong className="text-stone-900 dark:text-[#FAF6F0]">{dominantDoshaText}</strong> constitution.
                </p>
              </div>

              {/* Daily Affirmation Card */}
              <Card className="w-full">
                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-4 font-semibold">
                  DAILY AFFIRMATION
                </div>
                <p className="text-lg md:text-xl font-instrument-serif italic text-stone-900 dark:text-stone-100 leading-relaxed">
                  &ldquo;{dailyAffirmation || "I am the container for infinite peace, rooted in the earth, reaching for the light."}&rdquo;
                </p>
              </Card>

            </div>

            {/* RIGHT COLUMN: Grid Cards, Timeline and Metrics */}
            <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8">
              
              {/* Top Row Grid (Energy, Mood, Cycle) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vitality/Energy Card */}
                <Card>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-2 font-semibold flex items-center justify-between">
                    <span>ENERGY</span>
                    <span className="text-[#C27A5D]">✦</span>
                  </div>
                  <div className="font-serif italic text-3xl font-semibold text-[#1C1917] dark:text-[#FAF6F0] mb-3">
                    {currentEnergy ? `${currentEnergy * 10}%` : "70%"}
                  </div>
                  {/* Styled terracotta linear progress line */}
                  <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C27A5D] rounded-full transition-all duration-1000"
                      style={{ width: currentEnergy ? `${currentEnergy * 10}%` : "70%" }}
                    />
                  </div>
                </Card>

                {/* Mood Card */}
                <Card>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-2 font-semibold flex items-center justify-between">
                    <span>ML MOOD SCORE</span>
                    <span className="text-[#C27A5D]">✦</span>
                  </div>
                  <div className="font-serif italic text-3xl font-semibold text-[#1C1917] dark:text-[#FAF6F0] mb-3">
                    {predictedMood !== null ? `${predictedMood}/10` : currentMood || "Reflective"}
                  </div>
                  <div className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                    {moodType ? `${moodType} Resonance` : "Reflective state"}
                  </div>
                </Card>

                {/* Cycle State Card */}
                <Card>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-2 font-semibold flex items-center justify-between">
                    <span>CYCLE STATE</span>
                    <span className="text-stone-300">✦</span>
                  </div>
                  <div className="font-serif italic text-3xl font-semibold text-[#1C1917] dark:text-[#FAF6F0] mb-2">
                    {cyclePhase}
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-4">
                    {cycle ? `Day ${cycleDay} of ${cycle.cycleLengthDays || 28}` : `Day ${cycleDay} of 28`}
                    {moonPhase && ` • ${moonPhase} (${moonIllumination.toFixed(0)}% ill.)`}
                  </div>
                  
                  {/* Link to full cycle page */}
                  <Link 
                    href="/cycle" 
                    className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors inline-block"
                  >
                    View Cosmic Alignment →
                  </Link>
                </Card>
              </div>

              {/* Middle Row: Seasonal Rhythm Card */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal">
                    Seasonal Rhythm
                  </h2>
                  <Link href="/cycle" className="text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-300 dark:border-stone-700 hover:text-stone-900 dark:hover:text-white transition-colors">
                    View details
                  </Link>
                </div>
                
                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-8 font-semibold">
                  CYCLE PHASE TIMELINE
                </div>

                {/* Timeline display */}
                <div className="relative pt-4 pb-2 px-2">
                  <div className="absolute top-[34px] left-0 right-0 h-0.5 bg-stone-200/60" />
                  <div className="relative flex justify-between">
                    {['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'].map((phase) => {
                      const isActive = cyclePhase 
                        ? (cyclePhase.toLowerCase() === phase.toLowerCase() || 
                           (cyclePhase.toLowerCase() === 'ovulation' && phase === 'Ovulatory'))
                        : phase === 'Follicular';
                      return (
                        <div key={phase} className="flex flex-col items-center">
                          {/* Timeline dot */}
                          <div 
                            className={`w-4 h-4 rounded-full border-2 bg-white dark:bg-stone-900 z-10 transition-all duration-500 mb-3 flex items-center justify-center ${
                              isActive 
                                ? 'border-[#C27A5D] scale-125 shadow-sm shadow-[#C27A5D]/20' 
                                : 'border-stone-300'
                            }`}
                          >
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C27A5D]" />}
                          </div>
                          {/* Timeline label */}
                          <p 
                            className={`text-[9px] md:text-[10px] font-mono uppercase tracking-[0.15em] transition-colors duration-500 ${
                              isActive ? 'text-[#C27A5D] font-semibold' : 'text-stone-400'
                            }`}
                          >
                            {phase}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Recommended Songs Card */}
              {recommendedSongs && recommendedSongs.length > 0 && (
                <Card>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-4 font-semibold">
                    🎵 ML MODEL RECOMMENDED FREQUENCIES
                  </div>
                  <div className="space-y-3">
                    {recommendedSongs.map((song, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-white/60 dark:bg-stone-900/40 rounded-2xl border border-stone-200/20 dark:border-stone-800 hover:border-[#C27A5D]/30 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <p className="font-serif text-stone-900 dark:text-[#FAF6F0] font-normal text-sm">
                            {song.split(' - ')[0] || song}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {song.split(' - ')[1] || 'Healing Frequencies'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 border border-orange-300/40 dark:border-orange-900/40 text-[#C27A5D] rounded-full">
                            Active Sync
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Link to full music sanctuary page */}
                  <div className="mt-5 pt-4 border-t border-stone-200/10 text-center">
                    <Link 
                      href="/music" 
                      className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors inline-block"
                    >
                      Open Sound Sanctuary →
                    </Link>
                  </div>
                </Card>
              )}

              {/* Bottom Row Grid (Ritual Space & Dosha Constitution) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ritual Space Card (Dynamic Top 3 Rituals) */}
                <div className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-800 rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(28,25,22,0.01)]">
                  <div>
                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] mb-5 font-semibold flex justify-between items-center">
                      <span>RITUAL SPACE — TODAY</span>
                      <span className="animate-pulse">● LIVE SYNC</span>
                    </div>
                    
                    <div className="space-y-4">
                      {topThreeRituals.map((ritual) => (
                        <div key={ritual.id} className="border-b border-orange-100/40 dark:border-stone-800 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono font-bold tracking-wider bg-[#C27A5D]/10 text-[#C27A5D] px-2 py-0.5 rounded">
                              {ritual.time}
                            </span>
                            <span className="text-[9px] font-mono text-stone-400">
                              {ritual.duration} MINS
                            </span>
                          </div>
                          <h4 className="font-serif italic text-stone-800 dark:text-stone-200 text-sm mt-1">
                            {ritual.activity}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {ritual.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-100/30 dark:border-stone-800 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#C27A5D]/75 tracking-wider uppercase">
                      — {dominantDoshaText.toUpperCase()} SYNCED
                    </span>
                    <Link 
                      href="/rituals" 
                      className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                      Open Full Routine →
                    </Link>
                  </div>
                </div>

                {/* Dosha Constitution Card */}
                <Card className="flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-6 font-semibold">
                      DOSHA CONSTITUTION
                    </div>
                    
                    {/* Dosha Progress Lines */}
                    <div className="flex flex-col gap-4">
                      {/* Pitta (Fire) */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-600 dark:text-stone-400">
                          <span>Pitta (Fire)</span>
                          <span className="font-semibold">{pittaVal}%</span>
                        </div>
                        <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#C27A5D] rounded-full transition-all duration-1000"
                            style={{ width: `${pittaVal}%` }}
                          />
                        </div>
                      </div>

                      {/* Vata (Air) */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-600 dark:text-stone-400">
                          <span>Vata (Air)</span>
                          <span className="font-semibold">{vataVal}%</span>
                        </div>
                        <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400/70 rounded-full transition-all duration-1000"
                            style={{ width: `${vataVal}%` }}
                          />
                        </div>
                      </div>

                      {/* Kapha (Earth) */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-600 dark:text-stone-400">
                          <span>Kapha (Earth)</span>
                          <span className="font-semibold">{kaphaVal}%</span>
                        </div>
                        <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600/70 rounded-full transition-all duration-1000"
                            style={{ width: `${kaphaVal}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recalibrate CTA Button */}
                  <Link href="/prakriti" className="mt-8">
                    <Button variant="primary" className="w-full">
                      RECALIBRATE
                    </Button>
                  </Link>

                </Card>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER SECTION */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>PHASE / WAXING CRESCENT</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}