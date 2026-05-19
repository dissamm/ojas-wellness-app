'use client';

export const hasCompletedPrakriti = (): boolean => {
  if (typeof window === 'undefined') return false;
  const prakriti = localStorage.getItem('prakriti');
  const dominantPrakriti = localStorage.getItem('dominantPrakriti');
  return !!(prakriti && dominantPrakriti);
};

export interface UserLike {
  dominantDosha?: string;
}

export interface PrakritiLike {
  vata: number;
  pitta: number;
  kapha: number;
}

export const getDominantDoshaLabel = (
  user?: UserLike | null,
  prakriti?: PrakritiLike | null,
  dominantPrakriti?: string | null
): string => {
  if (user?.dominantDosha) {
    return user.dominantDosha;
  }
  if (dominantPrakriti) {
    return dominantPrakriti;
  }
  if (prakriti) {
    const entries = Object.entries(prakriti) as [string, number][];
    if (entries.length > 0) {
      const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      return dominant.charAt(0).toUpperCase() + dominant.slice(1);
    }
  }
  return 'Pitta'; // fallback default
};
