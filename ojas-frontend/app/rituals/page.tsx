'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { usePrakritiStore } from '../store/prakritiStore';
import { useCycleStore } from '../store/cycleStore';
import { useUserStore } from '../store/userStore';
import { getRitualsForDosha, getCycleStateFromStore, Ritual } from '../utils/ritualsData';
import { useHerbStore } from '../store/herbStore';
import { HERBS_DATA } from '../data/herbsData';
import { PRANAYAMA_TECHNIQUES, YOGA_SEQUENCES, PranayamaTechnique } from '../data/yogaPranayamaData';



// ─── Types ────────────────────────────────────────────────────────────────────
type CleanseLength = 7 | 14 | 21 | null;
type AgniState = 'sharp' | 'slow' | 'irregular' | null;

// ─── Cleanse programme data ───────────────────────────────────────────────────
const CLEANSE_PROGRAMMES = [
  {
    days: 7,
    title: '7 Days',
    subtitle: 'Light Cleanse',
    description: 'Ideal for first-timers. Gentle dietary reset and morning practices.',
    tier: 'free',
  },
  {
    days: 14,
    title: '14 Days',
    subtitle: 'Deep Cleanse',
    description: 'Full Dinacharya shift with Abhyanga and Pranayama intensives.',
    tier: 'premium',
  },
  {
    days: 21,
    title: '21 Days',
    subtitle: 'Full Panchakarma',
    description: 'Complete bio-reset. Strictest dietary and practice protocol.',
    tier: 'premium',
  },
] as const;

// Active cleanse demo: Day 4 of 14
const ACTIVE_CLEANSE_DAY = 4;
const ACTIVE_CLEANSE_TOTAL = 14;

// Cleanse-specific practice cards (shown when cleanse is active)
interface CleansePractice {
  id: string;
  time: string;
  duration: string;
  activity: string;
  description: string;
  dosha: string[];
  cleanseOnly?: boolean;
  planetaryTag?: string;
}

const CLEANSE_PRACTICES: CleansePractice[] = [
  {
    id: 'abhyanga',
    time: '05:00 AM',
    duration: '20',
    activity: 'Abhyanga (Self Oil Massage)',
    description: 'Warm sesame oil applied head to toe to pacify Vata and stimulate lymphatic flow.',
    dosha: ['Vata', 'Pitta'],
    cleanseOnly: true,
  },
  {
    id: 'brahma',
    time: '05:30 AM',
    duration: '15',
    activity: 'Brahma Muhurta Awakening',
    description: 'Rise before sunrise during the Brahma Muhurta for clarity and spiritual elevation.',
    dosha: ['Vata', 'Kapha'],
  },
  {
    id: 'kunjal',
    time: '06:00 AM',
    duration: '10',
    activity: 'Kunjal Kriya',
    description: 'Warm saline water cleanse to flush the upper digestive tract. Cleanse-only practice.',
    dosha: ['Pitta', 'Kapha'],
    cleanseOnly: true,
  },
  {
    id: 'nadi',
    time: '06:15 AM',
    duration: '10',
    activity: 'Nadi Shodhana Pranayama',
    description: 'Alternate nostril breathing to balance the solar and lunar energy channels.',
    dosha: ['Vata', 'Pitta', 'Kapha'],
  },
];

const FAVOUR_FOODS = ['Kitchari', 'Moong Dal', 'Ghee', 'Warm Water', 'Steamed Vegetables'];
const AVOID_FOODS  = ['RAW FOODS', 'COLD DRINKS', 'PROCESSED MEAT'];

const SEASONS = ['VASANTA', 'GRISHMA', 'VARSHA', 'HEMANTA'];
const CURRENT_SEASON = 'GRISHMA';

const PoseIcon = ({ id }: { id: string }) => {
  let paths = null;
  if (id === 'balasana') {
    paths = <path d="M 20 80 Q 35 45 60 55 Q 75 60 70 75 Q 50 85 20 80 M 70 75 L 75 80" />;
  } else if (id.startsWith('viparita_karani')) {
    paths = <path d="M 25 80 L 65 80 L 65 30 M 60 80 L 60 30" />;
  } else if (id === 'supta_baddha_konasana') {
    paths = <path d="M 15 80 L 85 80 M 35 80 Q 50 65 65 80 M 45 80 L 45 72 M 55 80 L 55 72" />;
  } else if (id === 'uttanasana' || id === 'prasarita_padottanasana') {
    paths = <path d="M 35 80 L 45 40 L 30 50 M 45 40 L 65 80" />;
  } else if (id === 'tadasana' || id === 'savasana_brief' || id === 'savasana') {
    paths = <path d="M 50 80 L 50 40 M 40 50 L 60 50 M 50 30 A 6 6 0 1 0 50 42 A 6 6 0 1 0 50 30" />;
  } else if (id === 'vrikshasana') {
    paths = <path d="M 50 80 L 50 40 M 50 60 L 35 68 L 50 72 M 40 50 L 60 50 M 50 30 A 6 6 0 1 0 50 42 A 6 6 0 1 0 50 30" />;
  } else if (id === 'setu_bandhasana' || id === 'matsyasana') {
    paths = <path d="M 20 80 Q 50 40 80 80 M 20 80 L 30 80 M 70 80 L 80 80" />;
  } else if (id === 'paschimottanasana' || id === 'janu_sirsasana') {
    paths = <path d="M 25 80 L 75 80 M 75 80 L 45 65 L 30 80" />;
  } else if (id === 'ananda_balasana') {
    paths = <path d="M 25 80 L 75 80 Q 50 80 40 55 Q 60 80 70 55" />;
  } else if (id === 'chandra_namaskar' || id === 'surya_namaskar') {
    paths = <path d="M 50 80 L 50 35 L 30 15 M 50 35 L 70 15 M 50 30 A 5 5 0 1 0 50 40 A 5 5 0 1 0 50 30" />;
  } else if (id === 'supta_matsyendrasana') {
    paths = <path d="M 20 80 Q 50 60 80 80 M 50 70 L 65 60 L 80 70" />;
  } else if (id === 'eka_pada_rajakapotasana' || id === 'kapotasana_var') {
    paths = <path d="M 20 80 Q 30 55 50 55 L 75 75 M 50 55 L 60 40" />;
  } else if (id === 'baddha_konasana') {
    paths = <path d="M 30 80 Q 50 65 70 80 M 40 80 L 60 80" />;
  } else if (id === 'cat_cow') {
    paths = <path d="M 25 80 C 35 70 50 70 60 75 M 60 75 L 60 65" />;
  } else if (id === 'savasana_eye_pillow') {
    paths = (
      <g>
        <path d="M 15 80 L 85 80 M 50 65 L 50 70" />
        <rect x="42" y="58" width="16" height="4" rx="1" fill="currentColor" opacity="0.8" />
      </g>
    );
  } else if (id === 'utkatasana') {
    paths = <path d="M 50 80 L 40 68 L 48 55 L 48 35 M 48 35 L 65 20 M 45 45 L 55 45" />;
  } else if (id === 'virabhadrasana_i') {
    paths = <path d="M 25 80 L 40 60 L 70 80 M 40 60 L 40 30 M 28 20 L 52 35" />;
  } else if (id === 'virabhadrasana_ii') {
    paths = <path d="M 25 80 L 45 60 L 65 80 M 45 60 L 45 35 M 20 35 L 70 35" />;
  } else if (id === 'navasana') {
    paths = <path d="M 30 50 L 50 75 L 70 50 M 50 75 L 50 65" />;
  } else if (id === 'ustrasana') {
    paths = <path d="M 35 80 L 35 55 Q 50 40 65 55 L 65 80 M 35 55 L 65 55" />;
  } else if (id === 'dhanurasana') {
    paths = <path d="M 25 60 Q 50 85 75 60 C 75 60 50 50 25 60" />;
  }

  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-current text-[#c06080] fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round select-none">
      {paths}
    </svg>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RitualsPage() {
    const { prakriti, dominantPrakriti } = usePrakritiStore();
    const { cycle } = useCycleStore();
    const { user } = useUserStore();

    // Safely extract dominant dosha
    let dominantDosha = 'Pitta';
    if (user?.dominantDosha) {
        dominantDosha = user.dominantDosha;
    } else if (dominantPrakriti) {
        dominantDosha = dominantPrakriti;
    } else if (prakriti) {
        const entries = Object.entries(prakriti);
        const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        dominantDosha = dominant.charAt(0).toUpperCase() + dominant.slice(1);
    }

    const [showPhaseMod, setShowPhaseMod] = useState(true);
    const [hydrated, setHydrated] = useState(false);

    // Panchakarma state
    const [selectedCleanse, setSelectedCleanse] = useState<CleanseLength>(null);
    const [cleanseActive, setCleanseActive] = useState(false);
    const [completedPractices, setCompletedPractices] = useState<Set<string>>(new Set());
    const [agni, setAgni] = useState<AgniState>(null);

    // --- Pranayama Breath Sanctuary states ---
    const [pranayamaTimer, setPranayamaTimer] = useState<PranayamaTechnique>(PRANAYAMA_TECHNIQUES[0]);
    const [pranayamaMinutes, setPranayamaMinutes] = useState<number>(5);
    const [pranayamaState, setPranayamaState] = useState<'idle' | 'breathing' | 'paused' | 'complete'>('idle');
    const [pranayamaPhase, setPranayamaPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
    const [pranayamaSecondsLeft, setPranayamaSecondsLeft] = useState<number>(4);
    const [pranayamaRounds, setPranayamaRounds] = useState<number>(1);
    const [pranayamaElapsed, setPranayamaElapsed] = useState<number>(0);
    const [pranayamaAudio, setPranayamaAudio] = useState<boolean>(true);

    // --- Yoga Asana Sanctuary states ---
    const [activeYogaTab, setActiveYogaTab] = useState<'VATA' | 'PITTA' | 'KAPHA'>('VATA');
    const [completedAsanas, setCompletedAsanas] = useState<Set<string>>(new Set());
    const [activePoseIndex, setActivePoseIndex] = useState<number | null>(null);

    const toggleAsana = (id: string) => {
        setCompletedAsanas(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleSelectTechnique = (tech: PranayamaTechnique) => {
        setPranayamaTimer(tech);
        setPranayamaState('idle');
        setPranayamaPhase('Inhale');
        setPranayamaSecondsLeft(tech.inhale);
        setPranayamaRounds(1);
        setPranayamaElapsed(0);
    };

    const handleTogglePlay = () => {
        if (pranayamaState === 'breathing') {
            setPranayamaState('paused');
        } else {
            setPranayamaState('breathing');
        }
    };

    const cycleDuration = pranayamaTimer.inhale + pranayamaTimer.hold + pranayamaTimer.exhale;
    const maxRounds = Math.floor((pranayamaMinutes * 60) / cycleDuration);

    const handlePrevRound = () => {
        setPranayamaRounds(r => Math.max(1, r - 1));
        setPranayamaPhase('Inhale');
        setPranayamaSecondsLeft(pranayamaTimer.inhale);
    };

    const handleNextRound = () => {
        setPranayamaRounds(r => {
            if (r >= maxRounds) {
                setPranayamaState('complete');
                return r;
            }
            return r + 1;
        });
        setPranayamaPhase('Inhale');
        setPranayamaSecondsLeft(pranayamaTimer.inhale);
    };

    const handleResetPranayama = () => {
        setPranayamaState('idle');
        setPranayamaPhase('Inhale');
        setPranayamaSecondsLeft(pranayamaTimer.inhale);
        setPranayamaRounds(1);
        setPranayamaElapsed(0);
    };

    const handleLogPranayama = () => {
        setCompletedPractices(prev => {
            const next = new Set(prev);
            next.add('pranayama');
            return next;
        });
    };

    useEffect(() => {
        if (dominantDosha) {
            const upper = dominantDosha.toUpperCase() as 'VATA' | 'PITTA' | 'KAPHA';
            if (['VATA', 'PITTA', 'KAPHA'].includes(upper)) {
                setActiveYogaTab(upper);
            }
        }
    }, [dominantDosha]);

    // Auto-tick Yoga Flow in Rituals checklist when the active sequence completes
    useEffect(() => {
        const activeSequence = YOGA_SEQUENCES[activeYogaTab];
        if (activeSequence && activeSequence.length > 0) {
            const allDone = activeSequence.every(asana => completedAsanas.has(asana.id));
            if (allDone) {
                setCompletedPractices(prev => {
                    const next = new Set(prev);
                    next.add('yoga');
                    return next;
                });
            }
        }
    }, [completedAsanas, activeYogaTab]);

    // Timer Interval logic for Pranayama
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        
        if (pranayamaState === 'breathing') {
            interval = setInterval(() => {
                setPranayamaElapsed(prev => {
                    const next = prev + 1;
                    if (next >= pranayamaMinutes * 60) {
                        setPranayamaState('complete');
                        return next;
                    }
                    return next;
                });

                setPranayamaSecondsLeft(prev => {
                    if (prev <= 1) {
                        let nextPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
                        let nextSeconds = 0;
                        
                        if (pranayamaPhase === 'Inhale') {
                            if (pranayamaTimer.hold > 0) {
                                nextPhase = 'Hold';
                                nextSeconds = pranayamaTimer.hold;
                            } else {
                                nextPhase = 'Exhale';
                                nextSeconds = pranayamaTimer.exhale;
                            }
                        } else if (pranayamaPhase === 'Hold') {
                            nextPhase = 'Exhale';
                            nextSeconds = pranayamaTimer.exhale;
                        } else {
                            nextPhase = 'Inhale';
                            nextSeconds = pranayamaTimer.inhale;
                            setPranayamaRounds(r => {
                                if (r >= maxRounds) {
                                    setPranayamaState('complete');
                                }
                                return r + 1;
                            });
                        }
                        
                        setPranayamaPhase(nextPhase);
                        return nextSeconds;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pranayamaState, pranayamaPhase, pranayamaTimer, pranayamaMinutes, maxRounds]);

    const scaleValue = (() => {
        if (pranayamaState === 'idle' || pranayamaState === 'complete') return 0.75;
        if (pranayamaState === 'paused') return 0.9;
        if (pranayamaPhase === 'Inhale') {
            const total = pranayamaTimer.inhale;
            const elapsed = total - pranayamaSecondsLeft;
            const ratio = elapsed / total;
            return 0.75 + ratio * 0.25; // 0.75 to 1.0
        }
        if (pranayamaPhase === 'Hold') {
            return 1.0;
        }
        // Exhale
        const total = pranayamaTimer.exhale;
        const ratio = pranayamaSecondsLeft / total;
        return 0.75 + ratio * 0.25; // 0.75 to 1.0
    })();


    const [customTransitRituals, setCustomTransitRituals] = useState<Ritual[]>([]);

    useEffect(() => {
        setHydrated(true);
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('ojas_custom_transit_rituals');
            if (stored) {
                try {
                    setCustomTransitRituals(JSON.parse(stored));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, []);



    const { day: cycleDay, phase: cyclePhase } = getCycleStateFromStore(cycle);

    // Synced Herb Rituals
    const { myStack, syncedToRituals } = useHerbStore();

    const timeToMinutes = (timeStr: string): number => {
        const [time, modifier] = timeStr.split(' ');
        if (!time || !modifier) return 0;
        const [hStr, mStr] = time.split(':');
        let hours = Number(hStr);
        const minutes = Number(mStr);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const herbRituals: Ritual[] = (hydrated && syncedToRituals) 
        ? myStack.map(item => {
            const herb = HERBS_DATA.find(h => h.name === item.name);
            const beneficialDoshes = herb ? Object.entries(herb.dosha)
                .filter((entry) => entry[1] === 'beneficial')
                .map((entry) => entry[0]) : [dominantDosha];
            return {
                id: `herb-${item.name.toLowerCase()}`,
                time: item.timeOfDay,
                activity: `Aushadhi Intake: ${item.name}`,
                duration: 5,
                dosha: beneficialDoshes,
                description: herb 
                    ? `Take ${item.dosage} of ${item.name} (${herb.whenToTake}). Best for: ${herb.bestFor.join(', ')}. Note: ${herb.agniNote}.`
                    : `Take ${item.dosage} of ${item.name}.`
            };
        })
        : [];

    const standardRituals: Ritual[] = hydrated ? getRitualsForDosha(dominantDosha, cyclePhase, user?.gender !== 'male' && showPhaseMod) : [];
    const rituals = [...standardRituals, ...herbRituals, ...customTransitRituals].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    const activeCleansePractices: CleansePractice[] = cleanseActive 
        ? [...CLEANSE_PRACTICES, ...herbRituals.map(h => ({
            id: h.id,
            time: h.time,
            duration: String(h.duration),
            activity: h.activity,
            description: h.description,
            dosha: h.dosha,
            cleanseOnly: false,
            planetaryTag: undefined
          })), ...customTransitRituals.map(c => ({
            id: c.id,
            time: c.time,
            duration: String(c.duration),
            activity: c.activity,
            description: c.description,
            dosha: c.dosha,
            cleanseOnly: false,
            planetaryTag: c.planetaryTag
          }))].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
        : [];


    const getDoshaStyles = (doshaName: string) => {
        const name = doshaName.toLowerCase();
        if (name === 'vata') return 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20';
        if (name === 'pitta') return 'bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20';
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    };

    const togglePractice = (id: string) => {
        setCompletedPractices(prev => {
            const next = new Set(prev);
            if (next.has(id)) { next.delete(id); } else { next.add(id); }
            return next;
        });
    };

    const cleanseProgress = Math.round((ACTIVE_CLEANSE_DAY / ACTIVE_CLEANSE_TOTAL) * 100);

    if (!hydrated) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin text-4xl">🌿</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#c06080]/10 relative overflow-hidden transition-colors duration-500">
            {/* Sparkle Twinkle Background */}
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute w-1 h-1 bg-[#c06080]/40 rounded-full top-20 left-10 animate-ping" />
                <div className="absolute w-1.5 h-1.5 bg-[#c06080]/30 rounded-full top-1/4 left-2/3 animate-pulse" />
                <div className="absolute w-1 h-1 bg-[#c06080]/40 rounded-full top-2/3 left-1/5 animate-pulse" />
                <div className="absolute w-1.5 h-1.5 bg-[#c06080]/20 rounded-full top-3/4 left-5/6 animate-ping" />
            </div>

            <div className="relative z-10 flex flex-col justify-between min-h-screen">
                <div>
                    <Header />

                    <main className="max-w-5xl mx-auto px-6 py-10 md:py-16 w-full space-y-12">

                        {/* Return Navigation */}
                        <div className="flex justify-start animate-fade-rise">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition duration-300 text-xs font-mono uppercase tracking-widest cursor-pointer"
                            >
                                ← Return to Dashboard
                            </Link>
                        </div>

                        {/* ── Panchakarma Cleanse Banner ─────────────────────────── */}
                        <div className="animate-fade-rise">
                            <div className="bg-[#1C1C1A] dark:bg-[#111110] rounded-[32px] p-8 md:p-10 text-[#FAF6F0] relative overflow-hidden">
                                {/* Ambient warm glow */}
                                <div className="absolute top-0 right-0 w-72 h-72 bg-[#c06080]/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c06080]/5 rounded-full blur-2xl pointer-events-none" />

                                <div className="relative z-10">
                                    {/* Label */}
                                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-[#c06080] font-bold mb-4">
                                        SEASONAL TRANSITION · GRISHMA
                                    </div>

                                    {/* Heading */}
                                    <h2 className="text-3xl md:text-4xl font-normal font-cormorant text-[#FAF6F0] leading-tight mb-3">
                                        Panchakarma <em className="italic text-[#c06080]">Cleanse</em> Season
                                    </h2>

                                    {/* Subtitle */}
                                    <p className="text-sm text-stone-400 leading-relaxed max-w-xl mb-7">
                                        Your {dominantDosha} constitution enters its quarterly reset. A 7–21 day guided cleanse aligned with the summer transition.
                                    </p>

                                    {/* Season Pills */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {SEASONS.map(s => (
                                            <span
                                                key={s}
                                                className={`px-3.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border transition-colors duration-300 ${
                                                    s === CURRENT_SEASON
                                                        ? 'bg-[#FAF6F0] text-[#1C1C1A] border-[#FAF6F0]'
                                                        : 'bg-transparent text-stone-500 border-stone-700'
                                                }`}
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setCleanseActive(!cleanseActive)}
                                            className="px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#FAF6F0] text-[#1C1C1A] hover:bg-[#c06080] hover:text-white transition-all duration-300 active:scale-[0.98] cursor-pointer"
                                        >
                                            {cleanseActive ? 'END CLEANSE' : 'BEGIN CLEANSE'}
                                        </button>
                                        <button className="px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-transparent border border-stone-600 text-stone-300 hover:border-[#c06080] hover:text-[#c06080] transition-all duration-300 active:scale-[0.98] cursor-pointer">
                                            LEARN MORE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Cleanse Programme Selection ────────────────────────── */}
                        <div className="animate-fade-rise-delay">
                            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-stone-400 font-semibold mb-5">
                                SELECT CLEANSE LENGTH
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {CLEANSE_PROGRAMMES.map(prog => {
                                    const isSelected = selectedCleanse === prog.days;
                                    return (
                                        <button
                                            key={prog.days}
                                            onClick={() => setSelectedCleanse(isSelected ? null : prog.days as CleanseLength)}
                                            className={`text-left rounded-3xl p-6 border transition-all duration-500 cursor-pointer active:scale-[0.98] ${
                                                isSelected
                                                    ? 'bg-[#1C1C1A] dark:bg-[#111110] border-[#1C1C1A] text-[#FAF6F0] shadow-lg'
                                                    : 'bg-white/50 dark:bg-stone-900/60 border-stone-300/40 dark:border-stone-800/80 text-[#1C1917] dark:text-[#FAF6F0] hover:border-[#c06080]/40'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${isSelected ? 'text-[#c06080]' : 'text-[#c06080]'}`}>
                                                    {prog.title}
                                                </span>
                                                {prog.tier === 'premium' && (
                                                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border ${
                                                        isSelected
                                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500'
                                                    }`}>
                                                        ✦ PREMIUM
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-xl font-cormorant italic font-semibold mb-2 ${isSelected ? 'text-[#FAF6F0]' : 'text-stone-800 dark:text-stone-100'}`}>
                                                {prog.subtitle}
                                            </div>
                                            <p className={`text-xs leading-relaxed ${isSelected ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'}`}>
                                                {prog.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Title Hero (below cleanse section) ────────────────── */}
                        <div className="text-center space-y-4 animate-fade-rise">
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#c06080] font-semibold block">
                                Personalized Routines
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-[1.08] tracking-tight">
                                Daily <span className="italic text-[#c06080]">Ritual</span> Sanctuary
                            </h1>
                            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
                                Align your daily clock with the seasonal rhythms, planetary phases, and biological blueprints calibrated specifically for your energy.
                            </p>
                        </div>

                        {/* User Profile Metrics Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-rise-delay">
                            <Card className="flex flex-col justify-center items-center text-center p-6">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-2">Dominant Constitution</span>
                                <span className="text-2xl font-serif italic text-stone-800 dark:text-stone-100 font-semibold">{dominantDosha}</span>
                                <span className="text-[9px] font-mono text-stone-400 mt-1 uppercase">Prakriti Profile</span>
                            </Card>

                            {user?.gender !== 'male' ? (
                                <Card className="flex flex-col justify-center items-center text-center p-6">
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-2">Cycle Phase Synchronization</span>
                                    <span className="text-2xl font-serif italic text-[#c06080] font-semibold">{cycle ? cyclePhase : 'Unsynced'}</span>
                                    <span className="text-[9px] font-mono text-stone-400 mt-1 uppercase">
                                        {cycle ? `Day ${cycleDay} of ${cycle.cycleLengthDays} days` : 'Visit Cycle tab to sync'}
                                    </span>
                                </Card>
                            ) : (
                                <Card className="flex flex-col justify-center items-center text-center p-6">
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-2">Ayurvedic Daily Rhythm</span>
                                    <span className="text-2xl font-serif italic text-stone-800 dark:text-stone-100 font-semibold">Dinacharya</span>
                                    <span className="text-[9px] font-mono text-stone-400 mt-1 uppercase">Dominant Dosha Centered</span>
                                </Card>
                            )}

                            <Card className="flex flex-col justify-center items-center text-center p-6">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-2">Active Recommendations</span>
                                <span className="text-2xl font-serif italic text-stone-800 dark:text-stone-100 font-semibold">
                                    {cleanseActive ? activeCleansePractices.length : rituals.length} Practices
                                </span>

                                <span className="text-[9px] font-mono text-stone-400 mt-1 uppercase">
                                    {cleanseActive ? 'Cleanse Mode' : 'Dynamic schedule'}
                                </span>
                            </Card>
                        </div>

                        {/* Interactive Phase Toggle Banner (women only, hidden in cleanse mode) */}
                        {user?.gender !== 'male' && !cleanseActive && (
                            <div className="bg-[#FAF6F0] dark:bg-stone-900/60 border border-[#1C1917]/5 dark:border-stone-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-fade-rise-delay-2">
                                <div className="space-y-1 max-w-lg text-center md:text-left">
                                    <h3 className="text-base font-serif italic text-stone-900 dark:text-stone-100 font-normal">
                                        Menstrual Phase Adaptability
                                    </h3>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                        When enabled, your daily routines adapt to the energetic, nutritional, and physical requirements of your current phase ({cyclePhase}).
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                                        {showPhaseMod ? 'Sync Active' : 'Offline'}
                                    </span>
                                    <button
                                        onClick={() => setShowPhaseMod(!showPhaseMod)}
                                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out cursor-pointer ${
                                            showPhaseMod ? 'bg-[#c06080]' : 'bg-stone-300 dark:bg-stone-800'
                                        }`}
                                        aria-label="Toggle phase-specific modifications"
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white dark:bg-stone-900 shadow-md transform transition-transform duration-500 ease-in-out ${showPhaseMod ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Active Cleanse: RITUAL SPACE header with progress bar ── */}
                        {cleanseActive && (
                            <motion.div
                                key="cleanse-header"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-[32px] p-6 md:p-8"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#c06080] font-semibold">
                                        PANCHAKARMA · DAY {ACTIVE_CLEANSE_DAY} OF {ACTIVE_CLEANSE_TOTAL} · <span className="animate-pulse">● LIVE SYNC</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">{cleanseProgress}%</span>
                                </div>
                                {/* Progress bar */}
                                <div className="h-1 bg-stone-200/50 dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#c06080] rounded-full transition-all duration-1000"
                                        style={{ width: `${cleanseProgress}%` }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ── Practice Cards (cleanse-specific or regular) ─────────── */}
                        <div className="space-y-6 animate-fade-rise-delay-2">
                            <AnimatePresence mode="popLayout">
                                {cleanseActive ? (
                                    // Cleanse practice cards with tick-off circles
                                    activeCleansePractices.map((practice, idx) => {
                                        const done = completedPractices.has(practice.id);
                                        return (
                                            <motion.div
                                                key={practice.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -15 }}
                                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                            >
                                                <Card className={`w-full border transition-all duration-300 ${done ? 'opacity-60' : 'border-stone-300/40'}`}>
                                                    <div className="flex items-start gap-5">
                                                        {/* Tick-off circle */}
                                                        <button
                                                            onClick={() => togglePractice(practice.id)}
                                                            className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 transition-all duration-300 cursor-pointer flex items-center justify-center ${
                                                                done
                                                                    ? 'bg-[#c06080] border-[#c06080]'
                                                                    : 'border-stone-300 dark:border-stone-600 hover:border-[#c06080]'
                                                            }`}
                                                            aria-label={`Mark ${practice.activity} ${done ? 'incomplete' : 'complete'}`}
                                                        >
                                                            {done && (
                                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>

                                                        {/* Content */}
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <span className="px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#c06080]/10 text-[#c06080] rounded-full">
                                                                    {practice.time}
                                                                </span>
                                                                <span className="px-3 py-1 text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                                                                    ✦ {practice.duration} Mins
                                                                </span>
                                                                {practice.cleanseOnly && (
                                                                    <span className="px-3 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#c06080]/10 border border-[#c06080]/20 text-[#c06080] rounded-full">
                                                                        Cleanse Practice
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className={`text-xl sm:text-2xl font-serif italic font-normal ${done ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                                                                {practice.activity}
                                                            </h3>
                                                            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                                                                {practice.description}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {practice.id === 'nadi' && (
                                                                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20 animate-pulse mr-2">
                                                                        ☿ Mercury Rx · Especially recommended
                                                                    </span>
                                                                )}
                                                                {practice.planetaryTag && (
                                                                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20 mr-2">
                                                                        {practice.planetaryTag}
                                                                    </span>
                                                                )}
                                                                {practice.dosha.map(d => (
                                                                    <span key={d} className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md ${getDoshaStyles(d)}`}>
                                                                        {d}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    // Standard ritual cards (unchanged)
                                    rituals.map((ritual, idx) => {
                                        const hasMod = showPhaseMod && cycle && ritual.phase;
                                        return (
                                            <motion.div
                                                key={ritual.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -15 }}
                                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                            >
                                                <Card
                                                    className={`w-full border transition-all duration-300 ${
                                                        hasMod
                                                            ? 'border-amber-500/20 shadow-[0_4px_25px_-5px_rgba(245,158,11,0.04)] bg-amber-500/[0.01]'
                                                            : 'border-stone-300/40'
                                                    }`}
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                        <div className="space-y-4 flex-1">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <span className="px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#c06080]/10 text-[#c06080] rounded-full">
                                                                    {ritual.time}
                                                                </span>
                                                                <span className="px-3 py-1 text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                                                                    ✦ {ritual.duration} Mins
                                                                </span>
                                                                {hasMod && (
                                                                    <span className="px-3 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-full animate-pulse">
                                                                        {cyclePhase} Modified
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-xl sm:text-2xl font-serif italic text-stone-900 dark:text-stone-100 font-normal">
                                                                {ritual.activity}
                                                            </h3>
                                                            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                                                                {ritual.description}
                                                            </p>
                                                            {ritual.id === 'yoga' && (
                                                                <div className="pt-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            const el = document.getElementById('asana-sanctuary');
                                                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                                        }}
                                                                        className="text-[9px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer select-none"
                                                                    >
                                                                        OPEN ASANA GUIDE →
                                                                    </button>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-wrap gap-2 pt-2">
                                                                {ritual.id === 'nadi' && (
                                                                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20 animate-pulse mr-2">
                                                                        ☿ Mercury Rx · Especially recommended
                                                                    </span>
                                                                )}
                                                                {ritual.planetaryTag && (
                                                                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20 mr-2">
                                                                        {ritual.planetaryTag}
                                                                    </span>
                                                                )}
                                                                {ritual.dosha.map(d => (
                                                                    <span key={d} className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md ${getDoshaStyles(d)}`}>
                                                                        {d}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {ritual.link && (
                                                            <div className="flex-shrink-0 flex items-center self-start md:self-center">
                                                                {ritual.linkType === 'spotify' ? (
                                                                    <a href={ritual.link} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 transition-all duration-300 inline-flex items-center gap-2 active:scale-95">
                                                                        🟢 {ritual.linkText || 'Listen on Spotify'}
                                                                    </a>
                                                                ) : ritual.linkType === 'youtube' ? (
                                                                    <a href={ritual.link} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-600 dark:text-red-400 transition-all duration-300 inline-flex items-center gap-2 active:scale-95">
                                                                        🔴 {ritual.linkText || 'Watch on YouTube'}
                                                                    </a>
                                                                ) : (
                                                                    <a href={ritual.link} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-[#c06080]/10 hover:bg-[#c06080]/20 border border-[#c06080]/25 text-[#c06080] transition-all duration-300 inline-flex items-center gap-2 active:scale-95">
                                                                        ✨ {ritual.linkText || 'Guided Activity'}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ─── SECTION 1: PRANAYAMA TIMER ───────────────────────────── */}
                        <div className="border-t border-stone-200/30 dark:border-stone-850 my-16 md:my-20" />
                        
                        <section id="pranayama-sanctuary" className="space-y-8 animate-fade-rise">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c06080] font-bold block mb-3">
                              BREATH SANCTUARY · PRANAYAMA
                            </span>
                            <h2 className="text-3xl md:text-4xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
                              Guided Breath <span className="font-cormorant italic text-[#c06080]">Practice</span>
                            </h2>
                            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed mt-2">
                              Breathing patterns calibrated for your Vata constitution to settle the nervous system and anchor your energy.
                            </p>
                          </div>

                          {/* Technique selector grid */}
                          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                            {PRANAYAMA_TECHNIQUES.map((tech) => {
                              const isActive = pranayamaTimer.id === tech.id;
                              return (
                                <button
                                  key={tech.id}
                                  onClick={() => handleSelectTechnique(tech)}
                                  className={`text-left rounded-3xl p-5 border min-w-[240px] transition-all duration-500 cursor-pointer active:scale-[0.98] ${
                                    isActive
                                      ? 'bg-[#1C1C1A] dark:bg-[#111110] border-[#1C1C1A] text-[#FAF6F0] shadow-lg'
                                      : 'bg-white dark:bg-stone-900 border-stone-300/40 dark:border-stone-800/80 text-[#1C1917] dark:text-[#FAF6F0] hover:border-[#c06080]/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-cormorant italic text-lg font-semibold">{tech.name}</span>
                                    <span className="text-[9px] font-mono text-stone-400">Ratio: {tech.ratio}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {tech.doshas.map(d => {
                                      const dClean = d.replace(/[+\s]/g, '').toLowerCase();
                                      let pillColor = 'bg-stone-105 dark:bg-stone-800 text-stone-400';
                                      if (dClean === 'vata') pillColor = 'bg-blue-500/10 text-blue-500 border border-blue-500/10';
                                      else if (dClean === 'pitta') pillColor = 'bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/10';
                                      else if (dClean === 'kapha') pillColor = 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10';
                                      return (
                                        <span key={d} className={`px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider rounded ${pillColor}`}>
                                          {d}
                                        </span>
                                      );
                                    })}
                                  </div>
                                  <p className={`text-[11px] leading-normal ${isActive ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'}`}>
                                    {tech.tagline} · {tech.effect}
                                  </p>
                                </button>
                              );
                            })}
                          </div>

                          {/* Session Length selector */}
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-semibold mr-2">Session length:</span>
                            {[5, 10, 15, 20, 30].map(mins => (
                              <button
                                key={mins}
                                onClick={() => {
                                  setPranayamaMinutes(mins);
                                  handleResetPranayama();
                                }}
                                className={`px-4.5 py-2 rounded-full border text-[9px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                                  pranayamaMinutes === mins
                                    ? 'bg-[#c06080] text-white border-[#c06080]'
                                    : 'bg-white/50 dark:bg-stone-900/40 border-stone-300/40 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-[#c06080]/40 hover:text-[#c06080]'
                                }`}
                              >
                                {mins} MIN
                              </button>
                            ))}
                          </div>

                          {/* Breathing timer widget */}
                          <div className="grid md:grid-cols-12 gap-8 items-stretch">
                            
                            {/* The Timer Card */}
                            <div className="md:col-span-8">
                              <Card className="flex flex-col items-center justify-center py-10 px-6 relative overflow-hidden min-h-[460px]">
                                {pranayamaState === 'complete' ? (
                                  // Post session card
                                  <div className="text-center space-y-6 max-w-md w-full animate-fade-rise">
                                    <span className="text-4xl block">✨</span>
                                    <h3 className="text-2xl font-serif italic text-stone-900 dark:text-stone-100 font-normal">
                                      Practice complete.
                                    </h3>
                                    <div className="bg-[#FDF6EC]/30 dark:bg-stone-950/20 border border-stone-200/50 dark:border-stone-800/80 rounded-2xl p-5 text-left space-y-2.5">
                                      <div className="text-xs text-stone-700 dark:text-stone-300 flex justify-between font-mono">
                                        <span>Technique</span>
                                        <span className="font-semibold">{pranayamaTimer.name}</span>
                                      </div>
                                      <div className="text-xs text-stone-700 dark:text-stone-300 flex justify-between font-mono">
                                        <span>Duration</span>
                                        <span className="font-semibold">{pranayamaMinutes} Mins</span>
                                      </div>
                                      <div className="text-xs text-stone-700 dark:text-stone-300 flex justify-between font-mono">
                                        <span>Rounds completed</span>
                                        <span className="font-semibold">{pranayamaRounds - 1}</span>
                                      </div>
                                      <div className="border-t border-stone-200/40 dark:border-stone-800/40 pt-3 text-[11px] text-[#c06080] leading-relaxed italic">
                                        {pranayamaTimer.id === 'nadi_shodhana' && "Nadi Shodhana calmed your Vata nervous system. Ideal before focused work or sleep."}
                                        {pranayamaTimer.id === 'bhramari' && "Bhramari hummed away Vata restlessness. Your mind is quiet and centered."}
                                        {pranayamaTimer.id === 'sheetali' && "Sheetali cooled Pitta heat. Ideal to reduce acidity, anger, or irritability."}
                                        {pranayamaTimer.id === 'bhastrika' && "Bhastrika energized your Kapha body. Sluggishness has been cleared."}
                                        {pranayamaTimer.id === 'ujjayi' && "Ujjayi grounded your Vata mind and warmed your respiratory channels."}
                                        {pranayamaTimer.id === 'kapalbhati' && "Kapalbhati cleared Kapha congestion and ignited your Agni."}
                                      </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                      <button
                                        onClick={handleLogPranayama}
                                        className="px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1C1A] text-white hover:bg-[#c06080] transition duration-300 cursor-pointer active:scale-95 w-full sm:w-auto"
                                      >
                                        LOG TO RITUALS
                                      </button>
                                      <button
                                        onClick={handleResetPranayama}
                                        className="text-[10px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                                      >
                                        PRACTICE AGAIN
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  // Active timer widget
                                  <div className="flex flex-col items-center justify-between h-full w-full space-y-8 animate-fade-rise">
                                    
                                    {/* Animated breathing circle */}
                                    <div className="relative w-56 h-56 flex items-center justify-center">
                                      
                                      {/* Outer Ring */}
                                      <div
                                        className="absolute inset-0 rounded-full border-[6px]"
                                        style={{
                                          transform: `scale(${scaleValue})`,
                                          borderColor: pranayamaState === 'idle' 
                                            ? '#E6DFD5' 
                                            : pranayamaPhase === 'Inhale' 
                                              ? '#C4603A' 
                                              : pranayamaPhase === 'Hold' 
                                                ? '#D4A373' 
                                                : '#9CA986',
                                          transition: pranayamaState === 'breathing' ? 'transform 1.05s linear, border-color 0.5s ease' : 'transform 0.4s ease, border-color 0.4s ease'
                                        }}
                                      />
                                      
                                      {/* Inner text container */}
                                      <div className="z-10 text-center space-y-1">
                                        <div className="font-cormorant text-2xl italic font-normal text-stone-850 dark:text-stone-100">
                                          {pranayamaState === 'idle' ? 'Ready' : pranayamaPhase}
                                        </div>
                                        <div className="font-cormorant text-4xl font-semibold text-[#1C1917] dark:text-[#FAF6F0]">
                                          {pranayamaState === 'idle' ? `${pranayamaTimer.inhale}s` : `${pranayamaSecondsLeft}s`}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Stats & Controls */}
                                    <div className="text-center space-y-4 w-full">
                                      <div className="flex justify-center gap-6 text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
                                        <span>ROUND {pranayamaRounds} OF {maxRounds}</span>
                                        <span>·</span>
                                        <span>
                                          {Math.floor(pranayamaElapsed / 60).toString().padStart(2, '0')}:
                                          {Math.floor(pranayamaElapsed % 60).toString().padStart(2, '0')} elapsed
                                        </span>
                                      </div>

                                      {/* Controls row */}
                                      <div className="flex justify-center items-center gap-3">
                                        <button
                                          onClick={handlePrevRound}
                                          disabled={pranayamaState === 'idle'}
                                          className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-800 text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500 hover:border-[#c06080] hover:text-[#c06080] transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                          ← PREV ROUND
                                        </button>
                                        
                                        <button
                                          onClick={() => {
                                            if (pranayamaState === 'idle') {
                                              setPranayamaState('breathing');
                                              setPranayamaSecondsLeft(pranayamaTimer.inhale);
                                            } else {
                                              handleTogglePlay();
                                            }
                                          }}
                                          className="px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1C1A] text-[#FAF6F0] hover:bg-[#c06080] hover:text-white transition active:scale-95 cursor-pointer"
                                        >
                                          {pranayamaState === 'idle' ? 'START' : pranayamaState === 'breathing' ? 'PAUSE' : 'RESUME'}
                                        </button>
                                        
                                        <button
                                          onClick={handleNextRound}
                                          disabled={pranayamaState === 'idle'}
                                          className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-800 text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500 hover:border-[#c06080] hover:text-[#c06080] transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                          NEXT ROUND →
                                        </button>
                                      </div>

                                      <div className="flex justify-center gap-4 text-[9px] font-mono uppercase tracking-wider">
                                        <button onClick={handleResetPranayama} className="text-[#c06080] border-b border-[#c06080]/20 hover:text-stone-900 dark:hover:text-white cursor-pointer select-none">
                                          CHANGE TECHNIQUE
                                        </button>
                                        <span className="text-stone-300">|</span>
                                        <button onClick={handleResetPranayama} className="text-[#c06080] border-b border-[#c06080]/20 hover:text-stone-900 dark:hover:text-white cursor-pointer select-none">
                                          CHANGE DURATION
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Card>
                            </div>

                            {/* Audio pairing sidebar */}
                            <div className="md:col-span-4">
                              <Card className="h-full flex flex-col justify-between p-6 min-h-[220px]">
                                <div className="space-y-4">
                                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#c06080] font-bold">
                                    FREQUENCY PAIRING · ACTIVE
                                  </div>
                                  <h4 className="font-cormorant italic text-2xl text-stone-900 dark:text-[#FAF6F0] leading-tight">
                                    {pranayamaTimer.trackName}
                                  </h4>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-normal">
                                    {pranayamaTimer.trackArtist} · {pranayamaTimer.trackFrequency}
                                  </p>
                                  
                                  {/* Status Indicator */}
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-wider uppercase bg-[#c06080]/10 text-[#c06080] border border-[#c06080]/20 animate-pulse">
                                    ● ACTIVE SYNC
                                  </span>
                                </div>

                                <div className="pt-6 border-t border-stone-200/20 dark:border-stone-800 space-y-4">
                                  {/* Audio toggle */}
                                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-stone-400 font-semibold">
                                    <span>Audio Sync Status</span>
                                    <button
                                      onClick={() => setPranayamaAudio(!pranayamaAudio)}
                                      className={`px-3 py-1 rounded-full border transition cursor-pointer ${
                                        pranayamaAudio
                                          ? 'bg-[#c06080]/10 border-[#c06080]/20 text-[#c06080]'
                                          : 'border-stone-300 dark:border-stone-850 text-stone-500'
                                      }`}
                                    >
                                      AUDIO {pranayamaAudio ? 'ON' : 'OFF'}
                                    </button>
                                  </div>

                                  <Link
                                    href="/music"
                                    className="text-[9px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition block w-fit"
                                  >
                                    CHANGE FREQUENCY →
                                  </Link>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </section>

                        {/* ─── SECTION 2: YOGA ASANA PRACTICE ─────────────────────────────── */}
                        <div className="border-t border-stone-200/30 dark:border-stone-850 my-16 md:my-20" />
                        
                        <section id="asana-sanctuary" className="space-y-8 animate-fade-rise">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c06080] font-bold block mb-3">
                              ASANA SANCTUARY · DOSHA YOGA
                            </span>
                            <h2 className="text-3xl md:text-4xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
                              Your Yoga <span className="font-cormorant italic text-[#c06080]">Practice</span>
                            </h2>
                            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed mt-2">
                              Asanas selected and sequenced specifically for your Vata constitution to restore balance, ground scattered energy, and build strength without depletion.
                            </p>
                          </div>

                          {/* Dosha Filter tabs */}
                          <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-none">
                            {(['VATA', 'PITTA', 'KAPHA'] as const).map(tab => {
                              const labelMap = { VATA: 'VATA BALANCE', PITTA: 'PITTA COOLING', KAPHA: 'KAPHA ENERGISING' };
                              const isActive = activeYogaTab === tab;
                              return (
                                <button
                                  key={tab}
                                  onClick={() => {
                                    setActiveYogaTab(tab);
                                    setCompletedAsanas(new Set()); // reset completion when changing tabs
                                    setActivePoseIndex(null);
                                  }}
                                  className={`px-5 py-2.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                                    isActive
                                      ? 'bg-[#1C1917] text-[#FAF6F0] border-[#1C1917] dark:bg-[#FAF6F0] dark:text-[#12100E] dark:border-[#FAF6F0] shadow-sm'
                                      : 'bg-transparent border-stone-300 dark:border-stone-700 text-stone-500 hover:border-[#c06080] hover:text-[#c06080]'
                                  }`}
                                >
                                  {labelMap[tab]}
                                </button>
                              );
                            })}
                          </div>

                          {/* Active posture HUD (shown when sequence is in progress) */}
                          {activePoseIndex !== null && (
                            <Card className="bg-[#1C1C1A] text-white p-6 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-rise border-none relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c06080]/10 rounded-full blur-2xl pointer-events-none" />
                              <div className="relative z-10 text-center md:text-left space-y-1">
                                <span className="text-[9px] font-mono text-[#c06080] uppercase tracking-widest block font-bold">
                                  ACTIVE YOGA PRACTICE FLOW
                                </span>
                                <span className="text-xl font-serif italic text-stone-200 block">
                                  {activePoseIndex + 1}. {YOGA_SEQUENCES[activeYogaTab][activePoseIndex].name}
                                </span>
                                <span className="text-[10px] font-mono text-stone-400 block uppercase">
                                  Duration: {YOGA_SEQUENCES[activeYogaTab][activePoseIndex].durationMin} Mins · {YOGA_SEQUENCES[activeYogaTab][activePoseIndex].sanskritName}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 relative z-10">
                                <button
                                  onClick={() => setActivePoseIndex(prev => prev! > 0 ? prev! - 1 : null)}
                                  className="px-5 py-2.5 border border-stone-700 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-stone-300 hover:text-white hover:border-stone-500 transition cursor-pointer"
                                >
                                  ← PREV
                                </button>
                                <button
                                  onClick={() => {
                                    const curAsana = YOGA_SEQUENCES[activeYogaTab][activePoseIndex];
                                    setCompletedAsanas(prev => {
                                      const next = new Set(prev);
                                      next.add(curAsana.id);
                                      return next;
                                    });
                                    if (activePoseIndex < 9) {
                                      setActivePoseIndex(activePoseIndex + 1);
                                    } else {
                                      setActivePoseIndex(null); // sequence finished!
                                    }
                                  }}
                                  className="px-6 py-2.5 bg-[#c06080] rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-white hover:bg-[#C4603A] transition cursor-pointer shadow-md"
                                >
                                  {activePoseIndex === 9 ? '✓ FINISH' : 'NEXT POSE →'}
                                </button>
                              </div>
                            </Card>
                          )}

                          {/* Asanas list of 10 poses */}
                          <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                            {YOGA_SEQUENCES[activeYogaTab].map((asana, idx) => {
                              const done = completedAsanas.has(asana.id);
                              const isActive = activePoseIndex === idx;
                              return (
                                <Card
                                  key={asana.id}
                                  className={`w-full border transition-all duration-300 ${
                                    done 
                                      ? 'opacity-60 border-stone-200/40' 
                                      : isActive 
                                        ? 'border-[#c06080] shadow-[0_4px_25px_-5px_rgba(194,122,93,0.1)]' 
                                        : 'border-stone-300/40'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                                    <div className="flex items-start gap-4 flex-1">
                                      {/* Tick off circle */}
                                      <button
                                        onClick={() => toggleAsana(asana.id)}
                                        className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 transition-all duration-300 cursor-pointer flex items-center justify-center ${
                                          done
                                            ? 'bg-[#c06080] border-[#c06080]'
                                            : 'border-stone-300 dark:border-stone-600 hover:border-[#c06080]'
                                        }`}
                                        aria-label={`Mark ${asana.name} ${done ? 'incomplete' : 'complete'}`}
                                      >
                                        {done && (
                                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </button>

                                      {/* Content */}
                                      <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                          <span className="px-3.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase bg-[#c06080]/10 text-[#c06080] rounded-full">
                                            {asana.durationMin.toString().padStart(2, '0')} MIN
                                          </span>
                                          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                                            {asana.sanskritName}
                                          </span>
                                        </div>
                                        <h3 className={`text-xl sm:text-2xl font-serif italic font-normal ${done ? 'line-through text-stone-450' : 'text-stone-900 dark:text-stone-100'}`}>
                                          {asana.name}
                                        </h3>
                                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-2xl">
                                          {asana.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                          {asana.doshaTags.map(tag => (
                                            <span key={tag} className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-md ${getDoshaStyles(tag.replace(/[+\s]/g, ''))}`}>
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right side: Line art SVG and Begin Pose trigger */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4 self-stretch sm:self-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-200/40 dark:border-stone-850">
                                      <div className="bg-white/40 dark:bg-stone-900/40 border border-stone-300/20 dark:border-stone-800 rounded-2xl p-2.5">
                                        <PoseIcon id={asana.id} />
                                      </div>
                                      <button
                                        onClick={() => setActivePoseIndex(idx)}
                                        className="text-[9px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition w-fit cursor-pointer select-none"
                                      >
                                        BEGIN POSE →
                                      </button>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>

                          {/* Full Practice flow card */}
                          <div className="pt-6">
                            <Card className="p-6 md:p-8">
                              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#c06080] mb-4 font-bold">
                                TODAY&apos;S FULL PRACTICE · {activeYogaTab} SEQUENCE
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                                <div>
                                  <h3 className="font-cormorant italic text-3xl text-stone-900 dark:text-[#FAF6F0] font-normal">
                                    Complete Vata Sequence Flow
                                  </h3>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-normal mt-1.5 max-w-md">
                                    Follow all 10 asanas chronologically to reset apana vayu, ground instability, and center the mind.
                                  </p>
                                </div>
                                {/* Total Duration pill */}
                                <div className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-800 text-[10px] font-mono font-bold uppercase tracking-widest text-[#c06080] bg-[#FDF6EC]/30 dark:bg-stone-950/20">
                                  Total duration: {YOGA_SEQUENCES[activeYogaTab].reduce((acc, curr) => acc + curr.durationMin, 0)} MINS
                                </div>
                              </div>

                              {/* Horizontal Progress Timeline */}
                              <div className="relative py-8 px-4 flex justify-between items-center w-full">
                                {/* Timeline background line */}
                                <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-stone-200 dark:bg-stone-800 z-0 transform -translate-y-1/2" />
                                
                                {YOGA_SEQUENCES[activeYogaTab].map((asana, idx) => {
                                  const isDone = completedAsanas.has(asana.id);
                                  const isCurrent = activePoseIndex === idx;
                                  return (
                                    <div key={asana.id} className="relative z-10 flex flex-col items-center group">
                                      {/* Timeline dot */}
                                      <button
                                        onClick={() => setActivePoseIndex(idx)}
                                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                                          isCurrent
                                            ? 'bg-[#c06080] border-[#c06080] scale-125'
                                            : isDone
                                              ? 'bg-emerald-500 border-emerald-500'
                                              : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 hover:border-[#c06080]'
                                        }`}
                                        title={asana.name}
                                      />
                                      {/* Tooltip on hover */}
                                      <span className="absolute bottom-6 bg-stone-900 text-white text-[9px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none uppercase tracking-wider">
                                        {asana.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Action buttons */}
                              <div className="flex flex-wrap gap-3 pt-6 border-t border-stone-200/20 dark:border-stone-850">
                                <button
                                  onClick={() => setActivePoseIndex(0)}
                                  className="px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1C1A] text-white hover:bg-[#c06080] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                                >
                                  BEGIN FULL PRACTICE
                                </button>
                                <button
                                  onClick={() => {
                                    setCompletedAsanas(new Set(YOGA_SEQUENCES[activeYogaTab].map(a => a.id)));
                                  }}
                                  className="px-7 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-transparent border border-stone-400 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-[#c06080] hover:text-[#c06080] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                                >
                                  CUSTOM SEQUENCE
                                </button>
                              </div>
                            </Card>
                          </div>
                        </section>

                      {/* ── Cleanse Dietary Lock (only when cleanse active) ─────── */}
                        {cleanseActive && (
                            <motion.div
                                key="cleanse-diet"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card>
                                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#c06080] mb-1 font-semibold">
                                        AAHAR · CLEANSE MODE
                                    </div>
                                    <h3 className="font-cormorant italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal mb-6">
                                        Cleanse Diet Protocol
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Favour column */}
                                        <div>
                                            <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-3 font-semibold">
                                                ✓ FAVOUR
                                            </div>
                                            <ul className="space-y-2">
                                                {FAVOUR_FOODS.map(f => (
                                                    <li key={f} className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#c06080] flex-shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Avoid column */}
                                        <div>
                                            <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-3 font-semibold">
                                                ✗ AVOID
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {AVOID_FOODS.map(f => (
                                                    <span key={f} className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/40 text-red-600 dark:text-red-400">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-stone-200/20 dark:border-stone-800">
                                        <Link
                                            href="/aahar"
                                            className="text-[10px] font-mono uppercase tracking-wider text-[#c06080] border-b border-[#c06080]/30 hover:text-stone-900 dark:hover:text-white transition-colors"
                                        >
                                            OPEN FULL CLEANSE DIET GUIDE →
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* ── Agni Check-in (only when cleanse active) ───────────── */}
                        {cleanseActive && (
                            <motion.div
                                key="agni-checkin"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <Card>
                                    <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#c06080] mb-1 font-semibold">
                                        AGNI CHECK-IN · TODAY
                                    </div>
                                    <h3 className="font-cormorant italic text-2xl text-stone-900 dark:text-[#FAF6F0] font-normal mb-6">
                                        How is your digestion today?
                                    </h3>

                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {([
                                            { id: 'sharp',     label: 'Sharp & Clear', icon: '🔥' },
                                            { id: 'slow',      label: 'Slow & Heavy',  icon: '🌫️' },
                                            { id: 'irregular', label: 'Irregular',     icon: '〰️' },
                                        ] as { id: AgniState; label: string; icon: string }[]).map(opt => (
                                            <button
                                                key={opt.id!}
                                                onClick={() => setAgni(agni === opt.id ? null : opt.id)}
                                                className={`flex items-center gap-2 px-5 py-3 rounded-full border text-xs font-mono font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                                                    agni === opt.id
                                                        ? 'bg-[#1C1917] text-[#F4EFEA] border-[#1C1917] dark:bg-[#c06080] dark:border-[#c06080]'
                                                        : 'bg-white/50 dark:bg-stone-900/40 border-stone-300/60 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-[#c06080]/60 hover:text-[#c06080]'
                                                }`}
                                            >
                                                {opt.icon} {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    {agni && (
                                        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-5 font-semibold">
                                            ✓ Logged
                                        </div>
                                    )}

                                    {/* Affirmation */}
                                    <div className="border-l border-[#c06080]/30 pl-5 py-1">
                                        <p className="font-cormorant italic text-xl text-stone-700 dark:text-stone-300 leading-relaxed">
                                            &ldquo;Purification is not deprivation — it is returning to your original self.&rdquo;
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                    </main>
                </div>

                {/* Footer */}
                <footer className="w-full max-w-5xl mx-auto px-6 pb-6 pt-10 border-t border-[#1C1917]/5 dark:border-stone-800 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-500 tracking-wider">
                    <div>DOMINANT DOSHA / {dominantDosha.toUpperCase()}{cleanseActive ? ' · PANCHAKARMA ACTIVE' : ''}</div>
                    <div>© OJAS RITUAL MMXXVI</div>
                </footer>
            </div>
        </div>
    );
}
