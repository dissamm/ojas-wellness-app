'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhaseCardProps {
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | string;
  cycleDay: number;
  totalCycleDays: number;
  dominantDosha?: string;
  onContinue?: () => void;
  affirmation?: string;
  insights?: string[];
  ritual?: string;
  vibeText?: string;
  buttonText?: string;
}

const normalizePhase = (phaseStr: string): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' => {
  const p = (phaseStr || '').toLowerCase();
  if (p.includes('menstrual')) return 'menstrual';
  if (p.includes('follicular')) return 'follicular';
  if (p.includes('ovulat') || p.includes('ovulation')) return 'ovulation';
  if (p.includes('luteal')) return 'luteal';
  return 'menstrual'; // fallback
};

const phaseConfig = {
  menstrual: {
    icon: '🩸',
    title: 'Rest. Restore. Release.',
    gradient: 'bg-gradient-menstrual',
    accent: 'ojas-menstrual',
    textColor: 'text-ojas-text-primary',
    vibeText: "You're in your introspection era. The world can wait. You're in conversation with yourself rn.",
    insights: [
      'Journaling over gym sessions',
      'Herbal tea ceremonies',
      'Saying \'no\' unapologetically',
      'Dreaming (literally and figuratively)'
    ],
    ritual: 'Warm sesame oil massage (abhyanga). Warm, grounding foods like kitchari. Gentle restorative yoga.',
    affirmations: [
      'I release what no longer serves me.',
      'My body knows how to heal and renew.',
      'I honor my physical and emotional request to slow down.'
    ],
    buttonText: 'Show Me The Music',
    buttonClass: 'bg-gradient-to-br from-ojas-menstrual to-[#1a0a2e]/80 text-[#0F0F0F] hover:shadow-[0_0_20px_rgba(212,165,116,0.4)]',
    doshaTitle: 'Kapha Energy',
    doshaPractices: [
      'Embrace slow mornings',
      'Warm sesame oil massage (abhyanga)',
      'Easy, nourishing warm foods',
      'Gentle yoga, restorative poses'
    ]
  },
  follicular: {
    icon: '🌱',
    title: 'Rise. Glow. Grow.',
    gradient: 'bg-gradient-follicular',
    accent: 'ojas-follicular',
    textColor: 'text-ojas-bg-primary', // Dark text on light green bg
    vibeText: "You're becoming who you're meant to be.",
    insights: [
      'Start that project',
      'Say yes to invitations',
      'Try that hairstyle',
      'Move your body with joy'
    ],
    ritual: 'Dry brushing before bathing. Light, raw or energizing bitter foods. Dynamic Vinyasa flows.',
    affirmations: [
      'I embrace this season of growth.',
      'Energy, creativity, and momentum flow through me.',
      'I am open to new beginnings and fresh directions.'
    ],
    buttonText: 'Show Me The Music',
    buttonClass: 'bg-gradient-to-br from-ojas-follicular to-[#c06080]/80 text-[#F5F1ED] hover:shadow-[0_0_20px_rgba(194,122,93,0.4)]',
    doshaTitle: 'Vata Energy (Rising)',
    doshaPractices: [
      'Increase light morning workouts',
      'Light, raw or energizing bitter foods',
      'Vibrant colors & sensory stimulation',
      'Try new routines and dynamic hobbies'
    ]
  },
  ovulation: {
    icon: '🌕',
    title: 'Shine. Lead. Own It.',
    gradient: 'bg-gradient-ovulation',
    accent: 'ojas-ovulation',
    textColor: 'text-ojas-bg-primary', // Dark text on light yellow bg
    vibeText: "You're literally magnetic rn.",
    insights: [
      'Schedule important meetings',
      'Wear that bold outfit',
      'Show up fully',
      'Lead with confidence'
    ],
    ritual: 'Cooling coconut water. Share a gratitude ritual with someone. High-intensity physical movement.',
    affirmations: [
      'I am a force of nature.',
      'I shine my brightest and express myself fully.',
      'My presence is magnetic and my power is clear.'
    ],
    buttonText: 'Show Me The Music',
    buttonClass: 'bg-gradient-to-br from-ojas-ovulation to-[#FF6B9D]/80 text-[#0F0F0F] hover:shadow-[0_0_20px_rgba(255,107,157,0.4)]',
    doshaTitle: 'Pitta at Peak',
    doshaPractices: [
      'Max cardio & strength training',
      'Important presentations & negotiations',
      'Leading sessions & taking charge',
      'Public activities & high visibility'
    ]
  },
  luteal: {
    icon: '🌙',
    title: 'Create. Reflect. Refine.',
    gradient: 'bg-gradient-luteal',
    accent: 'ojas-luteal',
    textColor: 'text-ojas-text-primary',
    vibeText: "Your superpower is vision right now.",
    insights: [
      'Deep work (coding, writing, strategy)',
      'Meaningful conversations',
      'Finish what you started',
      'Trust your gut'
    ],
    ritual: 'Journaling & creative pursuits. Warm, grounding foods. Honor the pause before renewal.',
    affirmations: [
      'My intuition is my compass.',
      'I trust the wisdom of my inner vision.',
      'I ground myself and complete my creations with clarity.'
    ],
    buttonText: 'Show Me The Music',
    buttonClass: 'bg-gradient-to-br from-ojas-luteal to-[#B8A8D8]/80 text-[#0F0F0F] hover:shadow-[0_0_20px_rgba(184,168,216,0.4)]',
    doshaTitle: 'Pitta Grounded by Vata',
    doshaPractices: [
      'Balanced activity (avoid over-exertion)',
      'Journaling & creative pursuits',
      'Nourishing, warming sweet foods',
      'Quality, intimate time with loved ones'
    ]
  },
};

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  cycleDay,
  totalCycleDays,
  dominantDosha,
  onContinue,
  affirmation,
  insights,
  ritual,
  vibeText,
  buttonText,
}) => {
  const normalized = normalizePhase(phase);
  const config = phaseConfig[normalized];
  
  const finalCycleLength = totalCycleDays || 28;
  const percentComplete = Math.min(Math.round((cycleDay / finalCycleLength) * 100), 100);

  const vibeTextVal = vibeText ?? config.vibeText;
  const insightsVal = insights ?? config.insights;
  const ritualVal = ritual ?? config.ritual;
  const buttonTextVal = buttonText ?? config.buttonText;

  // Affirmations Carousel State
  const affirmationsList = config.affirmations;
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  const nextAffirmation = () => {
    setAffirmationIdx((prev) => (prev + 1) % affirmationsList.length);
  };

  const prevAffirmation = () => {
    setAffirmationIdx((prev) => (prev - 1 + affirmationsList.length) % affirmationsList.length);
  };

  return (
    <div
      className={`
        ${config.gradient}
        ${config.textColor}
        rounded-[24px]
        p-8 md:p-10
        backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        animate-fade-in-up
        relative
        overflow-hidden
        transition-all
        duration-500
      `}
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-2xl opacity-30 animate-float select-none pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-20 right-10 text-2xl opacity-30 animate-float select-none pointer-events-none" style={{ animationDelay: '2s' }}>
        🌙
      </div>

      {/* Phase Name */}
      <div className="relative z-10 text-left">
        <h1 className="font-serif text-3xl font-bold italic tracking-wider mb-2 flex items-center gap-3">
          <span className="select-none">{config.icon}</span>
          {config.title}
        </h1>

        {/* Divider */}
        <div className={`h-px ${config.textColor === 'text-ojas-bg-primary' ? 'bg-[#0F0F0F]/20' : 'bg-white/20'} mb-6`}></div>

        {/* Vibe Copy */}
        <p className="text-lg font-medium leading-relaxed mb-6 font-serif italic">
          {vibeTextVal}
        </p>

        {/* Progress Section */}
        <div className="flex items-center gap-6 mb-6">
          {/* Progress Ring */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="menstrual-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a0a2e" />
                  <stop offset="100%" stopColor="#2D1B2E" />
                </linearGradient>
                <linearGradient id="follicular-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c06080" />
                  <stop offset="100%" stopColor="#8B9D6E" />
                </linearGradient>
                <linearGradient id="ovulation-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B9D" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <linearGradient id="luteal-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B8A8D8" />
                  <stop offset="100%" stopColor="#6B4E9C" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.15" />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`url(#${normalized}-progress-grad)`}
                strokeWidth="8"
                strokeDasharray={`${(percentComplete / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-semibold text-sm font-mono">{percentComplete}%</span>
            </div>
          </div>

          {/* Day Info */}
          <div className="flex-1">
            <div className="font-semibold font-mono text-sm">Day {cycleDay} of {finalCycleLength}</div>
            <div className="text-xs opacity-90 uppercase tracking-widest font-mono font-bold mt-0.5">
              {normalized.charAt(0).toUpperCase() + normalized.slice(1)} Rising
            </div>
            {/* Celestial visual progress bar */}
            <div className="text-[10px] opacity-60 tracking-wider font-mono mt-1.5 flex items-center gap-1 select-none">
              <span>🌍</span>
              <span className="opacity-40">━━━━━━━━━━━━</span>
              <span>🌙</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px ${config.textColor === 'text-ojas-bg-primary' ? 'bg-[#0F0F0F]/20' : 'bg-white/20'} mb-6`}></div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* What This Phase Is For */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-90 font-mono">
              💚 What This Phase Is For
            </div>
            <ul className="space-y-2">
              {insightsVal.map((insight, idx) => (
                <li key={idx} className="text-xs sm:text-sm leading-relaxed pl-4 relative">
                  <span className="absolute left-0 opacity-70">↳</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Ayurvedic Connection */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-90 font-mono">
              🧘 Ayurvedic Connection ({dominantDosha ? `${dominantDosha} / ${config.doshaTitle}` : config.doshaTitle})
            </div>
            <ul className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/5">
              {config.doshaPractices.map((practice, idx) => (
                <li key={idx} className="text-xs leading-relaxed pl-3 relative flex items-start gap-1">
                  <span className="opacity-70 mt-0.5">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ayurvedic Ritual */}
        <div className="bg-white/10 p-4 rounded-[12px] mb-6">
          <div className="text-xs font-semibold mb-2 opacity-90 font-mono uppercase tracking-wider">🧘 Ayurvedic Ritual</div>
          <p className="text-sm leading-relaxed">{ritualVal}</p>
        </div>

        {/* Affirmation Card (Swipeable / Clickable Carousel) */}
        <div className="mb-6 select-none">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3 opacity-90 font-mono text-center">
            📿 Today&apos;s Affirmation
          </div>
          
          <div className="relative min-h-[110px] bg-white/10 rounded-[12px] border border-white/5 flex items-center justify-between p-4 overflow-hidden">
            {/* Left navigation arrow */}
            <button 
              onClick={prevAffirmation}
              className="text-stone-400 hover:text-white transition-colors duration-300 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer border border-white/5 hover:border-white/10"
              aria-label="Previous affirmation"
            >
              ←
            </button>

            {/* Affirmation Text with slide and subtle rotation */}
            <div className="flex-1 px-4 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={affirmationIdx}
                  initial={{ opacity: 0, x: 20, rotate: 1 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -20, rotate: -1 }}
                  transition={{ duration: 0.25 }}
                  className="font-serif text-base sm:text-lg italic font-semibold leading-relaxed"
                >
                  &ldquo;{affirmation ? affirmation : affirmationsList[affirmationIdx]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Right navigation arrow */}
            <button 
              onClick={nextAffirmation}
              className="text-stone-400 hover:text-white transition-colors duration-300 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer border border-white/5 hover:border-white/10"
              aria-label="Next affirmation"
            >
              →
            </button>
          </div>
          {!affirmation && (
            <div className="text-[10px] text-stone-500 font-mono text-center mt-2 tracking-wider">
              [← Swipe or click arrows for more →]
            </div>
          )}
        </div>

        {/* Button & Logged Status */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mt-6">
          {(onContinue || buttonText) && (
            <button
              onClick={onContinue}
              className={`
                flex-1
                w-full
                py-3.5
                px-8
                rounded-[50px]
                font-semibold
                text-base
                transition-all
                duration-300
                shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                hover:-translate-y-0.5
                active:translate-y-0
                cursor-pointer
                text-center
                block
                ${config.buttonClass}
              `}
            >
              {buttonTextVal}
            </button>
          )}
          <div className="flex-shrink-0 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-stone-400 select-none flex items-center gap-1.5">
            <span>✓</span> Logged
          </div>
        </div>
      </div>
    </div>
  );
};
