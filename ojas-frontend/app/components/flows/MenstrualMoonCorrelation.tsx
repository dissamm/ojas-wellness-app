'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useCycleStore } from '../../store/cycleStore';
import { PhaseCard } from './PhaseCard';

export const MenstrualMoonCorrelation = ({
    onPredictionComplete
}: {
    onPredictionComplete?: (data: { predictedMood: number | null; moodType: string; cyclePhase: string }) => void;
}) => {
    const { setMenstrualData, setCurrentStep, user } = useUserStore();
    const setCycle = useCycleStore((state) => state.setCycle);

    const [cycleStartDate, setCycleStartDate] = useState('');
    const [cycleLength, setCycleLength] = useState(28);
    const [moonPhase, setMoonPhase] = useState('');
    const [showInsights, setShowInsights] = useState(false);
    const [previewPhase, setPreviewPhase] = useState('follicular');

    // Live ML Prediction State
    const [mlPredictedMood, setMlPredictedMood] = useState<number | null>(null);
    const [mlMoodType, setMlMoodType] = useState('');
    const [mlCyclePhase, setMlCyclePhase] = useState('');
    const [mlLoading, setMlLoading] = useState(false);
    const [mlError, setMlError] = useState('');

    useEffect(() => {
        // Calculate current moon phase
        const today = new Date();
        const day = today.getDate();
        const phase = day % 29.5;

        if (phase < 7.38) setMoonPhase('🌑 New Moon');
        else if (phase < 14.76) setMoonPhase('🌒 Waxing Crescent');
        else if (phase < 22.14) setMoonPhase('🌕 Full Moon');
        else setMoonPhase('🌘 Waning Crescent');
    }, []);

    const calculateCycleDay = (startDateStr: string, length: number): number => {
        const today = new Date();
        const start = new Date(startDateStr);
        const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        let day = (diffDays % length) + 1;
        if (day < 1) day = 1;
        if (day > length) day = length;
        return day;
    };

    const handleContinue = () => {
        if (cycleStartDate) {
            setMenstrualData(new Date(cycleStartDate));
            setCycle({
                startDate: cycleStartDate,
                cycleLengthDays: cycleLength,
            });
        }
        // Save predictions to store if any
        if (onPredictionComplete) {
            onPredictionComplete({
                predictedMood: mlPredictedMood ?? 7.0,
                moodType: mlMoodType || 'balanced',
                cyclePhase: mlCyclePhase || previewPhase
            });
        }
        setCurrentStep('music');
    };

    const handleAnalyze = async () => {
        if (!cycleStartDate) return;

        setMlLoading(true);
        setMlError('');
        setShowInsights(false);

        const cycleDay = calculateCycleDay(cycleStartDate, cycleLength);
        const todayStr = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch('http://localhost:5000/api/predict-mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cycle_day: cycleDay,
                    date: todayStr,
                    prakriti: user.dominantDosha || 'Pitta',
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMlPredictedMood(data.predicted_mood);
                setMlMoodType(data.mood_type);
                setMlCyclePhase(data.cycle_phase);
                
                const normalizedPhase = data.cycle_phase.toLowerCase();
                setPreviewPhase(normalizedPhase);
                setShowInsights(true);
                
                if (onPredictionComplete) {
                    onPredictionComplete({
                        predictedMood: data.predicted_mood,
                        moodType: data.mood_type,
                        cyclePhase: data.cycle_phase
                    });
                }
            } else {
                setMlError(data.error || 'Failed to fetch predictions');
                const offlinePhase = getCyclePhaseFromDay(cycleDay, cycleLength);
                setMlCyclePhase(offlinePhase);
                setPreviewPhase(offlinePhase.toLowerCase());
                setShowInsights(true); // fallback
                if (onPredictionComplete) {
                    onPredictionComplete({
                        predictedMood: 7.0,
                        moodType: 'balanced',
                        cyclePhase: offlinePhase
                    });
                }
            }
        } catch (err) {
            console.error('Failed to fetch ML mood prediction:', err);
            setMlError('Cannot connect to Flask model API server. Using offline calculation.');
            const offlinePhase = getCyclePhaseFromDay(cycleDay, cycleLength);
            setMlCyclePhase(offlinePhase);
            setPreviewPhase(offlinePhase.toLowerCase());
            setShowInsights(true); // fallback
            if (onPredictionComplete) {
                onPredictionComplete({
                    predictedMood: 7.0,
                    moodType: 'balanced',
                    cyclePhase: offlinePhase
                });
            }
        } finally {
            setMlLoading(false);
        }
    };

    const getCyclePhaseFromDay = (day: number, length: number): string => {
        const quarterLength = Math.floor(length / 4);
        if (day <= 5 || day <= quarterLength * 0.25) return 'Menstrual';
        if (day <= quarterLength) return 'Menstrual';
        if (day <= quarterLength * 2) return 'Follicular';
        if (day <= quarterLength * 2.5) return 'Ovulation';
        return 'Luteal';
    };

    const getMoonStyle = () => {
        const lower = moonPhase.toLowerCase();
        if (lower.includes('new')) {
            return { lightClass: 'bg-primary border border-white/10', glowClass: 'shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' };
        }
        if (lower.includes('crescent') || lower.includes('waxing')) {
            return { lightClass: 'bg-gradient-to-r from-[#1A1A1A] via-stone-800 to-amber-200/90', glowClass: 'shadow-[0_0_30px_rgba(253,186,116,0.18),_inset_-10px_-10px_20px_rgba(0,0,0,0.8)] border border-amber-300/10' };
        }
        if (lower.includes('full')) {
            return { lightClass: 'bg-gradient-to-tr from-amber-200 via-amber-300 to-yellow-100', glowClass: 'shadow-[0_0_40px_rgba(253,186,116,0.35)] border border-amber-300/30' };
        }
        // waning
        return { lightClass: 'bg-gradient-to-l from-[#1A1A1A] via-stone-800 to-amber-200/90', glowClass: 'shadow-[0_0_30px_rgba(253,186,116,0.15),_inset_10px_-10px_20px_rgba(0,0,0,0.8)] border border-amber-300/10' };
    };

    const moonStyle = getMoonStyle();

    return (
        <div className="min-h-screen bg-background text-on-primary relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 selection:bg-amber-500/20">
            {/* Sparkle Twinkle Stars Background */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute w-1 h-1 bg-[#1a0a2e]/40 rounded-full top-12 left-1/4 animate-ping"></div>
                <div className="absolute w-1 h-1 bg-secondary/30 rounded-full top-1/3 left-3/4 animate-pulse"></div>
                <div className="absolute w-1 h-1 bg-[#FF6B9D]/40 rounded-full top-2/3 left-1/3 animate-pulse"></div>
                <div className="absolute w-1.5 h-1.5 bg-[#B8A8D8]/20 rounded-full top-4/5 left-4/5 animate-ping"></div>
            </div>

            <div className="max-w-2xl w-full relative z-10">
                {/* Header Block */}
                <div className="text-center mb-8">
                    <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-secondary font-semibold mb-2 block">
                        CELESTIAL RHYTHM
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal italic tracking-wider text-secondary mb-3">
                        Cycle & Moon Magic
                    </h1>
                    <p className="text-[#A8A8A8] text-sm max-w-md mx-auto leading-relaxed">
                        Sync your period rhythms with lunar orbits using our predictive Vedic ML models.
                    </p>
                </div>

                {/* Primary Glassmorphic Input Panel */}
                <div className="bg-primary border border-white/5 shadow-md backdrop-blur-xl rounded-card p-8 shadow-2xl mb-6 text-left">
                    {/* Glowing Realistic Moon */}
                    <div className="text-center mb-8 flex flex-col items-center justify-center">
                        <div className={`relative w-28 h-28 rounded-full ${moonStyle.lightClass} ${moonStyle.glowClass} transition-all duration-700 overflow-hidden flex items-center justify-center mb-4`}>
                            {/* Moon Texture Details */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-700 to-stone-900 mix-blend-overlay"></div>
                            <div className="absolute w-6 h-6 rounded-full bg-black/10 blur-[1px] top-6 left-6"></div>
                            <div className="absolute w-8 h-8 rounded-full bg-black/15 blur-[2px] bottom-6 right-8"></div>
                        </div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-secondary font-bold mb-1">
                            Current Lunar Alignment
                        </h3>
                        <p className="font-serif italic text-xl text-on-primary">{moonPhase || 'Waxing Crescent'}</p>
                    </div>

                    <div className="border-t border-white/10 my-6"></div>

                    {/* Input Coordinates */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#A8A8A8] mb-2 font-semibold">
                                When did your last menstrual cycle start?
                            </label>
                            <input
                                type="date"
                                value={cycleStartDate}
                                onChange={(e) => setCycleStartDate(e.target.value)}
                                className="w-full bg-[#2D2D2D] border border-white/10 rounded-input py-3 px-4 text-on-primary focus:outline-none focus:border-secondary transition-colors cursor-pointer text-sm font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#A8A8A8] mb-2 font-semibold">
                                Typical cycle length (days)
                            </label>
                            <select
                                value={cycleLength}
                                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                                className="w-full bg-[#2D2D2D] border border-white/10 rounded-input py-3 px-4 text-on-primary focus:outline-none focus:border-secondary transition-colors cursor-pointer text-sm font-mono"
                            >
                                {Array.from({ length: 15 }, (_, i) => {
                                    const days = i + 21;
                                    return <option key={days} value={days} className="bg-primary text-on-primary">{days} days</option>;
                                })}
                            </select>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!cycleStartDate || mlLoading}
                            className="w-full py-3.5 rounded-button text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#F5F1ED] text-[#0F0F0F] hover:bg-secondary hover:text-on-primary border border-transparent disabled:opacity-30 active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer flex justify-center items-center gap-2"
                        >
                            {mlLoading ? (
                                <>
                                    <span className="animate-spin text-lg">🌙</span> Querying Trained ML Model...
                                </>
                            ) : (
                                'Analyze My Vibe'
                            )}
                        </button>
                    </div>
                </div>

                {mlError && (
                    <div className="bg-red-500/10 text-red-300 rounded-input p-4 text-xs font-mono mb-4 text-center border border-red-500/35">
                        {mlError}
                    </div>
                )}

                {/* Live ML Insights Output Card - Aesthetic PhaseCard */}
                {showInsights && (
                    <div className="mt-8 text-left w-full space-y-6">
                        <div className="text-center">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-secondary font-bold block">
                                Interactive Phase Explorer
                            </span>
                        </div>
                        {/* Phase Selector */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                          {['menstrual', 'follicular', 'ovulation', 'luteal'].map((p) => (
                            <button
                              key={p}
                              onClick={() => setPreviewPhase(p)}
                              className={`
                                py-2 px-1 rounded-button text-[10px] sm:text-xs font-semibold transition-all cursor-pointer text-center
                                ${previewPhase === p
                                  ? 'bg-[#2D2D2D] text-on-primary border border-white/10'
                                  : 'bg-primary text-[#A8A8A8] hover:bg-[#2D2D2D] border border-transparent'
                                }
                              `}
                            >
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                          ))}
                        </div>

                        <PhaseCard
                            phase={previewPhase}
                            cycleDay={previewPhase === (mlCyclePhase || 'Follicular').toLowerCase() ? calculateCycleDay(cycleStartDate, cycleLength) : 14}
                            totalCycleDays={cycleLength}
                            dominantDosha={user?.dominantDosha || 'Pitta'}
                            onContinue={handleContinue}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};