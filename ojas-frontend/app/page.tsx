'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from './store/userStore';
import { Header } from './components/Header';
import { isFullyOnboarded, getResumeStep } from './lib/onboardingState';
import WellnessFlow from './WellnessFlow';
import { CompactLunarAnimation } from './components/CompactLunarAnimation';

export default function Home() {
  const router = useRouter();
  const { currentStep, isAuthenticated, user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { 
          e.target.classList.add('active');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    
    els.forEach((el, index) => { 
      if (!(el as HTMLElement).style.transitionDelay) {
        (el as HTMLElement).style.transitionDelay = `${(index % 10) * 0.1}s`;
      }
      obs.observe(el); 
    });

    return () => {
      els.forEach((el) => { obs.unobserve(el); });
    };
  }, [mounted]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (currentStep !== 'name') {
    return <WellnessFlow />;
  }

  const handleBeginJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (isFullyOnboarded(user)) {
        router.push('/dashboard');
      } else {
        const nextStep = getResumeStep(user);
        useUserStore.getState().setCurrentStep(nextStep);
        router.push(`/?step=${nextStep}`);
      }
    } else {
      router.push('/register');
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        {/* We use the unified Header component instead of the HTML header to keep state intact */}
        <Header />

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none reveal">
            <svg
              className="animate-[spin_60s_linear_infinite]"
              fill="none" height="600" viewBox="0 0 200 200" width="600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path className="animate-dash" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} d="M100 20C100 20 80 60 40 60C40 60 80 70 100 110C100 110 120 70 160 60C160 60 120 60 100 20Z" stroke="#FFB6CB" strokeWidth="0.5"/>
              <path className="animate-dash" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} d="M100 180C100 180 80 140 40 140C40 140 80 130 100 90C100 90 120 130 160 140C160 140 120 140 100 180Z" stroke="#FFB6CB" strokeWidth="0.5"/>
              <circle className="animate-lotus-pulse" cx="100" cy="100" r="10" stroke="#FFB6CB" strokeWidth="0.5"/>
              <path className="animate-dash" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} d="M20 100C20 100 60 80 60 40C60 40 70 80 110 100C110 100 70 120 60 160C60 160 60 120 20 100Z" stroke="#FFB6CB" strokeWidth="0.5"/>
              <path className="animate-dash" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} d="M180 100C180 100 140 80 140 40C140 40 130 80 90 100C90 100 130 120 140 160C140 160 140 120 180 100Z" stroke="#FFB6CB" strokeWidth="0.5"/>
            </svg>
          </div>

          <div className="z-10 text-center px-margin-mobile reveal">
            <h1 className="font-display-lg text-[80px] md:text-[140px] tracking-[10px] md:tracking-[24px] mb-stack-sm animate-float text-resonant-pink">
              OJAS
            </h1>
            <p className="font-quote text-quote italic mb-stack-lg text-surface-cream">
              Sync your rhythm with the cosmic pulse
            </p>

            <div className="flex flex-wrap justify-center gap-stack-md">
              <button
                onClick={handleBeginJourney}
                className="px-stack-lg py-stack-md bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps tracking-widest hover:bg-tertiary-fixed transition-all border border-transparent hover:border-secondary-fixed-dim"
              >
                Begin Journey
              </button>
              <button
                className="px-stack-lg py-stack-md bg-transparent text-secondary-fixed font-label-caps text-label-caps tracking-widest border border-secondary-fixed/40 transition-all hover:border-secondary-fixed"
              >
                Prakriti · Lunar · Frequency
              </button>
            </div>
          </div>

          <div className="absolute bottom-stack-lg animate-bounce cursor-pointer reveal">
            <span className="material-symbols-outlined text-secondary-fixed-dim text-[32px]">
              expand_more
            </span>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto grid md:grid-cols-2 gap-stack-xl items-center bg-background">
          <div className="space-y-stack-md reveal">
            <h2 className="font-headline-md text-headline-md text-surface-cream leading-tight">
              Ancient Wisdom,<br />Modern Rhythm <span className="text-resonant-pink">❧</span>
            </h2>
            <div className="w-24 h-1 bg-resonant-pink" />
          </div>
          <div className="space-y-stack-md reveal">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed italic">
              OJAS is the bridge between the timeless science of Ayurveda and the digital heartbeat of today. We believe wellness is not a static goal, but a fluid dance with the environment, the stars, and your internal biological clock.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              By synthesizing ancient dosha analysis with real-time lunar tracking and bio-rhythm synchronization, we offer a path to vitality that respects both tradition and the pace of the modern world.
            </p>
            <Link
              href="#"
              className="inline-block font-label-caps text-label-caps text-surface-cream border-b border-surface-cream pb-1 hover:text-tertiary hover:border-tertiary transition-all"
            >
              LEARN OUR PHILOSOPHY
            </Link>
          </div>
        </section>


        {/* ── CORE PILLARS ── */}
        <section className="py-stack-xl px-margin-desktop overflow-hidden bg-transparent max-w-container-max mx-auto">
          <div className="reveal">
            <h2 className="font-headline-md text-[40px] md:text-[56px] text-center text-surface-cream mb-stack-xl uppercase tracking-widest">
              Core Pillars
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {[
                { icon: 'psychology', title: 'Prakriti Analysis', desc: 'The anchor feature. Discover your unique mind-body constitution.' },
                { icon: 'self_improvement', title: 'Ritual Protocol', desc: 'Phase-synced daily practices tailored to your elemental flow.' },
                { icon: 'restaurant', title: 'Aahar Intelligence', desc: 'Dosha-specific food & herb guidance to restore your inner fire.' },
                { icon: 'flare', title: 'Jyotish Forecast', desc: 'Vedic astrology meets your daily wellness. Align with the stars.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-stack-lg rounded-2xl hover:bg-white/10 hover:border-resonant-pink/30 transition-all group flex flex-col items-center text-center cursor-default">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-stack-md group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-[32px]">{item.icon}</span>
                  </div>
                  <h4 className="font-headline-sm text-[28px] text-surface-cream mb-stack-sm">{item.title}</h4>
                  <p className="font-body-md text-surface-cream/70 italic-serif text-[18px] max-w-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HORIZON (CTA) ── */}
        <section className="py-stack-xl px-margin-desktop text-center bg-transparent border-t border-white/10">
          <div className="max-w-md mx-auto reveal">
            <h2 className="font-display-lg text-[40px] md:text-display-lg text-surface-cream mb-stack-md animate-float">
              Begin Your Alignment
            </h2>
            <p className="font-body-md text-surface-cream/70 mb-stack-lg">
              Unlock a more attuned version of yourself.
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full bg-transparent border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg gap-gutter max-w-container-max mx-auto">
            <div className="font-display-lg text-headline-md text-resonant-pink">OJAS</div>

            <p className="font-body-md text-label-caps text-surface-cream/60 text-center md:text-right font-bold">
              © 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}