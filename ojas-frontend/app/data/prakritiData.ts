export interface QuestionOption {
  t: string;
  d: string;
}

export interface Question {
  cat: string;
  text: string;
  fact: string;
  opts: QuestionOption[];
}

export const PRAKRITI_QUESTIONS: Question[] = [
  {
    cat: 'Body · Frame',
    text: 'Your natural body type?',
    fact: '📜 Charaka: Vata = laghu (light), Pitta = madhyama (medium), Kapha = sthula (solid). Frame is the most reliable physical Prakriti marker.',
    opts: [
      { t: 'Lean and light — bones visible, hard to gain weight', d: 'Vata' },
      { t: 'Medium and proportional — athletic when active, easy to tone', d: 'Pitta' },
      { t: 'Broad and sturdy — soft build, gain easily, hard to lose', d: 'Kapha' },
    ],
  },
  {
    cat: 'Body · Eyes',
    text: 'Describe your eyes honestly:',
    fact: '📜 Sushruta: Vata eyes are small and restless, Pitta eyes are sharp with a reddish tinge, Kapha eyes are large, white and beautifully lustrous.',
    opts: [
      { t: 'Small, alert, constantly moving — sometimes dry or nervous', d: 'Vata' },
      { t: 'Medium, penetrating, intense — light-sensitive, slight reddish tinge', d: 'Pitta' },
      { t: 'Large, calm, beautiful — thick lashes, very white, slow-moving', d: 'Kapha' },
    ],
  },
  {
    cat: 'Body · Skin',
    text: 'Your skin on a normal day:',
    fact: '📜 Skin texture is one of the most reliable Prakriti signs: Vata = ruksha (dry/rough), Pitta = ushna (warm/sensitive), Kapha = snigdha (smooth/moist).',
    opts: [
      { t: 'Dry, thin, rough — chaps easily, prone to cracking or flaking', d: 'Vata' },
      { t: 'Warm, oily or sensitive — prone to redness, freckles or breakouts', d: 'Pitta' },
      { t: 'Smooth, thick, cool and moist — glows naturally, rarely dry', d: 'Kapha' },
    ],
  },
  {
    cat: 'Body · Temperature',
    text: 'You are usually…',
    fact: '📜 Vata = sheeta (cold-natured). Pitta = ushna (heat-natured). Kapha = sheeta but denser — tolerates cold better than Vata.',
    opts: [
      { t: 'Always cold — cold hands and feet, hate wind, love warmth', d: 'Vata' },
      { t: 'Always warm — uncomfortable in heat, love cool air, sweat easily', d: 'Pitta' },
      { t: 'Comfortable in most temperatures — not very bothered by either extreme', d: 'Kapha' },
    ],
  },
  {
    cat: 'Body · Energy',
    text: 'Your natural energy pattern:',
    fact: '📜 Vata energy is "vishama" (variable) — bursts and crashes. Pitta is "tikshna" (intense and directed). Kapha is "sthira" (slow to start but highly enduring).',
    opts: [
      { t: 'Bursts of energy then sudden crashes — inconsistent throughout the day', d: 'Vata' },
      { t: 'Intense and focused when motivated, depleted by heat or stress', d: 'Pitta' },
      { t: 'Slow to warm up, but once going — remarkable stamina', d: 'Kapha' },
    ],
  },
  {
    cat: 'Body · Joints & Teeth',
    text: 'Your joints and teeth:',
    fact: '📜 Sushruta: Vata joints are "chala" (unstable/clicking), Pitta teeth are yellowish and moderate, Kapha teeth are "drudha" (strong, white, firmly set).',
    opts: [
      { t: 'Joints crack or pop — teeth irregular or prone to gaps', d: 'Vata' },
      { t: 'Joints flexible — teeth moderate, slightly yellowish', d: 'Pitta' },
      { t: 'Joints solid and well-padded — teeth strong, white, set firm', d: 'Kapha' },
    ],
  },
  {
    cat: 'Digestion · Hunger',
    text: 'Your appetite on a typical day:',
    fact: '📜 Agni (digestive fire) is Prakriti\'s fingerprint: Vata = vishama agni (irregular), Pitta = tikshna agni (sharp), Kapha = manda agni (slow and gentle).',
    opts: [
      { t: 'Irregular — sometimes ravenous, sometimes no appetite at all', d: 'Vata' },
      { t: 'Strong and sharp — irritable if a meal is delayed', d: 'Pitta' },
      { t: 'Low but steady — can easily skip a meal without distress', d: 'Kapha' },
    ],
  },
  {
    cat: 'Digestion · Sleep',
    text: 'How you naturally sleep:',
    fact: '📜 Sleep reveals dosha: Vata = light and broken, Pitta = moderate and purposeful, Kapha = deep and prolonged. The heaviest sleepers are always Kapha.',
    opts: [
      { t: 'Light and broken — vivid dreams, easily disturbed by any sound', d: 'Vata' },
      { t: 'Quick to fall asleep, don\'t need much — wake alert but irritable if disturbed', d: 'Pitta' },
      { t: 'Deep, heavy and long — very hard to wake, feel groggy for a while', d: 'Kapha' },
    ],
  },
  {
    cat: 'Digestion · Sweat',
    text: 'How you sweat:',
    fact: '📜 Sushruta lists profuse sweating and strong odour as clear Pitta Prakriti signs — "svedano" and "durgandha".',
    opts: [
      { t: 'Barely sweat — skin stays dry even in moderate heat', d: 'Vata' },
      { t: 'Sweat heavily and quickly — strong, sharp body odour', d: 'Pitta' },
      { t: 'Sweat moderately — mild or pleasant smell', d: 'Kapha' },
    ],
  },
  {
    cat: 'Digestion · Voice',
    text: 'How people describe your voice and speech:',
    fact: '📜 Voice is a direct dosha marker: Vata = parusha (rough/fast), Pitta = madhura (clear/sharp), Kapha = mridhu (deep/slow/melodious).',
    opts: [
      { t: 'Fast and enthusiastic — voice can be hoarse or trail off', d: 'Vata' },
      { t: 'Clear, precise, direct — people find you convincing and articulate', d: 'Pitta' },
      { t: 'Slow, calm, resonant — deep voice, measured words', d: 'Kapha' },
    ],
  },
  {
    cat: 'Digestion · Weather',
    text: 'Which weather genuinely suits you best?',
    fact: '📜 Law of opposites: Vata (cold/dry) thrives in warm/humid, Pitta (hot) in cool/dry, Kapha (cold/heavy) in warm/dry stimulating environments.',
    opts: [
      { t: 'Warm and humid — wind, cold and dryness drain me', d: 'Vata' },
      { t: 'Cool and ventilated — heat and humidity exhaust me', d: 'Pitta' },
      { t: 'Warm and dry — cold and damp make me sluggish', d: 'Kapha' },
    ],
  },
  {
    cat: 'Digestion · Digestion',
    text: 'Your bowels on a regular basis:',
    fact: '📜 Bowel character is among Charaka\'s most reliable Prakriti signs — Vata dries, Pitta loosens, Kapha slows and bulks.',
    opts: [
      { t: 'Irregular, dry or hard — constipation is a recurring theme', d: 'Vata' },
      { t: 'Regular but loose or urgent — tendency toward soft stools', d: 'Pitta' },
      { t: 'Regular, bulky, well-formed — slow but reliable', d: 'Kapha' },
    ],
  },
  {
    cat: 'Mind · Learning',
    text: 'How you learn and remember things:',
    fact: '📜 Charaka: Vata = grahi (quick in, quick out), Pitta = medhavi (sharp and retentive), Kapha = chiragrahi (slow but never forgets once learned).',
    opts: [
      { t: 'Grasp things fast but forget equally fast — strong short-term memory', d: 'Vata' },
      { t: 'Analytical and sharp — absorb and retain facts well', d: 'Pitta' },
      { t: 'Slow to understand fully, but once learned — it\'s permanent', d: 'Kapha' },
    ],
  },
  {
    cat: 'Mind · Decisions',
    text: 'How you make important decisions:',
    fact: '📜 Vata = chanchala (fickle). Pitta = nipunamati (decisive). Kapha = drudha vaira (deliberate, lasting commitments that rarely waver).',
    opts: [
      { t: 'Quickly and impulsively — change my mind frequently', d: 'Vata' },
      { t: 'Fast analysis then commit — rarely look back once decided', d: 'Pitta' },
      { t: 'Very slowly and carefully — deliberate long, but then stay firm', d: 'Kapha' },
    ],
  },
  {
    cat: 'Mind · Stress',
    text: 'Under pressure, you typically:',
    fact: '📜 Charaka links anxiety/fear to Vata, anger/irritability to Pitta, depression/withdrawal to Kapha as primary stress responses.',
    opts: [
      { t: 'Get anxious, scattered and overwhelmed — mind won\'t stop racing', d: 'Vata' },
      { t: 'Get intense, irritable or critical — feel an urge to attack the problem', d: 'Pitta' },
      { t: 'Withdraw, go quiet, get heavy — hard to find motivation to face it', d: 'Kapha' },
    ],
  },
  {
    cat: 'Mind · Relationships',
    text: 'Your natural social style:',
    fact: '📜 Kapha types are "krutajna" (loyal, grateful). Pitta types are assertive with deep but demanding bonds. Vata types have many connections but lighter bonds.',
    opts: [
      { t: 'Enthusiastic and social with many connections — bonds can be light', d: 'Vata' },
      { t: 'Confident and direct — few deep relationships, high standards', d: 'Pitta' },
      { t: 'Warm, deeply loyal, forgiving — small inner circle, bonds that last', d: 'Kapha' },
    ],
  },
  {
    cat: 'Mind · Money',
    text: 'Your relationship with money and goals:',
    fact: '📜 Charaka: Vata = alpa dhan (poor at saving), Pitta = madhya dhana (ambitious earner), Kapha = bahu dhana (slow steady accumulator).',
    opts: [
      { t: 'Impulsive spender — money flows in and out; many goals, scattered execution', d: 'Vata' },
      { t: 'Ambitious and focused — clear financial goals, disciplined when motivated', d: 'Pitta' },
      { t: 'Patient saver — accumulates steadily, holds onto resources', d: 'Kapha' },
    ],
  },
  {
    cat: 'Mind · Mornings',
    text: 'You before 9am:',
    fact: '📜 Morning behaviour reflects dosha cycles: Vata peaks at dawn (3–7 AM) — restless. Pitta 10–2. Kapha 6–10 — the hardest time to leave bed.',
    opts: [
      { t: 'Already awake and thinking — mind active at dawn, sometimes before alarm', d: 'Vata' },
      { t: 'Awake and ready quickly — purposeful morning person', d: 'Pitta' },
      { t: 'Extremely reluctant to leave bed — need time and usually tea or coffee', d: 'Kapha' },
    ],
  }
];

export interface DoshaDetailFoodLifestyle {
  principle: string;
  prefer: string[];
  avoid: string[];
}

export interface DoshaRhythmItem {
  time: string;
  action: string;
}

export interface DoshaHerbItem {
  name: string;
  sanskrit: string;
  use: string;
  icon: string;
}

export interface DoshaSeasonItem {
  name: string;
  tip: string;
  active: boolean;
  icon: string;
}

export interface DoshaDetail {
  name: string;
  color: string;
  element: string;
  classical: string;
  desc: string;
  traits: string[];
  why: string;
  imbalance: string[];
  foods: DoshaDetailFoodLifestyle;
  lifestyle: DoshaDetailFoodLifestyle;
  exercise: DoshaDetailFoodLifestyle;
  rhythm: DoshaRhythmItem[];
  herbs: DoshaHerbItem[];
  seasons: DoshaSeasonItem[];
}

export const DOSHA_DETAILS: Record<'v' | 'p' | 'k', DoshaDetail> = {
  v: {
    name: 'Vata',
    color: '#2e6e96',
    element: 'Ākāsha (Ether) + Vāyu (Air)',
    classical: 'Charaka Samhita (CS. Sūtrasthāna 20) defines Vata Prakriti by the Gunas: Ruksha (rough), Laghu (light), Chala (mobile), Bahu (abundant), Shighra (swift), Sheeta (cold), Parusha (coarse), Vishada (clear). These qualities manifest in every aspect of the person — body, digestion, mind and behaviour.',
    desc: 'Vata is the dosha of movement and communication — governing all nerve impulses, circulation, respiration, and creative expression. You are a naturally dynamic, quick, and imaginative person driven by the energy of Air and Ether.',
    traits: ['Creative', 'Quick Mind', 'Adaptable', 'Enthusiastic', 'Expressive', 'Sensitive', 'Intuitive'],
    why: 'Your responses across all three domains consistently reflect the core Vata qualities of lightness (laghu), mobility (chala), roughness (ruksha) and coldness (sheeta). Your thin or light frame with prominent joints, dry skin, small/quick eyes, irregular digestion, variable bowel habits, light sleep and tendency toward anxiety under stress are the most classically reliable physical signs of Vata Prakriti as described in Charaka and Sushruta Samhita.',
    imbalance: ['Anxiety, worry, restlessness or insomnia', 'Constipation, bloating, gas and irregular digestion', 'Dry skin, chapped lips, cracking joints', 'Cold hands and feet; poor circulation', 'Scattered focus, forgetfulness, feeling overwhelmed', 'Underweight or difficulty maintaining weight', 'Muscle spasms, twitches or nervous tension'],
    foods: {
      principle: 'Vata is balanced by opposite qualities: warm, oily, heavy, moist and grounding foods. Favour sweet (madhura), sour (amla) and salty (lavana) tastes.',
      prefer: ['Warm cooked grains: rice, wheat, oats, quinoa', 'Root vegetables: sweet potato, carrot, beetroot', 'Healthy fats: ghee, sesame oil, olive oil', 'Warming spices: ginger, cumin, cinnamon, asafoetida', 'Mung dal and red lentils (well-spiced, cooked soft)', 'Warm golden milk with ghee at bedtime', 'Sweet ripe fruits: mangoes, bananas, dates, figs', 'Soups, stews and khichdi — especially in winter'],
      avoid: ['Raw salads, cold or dry foods', 'Popcorn, crackers, dry cereal, chips', 'Cold drinks and ice cream', 'Most beans unless well-soaked and spiced', 'Fasting or skipping meals', 'Refined and processed foods'],
    },
    lifestyle: {
      principle: 'Vata is pacified by routine, warmth and stability. Dinacharya (daily routine) is the single most important Vata practice.',
      prefer: ['Strict daily routine — same wake, meal and sleep times', 'Warm sesame oil Abhyanga (self-massage) every morning', 'Early bedtime — by 10 PM; minimum 7–8 hours sleep', 'Gentle yoga, pranayama and meditation daily', 'Warm, quiet, uncluttered living spaces'],
      avoid: ['Erratic schedules, irregular meals or late nights', 'Excessive travel, screen time or sensory stimulation', 'Prolonged fasting or undereating', 'Exposure to cold, dry, windy weather without protection', 'Overcommitting or spreading attention too thin'],
    },
    exercise: {
      principle: 'Vata types need grounding, warming and low-impact movement. Consistency matters more than intensity.',
      prefer: ['Hatha yoga, restorative yoga or Yin yoga', 'Slow, mindful walking in nature', 'Swimming in warm water', 'Tai Chi, Qigong or gentle dance', 'Pranayama — Nadi Shodhana and Bhramari'],
      avoid: ['HIIT and high-intensity training', 'Long distance running or extreme endurance', 'Erratic or irregular workout schedules', 'Cold-weather outdoor exercise', 'Exercising when fatigued'],
    },
    rhythm: [
      { time: '6–7 AM',  action: 'Wake before sunrise. Warm water with lemon. Abhyanga oil massage.' },
      { time: '7–9 AM',  action: 'Gentle yoga or walking. Warm nourishing breakfast.' },
      { time: '12–1 PM', action: 'Largest meal of the day. Warm cooked food. Eat mindfully, seated.' },
      { time: '5–6 PM',  action: 'Light herbal tea or snack. Avoid heavy exercise.' },
      { time: '7–8 PM',  action: 'Light warm dinner. No screens after 9 PM.' },
      { time: '10 PM',   action: 'In bed by 10 PM. Gentle reading or meditation.' },
    ],
    herbs: [
      { name: 'Ashwagandha',  sanskrit: 'Withania somnifera',      use: 'The premier Vata tonic — builds ojas (vital essence), calms the nervous system and grounds scattered Vata energy. Especially powerful at bedtime.', icon: '🌿' },
      { name: 'Shatavari',    sanskrit: 'Asparagus racemosus',     use: 'Deeply nourishing and moistening — counters the dryness of Vata. Supports reproductive health and all building (brumhana) therapies.', icon: '🌱' },
      { name: 'Bala',         sanskrit: 'Sida cordifolia',         use: 'Strengthens muscles, nerves and the heart. Gives stamina and endurance to Vata types prone to depletion.', icon: '💪' },
      { name: 'Haritaki',     sanskrit: 'Terminalia chebula',      use: 'The "king of medicines" for Vata. Gently lubricates and relieves constipation, the most common Vata complaint.', icon: '👑' },
      { name: 'Brahmi',       sanskrit: 'Bacopa monnieri',         use: 'Calms and clarifies the mind. Reduces anxiety and mental restlessness — the hallmarks of excess Vata in the nervous system.', icon: '🧠' },
      { name: 'Sesame',       sanskrit: 'Sesamum indicum',         use: 'Used internally and externally. Warm sesame oil Abhyanga is the single most effective daily Vata-pacifying practice in Ayurveda.', icon: '🟡' },
    ],
    seasons: [
      { name: 'Autumn',      tip: 'Vata peaks in autumn — the most critical season. Eat warm oily foods, keep strictly warm, follow routine.', active: true, icon: '🍂' },
      { name: 'Winter',      tip: 'Vata continues high. Warm baths, nourishing foods and early bedtimes are essential protection.', active: false, icon: '❄️' },
      { name: 'Spring',      tip: 'Vata naturally calms. Use spring to build strength and nourishment for the rest of the year.', active: false, icon: '🌱' },
      { name: 'Summer',      tip: 'Vata is generally comfortable in warmth. Avoid overheating and stay hydrated.', active: false, icon: '☀️' },
    ],
  },
  p: {
    name: 'Pitta',
    color: '#b04020',
    element: 'Agni (Fire) + Āpa (Water)',
    classical: 'Charaka Samhita defines Pitta Gunas as: Ushna (hot), Tikshna (sharp/penetrating), Drava (liquid), Sara (spreading), Laghu (light), Snigdha (slightly oily) and Amla (slightly sour). Pitta is the transformer — governing metabolism, digestion, body temperature and intelligence.',
    desc: 'Pitta is the dosha of transformation and discernment — governing digestion, metabolism, body temperature and sharp intellect. As a Pitta-dominant person you are driven by Fire and Water, giving you focus, passion, natural leadership and a powerful digestive fire.',
    traits: ['Focused', 'Ambitious', 'Intelligent', 'Decisive', 'Leader', 'Passionate', 'Courageous'],
    why: 'Your answers across all three domains reflect Pitta\'s core qualities of heat (ushna), sharpness (tikshna) and spreading intensity (sara). Your medium athletic build, sharp penetrating eyes, warm or oily skin prone to redness, profuse sweating and strong body odour are classical Sushruta Pitta signs. Your sharp reliable appetite (tikshna agni) and preference for cool weather are strong indicators.',
    imbalance: ['Heartburn, hyperacidity, inflammation or ulcers', 'Skin rashes, hives, psoriasis or acne', 'Excessive sweating or strong body odour', 'Irritability, anger, impatience or short temper', 'Perfectionism, over-criticism of self and others', 'Eye inflammation or sensitivity to light', 'Early greying, thinning hair or premature balding'],
    foods: {
      principle: 'Pitta is pacified by cooling, slightly dry, sweet and bitter foods. Favour sweet (madhura), bitter (tikta) and astringent (kashaya) tastes. Strictly reduce pungent, sour and salty.',
      prefer: ['Cooling grains: rice, wheat, barley, oats', 'Sweet cooling vegetables: cucumber, zucchini, leafy greens', 'Fresh coconut and coconut water', 'Ghee — one of the best Pitta pacifiers', 'Sweet ripe fruits: mangoes, grapes, melons, pomegranate', 'Cooling teas: fennel, coriander, rose, mint, licorice', 'Mung beans, chickpeas and most legumes'],
      avoid: ['Hot and spicy foods: chilli, mustard, raw garlic', 'Sour foods: vinegar, tomatoes, citrus, fermented foods', 'Fried and oily restaurant foods', 'Alcohol — intensely heating', 'Caffeine in excess', 'Skipping meals when hungry'],
    },
    lifestyle: {
      principle: 'Pitta is pacified by cooling, non-competitive and compassionate practices. The Pitta trap is overwork and perfectionism.',
      prefer: ['Time near water: rivers, lakes, the ocean', 'Evening walks in moonlight or cool air', 'Loving-kindness (Metta) meditation', 'Creative outlets with no performance pressure', 'Cooling Pranayama: Sheetali and Sheetkari breath'],
      avoid: ['Overworking and perfectionism', 'Highly competitive environments when stressed', 'Midday sun and intense heat exposure', 'Bottling up frustration', 'Pushing through exhaustion with stimulants'],
    },
    exercise: {
      principle: 'Pitta benefits from cooling, moderate and non-competitive exercise. Avoid midday heat. Swimming is ideal for Pitta in classical texts.',
      prefer: ['Swimming — the most cooling exercise for Pitta', 'Hiking or cycling in cool shaded environments', 'Evening walks in fresh air', 'Moon Salutations, Yin and restorative yoga', 'Water sports: kayaking, surfing, rowing'],
      avoid: ['Exercising in direct midday heat or hot rooms', 'Bikram or hot yoga', 'Intense competitive sports when stressed', 'Pushing through fatigue or injury'],
    },
    rhythm: [
      { time: '6–7 AM',  action: 'Wake at sunrise. Cool water splash. Brief meditation or journalling.' },
      { time: '7–9 AM',  action: 'Moderate exercise in cool air. Light but nourishing breakfast.' },
      { time: '12–1 PM', action: 'Largest meal at midday when Pitta Agni is strongest. Eat without rushing.' },
      { time: '3–4 PM',  action: 'Avoid outdoor activity in peak heat. Cool herbal tea.' },
      { time: '6–7 PM',  action: 'Evening walk or swim. Light, cooling dinner.' },
      { time: '10 PM',   action: 'In bed by 10 PM. Avoid stimulating work or screens late at night.' },
    ],
    herbs: [
      { name: 'Amalaki',    sanskrit: 'Emblica officinalis',     use: 'The premier Pitta herb. The richest natural source of Vitamin C — cooling, deeply nourishing, anti-inflammatory and rejuvenating for liver and eyes.', icon: '🍈' },
      { name: 'Shatavari',  sanskrit: 'Asparagus racemosus',     use: 'Cooling, sweet and deeply moistening. Reduces inflammation, supports the liver and calms the intensity of Pitta in the blood.', icon: '🌱' },
      { name: 'Neem',       sanskrit: 'Azadirachta indica',      use: 'Intensely bitter and cooling. Clears Pitta heat from the blood, skin and liver. One of the most powerful anti-inflammatory herbs in Ayurveda.', icon: '🍃' },
      { name: 'Rose',       sanskrit: 'Rosa centifolia',         use: 'Cools Pitta in the heart and emotions. Rose water and rose petal jam (Gulkand) are classic Pitta remedies for internal heat and irritability.', icon: '🌹' },
      { name: 'Turmeric',   sanskrit: 'Curcuma longa',           use: 'Anti-inflammatory and liver-protective. Clears Pitta from the gut, blood and skin while supporting bile flow and digestion.', icon: '💛' },
      { name: 'Bhringraj',  sanskrit: 'Eclipta alba',            use: 'Cools Pitta specifically in the head and liver. Treats early greying, thinning hair and liver inflammation caused by excess heat.', icon: '💆' },
    ],
    seasons: [
      { name: 'Summer',     tip: 'Pitta peaks in summer — the most critical season. Cooling foods, avoid midday sun, take coconut water daily.', active: true, icon: '☀️' },
      { name: 'Late Spring', tip: 'Pitta begins building. Start cooling practices: rose water, cucumber, reduce spicy food.', active: false, icon: '🌱' },
      { name: 'Autumn',     tip: 'Pitta naturally cools down. Good time for moderate cleansing and liver-supporting herbs.', active: false, icon: '🍂' },
      { name: 'Winter',     tip: 'Pitta well-pacified. You can enjoy warming foods without concern. Focus on building strength.', active: false, icon: '❄️' },
    ],
  },
  k: {
    name: 'Kapha',
    color: '#2a6840',
    element: 'Prthvi (Earth) + Āpa (Water)',
    classical: 'Charaka Samhita defines Kapha Gunas as: Guru (heavy), Manda (slow/dull), Hima (cool), Snigdha (oily/smooth), Shlakshna (smooth), Mritsna (slimy/soft) and Sthira (stable/immobile). These qualities give Kapha its characteristic stability, endurance and deep compassion.',
    desc: 'Kapha is the dosha of structure and cohesion — governing all anabolic processes, immunity, lubrication and long-term memory. As a Kapha-dominant person you are driven by Earth and Water, giving you natural endurance, deep loyalty, physical strength and emotional stability.',
    traits: ['Compassionate', 'Patient', 'Enduring', 'Loyal', 'Grounded', 'Strong', 'Nurturing'],
    why: 'Your answers across all three domains consistently reflect the core Kapha qualities of heaviness (guru), stability (sthira), coolness (hima) and smoothness (snigdha). Your broad or solid frame, smooth skin, large calm eyes, slow sleep and tendency to withdraw under stress are reliable signs.',
    imbalance: ['Weight gain, water retention or difficulty losing weight', 'Lethargy, sluggishness and excessive sleep', 'Congestion, mucus buildup or respiratory issues', 'Depression, emotional heaviness or attachment', 'Slow digestion, nausea or low appetite', 'High cholesterol or sluggish lymphatic function', 'Resistance to change, possessiveness or complacency'],
    foods: {
      principle: 'Kapha is pacified by light, dry, warm and stimulating foods. Favour pungent (katu), bitter (tikta) and astringent (kashaya) tastes. Minimise sweet, sour and salty.',
      prefer: ['Light grains: barley, millet, buckwheat, corn', 'Bitter vegetables: leafy greens, bitter gourd, eggplant', 'Legumes: most beans and lentils are excellent for Kapha', 'Warm stimulating spices: ginger, black pepper, mustard, trikatu', 'Light fruits: apples, pears, pomegranate, cranberries', 'Warm water and herbal teas throughout the day', 'Honey (raw, never heated) — the only sweet that pacifies Kapha'],
      avoid: ['Dairy products — especially cheese, yoghurt, ice cream', 'Wheat, heavy bread and pastries', 'Sugar and most sweeteners', 'Cold, raw and heavy foods', 'Fried or oily foods', 'Overeating or eating when not truly hungry'],
    },
    lifestyle: {
      principle: 'Kapha is pacified by stimulation, movement, warmth and change. Routine is helpful but must include vigorous daily activity.',
      prefer: ['Wake before 6 AM without exception — sleep through Kapha time (6–10 AM) massively aggravates', 'Vigorous daily exercise — 45 minutes minimum, every day', 'Dry brushing (Garshana) with silk gloves before showers', 'Warm and stimulating environments; regular travel and new experiences', 'Regular social engagement and new challenges'],
      avoid: ['Sleeping during the day or past sunrise', 'Sedentary work without regular movement breaks', 'Emotionally heavy or passive environments', 'Excessive routine without stimulation or change', 'Cold, damp and heavy weather without protection'],
    },
    exercise: {
      principle: 'Kapha requires vigorous, sustained and warming exercise above all other doshas. Daily commitment is non-negotiable for Kapha wellbeing.',
      prefer: ['Vigorous running, cycling or rowing', 'High-energy group fitness or team sports', 'Vigorous vinyasa yoga or power yoga', 'Dancing, aerobics or any high-energy movement', 'Morning exercise before 10 AM to counter Kapha peak'],
      avoid: ['Low-intensity or purely restorative exercise as a primary practice', 'Skipping exercise days — consistency is critical for Kapha', 'Cool or cold-weather exercise without warming up thoroughly', 'Sedentary hobbies substituting for physical movement'],
    },
    rhythm: [
      { time: '5:30–6 AM', action: 'Wake before sunrise. Dry brush then warm shower. Do not linger in bed.' },
      { time: '6–7 AM',    action: 'Vigorous exercise — run, cycle or power yoga. Non-negotiable.' },
      { time: '8 AM',      action: 'Light, warm and dry breakfast. Ginger tea with honey.' },
      { time: '12–1 PM',   action: 'Moderate lunch. Avoid overeating. Warm spiced food.' },
      { time: '4–5 PM',    action: 'Light walk or movement. Avoid snacking or sitting for long periods.' },
      { time: '7 PM',      action: 'Light early dinner. Finish eating by 7:30 PM if possible.' },
    ],
    herbs: [
      { name: 'Trikatu',    sanskrit: 'Piper longum + Piper nigrum + Zingiber', use: 'The most important Kapha formula — three pungent herbs that kindle Agni, burn ama (toxins) and scrape Kapha from the channels.', icon: '🌶️' },
      { name: 'Guggul',     sanskrit: 'Commiphora mukul',                       use: 'Deep scraping and detoxifying resin. Clears excess Kapha from channels, reduces cholesterol and supports healthy weight.', icon: '🪵' },
      { name: 'Ginger',     sanskrit: 'Zingiber officinale',                    use: 'The universal Kapha medicine. Stimulates Agni, breaks up mucus and congestion and warms the cold Kapha constitution.', icon: '🫚' },
      { name: 'Punarnava',  sanskrit: 'Boerhavia diffusa',                      use: 'Reduces water retention and Kapha-related swelling. Rejuvenates the kidneys and lymphatic system.', icon: '🌿' },
      { name: 'Honey',      sanskrit: 'Madhu',                                  use: 'The only sweet substance that pacifies Kapha (raw, never heated). Scrapes excess Kapha and reduces ama when taken with warm water.', icon: '🍯' },
      { name: 'Tulsi',      sanskrit: 'Ocimum sanctum',                         use: 'Warming, expectorant and immuno-stimulating. Clears Kapha from the respiratory tract and elevates mood and energy.', icon: '🌿' },
    ],
    seasons: [
      { name: 'Spring',  tip: 'Kapha peaks in spring — most critical season. Vigorous exercise and light eating are essential. Risk of congestion and lethargy.', active: true, icon: '🌱' },
      { name: 'Winter',  tip: 'Kapha accumulates in cold. Eat warm spiced foods, exercise daily, avoid dairy and sweets.', active: false, icon: '❄️' },
      { name: 'Summer',  tip: 'Kapha naturally pacified by heat and dryness. Your best season for energy and clarity.', active: false, icon: '☀️' },
      { name: 'Autumn',  tip: 'Kapha remains comfortable. Maintain exercise routine and avoid emotional eating as cold approaches.', active: false, icon: '🍂' },
    ],
  }
};

export const DOSHA_MAP = {
  Vata: 'v',
  Pitta: 'p',
  Kapha: 'k',
} as const;

export const DOSHA_ICONS = {
  v: '🌬️',
  p: '🔥',
  k: '🌊',
} as const;
