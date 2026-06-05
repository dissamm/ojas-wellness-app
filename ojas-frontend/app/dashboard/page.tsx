'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrakritiStore } from '../store/prakritiStore';
import { useCycleStore } from '../store/cycleStore';
import { useAppStore } from '../store/appStore';
import { useUserStore } from '../store/userStore';
import { getRitualsForDosha, getTopThreeRituals } from '../utils/ritualsData';
import { useMoodPrediction } from '../lib/api';
import { getDominantDoshaLabel } from '../lib/dominantDosha';
import { SleepCheckinModal } from '../components/SleepCheckinModal';
import { useSleepStore, SleepLog } from '../store/sleepStore';

export default function Dashboard() {
  const router = useRouter();
  const { prakriti, dominantPrakriti } = usePrakritiStore();
  const { cycle } = useCycleStore();
  const { currentEnergy, currentMood, dailyAffirmation } = useAppStore();
  const { user } = useUserStore();
  
  const dominantDoshaText = getDominantDoshaLabel(user, prakriti, dominantPrakriti);
  
  const [greeting, setGreeting] = useState("Good morning");

  // Sleep check-in state
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
      const hasPrakriti = localStorage.getItem('prakriti') || user.dominantDosha;
      if (!hasPrakriti) {
        router.replace('/prakriti');
        return;
      }

      if (user.gender !== 'male') {
        const hasCycle = cycle?.startDate || user.menstrualCycleStart;
        if (!hasCycle) {
          router.replace('/cycle');
          return;
        }
      }

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

    if (hour >= 5 && hour < 11 && !hasDoneCheckinToday()) {
      const skippedKey = `ojas_sleep_skipped_${new Date().toISOString().slice(0, 10)}`;
      if (!localStorage.getItem(skippedKey)) {
        setTimeout(() => setShowSleepModal(true), 1200);
      } else {
        setSleepModalSkipped(true);
      }
    }
    const existing = getTodayLog();
    if (existing) setTodaySleepLog(existing);
  }, [hasDoneCheckinToday, getTodayLog]);

  // Observer for reveal animations
  useEffect(() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el, index) => {
        if (!(el as HTMLElement).style.transitionDelay) {
            (el as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        }
        observer.observe(el);
    });
    
    return () => observer.disconnect();
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
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  const vataVal = user?.doshaComposition?.vata || prakriti?.vata || 35;
  const pittaVal = user?.doshaComposition?.pitta || prakriti?.pitta || 45;
  const kaphaVal = user?.doshaComposition?.kapha || prakriti?.kapha || 20;
  
  // Calculate aura resonance (just a visual metric based on the highest dosha)
  const maxDoshaVal = Math.max(vataVal, pittaVal, kaphaVal);
  const resonanceScore = Math.min(99, Math.max(50, maxDoshaVal + 30));

  const getDinacharyaPhase = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return { phase: "Kapha Phase", tip: "PEAK STABILITY", vibe: "Grounding & Focus" };
    if (hour >= 10 && hour < 14) return { phase: "Pitta Phase", tip: "PEAK ENERGY", vibe: "Action & Clarity" };
    if (hour >= 14 && hour < 18) return { phase: "Vata Phase", tip: "PEAK CREATIVITY", vibe: "Flow & Ideas" };
    if (hour >= 18 && hour < 22) return { phase: "Kapha Phase", tip: "WIND DOWN", vibe: "Restoration" };
    return { phase: "Brahma Muhurta", tip: "SPIRITUAL RENEWAL", vibe: "Deep Peace" };
  };

  const dinacharya = getDinacharyaPhase();
  const displayPhase = user?.gender !== 'male' ? `${cyclePhase} Phase` : dinacharya.phase;
  const displayTip = user?.gender !== 'male' ? `DAY ${cycleDay} OF ${cycle?.cycleLengthDays || 28}` : 'DAILY RHYTHM';
  const displayBadge = user?.gender !== 'male' ? 'HORMONAL SHIFT' : dinacharya.tip;
  const displayVibe = currentMood || dinacharya.vibe;

  const formatRitualTime = (timeStr: string) => timeStr;

  return (
    <>
      {showSleepModal && (
        <SleepCheckinModal
          userName={user?.name || 'friend'}
          dominantDosha={dominantDoshaText}
          moonPhase={moonPhase || 'Waning Crescent'}
          onClose={handleSleepModalClose}
          onComplete={handleSleepComplete}
        />
      )}

      <div className="ambient-glow min-h-screen">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl">
          <div className="flex justify-between items-center px-4 md:px-margin-desktop py-unit max-w-container-max mx-auto">
            <div className="font-display-lg text-primary dark:text-inverse-primary tracking-tighter" style={{ fontSize: '32px' }}>OJAS</div>
            <div className="hidden md:flex items-center gap-gutter">
              <Link href="/prakriti" className="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-inverse-primary border-b-2 border-secondary-container pb-1 transition-colors duration-300">Analysis</Link>
              <Link href="/cycle" className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant/70 hover:text-secondary transition-colors duration-300">Lunar Sync</Link>
              <Link href="/rituals" className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant/70 hover:text-secondary transition-colors duration-300">Journey</Link>
            </div>
            <div className="flex items-center gap-stack-md">
              <button className="text-primary hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-primary hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="pt-32 pb-stack-xl max-w-container-max mx-auto px-4 md:px-margin-desktop">
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row items-start justify-between mb-stack-xl reveal active" style={{ transitionDelay: '0s' }}>
            <div className="w-full md:w-2/3">
              <div className="mb-stack-sm lotus-float w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#ffffff"></stop>
                      <stop offset="100%" stopColor="#feb5ca"></stop>
                    </radialGradient>
                  </defs>
                  {/* Outer Petals */}
                  <path d="M50 85C35 85 20 70 20 55C20 40 50 15 50 15C50 15 80 40 80 55C80 70 65 85 50 85Z" fill="url(#petalGradient)" fillOpacity="0.6"></path>
                  {/* Inner Petals */}
                  <path d="M50 80C40 80 30 70 30 60C30 50 50 30 50 30C50 30 70 50 70 60C70 70 60 80 50 80Z" fill="#feb5ca"></path>
                  {/* Center Accent */}
                  <circle cx="50" cy="60" r="6" fill="#fbf9f5" stroke="#864d5f" strokeWidth="1"></circle>
                  <circle cx="50" cy="60" r="2" fill="#864d5f"></circle>
                </svg>
              </div>
              <h1 className="font-display-lg text-[40px] md:text-display-lg text-primary leading-none mb-unit hover:tracking-tight transition-all duration-700">
                {greeting}, {user?.name || "friend"}
              </h1>
              <p className="font-body-lg text-body-lg italic text-secondary-container mix-blend-multiply">
                The sun finds you in resonance.
              </p>
            </div>
            <div className="mt-stack-md md:mt-0 md:text-right reveal active" style={{ transitionDelay: '0.2s' }}>
              <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">PHASE: {moonPhase ? moonPhase.toUpperCase() : 'GIBBOUS MOON'}</span>
              <div className="font-headline-sm text-headline-sm text-primary">{formattedDate}</div>
            </div>
          </section>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            {/* Left Column (4 columns) */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              {/* Daily Affirmation */}
              <div className="reveal bg-surface-container-low p-stack-md border-l-4 border-secondary-container active" style={{ transitionDelay: '0.1s' }}>
                <span className="font-label-caps text-label-caps text-secondary mb-unit block">AFFIRMATION</span>
                <blockquote className="font-quote text-quote text-primary leading-relaxed">
                  "{dailyAffirmation || "I am the container for infinite peace, allowing the rhythm of the universe to guide my breath."}"
                </blockquote>
              </div>

              {/* Sleep Log */}
              <div 
                className="reveal bg-surface-container-high p-stack-md rounded-lg active cursor-pointer hover:shadow-md transition-all" 
                style={{ transitionDelay: '0.2s' }}
                onClick={() => { if (!todaySleepLog) setShowSleepModal(true); else router.push('/sleep'); }}
              >
                <div className="flex justify-between items-center mb-stack-md">
                  <h3 className="font-label-caps text-label-caps text-primary">SLEEP LOG</h3>
                  <span className="material-symbols-outlined text-primary">nights_stay</span>
                </div>
                
                {todaySleepLog ? (
                  <>
                    <div className="flex items-end gap-stack-sm mb-unit">
                      <div className="font-display-lg text-primary" style={{ fontSize: '48px' }}>{todaySleepLog.hoursSlept || 0}</div>
                      <div className="font-label-md text-label-md text-on-surface-variant pb-2">HOURS</div>
                    </div>
                    <div className="flex items-center gap-unit">
                      <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                      <div className="h-1 flex-1 bg-outline-variant rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-container" style={{ width: todaySleepLog.sleepDepth === 'deep' ? '82%' : todaySleepLog.sleepDepth === 'light' ? '40%' : '15%' }}></div>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase">{todaySleepLog.sleepDepth === 'deep' ? '82% DEPTH' : todaySleepLog.sleepDepth === 'light' ? '40% DEPTH' : '15% DEPTH'}</span>
                    </div>
                    <div className="mt-stack-md flex justify-between text-on-surface-variant">
                      <div className="flex items-center gap-unit group">
                        <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">bedtime</span>
                        <span className="font-label-md text-label-md uppercase">{todaySleepLog.dreamThemes[0] || '10:45 PM'}</span>
                      </div>
                      <div className="flex items-center gap-unit group">
                        <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">wb_sunny</span>
                        <span className="font-label-md text-label-md">06:10 AM</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <span className="font-label-caps text-secondary">TAP TO LOG SLEEP</span>
                  </div>
                )}
              </div>

              {/* Featured Image Card */}
              <div className="reveal bg-surface-container-low/40 backdrop-blur-md p-stack-md rounded-xl border border-outline-variant/30 flex flex-col items-center justify-center text-center min-h-[320px] relative overflow-hidden active cursor-pointer group" style={{ transitionDelay: '0.3s' }} onClick={() => router.push('/rituals')}>
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-primary/5 pointer-events-none group-hover:opacity-75 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col items-center gap-stack-md">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="absolute w-12 h-12 bg-secondary-container/20 rounded-full animate-pulse"></div>
                    <span className="material-symbols-outlined text-secondary text-headline-md lotus-float">spa</span>
                  </div>
                  <div className="space-y-unit">
                    <span className="font-label-caps text-label-caps text-secondary tracking-widest block">MEDITATION</span>
                    <h4 className="font-headline-sm text-headline-sm text-primary uppercase tracking-tight">Morning Resonance</h4>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant italic max-w-[200px]">
                    Align your frequency with the dawn's stillness.
                  </p>
                  <button className="mt-stack-sm px-stack-md py-2 bg-primary text-white font-label-caps text-label-caps rounded-full hover:bg-primary-container transition-all flex items-center gap-unit group-hover:shadow-lg">
                    BEGIN PRACTICE
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">play_arrow</span>
                  </button>
                </div>
              </div>

              {/* Decorative Kitten Card */}
              <div className="reveal bg-surface-container-low/30 backdrop-blur-md p-stack-md rounded-xl border border-outline-variant/20 flex flex-col items-center justify-center text-center relative overflow-hidden lotus-float active" style={{ transitionDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-full">
                  <img src="/meditating-cat.png" alt="Meditating Kitten" className="w-full h-auto rounded-lg mix-blend-multiply opacity-90 object-cover" style={{ minHeight: '160px' }} />
                  <div className="mt-stack-sm">
                    <span className="font-label-caps text-[10px] text-secondary tracking-[0.2em] uppercase">Inner Stillness</span>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-secondary-container/10 blur-3xl rounded-full"></div>
              </div>
            </div>

            {/* Right Column (8 columns) */}
            <div className="md:col-span-8 flex flex-col gap-gutter">
              {/* Seasonal Rhythm & Moon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <Link href={user?.gender !== 'male' ? '/cycle' : '/prakriti'} className="block h-full">
                  <div className="reveal bg-secondary-fixed p-stack-md rounded-xl flex flex-col justify-between h-48 active hover:shadow-lg transition-shadow duration-500" style={{ transitionDelay: '0.4s' }}>
                    <div>
                      <span className="font-label-caps text-label-caps text-on-secondary-fixed-variant uppercase">SEASONAL RHYTHM</span>
                      <h3 className="font-headline-sm text-headline-sm text-primary mt-unit">{displayPhase}</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-label-md text-label-md text-on-secondary-fixed-variant uppercase">{displayTip}</span>
                      <div className="px-stack-sm py-1 bg-surface/30 rounded-full font-label-caps text-label-caps text-primary hover:bg-surface/50 transition-colors">
                        {displayBadge}
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/jyotish" className="block h-full">
                  <div className="reveal bg-primary-container p-stack-md rounded-xl flex flex-col justify-between h-48 text-on-primary active hover:shadow-lg transition-shadow duration-500" style={{ transitionDelay: '0.5s' }}>
                    <div>
                      <span className="font-label-caps text-label-caps text-on-primary-container">CURRENT VIBE</span>
                      <h3 className="font-headline-sm text-headline-sm text-surface mt-unit capitalize">{displayVibe}</h3>
                    </div>
                    <div className="flex items-center gap-stack-md">
                      <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>brightness_4</span>
                      <span className="font-body-md text-body-md opacity-80">Moon in {moonPhase?.split(' ')[1] || 'Cancer'}. Ground through hydration.</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Ritual Space */}
              <div className="reveal bg-surface-container-low p-stack-lg rounded-xl active cursor-pointer hover:shadow-sm transition-shadow duration-500" style={{ transitionDelay: '0.6s' }} onClick={() => router.push('/rituals')}>
                <div className="flex justify-between items-center mb-stack-lg">
                  <h3 className="font-headline-md text-headline-md text-primary tracking-tight">Today's Rituals</h3>
                  <div className="flex items-center gap-unit">
                    <span className="w-2 h-2 rounded-full bg-secondary-container pulse-pink"></span>
                    <span className="font-label-caps text-label-caps text-secondary">LIVE SYNC</span>
                  </div>
                </div>
                <div className="space-y-stack-md">
                  {topThreeRituals.map((ritual, idx) => {
                    const isActive = idx === 1; // Example active state
                    return (
                      <div key={ritual.id} className={`flex items-start gap-stack-md group ${idx === 2 ? 'opacity-40' : ''}`}>
                        <div className={`font-label-caps text-label-caps ${isActive ? 'text-secondary' : 'text-on-surface-variant'} w-24 pt-1`}>
                          {formatRitualTime(ritual.time)}
                        </div>
                        <div className="flex-1 border-b border-outline-variant pb-stack-md">
                          <h4 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors flex items-center gap-unit">
                            {ritual.activity}
                            {isActive && (
                              <span className="text-[12px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-label-caps">ACTIVE</span>
                            )}
                          </h4>
                          <p className="font-body-md text-body-md text-on-surface-variant italic">
                            {ritual.description}
                          </p>
                        </div>
                        {isActive ? (
                          <button className="w-8 h-8 rounded-full border border-secondary-container flex items-center justify-center text-secondary hover:bg-secondary-container hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                          </button>
                        ) : (
                          <span className="material-symbols-outlined text-[24px] text-outline" style={idx === 0 ? { fontVariationSettings: "'FILL' 1", color: '#7b4355' } : {}}>
                            {idx === 0 ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Aura State Constitution */}
              <div 
                className="reveal bg-surface-container-high p-stack-lg rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] backdrop-blur-xl border border-outline-variant/30 active cursor-pointer group" 
                style={{ transitionDelay: '0.7s' }}
                onClick={() => router.push('/prakriti')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col items-center gap-stack-md">
                  <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">AURA STATE: {dominantDoshaText.toUpperCase()} ALIGNMENT</span>
                  <div className="relative w-64 h-64 flex items-center justify-center mt-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-secondary to-secondary-container opacity-20 blur-3xl pulse-pink"></div>
                    <div className="absolute inset-4 rounded-full border border-secondary-container/30 lotus-float"></div>
                    <div className="absolute inset-8 rounded-full border border-primary/20 animate-pulse"></div>
                    <div className="relative flex flex-col items-center">
                      <span className="font-display-lg text-[64px] text-primary leading-none group-hover:scale-105 transition-transform duration-700">{resonanceScore}%</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">RESONANCE</span>
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-secondary-container shadow-lg shadow-secondary/50"></div>
                      <span className="font-label-caps text-[10px] mt-1 text-secondary">SLEEP</span>
                    </div>
                    <div className="absolute top-1/4 -right-8 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                      <span className="font-label-caps text-[10px] mt-1 text-primary">RITUALS</span>
                    </div>
                    <div className="absolute bottom-1/4 -left-8 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-fixed-dim shadow-lg shadow-primary/50"></div>
                      <span className="font-label-caps text-[10px] mt-1 text-on-primary-fixed-variant">FREQ</span>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant italic text-center max-w-xs mt-stack-sm">
                    Your energy field is currently vibrating in harmony with the {moonPhase ? moonPhase.split(' ')[1] || 'lunar' : 'lunar'} cycle.
                  </p>
                </div>
              </div>

              {/* Recalibrate CTA */}
              <div className="reveal -mt-unit active" style={{ transitionDelay: '0.8s' }}>
                <button onClick={() => router.push('/prakriti')} className="w-full bg-primary py-stack-md text-white font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary-container transition-all flex items-center justify-center gap-stack-sm group rounded-b-xl hover:shadow-lg">
                  RECALIBRATE FREQUENCY
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">trending_flat</span>
                </button>
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-low dark:bg-surface-container-lowest w-full mt-stack-xl reveal active" style={{ transitionDelay: '1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-4 md:px-margin-desktop py-stack-lg max-w-container-max mx-auto">
            <div className="space-y-stack-sm">
              <div className="font-headline-sm text-headline-sm text-primary dark:text-inverse-primary">OJAS</div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                © 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm. Integrated intelligence for the mindful soul.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-gutter md:justify-end items-start">
              <div className="flex flex-col gap-unit">
                <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all" href="#">Privacy Policy</Link>
                <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all" href="#">Terms of Service</Link>
              </div>
              <div className="flex flex-col gap-unit">
                <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all" href="#">Journal</Link>
                <Link className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all" href="#">Community</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
