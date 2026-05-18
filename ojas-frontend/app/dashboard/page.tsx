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

// Custom, fine-line SVG Blooming Lotus Logo (replicated from design system)
const LotusLogo = ({ size = "lg", animated = true }) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-28 h-28"
  };

  return (
    <div className={`${sizes[size as keyof typeof sizes]} relative group`}>
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
          style={{ animation: animated ? 'bloom-center 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none' }}
        />
        
        {/* Inner Left Petal */}
        <path 
          className="petal-left-inner"
          d="M50,85 C50,85 28,75 22,58 C34,52 44,70 50,85Z" 
          fill="url(#innerGradient)"
          opacity="0"
          style={{ animation: animated ? 'bloom-left-inner 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none' }}
        />
        
        {/* Inner Right Petal */}
        <path 
          className="petal-right-inner"
          d="M50,85 C50,85 72,75 78,58 C66,52 56,70 50,85Z" 
          fill="url(#innerGradient)"
          opacity="0"
          style={{ animation: animated ? 'bloom-right-inner 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none' }}
        />
        
        {/* Outer Left Petal */}
        <path 
          className="petal-left-outer"
          d="M50,85 C50,85 18,80 12,58 C28,48 40,68 50,85Z" 
          fill="url(#outerGradient)"
          opacity="0"
          style={{ animation: animated ? 'bloom-left-outer 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none' }}
        />
        
        {/* Outer Right Petal */}
        <path 
          className="petal-right-outer"
          d="M50,85 C50,85 82,80 88,58 C72,48 60,68 50,85Z" 
          fill="url(#outerGradient)"
          opacity="0"
          style={{ animation: animated ? 'bloom-right-outer 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none' }}
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
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#DF8060" />
            <stop offset="100%" stopColor="#E07A5F" />
          </radialGradient>
          
          <radialGradient id="innerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#DF8060" />
          </radialGradient>
          
          <radialGradient id="outerGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#FDBA74" />
          </radialGradient>
          
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#DF8060" stopOpacity="0"/>
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

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  // Map values for Pitta/Vata/Kapha
  const vataVal = prakriti?.vata ?? 35;
  const pittaVal = prakriti?.pitta ?? 45;
  const kaphaVal = prakriti?.kapha ?? 20;

  // Derive Dominant Dosha string safely
  let dominantDoshaText = "Pitta-Vata";
  if (dominantPrakriti) {
    dominantDoshaText = dominantPrakriti;
  } else if (prakriti) {
    const entries = Object.entries(prakriti);
    const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    dominantDoshaText = dominant.charAt(0).toUpperCase() + dominant.slice(1);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-inter selection:bg-[#DF8060]/10 flex flex-col justify-between">
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
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#DF8060] font-semibold">
                  {formattedDate}
                </div>

                {/* Main Editorial Greeting */}
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-instrument-serif text-[#1C1917] leading-[1.08] tracking-tight text-balance">
                  {greeting}, <span className="italic text-[#DF8060]">{user?.name || "Ananya"}</span>. The <span className="italic">sun</span> finds you in <span className="italic">resonance</span>.
                </h1>

                {/* Subtext description */}
                <p className="text-stone-500 font-inter text-sm md:text-base leading-relaxed max-w-md">
                  Your vitality is peaking. Today is an invitation to move with the natural rhythm of your <strong className="text-stone-900">{dominantDoshaText}</strong> constitution.
                </p>
              </div>

              {/* Daily Affirmation Card */}
              <Card className="w-full">
                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-4 font-semibold">
                  DAILY AFFIRMATION
                </div>
                <p className="text-lg md:text-xl font-instrument-serif italic text-stone-900 leading-relaxed">
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
                    <span className="text-[#DF8060]">✦</span>
                  </div>
                  <div className="font-serif italic text-3xl font-semibold text-[#1C1917] mb-3">
                    {currentEnergy ? `${currentEnergy * 10}%` : "70%"}
                  </div>
                  {/* Styled terracotta linear progress line */}
                  <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#DF8060] rounded-full transition-all duration-1000"
                      style={{ width: currentEnergy ? `${currentEnergy * 10}%` : "70%" }}
                    />
                  </div>
                </Card>

                {/* Mood Card */}
                <Card>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-2 font-semibold flex items-center justify-between">
                    <span>MOOD</span>
                    <span className="text-stone-300">✦</span>
                  </div>
                  <div className="font-serif italic text-3xl font-semibold text-[#1C1917] mb-3">
                    {currentMood || "Reflective"}
                  </div>
                  {/* Decorative three warm dots at bottom */}
                  <div className="flex gap-1.5 pt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DF8060]/75" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/75" />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  </div>
                </Card>

                {/* Cycle State Card */}
                <Card>
                  <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-2 font-semibold flex items-center justify-between">
                    <span>CYCLE</span>
                    <span className="text-stone-300">✦</span>
                  </div>
                  <div className="font-serif italic text-3xl font-semibold text-[#1C1917] mb-2">
                    {cycle?.currentPhase || "Follicular"}
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    {cycle ? `Day ${cycle.dayInCycle} of ${cycle.cycleLengthDays || 28}` : "Day 09 of 28"}
                  </div>
                </Card>
              </div>

              {/* Middle Row: Seasonal Rhythm Card */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif italic text-2xl text-stone-900 font-normal">
                    Seasonal Rhythm
                  </h2>
                  <Link href="/cycle" className="text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-300 hover:text-stone-900 transition-colors">
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
                      const isActive = cycle?.currentPhase ? cycle.currentPhase === phase : phase === 'Follicular';
                      return (
                        <div key={phase} className="flex flex-col items-center">
                          {/* Timeline dot */}
                          <div 
                            className={`w-4 h-4 rounded-full border-2 bg-white z-10 transition-all duration-500 mb-3 flex items-center justify-center ${
                              isActive 
                                ? 'border-[#DF8060] scale-125 shadow-sm shadow-[#DF8060]/20' 
                                : 'border-stone-300'
                            }`}
                          >
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#DF8060]" />}
                          </div>
                          {/* Timeline label */}
                          <p 
                            className={`text-[9px] md:text-[10px] font-mono uppercase tracking-[0.15em] transition-colors duration-500 ${
                              isActive ? 'text-[#DF8060] font-semibold' : 'text-stone-400'
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

              {/* Bottom Row Grid (Ritual Space & Dosha Constitution) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ritual Space Card (Solid warm peach background block) */}
                <div className="bg-[#FDF6EC] border border-orange-100/50 rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(28,25,22,0.01)]">
                  <div>
                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF8060] mb-4 font-semibold">
                      RITUAL SPACE
                    </div>
                    <p className="text-sm md:text-base font-inter italic text-[#8A5A44] leading-relaxed">
                      &ldquo;The secret of health for both mind and body is not to mourn for the past, nor to worry about the future, but to live the present moment wisely and earnestly.&rdquo;
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-[#DF8060]/75 tracking-wider uppercase mt-6">
                    — DAILY PRACTICE
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
                        <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-600">
                          <span>Pitta (Fire)</span>
                          <span className="font-semibold">{pittaVal}%</span>
                        </div>
                        <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#DF8060] rounded-full transition-all duration-1000"
                            style={{ width: `${pittaVal}%` }}
                          />
                        </div>
                      </div>

                      {/* Vata (Air) */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-600">
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
                        <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-600">
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