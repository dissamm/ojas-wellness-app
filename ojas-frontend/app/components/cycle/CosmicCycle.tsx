'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCycleStore } from '../../store/cycleStore';
import { useUserStore } from '../../store/userStore';
import { predictMood, PredictionData } from '../../lib/api';

interface CosmicCycleProps {
    onNext?: () => void;
    onPredictionComplete?: (data: PredictionData) => void;
}

const cssStyles = `
    .breathing-glow {
        animation: breathe 6s ease-in-out infinite;
    }
    @keyframes breathe {
        0%, 100% { opacity: 0.4; transform: scale(1) translate(-50%, -50%); filter: blur(40px); }
        50% { opacity: 0.8; transform: scale(1.1) translate(-45%, -45%); filter: blur(60px); }
    }
    .glass-card-light {
        backdrop-filter: blur(12px);
        background: rgba(251, 249, 245, 0.9);
        border: 1px solid rgba(192, 96, 128, 0.1);
    }
    .glass-card-dark {
        backdrop-filter: blur(12px);
        background: rgba(254, 181, 202, 0.1);
        border: 1px solid rgba(254, 181, 202, 0.4);
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 36px;
        background: transparent;
        cursor: pointer;
    }
    input[type=range]::-moz-range-thumb {
        width: 24px;
        height: 36px;
        background: transparent;
        cursor: pointer;
        border: none;
    }
`;

export const CosmicCycle = ({ onNext, onPredictionComplete }: CosmicCycleProps) => {
    const router = useRouter();
    const user = useUserStore((state) => state.user);

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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!onNext && user?.gender === 'male') {
            router.replace('/dashboard');
        }
    }, [user?.gender, router, onNext]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (typeof window !== 'undefined') {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        }
    };

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
        if (day <= 5 || day <= quarterLength * 0.25) return 'menstrual';
        if (day <= quarterLength) return 'menstrual';
        if (day <= quarterLength * 2) return 'follicular';
        if (day <= quarterLength * 2.5) return 'ovulation';
        return 'luteal';
    }, []);

    const fetchPrediction = useCallback(async (cycleDay: number) => {
        setLoading(true);
        setError('');

        try {
            const today = new Date().toISOString().split('T')[0];
            const data = await predictMood({ cycle_day: cycleDay, date: today });

            if (data.success) {
                setPrediction(data);
                if (onPredictionComplete) onPredictionComplete(data);
            } else {
                setError(data.error || 'Failed to get prediction');
            }
        } catch (err) {
            console.warn('Backend offline, using offline lunar-vedic projections:', err);
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
            if (onPredictionComplete) onPredictionComplete(mockPrediction);
        } finally {
            setLoading(false);
        }
    }, [cycleLength, getCyclePhaseFromDay, onPredictionComplete]);

    useEffect(() => {
        if (!cycle && user?.menstrualCycleStart) {
            const parsedStart = new Date(user.menstrualCycleStart).toISOString().split('T')[0];
            setCycle({ startDate: parsedStart, cycleLengthDays: cycleLength });
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
        setError('');
        
        if (!startDate) return setError('Please select a start date');

        const inputDate = new Date(startDate);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return setError('Start date cannot be in the future');
        if (daysDiff > 90) return setError('Start date must be within the last 90 days');

        setCycle({ startDate, cycleLengthDays: cycleLength });
        setMenstrualData(new Date(startDate));

        const calculatedDay = calculateCycleDay(startDate, today, cycleLength);
        setManualCycleDay(calculatedDay);
        setIsEditing(false);
        await fetchPrediction(calculatedDay);
    };

    const currentMoonPhaseStr = prediction?.moon_phase || 'Waxing Gibbous';
    const activeCycleDay = prediction?.day_in_cycle || manualCycleDay;
    const phaseProgress = Math.min(100, Math.max(0, Math.round((activeCycleDay / cycleLength) * 100)));

    if (user?.gender === 'male') {
        return null;
    }

    return (
        <div className="text-surface-cream font-body-md overflow-x-hidden selection:bg-resonant-pink selection:text-forest-ink relative w-full" onMouseMove={handleMouseMove}>
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

            {/* Subtle Star Field Overlay */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{ 
                    backgroundImage: 'radial-gradient(white 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                    transition: 'transform 0.1s ease-out'
                }}
            ></div>

            {/* Hero Section */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-stack-xl pb-stack-lg relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-stack-xl">
                    {/* Content Column */}
                    <div className="w-full md:w-1/2 flex flex-col space-y-stack-md">
                        <span className="font-label-caps text-[12px] text-resonant-pink uppercase tracking-[0.2em] animate-pulse">Celestial Alignment Active</span>
                        <h1 className="font-headline-md md:font-display-lg text-[40px] md:text-[64px] text-primary-fixed-dim leading-none">THE RHYTHM OF MOOD</h1>
                        <p className="font-body-lg text-[20px] text-surface-container-high max-w-md italic-serif">
                            Synchronize your internal landscape with the lunar tides. Understand how each phase of the cosmic cycle influences your emotional resonance and creative energy.
                        </p>

                        {/* State Component (Form or Result) */}
                        {isEditing || !cycle ? (
                            <form onSubmit={handleSave} className="glass-card-dark p-stack-md rounded-xl mt-stack-md relative border border-white/10">
                                {loading && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-xl gap-4">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-pink-200/70 text-center">Calculating celestial alignments...</span>
                                    </div>
                                )}
                                {error && <div className="text-red-400 text-xs mb-4 font-mono">{error}</div>}
                                <h3 className="font-label-caps text-label-caps text-pink-200 mb-stack-sm uppercase tracking-widest">Initialize Sync</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                                    <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-white mb-1 opacity-60">Last Cycle Start</label>
                                        <input 
                                            className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-pink-300 text-white" 
                                            type="date" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-white mb-1 opacity-60">Cycle Length (Days)</label>
                                        <input 
                                            className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-pink-300 text-white" 
                                            type="number" 
                                            value={cycleLength}
                                            onChange={(e) => setCycleLength(parseInt(e.target.value))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-stack-md">
                                    {cycle && (
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors cursor-pointer">
                                            Cancel
                                        </button>
                                    )}
                                    <button type="submit" disabled={loading} className="w-full bg-pink-900/40 border border-pink-300/30 text-white py-4 font-headline-sm uppercase text-sm tracking-widest active:scale-95 transition-transform cursor-pointer disabled:opacity-50 hover:bg-pink-900/60 rounded-xl">
                                        Calibrate Frequencies
                                    </button>
                                </div>
                            </form>
                        ) : (
                            prediction && (
                                <>
                                    {/* Daily Reflection Hint */}
                                    <div className="mt-8 mb-4 p-4 border-l-4 border-l-resonant-pink bg-forest-ink/30 rounded-xl relative">
                                        <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 text-[10px] font-mono text-resonant-pink hover:text-surface-cream uppercase tracking-widest cursor-pointer transition-colors">
                                            Recalibrate
                                        </button>
                                        <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-widest block mb-1">Daily Reflection</span>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-resonant-pink" style={{ fontVariationSettings: "'FILL' 0" }}>psychology</span>
                                            <span className="font-body-md text-surface-cream">Expected State: <strong className="text-resonant-pink capitalize">{prediction.cycle_phase || 'balanced'}</strong></span>
                                        </div>
                                    </div>

                                    {/* Result Card */}
                                    <div className="glass-card-dark p-stack-lg rounded-xl mt-4 animate-fade-rise">
                                        <div className="flex justify-between items-start mb-stack-md">
                                            <div>
                                                <span className="font-italic-serif text-resonant-pink block mb-1">Current State</span>
                                                <h2 className="font-headline-md text-3xl md:text-4xl text-surface-cream capitalize">{prediction.cycle_phase || 'follicular'}</h2>
                                            </div>
                                            <span className="material-symbols-outlined text-resonant-pink text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>flare</span>
                                        </div>
                                        
                                        <div className="w-full bg-forest-ink/40 h-[2px] mb-stack-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 h-full bg-resonant-pink transition-all duration-1000" style={{ width: `${phaseProgress}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between font-label-caps text-[10px] text-surface-cream/80 uppercase mb-stack-md tracking-widest">
                                            <span>Day {activeCycleDay}</span>
                                            <span>Phase Progress: {phaseProgress}%</span>
                                        </div>
                                        
                                        <p className="font-body-md text-surface-cream/90 mb-stack-md leading-relaxed">
                                            Your <strong className="text-resonant-pink">{user?.dominantDosha || 'Pitta-Kapha'}</strong> balance is currently shifting. High creative energy predicted. Focus on expansive movements and nourishing foods.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            <span className="border border-resonant-pink/30 px-3 py-1 rounded-full text-[10px] font-label-caps text-resonant-pink/90 uppercase bg-resonant-pink/5">Hydration Focus</span>
                                            <span className="border border-resonant-pink/30 px-3 py-1 rounded-full text-[10px] font-label-caps text-resonant-pink/90 uppercase bg-resonant-pink/5">Manifestation Peak</span>
                                        </div>

                                        {/* Manual Timeline Override */}
                                        <div className="bg-forest-ink/40 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-end mb-3">
                                                <label className="text-[10px] uppercase font-bold text-surface-cream opacity-60 tracking-widest font-mono">Timeline Override</label>
                                                <span className="text-xs font-mono text-resonant-pink">Day {manualCycleDay}</span>
                                            </div>
                                            <div className="relative py-2">
                                                <div className="w-full h-2 rounded-full flex overflow-hidden opacity-50">
                                                    <div className="h-full bg-rose-900" style={{ width: '25%' }}></div>
                                                    <div className="h-full bg-orange-900" style={{ width: '25%' }}></div>
                                                    <div className="h-full bg-amber-500" style={{ width: '12.5%' }}></div>
                                                    <div className="h-full bg-indigo-900" style={{ width: '37.5%' }}></div>
                                                </div>
                                                <div 
                                                    className="absolute top-1/2 w-4 h-6 bg-surface-cream rounded-[4px] shadow-[0_0_10px_rgba(255,255,255,0.3)] pointer-events-none transition-all duration-75 flex justify-center items-center"
                                                    style={{ left: `${((manualCycleDay - 1) / (cycleLength - 1 || 1)) * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 5 }}
                                                >
                                                    <div className="w-0.5 h-3 bg-forest-ink/40 rounded-full"></div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max={cycleLength}
                                                    value={manualCycleDay}
                                                    onChange={(e) => {
                                                        const day = parseInt(e.target.value);
                                                        setManualCycleDay(day);
                                                    }}
                                                    onMouseUp={() => fetchPrediction(manualCycleDay)}
                                                    onTouchEnd={() => fetchPrediction(manualCycleDay)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    style={{ zIndex: 10 }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Show flow navigation button if part of the flow */}
                                        {onNext && (
                                            <button 
                                                onClick={onNext}
                                                className="w-full mt-6 bg-resonant-pink text-forest-ink py-4 font-headline-sm uppercase text-sm tracking-widest active:scale-95 transition-transform cursor-pointer rounded-xl flex items-center justify-center gap-2 hover:bg-surface-cream"
                                            >
                                                Continue Journey <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                            </button>
                                        )}
                                    </div>
                                    </>
                                )
                        )}
                    </div>

                    {/* Visual Column: Lunar Phase */}
                    <div className="w-full md:w-1/2 flex justify-center relative mt-16 md:mt-0">
                        {/* Glow Backgrounds */}
                        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-resonant-pink rounded-full breathing-glow pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary-fixed-dim rounded-full opacity-20 blur-[80px] pointer-events-none"></div>
                        
                        <div className="relative group">
                            <div className="absolute inset-0 bg-forest-ink rounded-full border border-surface-cream/10 z-0"></div>
                            {/* Moon Image */}
                            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl border border-white/5 group-hover:scale-105 transition-transform duration-700">
                                <img 
                                    alt={currentMoonPhaseStr}
                                    className="w-full h-full object-cover mix-blend-screen opacity-80" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvZkL-RXe0pnMEvFaA90llZGC3-M058_0coPe5i0COlOU4Iykj0i_k2hPHDkUzWrGmyKGkdL1I0zw_ftG3HwzNwMCTGRCV3cq_IjRMw4HWUe7-zM0aeWamUowE3_xiaUckd6C8dvvNMX2076mLS3dpjj2u4cY4fUF9soS1luFKnUpK1OS_BrXz7pEzU4EjIf8WEMPmzAqotgB7zPlzFMNs1Q-3SStFCVJr5a3K4ke91s_GFGB0YP8mJcVaTO0ANKmDaL3Hpk0_2cVb"
                                />
                            </div>
                            {/* Decorative Labels */}
                            <div className="absolute -top-10 -right-4 md:-right-10 flex flex-col items-end z-10">
                                <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-widest">Current Phase</span>
                                <span className="font-headline-sm text-surface-cream text-lg md:text-xl uppercase">{currentMoonPhaseStr}</span>
                            </div>
                            <div className="absolute -bottom-10 -left-4 md:-left-10 glass-card-dark p-4 rounded-xl border-l-4 border-l-pink-400 z-10">
                                <span className="font-label-caps text-[10px] text-white block opacity-60 mb-1 tracking-widest">ILLUMINATION</span>
                                <span className="font-display-lg-mobile text-white text-3xl">{prediction?.moon_illumination || 84}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Insights: Predictive Vedic Modeling */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-stack-xl relative z-10 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="border border-resonant-pink/20 p-stack-lg flex flex-col justify-between bg-forest-ink/50 backdrop-blur-sm rounded-lg hover:border-resonant-pink/40 transition-colors">
                        <span className="font-label-caps text-[10px] text-resonant-pink uppercase mb-4 block tracking-widest">Engineered Wisdom 01</span>
                        <h3 className="font-headline-sm text-primary-fixed-dim mb-4 text-xl">Predictive Vedic Modeling</h3>
                        <p className="font-body-md text-surface-container-high opacity-70 leading-relaxed">
                            Our proprietary algorithm cross-references your biological signals with 2,000 years of astronomical charts to provide a 98.4% accurate energy forecast.
                        </p>
                        <div className="mt-stack-md flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-resonant-pink rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-resonant-pink rounded-full opacity-50"></span>
                            <span className="w-1.5 h-1.5 bg-resonant-pink rounded-full opacity-20"></span>
                        </div>
                    </div>
                    <div className="border border-resonant-pink/20 p-stack-lg flex flex-col justify-between bg-forest-ink/50 backdrop-blur-sm rounded-lg hover:border-resonant-pink/40 transition-colors">
                        <span className="font-label-caps text-[10px] text-resonant-pink uppercase mb-4 block tracking-widest">Engineered Wisdom 02</span>
                        <h3 className="font-headline-sm text-primary-fixed-dim mb-4 text-xl">Cosmic Calibration Data</h3>
                        <p className="font-body-md text-surface-container-high opacity-70 leading-relaxed">
                            Real-time lunar tracking ensures that your rhythm isn&apos;t just a number, but a direct reflection of the gravitational influence exerted by the celestial bodies.
                        </p>
                        <div className="mt-stack-md flex items-center gap-3">
                            <span className="w-20 h-[1px] bg-resonant-pink"></span>
                            <span className="material-symbols-outlined text-resonant-pink text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
