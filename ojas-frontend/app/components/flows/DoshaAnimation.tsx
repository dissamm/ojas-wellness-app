'use client';

import React from 'react';
import { useUserStore } from '../../store/userStore';

const DOSHAS = [
    {
        name: 'Vata',
        elements: 'Ether & Air',
        qualities: ['Light', 'Mobile', 'Quick', 'Creative', 'Energetic'],
        colorClass: 'border-[#A3A3C2] text-[#5C5C7A]',
        bgClass: 'bg-[#F2F2FA]',
        icon: '💨',
        description: 'Vata embodies movement, creativity, and flow. When balanced, it inspires high enthusiasm and open adaptability. When out of sync, it can lead to restlessness.',
    },
    {
        name: 'Pitta',
        elements: 'Fire & Water',
        qualities: ['Hot', 'Sharp', 'Driven', 'Transformative', 'Analytical'],
        colorClass: 'border-[#C27A5D]/40 text-[#C27A5D]',
        bgClass: 'bg-[#FAF6F0]',
        icon: '🔥',
        description: 'Pitta represents digestion, focus, and heat. When in balance, it breeds razor-sharp intellect, deep ambition, and warm leadership. When high, it causes tension.',
    },
    {
        name: 'Kapha',
        elements: 'Earth & Water',
        qualities: ['Heavy', 'Stable', 'Slow', 'Grounded', 'Nurturing'],
        colorClass: 'border-[#8FBC8F]/50 text-[#4F7355]',
        bgClass: 'bg-[#F0F5F2]',
        icon: '🌍',
        description: 'Kapha governs physical structure, stability, and calm. Balanced Kapha yields strong emotional stamina, loyalty, and quiet endurance. When slow, it creates fatigue.',
    },
];

export const DoshaAnimation = () => {
    const { user, setCurrentStep } = useUserStore();

    const handleContinue = () => {
        setCurrentStep('assessment');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#F4EFEA] text-[#1C1917] selection:bg-[#C27A5D]/10">
            <div className="max-w-6xl w-full">
                {/* Header Section */}
                <div className="text-center mb-14 animate-fade-rise">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold mb-2 block">
                        AYURVEDIC ARCHETYPES
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3 font-normal leading-tight">
                        Hello, <span className="italic text-[#C27A5D]">{user.name || 'beautiful soul'}</span>.
                    </h1>
                    <p className="text-stone-500 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
                        In Ayurveda, your mind and body are governed by three primary bio-energetic humors (Doshas). Explore their traits before discovering your dominant constitution.
                    </p>
                </div>

                {/* 3-Column Editorial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 animate-fade-rise-delay">
                    {DOSHAS.map((dosha, idx) => (
                        <div
                            key={idx}
                            className={`bg-white/90 border border-stone-200/50 backdrop-blur-md rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#C27A5D]/20 transition-all duration-300`}
                        >
                            <div>
                                {/* Icon & Name Header */}
                                <div className="text-center md:text-left mb-6 flex flex-col md:flex-row items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${dosha.bgClass} border border-stone-200/20`}>
                                        {dosha.icon}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-2xl font-serif italic font-semibold text-stone-900">
                                            {dosha.name}
                                        </h2>
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                                            {dosha.elements}
                                        </span>
                                    </div>
                                </div>

                                {/* Qualities Pill Row */}
                                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start mb-6">
                                    {dosha.qualities.map((quality, qIdx) => (
                                        <span
                                            key={qIdx}
                                            className={`px-2 py-0.5 rounded-full text-[10px] border font-serif italic ${dosha.colorClass}`}
                                        >
                                            {quality}
                                        </span>
                                    ))}
                                </div>

                                {/* Editorial Description */}
                                <p className="text-stone-600 text-xs leading-relaxed font-serif italic text-center md:text-left">
                                    &ldquo;{dosha.description}&rdquo;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center animate-fade-rise-delay-2">
                    <button
                        onClick={handleContinue}
                        className="inline-block rounded-full px-12 py-4.5 text-xs font-mono font-bold uppercase tracking-[0.25em] bg-[#1C1917] text-white hover:bg-[#C27A5D] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer"
                    >
                        Discover Your Prakriti (Take Assessment) →
                    </button>
                </div>
            </div>
        </div>
    );
};