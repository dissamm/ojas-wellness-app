'use client';

import { UserData } from '../store/userStore';

export const hasCompletedPrakriti = (user?: UserData): boolean => {
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
