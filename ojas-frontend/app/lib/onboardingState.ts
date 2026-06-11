import { UserData } from '../store/userStore';

export const hasCompletedPrakriti = (user?: UserData | null): boolean => {
    if (user?.dominantDosha && user?.doshaComposition && (user.doshaComposition.vata + user.doshaComposition.pitta + user.doshaComposition.kapha > 0)) {
        return true;
    }
    if (typeof window === 'undefined') return false;
    const prakriti = localStorage.getItem('prakriti');
    const dominantPrakriti = localStorage.getItem('dominantPrakriti');
    if (prakriti && dominantPrakriti) {
        try {
            const parsed = JSON.parse(prakriti);
            if (parsed && (parsed.vata + parsed.pitta + parsed.kapha > 0)) {
                return true;
            }
        } catch {
            // ignore
        }
    }
    return false;
};

export const hasCompletedCycle = (user?: UserData | null): boolean => {
    if (user?.gender === 'male') return true; // Males skip this step
    if (user?.menstrualCycleStart) return true;
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('cycle')) return true;
    return false;
};

export const hasCompletedMusic = (user?: UserData | null): boolean => {
    if (user?.musicPreferences && user.musicPreferences.length > 0) return true;
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('musicPreferencesSet') === 'true') return true;
    return false;
};

export const isFullyOnboarded = (user?: UserData | null): boolean => {
    return hasCompletedPrakriti(user) && hasCompletedCycle(user) && hasCompletedMusic(user);
};

export const getResumeStep = (user?: UserData | null): 'dosha-animation' | 'assessment' | 'menstrual-moon' | 'music' | 'companion' => {
    if (!hasCompletedPrakriti(user)) return 'dosha-animation';
    if (!hasCompletedCycle(user)) return 'menstrual-moon';
    if (!hasCompletedMusic(user)) return 'music';
    return 'companion';
};
