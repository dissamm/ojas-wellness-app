'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { usePrakritiStore } from '../store/prakritiStore';
import { useCycleStore } from '../store/cycleStore';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';
import { getRitualsForDosha, getTopThreeRituals } from '../utils/ritualsData';
import { useMoodPrediction } from '../lib/api';
import { getDominantDoshaLabel } from '../lib/dominantDosha';
import { Disclaimer } from '../components/Disclaimer';
import { SleepCheckinModal } from '../components/SleepCheckinModal';
import { useSleepStore, SleepLog } from '../store/sleepStore';

// Custom, fine-line SVG Blooming Lotus Logo
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
            <stop offset="60%" stopColor="#c06080" />
            <stop offset="100%" stopColor="#A8573C" />
          </radialGradient>
          
          <radialGradient id="innerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#c06080" />
          </radialGradient>
          
          <radialGradient id="outerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#FDBA74" />
          </radialGradient>
          
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5D0A9" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#c06080" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { prakriti, dominantPrakriti } = usePrakritiStore();
  const { cycle } = useCycleStore();
  const { currentEnergy, currentMood, dailyAffirmation } = useAppStore();
  const { user } = useUserStore();
  
  const dominantDoshaText = getDominantDoshaLabel(user, prakriti, dominantPrakriti);
  
  const [greeting, setGreeting] = useState("Good morning");

  // ── Sleep check-in state ──────────────────────────────────────
  const { hasDoneCheckinToday, getTodayLog } = useSleepStore();
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [sleepModalSkipped, setSleepModalSkipped] = useState(false);
  const [todaySleepLog, setTodaySleepLog] = useState<SleepLog | null>(null);

  // Client-side sequential onboarding guards
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    if (user && user.name) {
      // 1. Check Prakriti
      const hasPrakriti = localStorage.getItem('prakriti') || user.dominantDosha;
      if (!hasPrakriti) {
        router.replace('/prakriti');
        return;
      }

      // 2. Check Cycle (if female)
      if (user.gender !== 'male') {
        const hasCycle = cycle?.startDate || user.menstrualCycleStart;
        if (!hasCycle) {
          router.replace('/cycle');
          return;
        }
      }

      // 3. Check Music
      const hasMusic = (user.musicPreferences && user.musicPreferences.length > 0) || localStorage.getItem('musicPreferencesSet') === 'true';
      if (!hasMusic) {
        router.replace('/music');
        return;
      }
    }
  }, [user, cycle, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Auto-show sleep modal in morning window if not done today
    if (hour >= 5 && hour < 11 && !hasDoneCheckinToday()) {
      const skippedKey = `ojas_sleep_skipped_${new Date().toISOString().slice(0, 10)}`;
      if (!localStorage.getItem(skippedKey)) {
        setTimeout(() => setShowSleepModal(true), 1200);
      } else {
        setSleepModalSkipped(true);
      }
    }
    // Load today's log if it exists
    const existing = getTodayLog();
    if (existing) setTodaySleepLog(existing);
  }, []);

  const handleSleepModalClose = () => {
    setShowSleepModal(false);
    const skippedKey = `ojas_sleep_skipped_${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(skippedKey, 'true');
    setSleepModalSkipped(true);
  };

  const handleSleepComplete = (log: SleepLog) => {
    setTodaySleepLog(log);
    setSleepModalSkipped(false);
  };

  const {
    predictedMood,
    cycleDay,
    cyclePhase,
    moonPhase,
  } = useMoodPrediction(cycle, dominantDoshaText);

  const allRituals = getRitualsForDosha(dominantDoshaText, cyclePhase, user?.gender !== 'male');
  const topThreeRituals = getTopThreeRituals(allRituals);

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  // Map values for Pitta/Vata/Kapha
  const vataVal = user?.doshaComposition?.vata || prakriti?.vata || 35;
  const pittaVal = user?.doshaComposition?.pitta || prakriti?.pitta || 45;
  const kaphaVal = user?.doshaComposition?.kapha || prakriti?.kapha || 20;



  const getDinacharyaPhase = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return { phase: "Kapha (Stabilizing)", tip: "Ideal for steady physical work, light exercise, and grounding routines." };
    if (hour >= 10 && hour < 14) return { phase: "Pitta (Transformation)", tip: "Highest solar fire. Perfect time for your largest meal and complex problem-solving." };
    if (hour >= 14 && hour < 18) return { phase: "Vata (Activity)", tip: "High mental agility. Focus on creative pursuits, communication, and brainstorming." };
    if (hour >= 18 && hour < 22) return { phase: "Kapha (Restoration)", tip: "Wind down, eat a light dinner, and prepare for deep cellular rest." };
    return { phase: "Brahma Muhurta / Cleanse", tip: "Internal renewal. Ideal for meditation, deep sleep, and spiritual aligning." };
  };

  const musicPrefs = user?.musicPreferences && user.musicPreferences.length > 0
    ? user.musicPreferences.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")
    : "Solfeggio Frequencies & Calibrated Indie Pop";

  // Sleep depth display helpers
  const DEPTH_ICONS: Record<string, string> = { restless:'🌑', light:'🌒', deep:'🌕', dreamless:'🌙' };
  const DREAM_LABELS: Record<string, string> = { vivid:'Vivid', anxious:'Anxious', peaceful:'Peaceful', intense:'Intense', confusing:'Confusing', nodreams:'No Dreams' };

  return (
    <>
    {/* Sleep check-in modal */}
    {showSleepModal && (
      <SleepCheckinModal
        userName={user?.name || 'friend'}
        dominantDosha={dominantDoshaText}
        moonPhase={moonPhase || 'Waning Crescent'}
        onClose={handleSleepModalClose}
        onComplete={handleSleepComplete}
      />
    )}

    <div className="min-h-screen bg-background text-foreground font-inter selection:bg-[#c06080]/10 flex flex-col justify-between transition-colors duration-500">
      <div>
        <Header />
        <Disclaimer className="mt-6 -mb-4" />
        
        <main className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-14 w-full">


          {/* Main 2-Column Responsive Layout Grid */}
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Logo, Greeting, Copy, Affirmation, and Constitution */}
            <div className="flex flex-col gap-8">
              
              {/* Logo block */}
              <div className="flex flex-col gap-6 items-start">
                <LotusLogo size="xl" animated={true} />
                
                {/* Active Date Tag */}
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#c06080] font-semibold">
                  {formattedDate}
                </div>

                {/* Main Editorial Greeting */}
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-instrument-serif text-[#1C1917] dark:text-[#FAF6F0] leading-[1.08] tracking-tight text-balance">
                  {greeting}, <span className="italic text-[#c06080]">{user?.name || "friend"}</span>. The <span className="italic">sun</span> finds you in <span className="italic">resonance</span>.
                </h1>

                {/* Subtext description */}
                <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed max-w-md">
                  Your vitality is peaking. Today is an invitation to move with the natural rhythm of your <strong className="text-stone-900 dark:text-[#FAF6F0]">{dominantDoshaText}</strong> constitution.
                </p>
              </div>

              {/* Daily Affirmation: Typographic block */}
              <div className="w-full border-l border-[#c06080]/30 pl-6 py-2 select-none">
                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 dark:text-stone-550 mb-2 font-semibold">
                  DAILY AFFIRMATION
                </div>
                <p className="text-xl md:text-2xl font-instrument-serif italic text-stone-905 dark:text-stone-100 leading-relaxed">
                  &ldquo;{dailyAffirmation || "I am the container for infinite peace, rooted in the earth, reaching for the light."}&rdquo;
                </p>
              </div>

              <div className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-[28px] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold">
                    LAST NIGHT · SLEEP LOG
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                    {moonPhase || 'Waning Crescent'}
                  </span>
                </div>

                {todaySleepLog ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {todaySleepLog.sleepDepth && (
                        <span className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border bg-white/60 dark:bg-stone-900/50 border-stone-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                          {DEPTH_ICONS[todaySleepLog.sleepDepth]} {todaySleepLog.sleepDepth}
                        </span>
                      )}
                      {todaySleepLog.hoursSlept && (
                        <span className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border bg-white/60 dark:bg-stone-900/50 border-stone-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                          {todaySleepLog.hoursSlept}h slept
                        </span>
                      )}
                      {todaySleepLog.dreamThemes[0] && (
                        <span className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border bg-white/60 dark:bg-stone-900/50 border-stone-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                          {DREAM_LABELS[todaySleepLog.dreamThemes[0]]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                      {dominantDoshaText} elevated — evening wind-down rituals recommended tonight.
                    </p>
                    <Link
                      href="/sleep"
                      className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                      Open Sleep History →
                    </Link>
                  </>
                ) : sleepModalSkipped ? (
                  <button
                    onClick={() => { setSleepModalSkipped(false); setShowSleepModal(true); }}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    ☽ Log last night&apos;s sleep →
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSleepModal(true)}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    ☽ How did you sleep last night? →
                  </button>
                )}
              </div>



            </div>

            {/* RIGHT COLUMN: Grid Cards, Timeline and Metrics */}
            <div className="flex flex-col gap-8">
              
              {/* Seasonal Rhythm Card */}
              {user?.gender !== 'male' ? (
                <Card>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-serif italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal mb-1">
                        {cyclePhase} Phase
                      </h2>
                      <p className="text-xs text-stone-555 dark:text-stone-400 leading-relaxed font-inter">
                        Day {cycleDay} of {cycle?.cycleLengthDays || 28}. Aligned with {moonPhase || 'Moon cycles'}.
                      </p>
                    </div>
                    <Link href="/cycle" className="text-[10px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition-colors">
                      View details
                    </Link>
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-serif italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal mb-1">
                        {getDinacharyaPhase().phase}
                      </h2>
                      <p className="text-xs text-stone-555 dark:text-stone-400 leading-relaxed font-inter">
                        {getDinacharyaPhase().tip}
                      </p>
                    </div>
                    <Link href="/prakriti" className="text-[10px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition-colors">
                      View details
                    </Link>
                  </div>
                </Card>
              )}

              {/* Ritual Space widget */}
              <div className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-[32px] p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(28,25,22,0.01)] transition-all duration-300">
                <div>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#c06080] mb-6 font-semibold flex justify-between items-center">
                    <span>RIGHT NOW</span>
                    <span className="animate-pulse">● LIVE SYNC</span>
                  </div>
                  
                  <div className="flex flex-col gap-6 divide-y divide-orange-100/30 dark:divide-stone-800">
                    {(() => {
                      const currentHour = new Date().getHours();
                      const currentMinutes = new Date().getMinutes();
                      const currentTime = currentHour + currentMinutes / 60;
                      
                      const parseTime = (timeStr: string) => {
                        const [time, period] = timeStr.split(' ');
                        let [h, m] = time.split(':').map(Number);
                        if (period === 'PM' && h !== 12) h += 12;
                        if (period === 'AM' && h === 12) h = 0;
                        return h + m / 60;
                      };

                      let closestRitual = topThreeRituals[0];
                      if (topThreeRituals.length > 0) {
                        closestRitual = topThreeRituals.reduce((closest, current) => {
                          const closestDiff = Math.abs(parseTime(closest.time) - currentTime);
                          const currentDiff = Math.abs(parseTime(current.time) - currentTime);
                          return currentDiff < closestDiff ? current : closest;
                        });
                      }

                      if (!closestRitual) return null;
                      
                      return (
                        <div key={closestRitual.id} className="pt-6 first:pt-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono font-bold tracking-wider bg-[#c06080]/10 text-[#c06080] px-2 py-0.5 rounded">
                              {closestRitual.time}
                            </span>
                            <span className="text-[9px] font-mono text-stone-400">
                              {closestRitual.duration} MINS
                            </span>
                          </div>
                          <h4 className="font-serif italic text-stone-800 dark:text-stone-200 text-sm mt-1">
                            {closestRitual.activity}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                            {closestRitual.description}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-orange-150/20 dark:border-stone-800 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#c06080]/75 tracking-wider uppercase">
                    — {dominantDoshaText.toUpperCase()} SYNCED
                  </span>
                  <Link
                    href="/aahar"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#C27A5D] border-b border-[#C27A5D]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    Log Aahar →
                  </Link>
                  <Link 
                    href="/rituals" 
                    className="text-[10px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
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
                          className="h-full bg-[#c06080] rounded-full transition-all duration-1000"
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
                          className="h-full bg-blue-450/70 dark:bg-blue-400/70 rounded-full transition-all duration-1000"
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
        </main>
      </div>

      {/* FOOTER SECTION */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>PHASE / WAXING CRESCENT</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
    </>
  );
}