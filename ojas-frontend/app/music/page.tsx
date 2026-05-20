'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { getMusicRecommendations, RecommendedSong } from '../services/musicService';
import { useRouter } from 'next/navigation';

// Vedic Solfeggio alignments
const SOLFEGGIO_SOUNDSCAPES = [
  {
    frequency: '432Hz',
    name: 'Cosmic Earth Grounding',
    purpose: 'Deep Vata Calming',
    description: 'Stabilizes restless energy, reduces anxiety, and grounds the nervous system.',
    benefit: 'Reduces cortisol & balances Vata wind',
    icon: '⛰️',
    streamUrl: 'https://www.youtube.com/results?search_query=432hz+grounding+meditation+music',
  },
  {
    frequency: '528Hz',
    name: 'Solar Plexus cooling',
    purpose: 'Deep Pitta Soothing',
    description: 'Evokes emotional cellular repair, dissolves inner irritation, and cools fiery focus.',
    benefit: 'Cools inflammation & calms Pitta fire',
    icon: '🌊',
    streamUrl: 'https://www.youtube.com/results?search_query=528hz+pitta+soothing+meditation+music',
  },
  {
    frequency: '639Hz',
    name: 'Heart Harmony Integration',
    purpose: 'Kapha Heart Opening',
    description: 'Fosters deep connection, releases stagnant emotions, and energizes heart centers.',
    benefit: 'Clears stagnation & activates Kapha spirit',
    icon: '🌸',
    streamUrl: 'https://www.youtube.com/results?search_query=639hz+heart+chakra+kapha+music',
  },
];

export default function MusicPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const cycle = useCycleStore((state) => state.cycle);

  // States
  const [selectedDosha, setSelectedDosha] = useState(user?.dominantDosha || 'Pitta');
  const [energyLevel, setEnergyLevel] = useState(7); // 1 to 10
  const [activeTab, setActiveTab] = useState<'curated' | 'solfeggio'>('curated');
  const [musicRecommendations, setMusicRecommendations] = useState<RecommendedSong[]>([]);
  const [predictionPhase, setPredictionPhase] = useState('Follicular');
  const [activeVisualizer, setActiveVisualizer] = useState<number | null>(null);

  // Derive predicted phase from cycle start date if exists
  const getCyclePhase = useCallback((day: number, length: number): string => {
    const quarterLength = Math.floor(length / 4);
    if (day <= 5 || day <= quarterLength * 0.25) return 'Menstrual';
    if (day <= quarterLength) return 'Menstrual';
    if (day <= quarterLength * 2) return 'Follicular';
    if (day <= quarterLength * 2.5) return 'Ovulatory';
    return 'Luteal';
  }, []);

  useEffect(() => {
    let phase = 'Follicular';
    if (cycle && cycle.startDate) {
      const today = new Date();
      const last = new Date(cycle.startDate);
      const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      const cycleLength = cycle.cycleLengthDays || 28;
      const currentDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
      phase = getCyclePhase(currentDay, cycleLength);
    } else {
      // Fallback phase mapping based on slider energy
      if (energyLevel <= 3) phase = 'Menstrual';
      else if (energyLevel <= 5) phase = 'Luteal';
      else if (energyLevel <= 8) phase = 'Follicular';
      else phase = 'Ovulatory';
    }
    setPredictionPhase(phase);
    setMusicRecommendations(getMusicRecommendations(phase, energyLevel));
  }, [cycle, energyLevel, getCyclePhase]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnergyLevel(parseInt(e.target.value));
  };

  const getDoshaTheme = (dosha: string) => {
    const d = dosha.toLowerCase();
    if (d.includes('vata')) return { label: 'Vata Calming', bg: 'bg-sky-50 text-sky-800 border-sky-200' };
    if (d.includes('pitta')) return { label: 'Pitta Cooling', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'Kapha Energizing', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#C27A5D]/10 transition-colors duration-500">
      <div className="flex flex-col min-h-screen">
        
        {/* Navigation Header */}
        <Header />

        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-6">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-rise">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-2 block">
              FREQUENCY SANCTUARY
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
              Sound <span className="italic text-[#C27A5D]">Recommendations</span>
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-3 leading-relaxed font-inter">
              High-resonance acoustic alignment curated to soothe your dominant Dosha and synchronize perfectly with predicted hormonal states.
            </p>
          </div>

          {/* Quick Context Chips */}
          <div className="flex flex-wrap gap-3 items-center justify-center mb-12 animate-fade-rise-delay">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-900/60 px-3 py-1 rounded-full border border-stone-200/40 dark:border-stone-800">
              🧬 Dominant Dosha: <span className="font-bold text-[#1C1917] dark:text-[#FAF6F0]">{user?.dominantDosha || selectedDosha}</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-900/60 px-3 py-1 rounded-full border border-stone-200/40 dark:border-stone-800">
              🌙 predicted phase: <span className="font-bold text-[#C27A5D]">{predictionPhase}</span>
            </span>
            {cycle && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-900/60 px-3 py-1 rounded-full border border-stone-200/40 dark:border-stone-800">
                📅 Sync Source: <span className="font-bold text-[#1C1917] dark:text-[#FAF6F0]">Menstrual Cycle Store</span>
              </span>
            )}
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-stone-200 mb-10 justify-center max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('curated')}
              className={`flex-1 pb-4 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
                activeTab === 'curated'
                  ? 'border-[#C27A5D] text-[#C27A5D]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              🌸 Indian Indie Pop
            </button>
            <button
              onClick={() => setActiveTab('solfeggio')}
              className={`flex-1 pb-4 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 border-b-2 cursor-pointer ${
                activeTab === 'solfeggio'
                  ? 'border-[#C27A5D] text-[#C27A5D]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              🌀 Vedic Solfeggio
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Calibration controls */}
            <div className="lg:col-span-5 w-full space-y-6">
              
              {/* Interactive Vibe Calibrator */}
              <Card className="border-[#C27A5D]/10 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-bold mb-4 block">
                  VIBE & ENERGY CALIBRATOR
                </span>
                
                <h3 className="text-lg font-serif italic text-stone-900 dark:text-[#FAF6F0] mb-2 leading-relaxed">
                  Calibrate Your Current Frequencies
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-inter mb-6">
                  Adjust the energy slider to match your current spiritual or mental focus. The Sound Sanctuary will immediately recalibrate its curated playlists.
                </p>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={handleSliderChange}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#C27A5D] mb-4"
                />

                <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-6">
                  <span>Slow & Reflective</span>
                  <span>Vibrant & High</span>
                </div>

                <div className="p-4 bg-[#FAF6F0] dark:bg-stone-900/60 rounded-2xl border border-stone-200/40 dark:border-stone-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Current Calibrated Level:</span>
                    <span className="text-xs font-bold font-mono text-[#C27A5D]">{energyLevel} / 10</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 text-xs font-serif italic leading-relaxed">
                    {energyLevel <= 3 && "🌌 Deep Rest — Calibrated for low-energy, inward-turning rest states."}
                    {energyLevel > 3 && energyLevel <= 5 && "🌿 Calm Focus — Balanced tones for steady productivity and quiet peace."}
                    {energyLevel > 5 && energyLevel <= 8 && "✨ Creative Flow — Uplifting rhythms for artistic expression and rising spark."}
                    {energyLevel > 8 && "🔥 Radiating Joy — High-vibration, high-energy tracks for complete cosmic expression."}
                  </p>
                </div>
              </Card>

              {/* Dosha Calibration card */}
              <Card className="border-[#C27A5D]/10 bg-white/60 dark:bg-stone-900/60">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-bold mb-4 block">
                  DOSHA ALIGNMENT TARGET
                </span>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {['Vata', 'Pitta', 'Kapha'].map((dosha) => {
                    const isActive = selectedDosha.toLowerCase().includes(dosha.toLowerCase());
                    return (
                      <button
                        key={dosha}
                        onClick={() => setSelectedDosha(dosha)}
                        className={`px-4 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-[#1C1917] text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {dosha}
                      </button>
                    );
                  })}
                </div>
                <div className={`p-4 rounded-2xl border ${getDoshaTheme(selectedDosha).bg}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                    {getDoshaTheme(selectedDosha).label} Activated
                  </h4>
                  <p className="text-[11px] leading-relaxed font-serif italic">
                    {selectedDosha === 'Vata' && "Calibrating music specifically to soothe the wind and ether. Prioritizing warm, reassuring acoustic strings and 432Hz cosmic earth drones."}
                    {selectedDosha === 'Pitta' && "Calibrating music to cool down fire and heat. Prioritizing liquid guitar work, bilingual tribal folk, and 528Hz cellular transformation soundscapes."}
                    {selectedDosha === 'Kapha' && "Calibrating music to energize solid earth and water elements. Prioritizing rich synths, vintage electronics, and 639Hz heart-connection frequencies."}
                  </p>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: Active Playlist details */}
            <div className="lg:col-span-7 w-full space-y-6">

              {activeTab === 'curated' ? (
                /* Tab Curated: Indian Indie Pop Gems */
                <Card variant="dark" className="border-[#C27A5D]/10">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-bold block">
                        CURATED SANCTUARY PLAYLIST
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif italic text-white font-normal mt-1">
                        Ayurvedic Indie Pop gems
                      </h2>
                    </div>
                    <span className="text-2xl animate-pulse">🎵</span>
                  </div>

                  <div className="space-y-4">
                    {musicRecommendations.map((song: RecommendedSong, idx: number) => {
                      const isPlaying = activeVisualizer === idx;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#C27A5D]/30 transition-all duration-300 gap-4"
                        >
                          <div className="flex-1 flex items-center gap-4">
                            {/* Interactive Disc Visualizer */}
                            <button
                              onClick={() => setActiveVisualizer(isPlaying ? null : idx)}
                              className={`w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-sm shadow-md cursor-pointer relative overflow-hidden flex-shrink-0 ${
                                isPlaying ? 'animate-spin [animation-duration:4s]' : ''
                              }`}
                            >
                              <span className="z-10">{isPlaying ? '⏸' : '▶'}</span>
                              {isPlaying && (
                                <div className="absolute inset-0 bg-[#C27A5D]/25 blur-sm animate-pulse" />
                              )}
                            </button>

                            <div>
                              <p className="font-cormorant text-[#FAF6F0] font-normal text-base leading-tight">
                                {song.title}
                              </p>
                              <p className="text-xs text-stone-400 mt-1">
                                {song.artist} • <span className="text-[#C27A5D] font-mono text-[10px] uppercase tracking-wider">{song.mood} Resonance</span>
                              </p>
                            </div>
                          </div>

                          {/* Action Streams */}
                          <div className="flex gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 items-center">
                            <a
                              href={song.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 rounded-full transition-all duration-300"
                            >
                              🟢 Spotify
                            </a>
                            <a
                              href={song.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C27A5D]/10 hover:bg-[#C27A5D]/20 border border-[#C27A5D]/20 text-[#FAF6F0] rounded-full transition-all duration-300"
                            >
                              🔴 YouTube
                            </a>
                            <a
                              href={`https://music.apple.com/us/search?term=${encodeURIComponent(song.artist + ' ' + song.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded-full transition-all duration-300"
                            >
                              🍎 Apple
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activeVisualizer !== null && (
                    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between animate-fade-rise">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#C27A5D]">PLAYING SHORTCUT REDIRECT:</span>
                        <span className="text-xs font-serif italic text-white">
                          &ldquo;{musicRecommendations[activeVisualizer]?.title} — {musicRecommendations[activeVisualizer]?.artist}&rdquo;
                        </span>
                      </div>
                      {/* Animated Soundwaves */}
                      <div className="flex items-end gap-[3px] h-4">
                        <div className="w-[3px] bg-[#C27A5D] rounded-full animate-[pulse_0.8s_infinite] h-full" />
                        <div className="w-[3px] bg-[#C27A5D] rounded-full animate-[pulse_1.2s_infinite] h-1/2" style={{ animationDelay: '0.2s' }} />
                        <div className="w-[3px] bg-[#C27A5D] rounded-full animate-[pulse_1s_infinite] h-3/4" style={{ animationDelay: '0.4s' }} />
                        <div className="w-[3px] bg-[#C27A5D] rounded-full animate-[pulse_0.7s_infinite] h-2/3" style={{ animationDelay: '0.1s' }} />
                      </div>
                    </div>
                  )}

                  <p className="text-center text-[9px] font-mono text-stone-500 uppercase tracking-wider mt-6 block">
                    ✨ Curated on predicted {predictionPhase} state and {energyLevel}/10 energy calibrations
                  </p>
                </Card>
              ) : (
                /* Tab Solfeggio: Vedic Solfeggio soundscapes */
                <div className="space-y-6">
                  {SOLFEGGIO_SOUNDSCAPES.map((sound, idx) => (
                    <Card key={idx} variant="dark" className="border-[#C27A5D]/10 hover:border-[#C27A5D]/30 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl p-2 bg-white/5 rounded-2xl border border-white/5">{sound.icon}</span>
                          <div>
                            <span className="text-xs font-mono font-bold text-[#C27A5D] uppercase tracking-widest">{sound.frequency} • {sound.purpose}</span>
                            <h3 className="text-lg font-serif italic text-white font-normal mt-0.5">{sound.name}</h3>
                          </div>
                        </div>
                        <a
                          href={sound.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#C27A5D] text-white hover:bg-white hover:text-[#1C1917] rounded-full transition-all duration-300 cursor-pointer shadow-md"
                        >
                          🎧 Play Solfeggio
                        </a>
                      </div>
                      
                      <p className="text-stone-300 text-xs font-serif leading-relaxed italic mb-4">
                        &ldquo;{sound.description}&rdquo;
                      </p>
                      
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">AYURVEDIC THERAPEUTIC INDEX</span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">✓ {sound.benefit}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* Proceed to Dashboard / Compile wellness metrics */}
          <div className="mt-12 mb-8 flex justify-center animate-fade-rise">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('musicPreferencesSet', 'true');
                }
                // Save current target dosha to user music preferences if not empty
                if (user && (!user.musicPreferences || user.musicPreferences.length === 0)) {
                  useUserStore.getState().setMusicPreferences([selectedDosha.toLowerCase()]);
                } else {
                  useUserStore.getState().syncUserProfile();
                }
                router.push('/dashboard');
              }}
              className="px-10 py-4.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] hover:bg-[#C27A5D] text-white transition-all duration-300 shadow-md cursor-pointer text-center"
            >
              COMPILE WELLNESS PORTAL & ENTER DASHBOARD →
            </button>
          </div>

        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-12 mt-auto border-t border-[#1C1917]/5 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-500 tracking-wider">
          <div>OJAS / SOUND SANCTUARY</div>
          <div>© OJAS RITUAL MMXXVI</div>
        </footer>

      </div>
    </div>
  );
}