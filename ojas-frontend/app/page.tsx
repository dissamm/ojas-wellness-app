'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from './store/userStore';
import { Header } from './components/Header';
import { hasCompletedPrakriti } from './lib/dominantDosha';
import WellnessFlow from './WellnessFlow';

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
      router.push(hasCompletedPrakriti(user) ? '/dashboard' : '/prakriti');
    } else {
      router.push('/register');
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-on-background flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        {/* We use the unified Header component instead of the HTML header to keep state intact */}
        <Header />

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-[radial-gradient(circle_at_center,#004d2c_0%,#00341c_100%)] text-on-primary">
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
            <h1 className="font-display-lg text-[80px] md:text-[140px] tracking-[10px] md:tracking-[24px] mb-stack-sm animate-float text-[#FFB6CB]">
              OJAS
            </h1>
            <p className="font-quote text-quote italic mb-stack-lg text-secondary-fixed">
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
            <h2 className="font-headline-md text-headline-md text-primary leading-tight">
              Ancient Wisdom,<br />Modern Rhythm <span className="text-[#FFB6CB]">❧</span>
            </h2>
            <div className="w-24 h-1 bg-[#FFB6CB]" />
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
              className="inline-block font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:text-tertiary hover:border-tertiary transition-all"
            >
              LEARN OUR PHILOSOPHY
            </Link>
          </div>
        </section>

        {/* ── GALLERY (Bento) ── */}
        <section className="py-stack-xl px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto reveal">
            <div className="grid md:grid-cols-3 gap-gutter">
              {/* Prakriti */}
              <div
                onClick={() => router.push('/prakriti')}
                className="group relative bg-surface p-stack-lg h-[400px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-4 hover:shadow-xl rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-stack-md text-[#FFB6CB] opacity-20 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                </div>
                <div className="relative z-10">
                  <span className="font-label-caps text-label-caps text-secondary font-bold block mb-stack-sm">CONSTITUTION</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Prakriti</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Discover your unique elemental composition and unlock personalized nutritional paths.
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Lunar Sync */}
              <div
                onClick={() => router.push('/cycle')}
                className="group relative bg-primary-container p-stack-lg h-[400px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-4 hover:shadow-xl rounded-lg overflow-hidden cursor-pointer text-on-primary-container"
              >
                <div className="absolute top-0 right-0 p-stack-md text-tertiary-fixed-dim opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>brightness_4</span>
                </div>
                <div className="relative z-10">
                  <span className="font-label-caps text-label-caps text-secondary-fixed-dim font-bold block mb-stack-sm">COSMIC ALIGNMENT</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary mb-stack-md">Lunar Sync</h3>
                  <p className="font-body-md text-body-md text-on-primary-container opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Align your deep work and rest cycles with the waxing and waning moon phases.
                  </p>
                </div>
              </div>

              {/* Audio */}
              <div
                onClick={() => router.push('/music')}
                className="group relative bg-surface p-stack-lg h-[400px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-4 hover:shadow-xl rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-stack-md text-[#FFB6CB] opacity-20 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
                </div>
                <div className="relative z-10">
                  <span className="font-label-caps text-label-caps text-secondary font-bold block mb-stack-sm">SONIC HEALING</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Frequencies</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Binaural beats layered with traditional mantras to recalibrate your nervous system.
                  </p>
                </div>
                <div className="absolute inset-0 bg-tertiary-container/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* ── JOURNEY ── */}
        <section className="py-stack-xl px-margin-desktop bg-background overflow-hidden">
          <div className="max-w-4xl mx-auto reveal">
            <h2 className="font-headline-md text-headline-md text-center text-primary mb-stack-xl">
              The Path to Radiance
            </h2>

            <div className="relative space-y-stack-xl">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 hidden md:block bg-[#FFB6CB]/20" />

              {[
                { stage: '01', title: 'Genesis',         desc: 'Intake and elemental analysis of your current state of being.' },
                { stage: '02', title: 'Synchronization', desc: 'Mapping your bio-data against the current lunar and solar cycles.' },
                { stage: '03', title: 'Healing',         desc: 'Targeted herbal, audio, and physical practices to restore OJAS.' },
                { stage: '04', title: 'Rituals',         desc: 'Daily micro-habits that maintain your peak vibrational state.' },
              ].map((item, i) => (
                <div key={item.stage} className="relative flex flex-col md:flex-row items-center justify-between gap-stack-lg">
                  {i % 2 === 0 ? (
                    <>
                      <div className="md:w-5/12 text-center md:text-right">
                        <h4 className="font-headline-sm text-headline-sm text-primary">{item.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                      </div>
                      <div className="relative z-10 w-4 h-4 rounded-full border-4 border-background bg-[#FFB6CB] animate-dot-pulse" />
                      <div className="md:w-5/12 hidden md:block font-label-caps text-label-caps font-bold text-[#FFB6CB]">
                        STAGE {item.stage}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:w-5/12 hidden md:block font-label-caps text-label-caps font-bold text-[#FFB6CB] text-right">
                        STAGE {item.stage}
                      </div>
                      <div className="relative z-10 w-4 h-4 rounded-full border-4 border-background bg-[#FFB6CB] animate-dot-pulse" />
                      <div className="md:w-5/12 text-center md:text-left">
                        <h4 className="font-headline-sm text-headline-sm text-primary">{item.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg gap-gutter max-w-container-max mx-auto">
            <div className="font-display-lg text-headline-md text-[#FFB6CB]">OJAS</div>
            <div className="flex flex-wrap justify-center gap-stack-md font-body-md text-label-md font-label-caps text-label-caps">
              {['Privacy Policy', 'Terms of Service', 'Contact', 'Instagram', 'Journal'].map(link => (
                <Link
                  key={link}
                  href="#"
                  className="text-on-surface-variant hover:text-tertiary transition-all font-bold"
                >
                  {link}
                </Link>
              ))}
            </div>
            <p className="font-body-md text-label-caps text-secondary text-center md:text-right font-bold">
              © 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}