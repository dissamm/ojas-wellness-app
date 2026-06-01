import { create } from 'zustand';

interface PrakritiState {
    prakriti: {
        vata: number;
        pitta: number;
        kapha: number;
    } | null;
    dominantPrakriti: 'Vata' | 'Pitta' | 'Kapha' | null;
    setPrakriti: (scores: { vata: number; pitta: number; kapha: number }) => void;
}

export const usePrakritiStore = create<PrakritiState>((set) => ({
    prakriti: null,
    dominantPrakriti: null,

    setPrakriti: (scores) => {
        const entries = Object.entries(scores);
        const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        const dominantPrakriti = dominant.charAt(0).toUpperCase() + dominant.slice(1) as 'Vata' | 'Pitta' | 'Kapha';

        set({
            prakriti: scores,
            dominantPrakriti: dominantPrakriti
        });

        localStorage.setItem('prakriti', JSON.stringify(scores));
        localStorage.setItem('dominantPrakriti', dominantPrakriti);
    },
}));