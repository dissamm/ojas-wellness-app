export interface JyotishProfile {
  sunSign: { rashi: string; english: string };
  moonSign: { rashi: string; english: string };
  lagna: { rashi: string; english: string };
  nakshatra: string;
  lifePathNumber: number;
  lifePathDescription: string;
  lifePathTagline: string;
  personalYearNumber: number;
  personalYearInsight: string;
  powerDay: number;
  insightQuote: string;
  dominantInfluence: string;
}

const MOON_SIGNS = [
  { rashi: 'Mesha', english: 'Aries' },
  { rashi: 'Vrishabha', english: 'Taurus' },
  { rashi: 'Mithuna', english: 'Gemini' },
  { rashi: 'Karka', english: 'Cancer' },
  { rashi: 'Simha', english: 'Leo' },
  { rashi: 'Kanya', english: 'Virgo' },
  { rashi: 'Tula', english: 'Libra' },
  { rashi: 'Vrishchika', english: 'Scorpio' },
  { rashi: 'Dhanu', english: 'Sagittarius' },
  { rashi: 'Makara', english: 'Capricorn' },
  { rashi: 'Kumbha', english: 'Aquarius' },
  { rashi: 'Meena', english: 'Pisces' }
];

const LAGNAS = [
  { rashi: 'Mesha', english: 'Aries' },
  { rashi: 'Vrishabha', english: 'Taurus' },
  { rashi: 'Mithuna', english: 'Gemini' },
  { rashi: 'Karka', english: 'Cancer' },
  { rashi: 'Simha', english: 'Leo' },
  { rashi: 'Kanya', english: 'Virgo' },
  { rashi: 'Tula', english: 'Libra' },
  { rashi: 'Vrishchika', english: 'Scorpio' },
  { rashi: 'Dhanu', english: 'Sagittarius' },
  { rashi: 'Makara', english: 'Capricorn' },
  { rashi: 'Kumbha', english: 'Aquarius' },
  { rashi: 'Meena', english: 'Pisces' }
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const LIFE_PATH_DETAILS: Record<number, { tagline: string; description: string }> = {
  1: { tagline: 'The Leader', description: 'Independence, originality, and drive are your core strengths. You pave new pathways.' },
  2: { tagline: 'The Peacemaker', description: 'Cooperation, diplomacy, and sensitivity guide your path. You seek balance and connection.' },
  3: { tagline: 'The Creator', description: 'Expression, communication, and joy are your natural states. You inspire through words and art.' },
  4: { tagline: 'The Builder', description: 'Structure, discipline, and practicality define your rhythm. You build foundations.' },
  5: { tagline: 'The Explorer', description: 'Freedom, curiosity, and adaptability drive your energy. You seek change and experience.' },
  6: { tagline: 'The Nurturer', description: 'Responsibility, love, and harmony are your foundation. You care deeply for others.' },
  7: { tagline: 'The Seeker', description: 'Deep introspection and spiritual alignment are your natural rhythms. Truth and wisdom guide you.' },
  8: { tagline: 'The Achiever', description: 'Power, abundance, and material success are your lessons. You direct energy into high mastery.' },
  9: { tagline: 'The Humanitarian', description: 'Compassion, selflessness, and completion guide your spirit. You seek universal harmony.' }
};

const PERSONAL_YEAR_INSIGHTS: Record<number, string> = {
  1: 'A year of new beginnings, independence, and planting seeds for the future.',
  2: 'A year of patience, relationships, cooperation, and slow but steady growth.',
  3: 'A year of creativity, social connection, self-expression, and joy.',
  4: 'A year of hard work, building stability, organization, and focus.',
  5: 'A year of change, adventure, pivoting directions, and dynamic freedom.',
  6: 'A year of domestic harmony, healing, family responsibility, and service.',
  7: 'A year of introspection, spiritual study, resting the mind, and inner alignment.',
  8: 'A year of manifestation, career growth, financial harvest, and personal power.',
  9: 'A year of release, completion, clearing out the old, and preparing for transition.'
};

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getVedicSunSign(month: number, day: number): { rashi: string; english: string } {
  if ((month === 4 && day >= 13) || (month === 5 && day <= 14)) return { rashi: 'Mesha', english: 'Aries' };
  if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) return { rashi: 'Vrishabha', english: 'Taurus' };
  if ((month === 6 && day >= 15) || (month === 7 && day <= 15)) return { rashi: 'Mithuna', english: 'Gemini' };
  if ((month === 7 && day >= 16) || (month === 8 && day <= 16)) return { rashi: 'Karka', english: 'Cancer' };
  if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) return { rashi: 'Simha', english: 'Leo' };
  if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) return { rashi: 'Kanya', english: 'Virgo' };
  if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) return { rashi: 'Tula', english: 'Libra' };
  if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) return { rashi: 'Vrishchika', english: 'Scorpio' };
  if ((month === 12 && day >= 16) || (month === 1 && day <= 13)) return { rashi: 'Dhanu', english: 'Sagittarius' };
  if ((month === 1 && day >= 14) || (month === 2 && day <= 12)) return { rashi: 'Makara', english: 'Capricorn' };
  if ((month === 2 && day >= 13) || (month === 3 && day <= 13)) return { rashi: 'Kumbha', english: 'Aquarius' };
  return { rashi: 'Meena', english: 'Pisces' };
}

export function getLifePathNumber(dobString: string): number {
  const cleanStr = dobString.replace(/[^0-9]/g, '');
  if (!cleanStr) return 7; // fallback
  let sum = cleanStr.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  while (sum > 9) {
    sum = String(sum).split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  }
  return sum;
}

export function getPersonalYearNumber(dobString: string, currentYear: number = 2026): number {
  const parts = dobString.split('-');
  if (parts.length !== 3) return 8; // fallback
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  const targetStr = `${day}${month}${currentYear}`;
  let sum = targetStr.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  while (sum > 9) {
    sum = String(sum).split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  }
  return sum;
}

export function getJyotishProfile(dobString: string | undefined): JyotishProfile {
  // If not provided, fallback to a standard DOB
  const dob = dobString || '1995-10-24';
  const parts = dob.split('-');
  
  const year = parts.length === 3 ? parseInt(parts[0], 10) : 1995;
  const month = parts.length === 3 ? parseInt(parts[1], 10) : 10;
  const day = parts.length === 3 ? parseInt(parts[2], 10) : 24;
  
  const sunSign = getVedicSunSign(month, day);
  
  const hashInput = `${year}-${month}-${day}`;
  const moonIndex = hashStringToInt(hashInput + 'moon') % MOON_SIGNS.length;
  const lagnaIndex = hashStringToInt(hashInput + 'lagna') % LAGNAS.length;
  const nakshatraIndex = hashStringToInt(hashInput + 'nakshatra') % NAKSHATRAS.length;
  
  const moonSign = MOON_SIGNS[moonIndex];
  const lagna = LAGNAS[lagnaIndex];
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  
  const lifePathNumber = getLifePathNumber(dob);
  const lifePathDetails = LIFE_PATH_DETAILS[lifePathNumber] || LIFE_PATH_DETAILS[7];
  
  const personalYearNumber = getPersonalYearNumber(dob);
  const personalYearInsight = PERSONAL_YEAR_INSIGHTS[personalYearNumber] || PERSONAL_YEAR_INSIGHTS[8];
  
  // Power day (1 to 28)
  const powerDayDays = [7, 16, 25, 3, 12, 21, 5, 14, 23, 9, 18, 27];
  const powerDay = powerDayDays[lifePathNumber % powerDayDays.length];
  
  // Dynamic custom quotes based on combinations
  const insightQuote = `Your ${lagna.english} ascendant brings unique character expression to your ${sunSign.english} transit. The ${moonSign.english} moon gifts you intuitive depth, guiding Nakshatra ${nakshatra}.`;
  
  // Vedic influences
  let dominantInfluence = 'Vedic chart shows strong Mercury influence — heightens Vata tendency toward overthinking';
  if (sunSign.rashi === 'Mesha' || sunSign.rashi === 'Simha' || sunSign.rashi === 'Vrishchika') {
    dominantInfluence = 'Vedic chart shows strong Mars influence — elevates Pitta tendency toward fire and intensity';
  } else if (sunSign.rashi === 'Vrishabha' || sunSign.rashi === 'Karka' || sunSign.rashi === 'Meena') {
    dominantInfluence = 'Vedic chart shows strong Moon/Jupiter influence — increases Kapha tendency toward fluid calm';
  }

  return {
    sunSign,
    moonSign,
    lagna,
    nakshatra,
    lifePathNumber,
    lifePathDescription: lifePathDetails.description,
    lifePathTagline: lifePathDetails.tagline,
    personalYearNumber,
    personalYearInsight,
    powerDay,
    insightQuote,
    dominantInfluence
  };
}
