'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useCycleStore } from '../../store/cycleStore';

export const MenstrualMoonCorrelation = () => {
    const { setMenstrualData, setCurrentStep, user } = useUserStore();
    const setCycle = useCycleStore((state) => state.setCycle);

    const [cycleStartDate, setCycleStartDate] = useState('');
    const [cycleLength, setCycleLength] = useState(28);
    const [moonPhase, setMoonPhase] = useState('');
    const [showInsights, setShowInsights] = useState(false);

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
                    estrogen: 50,
                    prakriti: user.dominantDosha || 'Pitta',
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMlPredictedMood(data.predicted_mood);
                setMlMoodType(data.mood_type);
                setMlCyclePhase(data.cycle_phase);
                setShowInsights(true);
            } else {
                setMlError(data.error || 'Failed to fetch predictions');
                setShowInsights(true); // fall back to template insights
            }
        } catch (err) {
            console.error('Failed to fetch ML mood prediction:', err);
            setMlError('Cannot connect to Flask model API server. Using default calculation.');
            setShowInsights(true); // fall back
        } finally {
            setMlLoading(false);
        }
    };

    const getMoonStyle = () => {
        const lower = moonPhase.toLowerCase();
        if (lower.includes('new')) {
            return { lightClass: 'bg-stone-900 border border-stone-800', glowClass: 'shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' };
        }
        if (lower.includes('crescent') || lower.includes('waxing')) {
            return { lightClass: 'bg-gradient-to-r from-stone-900 via-stone-800 to-amber-200/90', glowClass: 'shadow-[0_0_30px_rgba(253,186,116,0.18),_inset_-10px_-10px_20px_rgba(0,0,0,0.8)] border border-amber-300/10' };
        }
        if (lower.includes('full')) {
            return { lightClass: 'bg-gradient-to-tr from-amber-200 via-amber-300 to-yellow-100', glowClass: 'shadow-[0_0_40px_rgba(253,186,116,0.35)] border border-amber-300/30' };
        }
        // waning
        return { lightClass: 'bg-gradient-to-l from-stone-900 via-stone-800 to-amber-200/90', glowClass: 'shadow-[0_0_30px_rgba(253,186,116,0.15),_inset_10px_-10px_20px_rgba(0,0,0,0.8)] border border-amber-300/10' };
    };

    const moonStyle = getMoonStyle();

    return (
        <div className="min-h-screen bg-[#F4EFEA] text-[#1C1917] relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 selection:bg-amber-500/20">
            {/* Sparkle Twinkle Stars Background */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute w-1 h-1 bg-[#C27A5D]/40 rounded-full top-12 left-1/4 animate-ping"></div>
                <div className="absolute w-1 h-1 bg-[#C27A5D]/30 rounded-full top-1/3 left-3/4 animate-pulse"></div>
                <div className="absolute w-1 h-1 bg-[#C27A5D]/40 rounded-full top-2/3 left-1/3 animate-pulse"></div>
                <div className="absolute w-1.5 h-1.5 bg-[#C27A5D]/20 rounded-full top-4/5 left-4/5 animate-ping"></div>
            </div>

            <div className="max-w-2xl w-full relative z-10">
                {/* Header Block */}
                <div className="text-center mb-8 animate-fade-rise">
                    <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold font-semibold mb-2 block">
                        CELESTIAL RHYTHM
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal italic tracking-tight text-[#C27A5D] mb-3">
                        Cycle & Moon Magic
                    </h1>
                    <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
                        Sync your period rhythms with lunar orbits using our predictive Vedic ML models.
                    </p>
                </div>

                {/* Primary Glassmorphic Input Panel */}
                <div className="bg-[#FAF6F0] border border-[#1C1917]/5 shadow-[0_10px_40px_rgba(28,25,22,0.03)] backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-6 animate-fade-rise-delay">
                    {/* Glowing Realistic Moon */}
                    <div className="text-center mb-8 flex flex-col items-center justify-center">
                        <div className={`relative w-28 h-28 rounded-full ${moonStyle.lightClass} ${moonStyle.glowClass} transition-all duration-700 overflow-hidden flex items-center justify-center mb-4`}>
                            {/* Moon Texture Details */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-700 to-stone-900 mix-blend-overlay"></div>
                            <div className="absolute w-6 h-6 rounded-full bg-black/10 blur-[1px] top-6 left-6"></div>
                            <div className="absolute w-8 h-8 rounded-full bg-black/15 blur-[2px] bottom-6 right-8"></div>
                        </div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-[#C27A5D] font-bold mb-1">
                            Current Lunar Alignment
                        </h3>
                        <p className="font-serif italic text-xl text-stone-800">{moonPhase || 'Waxing Crescent'}</p>
                    </div>

                    <div className="border-t border-stone-200/50 my-6"></div>

                    {/* Input Coordinates */}
                    <div className="space-y-5 text-left">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2 font-semibold">
                                When did your last menstrual cycle start?
                            </label>
                            <input
                                type="date"
                                value={cycleStartDate}
                                onChange={(e) => setCycleStartDate(e.target.value)}
                                className="w-full bg-white/5 border border-stone-200/50 rounded-2xl py-3 px-4 text-stone-950 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer text-sm font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2 font-semibold">
                                Typical cycle length (days)
                            </label>
                            <select
                                value={cycleLength}
                                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                                className="w-full bg-white/5 border border-stone-200/50 rounded-2xl py-3 px-4 text-stone-950 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer text-sm font-mono"
                            >
                                {Array.from({ length: 15 }, (_, i) => {
                                    const days = i + 21;
                                    return <option key={days} value={days} className="bg-white text-stone-900">{days} days</option>;
                                })}
                            </select>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!cycleStartDate || mlLoading}
                            className="w-full py-4.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-[#FAF6F0] hover:bg-[#C27A5D] border border-transparent disabled:opacity-30 active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer flex justify-center items-center gap-2"
                        >
                            {mlLoading ? (
                                <>
                                    <span className="animate-spin text-lg">🌙</span> Querying Trained ML Model...
                                </>
                            ) : (
                                'Analyze Correlation (Live ML model)'
                            )}
                        </button>
                    </div>
                </div>

                {mlError && (
                    <div className="bg-red-500/10 text-red-300 rounded-2xl p-4 text-xs font-mono mb-4 text-center border border-red-500/35">
                        {mlError}
                    </div>
                )}

                {/* Live ML Insights Output Card */}
                {showInsights && (
                    <div className="bg-[#FAF6F0] border border-[#C27A5D]/20 rounded-3xl p-8 shadow-2xl mb-6 animate-fade-in text-left">
                        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold mb-2 block">
                            ✨ LIVE ML COSMIC INSIGHTS
                        </span>
                        
                        {mlPredictedMood !== null ? (
                            <p className="text-stone-600 text-sm leading-relaxed mb-6 font-serif">
                                Our trained dataset predicts a <strong className="text-stone-950 font-sans">{mlPredictedMood} / 10 Harmony Score</strong> for today. 
                                Based on your cycle, you are entering the <strong className="font-serif italic text-[#C27A5D]">{mlCyclePhase || 'Follicular'} Phase</strong>. 
                                The moon&apos;s current phase ({moonPhase}) registers a <strong className="text-stone-950 font-sans">{mlMoodType} resonance</strong>.
                            </p>
                        ) : (
                            <p className="text-stone-600 text-sm leading-relaxed mb-6 font-serif">
                                Based on your cycle and the current {moonPhase}, this is a time for reflection and inner harmony.
                                The moon&apos;s energy influences emotional rhythms — tune into your body&apos;s natural wisdom.
                            </p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-inner">
                                <p className="text-3xl mb-1">🌙</p>
                                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Moon Phase</p>
                                <p className="text-xs text-[#C27A5D] font-mono mt-1">{moonPhase.split(' ').slice(1).join(' ') || 'Sync'}</p>
                            </div>
                            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-inner">
                                <p className="text-3xl mb-1">🔄</p>
                                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">ML Harmony</p>
                                <p className="text-xs text-[#C27A5D] font-mono mt-1">Score: {mlPredictedMood !== null ? mlPredictedMood.toFixed(1) : '7.0'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleContinue}
                    className="w-full py-4.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-[#FAF6F0] hover:bg-[#C27A5D] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer animate-fade-rise-delay-2"
                >
                    Continue to Music →
                </button>
            </div>
        </div>
    );
};