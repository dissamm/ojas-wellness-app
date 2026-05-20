'use client';

import React, { useEffect } from 'react';
import { useUserStore } from './store/userStore';
import { DoshaAnimation } from './components/flows/DoshaAnimation';
import { PrakritiAssessment } from './components/flows/PrakritiAssessment';
import { PrakritiResult } from './components/flows/PrakritiResult';
import { MenstrualMoonCorrelation } from './components/flows/MenstrualMoonCorrelation';
import { MusicRecommendations } from './components/flows/MusicRecommendations';
import { DailyCompanion } from './components/flows/DailyCompanion';

export default function WellnessFlow() {
    const currentStep = useUserStore((state) => state.currentStep);
    const setCurrentStep = useUserStore((state) => state.setCurrentStep);
    const user = useUserStore((state) => state.user);

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
        return <PrakritiResult />;
    }

    if (currentStep === 'menstrual-moon') {
        if (user?.gender === 'male') return null;
        return <MenstrualMoonCorrelation />;
    }

    if (currentStep === 'music') {
        return <MusicRecommendations />;
    }

    if (currentStep === 'companion') {
        return <DailyCompanion />;
    }

    return <DoshaAnimation />;
}