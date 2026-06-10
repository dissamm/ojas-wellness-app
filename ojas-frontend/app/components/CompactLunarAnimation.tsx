'use client';

import React, { useState, useEffect } from 'react';

// Simplified Phase details
const PHASES = [
  { name: 'New Moon', p: 0.0, illumination: 0 },
  { name: 'Waxing Crescent', p: 0.12, illumination: 12 },
  { name: 'First Quarter', p: 0.25, illumination: 50 },
  { name: 'Waxing Gibbous', p: 0.38, illumination: 73 },
  { name: 'Full Moon', p: 0.5, illumination: 100 },
  { name: 'Waning Gibbous', p: 0.62, illumination: 73 },
  { name: 'Last Quarter', p: 0.75, illumination: 50 },
  { name: 'Waning Crescent', p: 0.88, illumination: 12 },
];

export const CompactLunarAnimation = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(4); // Default Full Moon

  useEffect(() => {
    // Automatically cycle through phases for the compact animation
    const interval = setInterval(() => {
      setCurrentPhaseIndex((prev) => (prev + 1) % 8);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-[0_0_40px_rgba(223,128,96,0.15)] border border-white/10 flex items-center justify-center bg-stone-950">
      
      {/* Base Moon Color Texture with procedural CSS Craters (fallback and offline texture) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EED4B6] via-stone-400 to-[var(--ojas-dark-text)] rounded-full overflow-hidden opacity-95">
        <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-black/10 blur-[1px] border border-black/5" />
        <div className="absolute top-6 left-8 w-6 h-6 rounded-full bg-black/15 blur-[2px] border border-black/5" />
        <div className="absolute top-12 left-4 w-5 h-5 rounded-full bg-black/10 blur-[1px] border border-black/5" />
        <div className="absolute top-4 left-14 w-3 h-3 rounded-full bg-black/12 blur-[1px] border border-black/5" />
        <div className="absolute top-14 left-12 w-7 h-7 rounded-full bg-black/15 blur-[2px] border border-black/5" />
      </div>

      {/* Photorealistic Crater Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center rounded-full opacity-70 transition-transform duration-1000 mix-blend-multiply"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1600180758890-6b945f9a8ba6?auto=format&fit=crop&w=300&q=80')`,
          filter: 'grayscale(100%) brightness(105%) contrast(110%)'
        }}
      />

      {/* SVG Shadow Overlay Mask */}
      <svg 
        className="absolute inset-0 w-full h-full rotate-0 z-20 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="compactMoonShadowBlur">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* Dynamic semi-transparent shadow path */}
        {activePhase.p !== 0.5 && (
          <path
            d={getShadowPath(activePhase.p)}
            fill="#05070A"
            fillOpacity="0.88"
            filter="url(#compactMoonShadowBlur)"
          />
        )}
      </svg>

      {/* Inner Light Rim reflection */}
      <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_4px_12px_rgba(255,255,255,0.1)] pointer-events-none z-30" />
    </div>
  );
};
