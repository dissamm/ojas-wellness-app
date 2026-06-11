'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '../../store/userStore';
import { useCycleStore } from '../../store/cycleStore';
import { getMusicRecommendations, RecommendedSong } from '../../services/musicService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Vedic Solfeggio alignments
const SOLFEGGIO_SOUNDSCAPES = [
  {
    frequency: '432Hz',
    name: 'Cosmic Earth Grounding',
    purpose: 'Deep Vata Calming',
    description: 'Stabilizes restless energy, reduces anxiety, and grounds the nervous system.',
    benefit: 'Reduces cortisol & balances Vata wind',
    icon: '⛰️',
    streamUrl: 'https://www.youtube.com/results?search_query=432Hz+healing+frequency+grounding',
  },
  {
    frequency: '528Hz',
    name: 'Solar Plexus cooling',
    purpose: 'Deep Pitta Soothing',
    description: 'Evokes emotional cellular repair, dissolves inner irritation, and cools fiery focus.',
    benefit: 'Cools inflammation & calms Pitta fire',
    icon: '🌊',
    streamUrl: 'https://www.youtube.com/results?search_query=528Hz+healing+frequency+solar+plexus',
  },
  {
    frequency: '639Hz',
    name: 'Heart Harmony Integration',
    purpose: 'Kapha Heart Opening',
    description: 'Fosters deep connection, releases stagnant emotions, and energizes heart centers.',
    benefit: 'Clears stagnation & activates Kapha spirit',
    icon: '🌸',
    streamUrl: 'https://www.youtube.com/results?search_query=639Hz+healing+frequency+heart+harmony',
  },
];

// Provide some nice placeholder albums since our ML model doesn't return artwork URLs yet
const PLACEHOLDER_ALBUMS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wTNdO3ObuZzsLQ3Tmt6ge29Ftxqdveg7AGDTqi0mCos4LaFHqiosZwNqvAnW608c4R7gfD9iwiUM-K16dNstSGXQPAGvOqnPEQ9DfS-wQ8PDuPyvaDcYoq2R16dsyTm-HSo8TcMO1fRcTSipHd_vlAuo_0Mzt6DceVoSVGrSwInjS5Nulhr1817J-p_UROvz4pyY1hDkfY1lRurCiXtpwvwe44uRvwesEb4-k4WcIFBvdGcPbr8-o_mY6BdYxj6oy3y0twJ9HOS6",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCrl6qKTvJDnVSUv5XIgHJIXRLJL_BVv1h97WuewU6YQ7KbMvvXaGhwmoDdq7XljxIyZzfkFfycoJw8nmulejwKXv-VF6sHmy1PQsgNi4vBEP3qDkd8E9YEPV_o3JbSO4keBLAd93hVCYoDZuwZ-yG7Av5rJZ4gIN_7biTCOQ7ZJeyL1WFD2WBt6gawgIaDKMZP1Zg1dxHYQYPzzL3uQVCgexS3KFMz3nObxrxhi5GfjeP6YDIbDcewVLuY3hgSlDA12WSJJqnMBF3L",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBi-xJyDcdIVYuvMMPklGETqD21zSewKj_uRkRUqv44SBaGCdbVX0wK_oLFOvjRzuLlz8wREa7L5-lMPjTASFaWVjZRjZ9OkotbkOUO5UQQEz42JH-znSeBDFfBGOPGoqIM1_BeFi7jL85cnO7KGP0MzYfZ3IcUvXIjz6bU7xPJkHeJGW48HjgvQlJmerqHF5Ia_SZCf5B9M1c9ZiDqBQ3X-x26MWpGF4-MpEYss-Dx-teQYbG4xu9zbIQEuX8Dxf1HElO1Arda4465"
];

interface CosmicMusicProps {
    onNext?: () => void;
}

export const CosmicMusic = ({ onNext }: CosmicMusicProps) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const cycle = useCycleStore((state) => state.cycle);

  // States
  const [selectedDosha, setSelectedDosha] = useState(user?.dominantDosha || 'Pitta');
  const [energyLevel, setEnergyLevel] = useState(66); // scale 0-100 for slider
  const [activeTab, setActiveTab] = useState<'curated' | 'solfeggio'>('curated');
  const [musicRecommendations, setMusicRecommendations] = useState<RecommendedSong[]>([]);
  const [predictionPhase, setPredictionPhase] = useState('Follicular');
  const [activeVisualizer, setActiveVisualizer] = useState<number | null>(null);

  // Dosha specific CSS custom properties effect
  useEffect(() => {
    const colors: Record<string, { color: string, glow: string }> = {
      vata: { color: '#87CEEB', glow: 'rgba(135,206,235,0.4)' },
      pitta: { color: '#feb5ca', glow: 'rgba(254,181,202,0.4)' },
      kapha: { color: '#40E0D0', glow: 'rgba(64,224,208,0.4)' }
    };
    const c = colors[selectedDosha.toLowerCase()] || colors.pitta;
    
    document.documentElement.style.setProperty('--accent-color', c.color);
    document.documentElement.style.setProperty('--accent-glow', c.glow);

    return () => {
      // Clean up global CSS overrides
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
    };
  }, [selectedDosha]);

  // Derive predicted phase from cycle start date if exists
  const getCyclePhase = useCallback((day: number, length: number): string => {
    const quarterLength = Math.floor(length / 4);
    if (day <= 5 || day <= quarterLength * 0.25) return 'menstrual';
    if (day <= quarterLength) return 'menstrual';
    if (day <= quarterLength * 2) return 'follicular';
    if (day <= quarterLength * 2.5) return 'ovulation';
    return 'luteal';
  }, []);

  useEffect(() => {
    let phase = 'follicular';
    if (cycle && cycle.startDate) {
      const today = new Date();
      const last = new Date(cycle.startDate);
      const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      const cycleLength = cycle.cycleLengthDays || 28;
      const currentDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
      phase = getCyclePhase(currentDay, cycleLength);
    } else {
      // Fallback phase mapping based on slider energy (scaled 0-100 down to 1-10)
      const internalEnergy = Math.ceil(energyLevel / 10) || 1;
      if (internalEnergy <= 3) phase = 'menstrual';
      else if (internalEnergy <= 5) phase = 'luteal';
      else if (internalEnergy <= 8) phase = 'follicular';
      else phase = 'ovulation';
    }
    setPredictionPhase(phase);
    setMusicRecommendations(getMusicRecommendations(phase, Math.ceil(energyLevel / 10) || 1, selectedDosha));
  }, [cycle, energyLevel, getCyclePhase, selectedDosha]);

  const togglePlay = (idx: number) => {
    setActiveVisualizer(activeVisualizer === idx ? null : idx);
  };

  const currentHz = 300 + (energyLevel * 2);
  const glowIntensity = 15 + (energyLevel / 100) * 20;

  return (
    <div className="relative text-surface-cream font-body-md transition-all duration-500 w-full z-10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        
        {!onNext && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-surface-cream/50 hover:text-[var(--accent-color)] transition-colors text-xs font-mono uppercase tracking-widest mb-10 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Dashboard
            </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Left Panel */}
          <section className="lg:col-span-8 w-full">
            <div className="mb-stack-lg animate-fade-rise">
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-sm text-surface-cream tracking-tight">
                Frequency<br/>Sanctuary
              </h1>
              <p className="font-italic-serif text-quote max-w-xl text-surface-cream/80 italic mb-stack-md leading-relaxed">
                A harmonic convergence of ancient Vedic frequencies and modern independent rhythms.
              </p>
              
              {/* Vibe Calibrator */}
              <div className="max-w-md bg-forest-ink/60 backdrop-blur-xl border border-white/10 p-stack-sm rounded-xl">
                <label className="font-label-caps text-label-caps uppercase block mb-unit text-[var(--accent-color)] tracking-widest transition-colors duration-500">
                  Vibe Calibrator
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none relative z-10"
                  style={{
                      filter: `drop-shadow(0 0 ${glowIntensity}px var(--accent-color))`
                  }}
                />
                <style jsx>{`
                  input[type=range]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: var(--accent-color);
                      cursor: pointer;
                      box-shadow: 0 0 15px var(--accent-color), 0 0 30px var(--accent-color);
                      transition: all 0.3s ease;
                  }
                  input[type=range]::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: var(--accent-color);
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 0 15px var(--accent-color), 0 0 30px var(--accent-color);
                      transition: all 0.3s ease;
                  }
                  @keyframes rotate-disc {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                  }
                  .animate-rotate-disc {
                      animation: rotate-disc 8s linear infinite;
                  }
                  @keyframes wave-vivid {
                      0%, 100% { height: 4px; opacity: 0.5; }
                      50% { height: 28px; opacity: 1; }
                  }
                  .sound-bar {
                      width: 4px;
                      background: var(--accent-color);
                      border-radius: 4px;
                      animation: wave-vivid 0.8s ease-in-out infinite;
                      box-shadow: 0 0 10px var(--accent-color);
                      transition: background-color 0.5s ease, box-shadow 0.5s ease;
                  }
                `}</style>

                <div className="flex justify-between mt-stack-sm">
                  <span className="font-label-md text-label-md opacity-50 uppercase tracking-widest">Grounding</span>
                  <span className="font-label-md text-label-md text-[var(--accent-color)] font-bold transition-colors duration-500">
                      {currentHz}Hz
                  </span>
                  <span className="font-label-md text-label-md opacity-50 uppercase tracking-widest">Ethereal</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-gutter border-b border-white/10 mb-stack-md animate-fade-rise" style={{ animationDelay: '0.1s' }}>
              <button 
                onClick={() => setActiveTab('curated')}
                className={`font-label-caps text-label-caps uppercase tracking-widest py-unit transition-all duration-300 ${
                  activeTab === 'curated' 
                    ? 'border-b-2 border-[var(--accent-color)] text-surface-cream' 
                    : 'text-on-surface-variant/50 hover:text-surface-cream border-b-2 border-transparent'
                }`}
              >
                Indian Indie Pop
              </button>
              <button 
                onClick={() => setActiveTab('solfeggio')}
                className={`font-label-caps text-label-caps uppercase tracking-widest py-unit transition-all duration-300 ${
                  activeTab === 'solfeggio' 
                    ? 'border-b-2 border-[var(--accent-color)] text-surface-cream' 
                    : 'text-on-surface-variant/50 hover:text-surface-cream border-b-2 border-transparent'
                }`}
              >
                Vedic Solfeggio
              </button>
            </div>

            {/* Lists */}
            <div className="pb-10 animate-fade-rise" style={{ animationDelay: '0.2s' }}>
              
              {activeTab === 'curated' && (
                <div className="flex flex-col relative group/stack pt-2">
                  {musicRecommendations.map((song: RecommendedSong, idx: number) => {
                    const isPlaying = activeVisualizer === idx;
                    const isFirst = idx === 0;
                    const imgUrl = PLACEHOLDER_ALBUMS[idx % PLACEHOLDER_ALBUMS.length];

                    return (
                      <div 
                        key={idx}
                        className={`
                          relative flex items-center p-stack-md rounded-xl bg-forest-ink/60 backdrop-blur-xl border border-white/10 
                          transition-all duration-500 hover:z-50 hover:border-[var(--accent-color)] hover:shadow-[0_20px_50px_var(--accent-glow)] 
                          hover:-translate-y-6 group/card cursor-pointer
                          ${!isFirst ? '-mt-4' : ''}
                        `}
                        style={{ zIndex: 10 - idx }}
                        onClick={() => togglePlay(idx)}
                      >
                        <div className="relative mr-stack-md shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/10 transition-colors duration-500 group-hover/card:border-[var(--accent-color)]">
                              <img 
                                src={imgUrl} 
                                alt="Album art" 
                                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'animate-rotate-disc' : ''}`} 
                              />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-forest-ink rounded-full border-2 border-white/10"></div>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-stack-sm mb-unit h-6">
                            <span className={`font-label-caps text-label-caps transition-colors duration-500 ${isPlaying ? 'text-[var(--accent-color)]' : 'text-surface-cream/40'}`}>
                              0{idx + 1}
                            </span>
                            {isPlaying && (
                              <div className="flex gap-1.5 items-end h-6">
                                <div className="sound-bar" style={{ animationDelay: '0.1s' }}></div>
                                <div className="sound-bar" style={{ animationDelay: '0.3s' }}></div>
                                <div className="sound-bar" style={{ animationDelay: '0.2s' }}></div>
                                <div className="sound-bar" style={{ animationDelay: '0.5s' }}></div>
                                <div className="sound-bar" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            )}
                          </div>
                          <h3 className="font-headline-sm text-lg md:text-headline-sm mb-unit uppercase tracking-tight text-surface-cream">
                            {song.title}
                          </h3>
                          <p className="font-body-md text-surface-cream/70 italic-serif line-clamp-1">
                            {song.artist}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-stack-sm ml-auto opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <button 
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                              isPlaying 
                                ? 'border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_0_15px_var(--accent-glow)]' 
                                : 'border-white/20 text-white/40 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
                            }`}
                            onClick={(e) => { e.stopPropagation(); togglePlay(idx); }}
                          >
                            <span className="material-symbols-outlined text-[24px]">
                              {isPlaying ? 'pause' : 'play_arrow'}
                            </span>
                          </button>
                          <a 
                            href={song.youtubeUrl || `https://open.spotify.com/search/${encodeURIComponent(song.artist + ' ' + song.title)}`}
                            target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-stack-md py-unit rounded-full border border-white/20 font-label-caps text-[10px] uppercase tracking-widest hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors bg-white/5 flex items-center justify-center"
                          >
                            {song.youtubeUrl ? 'YouTube' : 'Spotify'}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'solfeggio' && (
                <div className="flex flex-col gap-4">
                  {[...SOLFEGGIO_SOUNDSCAPES].sort((a, b) => (a.frequency === '432Hz' ? -1 : b.frequency === '432Hz' ? 1 : 0)).map((sound, idx) => (
                    <div key={idx} className="bg-forest-ink/60 backdrop-blur-xl border border-white/10 p-stack-md rounded-xl hover:border-[var(--accent-color)] transition-colors duration-500 group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl p-3 bg-white/5 rounded-2xl border border-white/10">{sound.icon}</span>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[var(--accent-color)] uppercase tracking-widest transition-colors duration-500">
                              {sound.frequency} • {sound.purpose}
                            </span>
                            <h3 className="text-xl font-serif italic text-white font-normal mt-0.5">{sound.name}</h3>
                          </div>
                        </div>
                        <a
                          href={sound.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-forest-ink rounded-full transition-all duration-300 shadow-[0_0_10px_var(--accent-glow)]"
                        >
                          🎧 Play Solfeggio
                        </a>
                      </div>
                      <p className="text-surface-cream/70 text-sm font-serif leading-relaxed italic mb-4">
                        &ldquo;{sound.description}&rdquo;
                      </p>
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">AYURVEDIC INDEX</span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">✓ {sound.benefit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Right Panel (Sticky) */}
          <aside className="lg:col-span-4 sticky top-32 w-full animate-fade-rise" style={{ animationDelay: '0.3s' }}>
            <div className="bg-forest-ink/60 backdrop-blur-xl p-stack-lg rounded-xl border border-white/10 shadow-2xl">
              <h2 className="font-headline-sm text-headline-sm mb-stack-md uppercase tracking-tighter text-surface-cream">
                Dosha Alignment
              </h2>
              <p className="font-body-md text-surface-cream/70 mb-stack-md leading-relaxed">
                Harmonize the playlist frequency with your current elemental state.
              </p>
              
              <div className="space-y-stack-sm">
                {['Vata', 'Pitta', 'Kapha'].map((dosha) => {
                  const isActive = selectedDosha.toLowerCase() === dosha.toLowerCase();
                  const iconName = dosha === 'Vata' ? 'air' : dosha === 'Pitta' ? 'local_fire_department' : 'water_drop';
                  const elementText = dosha === 'Vata' ? 'Air / Space' : dosha === 'Pitta' ? 'Fire / Water' : 'Earth / Water';

                  return (
                    <button
                      key={dosha}
                      onClick={() => setSelectedDosha(dosha)}
                      className={`w-full p-stack-sm flex items-center justify-between rounded-xl transition-all duration-500 cursor-pointer group border ${
                          isActive 
                            ? 'bg-[var(--accent-color)] text-forest-ink border-transparent shadow-[0_0_30px_var(--accent-glow)] scale-[1.02]' 
                            : 'bg-white/5 text-surface-cream border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-left">
                        <span className={`font-label-caps text-label-caps uppercase block tracking-widest ${isActive ? 'opacity-90' : 'opacity-60'}`}>
                          {dosha}
                        </span>
                        <span className="font-italic-serif text-body-md italic">
                          {elementText}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-stack-lg p-stack-sm bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-unit mb-unit text-[var(--accent-color)] transition-colors duration-500">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest">Auto-Sync Active</span>
                </div>
                <p className="font-label-md text-label-md opacity-60">
                  {user?.gender === 'male' ? (
                      "Synced to daily rhythm for optimal somatic resonance."
                  ) : (
                      `Synced to current Lunar Cycle (${predictionPhase}) for optimal somatic resonance.`
                  )}
                </p>
              </div>
            </div>

            {/* Finish flow action */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('musicPreferencesSet', 'true');
                }
                if (user && (!user.musicPreferences || user.musicPreferences.length === 0)) {
                  useUserStore.getState().setMusicPreferences([selectedDosha.toLowerCase()]);
                } else {
                  useUserStore.getState().syncUserProfile();
                }

                if (onNext) {
                    onNext();
                } else {
                    router.push('/dashboard');
                }
              }}
              className="w-full mt-stack-md py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-white/10 hover:bg-[var(--accent-color)] text-white hover:text-forest-ink border border-white/20 hover:border-transparent transition-all duration-300 shadow-[0_0_20px_transparent] hover:shadow-[0_0_20px_var(--accent-glow)] text-center cursor-pointer"
            >
              {onNext ? 'Continue Journey →' : 'Accept Calibration →'}
            </button>

          </aside>
        </div>
      </div>
    </div>
  );
}
