'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { useUserStore } from '../store/userStore';
import { getJyotishProfile } from '../utils/jyotishData';

interface TransitRitual {
  id: string;
  time: string;
  duration: number;
  activity: string;
  description: string;
  dosha: string[];
  planetaryTag: string;
}

export default function JyotishPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const [addedTransitIds, setAddedTransitIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ojas_custom_transit_rituals');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const activeMap: Record<string, boolean> = {};
          parsed.forEach((r: TransitRitual) => {
            activeMap[r.id] = true;
          });
          setAddedTransitIds(activeMap);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isMounted]);

  if (!isMounted) return null;

  const jyotish = getJyotishProfile(user?.dateOfBirth);

  const transitsList: TransitRitual[] = [
    {
      id: 'transit-mercury',
      time: '08:00 AM',
      duration: 15,
      activity: '☿ Mercury Rx Alignment',
      description: 'Double your Nadi Shodhana practice. Soothes scattered thinking, communication errors, and tech issues.',
      dosha: ['Vata'],
      planetaryTag: '☿ Mercury Rx · Grounding',
    },
    {
      id: 'transit-venus',
      time: '09:30 AM',
      duration: 20,
      activity: '♀ Venus Sensory Ritual',
      description: 'Sensory pleasures restore balance. Favour music, good food, and beauty in your rituals.',
      dosha: ['Pitta'],
      planetaryTag: '♀ Venus in Taurus · Soothing',
    },
    {
      id: 'transit-mars',
      time: '05:00 PM',
      duration: 15,
      activity: '♂ Mars Cooling Practice',
      description: 'Competitive energy peaks. Avoid overexertion. Sheetali Pranayama recommended.',
      dosha: ['Pitta'],
      planetaryTag: '♂ Mars in Leo · Pitta Cooling',
    },
    {
      id: 'transit-jupiter',
      time: '11:00 AM',
      duration: 30,
      activity: '♃ Jupiter Learning Ritual',
      description: 'Philosophical growth period. Excellent for learning and new wellness practices.',
      dosha: ['Vata'],
      planetaryTag: '♃ Jupiter in Gemini · Vata Expansion',
    },
  ];

  const handleAddRitual = (transit: TransitRitual) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('ojas_custom_transit_rituals');
    let list = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    if (!list.some((r: TransitRitual) => r.id === transit.id)) {
      list.push({
        id: transit.id,
        time: transit.time,
        duration: transit.duration,
        activity: transit.activity,
        description: transit.description,
        dosha: transit.dosha,
        planetaryTag: transit.planetaryTag,
      });
      localStorage.setItem('ojas_custom_transit_rituals', JSON.stringify(list));
      setAddedTransitIds((prev) => ({ ...prev, [transit.id]: true }));
    }
  };

  return (
    <div className="bg-forest-ink text-surface-cream selection:bg-resonant-pink selection:text-forest-ink overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .breathing-glow {
            animation: breathe 8s ease-in-out infinite;
            background: radial-gradient(circle, rgba(254, 181, 202, 0.1) 0%, rgba(0, 52, 28, 0) 70%);
        }

        @keyframes breathe {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
        }

        .fade-in-up {
            animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 12px;
        }

        .glass-card:hover {
            transform: translateY(-4px);
            background: rgba(255, 255, 255, 0.06);
            border-color: #feb5ca; /* Resonant Pink */
        }

        .ritual-btn:active {
            transform: scale(0.95);
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }

        .matrix-cell {
            transition: all 0.3s ease;
        }
        .matrix-cell:hover {
            background-color: rgba(254, 181, 202, 0.15);
            color: #feb5ca;
        }

        .italic-serif-font {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
        }
      `}} />

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="breathing-glow absolute top-[-10%] right-[-10%] w-[600px] h-[600px]"></div>
        <div className="breathing-glow absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px]" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header />

      <main className="relative z-10 pt-[120px] pb-stack-xl max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Compact Hero Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md fade-in-up">
            <div className="max-w-3xl">
                <button onClick={() => router.push('/dashboard')} className="inline-flex items-center gap-2 font-label-caps text-[10px] text-resonant-pink hover:opacity-70 transition-opacity mb-4 cursor-pointer">
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                    Return to Dashboard
                </button>
                <h1 className="font-headline-md text-[36px] md:text-[56px] uppercase leading-none">
                    Your <span className="italic-serif-font lowercase tracking-normal text-resonant-pink">Jyotish</span> Blueprint
                </h1>
                <p className="mt-2 font-italic-serif italic text-body-lg text-white/70">
                    A celestial mapping of your cosmic anatomy.
                </p>
            </div>
            <div className="hidden lg:block text-right pb-1">
                <span className="font-label-caps text-[10px] opacity-50 uppercase text-white/50">Session Status</span>
                <p className="font-label-md text-resonant-pink uppercase tracking-widest">Active Alignment</p>
            </div>
        </header>

        {/* Central Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left Column (Main Focus) */}
            <div className="lg:col-span-7 space-y-gutter">
                {/* Birth Chart Overview */}
                <section className="fade-in-up delay-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="font-label-caps text-label-caps text-resonant-pink block mb-1">Janma Kundali</span>
                                <h2 className="font-headline-sm text-headline-sm uppercase">Vedic Alignment</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                                <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>sunny</span>
                                <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Sun</span>
                                <span className="font-headline-sm text-[16px] uppercase">{jyotish.sunSign.rashi}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                                <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>dark_mode</span>
                                <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Moon</span>
                                <span className="font-headline-sm text-[16px] uppercase">{jyotish.moonSign.rashi}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                                <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>north_east</span>
                                <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Asc</span>
                                <span className="font-headline-sm text-[16px] uppercase">{jyotish.lagna.rashi}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                                <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>stars</span>
                                <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Nakshatra</span>
                                <span className="font-headline-sm text-[16px] uppercase">{jyotish.nakshatra}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-lg">
                            <p className="font-body-md text-[15px] leading-relaxed text-white/80">
                                <span className="text-resonant-pink font-semibold">Synthesis:</span> Your {jyotish.lagna.english} ascendant brings emotional depth to your {jyotish.sunSign.english} restlessness. The {jyotish.moonSign.english} moon gifts you transformative intuition.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Graha-Dosha Matrix */}
                <section className="fade-in-up delay-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="font-headline-sm text-[18px] uppercase">Graha-Dosha Matrix</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-label-md text-[13px]">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5 text-white/80">
                                        <th className="px-6 py-4 font-label-caps text-resonant-pink">Graha</th>
                                        <th className="px-6 py-4 font-label-caps">Dosha</th>
                                        <th className="px-6 py-4 font-label-caps">Governs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white/70">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3 font-headline-sm text-[13px] uppercase text-white">
                                            <span className="text-xl text-resonant-pink">☉</span> Surya
                                        </td>
                                        <td className="px-6 py-4">Pitta</td>
                                        <td className="px-6 py-4">Vitality, Digestion</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3 font-headline-sm text-[13px] uppercase text-white">
                                            <span className="text-xl text-resonant-pink">☽</span> Chandra
                                        </td>
                                        <td className="px-6 py-4">Kapha/Vata</td>
                                        <td className="px-6 py-4">Emotions, Sleep</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3 font-headline-sm text-[13px] uppercase text-white">
                                            <span className="text-xl text-resonant-pink">☿</span> Budha
                                        </td>
                                        <td className="px-6 py-4">Mixed</td>
                                        <td className="px-6 py-4">Intellect, Nerves</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3 font-headline-sm text-[13px] uppercase text-white">
                                            <span className="text-xl text-resonant-pink">♃</span> Guru
                                        </td>
                                        <td className="px-6 py-4">Kapha</td>
                                        <td className="px-6 py-4">Expansion, Immunity</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column (Insights & Transits) */}
            <div className="lg:col-span-5 space-y-gutter">
                {/* Active Transits */}
                <section className="fade-in-up delay-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline-sm text-[18px] uppercase">Active Transits</h3>
                            <span className="material-symbols-outlined text-white/50 text-[20px]">auto_awesome</span>
                        </div>
                        <div className="space-y-4">
                            {/* Transit Item */}
                            <div className="p-4 border-l-2 border-resonant-pink bg-white/5 space-y-2 group transition-all hover:bg-white/[0.08]">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl text-resonant-pink">☿</span>
                                        <span className="font-headline-sm text-[12px] uppercase">Mercury Retrograde</span>
                                    </div>
                                    <span className="bg-resonant-pink text-forest-ink px-2 py-0.5 font-label-caps text-[9px] rounded-sm">VATA WATCH</span>
                                </div>
                                <p className="font-body-md text-[13px] text-white/70">Prioritize grounding spices and mental stillness.</p>
                                <button onClick={() => handleAddRitual(transitsList[0])} className="ritual-btn w-full mt-2 py-1.5 border border-resonant-pink/30 hover:bg-resonant-pink hover:text-forest-ink font-label-caps text-[9px] transition-all uppercase cursor-pointer">
                                    {addedTransitIds['transit-mercury'] ? '✓ ADDED' : '+ RITUAL'}
                                </button>
                            </div>

                            {/* Transit Item */}
                            <div className="p-4 border-l-2 border-primary-fixed bg-white/5 space-y-2 group transition-all hover:bg-white/[0.08]">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl text-primary-fixed">♀</span>
                                        <span className="font-headline-sm text-[12px] uppercase">Venus in Taurus</span>
                                    </div>
                                    <span className="bg-primary-container text-on-primary-container px-2 py-0.5 font-label-caps text-[9px] rounded-sm">PITTA SOOTHE</span>
                                </div>
                                <p className="font-body-md text-[13px] text-white/70">Window for lymphatic drainage and herbal baths.</p>
                                <button onClick={() => handleAddRitual(transitsList[1])} className="ritual-btn w-full mt-2 py-1.5 border border-primary-fixed/30 hover:bg-primary-fixed hover:text-forest-ink font-label-caps text-[9px] transition-all uppercase cursor-pointer text-primary-fixed">
                                    {addedTransitIds['transit-venus'] ? '✓ ADDED' : '+ RITUAL'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Numerology Matrix */}
                <section className="fade-in-up delay-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <div className="glass-card p-6">
                        <div className="mb-6">
                            <h3 className="font-headline-sm text-[18px] uppercase">Anka Jyotish</h3>
                            <p className="font-italic-serif italic text-white/70 text-[14px]">Numerical vibrations of your path.</p>
                        </div>
                        <div className="flex justify-around mb-6 text-center">
                            <div>
                                <span className="font-label-caps text-[9px] opacity-60 uppercase block mb-1 text-white/60">Life Path</span>
                                <div className="font-headline-md text-resonant-pink text-[40px] leading-none">{jyotish.lifePathNumber}</div>
                                <span className="font-italic-serif text-[12px] opacity-60">{jyotish.lifePathTagline}</span>
                            </div>
                            <div className="w-px h-12 bg-white/10 self-center"></div>
                            <div>
                                <span className="font-label-caps text-[9px] opacity-60 uppercase block mb-1 text-white/60">Personal Year</span>
                                <div className="font-headline-md text-white/80 text-[40px] leading-none">{jyotish.personalYearNumber}</div>
                                <span className="font-italic-serif text-[12px] opacity-60">Cycle</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 border border-white/10">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                <div key={n} className={`matrix-cell aspect-square border border-white/10 flex flex-col items-center justify-center p-2 text-center ${n === jyotish.lifePathNumber ? 'bg-resonant-pink/20 text-resonant-pink ring-1 ring-inset ring-resonant-pink/30' : ''}`}>
                                    <span className="font-label-caps text-[10px]">{n}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>

        {/* Bottom Section: Full-Width Timeline */}
        <section className="mt-gutter fade-in-up delay-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-headline-sm text-headline-sm uppercase">Cosmic Wellness Forecast: June</h3>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-resonant-pink transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-resonant-pink transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Week 1 */}
                    <div className="relative pl-6 border-l border-resonant-pink">
                        <div className="absolute -left-[6px] top-0 w-3 h-3 rounded-full bg-resonant-pink shadow-[0_0_10px_#feb5ca]"></div>
                        <span className="font-label-caps text-[10px] text-resonant-pink mb-2 block uppercase tracking-widest">Week 01</span>
                        <h4 className="font-headline-sm text-[16px] uppercase mb-2">Creative Surge</h4>
                        <p className="font-body-md text-white/70 text-[14px]">Mercury trine Jupiter supports vocal expression. Excellent for long-term planning.</p>
                    </div>
                    {/* Week 2 */}
                    <div className="relative pl-6 border-l border-white/10">
                        <div className="absolute -left-[4px] top-0 w-2 h-2 rounded-full border border-white/40 bg-forest-ink"></div>
                        <span className="font-label-caps text-[10px] opacity-60 mb-2 block uppercase tracking-widest text-white/50">Week 02</span>
                        <h4 className="font-headline-sm text-[16px] uppercase mb-2">Introspection</h4>
                        <p className="font-body-md text-white/70 text-[14px]">Retrograde shadows emerge. Reduce commitments and focus on internal Agni.</p>
                    </div>
                    {/* Week 3 */}
                    <div className="relative pl-6 border-l border-primary-fixed">
                        <div className="absolute -left-[6px] top-0 w-3 h-3 rounded-full bg-primary-fixed shadow-[0_0_10px_#00341c]"></div>
                        <span className="font-label-caps text-[10px] text-primary-fixed mb-2 block uppercase tracking-widest">Week 03</span>
                        <h4 className="font-headline-sm text-[16px] uppercase mb-2">Grounding Week</h4>
                        <p className="font-body-md text-white/70 text-[14px]">Solstice alignment. A time for deep rooting and rhythmic movement.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="w-full mt-stack-xl bg-transparent border-t border-white/10 px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-gutter">
          <div className="font-display-lg text-headline-sm text-white">OJAS</div>
          <div className="flex gap-6">
              <a className="font-label-caps text-label-caps text-white/80 hover:text-resonant-pink transition-all" href="#">Instagram</a>
              <a className="font-label-caps text-label-caps text-white/80 hover:text-resonant-pink transition-all" href="#">Journal</a>
              <a className="font-label-caps text-label-caps text-white/80 hover:text-resonant-pink transition-all" href="#">Privacy</a>
          </div>
          <p className="font-body-md text-[14px] text-white/60">© 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm.</p>
      </footer>
    </div>
  );
}
