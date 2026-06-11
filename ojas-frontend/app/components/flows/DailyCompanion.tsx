'use client';

import React from 'react';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'next/navigation';

export const DailyCompanion = () => {
    const { user, resetAssessment, setCurrentStep } = useUserStore();
    const router = useRouter();

    const handleEnterDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-forest-ink text-surface-cream relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-resonant-pink/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-fixed-dim/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Back Button */}
            <button
                onClick={() => setCurrentStep('music')}
                className="absolute top-8 left-6 md:top-12 md:left-12 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-surface-cream/50 hover:text-resonant-pink transition-colors z-20 group cursor-pointer"
            >
                <span className="transition-transform group-hover:-translate-x-1">←</span> BACK
            </button>

            <main className="w-full max-w-4xl flex flex-col items-center space-y-12 py-12 relative z-10 animate-fade-rise">
                {/* Header Section */}
                <section className="text-center space-y-4">
                    <h1 className="font-display-lg text-[40px] md:text-[64px] text-resonant-pink tracking-widest opacity-90 uppercase">
                        Sanctuary Prepared
                    </h1>
                    <p className="font-body-lg text-surface-cream/80 text-xl md:text-2xl italic-serif">
                        Your tailored environment is ready to nurture your mind and body.
                    </p>
                </section>

                {/* Central Dashboard Card */}
                <div className="bg-forest-ink/60 backdrop-blur-xl border border-white/10 w-full rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center shadow-2xl">
                    {/* Sparkle Icon */}
                    <div className="mb-6 text-4xl text-yellow-200/80">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    
                    {/* Welcome Message */}
                    <div className="text-center mb-10">
                        <h2 className="font-headline-md text-3xl md:text-4xl text-surface-cream">
                            Welcome, <span className="italic-serif font-bold text-resonant-pink uppercase">{user?.name || 'Traveler'}</span>
                        </h2>
                        <p className="font-label-caps text-surface-cream/40 text-[10px] mt-4 tracking-[0.3em] uppercase">
                            CUSTOMIZED RITUAL CALIBRATED
                        </p>
                    </div>

                    {/* Status Grid */}
                    <div className={`grid grid-cols-1 ${user?.gender === 'male' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 w-full mb-8`}>
                        {/* Prakriti Card */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 text-center transition-colors hover:border-resonant-pink/30 hover:bg-white/10">
                            <div className="text-primary-fixed-dim text-2xl mb-1">
                                <span className="material-symbols-outlined">spa</span>
                            </div>
                            <span className="font-label-caps text-[10px] text-surface-cream/50 tracking-widest uppercase">PRAKRITI</span>
                            <span className="font-italic-serif text-resonant-pink text-xl capitalize">{user?.dominantDosha || 'Vata'}</span>
                        </div>

                        {/* Moon Sync Card */}
                        {user?.gender !== 'male' && (
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 text-center transition-colors hover:border-resonant-pink/30 hover:bg-white/10">
                                <div className="text-yellow-200/80 text-2xl mb-1">
                                    <span className="material-symbols-outlined">bedtime</span>
                                </div>
                                <span className="font-label-caps text-[10px] text-surface-cream/50 tracking-widest uppercase">MOON SYNC</span>
                                <span className="font-italic-serif text-surface-cream text-xl">{user?.menstrualCycleStart ? 'Aligned' : 'Exploring'}</span>
                            </div>
                        )}

                        {/* Music Card */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 text-center transition-colors hover:border-resonant-pink/30 hover:bg-white/10">
                            <div className="text-purple-400/80 text-2xl mb-1">
                                <span className="material-symbols-outlined">music_note</span>
                            </div>
                            <span className="font-label-caps text-[10px] text-surface-cream/50 tracking-widest uppercase">INDIE POP</span>
                            <span className="font-italic-serif text-resonant-pink text-xl capitalize">
                                {user?.musicPreferences && user?.musicPreferences.length > 0 
                                    ? user.musicPreferences.join(', ')
                                    : 'Calibrated'}
                            </span>
                        </div>
                    </div>

                    {/* Inspirational Quote Box */}
                    <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-resonant-pink/50"></div>
                        <p className="font-body-md italic text-surface-cream/80 text-lg md:text-xl leading-relaxed">
                            "True wellness is a dynamic balance of body, mind, and spirit. May your journey inward bring you boundless light."
                        </p>
                    </div>
                </div>

                {/* Navigation Actions */}
                <div className="w-full max-w-lg space-y-4 animate-fade-rise" style={{ animationDelay: '0.2s' }}>
                    {/* Primary Action */}
                    <button
                        onClick={handleEnterDashboard}
                        className="w-full bg-resonant-pink text-forest-ink font-headline-sm uppercase tracking-widest py-5 px-8 rounded-xl hover:bg-surface-cream transition-all duration-300 shadow-[0_0_20px_rgba(254,181,202,0.3)] hover:shadow-[0_0_30px_rgba(254,181,202,0.6)] flex items-center justify-center space-x-3 active:scale-[0.98] cursor-pointer"
                    >
                        <span>ENTER MAIN PORTAL</span>
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>

                    {/* Secondary Action */}
                    <button
                        onClick={() => {
                            resetAssessment();
                            router.push('/');
                        }}
                        className="w-full border border-white/20 text-surface-cream/60 font-label-caps py-4 px-8 rounded-xl hover:bg-white/5 hover:text-surface-cream hover:border-white/40 transition-all duration-300 text-xs tracking-[0.2em] active:scale-[0.98] cursor-pointer"
                    >
                        RESET & RESTART
                    </button>
                </div>
            </main>
        </div>
    );
};
