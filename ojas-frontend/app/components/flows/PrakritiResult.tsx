'use client';

import React from 'react';
import { useUserStore } from '../../store/userStore';

const DOSHA_DETAILS = {
    Vata: {
        symbol: '💨',
        elements: 'Ether & Air',
        description: 'Vata embodies flow, movement, and creative energy. You are likely imaginative, adaptable, and a quick thinker. When balanced, you are highly creative, enthusiastic, and vibrant.',
        color: '#8B5CF6',
        accentBg: 'bg-purple-500/10 border-purple-300/30 text-purple-700',
    },
    Pitta: {
        symbol: '🔥',
        elements: 'Fire & Water',
        description: 'Pitta embodies focus, courage, and transformation. You are likely highly analytical, driven, and determined. When balanced, you possess clear focus, great metabolic power, and warm leadership.',
        color: '#C27A5D',
        accentBg: 'bg-[#FAF6F0] border-[#C27A5D]/30 text-[#C27A5D]',
    },
    Kapha: {
        symbol: '🌍',
        elements: 'Water & Earth',
        description: 'Kapha embodies stability, structure, and grounding. You are likely calm, compassionate, strong-willed, and highly loyal. When balanced, you offer great emotional stamina, calm endurance, and nurturing warmth.',
        color: '#10B981',
        accentBg: 'bg-emerald-500/10 border-emerald-300/30 text-emerald-800',
    },
};

export const PrakritiResult = () => {
    const { user, setCurrentStep, resetAssessment, setDoshaComposition } = useUserStore();
    const dominant = (user.dominantDosha || 'Pitta') as keyof typeof DOSHA_DETAILS;
    const composition = user.doshaComposition || { vata: 33, pitta: 33, kapha: 34 };
    const details = DOSHA_DETAILS[dominant] || DOSHA_DETAILS.Pitta;

    const handleRetakeClick = () => {
        const confirmRetake = window.confirm("Are you sure? This will replace your current Prakriti results.");
        if (!confirmRetake) return;

        localStorage.removeItem('prakriti');
        localStorage.removeItem('dominantPrakriti');
        localStorage.removeItem('prakriti_quiz_progress');
        localStorage.removeItem('prakriti_quiz_answers');

        setDoshaComposition({ vata: 0, pitta: 0, kapha: 0 }, '');
        resetAssessment();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-8 sm:py-12 bg-[#F4EFEA] text-[#1C1917] selection:bg-[#C27A5D]/10 relative">
            <div className="max-w-2xl w-full">
                
                {/* 1. Top Sticky Control Panel: Instantly perform retake or continue actions */}
                <div className="sticky top-4 z-30 mb-8 w-full bg-white/75 backdrop-blur-md rounded-2xl border border-stone-200/50 p-4 shadow-md flex items-center justify-between gap-4 animate-fade-rise">
                    <button
                        onClick={handleRetakeClick}
                        className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-[#C27A5D]/30 text-[#C27A5D] hover:bg-[#FAF6F0]/45 active:scale-[0.98] transition duration-300 cursor-pointer"
                    >
                        ↺ Retake Analysis
                    </button>

                    <button
                        onClick={() => setCurrentStep(user?.gender === 'male' ? 'music' : 'menstrual-moon')}
                        className="px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#C27A5D] hover:bg-[#b0674a] text-white active:scale-[0.98] transition duration-300 shadow-sm cursor-pointer"
                    >
                        Continue to Sanctuary →
                    </button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-8 animate-fade-rise-delay">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold mb-2 block">
                        YOUR CONSTITUTION
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#1C1917] leading-tight">
                        Your <span className="italic text-[#C27A5D]">Prakriti</span> Profile
                    </h1>
                    <p className="text-stone-500 text-sm mt-3 max-w-md mx-auto">
                        Your permanent energetic blueprint based on your natural physical and emotional patterns.
                    </p>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/50 mb-8 animate-fade-rise-delay-2 space-y-8">
                    {/* Dominant Dosha Highlight */}
                    <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-stone-200/50">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner ${details.accentBg} border animate-float flex-shrink-0`}>
                            {details.symbol}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                                DOMINANT CONSTITUTION
                            </span>
                            <h2 className="text-3xl font-serif italic text-stone-900 font-semibold mt-1">
                                {dominant} <span className="text-sm font-sans font-normal not-italic text-stone-500">({details.elements})</span>
                            </h2>
                            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                                {details.description}
                            </p>
                        </div>
                    </div>

                    {/* Composition Chart */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
                            🌿 DOSHA COMPOSITION
                        </h3>
                        
                        {/* Vata Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-purple-700 font-semibold">Vata (Air & Ether)</span>
                                <span>{composition.vata}%</span>
                            </div>
                            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/30">
                                <div 
                                    className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                                    style={{ width: `${composition.vata}%` }}
                                />
                            </div>
                        </div>

                        {/* Pitta Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-[#C27A5D] font-semibold">Pitta (Fire & Water)</span>
                                <span>{composition.pitta}%</span>
                            </div>
                            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/30">
                                <div 
                                    className="h-full bg-[#C27A5D] rounded-full transition-all duration-1000" 
                                    style={{ width: `${composition.pitta}%` }}
                                />
                            </div>
                        </div>

                        {/* Kapha Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-emerald-700 font-semibold">Kapha (Earth & Water)</span>
                                <span>{composition.kapha}%</span>
                            </div>
                            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/30">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                    style={{ width: `${composition.kapha}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Educational Note */}
                    <div className="p-5 bg-[#F4EFEA] rounded-2xl border border-stone-200/50 text-center">
                        <p className="text-xs text-stone-600 leading-relaxed italic">
                            {user?.gender === 'male'
                                ? "You are a unique combination of all three. While your Prakriti defines your core nature, your emotional rhythms drift daily. Let's find the healing frequencies aligned with your mind."
                                : "You are a unique combination of all three. While your Prakriti defines your core nature, your emotional rhythms drift daily. Let's map how the celestial lunar cycle aligns with your body's inner clock."
                            }
                        </p>
                    </div>
                </div>

                {/* Continue Action (Secondary fallback) */}
                <button
                    onClick={() => setCurrentStep(user?.gender === 'male' ? 'music' : 'menstrual-moon')}
                    className="w-full py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] border border-[#C27A5D]/40 text-[#C27A5D] bg-[#FAF6F0]/30 hover:bg-[#FAF6F0] active:scale-[0.98] transition-all duration-300 shadow-md animate-fade-rise-delay-2 cursor-pointer"
                >
                    {user?.gender === 'male' ? 'Continue to Sound Sanctuary →' : 'Continue to Cycle & Moon Magic →'}
                </button>
            </div>
        </div>
    );
};
