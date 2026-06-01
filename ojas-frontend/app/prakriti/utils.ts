import { Question } from './quizData';

export interface AssessmentResult {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: string;
}

export interface DoshaScores {
  Vata: number;
  Pitta: number;
  Kapha: number;
}

export interface DoshaPercentages {
  vata: number;
  pitta: number;
  kapha: number;
}

/**
 * Calculates the Prakriti dosha profile based on the selected answer index for each question.
 * Supports both question IDs or question indices as the record key.
 */
export const calculatePrakriti = (
  answers: Record<string, number>, 
  questions: Question[]
): AssessmentResult => {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  questions.forEach((q, idx) => {
    // Support finding by index string (e.g. '0') or ID string (e.g. 'q1')
    const answerIndex = answers[String(idx)];
    if (answerIndex !== undefined && q.opts[answerIndex]) {
      const dosha = q.opts[answerIndex].d;
      if (dosha === 'Vata') vata += 1;
      if (dosha === 'Pitta') pitta += 1;
      if (dosha === 'Kapha') kapha += 1;
    }
  });

  const total = vata + pitta + kapha || 1;
  const vataPct = Math.round((vata / total) * 100);
  const pittaPct = Math.round((pitta / total) * 100);
  const kaphaPct = Math.round((kapha / total) * 100);

  // Calculate dominant dosha
  const max = Math.max(vataPct, pittaPct, kaphaPct);
  let dominant = 'Vata';
  if (max === pittaPct) dominant = 'Pitta';
  if (max === kaphaPct) dominant = 'Kapha';

  return { vata: vataPct, pitta: pittaPct, kapha: kaphaPct, dominant };
};

/**
 * Calculates percentages from raw scores.
 */
export const calculatePercentagesFromScores = (scores: DoshaScores): DoshaPercentages => {
  const total = scores.Vata + scores.Pitta + scores.Kapha || 1;
  return {
    vata: Math.round((scores.Vata / total) * 100),
    pitta: Math.round((scores.Pitta / total) * 100),
    kapha: Math.round((scores.Kapha / total) * 100),
  };
};

/**
 * Identifies the dominant dosha from a dosha composition.
 */
export const getDominantDosha = (pct: DoshaPercentages): string => {
  const entries = Object.entries(pct);
  const dominantKey = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  return dominantKey.charAt(0).toUpperCase() + dominantKey.slice(1);
};
