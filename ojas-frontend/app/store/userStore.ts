import { create } from 'zustand';

export interface UserData {
    name: string;
    doshaComposition: {
        vata: number;
        pitta: number;
        kapha: number;
    };
    dominantDosha: string;
    menstrualCycleStart?: Date;
    musicPreferences?: string[];
}

export interface AppState {
    currentStep: 'name' | 'dosha-animation' | 'assessment' | 'result' | 'menstrual-moon' | 'music' | 'companion';
    user: UserData;
    assessmentAnswers: Record<string, string>;
    setName: (name: string) => void;
    setDoshaComposition: (composition: UserData['doshaComposition'], dominant: string) => void;
    setCurrentStep: (step: AppState['currentStep']) => void;
    setAssessmentAnswer: (questionId: string, value: string) => void;
    setMenstrualData: (startDate: Date) => void;
    setMusicPreferences: (preferences: string[]) => void;
    resetAssessment: () => void;
}

export const useUserStore = create<AppState>((set) => ({
    currentStep: 'name',
    user: {
        name: '',
        doshaComposition: { vata: 0, pitta: 0, kapha: 0 },
        dominantDosha: '',
    },
    assessmentAnswers: {},

    setName: (name) => set((state) => ({
        user: { ...state.user, name },
        currentStep: 'dosha-animation'
    })),

    setDoshaComposition: (composition, dominant) => set((state) => ({
        user: { ...state.user, doshaComposition: composition, dominantDosha: dominant },
        currentStep: 'assessment'
    })),

    setCurrentStep: (step) => set({ currentStep: step }),

    setAssessmentAnswer: (questionId, value) => set((state) => ({
        assessmentAnswers: { ...state.assessmentAnswers, [questionId]: value }
    })),

    setMenstrualData: (startDate) => set((state) => ({
        user: { ...state.user, menstrualCycleStart: startDate },
        currentStep: 'music'
    })),

    setMusicPreferences: (preferences) => set((state) => ({
        user: { ...state.user, musicPreferences: preferences },
        currentStep: 'companion'
    })),

    resetAssessment: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('prakriti_quiz_progress');
            localStorage.removeItem('prakriti_quiz_answers');
        }
        set({
            assessmentAnswers: {},
            currentStep: 'assessment'
        });
    },
}));