'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { usePrakritiStore } from '../store/prakritiStore';
import { useCycleStore } from '../store/cycleStore';
import { useUserStore } from '../store/userStore';
import { getRitualsForDosha, getCycleStateFromStore, Ritual } from '../utils/ritualsData';

export default function RitualsPage() {
    const { prakriti, dominantPrakriti } = usePrakritiStore();
    const { cycle } = useCycleStore();
    const { user } = useUserStore();

    const [showPhaseMod, setShowPhaseMod] = useState(true);
    const [hydrated, setHydrated] = useState(false);

    // Ensure hydration matches client side
    useEffect(() => {
        setHydrated(true);
    }, []);

    // Safely extract dominant dosha
    let dominantDosha = 'Pitta';
    if (user?.dominantDosha) {
        dominantDosha = user.dominantDosha;
    } else if (dominantPrakriti) {
        dominantDosha = dominantPrakriti;
    } else if (prakriti) {
        const entries = Object.entries(prakriti);
        const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        dominantDosha = dominant.charAt(0).toUpperCase() + dominant.slice(1);
    }

    // Extract cycle state
    const { phase: cyclePhase } = getCycleStateFromStore(cycle);

    // Get final personalized rituals
    const rituals: Ritual[] = hydrated ? getRitualsForDosha(dominantDosha, cyclePhase, user?.gender !== 'male' && showPhaseMod) : [];

    // Helper for Dosha Color Tags
    const getDoshaStyles = (doshaName: string) => {
        const name = doshaName.toLowerCase();
        if (name === 'vata') {
            return 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20';
        }
        if (name === 'pitta') {
            return 'bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20';
        }
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    };

    if (!hydrated) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin text-4xl">🌿</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#c06080]/10 relative overflow-hidden transition-colors duration-500">
            {/* Sparkle Twinkle Background */}
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute w-1 h-1 bg-[#c06080]/40 rounded-full top-20 left-10 animate-ping"></div>
                <div className="absolute w-1.5 h-1.5 bg-[#c06080]/30 rounded-full top-1/4 left-2/3 animate-pulse"></div>
                <div className="absolute w-1 h-1 bg-[#c06080]/40 rounded-full top-2/3 left-1/5 animate-pulse"></div>
                <div className="absolute w-1.5 h-1.5 bg-[#c06080]/20 rounded-full top-3/4 left-5/6 animate-ping"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-between min-h-screen">
                <div>
                    <Header />

                    <main className="max-w-5xl mx-auto px-6 py-10 md:py-16 w-full space-y-12">
                        {/* Return Navigation */}
                        <div className="flex justify-start animate-fade-rise">
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition duration-300 text-xs font-mono uppercase tracking-widest cursor-pointer"
                            >
                                ← Return to Dashboard
                            </Link>
                        </div>

                        {/* Title Hero Banner */}
                        <div className="text-center space-y-4 animate-fade-rise">
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#c06080] font-semibold block">
                                Personalized Routines
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-[1.08] tracking-tight">
                                Daily <span className="italic text-[#c06080]">Ritual</span> Sanctuary
                            </h1>
                            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
                                Align your daily clock with the seasonal rhythms, planetary phases, and biological blueprints calibrated specifically for your energy.
                            </p>
                        </div>


                        {/* Interactive Phase Toggle Banner */}
                        {user?.gender !== 'male' && (
                            <div className="bg-[#FAF6F0] dark:bg-stone-900/60 border border-[#1C1917]/5 dark:border-stone-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-fade-rise-delay-2">
                                <div className="space-y-1 max-w-lg text-center md:text-left">
                                    <h3 className="text-base font-serif italic text-stone-900 dark:text-stone-100 font-normal">
                                        Menstrual Phase Adaptability
                                    </h3>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                        When enabled, your daily routines adapt to the energetic, nutritional, and physical requirements of your current phase ({cyclePhase}).
                                    </p>
                                </div>

                                {/* Custom Sliding Toggle Switch */}
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                                        {showPhaseMod ? 'Sync Active' : 'Offline'}
                                    </span>
                                    <button
                                        onClick={() => setShowPhaseMod(!showPhaseMod)}
                                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out cursor-pointer ${
                                            showPhaseMod ? 'bg-[#c06080]' : 'bg-stone-300 dark:bg-stone-800'
                                        }`}
                                        aria-label="Toggle phase-specific modifications"
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full bg-white dark:bg-stone-900 shadow-md transform transition-transform duration-500 ease-in-out ${
                                                showPhaseMod ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sequential Ritual List */}
                        <div className="space-y-6 animate-fade-rise-delay-2">
                            <AnimatePresence mode="popLayout">
                                {rituals.map((ritual, idx) => {
                                    const hasMod = showPhaseMod && cycle && ritual.phase;
                                    return (
                                        <motion.div
                                            key={ritual.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        >
                                            <Card 
                                                className={`w-full border transition-all duration-300 ${
                                                    hasMod 
                                                        ? 'border-amber-500/20 shadow-[0_4px_25px_-5px_rgba(245,158,11,0.04)] bg-amber-500/[0.01]' 
                                                        : 'border-stone-300/40'
                                                }`}
                                            >
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                    {/* Left/Top Content */}
                                                    <div className="space-y-4 flex-1">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            {/* Time Badge */}
                                                            <span className="px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#c06080]/10 text-[#c06080] rounded-full">
                                                                {ritual.time}
                                                            </span>

                                                            {/* Duration */}
                                                            <span className="px-3 py-1 text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                                                                ✦ {ritual.duration} Mins
                                                            </span>

                                                            {/* Sync Badge */}
                                                            {hasMod && (
                                                                <span className="px-3 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-full animate-pulse">
                                                                    {cyclePhase} Modified
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Activity Title */}
                                                        <h3 className="text-xl sm:text-2xl font-serif italic text-stone-900 dark:text-stone-100 font-normal">
                                                            {ritual.activity}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                                                            {ritual.description}
                                                        </p>

                                                        {/* Dosha Badges */}
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            {ritual.dosha.map(d => (
                                                                <span 
                                                                    key={d} 
                                                                    className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md ${getDoshaStyles(d)}`}
                                                                >
                                                                    {d}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Right/Action Content */}
                                                    {ritual.link && (
                                                        <div className="flex-shrink-0 flex items-center self-start md:self-center">
                                                            {ritual.linkType === 'spotify' ? (
                                                                <a
                                                                    href={ritual.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-5 py-3 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 transition-all duration-300 inline-flex items-center gap-2 active:scale-95"
                                                                >
                                                                    🟢 {ritual.linkText || 'Listen on Spotify'}
                                                                </a>
                                                            ) : ritual.linkType === 'youtube' ? (
                                                                <a
                                                                    href={ritual.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-5 py-3 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-600 dark:text-red-400 transition-all duration-300 inline-flex items-center gap-2 active:scale-95"
                                                                >
                                                                    🔴 {ritual.linkText || 'Watch on YouTube'}
                                                                </a>
                                                            ) : (
                                                                <a
                                                                    href={ritual.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-5 py-3 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-[#c06080]/10 hover:bg-[#c06080]/20 border border-[#c06080]/25 text-[#c06080] transition-all duration-300 inline-flex items-center gap-2 active:scale-95"
                                                                >
                                                                    ✨ {ritual.linkText || 'Guided Activity'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </main>
                </div>

                {/* Footer block */}
                <footer className="w-full max-w-5xl mx-auto px-6 pb-6 pt-10 border-t border-[#1C1917]/5 dark:border-stone-800 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-500 tracking-wider">
                    <div>DOMINANT DOSHA / {dominantDosha.toUpperCase()}</div>
                    <div>© OJAS RITUAL MMXXVI</div>
                </footer>
            </div>
        </div>
    );
}
