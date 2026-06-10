'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from './store/userStore';
import { DoshaAnimation } from './components/flows/DoshaAnimation';
import { PrakritiAssessment } from './components/flows/PrakritiAssessment';
import { PrakritiResults } from './components/prakriti/PrakritiResults';
import { MenstrualMoonCorrelation } from './components/flows/MenstrualMoonCorrelation';
import { MusicRecommendations } from './components/flows/MusicRecommendations';
import { DailyCompanion } from './components/flows/DailyCompanion';

export default function WellnessFlow() {
    const currentStep = useUserStore((state) => state.currentStep);
    const setCurrentStep = useUserStore((state) => state.setCurrentStep);
    const user = useUserStore((state) => state.user);

    const [predictionData, setPredictionData] = useState<{
        predictedMood: number | null;
        moodType: string;
        cyclePhase: string;
    } | null>(null);

    useEffect(() => {
        if (currentStep === 'menstrual-moon' && user?.gender === 'male') {
            setCurrentStep('music');
        }
    }, [currentStep, user?.gender, setCurrentStep]);

    if (currentStep === 'dosha-animation') {
        return <DoshaAnimation />;
    }

    if (currentStep === 'assessment') {
        return <PrakritiAssessment />;
    }

    if (currentStep === 'result') {
        return <PrakritiResults />;
    }

    if (currentStep === 'menstrual-moon') {
        if (user?.gender === 'male') return null;
        return (
            <MenstrualMoonCorrelation 
                onPredictionComplete={(data) => setPredictionData(data)} 
            />
        );
    }

    if (currentStep === 'music') {
        return (
            <MusicRecommendations 
                predictedMood={predictionData?.predictedMood ?? null}
                moodType={predictionData?.moodType ?? ''}
                cyclePhase={predictionData?.cyclePhase ?? ''}
            />
        );
    }

    if (currentStep === 'companion') {
        return <DailyCompanion />;
    }

    return <DoshaAnimation />;
}