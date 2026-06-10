'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

export const DoshaAnimation = () => {
    const { setCurrentStep } = useUserStore();

    const handleContinue = () => {
        setCurrentStep('assessment');
    };

    useEffect(() => {
        // Micro-interaction for breathing cards
        const cards = document.querySelectorAll('.glass-card');
        const handleMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const card = mouseEvent.currentTarget as HTMLElement;
            const rect = card.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        cards.forEach(card => {
            card.addEventListener('mousemove', handleMouseMove);
        });

        return () => {
            cards.forEach(card => {
                card.removeEventListener('mousemove', handleMouseMove);
            });
        };
    }, []);

    return (
        <div className="bg-[#040d08] min-h-screen text-[#214f35] selection:bg-secondary-container selection:text-primary overflow-x-hidden">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes blink {
                    0%, 90%, 100% { opacity: 1; transform: scaleY(1); }
                    95% { opacity: 0.2; transform: scaleY(0.1); }
                }
                .animate-blink {
                    animation: blink 4s infinite ease-in-out;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(254, 181, 202, 0.1);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(254, 181, 202, 0.4);
                    box-shadow: 0 20px 40px rgba(0, 77, 44, 0.2);
                }
            `}} />

            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-[#040d08]/80 backdrop-blur-md">
                <div className="flex justify-between items-center px-margin-desktop py-stack-md max-w-container-max mx-auto">
                    <div className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tighter text-primary-fixed">OJAS</div>
                    <div className="hidden md:flex gap-stack-lg">
                        <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">Rituals</a>
                        <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">Apothecary</a>
                        <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">Wisdom</a>
                        <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors" href="#">About</a>
                    </div>
                    <button className="font-headline-sm text-label-caps px-4 py-2 bg-primary-container text-on-primary-container tracking-widest active:scale-95 transition-transform border-none">
                        Discovery
                    </button>
                </div>
            </nav>

            <main className="pt-[120px] pb-stack-xl">
                {/* Hero Section with Zen Kitten */}
                <section className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center min-h-[70vh]">
                    <div className="order-2 md:order-1">
                        <span className="font-label-caps text-label-caps text-secondary-container mb-stack-sm block">JOURNEY TO SELF</span>
                        <h1 className="font-display-lg text-[40px] md:text-[64px] text-primary-fixed mb-stack-md">Dosha Discovery</h1>
                        <p className="font-body-lg text-[20px] text-on-primary-fixed-variant max-w-xl mb-stack-lg leading-relaxed">
                            Within the midnight forest of the soul, your unique rhythm awaits illumination. Explore the fundamental energies that compose your being.
                        </p>
                        <div className="flex items-center gap-stack-lg">
                            <button 
                                onClick={handleContinue}
                                className="bg-primary-container text-on-primary font-headline-sm text-label-caps tracking-widest transition-all hover:bg-tertiary-container px-20 py-8 text-lg hover:scale-105 active:scale-95"
                            >
                                BEGIN ASSESSMENT
                            </button>
                            <span className="font-body-md text-secondary italic text-xl">Estimated time: 7 lunar minutes</span>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center relative">
                        {/* Glowing Aura */}
                        <div className="absolute inset-0 bg-secondary-container/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
                        <div className="relative z-10">
                            {/* We are reusing the cat placeholder or an empty space for the meditating scene */}
                            <img src="/meditating-cat.png" alt="Meditating Cat" className="w-[300px] h-auto relative z-10" />

                            {/* Blinking animation overlay logic simulated via CSS on specific elements or a mask */}
                            <div className="absolute top-[42%] left-[44%] w-4 h-1 bg-[#040d08]/80 rounded-full animate-blink opacity-0"></div>
                            <div className="absolute top-[42%] right-[44%] w-4 h-1 bg-[#040d08]/80 rounded-full animate-blink opacity-0"></div>
                        </div>
                    </div>
                </section>

                {/* The Three Pillars (Editorial 3-Column Grid) */}
                <section className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                        {/* Vata */}
                        <div className="glass-card p-stack-lg flex flex-col items-start h-full rounded-2xl">
                            <span className="material-symbols-outlined text-[64px] text-secondary-container mb-stack-md">air</span>
                            <h2 className="font-headline-md text-[32px] text-primary-fixed mb-stack-sm">Vata</h2>
                            <p className="font-label-caps text-[10px] text-secondary mb-stack-md tracking-widest">ETHER &amp; AIR</p>
                            <p className="font-body-md text-[17px] text-[#89ba99] mb-stack-lg flex-grow leading-relaxed">
                                The energy of movement. Governs breathing, muscle contraction, and cellular mobility. When in balance, Vata promotes creativity and flexibility.
                            </p>
                            <a className="font-label-caps text-label-caps text-secondary-container border-b border-secondary-container/30 pb-1 hover:border-secondary-container transition-all" href="#">CHARACTERISTICS</a>
                        </div>
                        
                        {/* Pitta */}
                        <div className="glass-card p-stack-lg flex flex-col items-start h-full rounded-2xl">
                            <span className="material-symbols-outlined text-[64px] text-secondary-container mb-stack-md">mode_fan</span>
                            <h2 className="font-headline-md text-[32px] text-primary-fixed mb-stack-sm">Pitta</h2>
                            <p className="font-label-caps text-[10px] text-secondary mb-stack-md tracking-widest">FIRE &amp; WATER</p>
                            <p className="font-body-md text-[17px] text-[#89ba99] mb-stack-lg flex-grow leading-relaxed">
                                The energy of transformation. Responsible for digestion, metabolism, and temperature regulation. Balanced Pitta yields intelligence and understanding.
                            </p>
                            <a className="font-label-caps text-label-caps text-secondary-container border-b border-secondary-container/30 pb-1 hover:border-secondary-container transition-all" href="#">CHARACTERISTICS</a>
                        </div>
                        
                        {/* Kapha */}
                        <div className="glass-card p-stack-lg flex flex-col items-start h-full rounded-2xl">
                            <span className="material-symbols-outlined text-[64px] text-secondary-container mb-stack-md">water_drop</span>
                            <h2 className="font-headline-md text-[32px] text-primary-fixed mb-stack-sm">Kapha</h2>
                            <p className="font-label-caps text-[10px] text-secondary mb-stack-md tracking-widest">EARTH &amp; WATER</p>
                            <p className="font-body-md text-[17px] text-[#89ba99] mb-stack-lg flex-grow leading-relaxed">
                                The energy of lubrication and structure. Provides strength, stamina, and stability. In balance, Kapha is expressed as love, calm, and forgiveness.
                            </p>
                            <a className="font-label-caps text-label-caps text-secondary-container border-b border-secondary-container/30 pb-1 hover:border-secondary-container transition-all" href="#">CHARACTERISTICS</a>
                        </div>
                    </div>
                </section>

                {/* Deep Knowledge Section */}
                <section className="max-w-container-max mx-auto px-margin-desktop mt-stack-xl">
                    <div className="relative overflow-hidden group rounded-2xl">
                        <div className="absolute inset-0 bg-primary-container/20 mix-blend-overlay"></div>
                        <div className="relative z-10 p-stack-xl flex flex-col md:flex-row items-center gap-stack-xl">
                            <div className="md:w-1/2">
                                <img alt="Forest floor" className="w-full h-[400px] object-cover grayscale brightness-50 hover:grayscale-0 transition-all duration-700 rounded-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFUH6b_euvUDkQpOzasX8s3_eE6unSMCQfZhJIURePFv6Nt85NcYdsAAV9Rf0U9VHzoR_FkkoEQxJ6sUm69TFHuL6favAUl1uUeeulX-t61QZsZr4feFl5zqufJ5shhUuHDNxYM2jmYO5zarG_vSN91JlCRPmazO8vo3hTUB_YocDFny9YkL7zJHIVl7oYffOPF-PMqNCRI9J7CBbH7mizeHGWPTJdYs8oup1Vut33G6sI4VEEsIHZdJ7ch4tmhKq9rlqYPCMywDra" />
                            </div>
                            <div className="md:w-1/2 space-y-stack-md">
                                <h3 className="font-headline-md text-[32px] text-primary-fixed">The Elemental Pulse</h3>
                                <blockquote className="font-quote text-[24px] text-[#89ba99] italic">
                                    &quot;Health is a state of equilibrium between the three humors, the seven tissues, and the three wastes.&quot;
                                </blockquote>
                                <p className="font-body-md text-[17px] text-[#89ba99] leading-relaxed">
                                    Our modern rituals are designed to harmonize these forces using pure botanical essences and mindful movement. Your discovery starts with understanding your Prakriti—your original nature.
                                </p>
                                <button className="border border-secondary-container text-secondary-container px-6 py-3 mt-4 font-label-caps text-label-caps hover:bg-secondary-container hover:text-[#040d08] transition-all rounded-full">
                                    LEARN MORE ABOUT RHYTHMS
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-low dark:bg-inverse-surface w-full py-stack-xl mt-stack-xl">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto">
                    <div className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-md md:mb-0">OJAS</div>
                    <div className="flex flex-col md:flex-row items-center gap-stack-md">
                        <div className="flex gap-gutter mb-stack-md md:mb-0">
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Contact</a>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant opacity-60">
                            © 2026 OJAS Modern Ayurveda. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};