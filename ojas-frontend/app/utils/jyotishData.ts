export interface JyotishProfile {
  sunSign: { rashi: string; english: string };
  moonSign: { rashi: string; english: string };
  venusSign: { rashi: string; english: string };
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
  const venusIndex = hashStringToInt(hashInput + 'venus') % MOON_SIGNS.length;
  
  const moonSign = MOON_SIGNS[moonIndex];
  const lagna = LAGNAS[lagnaIndex];
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const venusSign = MOON_SIGNS[venusIndex];
  
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
    venusSign,
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

export interface TransitRitual {
  id: string;
  time: string;
  duration: number;
  activity: string;
  description: string;
  dosha: string[];
  planetaryTag: string;
  icon: string;
  title: string;
  badgeText: string;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface GrahaDoshaRow {
  symbol: string;
  name: string;
  dosha: string;
  governs: string;
  insight: string;
}

export const getGrahaDoshaMatrix = (dominantDosha: string = 'Pitta'): GrahaDoshaRow[] => {
  const baseRows: GrahaDoshaRow[] = [
    {
      symbol: '☉', name: 'Surya', dosha: 'Pitta',
      governs: 'Vitality, Digestion',
      insight: 'The Sun shapes your core energy and confidence. A strong Surya means robust digestion and a natural leadership presence.'
    },
    {
      symbol: '☽', name: 'Chandra', dosha: 'Kapha/Vata',
      governs: 'Emotions, Sleep',
      insight: 'The Moon governs your emotional world and sleep quality. When balanced, you feel grounded; when off, rest and mood suffer first.'
    },
    {
      symbol: '☿', name: 'Budha', dosha: 'Mixed',
      governs: 'Intellect, Nerves',
      insight: 'Mercury rules how you think, speak, and process information. An active Budha can gift sharp wit but also an overactive nervous system.'
    },
    {
      symbol: '♃', name: 'Guru', dosha: 'Kapha',
      governs: 'Expansion, Immunity',
      insight: 'Jupiter brings growth, wisdom, and a strong immune response. It encourages you to expand slowly and nourish deeply.'
    },
    {
      symbol: '♀', name: 'Shukra', dosha: 'Kapha/Pitta',
      governs: 'Sensory Vitality, Ojas',
      insight: 'Venus governs pleasure, beauty, and your vital essence (Ojas). It reminds you that rest and sensory joy are not indulgences — they are medicine.'
    },
    {
      symbol: '♂', name: 'Mangala', dosha: 'Pitta',
      governs: 'Courage, Muscular Energy',
      insight: 'Mars drives ambition and physical strength. When balanced, you are decisive and energetic. Excess Pitta here can show as inflammation or anger.'
    },
    {
      symbol: '♄', name: 'Shani', dosha: 'Vata',
      governs: 'Discipline, Longevity',
      insight: 'Saturn brings structure, boundaries, and endurance. When balanced, you have steadfast patience; when out of balance, stiffness or anxiety surface.'
    }
  ];

  return baseRows.sort((a, b) => {
    const aMatches = a.dosha.toLowerCase().includes(dominantDosha.toLowerCase());
    const bMatches = b.dosha.toLowerCase().includes(dominantDosha.toLowerCase());
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return 0;
  });
};

export type ForecastColorClass = 'pink' | 'neutral' | 'gold';

export const FORECAST_STYLE_MAP: Record<ForecastColorClass, { border: string; dot: string; label: string }> = {
  pink: {
    border: 'border-resonant-pink',
    dot: 'bg-resonant-pink shadow-[0_0_12px_#feb5ca]',
    label: 'text-resonant-pink',
  },
  gold: {
    border: 'border-[#F59E0B]',
    dot: 'bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.8)]',
    label: 'text-[#F59E0B]',
  },
  neutral: {
    border: 'border-white/10',
    dot: 'bg-forest-ink border border-white/40',
    label: 'text-white/50',
  },
};

export const TRANSITS_LIST: TransitRitual[] = [
  {
    id: 'transit-mercury',
    time: '08:00 AM',
    duration: 15,
    activity: '☿ Mercury Rx Alignment',
    description: 'Double your Nadi Shodhana practice. Soothes scattered thinking, communication errors, and tech issues.',
    dosha: ['Vata'],
    planetaryTag: '☿ Mercury Rx · Grounding',
    icon: '☿',
    title: 'Mercury Rx Alignment',
    badgeText: 'VATA WATCH',
  },
  {
    id: 'transit-venus',
    time: '09:30 AM',
    duration: 20,
    activity: '♀ Venus Sensory Ritual',
    description: 'Sensory pleasures restore balance. Favour music, good food, and beauty in your rituals.',
    dosha: ['Pitta'],
    planetaryTag: '♀ Venus in Taurus · Soothing',
    icon: '♀',
    title: 'Venus Sensory Ritual',
    badgeText: 'PITTA SOOTHE',
  },
  {
    id: 'transit-mars',
    time: '05:00 PM',
    duration: 15,
    activity: '♂ Mars Cooling Practice',
    description: 'Competitive energy peaks. Avoid overexertion. Sheetali Pranayama recommended.',
    dosha: ['Pitta'],
    planetaryTag: '♂ Mars in Leo · Pitta Cooling',
    icon: '♂',
    title: 'Mars Cooling Practice',
    badgeText: 'PITTA COOL',
  },
  {
    id: 'transit-jupiter',
    time: '11:00 AM',
    duration: 30,
    activity: '♃ Jupiter Learning Ritual',
    description: 'Philosophical growth period. Excellent for learning and new wellness practices.',
    dosha: ['Vata'],
    planetaryTag: '♃ Jupiter in Gemini · Vata Expansion',
    icon: '♃',
    title: 'Jupiter Learning Ritual',
    badgeText: 'VATA EXPAND',
  },
];

export interface ForecastWeek {
  week: string;
  title: string;
  description: string;
  colorClass: 'pink' | 'neutral' | 'gold';
}

export const MONTHLY_FORECASTS: Record<number, ForecastWeek[]> = {
  0: [ // January
    { week: 'Week 01', title: 'Capricorn Solar Rooting', description: 'Sun conjunct Saturn calls for skeletal discipline. Prioritize warm oil Abhyanga and joint mobility.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Agni Rekindling', description: 'Mid-winter sluggishness lifts. Increase digestive spices like ginger, black pepper, and pippali.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Vata Stabilization', description: 'Cold winds peak. Protect your Prana with slow, rhythmic belly breathing before sleep.', colorClass: 'gold' },
  ],
  1: [ // February
    { week: 'Week 01', title: 'Aquarian Vision', description: 'Air element expands intellect. Excellent period for learning sacred texts and journal reflection.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Kapha Accumulation', description: 'Late winter dampness begins. Transition to lighter breakfasts and warm herbal teas.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Pranic Awakening', description: 'Planetary alignments favor energetic cleansing. Practice Kapalabhati in the Brahma Muhurta.', colorClass: 'gold' },
  ],
  2: [ // March
    { week: 'Week 01', title: 'Vasanta Equinox Shift', description: 'Spring emergence. Solar and lunar channels equalize. Perfect time for Panchakarma detox preparation.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Kapha Release', description: 'Melting winter ice releases emotional stagnation. Favour astringent greens and vigorous movement.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Pisces Lunar Intuition', description: 'Water energy heightens sensitivity. Double your Sandhya twilight meditation practice.', colorClass: 'gold' },
  ],
  3: [ // April
    { week: 'Week 01', title: 'Aries Fire Ignition', description: 'Sun enters exaltation in Mesha. Vitality surges! Channel competitive fire into dynamic Surya Namaskar.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Pitta Guard', description: 'Agni burns sharp. Favour cooling coconut oil and avoid midday sun overexertion.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Mental Clarity Surge', description: 'Budha (Mercury) direct alignment clears communication fog. Speak intentions aloud.', colorClass: 'gold' },
  ],
  4: [ // May
    { week: 'Week 01', title: 'Taurian Grounding', description: 'Venus blesses earthly delights. Connect with soil, flowers, and rich sensory nourishment.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Sattvic Balance', description: 'Late spring harmony. Excellent for establishing consistent daily Dinacharya sleep routines.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Lunar Nurturing', description: 'Chandra transits Rohini. Cultivate emotional softness and drink warm spiced milk before bed.', colorClass: 'gold' },
  ],
  5: [ // June
    { week: 'Week 01', title: 'Creative Surge', description: 'Mercury trine Jupiter supports vocal expression. Excellent for long-term planning.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Introspection', description: 'Retrograde shadows emerge. Reduce commitments and focus on internal Agni.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Solstice Grounding', description: 'Summer solstice alignment. A time for deep rooting and rhythmic cooling movement.', colorClass: 'gold' },
  ],
  6: [ // July
    { week: 'Week 01', title: 'Varsha Monsoon Care', description: 'Humidity weakens Agni. Eat only freshly cooked, warm foods to prevent Vata aggravation.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Emotional Shelter', description: 'Sun transits Cancer. Turn inward, protect your peace, and indulge in restorative Yin practices.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Herbal Potency Peak', description: 'Rain-soaked earth empowers medicinal herbs. Integrate Ashwagandha or Shatavari into evening rituals.', colorClass: 'gold' },
  ],
  7: [ // August
    { week: 'Week 01', title: 'Simha Solar Royalty', description: 'Sun rules its home sign of Leo. Courage and heart chakra vibrancy peak. Stand tall in Tadasana.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Pitta Cooling Week', description: 'High summer heat tests patience. Practice Sheetali breath and spend evenings by calm water.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Mars Disciplined Drive', description: 'Dynamic energy favors physical endurance. Complete challenging projects before noon.', colorClass: 'gold' },
  ],
  8: [ // September
    { week: 'Week 01', title: 'Kanya Purification', description: 'Virgo solar energy demands clean living. Organize your physical sanctuary and refine your diet.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Sharad Autumn Transition', description: 'Seasonal shift brings crisp air. Ground wandering Vata thoughts with warm sesame oil foot massages.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Equinox Equilibrium', description: 'Day and night balance perfectly. Evaluate your wellness wheel and reset personal boundaries.', colorClass: 'gold' },
  ],
  9: [ // October
    { week: 'Week 01', title: 'Tula Diplomatic Grace', description: 'Libra solar transit highlights relationship harmony. Practice compassionate listening and shared tea rituals.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Deep Detox Window', description: 'Clearing summer heat before winter sets in. Favour bitter tonics and gentle Kriya cleanses.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Vata Shielding', description: 'Dry autumn winds increase dryness. Keep skin hydrated and ears covered during morning walks.', colorClass: 'gold' },
  ],
  10: [ // November
    { week: 'Week 01', title: 'Scorpionic Transformation', description: 'Deep water transit illuminates shadow work. Embrace profound release through breath retention.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Ojas Cultivation', description: 'Nourish deep vitality reserves with dates, almonds, ghee, and quiet restorative sleep.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Guru Expansion', description: 'Jupiter aspects your spiritual house. Dedicate morning hours to chanting and philosophical reflection.', colorClass: 'gold' },
  ],
  11: [ // December
    { week: 'Week 01', title: 'Dhanu Sagittarian Quest', description: 'Fire element brings hopeful optimism. Set visionary wellness intentions for the upcoming solar cycle.', colorClass: 'pink' },
    { week: 'Week 02', title: 'Solstice Stillness', description: 'Longest night of the year. Honour the stillness, light beeswax candles, and meditate on inner flame.', colorClass: 'neutral' },
    { week: 'Week 03', title: 'Hemanta Winter Rooting', description: 'Cold settles deep. Stoke internal warmth with hearty stews, vigorous dry brushing, and early sleep.', colorClass: 'gold' },
  ],
};

export interface NumerologyCell {
  number: number;
  graha: string;
  symbol: string;
  keyword: string;
}

export const NUMEROLOGY_GRID_DATA: NumerologyCell[] = [
  { number: 1, symbol: '☉', graha: 'Surya', keyword: 'Leadership' },
  { number: 2, symbol: '☽', graha: 'Chandra', keyword: 'Balance' },
  { number: 3, symbol: '♃', graha: 'Guru', keyword: 'Wisdom' },
  { number: 4, symbol: '☊', graha: 'Rahu', keyword: 'Innovation' },
  { number: 5, symbol: '☿', graha: 'Budha', keyword: 'Intellect' },
  { number: 6, symbol: '♀', graha: 'Shukra', keyword: 'Harmony' },
  { number: 7, symbol: '☋', graha: 'Ketu', keyword: 'Mysticism' },
  { number: 8, symbol: '♄', graha: 'Shani', keyword: 'Resilience' },
  { number: 9, symbol: '♂', graha: 'Mangala', keyword: 'Courage' },
];

export interface VenusStyleProfile {
  keyword: string;
  palette: { name: string; hex: string }[];
  fabrics: string[];
  silhouette: string;
  accessories: string[];
  avoid: string;
  affirmation: string;
}

export const VENUS_STYLE_PROFILES: Record<string, VenusStyleProfile> = {
  aries: {
    keyword: 'Bold Warrior',
    palette: [
      { name: 'Crimson', hex: '#DC2626' },
      { name: 'Rust', hex: '#C2410C' },
      { name: 'Ivory', hex: '#FFFBEB' },
      { name: 'Jet Black', hex: '#18181B' },
    ],
    fabrics: ['Leather', 'Denim', 'Jersey'],
    silhouette: 'Sharp shoulders, structured blazers, power cuts. Nothing oversized or fussy.',
    accessories: ['Chunky gold cuffs', 'Statement boots', 'Minimal hoops'],
    avoid: 'Overly delicate florals or pastel prints — they dull your fire.',
    affirmation: 'I dress like I\'m already winning.',
  },
  taurus: {
    keyword: 'Sensory Luxe',
    palette: [
      { name: 'Sage', hex: '#84A98C' },
      { name: 'Blush', hex: '#F9A8D4' },
      { name: 'Cream', hex: '#FEF9EF' },
      { name: 'Chocolate', hex: '#7C2D12' },
    ],
    fabrics: ['Cashmere', 'Silk', 'Velvet'],
    silhouette: 'Flowing midi skirts, wrap dresses, anything that feels as good as it looks.',
    accessories: ['Gold layered necklaces', 'Leather tote', 'Simple stud earrings'],
    avoid: 'Synthetic fabrics — your skin needs to breathe and feel luxury.',
    affirmation: 'I dress to pleasure my senses, not perform for others.',
  },
  gemini: {
    keyword: 'Playful Eclectic',
    palette: [
      { name: 'Yellow', hex: '#FDE047' },
      { name: 'Sky Blue', hex: '#7DD3FC' },
      { name: 'White', hex: '#F8FAFC' },
      { name: 'Silver', hex: '#CBD5E1' },
    ],
    fabrics: ['Cotton', 'Linen', 'Light chiffon'],
    silhouette: 'Mix prints boldly. Layering is your art form. Two-piece sets, cropped tops.',
    accessories: ['Stacked rings', 'Mismatched earrings', 'Printed scarves'],
    avoid: 'One-note monochromatic looks — you need visual variety.',
    affirmation: 'My style tells a different story every day.',
  },
  cancer: {
    keyword: 'Soft Romantic',
    palette: [
      { name: 'Pearl', hex: '#F1F5F9' },
      { name: 'Dusty Rose', hex: '#FDA4AF' },
      { name: 'Moonstone', hex: '#CBD5E1' },
      { name: 'Seafoam', hex: '#A7F3D0' },
    ],
    fabrics: ['Linen', 'Cotton', 'Satin'],
    silhouette: 'Soft draping, smocked waists, cottagecore elements. Feminine but effortless.',
    accessories: ['Pearl earrings', 'Vintage brooches', 'Delicate anklets'],
    avoid: 'Harsh tailoring or overly corporate looks — they clash with your emotional palette.',
    affirmation: 'I dress to feel held and beautiful.',
  },
  leo: {
    keyword: 'Radiant Queen',
    palette: [
      { name: 'Gold', hex: '#F59E0B' },
      { name: 'Royal Orange', hex: '#EA580C' },
      { name: 'Ivory', hex: '#FFFBEB' },
      { name: 'Magenta', hex: '#C026D3' },
    ],
    fabrics: ['Satin', 'Brocade', 'Faux fur'],
    silhouette: 'Statement pieces, bold necklines, anything that commands a room.',
    accessories: ['Oversized sunglasses', 'Statement earrings', 'Hair accessories'],
    avoid: 'Blending in. Neutrals only work when they are the canvas for one loud piece.',
    affirmation: 'Every room I enter is my stage.',
  },
  virgo: {
    keyword: 'Refined Minimalist',
    palette: [
      { name: 'Taupe', hex: '#A8A29E' },
      { name: 'Forest', hex: '#166534' },
      { name: 'Navy', hex: '#1E3A5F' },
      { name: 'Crisp White', hex: '#F8FAFC' },
    ],
    fabrics: ['Organic cotton', 'Linen', 'Merino wool'],
    silhouette: 'Clean lines, well-fitted basics, capsule wardrobe energy. Quality over quantity.',
    accessories: ['Simple watch', 'Structured bag', 'Thin gold bracelet'],
    avoid: 'Loud logos or overly embellished pieces — they distract from your natural elegance.',
    affirmation: 'Precision is my aesthetic.',
  },
  libra: {
    keyword: 'Aesthetic Harmony',
    palette: [
      { name: 'Blush Pink', hex: '#FBCFE8' },
      { name: 'Lavender', hex: '#C4B5FD' },
      { name: 'Champagne', hex: '#FEF3C7' },
      { name: 'Soft Blue', hex: '#BAE6FD' },
    ],
    fabrics: ['Chiffon', 'Silk', 'Georgette'],
    silhouette: 'Balanced, symmetrical silhouettes. Wrap dresses, A-line skirts, ballet flats.',
    accessories: ['Dainty layered necklaces', 'Kitten heels', 'Pastel handbag'],
    avoid: 'Anything aggressively asymmetric or deliberately clashing.',
    affirmation: 'Beauty is my birthright.',
  },
  scorpio: {
    keyword: 'Magnetic Mystery',
    palette: [
      { name: 'Oxblood', hex: '#7F1D1D' },
      { name: 'Midnight', hex: '#1E1B4B' },
      { name: 'Plum', hex: '#581C87' },
      { name: 'Onyx', hex: '#18181B' },
    ],
    fabrics: ['Leather', 'Silk', 'Lace'],
    silhouette: 'Form-fitting, intentional cuts. Less is more — but what\'s there is powerful.',
    accessories: ['Dark gemstone rings', 'Leather choker', 'Long pendant necklace'],
    avoid: 'Overly bubbly prints or anything that feels surface-level.',
    affirmation: 'My presence speaks before I do.',
  },
  sagittarius: {
    keyword: 'Free Spirit',
    palette: [
      { name: 'Turquoise', hex: '#06B6D4' },
      { name: 'Terracotta', hex: '#C2410C' },
      { name: 'Saffron', hex: '#F59E0B' },
      { name: 'Cobalt', hex: '#1D4ED8' },
    ],
    fabrics: ['Boho cotton', 'Hemp', 'Embroidered cotton'],
    silhouette: 'Flowy maxi dresses, wide-leg trousers, global textile prints.',
    accessories: ['Beaded bracelets', 'Wide-brim hat', 'Ethnic-inspired jewellery'],
    avoid: 'Tight corporate cuts or anything that restricts movement.',
    affirmation: 'My style is a passport.',
  },
  capricorn: {
    keyword: 'Power Architect',
    palette: [
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Camel', hex: '#D97706' },
      { name: 'Forest Green', hex: '#166534' },
      { name: 'Slate', hex: '#475569' },
    ],
    fabrics: ['Wool', 'Tweed', 'Structured cotton'],
    silhouette: 'Tailored trousers, structured coats, timeless investment pieces.',
    accessories: ['Classic watch', 'Leather belt', 'Minimal drop earrings'],
    avoid: 'Fast fashion or anything that won\'t age well — you dress for decades.',
    affirmation: 'I build my wardrobe like I build my legacy.',
  },
  aquarius: {
    keyword: 'Future Avant-Garde',
    palette: [
      { name: 'Electric Blue', hex: '#2563EB' },
      { name: 'Silver', hex: '#CBD5E1' },
      { name: 'Neon', hex: '#84CC16' },
      { name: 'White', hex: '#F8FAFC' },
    ],
    fabrics: ['Metallic', 'Recycled tech fabric', 'Structured jersey'],
    silhouette: 'Architectural cuts, gender-fluid silhouettes, unexpected proportions.',
    accessories: ['Geometric earrings', 'Futuristic sunglasses', 'Unconventional bag'],
    avoid: 'Anything too conventional — your style should make people look twice.',
    affirmation: 'I dress from the future.',
  },
  pisces: {
    keyword: 'Dreamy Mystic',
    palette: [
      { name: 'Sea Green', hex: '#6EE7B7' },
      { name: 'Lilac', hex: '#DDD6FE' },
      { name: 'Peach', hex: '#FED7AA' },
      { name: 'Silver Blue', hex: '#BAE6FD' },
    ],
    fabrics: ['Chiffon', 'Lace', 'Organza'],
    silhouette: 'Ethereal layers, sheer overlays, watercolour prints. Movement in every piece.',
    accessories: ['Crystal pendants', 'Delicate anklets', 'Iridescent bag'],
    avoid: 'Harsh tailoring or anything that feels too structured — it grounds your magic too much.',
    affirmation: 'I dress like I just walked out of a dream.',
  },
};

