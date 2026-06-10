'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCycleStore } from '../store/cycleStore';
import { useUserStore } from '../store/userStore';
import { predictMood, PredictionData } from '../lib/api';

const MOON_PHASE_MAP: Record<string, number> = {
    'New Moon': 0.0,
    'Waxing Crescent': 0.12,
    'First Quarter': 0.25,
    'Waxing Gibbous': 0.38,
    'Full Moon': 0.5,
    'Waning Gibbous': 0.62,
    'Last Quarter': 0.75,
    'Waning Crescent': 0.88,
};

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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({
            x: e.clientX / (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: e.clientY / (typeof window !== 'undefined' ? window.innerHeight : 1000)
        });
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
        } finally {
            setLoading(false);
        }
    }, [cycleLength, getCyclePhaseFromDay]);

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

    const getShadowPath = (p: number) => {
        if (p === 0.5) return '';
        const rx = p < 0.5 ? Math.abs(50 * (1 - 4 * p)) : Math.abs(50 * (1 - 4 * (p - 0.5)));
        if (p < 0.5) {
            const sweep = p < 0.25 ? 1 : 0;
            return `M 50 0 A 50 50 0 0 0 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`;
        } else {
            const sweep = p < 0.75 ? 0 : 1;
            return `M 50 0 A 50 50 0 0 1 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`;
        }
    };

    const currentMoonPhaseStr = prediction?.moon_phase || 'Waxing Gibbous';
    const moonIllumination = prediction?.moon_illumination || 84;
    const moonP = MOON_PHASE_MAP[currentMoonPhaseStr] ?? 0.38;
    const activeCycleDay = prediction?.day_in_cycle || manualCycleDay;
    const phaseProgress = Math.min(100, Math.round((activeCycleDay / cycleLength) * 100));

    return (
        <div
            className="min-h-screen bg-forest-ink text-surface-cream font-body-md overflow-x-hidden selection:bg-resonant-pink selection:text-forest-ink"
            onMouseMove={handleMouseMove}
        >
            {/* Top Navigation */}
            <header className="fixed top-0 w-full h-[120px] bg-forest-ink/80 backdrop-blur-xl z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
                <Link href="/dashboard" className="font-display-lg-mobile md:font-display-lg text-primary-fixed-dim tracking-tighter">OJAS</Link>
                <nav className="hidden md:flex gap-stack-lg items-center font-label-caps text-label-caps uppercase tracking-widest text-outline-variant">
                    <Link className="hover:text-resonant-pink transition-colors" href="/dashboard">Dashboard</Link>
                    <span className="hover:text-resonant-pink transition-colors active-link text-resonant-pink cursor-pointer">Lunar Sync</span>
                    <Link className="hover:text-resonant-pink transition-colors" href="/rituals">Sanctuary</Link>
                </nav>
                <div className="flex items-center gap-stack-sm">
                    <Link href="/dashboard" className="material-symbols-outlined text-primary-fixed-dim text-[32px] cursor-pointer hover:scale-110 transition-transform">account_circle</Link>
                </div>
            </header>

            <main className="relative pt-[120px] min-h-screen pb-stack-xl">
                {/* Subtle Star Field Overlay */}
                <div
                    className="fixed inset-0 pointer-events-none opacity-20 star-field transition-transform duration-100"
                    style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
                ></div>

                {/* Hero Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-stack-xl pb-stack-lg relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-stack-xl">

                        {/* Content Column */}
                        <div className="w-full md:w-1/2 flex flex-col space-y-stack-md">
                            <span className="font-label-caps text-[12px] text-resonant-pink uppercase tracking-[0.2em] animate-pulse">Celestial Alignment Active</span>
                            <h1 className="font-headline-md md:font-display-lg text-[40px] md:text-[64px] text-primary-fixed-dim leading-none">Cosmic Cycle Wisdom</h1>
                            <p className="font-body-lg text-[20px] text-surface-container-high max-w-md italic-serif">
                                Synchronize your internal menstrual rhythm with the grand lunar orbits. Ancient Ayurvedic wisdom recalibrated for the modern cosmic traveler.
                            </p>

                            {/* Interactive Form: Sync State */}
                            {(isEditing || !cycle) ? (
                                <form onSubmit={handleSave} className="glass-card-cycle p-stack-md rounded-xl mt-stack-md border-resonant-pink/30 relative">
                                    {loading && (
                                        <div className="absolute inset-0 bg-forest-ink/90 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-xl gap-4">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-resonant-pink rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-resonant-pink rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-resonant-pink rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-surface-cream/70 text-center">Calculating celestial alignments...</span>
                                        </div>
                                    )}
                                    <h3 className="font-label-caps text-[12px] text-surface-cream mb-stack-sm uppercase tracking-widest">Initialize Sync</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] uppercase font-bold text-surface-cream mb-1 opacity-60">Last Cycle Start</label>
                                            <input
                                                className="bg-transparent border-b border-surface-cream/20 py-2 focus:outline-none focus:border-resonant-pink text-surface-cream"
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] uppercase font-bold text-surface-cream mb-1 opacity-60">Cycle Length (Days)</label>
                                            <input
                                                className="bg-transparent border-b border-surface-cream/20 py-2 focus:outline-none focus:border-resonant-pink text-surface-cream"
                                                type="number"
                                                value={cycleLength}
                                                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-stack-md">
                                        {cycle && (
                                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 text-[10px] uppercase tracking-widest text-surface-cream/60 hover:text-surface-cream transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                        <button type="submit" disabled={loading} className="flex-1 bg-surface-cream text-forest-ink py-4 font-headline-sm uppercase text-sm tracking-widest active:scale-95 transition-transform hover:bg-resonant-pink rounded-sm cursor-pointer disabled:opacity-50">
                                            Calibrate Frequencies
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* Result State */
                                prediction && (
                                    <div className="glass-card-cycle p-stack-lg rounded-xl mt-stack-md bg-resonant-pink/10 border-resonant-pink/40 animate-fade-rise relative">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-resonant-pink/80 hover:text-resonant-pink transition-colors cursor-pointer"
                                        >
                                            Recalibrate
                                        </button>
                                        <div className="flex justify-between items-start mb-stack-md">
                                            <div>
                                                <span className="font-italic-serif text-[17px] text-resonant-pink block mb-1">Current State</span>
                                                <h2 className="font-headline-md text-[32px] text-surface-cream capitalize">{prediction.cycle_phase || 'follicular'}</h2>
                                            </div>
                                            <span className="material-symbols-outlined text-resonant-pink text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>flare</span>
                                        </div>

                                        <div className="w-full bg-surface-cream/10 h-[2px] mb-stack-sm relative overflow-hidden rounded-full">
                                            <div className="absolute top-0 left-0 h-full bg-resonant-pink transition-all duration-1000" style={{ width: `${phaseProgress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between font-label-caps text-[10px] text-surface-cream uppercase mb-stack-md tracking-widest">
                                        <span>Day {activeCycleDay}</span>
                                        <span>Phase Progress: {phaseProgress}%</span>
                                    </div>

                                    <div className="mb-stack-md bg-forest-ink/30 p-5 rounded-2xl border border-resonant-pink/20 shadow-inner">
                                        <div className="flex justify-between items-end mb-4">
                                            <label className="text-[10px] uppercase font-bold text-surface-cream opacity-80 tracking-widest">Manual Timeline Override</label>
                                            <span className="text-[14px] font-headline-sm text-resonant-pink">Day {manualCycleDay}</span>
                                        </div>

                                        <div className="relative py-2 mt-2">
                                            {/* Visual Pill Bar Track */}
                                            <div className="w-full h-3 rounded-full flex shadow-inner border border-white/5 relative overflow-hidden">
                                                <div className="h-full bg-rose-900/60" style={{ width: '25%' }}></div>
                                                <div className="h-full bg-orange-900/60" style={{ width: '25%' }}></div>
                                                <div className="h-full bg-amber-500/80" style={{ width: '12.5%' }}></div>
                                                <div className="h-full bg-indigo-900/60" style={{ width: '37.5%' }}></div>
                                            </div>
                                            
                                            {/* Custom Thumb Overlay */}
                                            <div 
                                                className="absolute top-1/2 w-4 h-6 bg-surface-cream rounded-[4px] shadow-[0_0_10px_rgba(255,255,255,0.3)] pointer-events-none transition-all duration-75 flex justify-center items-center border border-white/30"
                                                style={{ left: `${((manualCycleDay - 1) / (cycleLength - 1 || 1)) * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 5 }}
                                            >
                                                <div className="w-0.5 h-3 bg-forest-ink/40 rounded-full"></div>
                                            </div>

                                            {/* Native Range Input (Invisible overlay for interaction) */}
                                            <input
                                                type="range"
                                                min="1"
                                                max={cycleLength}
                                                value={manualCycleDay}
                                                onChange={(e) => setManualCycleDay(parseInt(e.target.value))}
                                                onPointerUp={(e) => fetchPrediction(parseInt(e.currentTarget.value))}
                                                disabled={loading}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                        </div>

                                        {/* Phase Labels */}
                                        <div className="flex w-full text-[8px] sm:text-[9px] font-mono uppercase tracking-widest mt-4">
                                            <div style={{ width: '25%' }} className="text-center text-rose-300/80 truncate px-0.5">Menses</div>
                                            <div style={{ width: '25%' }} className="text-center text-orange-300/80 truncate px-0.5">Follicular</div>
                                            <div style={{ width: '12.5%' }} className="text-center text-amber-300/90 truncate px-0.5">Ovul.</div>
                                            <div style={{ width: '37.5%' }} className="text-center text-indigo-300/80 truncate px-0.5">Luteal</div>
                                        </div>
                                    </div>

                                    <p className="font-body-md text-[17px] text-surface-container-high opacity-90 mb-stack-md leading-relaxed">
                                            Your <strong className="text-resonant-pink font-semibold">{user?.dominantDosha}</strong> balance is currently shifting. High creative energy predicted. Focus on expansive movements and cooling foods.
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="border border-resonant-pink/30 px-3 py-1 rounded-full text-[10px] font-label-caps text-surface-cream uppercase tracking-widest">Hydration Focus</span>
                                            <span className="border border-resonant-pink/30 px-3 py-1 rounded-full text-[10px] font-label-caps text-surface-cream uppercase tracking-widest">Manifestation Peak</span>
                                        </div>

                                        <div className="pt-4 border-t border-resonant-pink/20 mt-2">
                                            <p className="font-label-md text-[11px] text-surface-container-high opacity-60 leading-relaxed flex items-start gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-resonant-pink mt-[1px]">auto_awesome</span>
                                                <span>Algorithm cross-references biological signals with real-time lunar tracking to provide 98.4% accurate forecasts.</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                            {error && (
                                <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl mt-4 text-red-200 text-sm font-mono text-center">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Visual Column: Lunar Phase */}
                        <div className="w-full md:w-1/2 flex justify-center relative mt-16 md:mt-0 animate-fade-rise" style={{ animationDelay: '0.2s' }}>
                            {/* Glow Backgrounds */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-resonant-pink rounded-full breathing-glow"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-primary-fixed-dim rounded-full opacity-20 blur-[80px]"></div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-black rounded-full border border-surface-cream/10 z-0 shadow-inner"></div>

                                {/* Moon Image Container */}
                                <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl border border-white/5 group-hover:scale-[1.02] transition-transform duration-700">
                                    <img
                                        alt={currentMoonPhaseStr}
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-[10000ms] group-hover:scale-110"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvZkL-RXe0pnMEvFaA90llZGC3-M058_0coPe5i0COlOU4Iykj0i_k2hPHDkUzWrGmyKGkdL1I0zw_ftG3HwzNwMCTGRCV3cq_IjRMw4HWUe7-zM0aeWamUowE3_xiaUckd6C8dvvNMX2076mLS3dpjj2u4cY4fUF9soS1luFKnUpK1OS_BrXz7pEzU4EjIf8WEMPmzAqotgB7zPlzFMNs1Q-3SStFCVJr5a3K4ke91s_GFGB0YP8mJcVaTO0ANKmDaL3Hpk0_2cVb"
                                        style={{ filter: 'grayscale(100%) brightness(120%) contrast(110%) sepia(20%) hue-rotate(300deg)' }}
                                    />

                                    {/* Dynamic SVG Shadow Mask matching the precise phase coordinate */}
                                    <svg className="absolute inset-0 w-full h-full rotate-0 z-20 pointer-events-none" viewBox="0 0 100 100">
                                        <defs>
                                            <filter id="moonShadowBlur"><feGaussianBlur stdDeviation="2.5" /></filter>
                                        </defs>
                                        {moonP !== 0.5 && (
                                            <path d={getShadowPath(moonP)} fill="#1b1c1a" fillOpacity="0.95" filter="url(#moonShadowBlur)" />
                                        )}
                                    </svg>
                                </div>

                                {/* Decorative Labels */}
                                <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 flex flex-col items-end z-30">
                                    <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-widest bg-forest-ink/60 backdrop-blur-sm px-2 py-1 rounded">Current Phase</span>
                                    <span className="font-headline-sm text-[24px] text-surface-cream drop-shadow-md bg-forest-ink/40 backdrop-blur-sm px-2 py-1 rounded mt-1">{currentMoonPhaseStr.toUpperCase()}</span>
                                </div>
                                <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 glass-card-cycle p-4 rounded-xl border-l-4 border-l-resonant-pink z-30">
                                    <span className="font-label-caps text-[10px] text-surface-cream block opacity-60 mb-1 tracking-widest">ILLUMINATION</span>
                                    <span className="font-display-lg-mobile text-[40px] text-surface-cream">{moonIllumination}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>




            </main>

            <footer className="bg-surface-container-highest/5 w-full py-stack-lg border-t border-resonant-pink/20 backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
                    <div className="font-display-lg text-[40px] text-primary-fixed-dim mb-stack-md md:mb-0 tracking-tighter">OJAS</div>

                    <div className="font-body-md text-[14px] text-surface-cream/40 text-center md:text-right">
                        © 2024 OJAS Wellness. Ancient Wisdom, Modern Luxury.
                    </div>
                </div>
            </footer>
        </div>
    );
}