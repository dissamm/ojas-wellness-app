import { create } from 'zustand';

export type SleepDepth = 'restless' | 'light' | 'deep' | 'dreamless' | null;
export type WakingEnergy = 'refreshed' | 'groggy' | 'anxious' | null;
export type DreamTheme =
  | 'vivid'
  | 'anxious'
  | 'peaceful'
  | 'intense'
  | 'confusing'
  | 'nodreams';

export interface SleepLog {
  date: string; // YYYY-MM-DD
  sleepDepth: SleepDepth;
  wakingEnergy: WakingEnergy;
  dreamThemes: DreamTheme[];
  hoursSlept: number | null;
  moonPhase: string;
}

interface SleepState {
  logs: SleepLog[];
  addLog: (log: SleepLog) => void;
  getTodayLog: () => SleepLog | null;
  hasDoneCheckinToday: () => boolean;
}

const toLocalDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const loadLogs = (): SleepLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('ojas_sleep_logs');
    return raw ? (JSON.parse(raw) as SleepLog[]) : [];
  } catch {
    return [];
  }
};

const saveLogs = (logs: SleepLog[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ojas_sleep_logs', JSON.stringify(logs));
  }
};

export const useSleepStore = create<SleepState>((set, get) => ({
  logs: typeof window !== 'undefined' ? loadLogs() : [],

  addLog: (log: SleepLog) => {
    const filtered = get().logs.filter((l) => l.date !== log.date);
    const newLogs = [log, ...filtered].slice(0, 90);
    saveLogs(newLogs);
    set({ logs: newLogs });
  },

  getTodayLog: () => {
    const today = toLocalDateStr();
    return get().logs.find((l) => l.date === today) ?? null;
  },

  hasDoneCheckinToday: () => {
    const today = toLocalDateStr();
    return get().logs.some((l) => l.date === today);
  },
}));

export { toLocalDateStr };
