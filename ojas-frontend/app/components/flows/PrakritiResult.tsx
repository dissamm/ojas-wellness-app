'use client';

import React from 'react';
import { useUserStore } from '../../store/userStore';
import { StardustCanvas, ElementalCanvas, SanctuaryOverlayCanvas } from './PrakritiAnimations';
import Link from 'next/link';

const DOSHA_DETAILS = {
    Vata: {
        symbol: 'air',
        elements: 'Ether & Air',
        description: 'Your profile is dominated by Air and Ether. You possess the gift of creativity, swift movement, and a spiritual lightness that allows you to adapt like the wind.',
        grace: 'Your nervous system is finely tuned, absorbing the world with high sensitivity. To remain balanced, seek "Grounding Rituals"—warmth, heavy textures, and rhythmic routines.',
        quote: '"Stability is the medicine for the wind."',
        colorClass: 'text-primary',
        accentClass: 'text-dusty-rose',
        bgClass: 'bg-primary-container',
        barColor: 'bg-primary-container',
        bentoData: [
            { icon: 'psychology', title: 'Mental Agility', desc: 'Rapid conceptualization and intuitive problem solving.' },
            { icon: 'fitness_center', title: 'Physical Frame', desc: 'Lean, delicate bone structure with high mobility.' },
            { icon: 'nights_stay', title: 'Sleep Pattern', desc: 'Light, active dreaming state often easily interrupted.' }
        ],
        sanctuaryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBewH4V2sRmuDXUfvkyyCUVjPhX3Rc-0p9gZza1MMvszWIX6bTsx8m7xDExEK-yEfQgjtn4Ewq6Ei-mWMgLwp42JsdmaDhwtwQAFnGryadrXZl-bjL44z_cElGuPhLwZ7Jk2wuC-1lJyMmBnUjf4ktKmlijvgZOfK63VOk9qbIfo4m_Rbn6O_trypybvbpHqeoH3azLMBis9E76xqgso1B8iaQfreikjZZD5IdWBs5QZ_XEuKzxz6iwK0APZs1PlCIVz8QeeIUItNcr',
        sanctuaryTitle: 'Element of Air'
    },
    Pitta: {
        symbol: 'local_fire_department',
        elements: 'Fire & Water',
        description: 'Your profile is dominated by Fire and Water. You possess the gift of sharp intellect, radiant warmth, and a transformative energy that illuminates everything you touch.',
        grace: 'Your metabolism and mental digestion are incredibly strong. You lead with passion. To remain balanced, seek "Cooling Rituals"—sweet scents, relaxed environments, and playful surrender.',
        quote: '"Coolness is the medicine for the fire."',
        colorClass: 'text-resonant-pink',
        accentClass: 'text-secondary-container',
        bgClass: 'bg-secondary',
        barColor: 'bg-resonant-pink',
        bentoData: [
            { icon: 'psychology', title: 'Mental Acuity', desc: 'Sharp, penetrating intellect with strong focus.' },
            { icon: 'fitness_center', title: 'Physical Frame', desc: 'Moderate, athletic build with strong metabolism.' },
            { icon: 'nights_stay', title: 'Sleep Pattern', desc: 'Sound, moderate sleep with vivid, active dreams.' }
        ],
        sanctuaryImage: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2000&auto=format&fit=crop',
        sanctuaryTitle: 'Element of Fire'
    },
    Kapha: {
        symbol: 'water_drop',
        elements: 'Earth & Water',
        description: 'Your profile is dominated by Earth and Water. You possess the gift of profound endurance, nurturing love, and a grounded stability that offers sanctuary to others.',
        grace: 'You are naturally steady and devoted. You love deeply and endure patiently. To remain balanced, seek "Stimulating Rituals"—vigorous movement, light foods, and spontaneous adventures.',
        quote: '"Movement is the medicine for the earth."',
        colorClass: 'text-on-primary-container',
        accentClass: 'text-primary-fixed',
        bgClass: 'bg-surface-tint',
        barColor: 'bg-dusty-rose',
        bentoData: [
            { icon: 'psychology', title: 'Mental Demeanor', desc: 'Calm, patient, and deeply compassionate nature.' },
            { icon: 'fitness_center', title: 'Physical Frame', desc: 'Solid, strong build with excellent endurance.' },
            { icon: 'nights_stay', title: 'Sleep Pattern', desc: 'Heavy, prolonged sleep with deep restfulness.' }
        ],
        sanctuaryImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2000&auto=format&fit=crop',
        sanctuaryTitle: 'Element of Earth'
    },
};

export const PrakritiResult = () => {
    const { user, setCurrentStep, resetAssessment, setDoshaComposition } = useUserStore();
    const dominant = (user.dominantDosha || 'Vata') as keyof typeof DOSHA_DETAILS;
    const composition = user.doshaComposition || { vata: 68, pitta: 22, kapha: 10 };
    const details = DOSHA_DETAILS[dominant] || DOSHA_DETAILS.Vata;

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

    const handleContinue = () => {
        setCurrentStep(user?.gender === 'male' ? 'music' : 'menstrual-moon');
    };

    return (
        <div className="bg-surface-cream dark:bg-forest-ink text-forest-ink dark:text-surface-cream selection:bg-resonant-pink/30 font-body-md overflow-x-hidden min-h-screen transition-colors duration-500">
            
            {/* Particles Layer */}
            <StardustCanvas dosha={dominant} />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-forest-ink/80 backdrop-blur-xl px-margin-mobile md:px-margin-desktop py-unit border-b border-outline-variant/10">
                <div className="max-w-container-max mx-auto flex justify-between items-center h-16">
                    <div className="font-display-lg text-headline-sm text-primary dark:text-inverse-on-surface tracking-tighter">OJAS</div>
                    <div className="hidden md:flex gap-stack-md">
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface border-b border-secondary-container pb-0.5 transition-colors">Analysis</span>
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">Lunar Sync</span>
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">Journey</span>
                    </div>
                    <div className="flex gap-stack-sm items-center">
                        <span className="material-symbols-outlined text-primary dark:text-inverse-on-surface cursor-pointer hover:opacity-70">notifications</span>
                        <span className="material-symbols-outlined text-primary dark:text-inverse-on-surface cursor-pointer hover:opacity-70">account_circle</span>
                    </div>
                </div>
            </nav>

            {/* Global Controls */}
            <div className="fixed top-24 right-margin-desktop z-40 hidden lg:block">
                <div className="flex flex-col gap-3">
                    <button onClick={handleRetakeClick} className="bg-surface-container-low dark:bg-surface-container-highest border border-sage-outline/20 px-stack-md py-2 font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-forest-ink hover:bg-surface-bright dark:hover:bg-surface-dim transition-all active:scale-95 cursor-pointer">
                        Retake Analysis
                    </button>
                    <button onClick={handleContinue} className="bg-primary text-on-primary px-stack-md py-2 font-label-caps text-[10px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer">
                        Continue Path
                    </button>
                </div>
            </div>

            <main className="relative z-10 pt-[120px] px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
                
                {/* Hero: Dominant Dosha Reveal */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center mb-stack-xl mt-8">
                    <div className="lg:col-span-7 flex flex-col gap-stack-sm animate-float">
                        <span className={`font-label-caps text-label-caps uppercase tracking-[0.4em] ${details.accentClass}`}>Your Prakriti Identity</span>
                        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary dark:text-inverse-on-surface tracking-tighter leading-[1] mb-4">
                            Pure <span className="italic-serif font-italic-serif text-secondary lowercase">{dominant}</span> Energy
                        </h1>
                        <p className="font-body-lg text-on-surface-variant dark:text-surface-variant max-w-xl leading-relaxed">
                            {details.description}
                        </p>
                        
                        {/* Mobile Controls (visible only on small screens) */}
                        <div className="flex flex-wrap gap-3 mt-6 lg:hidden">
                            <button onClick={handleContinue} className="bg-primary text-on-primary px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer">
                                Continue Path
                            </button>
                            <button onClick={handleRetakeClick} className="bg-transparent border border-sage-outline/40 px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface active:scale-95 transition-all cursor-pointer">
                                Retake
                            </button>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-5 relative flex justify-center items-center py-stack-xl mt-8 lg:mt-0">
                        {/* Atmospheric Layered Composition */}
                        <div className="absolute inset-0 solar-flare-glow -z-10 dark:opacity-20"></div>
                        <div className={`absolute w-80 h-80 rounded-full blur-3xl animate-pulse ${dominant === 'Vata' ? 'bg-gradient-to-tr from-primary-fixed-dim/20 to-resonant-pink/20' : dominant === 'Pitta' ? 'bg-gradient-to-tr from-secondary/20 to-resonant-pink/30' : 'bg-gradient-to-tr from-primary-container/20 to-dusty-rose/20'}`}></div>
                        
                        <div className="relative w-full max-w-md animate-float" style={{ animationDelay: '-2s' }}>
                            {/* Elemental Animation Container */}
                            <div className="relative z-30 overflow-hidden rounded-full border border-outline-variant/30 dark:border-white/10 aspect-square shadow-2xl bg-forest-ink/10 dark:bg-black/20 flex items-center justify-center">
                                <ElementalCanvas dosha={dominant} />
                                <span className="absolute z-40 material-symbols-outlined text-[80px] text-primary dark:text-inverse-on-surface/80 opacity-40 pointer-events-none" style={{ fontVariationSettings: "'wght' 100" }}>{details.symbol}</span>
                            </div>
                            {/* Decorative abstract frames */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-primary/20 dark:border-white/20 rounded-tl-full -z-10"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-secondary/20 dark:border-resonant-pink/20 rounded-br-full -z-10"></div>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-label-caps text-[10px] tracking-[1em] text-primary/40 dark:text-white/40 uppercase whitespace-nowrap">Equilibrium</div>
                        </div>
                    </div>
                </section>

                {/* Bento Layout: Insights & Stats */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
                    
                    {/* Composition Chart Card */}
                    <div className="md:col-span-2 glass-bento rounded-xl p-stack-lg flex flex-col justify-between earth-breath-bg">
                        <div>
                            <h3 className="font-headline-sm text-primary dark:text-inverse-on-surface mb-stack-sm uppercase tracking-wide">Constitutional Balance</h3>
                            <p className="font-body-md text-on-surface-variant dark:text-surface-variant mb-stack-md">Elementary alignment across functional energies.</p>
                        </div>
                        <div className="space-y-8 py-4">
                            <div className="space-y-2">
                                <div className="flex justify-between font-label-caps text-label-md dark:text-surface-variant">
                                    <span className="tracking-widest">VATA (AIR & ETHER)</span>
                                    <span className="text-primary dark:text-inverse-on-surface font-bold">{composition.vata}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-container-highest dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-container dark:bg-primary-fixed-dim rounded-full bar-reveal" style={{ '--target-width': `${composition.vata}%` } as React.CSSProperties}></div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between font-label-caps text-label-md dark:text-surface-variant">
                                    <span className="tracking-widest">PITTA (FIRE & WATER)</span>
                                    <span className="text-primary dark:text-inverse-on-surface font-bold">{composition.pitta}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-container-highest dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-resonant-pink dark:bg-[#c06080] rounded-full bar-reveal" style={{ '--target-width': `${composition.pitta}%`, animationDelay: '0.2s' } as React.CSSProperties}></div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between font-label-caps text-label-md dark:text-surface-variant">
                                    <span className="tracking-widest">KAPHA (EARTH & WATER)</span>
                                    <span className="text-primary dark:text-inverse-on-surface font-bold">{composition.kapha}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-container-highest dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-dusty-rose dark:bg-tertiary-container rounded-full bar-reveal" style={{ '--target-width': `${composition.kapha}%`, animationDelay: '0.4s' } as React.CSSProperties}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Focus Card */}
                    <div className={`glass-bento rounded-xl p-stack-lg ${details.bgClass} text-on-primary border-none shadow-xl flex flex-col justify-between group`}>
                        <div>
                            <div className="flex justify-between items-start mb-stack-md">
                                <span className="material-symbols-outlined text-secondary-container dark:text-white/80 text-4xl">{details.symbol}</span>
                                <span className="font-label-caps text-[10px] tracking-widest opacity-60">ESSENCE</span>
                            </div>
                            <h3 className="font-headline-sm mb-stack-sm uppercase">The {dominant} Grace</h3>
                            <p className="font-body-md opacity-90 leading-relaxed">
                                {details.grace}
                            </p>
                        </div>
                        <div className="mt-8 italic-serif font-italic-serif text-secondary-container dark:text-white/60 text-xl border-t border-on-primary/10 pt-4">
                            {details.quote}
                        </div>
                    </div>

                    {/* Attribute Mini-Cards */}
                    {details.bentoData.map((bento, idx) => (
                        <div key={idx} className="glass-bento rounded-xl p-stack-md flex flex-col gap-4 text-center items-center justify-center dark:bg-[#1C1C1A]/60">
                            <div className="w-12 h-12 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-primary dark:text-inverse-on-surface">{bento.icon}</span>
                            </div>
                            <h4 className="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-inverse-on-surface">{bento.title}</h4>
                            <p className="font-body-md text-on-surface-variant dark:text-surface-variant text-sm">{bento.desc}</p>
                        </div>
                    ))}
                    
                </section>

                {/* Element of Air Sanctuary */}
                <section className="mt-stack-xl relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
                    <img 
                        alt="Sanctuary" 
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
                        src={details.sanctuaryImage}
                    />
                    
                    {/* Wind Overlay Canvas */}
                    <SanctuaryOverlayCanvas dosha={dominant} />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 dark:from-black/90 via-primary/40 dark:via-black/40 to-transparent z-10"></div>
                    
                    <div className="absolute bottom-margin-desktop left-margin-desktop z-30 flex flex-col gap-stack-sm items-start pr-6">
                        <span className="font-label-caps text-[10px] text-resonant-pink tracking-[0.5em] uppercase">Archetypal Resonance</span>
                        <h2 className="font-display-lg text-white text-display-lg-mobile md:text-4xl leading-none">{details.sanctuaryTitle}</h2>
                        <p className="font-body-lg text-white/80 max-w-lg mb-4">
                            Harness the creative flow of {dominant}. Discover how the subtle currents of {details.elements} inspire your unique rhythm.
                        </p>
                        <button onClick={handleContinue} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-label-caps text-[11px] px-8 py-3 tracking-widest transition-all group/btn flex items-center gap-2 cursor-pointer">
                            EXPLORE PROTOCOL
                            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </section>
                
            </main>

            {/* Footer */}
            <footer className="w-full mt-stack-xl bg-surface-container dark:bg-forest-ink border-t border-outline-variant/10 px-margin-mobile md:px-margin-desktop py-stack-xl max-w-container-max mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                    <div className="flex flex-col gap-stack-sm">
                        <div className="font-display-lg text-headline-sm text-primary dark:text-inverse-on-surface">OJAS</div>
                        <p className="font-body-md text-on-surface-variant dark:text-surface-variant max-w-xs leading-relaxed">
                            Ancient Wisdom, Modern Rhythm. Personalizing your journey toward holistic equilibrium.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-stack-md">
                        <div className="flex flex-col gap-3">
                            <h5 className="font-label-caps text-[10px] text-primary dark:text-inverse-on-surface tracking-widest mb-2">LEGAL</h5>
                            <span className="font-body-md text-on-surface-variant dark:text-surface-variant hover:text-secondary cursor-pointer transition-all">Privacy Policy</span>
                            <span className="font-body-md text-on-surface-variant dark:text-surface-variant hover:text-secondary cursor-pointer transition-all">Terms of Service</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h5 className="font-label-caps text-[10px] text-primary dark:text-inverse-on-surface tracking-widest mb-2">RESOURCES</h5>
                            <span className="font-body-md text-on-surface-variant dark:text-surface-variant hover:text-secondary cursor-pointer transition-all">The Journal</span>
                            <span className="font-body-md text-on-surface-variant dark:text-surface-variant hover:text-secondary cursor-pointer transition-all">Community</span>
                        </div>
                    </div>
                </div>
                <div className="mt-stack-lg pt-8 border-t border-outline-variant/10 text-center opacity-50 font-label-caps text-[10px] tracking-widest dark:text-inverse-on-surface">
                    © 2026 OJAS WELLNESS. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    );
};
