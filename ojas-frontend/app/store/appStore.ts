import { create } from 'zustand';

interface AppState {
    // Daily affirmation
    dailyAffirmation: string;
    setDailyAffirmation: (affirmation: string) => void;

    // Music preferences
    favoriteGenres: string[];
    addFavoriteGenre: (genre: string) => void;
    removeFavoriteGenre: (genre: string) => void;

    // Current mood/energy
    currentEnergy: number;
    setCurrentEnergy: (energy: number) => void;

    currentMood: string;
    setCurrentMood: (mood: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Affirmations
    dailyAffirmation: 'I am the essence of wellness.',
    setDailyAffirmation: (affirmation: string) => {
        set({ dailyAffirmation: affirmation });
        localStorage.setItem('dailyAffirmation', affirmation);
    },

    // Music
    favoriteGenres: [],
    addFavoriteGenre: (genre: string) => {
        set((state) => {
            const updated = [...state.favoriteGenres, genre];
            localStorage.setItem('favoriteGenres', JSON.stringify(updated));
            return { favoriteGenres: updated };
        });
    },

    removeFavoriteGenre: (genre: string) => {
        set((state) => {
            const updated = state.favoriteGenres.filter((g) => g !== genre);
            localStorage.setItem('favoriteGenres', JSON.stringify(updated));
            return { favoriteGenres: updated };
        });
    },

    // Energy level
    currentEnergy: 7,
    setCurrentEnergy: (energy: number) => {
        set({ currentEnergy: energy });
        localStorage.setItem('currentEnergy', energy.toString());
    },

    // Mood
    currentMood: 'Reflective',
    setCurrentMood: (mood: string) => {
        set({ currentMood: mood });
        localStorage.setItem('currentMood', mood);
    },
}));

if (typeof window !== 'undefined') {
    const savedAffirmation = localStorage.getItem('dailyAffirmation');
    if (savedAffirmation) {
        useAppStore.setState({ dailyAffirmation: savedAffirmation });
    }

    const savedGenres = localStorage.getItem('favoriteGenres');
    if (savedGenres) {
        useAppStore.setState({ favoriteGenres: JSON.parse(savedGenres) });
    }

    const savedEnergy = localStorage.getItem('currentEnergy');
    if (savedEnergy) {
        useAppStore.setState({ currentEnergy: parseInt(savedEnergy) });
    }

    const savedMood = localStorage.getItem('currentMood');
    if (savedMood) {
        useAppStore.setState({ currentMood: savedMood });
    }
}