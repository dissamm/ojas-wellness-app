'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { LunarPhaseAnimation } from '../components/LunarPhaseAnimation';
import { useCycleStore } from '../store/cycleStore';
import { useUserStore } from '../store/userStore';
import { getMusicRecommendations, RecommendedSong } from '../services/musicService';
import { predictMood, PredictionData } from '../lib/api';

export default function CyclePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user?.gender === 'male') {
      router.replace('/dashboard');
    }
  }, [user?.gender, router]);

  const cycle = useCycleStore((state) => state.cycle);
  const setCycle = useCycleStore((state) => state.setCycle);
  const setMenstrualData = useUserStore((state) => state.setMenstrualData);

  const [startDate, setStartDate] = useState(cycle?.startDate || '');
  const [cycleLength, setCycleLength] = useState(cycle?.cycleLengthDays || 28);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(!cycle);
  const [manualCycleDay, setManualCycleDay] = useState(14);
  const [musicRecommendations, setMusicRecommendations] = useState<RecommendedSong[]>(
    getMusicRecommendations('menstrual', 7)
  );

  const calculateCycleDay = useCallback((lastPeriodDate: string, today: Date, length: number): number => {
    const last = new Date(lastPeriodDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    let day = (diffDays % length) + 1;
    if (day < 1) day = 1;
    if (day > length) day = length;
    return day;
  }, []);

  const getCyclePhaseFromDay = useCallback((day: number, length: number): string => {
    const quarterLength = Math.floor(length / 4);
    if (day <= 5 || day <= quarterLength * 0.25) return 'Menstrual';
    if (day <= quarterLength) return 'Menstrual';
    if (day <= quarterLength * 2) return 'Follicular';
    if (day <= quarterLength * 2.5) return 'Ovulatory';
    return 'Luteal';
  }, []);

  const fetchPrediction = useCallback(async (cycleDay: number) => {
    setLoading(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0];

      const data = await predictMood({
        cycle_day: cycleDay,
        date: today,
        estrogen: 50,
      });
      console.log('API Response:', data);

      if (data.success) {
        setPrediction(data);

        const phase = getCyclePhaseFromDay(cycleDay, cycleLength);
        const recommendations = getMusicRecommendations(phase, data.predicted_mood);
        setMusicRecommendations(recommendations);
      } else {
        setError(data.error || 'Failed to get prediction');
      }
    } catch (err) {
      console.warn('Backend offline, using offline lunar-vedic projections:', err);
      // Beautiful mock fallback
      const phase = getCyclePhaseFromDay(cycleDay, cycleLength);
      const mockPrediction: PredictionData = {
        success: true,
        predicted_mood: 7,
        cycle_phase: phase,
        day_in_cycle: cycleDay,
        moon_phase: 'Waxing Gibbous',
        moon_illumination: 75,
      };
      setPrediction(mockPrediction);

      const recommendations = getMusicRecommendations(phase, mockPrediction.predicted_mood);
      setMusicRecommendations(recommendations);
    } finally {
      setLoading(false);
    }
  }, [cycleLength, getCyclePhaseFromDay]);

  // Automatically sync with userStore if empty
  useEffect(() => {
    if (!cycle && user?.menstrualCycleStart) {
      const parsedStart = new Date(user.menstrualCycleStart).toISOString().split('T')[0];
      setCycle({
        startDate: parsedStart,
        cycleLengthDays: cycleLength,
      });
      setStartDate(parsedStart);
      setIsEditing(false);
    }
  }, [cycle, user, cycleLength, setCycle]);

  useEffect(() => {
    if (cycle && cycle.startDate) {
      const today = new Date();
      const calculatedDay = calculateCycleDay(cycle.startDate, today, cycle.cycleLengthDays);
      setManualCycleDay(calculatedDay);
      fetchPrediction(calculatedDay);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [cycle, calculateCycleDay, fetchPrediction]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    // Validate start date is not in the future or older than 90 days
    const inputDate = new Date(startDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      alert('Start date cannot be in the future');
      return;
    }
    if (daysDiff > 90) {
      alert('Start date must be within the last 90 days');
      return;
    }

    // Save to local cycleStore
    setCycle({
      startDate,
      cycleLengthDays: cycleLength,
    });

    // Mirror to global userStore
    setMenstrualData(new Date(startDate));

    const calculatedDay = calculateCycleDay(startDate, today, cycleLength);
    setManualCycleDay(calculatedDay);

    setIsEditing(false);
    await fetchPrediction(calculatedDay);
  };

  const handleUpdateCycleDay = async (newDay: number) => {
    setManualCycleDay(newDay);
    await fetchPrediction(newDay);
  };

  const getMoonIcon = (moonPhase: string) => {
    const phase = moonPhase?.toLowerCase() || '';
    if (phase.includes('new')) return '🌑';
    if (phase.includes('waxing crescent')) return '🌒';
    if (phase.includes('first quarter')) return '🌓';
    if (phase.includes('waxing gibbous')) return '🌔';
    if (phase.includes('full')) return '🌕';
    if (phase.includes('waning gibbous')) return '🌖';
    if (phase.includes('last quarter')) return '🌗';
    if (phase.includes('waning crescent')) return '🌘';
    return '🌙';
  };

  const getMoodDescription = (moodScore: number) => {
    if (moodScore >= 8) return 'Resonant & Radiant — Clear day ahead. ✨';
    if (moodScore >= 6) return 'Balanced & Peaceful — Positive energy. 🌟';
    if (moodScore >= 4) return 'Contemplative & Quiet — Take it easy today. 🌿';
    return 'Slow & Reflective — Honor your physical needs. 💫';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-amber-500/20 relative overflow-hidden transition-colors duration-500">
      {/* Sparkle Twinkle Stars Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute w-1 h-1 bg-[#C27A5D]/40 rounded-full top-12 left-1/4 animate-ping"></div>
        <div className="absolute w-1 h-1 bg-[#C27A5D]/30 rounded-full top-1/3 left-3/4 animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-[#C27A5D]/40 rounded-full top-2/3 left-1/3 animate-pulse"></div>
        <div className="absolute w-1.5 h-1.5 bg-[#C27A5D]/20 rounded-full top-4/5 left-4/5 animate-ping"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <div>
          <Header />

          <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 w-full space-y-12">
            {/* Back to Dashboard Navigation Link */}
            <div className="flex justify-start animate-fade-rise">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition duration-300 text-xs font-mono uppercase tracking-widest cursor-pointer"
              >
                ← Return to Dashboard
              </Link>
            </div>
            
            {/* Hero Section */}
            <div className="mb-10 md:mb-14 text-center animate-fade-rise">
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold mb-3 block">
                COSMIC ALIGNMENT
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-cormorant text-[#1C1917] leading-[1.08] tracking-tight">
                Cosmic Cycle <span className="italic text-[#C27A5D]">Wisdom</span>
              </h1>
              <p className="text-stone-400 font-inter text-sm mt-4 leading-relaxed max-w-xl mx-auto">
                Sync your menstrual rhythm with the celestial lunar orbits. Discover your daily emotional prediction calibrated through predictive Vedic cycles.
              </p>
            </div>

            {/* Dual Column Layout */}
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              
              {/* LEFT COLUMN: Prominent Moon Phase Animation Sidebar panel */}
              <div className="lg:col-span-5 w-full animate-fade-rise">
                <LunarPhaseAnimation />
              </div>

              {/* RIGHT COLUMN: Interactive states, prediction details, and period forms */}
              <div className="lg:col-span-7 w-full space-y-8 animate-fade-rise-delay">
                
                {/* Loader View when fetching for the first time */}
                {loading && !prediction && (
                  <Card variant="dark" className="text-center py-16 border-[#C27A5D]/10">
                    <div className="animate-spin text-5xl mb-4">🌙</div>
                    <p className="text-stone-300 font-serif italic text-base">Calculating celestial alignments...</p>
                  </Card>
                )}

                {/* State A: Logger Form View (isEditing || !cycle) */}
                {(isEditing || !cycle) ? (
                  <Card variant="dark" className="w-full border-[#C27A5D]/10 bg-[#0e1220]/45 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-6 border-b border-[#1C1917]/5 pb-4">
                      <span className="text-3xl">📅</span>
                      <div>
                        <h3 className="text-lg font-serif italic text-white font-normal">
                          {cycle ? 'Log & Update Period Rhythms' : 'Sync Your Period Rhythms'}
                        </h3>
                        <p className="text-stone-400 text-xs font-inter mt-0.5 leading-relaxed">
                          {cycle ? 'Easily update your current period start date and cycle properties below.' : 'Enter your last period start date to calibrate Ayurvedic alignments.'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          type="date"
                          label="First Day of Last Period"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          variant="dark"
                          required
                        />

                        <Select
                          label="Typical Cycle Length"
                          value={String(cycleLength)}
                          onChange={(e) => setCycleLength(parseInt(e.target.value))}
                          variant="dark"
                          options={Array.from({ length: 15 }, (_, i) => {
                            const days = i + 21;
                            return {
                              value: String(days),
                              label: `${days} days ${days === 28 ? '(average)' : ''}`,
                            };
                          })}
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        {cycle && (
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] border border-[#1C1917]/10 text-stone-400 hover:text-stone-900 hover:bg-white/5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-[2] py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-[#FAF6F0] hover:bg-[#C27A5D] disabled:opacity-30 active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer"
                        >
                          {loading ? 'CALIBRATING...' : cycle ? '🔄 UPDATE & RECALIBRATE' : '✨ SYNC & DISCOVER COSMIC FLOW'}
                        </button>
                      </div>
                    </form>
                  </Card>
                ) : (
                  /* State B: Results Display (Returning User) */
                  prediction && (
                    <div className="space-y-6">
                      {/* Daily Harmony Card */}
                      <Card variant="dark" className="text-center flex flex-col items-center border-[#C27A5D]/10">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(253,186,116,0.15)] mb-6">
                          {getMoonIcon(prediction.moon_phase)}
                        </div>

                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-2">
                          DAILY HARMONY SCORE
                        </span>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-7xl sm:text-8xl font-cormorant text-[#FAF6F0] font-normal">
                            {prediction.predicted_mood}
                          </span>
                          <span className="text-xl font-mono text-stone-500">/ 10</span>
                        </div>

                        <p className="text-base sm:text-lg text-stone-300 font-serif italic font-normal leading-relaxed">
                          &ldquo;{getMoodDescription(prediction.predicted_mood)}&rdquo;
                        </p>
                      </Card>

                      {/* Dual Grid details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card variant="dark" className="border-[#C27A5D]/10">
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-2 block">
                            🔄 CYCLE PHASE
                          </span>
                          <h3 className="text-xl sm:text-2xl font-serif italic text-white font-normal mb-1">
                            {prediction.cycle_phase || 'N/A'}
                          </h3>
                          <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mt-1">
                            Day {prediction.day_in_cycle || manualCycleDay} of {cycleLength}
                          </p>
                        </Card>

                        <Card variant="dark" className="border-[#C27A5D]/10">
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-2 block">
                            🌙 LUNAR PHASE
                          </span>
                          <h3 className="text-xl sm:text-2xl font-serif italic text-white font-normal mb-1">
                            {prediction.moon_phase || 'N/A'}
                          </h3>
                          <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mt-1">
                            {prediction?.moon_illumination?.toFixed(1) || '0'}% Illuminated
                          </p>
                        </Card>
                      </div>
                      {/* Manual Override Slider */}
                      <div className="w-full bg-[#FAF6F0] dark:bg-stone-900/60 border border-[#1C1917]/5 dark:border-stone-800 rounded-[24px] p-8 shadow-[0_4px_20px_rgba(28,25,22,0.015)]">
                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-4 block">
                          ALIGN YOUR RHYTHMS (MANUAL OVERRIDE)
                        </span>

                        <input
                          type="range"
                          min="1"
                          max={cycleLength}
                          value={manualCycleDay}
                          onChange={(e) => handleUpdateCycleDay(parseInt(e.target.value))}
                          className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#C27A5D]"
                          disabled={loading}
                        />

                        <div className="flex justify-between text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-3">
                          <span>Day 1 (Menses)</span>
                          <span>Day {Math.floor(cycleLength / 2)} (Ovulation)</span>
                          <span>Day {cycleLength} (Luteal)</span>
                        </div>

                        <p className="text-center font-serif text-[#1C1917] dark:text-[#FAF6F0] text-sm mt-5">
                          Currently calibrated to: <span className="font-bold font-mono text-[#C27A5D]">Day {manualCycleDay}</span>
                        </p>
                      </div>

                      {/* Recalibrate & Next step CTAs */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex-1 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] border border-stone-650 text-stone-300 hover:bg-white/5 active:scale-[0.98] transition-all duration-300 cursor-pointer text-center"
                        >
                          🔄 Recalibrate
                        </button>
                        <button
                          onClick={() => router.push('/music')}
                          className="flex-[2] py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#FAF6F0] text-[#1C1917] hover:bg-[#C27A5D] hover:text-white active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer text-center"
                        >
                          CONTINUE TO SOUND SANCTUARY →
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Curated Frequencies / Music Recommendations (Permanently Visible) */}
                {musicRecommendations.length > 0 && (
                  <Card variant="dark" className="border-[#C27A5D]/10">
                    <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-6 block">
                      🎵 CURATED FREQUENCIES FOR YOUR PHASE
                    </span>

                    <div className="space-y-3">
                      {musicRecommendations.map((song: RecommendedSong, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-[#1C1917]/5 hover:border-[#C27A5D]/30 transition-all duration-300 gap-3"
                        >
                          <div className="flex-1">
                            <p className="font-cormorant text-[#FAF6F0] font-normal text-base">
                              {song.title}
                            </p>
                            <p className="text-xs text-stone-400 mt-1">
                              {song.artist} • {song.mood}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
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
                      ))}
                    </div>

                    <p className="text-center text-[9px] font-mono text-stone-500 uppercase tracking-wider mt-6">
                      ✨ Curated Indian Indie Pop to harmonize Vata, Pitta, and Kapha flows
                    </p>
                  </Card>
                )}

                {error && (
                  <Card variant="dark" className="border-red-500/25 bg-red-950/10 p-8 text-center">
                    <p className="text-red-400 font-semibold font-mono text-xs uppercase tracking-wider mb-2">⚠️ Error</p>
                    <p className="text-red-300 text-sm mb-4">{error}</p>
                    <button
                      onClick={() => fetchPrediction(manualCycleDay)}
                      className="px-6 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-white/20 text-white hover:bg-white/10 transition duration-300"
                    >
                      Try Again
                    </button>
                  </Card>
                )}

              </div>

            </div>

            {/* Bottom Row Information Cards */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start pt-6 border-t border-[#1C1917]/5 animate-fade-rise-delay-2">
              <Card variant="dark" className="text-center flex flex-col items-center border-[#C27A5D]/10">
                <p className="text-3xl mb-3">🧠</p>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-2">
                  PREDICTIVE VEDIC MODELING
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed font-inter">
                  Our mathematical model projects your emotional energy by synthesizing your menstrual phase coordinates against real-time lunar trajectories.
                </p>
              </Card>

              <Card variant="dark" className="text-center flex flex-col items-center border-[#C27A5D]/10">
                <p className="text-3xl mb-3">🌙</p>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-2">
                  COSMIC CALIBRATION DATA
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed font-inter">
                  Trained on 5,659 biological records, Ojas mapping aligns modern hormone cycles with traditional Vedic principles and lunar wisdom.
                </p>
              </Card>
            </div>
          </main>
        </div>

        <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-[#1C1917]/5 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-500 tracking-wider">
          <div>PHASE / CHRONOS</div>
          <div>© OJAS RITUAL MMXXVI</div>
        </footer>
      </div>
    </div>
  );
}