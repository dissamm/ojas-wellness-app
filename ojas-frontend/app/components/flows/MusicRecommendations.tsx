'use client';

import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';

const INDIE_ARTISTS = [
    {
        id: 'prateek',
        name: 'Prateek Kuhad',
        song: 'Cold/Mess',
        genre: 'Acoustic / Indie Pop',
        description: 'Vulnerable, raw storytelling with delicate guitar work. Perfect for calming high Pitta heat.',
        spotifyUrl: 'https://open.spotify.com/track/1BWh445tV458t6575121S6',
        youtubeUrl: 'https://www.youtube.com/results?search_query=prateek+kuhad+cold+mess',
        icon: '🎸',
    },
    {
        id: 'taba',
        name: 'Taba Chake',
        song: 'Shaayad',
        genre: 'Folk Pop / Tribal',
        description: 'Bilingual Nyishi-English acoustic tunes inspired by the hills. Balances Vata restlessness.',
        spotifyUrl: 'https://open.spotify.com/track/5c8c50cE5f0P61iZg8Cg8J',
        youtubeUrl: 'https://www.youtube.com/results?search_query=taba+chake+shaayad',
        icon: '⛰️',
    },
    {
        id: 'anuv',
        name: 'Anuv Jain',
        song: 'Baarishein',
        genre: 'Singer-Songwriter',
        description: 'Gentle baritone vocals paired with storytelling acoustic pluckings. Restores deep emotional harmony.',
        spotifyUrl: 'https://open.spotify.com/track/5nAkv9yZkQ4gC0617v12S2',
        youtubeUrl: 'https://www.youtube.com/results?search_query=anuv+jain+baarishein',
        icon: '🌧️',
    },
    {
        id: 'lifafa',
        name: 'Lifafa',
        song: 'Jaago',
        genre: 'Electronic / Indie Pop',
        description: 'Dreamy, vintage Bollywood-infused electronic textures. Energizes Kapha blockages.',
        spotifyUrl: 'https://open.spotify.com/track/1HWh555tV458t6575121S9',
        youtubeUrl: 'https://www.youtube.com/results?search_query=lifafa+jaago',
        icon: '🪐',
    },
    {
        id: 'wcmt',
        name: 'When Chai Met Toast',
        song: 'Firefly',
        genre: 'Indie Folk / Happy Pop',
        description: 'Bright, multilingual optimistic folk tunes. Elevates energy and triggers immediate joy.',
        spotifyUrl: 'https://open.spotify.com/track/2NWh665tV458t6575121S2',
        youtubeUrl: 'https://www.youtube.com/results?search_query=when+chai+met+toast+firefly',
        icon: '✨',
    },
    {
        id: 'karsh',
        name: 'Karsh Kale',
        song: 'One Nation',
        genre: 'Asian Underground / Fusion',
        description: 'Classical Indian instrumentation merged with electronic breakbeats. Evokes primal cosmic alignment.',
        spotifyUrl: 'https://open.spotify.com/track/3HWh775tV458t6575121S4',
        youtubeUrl: 'https://www.youtube.com/results?search_query=karsh+kale+one+nation',
        icon: '🌀',
    },
];

export const MusicRecommendations = () => {
    const { setMusicPreferences, setCurrentStep } = useUserStore();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        // Save selected artist IDs (fall back to prateek if none selected)
        setMusicPreferences(selected.length > 0 ? selected : ['prateek']);
        setCurrentStep('companion');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#F4EFEA] text-[#1C1917] selection:bg-[#C27A5D]/10">
            <div className="max-w-4xl w-full">
                {/* Header Section */}
                <div className="text-center mb-10 animate-fade-rise">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-bold mb-2 block">
                        SOUND SANCTUARY
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#1C1917] leading-tight">
                        Underrated <span className="italic text-[#C27A5D]">Indie Pop</span> Gems
                    </h1>
                    <p className="text-stone-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                        We&apos;ve curated underrated, high-resonance Indian Indie artists. Select your favorite frequencies to calibrate your custom wellness soundscape.
                    </p>
                </div>

                {/* Artists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-rise-delay">
                    {INDIE_ARTISTS.map((artist) => {
                        const isSelected = selected.includes(artist.id);
                        return (
                            <div
                                key={artist.id}
                                className={`bg-white/90 rounded-3xl p-6 shadow-md border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                                    isSelected 
                                        ? 'border-[#C27A5D] bg-[#FAF6F0] shadow-[0_0_20px_rgba(194,122,93,0.05)]' 
                                        : 'border-stone-200/50'
                                }`}
                            >
                                <div>
                                    {/* Top Line */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{artist.icon}</span>
                                            <div>
                                                <h3 className="font-serif italic font-semibold text-lg text-stone-900 leading-tight">
                                                    {artist.name}
                                                </h3>
                                                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C27A5D]">
                                                    {artist.song}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {artist.genre.split(' ')[0]}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-stone-600 text-xs leading-relaxed italic mb-4 font-serif">
                                        &ldquo;{artist.description}&rdquo;
                                    </p>
                                </div>

                                {/* Actions Layer */}
                                <div className="flex flex-col gap-3 pt-3 border-t border-stone-100">
                                    {/* Play directly shortcuts */}
                                    <div className="flex gap-2">
                                        <a
                                            href={artist.spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-2 px-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 text-center transition-all flex items-center justify-center gap-1 border border-emerald-500/20"
                                        >
                                            🟢 Spotify
                                        </a>
                                        <a
                                            href={artist.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-2 px-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C27A5D]/10 hover:bg-[#C27A5D]/20 text-[#C27A5D] text-center transition-all flex items-center justify-center gap-1 border border-[#C27A5D]/20"
                                        >
                                            🔴 YouTube
                                        </a>
                                        <a
                                            href={`https://music.apple.com/us/search?term=${encodeURIComponent(artist.name + ' ' + artist.song)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-2 px-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 text-center transition-all flex items-center justify-center gap-1 border border-rose-500/20"
                                        >
                                            🍎 Apple
                                        </a>
                                    </div>

                                    {/* Select Button */}
                                    <button
                                        onClick={() => toggleSelection(artist.id)}
                                        className={`w-full py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.25em] transition-all duration-300 border cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                                                : 'border-stone-300 text-stone-600 hover:border-stone-500 hover:bg-stone-50'
                                        }`}
                                    >
                                        {isSelected ? '✓ Resonance Saved' : 'Resonate with Artist'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Action */}
                <button
                    onClick={handleContinue}
                    className="w-full py-4.5 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-white hover:bg-[#C27A5D] active:scale-[0.98] transition-all duration-300 shadow-md animate-fade-rise-delay-2 cursor-pointer"
                >
                    Continue to Daily Companion →
                </button>
            </div>
        </div>
    );
};
