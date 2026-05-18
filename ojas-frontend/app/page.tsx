'use client';

import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { useUserStore } from './store/userStore';
import { useRouter } from 'next/navigation';

// Large Hero Blooming Lotus (Interactive & Centered above Headline)
const LargeHeroLotus = () => (
  <div className="mb-6 flex justify-center pointer-events-auto group/hero-lotus">
    <div className="relative w-28 h-28 text-[#DF8060]/30 hover:text-[#DF8060]/50 transition-colors duration-700">
      <svg
        className="w-full h-full lotus-interactive cursor-pointer"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Center Petal - The Heart of Lotus */}
        <path 
          className="petal-center"
          d="M50,85 C50,85 42,65 50,50 C58,65 50,85 50,85Z" 
          fill="url(#centerGradient)"
          opacity="0"
          style={{ animation: 'bloom-center 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards', transformOrigin: '50px 85px' }}
        />
        
        {/* Inner Left Petal */}
        <path 
          className="petal-left-inner"
          d="M50,85 C50,85 28,75 22,58 C34,52 44,70 50,85Z" 
          fill="url(#innerGradient)"
          opacity="0"
          style={{ animation: 'bloom-left-inner 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards', transformOrigin: '50px 85px' }}
        />
        
        {/* Inner Right Petal */}
        <path 
          className="petal-right-inner"
          d="M50,85 C50,85 72,75 78,58 C66,52 56,70 50,85Z" 
          fill="url(#innerGradient)"
          opacity="0"
          style={{ animation: 'bloom-right-inner 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards', transformOrigin: '50px 85px' }}
        />
        
        {/* Outer Left Petal */}
        <path 
          className="petal-left-outer"
          d="M50,85 C50,85 18,80 12,58 C28,48 40,68 50,85Z" 
          fill="url(#outerGradient)"
          opacity="0"
          style={{ animation: 'bloom-left-outer 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards', transformOrigin: '50px 85px' }}
        />
        
        {/* Outer Right Petal */}
        <path 
          className="petal-right-outer"
          d="M50,85 C50,85 82,80 88,58 C72,48 60,68 50,85Z" 
          fill="url(#outerGradient)"
          opacity="0"
          style={{ animation: 'bloom-right-outer 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards', transformOrigin: '50px 85px' }}
        />
        
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
  </div>
);

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const updateOpacity = () => {
      if (video.duration) {
        const current = video.currentTime;
        const duration = video.duration;
        let opacity = 1;

        if (current < 0.5) {
          opacity = current / 0.5;
        }
        else if (duration - current < 0.5) {
          opacity = Math.max(0, (duration - current) / 0.5);
        }

        video.style.opacity = opacity.toString();
      }

      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch((err) => console.log('Video autoplay error:', err));
        }
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    animationFrameId = requestAnimationFrame(updateOpacity);

    video.play().catch((err) => console.log('Video autoplay blocked, waiting for interaction:', err));

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (video) {
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

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
    setUser({
      name: nameInput.trim(),
      isLoggedIn: true
    });
    setShowNameModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] text-[#1C1917] selection:bg-[#DF8060]/10 flex flex-col justify-between">
      
      <div>
        {/* Unified minimal editorial navigation bar */}
        <Header />

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-7xl mx-auto">
          <section 
            className="pb-40 flex flex-col items-center"
            style={{ paddingTop: 'calc(6rem - 75px)' }}
          >
            {/* Centered Large Blooming Lotus Flower graphic */}
            <LargeHeroLotus />

            {/* Headline with editorial charcoal-stone and brand terracotta accents */}
            <h1 
              className="text-5xl sm:text-7xl md:text-8xl font-normal font-instrument-serif text-[#1C1917] max-w-7xl leading-[0.95] tracking-tight animate-fade-rise text-balance"
              style={{ letterSpacing: '-2.46px' }}
            >
              Beyond <span className="italic text-[#DF8060]">silence,</span> we nurture <span className="italic text-[#DF8060]">the eternal.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-stone-500 font-inter animate-fade-rise-delay text-balance">
              Nurturing pathways for conscious minds, seeking souls, and vibrant lives. Through the chaos, we craft digital sanctuaries for deep healing and pure vitality.
            </p>

            {/* Hero CTA Button - Tracked all-caps mono */}
            <div className="animate-fade-rise-delay-2 mt-10">
              <button 
                onClick={handleBeginJourney}
                className="inline-block rounded-full px-12 py-4.5 text-xs font-mono font-bold uppercase tracking-[0.25em] bg-[#1C1917] text-white hover:bg-[#DF8060] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md shadow-stone-900/5 cursor-pointer"
              >
                BEGIN JOURNEY
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Background Video Layer at the bottom */}
      <div 
        className="absolute left-0 right-0 bottom-0 overflow-hidden z-0 pointer-events-none"
        style={{
          top: '300px',
          inset: 'auto 0 0 0',
          height: 'calc(100vh - 300px)',
        }}
      >
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          muted
          playsInline
          autoPlay
          className="w-full h-full object-cover transition-opacity duration-75"
          style={{ opacity: 0 }}
        />
        {/* Cream color matching Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-transparent to-[#FAF7F2] pointer-events-none" />
      </div>

      {/* Brand Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>PHASE / COGNITION</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>

      {/* Name Input Premium Fullscreen Glass Overlay Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          {/* Subtle warm ambient lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#DF8060]/5 via-transparent to-transparent pointer-events-none" />
          
          <form 
            onSubmit={handleEnterSanctuary} 
            className="relative z-10 w-full max-w-md bg-white/50 border border-stone-200/50 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-[0_4px_30px_rgba(28,25,22,0.03)] flex flex-col items-center text-center animate-fade-rise"
          >
            {/* Lotus Graphic Icon */}
            <div className="w-16 h-16 text-[#DF8060] mb-4">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full lotus-interactive">
                <path d="M50,85 C50,85 42,65 50,50 C58,65 50,85 50,85Z" fill="#DF8060" />
                <path d="M50,85 C50,85 32,75 28,58 C38,52 46,70 50,85Z" fill="#FDBA74" />
                <path d="M50,85 C50,85 68,75 72,58 C62,52 54,70 50,85Z" fill="#FDBA74" />
              </svg>
            </div>

            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-[#DF8060] font-semibold mb-2">
              WELCOME TO OJAS
            </span>

            <h2 className="font-serif italic text-3xl md:text-4xl text-stone-900 mb-8 font-normal leading-tight">
              How shall we address you, beautiful soul?
            </h2>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              className="w-full text-center py-3 border-b-2 border-stone-300 focus:border-[#DF8060] bg-transparent text-xl font-serif text-stone-950 placeholder-stone-300 focus:outline-none transition-colors duration-300 mb-8"
              autoFocus
              required
            />

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="flex-1 py-3.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] border border-stone-300 hover:border-stone-500 transition-all duration-300 text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-white hover:bg-[#DF8060] active:scale-[0.98] transition-all duration-300 shadow-sm cursor-pointer"
              >
                ENTER SANCTUARY
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}