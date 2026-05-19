'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { useUserStore } from './store/userStore';
import { useRouter } from 'next/navigation';
import WellnessFlow from './WellnessFlow';

// Large Hero Blooming Lotus (Interactive & Centered above Headline)
const LargeHeroLotus = () => (
  <div className="mb-12 flex justify-center pointer-events-auto select-none">
    <div className="relative flex items-center justify-center">
      {/* Layer 1: Outer Pulse/Glow Backdrop */}
      <span className="absolute inline-flex w-40 h-40 md:w-48 md:h-48 rounded-full bg-[#C27A5D]/10 blur-2xl animate-pulse"></span>
      
      {/* Layer 2: Main Outer Pinging Ring */}
      <span className="absolute inline-flex w-32 h-32 md:w-36 md:h-36 rounded-full border border-[#C27A5D]/20 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
      
      {/* Layer 3: Secondary Delayed Inner Pinging Ring */}
      <span className="absolute inline-flex w-24 h-24 md:w-28 md:h-28 rounded-full border border-[#C27A5D]/30 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite] [animation-delay:1s]"></span>
      
      {/* Layer 4: Interactive Floating Lotus Image */}
      <img src="/lotus.png" 
           alt="Ojas blooming lotus mark" 
           width="140" 
           height="140" 
           className="relative w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_10px_30px_rgba(194,122,93,0.35)] animate-[float_6s_ease-in-out_infinite]" />
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const { user, setName, currentStep } = useUserStore();
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');

  if (currentStep !== 'name') {
    return <WellnessFlow />;
  }

  const handleBeginJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.name) {
      router.push('/dashboard');
    } else {
      setShowNameModal(true);
    }
  };

  const handleEnterSanctuary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setName(nameInput.trim());
    setShowNameModal(false);
    router.push('/dashboard');
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col justify-between selection:bg-[#C27A5D]/10 transition-colors duration-500">

      <div>
        <Header />

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-7xl mx-auto">
          <section className="pt-16 pb-24 md:pt-24 md:pb-36 flex flex-col items-center">
            
            {/* Small uppercase copper tag */}
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#C27A5D] font-bold mb-6 animate-fade-rise select-none">
              ALIGN WITH THE UNSEEN
            </span>

            {/* Centered Large Blooming Lotus graphic */}
            <LargeHeroLotus />

            {/* Headline with editorial copper accents */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal font-cormorant text-[#1C1917] max-w-5xl leading-[1.05] tracking-tight animate-fade-rise text-balance">
              Sync your <span className="italic text-[#C27A5D]">rhythm</span> with the cosmic pulse.
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base max-w-2xl mt-8 leading-relaxed text-stone-500 font-inter animate-fade-rise-delay text-balance px-4">
              Unlock a deeper understanding of your constitution through Prakriti analysis, lunar cycle tracking, and frequency-based soundscapes designed for your mood.
            </p>

            {/* Hero CTA Buttons */}
            <div className="animate-fade-rise-delay-2 mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleBeginJourney}
                className="rounded-full px-10 py-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-[#1C1917] text-[#F4EFEA] hover:bg-[#C27A5D] active:scale-[0.98] transition-all duration-300 shadow-sm cursor-pointer select-none"
              >
                Begin Discovery
              </button>
              <button
                onClick={scrollToFeatures}
                className="rounded-full px-10 py-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] border border-[#1C1917]/20 text-[#1C1917] hover:border-[#1C1917] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none bg-transparent"
              >
                Explore Features
              </button>
            </div>
          </section>

          {/* Features Grid Section */}
          <section id="features" className="w-full pt-12 pb-24 md:pb-36 border-t border-[#1C1917]/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

              {/* CARD 1: Prakriti Genesis */}
              <div className="bg-[#FAF6F0] dark:bg-stone-900/60 rounded-[32px] p-8 border border-[#1C1917]/5 dark:border-stone-850 shadow-[0_4px_30px_rgba(28,25,22,0.02)] flex flex-col justify-between group/card hover:border-[#C27A5D]/20 transition-all duration-500 h-[500px] text-[#1C1917] dark:text-[#FAF6F0]">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-4 block">
                    ANALYSIS
                  </span>
                  <h3 className="font-cormorant italic text-3xl text-[#1C1917] dark:text-[#FAF6F0] font-normal mb-3">
                    Prakriti Genesis
                  </h3>
                  <p className="text-xs md:text-sm text-stone-500 leading-relaxed font-inter">
                    Identify your unique bio-energy signature—Vata, Pitta, or Kapha—to personalize your entire wellness journey.
                  </p>
                </div>

                {/* Exquisite Meditation SVG illustration */}
                <div className="my-6 flex justify-center items-center h-40">
                  <svg className="w-full h-full text-stone-400/30 group-hover/card:text-[#C27A5D]/40 transition-colors duration-500" viewBox="0 0 100 100" fill="none">
                    {/* Outline of aura/stars */}
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
                    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" />
                    {/* Meditating body line art */}
                    <path d="M50,22 C53,22 55,25 55,28 C55,31 53,34 50,34 C47,34 45,31 45,28 C45,25 47,22 50,22 Z" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M50,34 L50,60 M50,38 L30,48 L20,68 C20,68 35,72 50,72 C65,72 80,68 80,68 L70,48 L50,38 Z" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M30,48 L50,56 L70,48" stroke="currentColor" strokeWidth="1" fill="none" />
                    {/* Core energy spots */}
                    <circle cx="50" cy="28" r="1.5" fill="#C27A5D" />
                    <circle cx="50" cy="42" r="1.5" fill="#C27A5D" />
                    <circle cx="50" cy="54" r="1.5" fill="#C27A5D" />
                    <circle cx="50" cy="66" r="1.5" fill="#C27A5D" />
                  </svg>
                </div>

                <button
                  onClick={() => router.push('/prakriti')}
                  className="w-full py-4 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.25em] bg-[#1C1917] text-[#FAF6F0] hover:bg-[#C27A5D] transition-all duration-300 shadow-sm cursor-pointer select-none"
                >
                  Begin Analysis
                </button>
              </div>

              {/* CARD 2: Lunar Synchronization */}
              <div className="bg-[#1C1917] rounded-[32px] p-8 border border-[#1C1917] shadow-[0_4px_30px_rgba(28,25,22,0.02)] flex flex-col justify-between group/card hover:bg-stone-900 transition-all duration-500 h-[500px] text-[#F4EFEA]">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-4 block">
                    HARMONY
                  </span>
                  <h3 className="font-cormorant italic text-3xl font-normal mb-3 text-[#FAF6F0]">
                    Lunar Synchronization
                  </h3>
                  <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-inter">
                    Mapping your menstrual flow alongside the Waxing and Waning moon to predict hormonal and emotional shifts.
                  </p>
                </div>

                {/* Moon Phase SVG illustration */}
                <div className="my-6 flex flex-col justify-center items-center h-40">
                  <svg className="w-24 h-24 text-stone-600" viewBox="0 0 100 100" fill="none">
                    {/* Ambient light ring */}
                    <circle cx="50" cy="50" r="32" stroke="#C27A5D" strokeOpacity="0.2" strokeWidth="3" />
                    {/* Solid glowing center moon (Waning Gibbous) */}
                    <circle cx="50" cy="50" r="30" fill="url(#moonGlow)" />
                    {/* Shadow overlay creating the phase */}
                    <path d="M50,20 A30,30 0 0,0 50,80 A15,30 0 0,1 50,20 Z" fill="#1C1917" />
                    <defs>
                      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
                        <stop offset="80%" stopColor="#FAF6F0" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#C27A5D" stopOpacity="0.4" />
                      </radialGradient>
                    </defs>
                  </svg>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-bold mt-4 select-none">
                    Waning Gibbous • Day 14
                  </span>
                </div>

                <button
                  onClick={() => router.push('/cycle')}
                  className="w-full py-4 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.25em] bg-[#F4EFEA] text-[#1C1917] hover:bg-[#C27A5D] hover:text-[#F4EFEA] transition-all duration-300 shadow-sm cursor-pointer select-none"
                >
                  Sync Moon
                </button>
              </div>

              {/* CARD 3: Responsive Audio */}
              <div className="bg-[#FFFFFF] dark:bg-stone-900/60 rounded-[32px] p-8 border border-[#1C1917]/5 dark:border-stone-850 shadow-[0_10px_40px_rgba(28,25,22,0.03)] flex flex-col justify-between group/card hover:border-[#C27A5D]/20 transition-all duration-500 h-[500px] text-[#1C1917] dark:text-[#FAF6F0]">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-4 block">
                    FREQUENCY
                  </span>
                  <h3 className="font-cormorant italic text-3xl text-[#1C1917] dark:text-[#FAF6F0] font-normal mb-3">
                    Responsive Audio
                  </h3>
                  <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-inter">
                    Predictive mood mapping that curates 528Hz and 432Hz soundscapes tailored to your current cosmic alignment.
                  </p>
                </div>

                {/* Mock Audio Playlist with playing bar visualizer */}
                <div className="my-6 space-y-3 w-full">
                  <div className="flex items-center justify-between p-3 bg-[#FAF6F0] dark:bg-stone-950/60 rounded-2xl border border-[#1C1917]/5 dark:border-stone-850">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-200 font-inter">DEEP SOLFEGGIO</p>
                      <p className="text-[9px] text-stone-400 font-mono tracking-wider mt-0.5">Meditation • 432Hz</p>
                    </div>
                    {/* Animated soundwaves */}
                    <div className="flex items-end gap-[2px] h-3 pr-1">
                      <div className="w-[2px] bg-[#C27A5D] rounded-full animate-[pulse_0.8s_infinite] h-full" />
                      <div className="w-[2px] bg-[#C27A5D] rounded-full animate-[pulse_1.2s_infinite] h-1/2" style={{ animationDelay: '0.2s' }} />
                      <div className="w-[2px] bg-[#C27A5D] rounded-full animate-[pulse_1s_infinite] h-3/4" style={{ animationDelay: '0.4s' }} />
                      <div className="w-[2px] bg-[#C27A5D] rounded-full animate-[pulse_0.7s_infinite] h-2/3" style={{ animationDelay: '0.1s' }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-stone-950/40 rounded-2xl border border-stone-100 dark:border-stone-850 opacity-60">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-stone-850 dark:text-stone-300 font-inter">LUNAR TIDES</p>
                      <p className="text-[9px] text-stone-400 font-mono tracking-wider mt-0.5">Ambient • 528Hz</p>
                    </div>
                    <span className="text-[9px] font-mono text-stone-400 select-none">⏸</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/music')}
                  className="w-full py-4 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.25em] bg-[#1C1917] text-[#FFFFFF] hover:bg-[#C27A5D] transition-all duration-300 shadow-sm cursor-pointer select-none"
                >
                  Launch Player
                </button>
              </div>

            </div>
          </section>
        </main>
      </div>

      {/* Brand Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-8 pt-8 border-t border-[#1C1917]/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-stone-400 tracking-widest uppercase">
        <div className="font-cormorant italic text-lg text-stone-600 font-semibold lowercase select-none">ojas.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#C27A5D] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#C27A5D] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#C27A5D] transition-colors">Archive</a>
        </div>
        <div className="select-none">© 2026 OJAS</div>
      </footer>

      {/* Name Input Premium Fullscreen Glass Overlay Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 bg-[#F4EFEA]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          {/* Subtle warm ambient lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C27A5D]/5 via-transparent to-transparent pointer-events-none" />

          <form
            onSubmit={handleEnterSanctuary}
            className="relative z-10 w-full max-w-md bg-[#FAF6F0]/80 border border-[#1C1917]/5 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-[0_10px_50px_rgba(28,25,22,0.03)] flex flex-col items-center text-center animate-fade-rise"
          >
            {/* Lotus Graphic Icon */}
            <div className="w-16 h-16 text-[#C27A5D] mb-4 select-none">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full lotus-interactive">
                <path d="M50,85 C50,85 42,65 50,50 C58,65 50,85 50,85Z" fill="#C27A5D" />
                <path d="M50,85 C50,85 32,75 28,58 C38,52 46,70 50,85Z" fill="#FAF6F0" opacity="0.6" />
                <path d="M50,85 C50,85 68,75 72,58 C62,52 54,70 50,85Z" fill="#FAF6F0" opacity="0.6" />
              </svg>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-3 select-none">
              WELCOME TO OJAS
            </span>

            <h2 className="font-cormorant italic text-3xl md:text-4xl text-stone-900 mb-8 font-normal leading-tight">
              How shall we address you, beautiful soul?
            </h2>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              className="w-full text-center py-3 border-b border-stone-300 focus:border-[#C27A5D] bg-transparent text-2xl font-cormorant italic text-stone-950 placeholder-stone-300 focus:outline-none transition-colors duration-300 mb-8"
              autoFocus
              required
            />

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="flex-1 py-3.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] border border-stone-300 hover:border-stone-500 transition-all duration-300 text-stone-600 hover:text-[#1C1917] cursor-pointer select-none bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-[#FAF6F0] hover:bg-[#C27A5D] active:scale-[0.98] transition-all duration-300 shadow-sm cursor-pointer select-none"
              >
                Enter Sanctuary
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}