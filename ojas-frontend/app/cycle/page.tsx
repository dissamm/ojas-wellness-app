'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { LunarPhaseAnimation } from '../components/LunarPhaseAnimation';
import { useCycleStore } from '../store/cycleStore';
import { getMusicRecommendations, RecommendedSong } from '../services/musicService';

interface PredictionData {
  success: boolean;
  predicted_mood: number;
  cycle_phase: string;
  day_in_cycle: number;
  moon_phase: string;
  moon_illumination: number;
  recommended_songs?: string[];
  recommended_genres?: string[];
}

export default function CyclePage() {
  const cycle = useCycleStore((state) => state.cycle);
  const setCycle = useCycleStore((state) => state.setCycle);

  const [startDate, setStartDate] = useState(cycle?.startDate || '');
  const [cycleLength, setCycleLength] = useState(cycle?.cycleLengthDays || 28);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(!cycle);
  const [manualCycleDay, setManualCycleDay] = useState(14);
  const [musicRecommendations, setMusicRecommendations] = useState<RecommendedSong[]>([]);

  useEffect(() => {
    if (cycle && cycle.startDate) {
      const today = new Date();
      const calculatedDay = calculateCycleDay(cycle.startDate, today, cycle.cycleLengthDays);
      setManualCycleDay(calculatedDay);
      fetchPrediction(calculatedDay);
      setIsEditing(false);
    }
  }, [cycle]);

  const calculateCycleDay = (lastPeriodDate: string, today: Date, length: number): number => {
    const last = new Date(lastPeriodDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    let day = (diffDays % length) + 1;
    if (day < 1) day = 1;
    if (day > length) day = length;
    return day;
  };

  const getCyclePhaseFromDay = (day: number, length: number): string => {
    const quarterLength = Math.floor(length / 4);
    if (day <= 5 || day <= quarterLength * 0.25) return 'Menstrual';
    if (day <= quarterLength) return 'Menstrual';
    if (day <= quarterLength * 2) return 'Follicular';
    if (day <= quarterLength * 2.5) return 'Ovulatory';
    return 'Luteal';
  };

  const fetchPrediction = async (cycleDay: number) => {
    setLoading(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/predict-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycle_day: cycleDay,
          date: today,
          estrogen: 50,
        }),
      });

      const data = await response.json();
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
      const errMsg = err instanceof Error ? err.message : String(err);
      setError('Cannot connect to backend: ' + errMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    setCycle({
      startDate,
      cycleLengthDays: cycleLength,
    });

    const today = new Date();
    const calculatedDay = calculateCycleDay(startDate, today, cycleLength);
    setManualCycleDay(calculatedDay);

    setIsEditing(false);
    await fetchPrediction(calculatedDay);
  };

  const handleUpdateCycleDay = async (newDay: number) => {
    setManualCycleDay(newDay);
    await fetchPrediction(newDay);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col justify-between selection:bg-[#DF8060]/10">
      <div>
        <Header />

        <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 w-full space-y-12">
          
          {/* Hero Section */}
          <div className="mb-10 md:mb-14 text-center animate-fade-rise">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#DF8060] font-semibold mb-3 block">
              COSMIC ALIGNMENT
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-instrument-serif text-[#1C1917] leading-[1.08] tracking-tight">
              Cosmic Cycle <span className="italic text-[#DF8060]">Wisdom</span>
            </h1>
            <p className="text-stone-500 font-inter text-sm mt-4 leading-relaxed max-w-xl mx-auto">
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
              
              {prediction && !isEditing && (
                <div className="space-y-8">
                  {/* Daily Harmony Card */}
                  <Card className="text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/60 border border-stone-200/50 flex items-center justify-center text-4xl shadow-[0_8px_30px_rgba(223,128,96,0.08)] mb-6">
                      {getMoonIcon(prediction.moon_phase)}
                    </div>

                    <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-2">
                      DAILY HARMONY SCORE
                    </span>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-7xl sm:text-8xl font-serif text-stone-900 font-normal">
                        {prediction.predicted_mood}
                      </span>
                      <span className="text-xl font-mono text-stone-400">/ 10</span>
                    </div>

                    <p className="text-base sm:text-lg text-stone-800 font-serif italic font-normal leading-relaxed">
                      &ldquo;{getMoodDescription(prediction.predicted_mood)}&rdquo;
                    </p>
                  </Card>

                  {/* Dual Grid details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-2 block">
                        🔄 CYCLE PHASE
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif italic text-stone-900 font-normal mb-1">
                        {prediction.cycle_phase || 'N/A'}
                      </h3>
                      <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mt-1">
                        Day {prediction.day_in_cycle || manualCycleDay} of {cycleLength}
                      </p>
                    </Card>

                    <Card>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-2 block">
                        🌙 LUNAR PHASE
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif italic text-stone-900 font-normal mb-1">
                        {prediction.moon_phase || 'N/A'}
                      </h3>
                      <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mt-1">
                        {prediction?.moon_illumination?.toFixed(1) || '0'}% Illuminated
                      </p>
                    </Card>
                  </div>

                  {/* Curated sound frequencies */}
                  {musicRecommendations.length > 0 && (
                    <Card>
                      <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-6 block">
                        🎵 CURATED FREQUENCIES FOR YOUR PHASE
                      </span>

                      <div className="space-y-3">
                        {musicRecommendations.map((song: RecommendedSong, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-stone-200/20 hover:border-[#DF8060]/30 transition-all duration-300"
                          >
                            <div className="flex-1">
                              <p className="font-serif text-stone-900 font-normal text-base">
                                {song.title}
                              </p>
                              <p className="text-xs text-stone-500 mt-1">
                                {song.artist} • {song.mood}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <a
                                href={song.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-300/40 text-emerald-800 rounded-full transition-all duration-300"
                              >
                                Play
                              </a>
                              <a
                                href={song.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/40 text-[#DF8060] rounded-full transition-all duration-300"
                              >
                                Watch
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-center text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-6">
                        ✨ Music synced with your {getCyclePhaseFromDay(manualCycleDay, cycleLength)} phase
                      </p>
                    </Card>
                  )}

                  {/* Manual Override Slider */}
                  <div className="w-full bg-[#FDF6EC] border border-orange-200/40 rounded-[24px] p-8 shadow-[inset_0_1px_3px_rgba(28,25,22,0.01)]">
                    <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-4 block">
                      ALIGN YOUR RHYTHMS (MANUAL OVERRIDE)
                    </span>

                    <input
                      type="range"
                      min="1"
                      max={cycleLength}
                      value={manualCycleDay}
                      onChange={(e) => handleUpdateCycleDay(parseInt(e.target.value))}
                      className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#DF8060]"
                      disabled={loading}
                    />

                    <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase tracking-widest mt-3">
                      <span>Day 1 (Menses)</span>
                      <span>Day {Math.floor(cycleLength / 2)} (Ovulation)</span>
                      <span>Day {cycleLength} (Luteal)</span>
                    </div>

                    <p className="text-center font-serif text-stone-700 text-sm mt-5">
                      Currently calibrated to: <span className="font-bold font-mono text-[#DF8060]">Day {manualCycleDay}</span>
                    </p>
                  </div>

                  {/* Recalibrate button */}
                  <Button
                    onClick={handleEdit}
                    disabled={loading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {loading ? 'CALIBRATING...' : '🔄 RECALIBRATE COSMIC DATA'}
                  </Button>
                </div>
              )}

              {loading && !prediction && (
                <Card className="text-center py-16">
                  <div className="animate-spin text-5xl mb-4">🌙</div>
                  <p className="text-stone-600 font-serif italic text-base">Calculating celestial alignments...</p>
                </Card>
              )}

              {error && (
                <Card className="border-red-200 bg-red-50/50 p-8 text-center">
                  <p className="text-red-800 font-semibold font-mono text-xs uppercase tracking-wider mb-2">⚠️ Error</p>
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="md"
                  >
                    Try Again
                  </Button>
                </Card>
              )}

              {(isEditing || !cycle) && (
                <Card className="w-full">
                  <div className="text-center mb-8">
                    <p className="text-5xl mb-3">📅</p>
                    <h2 className="text-2xl sm:text-3xl font-serif italic text-stone-900 font-normal mb-2">
                      Log Your Period Rhythms
                    </h2>
                    <p className="text-stone-500 font-inter text-sm leading-relaxed max-w-sm mx-auto">
                      Enter the start date of your last cycle to calibrate predictive Ayurvedic alignment.
                    </p>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    <Input
                      type="date"
                      label="First Day of Last Period"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />

                    <Select
                      label="Typical Cycle Length"
                      value={String(cycleLength)}
                      onChange={(e) => setCycleLength(parseInt(e.target.value))}
                      options={Array.from({ length: 15 }, (_, i) => {
                        const days = i + 21;
                        return {
                          value: String(days),
                          label: `${days} days ${days === 28 ? '(average)' : ''}`,
                        };
                      })}
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      {loading ? 'CALIBRATING...' : '✨ SYNC & DISCOVER COSMIC FLOW'}
                    </Button>
                  </form>
                </Card>
              )}

            </div>

          </div>

          {/* Bottom Row Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start pt-6 border-t border-stone-200/30 animate-fade-rise-delay-2">
            <Card className="text-center flex flex-col items-center">
              <p className="text-3xl mb-3">🧠</p>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-2">
                PREDICTIVE VEDIC MODELING
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed font-inter">
                Our mathematical model projects your emotional energy by synthesizing your menstrual phase coordinates against real-time lunar trajectories.
              </p>
            </Card>

            <Card className="text-center flex flex-col items-center">
              <p className="text-3xl mb-3">🌙</p>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#DF8060] font-semibold mb-2">
                COSMIC CALIBRATION DATA
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed font-inter">
                Trained on 5,659 biological records, Ojas mapping aligns modern hormone cycles with traditional Vedic principles and lunar wisdom.
              </p>
            </Card>
          </div>
        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>PHASE / CHRONOS</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}