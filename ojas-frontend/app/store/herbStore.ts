import { create } from 'zustand';

export interface SavedHerb {
  name: string;
  dosage: string;
  timeOfDay: string;
  emoji: string;
  bestFor: string[];
}

interface HerbState {
  myStack: SavedHerb[];
  syncedToRituals: boolean;
  addHerb: (herb: SavedHerb) => void;
  removeHerb: (name: string) => void;
  setSynced: (synced: boolean) => void;
}

const loadStack = (): SavedHerb[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('ojas_my_herb_stack');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadSynced = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ojas_herb_synced') === 'true';
};

export const useHerbStore = create<HerbState>((set, get) => ({
  myStack: typeof window !== 'undefined' ? loadStack() : [],
  syncedToRituals: typeof window !== 'undefined' ? loadSynced() : false,

  addHerb: (herb) => {
    const existing = get().myStack.find((h) => h.name === herb.name);
    if (existing) return;
    const newStack = [...get().myStack, herb];
    localStorage.setItem('ojas_my_herb_stack', JSON.stringify(newStack));
    localStorage.setItem('ojas_herb_synced', 'false');
    set({ myStack: newStack, syncedToRituals: false });
  },

  removeHerb: (name) => {
    const newStack = get().myStack.filter((h) => h.name !== name);
    localStorage.setItem('ojas_my_herb_stack', JSON.stringify(newStack));
    localStorage.setItem('ojas_herb_synced', 'false');
    set({ myStack: newStack, syncedToRituals: false });
  },

  setSynced: (synced) => {
    localStorage.setItem('ojas_herb_synced', synced ? 'true' : 'false');
    set({ syncedToRituals: synced });
  },
}));
