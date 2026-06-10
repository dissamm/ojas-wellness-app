import { create } from 'zustand';

interface CycleData {
    startDate: string;
    cycleLengthDays: number;
    lastPeriodDate?: string;
    currentPhase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
    dayInCycle?: number;
}

interface CycleState {
    cycle: CycleData | null;
    setCycle: (cycle: CycleData) => void;
    clearCycle: () => void;
}

export const useCycleStore = create<CycleState>((set) => ({
    cycle: null,

    setCycle: (cycle: CycleData) => {
        set({ cycle });
        localStorage.setItem('cycle', JSON.stringify(cycle));
    },

    clearCycle: () => {
        set({ cycle: null });
        localStorage.removeItem('cycle');
    },
}));

if (typeof window !== 'undefined') {
    const savedCycle = localStorage.getItem('cycle');
    if (savedCycle) {
        useCycleStore.setState({ cycle: JSON.parse(savedCycle) });
    }
}