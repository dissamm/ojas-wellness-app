'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useUserStore } from './store/userStore';
import { DoshaAnimation } from './components/flows/DoshaAnimation';
import { PrakritiQuiz } from './components/prakriti/PrakritiQuiz';
import { calculatePercentagesFromScores, getDominantDosha } from './prakriti/utils';
import { usePrakritiStore } from './store/prakritiStore';
import { PrakritiResults } from './components/prakriti/PrakritiResults';
import { CosmicCycle } from './components/cycle/CosmicCycle';
import { CosmicMusic } from './components/music/CosmicMusic';
import { DailyCompanion } from './components/flows/DailyCompanion';

function FlowController() {
    const currentStep = useUserStore((state) => state.currentStep);
    const setCurrentStep = useUserStore((state) => state.setCurrentStep);
    const user = useUserStore((state) => state.user);

    const [predictionData, setPredictionData] = useState<{
        predictedMood: number | null;
        moodType: string;
        cyclePhase: string;
    } | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const urlStep = searchParams.get('step');

    // Sync URL -> State (Back button)
    useEffect(() => {
        if (urlStep) {
            const stateStep = useUserStore.getState().currentStep;
            if (urlStep !== stateStep) {
                setCurrentStep(urlStep as 'dosha-animation' | 'assessment' | 'menstrual-moon' | 'music' | 'companion');
            }
        }
    }, [urlStep, setCurrentStep]);

    // Sync State -> URL
    useEffect(() => {
        if (currentStep && currentStep !== 'name') {
            const params = new URLSearchParams(window.location.search);
            const currentUrlStep = params.get('step');
            if (currentUrlStep !== currentStep) {
                if (!currentUrlStep) {
                    router.replace(`${pathname}?step=${currentStep}`, { scroll: false });
                } else {
                    router.push(`${pathname}?step=${currentStep}`, { scroll: false });
                }
            }
        }
    }, [currentStep, pathname, router]);

    useEffect(() => {
        if (currentStep === 'menstrual-moon' && user?.gender === 'male') {
            setCurrentStep('music');
        }
    }, [currentStep, user?.gender, setCurrentStep]);

    if (currentStep === 'dosha-animation') {
        return <DoshaAnimation />;
    }

    if (currentStep === 'assessment') {
        return (
            <div className="min-h-screen bg-transparent text-surface-cream flex flex-col justify-center selection:bg-secondary-fixed/20 transition-colors duration-500 pt-16">
                <PrakritiQuiz onComplete={(finalScores) => {
                    const calculatedPrakriti = calculatePercentagesFromScores(finalScores);
                    const dominantPrakriti = getDominantDosha(calculatedPrakriti);
                    usePrakritiStore.getState().setPrakriti(calculatedPrakriti);
                    useUserStore.getState().setDoshaComposition(calculatedPrakriti, dominantPrakriti);
                    setCurrentStep('result');
                }} />
            </div>
        );
    }

    if (currentStep === 'result') {
        return <PrakritiResults />;
    }

    if (currentStep === 'menstrual-moon') {
        if (user?.gender === 'male') return null;
        return (
            <div className="bg-forest-ink min-h-screen">
                <CosmicCycle 
                    onNext={() => setCurrentStep('music')}
                    onPredictionComplete={(data) => setPredictionData({
                        predictedMood: data.predicted_mood ?? null,
                        moodType: data.predicted_mood && data.predicted_mood > 5 ? 'Elevated' : 'Grounded',
                        cyclePhase: data.cycle_phase ?? 'balanced'
                    })} 
                />
            </div>
        );
    }

    if (currentStep === 'music') {
        return (
            <div className="bg-forest-ink min-h-screen pt-16">
                <CosmicMusic onNext={() => setCurrentStep('companion')} />
            </div>
        );
    }

    if (currentStep === 'companion') {
        return <DailyCompanion />;
    }

    return <DoshaAnimation />;
}

export default function WellnessFlow() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <FlowController />
        </Suspense>
    );
}