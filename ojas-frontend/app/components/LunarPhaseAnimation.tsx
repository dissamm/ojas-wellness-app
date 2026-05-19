'use client';

import React, { useState, useEffect } from 'react';

interface PhaseDetail {
  name: string;
  p: number; // shadow coordinate (0 to 1)
  illumination: number; // percentage
  description: string;
}

const PHASES: PhaseDetail[] = [
  { name: 'New Moon', p: 0.0, illumination: 0, description: 'Time to set intentions. A blank canvas for fresh biological and spiritual beginnings.' },
  { name: 'Waxing Crescent', p: 0.12, illumination: 12, description: 'Plant the seeds of growth. Nurture your emerging emotional and physical ideas.' },
  { name: 'First Quarter', p: 0.25, illumination: 50, description: 'Take decisive action. Overcome initial obstacles with resolve and focused energy.' },
  { name: 'Waxing Gibbous', p: 0.38, illumination: 73, description: 'Refine and cultivate. Prepare for the full expression of effort and metabolic peak.' },
  { name: 'Full Moon', p: 0.5, illumination: 100, description: 'Reap harvest and absolute clarity. Release what no longer serves your dynamic path.' },
  { name: 'Waning Gibbous', p: 0.62, illumination: 73, description: 'Express gratitude. Share your abundance, restore physical reserves, and cultivate rest.' },
  { name: 'Last Quarter', p: 0.75, illumination: 50, description: 'Release and re-evaluate. Clear space in mind and body for future intentions.' },
  { name: 'Waning Crescent', p: 0.88, illumination: 12, description: 'Surrender and deep rest. Retract energy inwards and recharge your vitality.' },
];

export const LunarPhaseAnimation = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(4); // Default to Full Moon
  const [isPlaying, setIsPlaying] = useState(true); // Default to auto-playing for spectacular visual wow
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  // Generate cosmic star coordinates once on mount
  useEffect(() => {
    const generatedStars = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.4,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  // Continuous animation cycle
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPhaseIndex((prev) => (prev + 1) % 8);
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const activePhase = PHASES[currentPhaseIndex];

  // Mathematical SVG shadow path drawer
  const getShadowPath = (p: number) => {
    if (p === 0.5) return ''; // Full moon: no shadow overlay needed

    // Calculate rx using the absolute phase fraction
    const rx = p < 0.5 ? Math.abs(50 * (1 - 4 * p)) : Math.abs(50 * (1 - 4 * (p - 0.5)));

    if (p < 0.5) {
      // Waxing Phase: Shadow covers left side
      const sweep = p < 0.25 ? 1 : 0;
      return `M 50 0 A 50 50 0 0 0 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`;
    } else {
      // Waning Phase: Shadow covers right side
      const sweep = p < 0.75 ? 0 : 1;
      return `M 50 0 A 50 50 0 0 1 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`;
    }
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#090C15] via-[#05070A] to-[#090C15] border border-stone-800 shadow-[inset_0_0_80px_rgba(30,58,138,0.25)] text-white p-8 sm:p-10 flex flex-col items-center select-none">
      
      {/* 1. Starry Constellations twinkling overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/70 animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.size * 3.5}s`,
            }}
          />
        ))}
      </div>

      {/* 2. Top Header Labels */}
      <div className="relative z-10 text-center mb-8 flex flex-col items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold">
          CELESTIAL RHYTHM
        </span>
        <h2 className="text-3xl sm:text-4xl font-normal font-inter">
          Phases of the <span className="font-instrument-serif italic text-[#C27A5D]">Moon</span>
        </h2>
        <p className="text-xs text-stone-400 font-inter max-w-sm mt-1 leading-relaxed">
          A continuous animation through the eight lunar phases — rendered from photorealistic details.
        </p>
      </div>

      {/* 3. Central Moon Sphere Visual */}
      <div className="relative z-10 my-6 flex items-center justify-center">
        
        {/* Soft backlighting */}
        <div 
          className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-[#C27A5D]/10 blur-3xl transition-opacity duration-1000"
          style={{ opacity: activePhase.illumination / 100 }}
        />

        {/* The Moon Sphere Viewport */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-[0_0_60px_rgba(223,128,96,0.15)] border border-white/10 flex items-center justify-center bg-stone-950">
          
          {/* Base Moon Color Texture with procedural CSS Craters (fallback and offline texture) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#EED4B6] via-stone-400 to-[#1C1917] rounded-full overflow-hidden opacity-95">
            {/* CSS-rendered soft glowing craters */}
            <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-black/10 blur-[1px] border border-black/5" />
            <div className="absolute top-12 left-16 w-12 h-12 rounded-full bg-black/15 blur-[2px] border border-black/5" />
            <div className="absolute top-24 left-8 w-10 h-10 rounded-full bg-black/10 blur-[1px] border border-black/5" />
            <div className="absolute top-8 left-28 w-6 h-6 rounded-full bg-black/12 blur-[1px] border border-black/5" />
            <div className="absolute top-28 left-24 w-14 h-14 rounded-full bg-black/15 blur-[2px] border border-black/5" />
            <div className="absolute top-20 left-32 w-8 h-8 rounded-full bg-black/10 blur-[1px] border border-black/5" />
            <div className="absolute top-36 left-12 w-6 h-6 rounded-full bg-black/10 blur-[1px] border border-black/5" />
          </div>

          {/* Photorealistic Crater Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-full opacity-70 transition-transform duration-1000 mix-blend-multiply"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1600180758890-6b945f9a8ba6?auto=format&fit=crop&w=600&q=80')`,
              filter: 'grayscale(100%) brightness(105%) contrast(110%)'
            }}
          />

          {/* SVG Shadow Overlay Mask */}
          <svg 
            className="absolute inset-0 w-full h-full rotate-0 z-20 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="moonShadowBlur">
                <feGaussianBlur stdDeviation="2.2" />
              </filter>
            </defs>

            {/* Dynamic semi-transparent shadow path */}
            {activePhase.p !== 0.5 && (
              <path
                d={getShadowPath(activePhase.p)}
                fill="#05070A"
                fillOpacity="0.88"
                filter="url(#moonShadowBlur)"
              />
            )}
          </svg>

          {/* Inner Light Rim reflection */}
          <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_4px_12px_rgba(255,255,255,0.1)] pointer-events-none z-30" />
        </div>
      </div>

      {/* 4. Active Phase Details */}
      <div className="relative z-10 text-center max-w-md mb-8 flex flex-col items-center gap-1.5 min-h-[120px] justify-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold">
          PHASE {currentPhaseIndex + 1} OF 8
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal transition-all duration-300">
          {activePhase.name}
        </h3>
        <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">
          {activePhase.illumination}% ILLUMINATED
        </span>
        <p className="text-xs sm:text-sm text-stone-400 font-inter leading-relaxed italic max-w-sm mt-2 transition-all duration-300">
          &ldquo;{activePhase.description}&rdquo;
        </p>
      </div>

      {/* 5. Play / Pause Control Button */}
      <div className="relative z-10 mb-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-2.5 rounded-full border border-[#C27A5D]/50 text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C27A5D] hover:text-white transition duration-300 cursor-pointer active:scale-95 shadow-sm"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>

      {/* 6. The Full Cycle Preview Row Grid */}
      <div className="relative z-10 w-full border-t border-stone-800/80 pt-8 flex flex-col items-center gap-4">
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-stone-500 font-semibold">
          THE FULL CYCLE
        </span>
        
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 w-full max-w-2xl">
          {PHASES.map((phase, idx) => {
            const isActive = idx === currentPhaseIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPhaseIndex(idx);
                  setIsPlaying(false); // Stop autoplay on manual choice
                }}
                className={`flex flex-col items-center p-2.5 rounded-2xl transition duration-500 cursor-pointer border ${
                  isActive 
                    ? 'border-[#C27A5D]/60 bg-[#C27A5D]/10 shadow-[0_4px_12px_rgba(223,128,96,0.06)]' 
                    : 'border-transparent hover:border-stone-800/60 hover:bg-stone-900/30'
                }`}
              >
                {/* Tiny Moon phase indicator */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-stone-950 shadow-inner">
                  <div 
                    className="absolute inset-0 bg-cover bg-center rounded-full opacity-80"
                    style={{ 
                      backgroundImage: `url('https://images.unsplash.com/photo-1600180758890-6b945f9a8ba6?auto=format&fit=crop&w=600&q=80')`,
                      filter: 'grayscale(100%) contrast(110%)'
                    }}
                  />
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                  >
                    {phase.p !== 0.5 && (
                      <path
                        d={getShadowPath(phase.p)}
                        fill="#05070A"
                        fillOpacity="0.9"
                      />
                    )}
                  </svg>
                </div>
                
                {/* Short mini index label */}
                <span className="text-[8px] font-mono text-stone-500 mt-2 font-semibold">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
