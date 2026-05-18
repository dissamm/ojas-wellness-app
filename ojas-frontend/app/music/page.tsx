'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { usePrakritiStore } from '../store/prakritiStore';

// Artist Data
const ARTISTS = [
  {
    id: 'prateek',
    name: 'Prateek Kuhad',
    genre: 'Indie Hindi · Folk-pop',
    initials: 'PK',
    dosha: ['vata', 'pitta'],
    moods: ['cool', 'dream', 'grounding'],
    bestTime: '9 – 11 PM',
    desc: 'Delhi-born singer-songwriter whose hushed, introspective folk-pop is perfectly suited to Vata wind-down and Pitta emotional release.',
    why: {
      vata: 'Soft, airy vocals calm Vata\'s restless nervous system',
      pitta: 'Emotional clarity and lyrical sharpness resonate with Pitta intellect',
    },
    tracks: [
      { n: 'cold/mess', sub: 'Inparallellines · 2018', sp: 'https://open.spotify.com/track/0t1ykHOuAuQs5MjmO3YOAA', yt: 'https://youtube.com/watch?v=iHiEv5eVpI0' },
      { n: 'Kasoor', sub: 'Yet to be · 2019', sp: 'https://open.spotify.com/track/1x4lCwmqV3hzUDjPc6ck3G', yt: 'https://youtube.com/watch?v=aVnZSHGHOgU' },
      { n: 'Tum Jab Paas', sub: 'Single · 2021', sp: 'https://open.spotify.com/track/6vNn9HcPGHQJF3oSF3bz99', yt: 'https://youtube.com/watch?v=bTovHmBPqls' },
    ],
  },
  {
    id: 'taba',
    name: 'Taba Chake',
    genre: 'Folk · Hindi indie',
    initials: 'TC',
    dosha: ['kapha', 'vata'],
    moods: ['uplift', 'grounding', 'devotional'],
    bestTime: '6 – 9 AM',
    desc: 'Arunachal-born singer carrying northeast folk roots into indie Hindi. Raw warmth, earthy rhythms and unaffected sincerity make her essential Kapha morning listening.',
    why: {
      kapha: 'Earthy, rooted folk energy activates stagnant Kapha',
      vata: 'Warm simplicity grounds Vata\'s scattered mind',
    },
    tracks: [
      { n: 'Bum Bum Bole', sub: 'Single · 2019', sp: 'https://open.spotify.com/track/6IxpbPbHGPbZkOWE0vNhJY', yt: 'https://youtube.com/watch?v=zVxYU5BgKFU' },
      { n: 'Purani Jeans', sub: 'MTV Unplugged S9', sp: 'https://open.spotify.com/track/4Xe8zHLPsaLe1jDKWBFnOP', yt: 'https://youtube.com/watch?v=kIo61ywm0T4' },
      { n: 'Ek Doosre Se', sub: 'Single · 2021', sp: 'https://open.spotify.com/track/3q8jBrfEI7mh1FkPklWnMB', yt: 'https://youtube.com/watch?v=r8kE7KV3xgA' },
    ],
  },
  {
    id: 'karsh',
    name: 'Karsh Kale',
    genre: 'Electronic · World fusion',
    initials: 'KK',
    dosha: ['vata', 'pitta'],
    moods: ['dream', 'focus', 'grounding'],
    bestTime: '10 PM – 12 AM',
    desc: 'New York-based Indian-American producer blending tabla rhythms with electronic textures.',
    why: {
      vata: 'Tabla-driven trance creates the rhythmic anchor Vata needs',
      pitta: 'Complex layered production satisfies Pitta\'s hunger for depth',
    },
    tracks: [
      { n: 'Realize', sub: 'Realize · 2001', sp: 'https://open.spotify.com/track/3mZ5XL7M8z6r1SQBX0QCsH', yt: 'https://youtube.com/watch?v=LCHHO5g2ahM' },
      { n: 'Drift', sub: 'Realize · 2001', sp: 'https://open.spotify.com/track/5KkB3FJbf5E9Y8mRExYI8B', yt: 'https://youtube.com/watch?v=VQ5QR4ov0vI' },
      { n: 'Distance', sub: 'Distance · 2004', sp: 'https://open.spotify.com/track/2Rr0pHBR6HLkGhLJkE3kHU', yt: 'https://youtube.com/watch?v=Jn8V3tCi3ck' },
    ],
  },
  {
    id: 'nucleya',
    name: 'Nucleya',
    genre: 'Bass · Electronic · Desi fusion',
    initials: 'Nu',
    dosha: ['kapha', 'pitta'],
    moods: ['uplift', 'focus'],
    bestTime: '6 – 8 AM',
    desc: 'Udaipur-born Bharat Thakur fuses heavy bass drops with folk and regional Indian samples.',
    why: {
      kapha: 'Heavy rhythmic bass breaks Kapha inertia — ideal morning activation',
      pitta: 'Driving intensity channels Pitta energy productively',
    },
    tracks: [
      { n: 'Bass Rani', sub: 'Bass Rani · 2015', sp: 'https://open.spotify.com/track/1PxK8jtf1fDqcFMKn5QLNO', yt: 'https://youtube.com/watch?v=TrS3X5I3mfY' },
      { n: 'Laung Gawacha', sub: 'Raja Baja · 2016', sp: 'https://open.spotify.com/track/7aASqg9TG4gZqHu3rNF5Aa', yt: 'https://youtube.com/watch?v=6j7S3dNUP7g' },
      { n: 'Hindustani', sub: 'Bhakti · 2020', sp: 'https://open.spotify.com/track/0sUeGshXMbknXN9IXSVaZI', yt: 'https://youtube.com/watch?v=v6jE_MXU9Ek' },
    ],
  },
];

// Dosha color mapping in natural editorial tones
const DOSHA_COLORS = {
  vata: { bg: 'bg-sky-500/10 border-sky-300/40', text: 'text-sky-800' },
  pitta: { bg: 'bg-[#FAECE7] border-[#DF8060]/30', text: 'text-[#DF8060]' },
  kapha: { bg: 'bg-emerald-500/10 border-emerald-300/40', text: 'text-emerald-800' },
};

export default function MusicPage() {
  const { dominantPrakriti } = usePrakritiStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterDosha, setFilterDosha] = useState<string>('all');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get user's primary dosha
  const userDosha = dominantPrakriti?.toLowerCase() || 'pitta';

  // Filter artists based on selected dosha
  const filteredArtists = ARTISTS.filter(artist => {
    if (filterDosha === 'all') return true;
    return artist.dosha.includes(filterDosha);
  });

  // Get recommended artists based on user's dosha
  const recommendedArtists = ARTISTS.filter(artist =>
    artist.dosha.includes(userDosha)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col justify-between selection:bg-[#DF8060]/10">
      <div>
        <Header />

        <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 w-full space-y-12">
          
          {/* Header block */}
          <div className="mb-12 md:mb-16 animate-fade-rise text-center">
            <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#DF8060] font-semibold mb-3">
              SONIC SANCTUARY
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-instrument-serif text-[#1C1917] leading-[1.08] tracking-tight text-balance">
              Music & <span className="italic text-[#DF8060]">Soundscapes</span>
            </h1>
            <p className="text-stone-500 font-inter text-sm md:text-base mt-4 leading-relaxed max-w-xl mx-auto">
              Listen to sacred soundscapes carefully matched to balance your active dosha constitution and align with your current moon phase.
            </p>
          </div>

          {/* For You Section - Based on User's Dosha */}
          <div className="space-y-6 animate-fade-rise-delay">
            <h2 className="font-serif italic text-2xl text-stone-900 font-normal">
              ✦ Personal Resonance for {dominantPrakriti || 'Pitta'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedArtists.map((artist) => {
                const primaryDosha = artist.dosha[0];
                const colors = DOSHA_COLORS[primaryDosha as keyof typeof DOSHA_COLORS] || DOSHA_COLORS.pitta;
                return (
                  <div
                    key={artist.id}
                    onClick={() => toggleExpand(artist.id)}
                    className="cursor-pointer"
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300">
                      <div className="text-center p-4">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border ${colors.bg} ${colors.text} shadow-inner animate-float`}
                        >
                          {artist.initials}
                        </div>
                        <h3 className="text-xl font-serif text-stone-950 font-medium">{artist.name}</h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-stone-400 mt-1">{artist.genre}</p>
                        <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mt-3">Best at {artist.bestTime}</p>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col items-center gap-6 pt-6 border-t border-stone-200/30 animate-fade-rise-delay-2">
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold">
              RITUAL SOUND TRACKS BY DOSHA
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setFilterDosha('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  filterDosha === 'all'
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 bg-stone-200/20 hover:bg-stone-200/50'
                }`}
              >
                All Artists
              </button>
              <button
                onClick={() => setFilterDosha('vata')}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  filterDosha === 'vata'
                    ? 'bg-sky-500/10 border border-sky-300/40 text-sky-800 shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-900 bg-stone-200/20 hover:bg-stone-200/50'
                }`}
              >
                🌬️ Vata
              </button>
              <button
                onClick={() => setFilterDosha('pitta')}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  filterDosha === 'pitta'
                    ? 'bg-[#FAECE7] border border-[#DF8060]/30 text-[#DF8060] shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-900 bg-stone-200/20 hover:bg-stone-200/50'
                }`}
              >
                🔥 Pitta
              </button>
              <button
                onClick={() => setFilterDosha('kapha')}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  filterDosha === 'kapha'
                    ? 'bg-emerald-500/10 border border-emerald-300/40 text-emerald-800 shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-900 bg-stone-200/20 hover:bg-stone-200/50'
                }`}
              >
                🌍 Kapha
              </button>
            </div>
          </div>

          {/* Artists Grid */}
          <div className="grid md:grid-cols-2 gap-8 animate-fade-rise-delay-2">
            {filteredArtists.map((artist) => {
              const primaryDosha = artist.dosha[0];
              const colors = DOSHA_COLORS[primaryDosha as keyof typeof DOSHA_COLORS] || DOSHA_COLORS.pitta;
              const isExpanded = expandedId === artist.id;

              return (
                <div key={artist.id} className="w-full">
                  <Card className="overflow-hidden transition-all duration-300">
                    {/* Header - Click to expand */}
                    <div
                      className="cursor-pointer hover:bg-stone-100/10 transition"
                      onClick={() => toggleExpand(artist.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border ${colors.bg} ${colors.text}`}
                        >
                          {artist.initials}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-serif text-stone-950 font-normal">{artist.name}</h3>
                          <p className="text-xs text-stone-500 mt-0.5">{artist.genre}</p>
                          <div className="flex gap-2 mt-2">
                            {artist.dosha.map((d) => {
                              const badgeColors = DOSHA_COLORS[d as keyof typeof DOSHA_COLORS] || DOSHA_COLORS.pitta;
                              return (
                                <span
                                  key={d}
                                  className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColors.bg} ${badgeColors.text}`}
                                >
                                  {d}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">{isExpanded ? 'CLOSE' : 'OPEN'}</span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-stone-200/30 space-y-5 animate-fade-rise">
                        <p className="text-stone-500 font-inter text-xs md:text-sm leading-relaxed">{artist.desc}</p>

                        {/* Why this artist works for each dosha */}
                        {artist.why && (
                          <div className="space-y-3 bg-[#FDF6EC] border border-orange-100/30 p-4 rounded-2xl">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-[#DF8060] font-bold block mb-1">AYURVEDIC RESONANCE</span>
                            {Object.entries(artist.why).map(([dosha, text]) => {
                              const doshaColors = DOSHA_COLORS[dosha as keyof typeof DOSHA_COLORS] || DOSHA_COLORS.pitta;
                              return (
                                <div key={dosha} className="text-xs leading-relaxed">
                                  <span className={`${doshaColors.text} font-bold font-mono uppercase text-[9px] mr-1.5`}>
                                    {dosha}:
                                  </span>
                                  <span className="text-[#8A5A44] italic font-serif text-sm">{text as string}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Tracks */}
                        <div className="space-y-3">
                          <p className="text-xs font-mono uppercase tracking-widest text-stone-400">🎧 RECOMMENDED TRACKS</p>
                          {artist.tracks.map((track, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3.5 bg-white/60 border border-stone-200/20 rounded-2xl hover:border-[#DF8060]/30 transition duration-300">
                              <div className="flex-1">
                                <p className="text-sm font-serif text-stone-900 font-medium">{track.n}</p>
                                <p className="text-[10px] text-stone-400 font-mono tracking-wider mt-0.5">{track.sub}</p>
                              </div>
                              <div className="flex gap-2">
                                <a
                                  href={track.sp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-300/40 text-emerald-800 rounded-full transition"
                                  title="Open in Spotify"
                                >
                                  Spotify
                                </a>
                                <a
                                  href={track.yt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/40 text-[#DF8060] rounded-full transition"
                                  title="Open in YouTube"
                                >
                                  Watch
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="text-[9px] text-stone-400 font-mono text-center uppercase tracking-wider">
                          ⏰ Best hours of listening: {artist.bestTime}
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500 font-mono text-xs uppercase tracking-wider">No artists found for this dosha.</p>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>PHASE / NADA YOGA</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}