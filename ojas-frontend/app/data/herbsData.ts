export interface Herb {
  name: string;
  emoji: string;
  dosha: {
    Vata: 'beneficial' | 'neutral' | 'aggravating';
    Pitta: 'beneficial' | 'neutral' | 'aggravating';
    Kapha: 'beneficial' | 'neutral' | 'aggravating';
  };
  bestFor: string[];
  whenToTake: string;
  timeOfDay: string;
  dosage: string;
  agniNote: string;
  contraindications: string;
  categories: string[];
}

export const HERBS_DATA: Herb[] = [
  {
    name: 'Ashwagandha',
    emoji: '🌿',
    dosha: { Vata: 'beneficial', Pitta: 'aggravating', Kapha: 'beneficial' },
    bestFor: ['Anxiety', 'Sleep', 'Grounding'],
    whenToTake: 'Warm milk before bed',
    timeOfDay: '09:30 PM',
    dosage: '500mg',
    agniNote: 'Avoid on empty stomach if Agni is low',
    contraindications: 'Hyperthyroidism, severe congestion, active ulcers',
    categories: ['VATA', 'SLEEP', 'MIND']
  },
  {
    name: 'Brahmi',
    emoji: '🌱',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Mental Clarity', 'Memory', 'Focus'],
    whenToTake: 'Morning with warm water or ghee',
    timeOfDay: '06:00 AM',
    dosage: '250mg',
    agniNote: 'Very light; supports mental clarity without burdening Agni',
    contraindications: 'Bradycardia, asthma, thyroid conditions',
    categories: ['VATA', 'PITTA', 'MIND']
  },
  {
    name: 'Triphala',
    emoji: '🍇',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Digestion', 'Detoxification', 'Bowel Regularity'],
    whenToTake: 'Before bed with warm water',
    timeOfDay: '09:45 PM',
    dosage: '1000mg',
    agniNote: 'Clears Ama (toxins) and strengthens Agni',
    contraindications: 'Acute diarrhea, severe dehydration, pregnancy',
    categories: ['VATA', 'PITTA', 'KAPHA', 'DIGESTION']
  },
  {
    name: 'Lavender',
    emoji: '🪻',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'neutral' },
    bestFor: ['Stress Relief', 'Relaxation', 'Sleep'],
    whenToTake: 'Bedtime tea',
    timeOfDay: '09:15 PM',
    dosage: '1 cup',
    agniNote: 'Gentle and calming on digestion',
    contraindications: 'Bleeding disorders, upcoming surgery',
    categories: ['VATA', 'PITTA', 'SLEEP', 'MIND']
  },
  {
    name: 'Rosemary',
    emoji: '🌿',
    dosha: { Vata: 'neutral', Pitta: 'aggravating', Kapha: 'beneficial' },
    bestFor: ['Memory', 'Circulation', 'Mental Alertness'],
    whenToTake: 'Morning tea',
    timeOfDay: '07:30 AM',
    dosage: '1 cup',
    agniNote: 'Stimulates sluggish Agni',
    contraindications: 'Pregnancy, epilepsy, high blood pressure',
    categories: ['KAPHA', 'MIND']
  },
  {
    name: 'Nettle',
    emoji: '🍃',
    dosha: { Vata: 'aggravating', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Minerals', 'Hair Health', 'Kidney Support'],
    whenToTake: 'Afternoon tea',
    timeOfDay: '02:00 PM',
    dosage: '1 cup',
    agniNote: 'Requires healthy Agni to digest heavy minerals',
    contraindications: 'Heart or kidney disease, dehydration',
    categories: ['KAPHA', 'PITTA', 'IMMUNITY']
  },
  {
    name: 'Dandelion',
    emoji: '🌼',
    dosha: { Vata: 'aggravating', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Liver Detox', 'Fluid Retention', 'Skin Clearing'],
    whenToTake: 'Mid-day tea',
    timeOfDay: '12:00 PM',
    dosage: '1 cup',
    agniNote: 'Bitter taste cools and reduces hyperactive Agni',
    contraindications: 'Biliary duct obstruction, gallbladder disease',
    categories: ['PITTA', 'KAPHA', 'DIGESTION']
  },
  {
    name: 'Peppermint',
    emoji: '🍃',
    dosha: { Vata: 'neutral', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Digestion', 'Freshness', 'Cooling'],
    whenToTake: 'After meals as tea',
    timeOfDay: '01:00 PM',
    dosage: '1 cup',
    agniNote: 'Relieves gas and supports Agni without heating',
    contraindications: 'GERD, hiatal hernia, gallstones',
    categories: ['PITTA', 'KAPHA', 'DIGESTION']
  },
  {
    name: 'Holy Basil (Tulsi)',
    emoji: '🪴',
    dosha: { Vata: 'beneficial', Pitta: 'aggravating', Kapha: 'beneficial' },
    bestFor: ['Stress', 'Immunity', 'Respiratory Health'],
    whenToTake: 'Morning tea',
    timeOfDay: '06:15 AM',
    dosage: '1 cup',
    agniNote: 'Increases warmth, clears chest congestion',
    contraindications: 'Pregnancy, bleeding disorders, hypoglycemia',
    categories: ['VATA', 'KAPHA', 'IMMUNITY', 'MIND']
  },
  {
    name: 'Shatavari',
    emoji: '🌾',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'aggravating' },
    bestFor: ['Hormones', 'Vitality', 'Nourishment'],
    whenToTake: 'Warm milk at night',
    timeOfDay: '09:00 PM',
    dosage: '500mg',
    agniNote: 'Heavy and oily; avoid if digestive Agni is weak',
    contraindications: 'High Kapha, congestion, fibrocystic conditions',
    categories: ['VATA', 'PITTA', 'HORMONES']
  },
  {
    name: 'Turmeric',
    emoji: '🫚',
    dosha: { Vata: 'beneficial', Pitta: 'neutral', Kapha: 'beneficial' },
    bestFor: ['Immunity', 'Joint Health', 'Inflammation'],
    whenToTake: 'Golden milk in the evening',
    timeOfDay: '08:00 PM',
    dosage: '500mg',
    agniNote: 'Cleanses channels (Srotas) and balances Agni',
    contraindications: 'Gallstones, acute bleeding, pregnancy in high doses',
    categories: ['VATA', 'KAPHA', 'IMMUNITY']
  },
  {
    name: 'Ginger',
    emoji: '🫚',
    dosha: { Vata: 'beneficial', Pitta: 'aggravating', Kapha: 'beneficial' },
    bestFor: ['Digestion', 'Nausea', 'Warmth'],
    whenToTake: 'Before meals',
    timeOfDay: '11:30 AM',
    dosage: '500mg',
    agniNote: 'The absolute best spice to kindle Agni (Deepana)',
    contraindications: 'High Pitta inflammation, bleeding ulcers',
    categories: ['VATA', 'KAPHA', 'DIGESTION']
  },
  {
    name: 'Cardamom',
    emoji: '🟢',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Digestion', 'Bloating', 'Flavor'],
    whenToTake: 'With meals or in tea',
    timeOfDay: '08:30 AM',
    dosage: '250mg',
    agniNote: 'Kindles Agni gently without irritating Pitta',
    contraindications: 'Acute gallstones',
    categories: ['VATA', 'PITTA', 'KAPHA', 'DIGESTION']
  },
  {
    name: 'Guggulu',
    emoji: '🪵',
    dosha: { Vata: 'beneficial', Pitta: 'neutral', Kapha: 'beneficial' },
    bestFor: ['Joints', 'Cholesterol', 'Detox'],
    whenToTake: 'Warm water after meals',
    timeOfDay: '01:30 PM',
    dosage: '500mg',
    agniNote: 'Clears toxins to improve systemic digestion and metabolism',
    contraindications: 'Pregnancy, thyroid disease, kidney disease',
    categories: ['VATA', 'KAPHA', 'HORMONES']
  },
  {
    name: 'Gotu Kola',
    emoji: '🍀',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Mind', 'Skin Health', 'Longevity'],
    whenToTake: 'Morning capsule or tea',
    timeOfDay: '06:30 AM',
    dosage: '300mg',
    agniNote: 'Light and neutral, easily digested',
    contraindications: 'Severe liver disease',
    categories: ['VATA', 'PITTA', 'KAPHA', 'MIND']
  },
  {
    name: 'Amalaki',
    emoji: '🍒',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Immunity', 'Agni Support', 'Aging'],
    whenToTake: 'Morning with warm water',
    timeOfDay: '07:00 AM',
    dosage: '500mg',
    agniNote: 'Highly nourishing, strengthens Agni without increasing heat',
    contraindications: 'Acute diarrhea or severe dysentery',
    categories: ['PITTA', 'IMMUNITY', 'DIGESTION']
  },
  {
    name: 'Neem',
    emoji: '🌿',
    dosha: { Vata: 'aggravating', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Skin Health', 'Detox', 'Blood Purification'],
    whenToTake: 'Morning with water',
    timeOfDay: '06:45 AM',
    dosage: '250mg',
    agniNote: 'Extremely bitter and cold; can suppress Agni if overused',
    contraindications: 'Pregnancy, general weakness, tissue depletion',
    categories: ['PITTA', 'KAPHA', 'IMMUNITY']
  },
  {
    name: 'Licorice (Mulethi)',
    emoji: '🥢',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'aggravating' },
    bestFor: ['Throat Health', 'Acid Reflux', 'Adrenal Support'],
    whenToTake: 'Warm water or tea',
    timeOfDay: '08:00 AM',
    dosage: '300mg',
    agniNote: 'Soothing but sweet and heavy; can slow digestion if weak',
    contraindications: 'High blood pressure, kidney disease, edema',
    categories: ['VATA', 'PITTA', 'HORMONES']
  },
  {
    name: 'Fennel',
    emoji: '🌾',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Digestion', 'Cooling', 'Cramping'],
    whenToTake: 'Chew seeds after meals',
    timeOfDay: '01:15 PM',
    dosage: '1 tsp',
    agniNote: 'Promotes healthy digestive fire without aggravating heat',
    contraindications: 'Estrogen-sensitive conditions in high concentrated doses',
    categories: ['VATA', 'PITTA', 'KAPHA', 'DIGESTION']
  },
  {
    name: 'Shankhapushpi',
    emoji: '🌸',
    dosha: { Vata: 'beneficial', Pitta: 'beneficial', Kapha: 'beneficial' },
    bestFor: ['Mind', 'Sleep', 'Anxiety'],
    whenToTake: 'Warm milk before bed',
    timeOfDay: '09:45 PM',
    dosage: '500mg',
    agniNote: 'Calming to the mind and digestive tract without dampening fire',
    contraindications: 'None standard in normal dietary levels',
    categories: ['VATA', 'PITTA', 'KAPHA', 'SLEEP', 'MIND']
  }
];
