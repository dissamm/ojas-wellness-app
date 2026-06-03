'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

const DOSHA_DETAILS = {
    Vata: {
        symbol: 'air',
        elements: 'Ether & Air',
        description: 'Your profile is dominated by Air and Ether. You possess the gift of creativity, swift movement, and a spiritual lightness that allows you to adapt like the wind.',
        grace: 'Being predominantly Vata means your nervous system is finely tuned. You absorb the world with high sensitivity. To remain balanced, seek "Grounding Rituals"—warm oils, heavy textures, and rhythmic routines that anchor your ethereal nature.',
        quote: '"Stability is the medicine for the wind."',
        animationClass: '',
        bentoData: [
            { icon: 'psychology', title: 'Mental Agility', desc: 'Rapid conceptualization and intuitive problem solving.' },
            { icon: 'fitness_center', title: 'Physical Frame', desc: 'Lean, delicate bone structure with high mobility.' },
            { icon: 'nights_stay', title: 'Sleep Pattern', desc: 'Light, active dreaming state often easily interrupted.' }
        ]
    },
    Pitta: {
        symbol: 'local_fire_department',
        elements: 'Fire & Water',
        description: 'Your profile is dominated by Fire and Water. You possess the gift of sharp intellect, radiant warmth, and a transformative energy that illuminates everything you touch.',
        grace: 'Being predominantly Pitta means your metabolism and mental digestion are incredibly strong. You lead with passion. To remain balanced, seek "Cooling Rituals"—sweet scents, relaxed environments, and playful surrender to soften your intensity.',
        quote: '"Coolness is the medicine for the fire."',
        animationClass: 'pitta-glow',
        bentoData: [
            { icon: 'psychology', title: 'Mental Acuity', desc: 'Sharp, penetrating intellect with strong focus.' },
            { icon: 'fitness_center', title: 'Physical Frame', desc: 'Moderate, athletic build with strong metabolism.' },
            { icon: 'nights_stay', title: 'Sleep Pattern', desc: 'Sound, moderate sleep with vivid, active dreams.' }
        ]
    },
    Kapha: {
        symbol: 'water_drop',
        elements: 'Earth & Water',
        description: 'Your profile is dominated by Earth and Water. You possess the gift of profound endurance, nurturing love, and a grounded stability that offers sanctuary to others.',
        grace: 'Being predominantly Kapha means you are naturally steady and devoted. You love deeply and endure patiently. To remain balanced, seek "Stimulating Rituals"—vigorous movement, light foods, and spontaneous adventures to prevent stagnation.',
        quote: '"Movement is the medicine for the earth."',
        animationClass: 'kapha-ripple',
        bentoData: [
            { icon: 'psychology', title: 'Mental Demeanor', desc: 'Calm, patient, and deeply compassionate nature.' },
            { icon: 'fitness_center', title: 'Physical Frame', desc: 'Solid, strong build with excellent endurance.' },
            { icon: 'nights_stay', title: 'Sleep Pattern', desc: 'Heavy, prolonged sleep with deep restfulness.' }
        ]
    },
};

const VataParticleSystem = () => {
    useEffect(() => {
        const container = document.getElementById('particle-container');
        if (!container) return;

        const timeouts: NodeJS.Timeout[] = [];
        
        function createParticle() {
            if (!container) return;
            const particle = document.createElement('div');
            particle.className = 'vata-particle';
            
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + 10;
            
            const duration = 10 + Math.random() * 10;
            const delay = Math.random() * 5;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${delay}s`;
            
            container.appendChild(particle);

            const t = setTimeout(() => {
                particle.remove();
                createParticle();
            }, duration * 1000);
            timeouts.push(t);
        }

        for (let i = 0; i < 24; i++) {
            const t = setTimeout(createParticle, i * 300);
            timeouts.push(t);
        }

        return () => {
            timeouts.forEach(clearTimeout);
            if (container) container.innerHTML = '';
        };
    }, []);

    return <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40" id="particle-container"></div>;
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

    const handleContinue = () => {
        setCurrentStep(user?.gender === 'male' ? 'music' : 'menstrual-moon');
    };

    return (
        <div className="relative pt-[120px] min-h-screen px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl overflow-hidden bg-surface-cream dark:bg-forest-ink text-on-surface dark:text-inverse-on-surface font-body-md transition-colors duration-500">
            {dominant === 'Vata' && <VataParticleSystem />}

            {/* Sticky Control Panel (Sub-Header) */}
            <div className="fixed top-[90px] left-0 w-full z-40 px-margin-mobile md:px-margin-desktop pointer-events-none">
                <div className="max-w-container-max mx-auto flex justify-end gap-stack-sm pointer-events-auto">
                    <button 
                        onClick={handleRetakeClick}
                        className="bg-surface-container-low dark:bg-surface-container-highest border border-sage-outline/20 px-stack-md py-unit font-label-caps text-[10px] md:text-[12px] uppercase tracking-widest text-primary dark:text-inverse-on-surface hover:bg-surface-bright dark:hover:bg-surface-dim transition-all active:scale-95 rounded-sm"
                    >
                        Retake Analysis
                    </button>
                    <button 
                        onClick={handleContinue}
                        className="bg-primary-container text-on-primary px-stack-md py-unit font-headline-sm text-[12px] md:text-[14px] uppercase tracking-widest active:scale-95 transition-all rounded-sm"
                    >
                        Continue Path
                    </button>
                </div>
            </div>

            {/* Hero: Dominant Dosha Reveal */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end mb-stack-xl mt-8">
                <div className="lg:col-span-7 flex flex-col gap-stack-sm animate-fade-rise">
                    <span className="font-label-caps text-[12px] uppercase tracking-[0.4em] text-dusty-rose dark:text-resonant-pink">Your Prakriti Identity</span>
                    <h1 className="font-display-lg text-[48px] md:text-[64px] text-primary dark:text-inverse-on-surface tracking-tighter leading-tight">
                        Pure <span className="italic font-light">{dominant}</span> Energy
                    </h1>
                    <p className="font-body-lg text-[18px] md:text-[20px] text-on-surface-variant dark:text-on-surface-variant max-w-xl">
                        {details.description}
                    </p>
                </div>
                
                <div className="lg:col-span-5 flex justify-center lg:justify-end mt-12 lg:mt-0 animate-fade-rise" style={{ animationDelay: '0.2s' }}>
                    {/* Abstract Atmospheric Shape */}
                    <div className={`relative w-64 h-64 md:w-72 md:h-72 rounded-full blur-2xl animate-breathe ${dominant === 'Vata' ? 'bg-gradient-to-tr from-primary-fixed-dim/40 to-resonant-pink/30' : dominant === 'Pitta' ? 'bg-gradient-to-tr from-secondary/40 to-resonant-pink/50' : 'bg-gradient-to-tr from-primary-container/40 to-dusty-rose/30'}`}></div>
                    <div className="absolute w-56 h-56 md:w-64 md:h-64 border border-primary/10 dark:border-white/10 rounded-full flex items-center justify-center -translate-x-4 translate-y-4">
                        <span className="material-symbols-outlined text-[80px] text-primary dark:text-inverse-on-surface" style={{ fontVariationSettings: "'wght' 100" }}>{details.symbol}</span>
                    </div>
                </div>
            </section>

            {/* Bento Layout: Composition & Insights */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[minmax(300px,_auto)]">
                {/* Composition Chart Card */}
                <div className="md:col-span-2 glass-card-prakriti rounded-xl p-stack-lg flex flex-col justify-between animate-fade-rise" style={{ animationDelay: '0.3s' }}>
                    <div>
                        <h3 className="font-headline-sm text-[24px] text-primary dark:text-inverse-on-surface mb-stack-sm uppercase">Constitutional Balance</h3>
                        <p className="font-body-md text-[17px] text-on-surface-variant mb-stack-md">Your current elementary alignment across the three functional energies.</p>
                    </div>
                    <div className="space-y-stack-md">
                        {/* Vata Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant">
                                <span>VATA (AIR & ETHER)</span>
                                <span className="text-primary dark:text-inverse-on-surface">{composition.vata}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest dark:bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-container dark:bg-primary-fixed-dim rounded-full transition-all duration-1000" style={{ width: `${composition.vata}%` }}></div>
                            </div>
                        </div>
                        {/* Pitta Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant">
                                <span>PITTA (FIRE & WATER)</span>
                                <span className="text-primary dark:text-inverse-on-surface">{composition.pitta}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest dark:bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-resonant-pink dark:bg-[#c06080] rounded-full transition-all duration-1000" style={{ width: `${composition.pitta}%` }}></div>
                            </div>
                        </div>
                        {/* Kapha Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant">
                                <span>KAPHA (EARTH & WATER)</span>
                                <span className="text-primary dark:text-inverse-on-surface">{composition.kapha}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest dark:bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-dusty-rose dark:bg-tertiary-container rounded-full transition-all duration-1000" style={{ width: `${composition.kapha}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personalized Educational Note */}
                <div className="glass-card-prakriti rounded-xl p-stack-lg bg-primary-container dark:bg-[#002110] text-on-primary animate-fade-rise" style={{ animationDelay: '0.4s' }}>
                    <span className="material-symbols-outlined text-on-primary-container text-[48px] mb-stack-sm">auto_awesome</span>
                    <h3 className="font-headline-sm text-[24px] mb-stack-sm uppercase">The {dominant} Grace</h3>
                    <p className="font-body-md text-[17px] leading-relaxed opacity-90">
                        {details.grace}
                    </p>
                    <div className="mt-stack-md italic-serif font-italic-serif text-[17px] text-secondary-container dark:text-tertiary-fixed-dim">
                        {details.quote}
                    </div>
                </div>

                {/* Key Attributes Bento */}
                {details.bentoData.map((bento, idx) => (
                    <div 
                        key={idx} 
                        className={`glass-card-prakriti rounded-xl p-stack-lg flex flex-col justify-center text-center gap-stack-sm border-resonant-pink/30 dark:border-white/10 animate-fade-rise ${details.animationClass}`} 
                        style={{ animationDelay: `${0.5 + (idx * 0.1)}s` }}
                    >
                        <span className="material-symbols-outlined text-primary dark:text-inverse-on-surface text-[40px]">{bento.icon}</span>
                        <h4 className="font-label-caps text-[12px] uppercase tracking-widest text-primary dark:text-inverse-on-surface">{bento.title}</h4>
                        <p className="font-body-md text-[16px] text-on-surface-variant">{bento.desc}</p>
                    </div>
                ))}
            </section>

            {/* Full-Width Editorial Feature */}
            <section className="mt-stack-xl relative h-[400px] md:h-[500px] rounded-xl overflow-hidden group animate-fade-rise" style={{ animationDelay: '0.8s' }}>
                <img 
                    alt="Atmospheric Sanctuary" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfXi2mzMzTZ-B_p9qf_CSZufMoJP9Zvj_Q1gU5luUxfrxltKH56WyFdULCvdsvmxjVC-qGGKZO0sk-Z06Sp0oJ5prpvJwiFTOozdEfPaq8B48xkzMeU6X3I8jxF19isUfARtMRj3dAjV5gsDZ-8uEZhYTUbDj7qPQphtb2DXQgVAnMLYuoysLjFM3qigBgkwBZ7fcp1xSIbHY1Kat05yhKqS1hoY6lScHUaG8Vx6HSFU5S2xof5_mf0MO7RyhkZf8VnTZobvLC9H86"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 dark:from-forest-ink/90 to-transparent flex items-end p-margin-mobile md:p-margin-desktop">
                    <div className="max-w-2xl text-on-primary">
                        <h2 className="font-display-lg text-[40px] md:text-[64px] tracking-tighter mb-4">Cultivating Stillness</h2>
                        <p className="font-body-lg text-[18px] md:text-[20px] opacity-80 mb-stack-md">Discover your curated 7-day protocol for {dominant}-balancing movement, nutrition, and breathwork.</p>
                        <button 
                            onClick={handleContinue}
                            className="bg-surface-cream text-primary px-stack-md py-stack-sm font-label-caps text-[12px] uppercase tracking-widest hover:bg-resonant-pink hover:text-white transition-colors rounded-sm"
                        >
                            Explore Protocol
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
