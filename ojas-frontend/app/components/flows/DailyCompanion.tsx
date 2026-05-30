'use client';

import React from 'react';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'next/navigation';

export const DailyCompanion = () => {
    const { user, resetAssessment } = useUserStore();
    const router = useRouter();

    const handleEnterDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#F4EFEA] text-[#1C1917] selection:bg-[#c06080]/10">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-rise">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c06080] font-semibold mb-2 block">
                        OJAS SANCTUARY
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3 font-normal leading-tight">
                        Sanctuary Prepared
                    </h1>
                    <p className="text-stone-500 text-sm max-w-md mx-auto">
                        Your tailored environment is ready to nurture your mind and body.
                    </p>
                </div>

                {/* Glass Card Summary */}
                <div className="bg-white/90 border border-stone-200/50 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8 space-y-6 animate-fade-rise-delay">
                    <div className="text-center pb-6 border-b border-stone-200/50">
                        <div className="text-5xl mb-4 animate-float">✨</div>
                        <h3 className="text-2xl font-serif font-normal text-stone-900">
                            Welcome, <span className="italic text-[#c06080]">{user.name}</span>
                        </h3>
                        <p className="text-stone-400 text-xs font-mono tracking-widest mt-1">
                            CUSTOMIZED RITUAL CALIBRATED
                        </p>
                    </div>

                    <div className={`grid grid-cols-1 ${user?.gender === 'male' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
                        <div className="p-4 bg-[#F4EFEA] rounded-2xl text-center border border-stone-200/40">
                            <p className="text-2xl mb-1">🌿</p>
                            <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">Prakriti</p>
                            <p className="font-serif italic font-semibold text-stone-850 mt-1">{user.dominantDosha || 'Vata'}</p>
                        </div>
                        {user?.gender !== 'male' && (
                            <div className="p-4 bg-[#F4EFEA] rounded-2xl text-center border border-stone-200/40">
                                <p className="text-2xl mb-1">🌙</p>
                                <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">Moon Sync</p>
                                <p className="font-serif italic font-semibold text-stone-850 mt-1">
                                    {user.menstrualCycleStart ? 'Aligned' : 'Exploring'}
                                </p>
                            </div>
                        )}
                        <div className="p-4 bg-[#F4EFEA] rounded-2xl text-center border border-stone-200/40">
                            <p className="text-2xl mb-1">🎵</p>
                            <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">Indie Pop</p>
                            <p className="font-serif italic font-semibold text-[#c06080] mt-1 text-sm">
                                {user.musicPreferences && user.musicPreferences.length > 0 
                                    ? user.musicPreferences.join(', ').toUpperCase() 
                                    : 'CALIBRATED'}
                            </p>
                        </div>
                    </div>

                    <div className="p-5 bg-[#F4EFEA] rounded-2xl border border-stone-200/50 text-center">
                        <p className="text-xs italic text-stone-600 leading-relaxed">
                            &ldquo;True wellness is a dynamic balance of body, mind, and spirit. May your journey inward bring you boundless light.&rdquo;
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 animate-fade-rise-delay-2">
                    <button
                        onClick={handleEnterDashboard}
                        className="w-full py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-white hover:bg-[#c06080] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer"
                    >
                        Enter Main Portal →
                    </button>
                    
                    <button
                        onClick={() => {
                            resetAssessment();
                            router.push('/');
                        }}
                        className="w-full py-3.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] border border-stone-300 hover:border-stone-500 transition-all duration-300 text-stone-500 hover:text-stone-900 cursor-pointer"
                    >
                        Reset & Restart
                    </button>
                </div>
            </div>
        </div>
    );
};
