'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
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

  // Particles and Reveal Observer
  useEffect(() => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      const particleCount = 15;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 20;
        const drift = (Math.random() - 0.5) * 200;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        particle.style.setProperty('--drift', `${drift}px`);
        particlesContainer.appendChild(particle);
      }
    }

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

      <div className="ambient-glow min-h-screen bg-background text-on-surface">
        <div className="grainy-overlay"></div>
        <div className="particles-container" id="particles"></div>

        <Header />

        <main className="pt-28 pb-stack-xl max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row items-start justify-between mb-stack-xl reveal active" style={{ transitionDelay: '0s' }}>
            <div className="w-full md:w-2/3">
              <div className="mb-stack-sm kitten-container group">
                <div className="kitten-aura"></div>
                <div className="kitten-breathe w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center text-3xl shadow-lg border border-secondary-fixed">
                  ✧
                </div>
              </div>
              <h1 className="font-display-lg text-[40px] md:text-display-lg text-primary leading-none mb-unit hover:tracking-tight transition-all duration-700">
                {greeting}, {user?.name || "friend"}
              </h1>
              <p className="font-body-lg text-body-lg italic text-secondary mix-blend-multiply opacity-90">
                The sun finds you in resonance.
              </p>
            </div>
            <div className="mt-stack-md md:mt-0 text-right reveal active" style={{ transitionDelay: '0.2s' }}>
              <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">PHASE: {moonPhase ? moonPhase.toUpperCase() : 'GIBBOUS MOON'}</span>
              <div className="font-headline-sm text-headline-sm text-primary">{formattedDate}</div>
            </div>
          </section>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            {/* Left Column (4 columns) */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              {/* Daily Affirmation */}
              <div className="reveal interactive-card bg-surface-container-low p-stack-md border-l-4 border-secondary-container active" style={{ transitionDelay: '0.3s' }}>
                <span className="font-label-caps text-label-caps text-secondary mb-unit block">AFFIRMATION</span>
                <blockquote className="font-quote text-quote text-primary leading-relaxed">
                  "{dailyAffirmation || "I am the container for infinite peace, allowing the rhythm of the universe to guide my breath."}"
                </blockquote>
              </div>

              {/* Sleep Log */}
              <div 
                className="reveal interactive-card bg-surface-container-high p-stack-md rounded-2xl active" 
                style={{ transitionDelay: '0.4s' }}
                onClick={() => { if (!todaySleepLog) setShowSleepModal(true); else router.push('/sleep'); }}
              >
                <div className="flex justify-between items-center mb-stack-md">
                  <h3 className="font-label-caps text-label-caps text-primary">SLEEP LOG</h3>
                  <span className="material-symbols-outlined text-primary">nights_stay</span>
                </div>
                
                {todaySleepLog ? (
                  <>
                    <div className="flex items-end gap-stack-sm mb-unit">
                      <div className="font-display-lg text-[48px] text-primary">{todaySleepLog.hoursSlept || 0}</div>
                      <div className="font-label-md text-label-md text-on-surface-variant pb-2">HOURS</div>
                    </div>
                    <div className="flex items-center gap-unit">
                      <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                      <div className="h-1 flex-1 bg-outline-variant rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-container progress-fill" style={{ '--final-width': todaySleepLog.sleepDepth === 'deep' ? '82%' : todaySleepLog.sleepDepth === 'light' ? '40%' : '15%' } as React.CSSProperties}></div>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase">{todaySleepLog.sleepDepth || 'MODERATE'} DEPTH</span>
                    </div>
                    <div className="mt-stack-md flex justify-between text-on-surface-variant">
                      <div className="flex items-center gap-unit group">
                        <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">bedtime</span>
                        <span className="font-label-md text-label-md uppercase">{todaySleepLog.dreamThemes[0] || 'PEACEFUL'}</span>
                      </div>
                      <div className="flex items-center gap-unit group">
                        <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">wb_sunny</span>
                        <span className="font-label-md text-label-md">AWAKE</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <span className="font-label-caps text-secondary">TAP TO LOG SLEEP</span>
                  </div>
                )}
              </div>

              {/* Decorative Image Card */}
              <div className="mt-8 flex reveal interactive-card group active" style={{ transitionDelay: '0.5s' }}>
                <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-low">
                  <img alt="Meditating Cat" className="w-full h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-700" src="/meditating-cat.png" />
                  <div className="absolute inset-0 bg-secondary-container/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            {/* Right Column (8 columns) */}
            <div className="md:col-span-8 flex flex-col gap-gutter">
              {/* Seasonal Rhythm & Moon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <Link href={user?.gender !== 'male' ? '/cycle' : '/prakriti'}>
                  <div className="reveal interactive-card bg-secondary-fixed p-stack-md rounded-2xl flex flex-col justify-between h-48 active" style={{ transitionDelay: '0.6s' }}>
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

                <Link href="/jyotish">
                  <div className="reveal interactive-card bg-primary-container p-stack-md rounded-2xl flex flex-col justify-between h-48 text-on-primary active" style={{ transitionDelay: '0.7s' }}>
                    <div>
                      <span className="font-label-caps text-label-caps text-on-primary-container">CURRENT VIBE</span>
                      <h3 className="font-headline-sm text-headline-sm text-surface mt-unit capitalize">{displayVibe}</h3>
                    </div>
                    <div className="flex items-center gap-stack-md">
                      <span className="material-symbols-outlined text-secondary-container animate-pulse" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>brightness_4</span>
                      <span className="font-body-md text-body-md opacity-80">Moon in {moonPhase?.split(' ')[1] || 'Transit'}. Ground through hydration.</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Ritual Space */}
              <div className="reveal interactive-card bg-surface-container-low p-stack-lg rounded-2xl active" style={{ transitionDelay: '0.8s' }} onClick={() => router.push('/rituals')}>
                <div className="flex justify-between items-center mb-stack-lg">
                  <h3 className="font-headline-md text-headline-md text-primary tracking-tight">Today's Rituals</h3>
                  <div className="flex items-center gap-unit">
                    <span className="w-2 h-2 rounded-full bg-secondary-container pulse-pink"></span>
                    <span className="font-label-caps text-label-caps text-secondary">LIVE SYNC</span>
                  </div>
                </div>
                <div className="space-y-stack-md">
                  {topThreeRituals.map((ritual, idx) => {
                    // Just an arbitrary active state for demo based on index
                    const isActive = idx === 1;
                    return (
                      <div key={ritual.id} className="flex items-start gap-stack-md group cursor-pointer hover:bg-surface-container-high/50 p-2 -m-2 rounded-lg transition-colors">
                        <div className={`font-label-caps text-label-caps ${isActive ? 'text-secondary' : 'text-on-surface-variant'} w-24 pt-1`}>
                          {formatRitualTime(ritual.time)}
                        </div>
                        <div className="flex-1 border-b border-outline-variant pb-stack-md">
                          <h4 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors flex items-center gap-unit">
                            {ritual.activity}
                            {isActive && (
                              <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-label-caps animate-pulse">ACTIVE</span>
                            )}
                          </h4>
                          <p className="font-body-md text-body-md text-on-surface-variant italic">
                            {ritual.description}
                          </p>
                        </div>
                        {isActive ? (
                          <button className="w-8 h-8 rounded-full border border-secondary-container flex items-center justify-center text-secondary hover:bg-secondary-container hover:text-white transition-all hover:scale-110 shadow-sm active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                          </button>
                        ) : (
                          <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">
                            {idx === 0 ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Dosha Constitution */}
              <div className="reveal interactive-card bg-surface-container-high p-stack-lg rounded-2xl active" style={{ transitionDelay: '0.9s' }} onClick={() => router.push('/prakriti')}>
                <h3 className="font-label-caps text-label-caps text-primary mb-stack-lg">DOSHA CONSTITUTION</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  <div className="space-y-unit group cursor-help">
                    <div className="flex justify-between font-label-md text-label-md">
                      <span className="text-secondary group-hover:font-bold transition-all">PITTA (Fire)</span>
                      <span className="">{pittaVal}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-secondary-container progress-fill" style={{ '--final-width': `${pittaVal}%` } as React.CSSProperties}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-unit group cursor-help">
                    <div className="flex justify-between font-label-md text-label-md">
                      <span className="text-on-primary-fixed-variant group-hover:font-bold transition-all">VATA (Air)</span>
                      <span className="">{vataVal}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-primary-fixed-dim progress-fill" style={{ '--final-width': `${vataVal}%` } as React.CSSProperties}></div>
                    </div>
                  </div>

                  <div className="space-y-unit group cursor-help">
                    <div className="flex justify-between font-label-md text-label-md">
                      <span className="text-primary-container group-hover:font-bold transition-all">KAPHA (Earth)</span>
                      <span className="">{kaphaVal}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-primary-container progress-fill" style={{ '--final-width': `${kaphaVal}%` } as React.CSSProperties}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recalibrate CTA */}
              <div className="reveal active" style={{ transitionDelay: '1.0s' }}>
                <button onClick={() => router.push('/prakriti')} className="w-full rounded-full bg-primary py-stack-md text-on-primary font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-stack-sm group shadow-xl hover:shadow-secondary-container/20">
                  RECALIBRATE FREQUENCY
                  <span className="material-symbols-outlined group-hover:translate-x-3 transition-transform">trending_flat</span>
                </button>
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-low dark:bg-surface-container-lowest w-full mt-stack-xl reveal active" style={{ transitionDelay: '1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-desktop py-stack-lg max-w-container-max mx-auto">
            <div className="space-y-stack-sm">
              <div className="font-headline-sm text-headline-sm text-primary dark:text-inverse-primary hover:tracking-widest transition-all duration-500 cursor-default">OJAS</div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                © 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm. Integrated intelligence for the mindful soul.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-gutter md:justify-end items-start">
              <div className="flex flex-col gap-unit">
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-2 transition-all" href="#">Privacy Policy</a>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-2 transition-all" href="#">Terms of Service</a>
              </div>
              <div className="flex flex-col gap-unit">
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-2 transition-all" href="#">Journal</a>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:translate-x-2 transition-all" href="#">Community</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}