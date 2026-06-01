'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

interface QuestionOption {
    text: string;
    dosha: string;
}

interface AssessmentQuestion {
    id: number;
    category: string;
    text: string;
    options: QuestionOption[];
}

const QUESTIONS: AssessmentQuestion[] = [
    {
        id: 1,
        category: "Body · Frame",
        text: "What is your natural body frame?",
        options: [
            { text: "Thin, light bones, hard to gain weight", dosha: "vata" },
            { text: "Medium build, muscular, easy to tone", dosha: "pitta" },
            { text: "Heavier, broad frame, gains weight easily", dosha: "kapha" }
        ]
    },
    {
        id: 2,
        category: "Body · Skin",
        text: "How would you describe your skin?",
        options: [
            { text: "Dry, thin, rough, tends to crack", dosha: "vata" },
            { text: "Warm, sensitive, prone to rashes", dosha: "pitta" },
            { text: "Smooth, cool, oily, thick", dosha: "kapha" }
        ]
    },
    {
        id: 3,
        category: "Metabolism · Digestion",
        text: "What is your typical digestion like?",
        options: [
            { text: "Variable, easily bloated, irregular", dosha: "vata" },
            { text: "Strong, quick to hunger, sharp", dosha: "pitta" },
            { text: "Slow, heavy feeling after eating", dosha: "kapha" }
        ]
    },
    {
        id: 4,
        category: "Metabolism · Temperature",
        text: "How do you feel about temperature?",
        options: [
            { text: "Always cold, prefer warmth", dosha: "vata" },
            { text: "Heat bothers me, prefer cool", dosha: "pitta" },
            { text: "Comfortable in most temperatures", dosha: "kapha" }
        ]
    },
    {
        id: 5,
        category: "Mind · Sleep",
        text: "What is your typical sleep pattern?",
        options: [
            { text: "Light, easily disturbed, wakes often", dosha: "vata" },
            { text: "Moderate, falls asleep easily", dosha: "pitta" },
            { text: "Deep, heavy, sleeps long hours", dosha: "kapha" }
        ]
    },
    {
        id: 6,
        category: "Mind · Memory",
        text: "How is your memory?",
        options: [
            { text: "Quick to learn, quick to forget", dosha: "vata" },
            { text: "Sharp, analytical, retains well", dosha: "pitta" },
            { text: "Slow to learn, excellent recall", dosha: "kapha" }
        ]
    },
    {
        id: 7,
        category: "Body · Energy",
        text: "What is your natural energy level?",
        options: [
            { text: "Bursts of energy, then crashes", dosha: "vata" },
            { text: "Moderate, consistent energy", dosha: "pitta" },
            { text: "Steady, slow to start but enduring", dosha: "kapha" }
        ]
    },
    {
        id: 8,
        category: "Mind · Stress",
        text: "How do you handle stress?",
        options: [
            { text: "Anxious, worried, overthinking", dosha: "vata" },
            { text: "Irritable, impatient, intense", dosha: "pitta" },
            { text: "Withdrawn, avoidant, heavy", dosha: "kapha" }
        ]
    },
    {
        id: 9,
        category: "Body · Hair",
        text: "What is your typical hair texture?",
        options: [
            { text: "Dry, brittle, frizzy", dosha: "vata" },
            { text: "Fine, straight, prone to graying", dosha: "pitta" },
            { text: "Thick, oily, lustrous", dosha: "kapha" }
        ]
    },
    {
        id: 10,
        category: "Metabolism · Appetite",
        text: "How is your appetite?",
        options: [
            { text: "Irregular, sometimes skip meals", dosha: "vata" },
            { text: "Strong, gets irritable if delayed", dosha: "pitta" },
            { text: "Steady, can skip meals easily", dosha: "kapha" }
        ]
    },
    {
        id: 11,
        category: "Body · Pace",
        text: "What is your natural walking pace?",
        options: [
            { text: "Fast, quick, light steps", dosha: "vata" },
            { text: "Purposeful, moderate pace", dosha: "pitta" },
            { text: "Slow, steady, relaxed", dosha: "kapha" }
        ]
    },
    {
        id: 12,
        category: "Mind · Speech",
        text: "How do you speak?",
        options: [
            { text: "Fast, lots of words, enthusiastic", dosha: "vata" },
            { text: "Sharp, clear, direct", dosha: "pitta" },
            { text: "Slow, calm, few words", dosha: "kapha" }
        ]
    },
    {
        id: 13,
        category: "Environment · Climate",
        text: "What is your ideal climate?",
        options: [
            { text: "Warm, humid", dosha: "vata" },
            { text: "Cool, dry", dosha: "pitta" },
            { text: "Warm, dry", dosha: "kapha" }
        ]
    },
    {
        id: 14,
        category: "Body · Joints",
        text: "How are your joints?",
        options: [
            { text: "Crack, pop, prone to stiffness", dosha: "vata" },
            { text: "Flexible, moderate", dosha: "pitta" },
            { text: "Strong, stable, well-built", dosha: "kapha" }
        ]
    },
    {
        id: 15,
        category: "Mind · Emotion",
        text: "What is your emotional nature?",
        options: [
            { text: "Enthusiastic, changeable, creative", dosha: "vata" },
            { text: "Passionate, determined, focused", dosha: "pitta" },
            { text: "Calm, loving, patient", dosha: "kapha" }
        ]
    },
    {
        id: 16,
        category: "Mind · Decisiveness",
        text: "How do you make decisions?",
        options: [
            { text: "Quickly, impulsively, change mind", dosha: "vata" },
            { text: "Decisively, logically, stick to it", dosha: "pitta" },
            { text: "Slowly, carefully, rarely change", dosha: "kapha" }
        ]
    },
    {
        id: 17,
        category: "Social · Interaction",
        text: "What is your social style?",
        options: [
            { text: "Many friends, light connections", dosha: "vata" },
            { text: "Few close friends, intense bonds", dosha: "pitta" },
            { text: "Small circle, deeply loyal", dosha: "kapha" }
        ]
    },
    {
        id: 18,
        category: "Behavior · Habits",
        text: "How do you handle finances?",
        options: [
            { text: "Spontaneous, impulsive spending", dosha: "vata" },
            { text: "Planned, goal-oriented saving", dosha: "pitta" },
            { text: "Cautious, steady accumulation", dosha: "kapha" }
        ]
    }
];

const VEDIC_FACTS: Record<number, string> = {
    1: "Ancient wisdom teaches that your skeleton and bone structure represents the core grounding capacity of Earth (Kapha) vs Air (Vata).",
    2: "Your skin reflects inner metabolic fire (Agni). Prone to sensitivity? That indicates active Pitta circulation.",
    3: "Digestion is the cornerstone of life force. Variable digestive patterns show the light, moving traits of Vata vayu.",
    4: "Reaction to warmth or cold indicates your biological thermostat. Strong heat intolerance points to active fire element (Pitta).",
    5: "Deep, unbroken sleep signals a grounded mind (Tamas/Kapha), while hyper-active light sleep reflects mobile thoughts (Vata).",
    6: "Memory recall showcases intellect speed. Analytical, quick-retaining memory is the focus of Pitta intelligence.",
    7: "Vigor flows dynamically. Burst-and-crash states reflect Vata electricity, whereas Kapha boasts natural enduring stamina.",
    8: "Under high pressure, Vata scatters with worry, Pitta focuses into fiery determination, and Kapha retreats into slow calm.",
    9: "Thick, oily hair texture mirrors active shleshaka kapha—the bodily fluids responsible for deep cell nourishment.",
    10: "Strong, sharp hunger indicators show active digestive acids, which require cooling nutrients to protect Pitta organs.",
    11: "Pace of movement correlates directly with internal nerve speed. Fast, energetic strides show high Vata activation.",
    12: "Expressive vocal flow and high word speed indicate active communication pathways ruled by ether and sound space.",
    13: "Sensing alignment in warm, humid weather shows that your nature benefits from moisture, which naturally balances Vata dry winds.",
    14: "Smooth, quiet joints mirror clean synovial fluids. Joint friction or clicking indicates structural dry air (Vata).",
    15: "Your emotional temperament mirrors conscious energy. Pure patience and calm demonstrate high Sattva (Kapha).",
    16: "Highly logical decision paths represent clear buddhi (discernment) in action, propelled by Pitta transformation.",
    17: "Deep, quiet social circles show highly cohesive elements of Earth and Water that treasure lasting structural roots.",
    18: "Financial conservation shows stable preservation skills (Kapha), while immediate impulse purchases showcase Vata flow."
};

export const PrakritiAssessment = () => {
    const { setAssessmentAnswer, setDoshaComposition, setCurrentStep } = useUserStore();
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    // Load progress from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedProgress = localStorage.getItem('prakriti_quiz_progress');
            const savedAnswers = localStorage.getItem('prakriti_quiz_answers');
            if (savedProgress && savedAnswers) {
                const parsedProgress = parseInt(savedProgress);
                // Only load if progress is valid
                if (parsedProgress >= 0 && parsedProgress < QUESTIONS.length) {
                    setCurrentQ(parsedProgress);
                    setAnswers(JSON.parse(savedAnswers));
                }
            }
        }
    }, []);

    const saveProgress = (qIndex: number, currentAnswers: Record<number, string>) => {
        localStorage.setItem('prakriti_quiz_progress', qIndex.toString());
        localStorage.setItem('prakriti_quiz_answers', JSON.stringify(currentAnswers));
    };

    const handleAnswer = (dosha: string) => {
        const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: dosha };
        setAnswers(newAnswers);
        setAssessmentAnswer(QUESTIONS[currentQ].id.toString(), dosha);

        if (currentQ + 1 < QUESTIONS.length) {
            const nextQ = currentQ + 1;
            setCurrentQ(nextQ);
            saveProgress(nextQ, newAnswers);
        } else {
            // Calculate results
            const counts = { vata: 0, pitta: 0, kapha: 0 };
            Object.values(newAnswers).forEach((d) => {
                if (d === 'vata') counts.vata++;
                if (d === 'pitta') counts.pitta++;
                if (d === 'kapha') counts.kapha++;
            });

            const total = counts.vata + counts.pitta + counts.kapha;
            const composition = {
                vata: Math.round((counts.vata / total) * 100),
                pitta: Math.round((counts.pitta / total) * 100),
                kapha: Math.round((counts.kapha / total) * 100),
            };

            const dominant = Object.entries(composition).reduce((a, b) => a[1] > b[1] ? a : b)[0];

            // Wipe progress on perfect completion
            if (typeof window !== 'undefined') {
                localStorage.removeItem('prakriti_quiz_progress');
                localStorage.removeItem('prakriti_quiz_answers');
            }

            setDoshaComposition(composition, dominant.charAt(0).toUpperCase() + dominant.slice(1));
            setCurrentStep('result');
        }
    };

    const handleBack = () => {
        if (currentQ > 0) {
            const prevQ = currentQ - 1;
            setCurrentQ(prevQ);
            saveProgress(prevQ, answers);
        }
    };

    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
    const question = QUESTIONS[currentQ];
    const vedicFact = VEDIC_FACTS[question.id] || "Ancient Ayurvedic practices balance your mind and body frame.";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[#F4EFEA] text-[#1C1917] selection:bg-[#c06080]/10">
            <div className="max-w-2xl w-full">
                {/* Progress Header */}
                <div className="mb-6 sm:mb-8 animate-fade-rise">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-stone-400 mb-2">
                        <span>Discover Your Prakriti</span>
                        <span className="font-semibold text-stone-600">{currentQ + 1} / {QUESTIONS.length}</span>
                    </div>
                    <div className="h-1.5 bg-stone-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c06080] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Question Box */}
                <div className="bg-white/90 border border-stone-200/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl animate-fade-rise-delay flex flex-col justify-between min-h-[500px]">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-[#c06080] font-bold">
                                {question.category}
                            </span>
                            <span className="text-[9px] md:text-[10px] font-mono text-stone-400 font-semibold bg-stone-100 px-2 py-0.5 rounded-md uppercase">
                                Q{currentQ + 1} of {QUESTIONS.length}
                            </span>
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-stone-900 mb-6 sm:mb-8 font-normal leading-relaxed md:leading-tight">
                            {question.text}
                        </h2>

                        <div className="space-y-3 sm:space-y-4">
                          {question.options.map((opt, idx) => {
                              const isSelected = answers[question.id] === opt.dosha;
                              return (
                                  <button
                                      key={idx}
                                      onClick={() => handleAnswer(opt.dosha)}
                                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 font-serif italic text-base sm:text-lg shadow-sm hover:translate-x-1 cursor-pointer leading-normal sm:leading-relaxed ${
                                          isSelected 
                                          ? 'border-[#c06080] bg-[#FAF6F0]/45 text-stone-950 ring-1 ring-[#c06080]/30' 
                                          : 'border-stone-200/80 bg-white/40 hover:border-[#c06080] hover:bg-[#FAF6F0]/30 text-stone-850 hover:text-stone-950'
                                      }`}
                                  >
                                      {opt.text}
                                  </button>
                              );
                          })}
                        </div>
                    </div>

                    {/* Always-Visible Vedic Fact Box & Navigation Action Bar */}
                    <div className="mt-8 pt-6 border-t border-stone-100 space-y-6">
                        {/* Beautiful Vedic Fact Box */}
                        <div className="p-4 sm:p-5 bg-[#F4EFEA] rounded-2xl border border-[#c06080]/10 flex gap-3.5 items-start relative overflow-hidden transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#c06080]/5 rounded-full blur-xl pointer-events-none" />
                            <span className="text-xl sm:text-2xl mt-0.5 select-none leading-none">💡</span>
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#c06080] font-bold block">
                                    VEDIC COMPASS INSIGHT
                                </span>
                                <p className="text-stone-600 text-xs sm:text-sm font-inter leading-relaxed">
                                    {vedicFact}
                                </p>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentQ === 0}
                                className="px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-stone-200 hover:border-[#c06080] text-stone-600 hover:text-[#c06080] hover:bg-stone-50 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-600 disabled:hover:bg-transparent transition duration-300 cursor-pointer disabled:cursor-not-allowed"
                            >
                                ← Back
                            </button>

                            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                                OJAS COMPASS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};