'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { useUserStore } from '../store/userStore';
import { usePrakritiStore } from '../store/prakritiStore';
import { getDominantDoshaLabel } from '../lib/dominantDosha';
import { HERBS_DATA, Herb } from '../data/herbsData';
import { useHerbStore } from '../store/herbStore';
import { getAyurvedicSeason } from '../utils/ritualsData';
import Link from 'next/link';

type MealAlignment = 'aligned' | 'neutral' | 'aggravating';
type AgniState = 'sharp' | 'slow' | 'irregular' | null;

interface Meal {
  time: string;
  label: string;
  foods: string;
  alignment: MealAlignment;
  color: string;
  desc: string;
}

const MEALS: Meal[] = [
  { time: '08:30 AM', label: 'Breakfast', foods: 'Soaked Almonds & Stewed Pear', alignment: 'aligned', color: 'bg-primary-fixed text-primary-fixed', desc: 'Vata-pacifying, warm, spiced with cardamom.' },
  { time: '01:15 PM', label: 'Lunch', foods: 'Mung Dal Kitchari & Ghee', alignment: 'neutral', color: 'bg-secondary text-secondary', desc: 'Tridoshic, easy digestion, slightly high protein.' },
  { time: '07:45 PM', label: 'Dinner', foods: 'Spiced Paneer & Flatbread', alignment: 'aggravating', color: 'bg-error text-error', desc: 'Pitta-provoking, delayed timing for Kapha rhythm.' },
];

const SEASONAL_FOODS = [
  'Watermelon', 'Cucumber', 'Fennel', 'Mung Beans', 'Coconut Water', 'Ghee'
];

const AGNI_OPTIONS: { id: AgniState; label: string; icon: string; name: string }[] = [
  { id: 'sharp', label: 'SHARP', icon: 'bolt', name: 'Tikshna' },
  { id: 'slow', label: 'SLOW', icon: 'waves', name: 'Manda' },
  { id: 'irregular', label: 'IRREGULAR', icon: 'shuffle', name: 'Vishama' },
];

export default function Aahar() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { prakriti, dominantPrakriti } = usePrakritiStore();
  const [agni, setAgni] = useState<AgniState>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Herb states
  const { myStack, syncedToRituals, addHerb, removeHerb, setSynced } = useHerbStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1000);
  };

  const handleAddHerb = (herb: Herb | { name: string; dosage?: string; timeOfDay: string; emoji: string; bestFor: string[] }) => {
    addHerb({
      name: herb.name,
      dosage: herb.dosage || '500mg',
      timeOfDay: herb.timeOfDay,
      emoji: herb.emoji,
      bestFor: herb.bestFor
    });
  };

  const filteredHerbs = HERBS_DATA.filter((herb) => {
    return herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      herb.bestFor.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      herb.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isMounted) return null;

  const dominantDosha = getDominantDoshaLabel(user, prakriti, dominantPrakriti);
  const currentSeason = getAyurvedicSeason();

  return (
    <div className="bg-forest-ink text-on-surface font-body-md selection:bg-resonant-pink selection:text-forest-ink overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;
            vertical-align: middle;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card:hover {
            transform: translateY(-8px);
            border-color: #feb5ca; /* Resonant Pink */
            background: rgba(255, 255, 255, 0.06);
        }
        .breathing {
            animation: breathing 6s ease-in-out infinite;
        }
        @keyframes breathing {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        .breathing-glow {
            animation: breatheGlow 8s ease-in-out infinite;
            background: radial-gradient(circle, rgba(254, 181, 202, 0.08) 0%, rgba(0, 52, 28, 0) 70%);
        }
        @keyframes breatheGlow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
        }
        .italic-serif-font {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
        }
      `}} />

      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="breathing-glow absolute top-[-10%] right-[-10%] w-[600px] h-[600px]"></div>
        <div className="breathing-glow absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px]" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header />

      {/* Header Section */}
      <header className="relative z-10 pt-[120px] pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-4">
            <button onClick={() => router.push('/dashboard')} className="inline-flex items-center gap-2 font-label-caps text-[10px] text-on-surface hover:text-resonant-pink transition-colors mb-4 cursor-pointer uppercase tracking-widest">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                Return to Dashboard
            </button>
        </div>
        <div className="flex flex-col gap-unit">
            <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-[0.3em]">Nourishment Matrix</span>
            <h1 className="font-headline-md text-[40px] md:text-[64px] text-on-surface max-w-3xl leading-[0.9] uppercase">Daily Aahar Sanctuary</h1>
        </div>
      </header>

      {/* Overview Stats */}
      <section className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-xl">
        <div className="glass-card p-6 md:p-stack-lg border-l-2 border-l-primary-fixed rounded-xl">
            <div className="flex justify-between items-start mb-stack-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Dominant Dosha</span>
                <span className="material-symbols-outlined text-resonant-pink">psychology</span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface uppercase">{dominantDosha || 'VATA'}</div>
            <p className="font-italic-serif text-italic-serif text-on-surface-variant mt-2 italic">Requires specific rhythm & alignment</p>
        </div>
        <div className="glass-card p-6 md:p-stack-lg border-l-2 border-l-resonant-pink rounded-xl">
            <div className="flex justify-between items-start mb-stack-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Current Season</span>
                <span className="material-symbols-outlined text-resonant-pink">eco</span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface uppercase">{currentSeason.season} <span className="text-on-surface-variant text-[16px] block md:inline md:ml-2">({currentSeason.seasonEn})</span></div>
            <p className="font-italic-serif text-italic-serif text-on-surface-variant mt-2 italic">{currentSeason.desc.split('.')[0]}</p>
        </div>
        <div className="glass-card p-6 md:p-stack-lg border-l-2 border-l-tertiary rounded-xl">
            <div className="flex justify-between items-start mb-stack-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">Agni Score</span>
                <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
            </div>
            <div className="font-headline-md text-headline-md text-tertiary">78 / 100</div>
            <p className="font-italic-serif text-italic-serif text-on-surface-variant mt-2 italic">Sama Agni: Balanced Fire</p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-stack-xl">
        {/* Left Column: Food Log */}
        <div className="lg:col-span-4 flex flex-col gap-stack-lg">
            <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-[20px] md:text-[24px] text-on-surface uppercase tracking-tight">Daily Food Log</h2>
                <button className="material-symbols-outlined text-resonant-pink cursor-pointer">add_circle</button>
            </div>
            <div className="space-y-gutter relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/10"></div>
                
                {MEALS.map((meal, i) => (
                    <div key={i} className="relative pl-16 group">
                        <div className={`absolute left-[18px] top-1 w-3 h-3 rounded-full ${meal.color.split(' ')[0]} shadow-[0_0_10px_currentColor] z-10 ${meal.color.split(' ')[1]}`}></div>
                        <div className="glass-card p-5 md:p-stack-md rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-label-md text-[14px] text-on-surface-variant">{meal.time}</span>
                                <span className={`px-3 py-1 ${meal.alignment === 'aligned' ? 'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20' : meal.alignment === 'neutral' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-error/10 text-error border-error/20'} font-label-caps text-[9px] rounded-full uppercase tracking-widest border`}>{meal.alignment}</span>
                            </div>
                            <h3 className="font-headline-sm text-[18px] md:text-[20px] mb-1 text-on-surface uppercase">{meal.foods}</h3>
                            <p className="font-italic-serif text-[15px] text-on-surface-variant">{meal.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Column: Seasonal Foods & Agni */}
        <div className="lg:col-span-5 flex flex-col gap-stack-lg">
            {/* Ritucharya Guide */}
            <div>
                <h2 className="font-headline-sm text-[20px] md:text-[24px] text-on-surface mb-stack-md uppercase tracking-tight">Seasonal Foods</h2>
                <div className="glass-card p-6 md:p-stack-lg rounded-xl">
                    <div className="mb-stack-md relative group">
                        <img alt="Seasonal foods" className="w-full h-48 object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7qTQkGLSHl-AwfxipqBGXiIFy547Pft1yrWBkrERjhlp5w5yd26HJg74OWi20GjusDsW_S24eCn75h0uyIRL_PCLmjW-pbn4Bmq91URhVihRLIN-zsPnVMdvph2shQNvHkYfphLTNcTq9qwPBTP9ATRzraIzP09XeyXkc7lFO4d67yTcSFL84f4VLtJi9g0UUYwqBB1OFTR8rRCUp_Z5B95T3I8oE5AQmIRjG19Tloef50pTVyv24W7SLTfrH_Jw_J3bBFmxUAXtM" />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/60 to-transparent rounded-xl"></div>
                    </div>
                    <p className="font-italic-serif text-[18px] mb-stack-md text-white/80 italic">&ldquo;During {currentSeason.season}, Agni naturally lowers. Prioritize sweet, cold, liquid, and oily attributes.&rdquo;</p>
                    <div className="flex flex-wrap gap-2">
                        {SEASONAL_FOODS.map(f => (
                            <span key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-label-caps text-[10px] text-on-surface uppercase tracking-widest hover:border-resonant-pink transition-colors cursor-default">{f}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Agni Check-in */}
            <div>
                <h2 className="font-headline-sm text-[20px] md:text-[24px] text-on-surface mb-stack-md uppercase tracking-tight">Agni Check-in</h2>
                <div className="grid grid-cols-3 gap-3 md:gap-stack-sm">
                    {AGNI_OPTIONS.map((opt) => (
                        <button key={opt.id} onClick={() => setAgni(opt.id)} className={`flex flex-col items-center p-4 md:p-stack-md glass-card group rounded-xl cursor-pointer transition-all ${agni === opt.id ? 'border-resonant-pink bg-white/10 shadow-[0_0_15px_rgba(254,181,202,0.15)]' : ''}`}>
                            <span className={`material-symbols-outlined text-[32px] mb-2 transition-colors ${agni === opt.id ? 'text-resonant-pink' : 'text-primary-fixed group-hover:text-resonant-pink'}`}>{opt.icon}</span>
                            <span className={`font-label-caps text-[10px] tracking-widest ${agni === opt.id ? 'text-resonant-pink' : ''}`}>{opt.label}</span>
                            <span className={`font-label-md text-[9px] mt-1 opacity-50 italic ${agni === opt.id ? 'text-resonant-pink' : ''}`}>{opt.name}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-stack-sm p-4 md:p-stack-md bg-white/5 border border-white/5 rounded-xl">
                    <p className="font-italic-serif text-[15px] text-on-surface-variant text-center">&ldquo;Observe Agni&apos;s rhythm with kindness; it is the core of health.&rdquo;</p>
                </div>
            </div>
        </div>

        {/* Sticky Sidebar/Panel */}
        <aside className="lg:col-span-3">
            <div className="sticky top-28 glass-card border-none overflow-hidden rounded-xl bg-white/[0.02]">
                <div className="bg-white/10 p-5 md:p-stack-md flex justify-between items-center border-b border-white/5">
                    <h3 className="font-headline-sm text-[16px] text-on-surface uppercase tracking-widest">Aushadhi Stack</h3>
                    <span className="material-symbols-outlined text-resonant-pink breathing" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                </div>
                <div className="p-5 md:p-stack-md flex flex-col gap-stack-sm min-h-[300px]">
                    {/* Selected Herbs */}
                    {myStack.length === 0 ? (
                        <div className="text-center py-6">
                            <span className="text-2xl block mb-2 opacity-50">🌿</span>
                            <p className="text-[11px] leading-relaxed text-white/40 px-2 font-label-md">
                                No herbs in your stack. Add from the sanctuary below.
                            </p>
                        </div>
                    ) : (
                        myStack.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-2 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline-sm text-[12px] ${idx % 2 === 0 ? 'bg-primary-container text-primary-fixed' : 'bg-secondary-container text-resonant-pink'}`}>
                                    {item.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-caps text-[11px] leading-none text-on-surface tracking-wider uppercase">{item.name}</p>
                                    <p className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-tighter mt-1 italic">{item.timeOfDay}</p>
                                </div>
                                <button onClick={() => removeHerb(item.name)} className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-resonant-pink cursor-pointer">close</button>
                            </div>
                        ))
                    )}
                    
                    <div className="mt-auto pt-stack-lg">
                        <button onClick={handleSync} disabled={myStack.length === 0 || syncing} className="w-full bg-resonant-pink text-forest-ink py-4 rounded-lg font-headline-sm text-[14px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-[0_4px_20px_rgba(254,181,202,0.2)] disabled:opacity-50 cursor-pointer">
                            {syncing ? 'SYNCING...' : syncedToRituals ? '✓ SYNCED' : 'SYNC RITUALS'}
                        </button>
                        <p className="text-center font-label-md text-[9px] text-on-surface-variant mt-3 uppercase tracking-widest opacity-50">Next sync: Tomorrow 06:00 AM</p>
                    </div>
                </div>
            </div>
        </aside>
      </main>

      {/* Herb Sanctuary (Aushadhi) Wide Section */}
      <section className="bg-forest-ink/60 border-t border-white/5 py-stack-xl overflow-hidden relative z-10 backdrop-blur-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-xl gap-stack-md">
                <div>
                    <span className="font-label-caps text-label-caps text-resonant-pink uppercase tracking-[0.3em] text-[10px]">Botanical Intelligence</span>
                    <h2 className="font-headline-md text-[40px] md:text-[48px] text-on-surface mt-2 leading-none uppercase">Herb Sanctuary</h2>
                </div>
                <div className="relative w-full md:w-96">
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-transparent border-b border-white/20 focus:border-resonant-pink text-on-surface font-italic-serif text-[20px] pb-2 placeholder:text-white/30 focus:ring-0 focus:outline-none transition-colors" placeholder="Search Aushadhi Database..." type="text" />
                    <span className="material-symbols-outlined absolute right-0 bottom-2 text-on-surface-variant">search</span>
                </div>
            </div>

            {/* Recommended Stack */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-xl">
                {[
                  { name: 'Ashwagandha', category: 'Adaptogen', icon: 'stars', desc: 'The scent of a horse. Renowned for its ability to grant profound physical and mental strength.', tags: ['Vata-Pitta', 'Grounding'], dosage: '500mg', timeOfDay: '09:30 PM', emoji: '🌿', bestFor: ['Strength'] },
                  { name: 'Brahmi', category: 'Nervine', icon: 'visibility', desc: 'Cosmic consciousness. The primary herb for revitalizing the nervous system and intellect.', tags: ['Tridoshic', 'Focus'], dosage: '250mg', timeOfDay: '06:00 AM', emoji: '🌱', bestFor: ['Intellect'] },
                  { name: 'Triphala', category: 'Digestive', icon: 'refresh', desc: 'Three Fruits. A powerhouse for internal cleansing, detoxification, and Agni regulation.', tags: ['Tridoshic', 'Cleansing'], dosage: '1000mg', timeOfDay: '09:45 PM', emoji: '🍇', bestFor: ['Digestion'] }
                ].map(rec => {
                  const inStack = myStack.some(s => s.name === rec.name);
                  return (
                    <div key={rec.name} className="glass-card p-6 md:p-stack-lg flex flex-col gap-stack-sm rounded-xl">
                        <div className="flex justify-between items-start">
                            <span className="font-label-caps text-label-caps text-resonant-pink uppercase text-[10px] tracking-widest">{rec.category}</span>
                            <span className="material-symbols-outlined text-white/20">{rec.icon}</span>
                        </div>
                        <h3 className="font-headline-sm text-[24px] text-on-surface uppercase tracking-tight">{rec.name}</h3>
                        <p className="font-body-md text-white/70 text-[15px] leading-relaxed">{rec.desc}</p>
                        <div className="flex gap-2 my-2">
                            {rec.tags.map(t => (
                                <span key={t} className="px-2 py-0.5 border border-white/10 text-[9px] font-label-caps uppercase text-white/50">{t}</span>
                            ))}
                        </div>
                        <button onClick={() => handleAddHerb(rec)} disabled={inStack} className={`mt-auto py-3 font-headline-sm text-[12px] uppercase tracking-widest transition-colors cursor-pointer rounded ${inStack ? 'bg-primary-container text-primary-fixed' : 'bg-on-surface text-forest-ink hover:bg-resonant-pink'}`}>
                            {inStack ? 'Added to Routine' : 'Add to Routine'}
                        </button>
                    </div>
                  )
                })}
            </div>

            {/* Herb Database Grid */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border-t border-white/10 min-w-[600px]">
                    <thead>
                        <tr className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-[0.2em] text-left border-b border-white/5">
                            <th className="py-4 pr-4 font-normal">Herb Name</th>
                            <th className="py-4 px-4 font-normal">Suitability</th>
                            <th className="py-4 px-4 font-normal">Best For</th>
                            <th className="py-4 px-4 font-normal">When to Take</th>
                            <th className="py-4 pl-4 font-normal">Agni Note</th>
                        </tr>
                    </thead>
                    <tbody className="font-body-md text-[14px]">
                        {filteredHerbs.slice(0, 8).map(herb => (
                            <tr key={herb.name} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                <td className="py-4 pr-4">
                                    <p className="text-on-surface font-bold uppercase tracking-wide">{herb.name} <span className="text-[12px] opacity-50 font-normal italic lowercase ml-1">{herb.emoji}</span></p>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-1.5">
                                        {herb.dosha.Vata === 'beneficial' && <div className="w-2 h-2 rounded-full bg-primary-fixed" title="Vata Beneficial"></div>}
                                        {herb.dosha.Pitta === 'beneficial' && <div className="w-2 h-2 rounded-full bg-secondary-fixed" title="Pitta Beneficial"></div>}
                                        {herb.dosha.Kapha === 'beneficial' && <div className="w-2 h-2 rounded-full bg-resonant-pink" title="Kapha Beneficial"></div>}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-white/60">{herb.bestFor[0]}</td>
                                <td className="py-4 px-4 text-white/60">{herb.whenToTake.split('.')[0]}</td>
                                <td className="py-4 pl-4 text-resonant-pink italic text-[13px]">{herb.agniNote.substring(0, 30)}...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredHerbs.length === 0 && (
                    <div className="text-center py-12 text-white/40 font-label-md">No herbs found matching your search.</div>
                )}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-ink/80 border-t border-white/5 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto items-center">
            <div>
                <span className="font-headline-sm text-headline-sm text-resonant-pink uppercase tracking-widest">OJAS</span>
                <p className="font-body-md text-[14px] text-white/40 mt-2 max-w-xs">© 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm.</p>
            </div>
            <div className="flex flex-wrap md:justify-end gap-stack-lg">
                <Link href="/" className="font-label-caps text-[10px] text-white/50 hover:text-resonant-pink transition-all uppercase tracking-widest">Privacy</Link>
                <Link href="/" className="font-label-caps text-[10px] text-white/50 hover:text-resonant-pink transition-all uppercase tracking-widest">Terms</Link>
                <Link href="/" className="font-label-caps text-[10px] text-white/50 hover:text-resonant-pink transition-all uppercase tracking-widest">Journal</Link>
                <Link href="/" className="font-label-caps text-[10px] text-white/50 hover:text-resonant-pink transition-all uppercase tracking-widest">Community</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
