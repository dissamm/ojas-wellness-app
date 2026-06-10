'use client';

import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { StardustCanvas, ElementalCanvas, SanctuaryOverlayCanvas } from './PrakritiAnimations';
import { Disclaimer } from '../Disclaimer';
import { DOSHA_DETAILS as FULL_DOSHA_DETAILS, DOSHA_MAP } from '../../data/prakritiData';

const DOSHA_UI_DETAILS = {
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
        sanctuaryImage: '/sanctuary-vata.jpg',
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
        sanctuaryImage: '/sanctuary-pitta.jpg',
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
        sanctuaryImage: '/sanctuary-kapha.jpg',
        sanctuaryTitle: 'Element of Earth'
    },
};

const FavourAvoidGrid = ({ items, avoidItems }: { items: string[], avoidItems: string[] }) => (
    <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/50 dark:bg-black/20 p-5 rounded-xl border border-sage-outline/20">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-ojas-green-dark dark:text-ojas-green">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Favour
            </h4>
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-ojas-green mt-1.5 flex-shrink-0"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-white/50 dark:bg-black/20 p-5 rounded-xl border border-sage-outline/20">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-[#b04020] dark:text-resonant-pink">
                <span className="material-symbols-outlined text-sm">cancel</span>
                Avoid
            </h4>
            <ul className="space-y-3">
                {avoidItems.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b04020]/60 mt-1.5 flex-shrink-0"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export const PrakritiResults = () => {
    const { user, setCurrentStep, resetAssessment, setDoshaComposition } = useUserStore();
    const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);
    const dominant = (user.dominantDosha || 'Vata') as keyof typeof DOSHA_UI_DETAILS;
    const composition = user.doshaComposition || { vata: 68, pitta: 22, kapha: 10 };
    const details = DOSHA_UI_DETAILS[dominant] || DOSHA_UI_DETAILS.Vata;
    
    // Dual Dosha Detection
    const sortedScores = Object.entries(composition).sort((a, b) => b[1] - a[1]);
    const secondaryKey = sortedScores[1][0] as keyof typeof composition;
    const secondaryName = secondaryKey.charAt(0).toUpperCase() + secondaryKey.slice(1);
    const secPct = sortedScores[1][1];
    const isDual = secPct >= 28;

    const [activeDeepDive, setActiveDeepDive] = useState<'primary' | 'secondary'>('primary');
    
    // Get full data from prakritiData for the deep dive based on toggle
    const activeDoshaName = activeDeepDive === 'primary' ? dominant : (isDual ? secondaryName as keyof typeof DOSHA_UI_DETAILS : dominant);
    const fullDetailsKey = DOSHA_MAP[activeDoshaName];
    const fullDetails = FULL_DOSHA_DETAILS[fullDetailsKey];

    const handleRetakeClick = () => {
        setShowRetakeConfirm(true);
    };

    const confirmRetake = () => {
        localStorage.removeItem('prakriti');
        localStorage.removeItem('dominantPrakriti');
        localStorage.removeItem('prakriti_quiz_progress');
        localStorage.removeItem('prakriti_quiz_answers');

        setDoshaComposition({ vata: 0, pitta: 0, kapha: 0 }, '');
        resetAssessment();
        window.location.reload();
    };

    const cancelRetake = () => {
        setShowRetakeConfirm(false);
    };

    const handleContinue = () => {
        setCurrentStep(user?.gender === 'male' ? 'music' : 'menstrual-moon');
    };

    return (
        <div className="bg-surface-cream dark:bg-forest-ink text-forest-ink dark:text-surface-cream selection:bg-resonant-pink/30 font-body-md overflow-x-hidden min-h-screen transition-colors duration-500">
            
            {/* Particles Layer */}
            <StardustCanvas dosha={dominant} />

            {/* Global Controls */}
            <div className="fixed top-24 right-margin-desktop z-40 hidden lg:block">
                <div className="flex flex-col gap-3">
                    {showRetakeConfirm ? (
                        <div className="bg-surface-container-low dark:bg-surface-container-highest border border-sage-outline/20 p-4 shadow-xl flex flex-col gap-3 rounded-xl backdrop-blur-md">
                            <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface">Are you sure? This clears your results.</span>
                            <div className="flex gap-2">
                                <button onClick={confirmRetake} className="bg-[#b04020] text-white px-4 py-1.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity rounded-md cursor-pointer">Yes</button>
                                <button onClick={cancelRetake} className="bg-transparent border border-sage-outline/20 px-4 py-1.5 font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface hover:bg-surface-bright dark:hover:bg-surface-dim transition-colors rounded-md cursor-pointer">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleRetakeClick} className="bg-surface-container-low dark:bg-surface-container-highest border border-sage-outline/20 px-stack-md py-2 font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-forest-ink hover:bg-surface-bright dark:hover:bg-surface-dim transition-all active:scale-95 cursor-pointer rounded-full">
                            Retake Analysis
                        </button>
                    )}
                    <button onClick={handleContinue} className="bg-primary text-on-primary px-stack-md py-2 font-label-caps text-[10px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer rounded-full">
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
                            {isDual ? (
                                <>
                                    Dual <span className="italic-serif font-italic-serif text-secondary lowercase">{dominant}</span> & <span className="italic-serif font-italic-serif text-secondary lowercase">{secondaryName}</span> Energy
                                </>
                            ) : (
                                <>
                                    Pure <span className="italic-serif font-italic-serif text-secondary lowercase">{dominant}</span> Energy
                                </>
                            )}
                        </h1>
                        <p className="font-body-lg text-on-surface-variant dark:text-surface-variant max-w-xl leading-relaxed">
                            {isDual ? `Your profile is strongly influenced by both ${dominant} and ${secondaryName}. While ${dominant} leads your constitution, your significant secondary ${secondaryName} creates a dynamic and highly adaptable energy signature.` : details.description}
                        </p>
                        
                        {/* Mobile Controls (visible only on small screens) */}
                        <div className="flex flex-col gap-3 mt-6 lg:hidden">
                            {showRetakeConfirm ? (
                                <div className="bg-surface-container-low dark:bg-surface-container-highest border border-sage-outline/20 p-4 flex flex-col gap-3 rounded-xl backdrop-blur-md animate-fade-rise">
                                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface text-center">Are you sure? This clears your results.</span>
                                    <div className="flex gap-2 justify-center">
                                        <button onClick={confirmRetake} className="bg-[#b04020] text-white px-6 py-2 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity flex-1 rounded-md cursor-pointer">Yes</button>
                                        <button onClick={cancelRetake} className="bg-transparent border border-sage-outline/40 px-6 py-2 font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface transition-colors flex-1 rounded-md cursor-pointer">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    <button onClick={handleContinue} className="bg-primary text-on-primary px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer flex-1 rounded-full">
                                        Continue Path
                                    </button>
                                    <button onClick={handleRetakeClick} className="bg-transparent border border-sage-outline/40 px-6 py-3 font-label-caps text-[10px] uppercase tracking-widest text-primary dark:text-inverse-on-surface active:scale-95 transition-all cursor-pointer flex-1 rounded-full">
                                        Retake
                                    </button>
                                </div>
                            )}
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
                                    <div className="h-full bg-resonant-pink dark:bg-[var(--ojas-accent)] rounded-full bar-reveal" style={{ '--target-width': `${composition.pitta}%`, animationDelay: '0.2s' } as React.CSSProperties}></div>
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

                {/* Element Sanctuary */}
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

                {/* Deep Dive Accordion */}
                <section className="mt-stack-xl max-w-4xl mx-auto space-y-4">
                    <div className="flex flex-col items-center mb-stack-md gap-4">
                        <h3 className="font-headline-sm text-primary dark:text-inverse-on-surface uppercase tracking-wide text-center">Deep Dive: Protocol & Herbs</h3>
                        {isDual && (
                            <div className="flex p-1 bg-white/40 dark:bg-black/40 rounded-full border border-outline-variant/20 backdrop-blur-md self-center">
                                <button 
                                    onClick={() => setActiveDeepDive('primary')}
                                    className={`px-6 py-2 rounded-full font-label-caps text-[10px] uppercase tracking-widest transition-all ${activeDeepDive === 'primary' ? 'bg-primary text-on-primary shadow-sm' : 'text-primary dark:text-surface-variant hover:bg-white/20 dark:hover:bg-white/5 cursor-pointer'}`}
                                >
                                    Primary: {dominant}
                                </button>
                                <button 
                                    onClick={() => setActiveDeepDive('secondary')}
                                    className={`px-6 py-2 rounded-full font-label-caps text-[10px] uppercase tracking-widest transition-all ${activeDeepDive === 'secondary' ? 'bg-primary text-on-primary shadow-sm' : 'text-primary dark:text-surface-variant hover:bg-white/20 dark:hover:bg-white/5 cursor-pointer'}`}
                                >
                                    Secondary: {secondaryName}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Diet */}
                    <details className="group bg-white/40 dark:bg-forest-ink/60 border border-outline-variant/20 rounded-xl overflow-hidden backdrop-blur-md [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-label-caps tracking-widest text-primary dark:text-inverse-on-surface uppercase">
                            Dietary Principles
                            <span className="material-symbols-outlined transition duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="p-6 pt-0 text-on-surface-variant dark:text-surface-variant font-body-md border-t border-outline-variant/10 mt-4">
                            <p className="mb-6 italic-serif font-italic-serif text-lg text-primary dark:text-white/80">{fullDetails.foods.principle}</p>
                            <FavourAvoidGrid items={fullDetails.foods.prefer} avoidItems={fullDetails.foods.avoid} />
                        </div>
                    </details>
                    
                    {/* Lifestyle */}
                    <details className="group bg-white/40 dark:bg-forest-ink/60 border border-outline-variant/20 rounded-xl overflow-hidden backdrop-blur-md [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-label-caps tracking-widest text-primary dark:text-inverse-on-surface uppercase">
                            Lifestyle & Routine
                            <span className="material-symbols-outlined transition duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="p-6 pt-0 text-on-surface-variant dark:text-surface-variant font-body-md border-t border-outline-variant/10 mt-4">
                            <p className="mb-6 italic-serif font-italic-serif text-lg text-primary dark:text-white/80">{fullDetails.lifestyle.principle}</p>
                            <FavourAvoidGrid items={fullDetails.lifestyle.prefer} avoidItems={fullDetails.lifestyle.avoid} />
                        </div>
                    </details>

                    {/* Herbs */}
                    <details className="group bg-white/40 dark:bg-forest-ink/60 border border-outline-variant/20 rounded-xl overflow-hidden backdrop-blur-md [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-label-caps tracking-widest text-primary dark:text-inverse-on-surface uppercase">
                            Botanical Allies
                            <span className="material-symbols-outlined transition duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="p-6 pt-0 text-on-surface-variant dark:text-surface-variant font-body-md border-t border-outline-variant/10 mt-4">
                            <div className="grid md:grid-cols-2 gap-4 mt-2">
                                {fullDetails.herbs.map((herb, idx) => (
                                    <div key={idx} className="flex gap-4 items-start p-5 bg-white/50 dark:bg-black/20 rounded-xl border border-sage-outline/10 hover:border-sage-outline/30 transition-colors">
                                        <div className="text-3xl filter drop-shadow-sm">{herb.icon}</div>
                                        <div>
                                            <div className="flex flex-col mb-2">
                                                <h4 className="font-bold text-primary dark:text-inverse-on-surface text-base">{herb.name}</h4>
                                                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 text-primary dark:text-white/60">{herb.sanskrit}</span>
                                            </div>
                                            <p className="text-sm leading-relaxed opacity-90">{herb.use}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>
                </section>
                
            </main>

            <Disclaimer className="mb-stack-lg" />

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
