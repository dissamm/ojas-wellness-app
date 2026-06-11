'use client';

import React from 'react';
import Link from 'next/link';
import { CosmicCycle } from '../components/cycle/CosmicCycle';

export default function CyclePage() {
    return (
        <div className="min-h-screen relative flex flex-col pt-[120px]">
            {/* Top Navigation */}
            <header className="fixed top-0 w-full h-[120px] bg-forest-ink/80 backdrop-blur-xl z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <Link href="/dashboard" className="font-display-lg-mobile md:font-display-lg text-primary-fixed-dim tracking-tighter hover:opacity-80 transition-opacity">OJAS</Link>
                <nav className="hidden md:flex gap-stack-lg items-center font-label-caps text-label-caps uppercase tracking-widest text-outline-variant">
                    <Link href="/dashboard" className="hover:text-resonant-pink transition-colors">Analysis</Link>
                    <Link href="/cycle" className="hover:text-resonant-pink transition-colors active-link text-resonant-pink border-b-2 border-[#864d5f] pb-1">Lunar Sync</Link>
                    <Link href="/rituals" className="hover:text-resonant-pink transition-colors">Journey</Link>
                </nav>
                <div className="flex items-center gap-stack-sm">
                    <Link href="/dashboard" className="material-symbols-outlined text-primary-fixed-dim text-[32px] cursor-pointer hover:scale-110 transition-transform">account_circle</Link>
                </div>
            </header>

            <main className="flex-1">
                <CosmicCycle />
            </main>

            {/* Footer */}
            <footer className="bg-forest-ink w-full py-stack-xl border-t border-resonant-pink/20 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full gap-8">
                    <div className="font-display-lg text-primary-fixed-dim text-3xl tracking-tighter">OJAS</div>
                    <div className="flex flex-wrap justify-center gap-stack-md">
                        <Link className="font-body-md text-surface-cream/60 hover:text-resonant-pink transition-colors" href="#">Philosophy</Link>
                        <Link className="font-body-md text-surface-cream/60 hover:text-resonant-pink transition-colors" href="#">Terms</Link>
                        <Link className="font-body-md text-surface-cream/60 hover:text-resonant-pink transition-colors" href="#">Privacy</Link>
                        <Link className="font-body-md text-surface-cream/60 hover:text-resonant-pink transition-colors" href="#">Contact</Link>
                    </div>
                    <div className="font-body-md text-surface-cream/40 text-center md:text-right text-sm">
                        © 2026 OJAS Wellness.<br />Ancient Wisdom, Modern Luxury.
                    </div>
                </div>
            </footer>
        </div>
    );
}