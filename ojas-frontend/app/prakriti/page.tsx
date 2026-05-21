'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { usePrakritiStore } from '../store/prakritiStore';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { useRouter } from 'next/navigation';

const PRAKRITI_QUESTIONS = [
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

const DOSHA_DETAILS = {
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

const DOSHA_MAP = {
  Vata: 'v',
  Pitta: 'p',
  Kapha: 'k',
};

const DOSHA_ICONS = {
  v: '🌬️',
  p: '🔥',
  k: '🌊',
};

export default function PrakritiPage() {
  const router = useRouter();
  const { setPrakriti } = usePrakritiStore();
  const { user, setDoshaComposition } = useUserStore();
  const { cycle } = useCycleStore();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [history, setHistory] = useState<Array<'Vata' | 'Pitta' | 'Kapha'>>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Tab & Context States for Results page
  const [activeTab, setActiveTab] = useState<'overview' | 'bodymind' | 'diet' | 'lifestyle' | 'rhythms'>('overview');
  const [dualCtx, setDualCtx] = useState<'pri' | 'sec'>('pri');

  // Rhythm Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // BMI States
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null);

  // Copy success indicator
  const [copied, setCopied] = useState(false);

  // Check saved state on mount or user load to show results directly if taken
  useEffect(() => {
    const saved = localStorage.getItem('prakriti');
    let parsed: { vata: number; pitta: number; kapha: number } | null = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if ((!parsed || !parsed.vata) && user?.doshaComposition && user?.dominantDosha) {
      parsed = user.doshaComposition;
      localStorage.setItem('prakriti', JSON.stringify(user.doshaComposition));
      localStorage.setItem('dominantPrakriti', user.dominantDosha);
    }

    if (parsed) {
      if (parsed.vata !== undefined && parsed.pitta !== undefined && parsed.kapha !== undefined) {
        const total = parsed.vata + parsed.pitta + parsed.kapha;
        if (total > 0) {
          setScores({
            Vata: Math.round((parsed.vata / 100) * 18),
            Pitta: Math.round((parsed.pitta / 100) * 18),
            Kapha: Math.round((parsed.kapha / 100) * 18),
          });
          setSubmitted(true);
        }
      }
    }
  }, [user]);

  // Load checklist state when submitted is true
  useEffect(() => {
    if (submitted) {
      try {
        const stored = localStorage.getItem('ojas_checklist_state');
        if (stored) setChecklist(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, [submitted]);


  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const dosha = question.opts[selectedOption].d as 'Vata' | 'Pitta' | 'Kapha';

    const newScores = {
      ...scores,
      [dosha]: scores[dosha] + 1,
    };
    setScores(newScores);
    setHistory([...history, dosha]);

    setSelectedOption(null);

    if (currentQuestion < PRAKRITI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit(newScores);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    
    const newHistory = [...history];
    const lastDosha = newHistory.pop();
    
    if (lastDosha) {
      setScores({
        ...scores,
        [lastDosha]: Math.max(0, scores[lastDosha] - 1),
      });
    }

    setHistory(newHistory);
    setSelectedOption(null);
    setCurrentQuestion(currentQuestion - 1);
  };

  // Keyboard navigation for the quiz
  useEffect(() => {
    if (submitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing in form inputs
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'a') {
        setSelectedOption(0);
      } else if (key === 'b') {
        setSelectedOption(1);
      } else if (key === 'c') {
        setSelectedOption(2);
      } else if (e.key === 'ArrowRight') {
        if (selectedOption !== null) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQuestion > 0) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted, selectedOption, currentQuestion, handleNext, handleBack]);

  const handleSubmit = (finalScores: typeof scores) => {
    const total = finalScores.Vata + finalScores.Pitta + finalScores.Kapha;
    
    const calculatedPrakriti = {
      vata: Math.round((finalScores.Vata / total) * 100),
      pitta: Math.round((finalScores.Pitta / total) * 100),
      kapha: Math.round((finalScores.Kapha / total) * 100),
    };

    const entries = Object.entries(calculatedPrakriti);
    const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    const dominantPrakriti = dominant.charAt(0).toUpperCase() + dominant.slice(1);

    setPrakriti(calculatedPrakriti);
    setDoshaComposition(calculatedPrakriti, dominantPrakriti);
    setSubmitted(true);
  };

  const handleRetake = () => {
    const confirmRetake = window.confirm("Are you sure? This will replace your current Prakriti results.");
    if (!confirmRetake) return;

    setScores({ Vata: 0, Pitta: 0, Kapha: 0 });
    setHistory([]);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCalculatedBmi(null);
    localStorage.removeItem('prakriti');
    localStorage.removeItem('dominantPrakriti');
    localStorage.removeItem('prakriti_quiz_progress');
    localStorage.removeItem('prakriti_quiz_answers');

    setDoshaComposition({ vata: 0, pitta: 0, kapha: 0 }, '');
  };

  const getNextStepRouteAndLabel = () => {
    const isFemale = user?.gender !== 'male';
    const hasCycle = cycle?.startDate || user?.menstrualCycleStart;
    const hasMusic = (user?.musicPreferences && user.musicPreferences.length > 0) || (typeof window !== 'undefined' && localStorage.getItem('musicPreferencesSet') === 'true');

    if (isFemale && !hasCycle) {
      return { route: '/cycle', label: 'CONTINUE TO MOON SYNC →' };
    } else if (!hasMusic) {
      return { route: '/music', label: 'CONTINUE TO SOUND SANCTUARY →' };
    } else {
      return { route: '/dashboard', label: 'GO TO DASHBOARD →' };
    }
  };

  const handleToggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem('ojas_checklist_state', JSON.stringify(updated));
  };

  const handleCalculateBmi = () => {
    let w = 0;
    let h = 0;
    if (bmiUnit === 'metric') {
      const kg = parseFloat(weightKg);
      const cm = parseFloat(heightCm);
      if (kg > 0 && cm > 0) {
        w = kg;
        h = cm / 100;
      }
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      if (lbs > 0 && (ft > 0 || inch > 0)) {
        w = lbs * 0.453592;
        h = (ft * 12 + inch) * 0.0254;
      }
    }

    if (w > 0 && h > 0) {
      setCalculatedBmi(w / (h * h));
    }
  };

  const handleCopyLink = () => {
    const shareURL = `${window.location.origin}/prakriti#r/${domKey}/${scores.Vata}-${scores.Pitta}-${scores.Kapha}/${encodeURIComponent(user?.name || 'Soul')}`;
    navigator.clipboard.writeText(shareURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const progress = ((currentQuestion + 1) / PRAKRITI_QUESTIONS.length) * 100;
  const question = PRAKRITI_QUESTIONS[currentQuestion];

  // Calculated parameters for results
  const tot = 18;
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const dominantDoshaName = sortedScores[0][0] as 'Vata' | 'Pitta' | 'Kapha';
  const secondaryDoshaName = sortedScores[1][0] as 'Vata' | 'Pitta' | 'Kapha';

  const domKey = DOSHA_MAP[dominantDoshaName] as 'v' | 'p' | 'k';
  const secKey = DOSHA_MAP[secondaryDoshaName] as 'v' | 'p' | 'k';

  const domPct = Math.round((scores[dominantDoshaName] / tot) * 100);
  const secPct = Math.round((scores[secondaryDoshaName] / tot) * 100);
  const isDual = secPct >= 28;

  const d = DOSHA_DETAILS[domKey];
  const s = DOSHA_DETAILS[secKey];

  const bV = Math.round((scores.Vata / tot) * 100);
  const bP = Math.round((scores.Pitta / tot) * 100);
  const bK = Math.round((scores.Kapha / tot) * 100);

  // Active details to show in cards based on Dual Context selection
  const activeDosha = dualCtx === 'pri' ? d : s;
  const activeKey = dualCtx === 'pri' ? domKey : secKey;

  // SVG Chart calculation parameters
  // Radius r=30, Circumference C = 188.5
  const circ = 188.5;
  const vataLength = (bV / 100) * circ;
  const pittaLength = (bP / 100) * circ;
  const kaphaLength = (bK / 100) * circ;

  // BMI calculations
  const bmiShift = -2.0 * (scores.Vata / 18) + 2.5 * (scores.Kapha / 18);
  const getBmiAssessment = (bmiVal: number) => {
    const s_under = 16.0 + bmiShift;
    const under = 18.5 + bmiShift;
    const over = 25.0 + bmiShift;
    const obese = 30.0 + bmiShift;

    if (bmiVal < s_under) {
      return {
        state: 'Severely Underweight',
        sanskrit: 'Atikarshya / Severe Dhatu Kshaya',
        color: '#ef4444',
        advice: domKey === 'v' 
          ? 'Vata depletion requires deep, warm nourishment (ghee, root veg, cooked grains).' 
          : 'Aggressive tissue depletion detected. Strongly prioritize heavy, grounding foods.'
      };
    } else if (bmiVal < under) {
      return {
        state: 'Underweight',
        sanskrit: 'Karshya / Ama Deficiency',
        color: '#C27A5D',
        advice: domKey === 'v' 
          ? 'This is common for Vata constitutions, but ensure you maintain internal strength. Add healthy fats to every meal.' 
          : 'Below ideal weight for your body type. Focus on rebuilding tissues (Brimhana therapy).'
      };
    } else if (bmiVal < over) {
      return {
        state: 'Ideal / Balanced',
        sanskrit: 'Sama Agni',
        color: '#2a6840',
        advice: 'Your weight perfectly aligns with your Prakriti balance. Maintain your current daily rhythms.'
      };
    } else if (bmiVal < obese) {
      return {
        state: 'Overweight',
        sanskrit: 'Sthula / Ama Accumulation',
        color: '#C27A5D',
        advice: domKey === 'k' 
          ? 'Kapha is naturally denser, but you are leaning past ideal. Increase daily movement and favor warm, spiced, light foods.' 
          : 'Ama (toxins) may be accumulating. Favor fasting or lighter, easily digestible meals.'
      };
    } else {
      return {
        state: 'Obese',
        sanskrit: 'Atisthula / Medo Roga',
        color: '#ef4444',
        advice: 'Significant tissue accumulation. Daily vigorous exercise (Vyayama) and strict Kapha-reducing diet recommended.'
      };
    }
  };

  const getBmiColor = (bmiVal: number) => {
    return getBmiAssessment(bmiVal).color;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#C27A5D]/10 transition-colors duration-500">
        <div>
          <Header />

          {/* Sticky Pane Selector Sub-tabs */}
          <div className="sticky top-[73px] z-30 bg-[#F4EFEA]/95 dark:bg-[#1C1917]/95 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/80 py-3 mb-8 animate-fade-rise">
            <div className="max-w-2xl mx-auto px-4 flex justify-between gap-1 overflow-x-auto scrollbar-none">
              {([
                { id: 'overview', label: 'Overview' },
                { id: 'bodymind', label: 'Body & Mind' },
                { id: 'diet', label: 'Diet' },
                { id: 'lifestyle', label: 'Lifestyle' },
                { id: 'rhythms', label: 'Rhythms' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#1C1917] dark:bg-[#FAF6F0] text-white dark:text-[#1C1917] shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-200/30 dark:bg-stone-800/40 hover:bg-stone-200/60 dark:hover:bg-stone-800/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Dosha Focus Toggle Banner (if dual-dosha) */}
          {isDual && activeTab !== 'overview' && (
            <div className="max-w-2xl mx-auto px-6 mb-6 animate-fade-rise">
              <div className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-200/30 dark:border-stone-800 p-2 rounded-2xl flex justify-between gap-2 shadow-sm">
                <button
                  onClick={() => setDualCtx('pri')}
                  className={`flex-1 py-3 px-4 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                    dualCtx === 'pri'
                      ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-bold border border-stone-200 dark:border-stone-800 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-[#C27A5D] mb-0.5">PRIMARY</span>
                  <span className="font-serif italic text-base">{d.name} · {domPct}%</span>
                </button>
                <button
                  onClick={() => setDualCtx('sec')}
                  className={`flex-1 py-3 px-4 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                    dualCtx === 'sec'
                      ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-bold border border-stone-200 dark:border-stone-800 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-[#C27A5D] mb-0.5">SECONDARY</span>
                  <span className="font-serif italic text-base">{s.name} · {secPct}%</span>
                </button>
              </div>
            </div>
          )}

          <main className="max-w-2xl mx-auto px-6 pb-16 w-full space-y-8">
            
            {/* OVERVIEW PANE */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Hero Card */}
                <div className="w-full bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] text-center flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold mb-4 block">
                    NAMASTE, {user?.name?.toUpperCase() || 'BEAUTIFUL SOUL'} 🙏
                  </span>

                  {isDual ? (
                    <>
                      {/* Dual Icons */}
                      <div className="flex items-center gap-4 text-4xl mb-6">
                        <span className="w-16 h-16 rounded-full bg-white/55 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 flex items-center justify-center shadow-sm animate-float">
                          {DOSHA_ICONS[domKey]}
                        </span>
                        <span className="text-stone-300 font-serif font-light text-2xl">×</span>
                        <span className="w-16 h-16 rounded-full bg-white/55 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 flex items-center justify-center shadow-sm animate-float" style={{ animationDelay: '1.5s' }}>
                          {DOSHA_ICONS[secKey]}
                        </span>
                      </div>

                      <h1 className="text-4xl font-normal font-instrument-serif text-[#1C1917] dark:text-[#FAF6F0] leading-tight mb-4">
                        <span style={{ color: d.color }}>{d.name}</span>
                        <span className="text-stone-300 font-light font-sans mx-2">–</span>
                        <span style={{ color: s.color }}>{s.name}</span>
                      </h1>
                      
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-bold mb-4 block">
                        Dual Dosha Prakriti
                      </span>

                      <p className="text-stone-500 dark:text-stone-400 font-inter text-sm leading-relaxed max-w-lg mb-6">
                        Most people carry a <strong>dual dosha constitution</strong>. Your primary is <strong style={{ color: d.color }}>{d.name} ({domPct}%)</strong> with a significant secondary <strong style={{ color: s.color }}>{s.name} ({secPct}%)</strong>.
                        Switch categories above or use the toggles to review localized guidelines for both.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Single Icon */}
                      <div className="w-20 h-20 rounded-full bg-white/50 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 flex items-center justify-center text-4xl shadow-sm animate-float mb-6">
                        {DOSHA_ICONS[domKey]}
                      </div>

                      <h1 className="text-4xl sm:text-5xl font-normal font-instrument-serif text-[#1C1917] dark:text-[#FAF6F0] leading-tight mb-2">
                        <span style={{ color: d.color }}>{d.name} Predominance</span>
                      </h1>

                      <p className="text-stone-400 font-mono text-[10px] uppercase tracking-widest mb-6">
                        {d.element}
                      </p>

                      <p className="text-stone-500 dark:text-stone-400 font-inter text-sm leading-relaxed max-w-lg mb-6">
                        Your constitution shows strong single-dosha predominance ({domPct}% {d.name}). Classical texts note this is relatively rare and denotes clear energy alignment.
                      </p>

                      <p className="text-stone-700 dark:text-stone-300 font-serif italic text-base leading-relaxed max-w-xl p-5 bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-2xl mb-6">
                        &ldquo;{d.desc}&rdquo;
                      </p>
                    </>
                  )}

                  {/* Score row pills */}
                  <div className="flex flex-wrap justify-center gap-3 w-full border-t border-stone-200/30 dark:border-stone-800 pt-6 mt-2">
                    <span className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${domKey === 'v' ? 'bg-[#2e6e96]/10 border-[#2e6e96]/30 text-[#2e6e96] font-bold' : 'bg-white/50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {DOSHA_ICONS.v} VATA {scores.Vata}/{tot}
                    </span>
                    <span className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${domKey === 'p' ? 'bg-[#b04020]/10 border-[#b04020]/30 text-[#b04020] font-bold' : 'bg-white/50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {DOSHA_ICONS.p} PITTA {scores.Pitta}/{tot}
                    </span>
                    <span className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${domKey === 'k' ? 'bg-[#2a6840]/10 border-[#2a6840]/30 text-[#2a6840] font-bold' : 'bg-white/50 dark:bg-stone-950 border-stone-200/60 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {DOSHA_ICONS.k} KAPHA {scores.Kapha}/{tot}
                    </span>
                  </div>

                  {/* Traits List */}
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {d.traits.map((trait, i) => (
                      <span key={i} className="px-3 py-1 bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border border-stone-200/20 dark:border-stone-850">
                        {trait}
                      </span>
                    ))}
                    {isDual && s.traits.slice(0, 3).map((trait, i) => (
                      <span key={i} className="px-3 py-1 bg-stone-100/50 dark:bg-stone-900/40 text-stone-500 dark:text-stone-400 rounded-full text-[10px] font-mono uppercase tracking-wider opacity-70 border border-stone-200/10 dark:border-stone-850">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dual Description Grid (if dual-dosha) */}
                {isDual && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-6 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{DOSHA_ICONS[domKey]}</span>
                        <div>
                          <h4 className="font-serif italic text-lg text-stone-900 dark:text-[#FAF6F0] font-normal">Primary · {d.name}</h4>
                          <span className="text-[9px] font-mono text-[#C27A5D] uppercase tracking-wider">{domPct}% Predominance</span>
                        </div>
                      </div>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mb-3 font-inter">
                        {d.desc}
                      </p>
                      <p className="text-stone-400 font-mono text-[9px] uppercase tracking-widest">{d.element}</p>
                    </div>

                    <div className="bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-6 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{DOSHA_ICONS[secKey]}</span>
                        <div>
                          <h4 className="font-serif italic text-lg text-stone-900 dark:text-[#FAF6F0] font-normal">Secondary · {s.name}</h4>
                          <span className="text-[9px] font-mono text-[#C27A5D] uppercase tracking-wider">{secPct}% Predominance</span>
                        </div>
                      </div>
                      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mb-3 font-inter">
                        {s.desc}
                      </p>
                      <p className="text-stone-400 font-mono text-[9px] uppercase tracking-widest">{s.element}</p>
                    </div>
                  </div>
                )}

                {/* Classical Reference Card */}
                <div className="p-6 bg-[#FDF6EC] dark:bg-stone-950/60 border border-orange-100/50 dark:border-stone-850 rounded-3xl text-xs md:text-sm text-[#8A5A44] dark:text-stone-350 font-inter leading-relaxed italic shadow-[inset_0_1px_3px_rgba(28,25,22,0.01)]">
                  <p className="font-mono text-[10px] uppercase tracking-wider font-semibold mb-3 not-italic text-[#C27A5D]">
                    📜 CLASSICAL SAMHITA REFERENCE
                  </p>
                  <div>
                    <strong>{d.name}:</strong> {d.classical}
                  </div>
                  {isDual && (
                    <div className="mt-4 pt-4 border-t border-orange-200/20">
                      <strong>{s.name}:</strong> {s.classical}
                    </div>
                  )}
                </div>

                {/* Doughnut Chart & Breakdown card */}
                <div className="w-full bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] flex flex-col items-center">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-6 block self-start">
                    📊 DOSHA SCORE BREAKDOWN
                  </span>

                  {/* SVG-based Doughnut Chart */}
                  <div className="relative w-44 h-44 mb-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Vata Arc */}
                      {bV > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          fill="transparent"
                          stroke="#2e6e96"
                          strokeWidth="12"
                          strokeDasharray={`${vataLength} ${circ}`}
                          strokeDashoffset="0"
                          className="transition-all duration-1000 ease-out"
                        />
                      )}
                      {/* Pitta Arc */}
                      {bP > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          fill="transparent"
                          stroke="#b04020"
                          strokeWidth="12"
                          strokeDasharray={`${pittaLength} ${circ}`}
                          strokeDashoffset={`-${vataLength}`}
                          className="transition-all duration-1000 ease-out"
                        />
                      )}
                      {/* Kapha Arc */}
                      {bK > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          fill="transparent"
                          stroke="#2a6840"
                          strokeWidth="12"
                          strokeDasharray={`${kaphaLength} ${circ}`}
                          strokeDashoffset={`-${vataLength + pittaLength}`}
                          className="transition-all duration-1000 ease-out"
                        />
                      )}
                    </svg>
                    {/* Centered Emoji Icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl animate-float">{DOSHA_ICONS[domKey]}</span>
                    </div>
                  </div>

                  {/* Relative progress lines */}
                  <div className="w-full space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-1.5 text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2e6e96]" /> Vata</span>
                        <span>{bV}%</span>
                      </div>
                      <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2e6e96] h-full rounded-full transition-all duration-1000" style={{ width: `${bV}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-1.5 text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#b04020]" /> Pitta</span>
                        <span>{bP}%</span>
                      </div>
                      <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#b04020] h-full rounded-full transition-all duration-1000" style={{ width: `${bP}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider mb-1.5 text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2a6840]" /> Kapha</span>
                        <span>{bK}%</span>
                      </div>
                      <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2a6840] h-full rounded-full transition-all duration-1000" style={{ width: `${bK}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 font-mono leading-relaxed mt-6 uppercase tracking-wider">
                    CCRAS/AYUSH validated Prakriti assessment framework · 18 questions across Physical (Q1–6), Physiological (Q7–12) and Psychological (Q13–18).
                  </p>
                </div>

                {/* Experimental Dosha-Adjusted BMI Calculator Card */}
                <div className="w-full bg-white/40 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">⚖️</span>
                    <h3 className="font-serif italic text-xl text-stone-900 dark:text-[#FAF6F0] font-normal">Dosha-Adjusted BMI (Experimental)</h3>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                    Standard BMI assumes all frames are identical. Ayurveda recognizes **Vata** is naturally lighter and **Kapha** is naturally denser. Your unique Dosha shift adjusts your ideal weight zone by <strong className="text-stone-900 dark:text-[#FAF6F0]">{bmiShift > 0 ? '+' : ''}{bmiShift.toFixed(1)}</strong> points.
                  </p>

                  {/* Toggle Metric / Imperial */}
                  <div className="flex gap-2 p-1 bg-stone-200/35 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-850 rounded-2xl mb-6">
                    <button
                      onClick={() => { setBmiUnit('metric'); setCalculatedBmi(null); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        bmiUnit === 'metric' ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => { setBmiUnit('imperial'); setCalculatedBmi(null); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        bmiUnit === 'imperial' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>

                  {/* Metric Inputs */}
                  {bmiUnit === 'metric' ? (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">WEIGHT (KG)</label>
                        <input
                          type="number"
                          placeholder="e.g. 70"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-[#C27A5D] transition-all duration-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">HEIGHT (CM)</label>
                        <input
                          type="number"
                          placeholder="e.g. 175"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-[#C27A5D] transition-all duration-300 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">WEIGHT (LBS)</label>
                        <input
                          type="number"
                          placeholder="e.g. 150"
                          value={weightLbs}
                          onChange={(e) => setWeightLbs(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-[#C27A5D] transition-all duration-300 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">HEIGHT (FT)</label>
                          <input
                            type="number"
                            placeholder="e.g. 5"
                            value={heightFt}
                            onChange={(e) => setHeightFt(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-[#C27A5D] transition-all duration-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-stone-400 mb-1">HEIGHT (IN)</label>
                          <input
                            type="number"
                            placeholder="e.g. 9"
                            value={heightIn}
                            onChange={(e) => setHeightIn(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F4EFEA]/50 border border-stone-300/60 rounded-2xl text-stone-900 focus:outline-none focus:border-[#C27A5D] transition-all duration-300 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCalculateBmi}
                    className="w-full py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#1C1917] hover:bg-[#C27A5D] text-white transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    CALCULATE ADJUSTED BMI
                  </button>

                  {/* BMI Result Output Block */}
                  {calculatedBmi !== null && calculatedBmi > 0 && (
                    <div className="mt-8 pt-8 border-t border-stone-200/50 animate-fade-rise">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <span className="text-4xl sm:text-5xl font-serif text-stone-950 font-normal block leading-none">{calculatedBmi.toFixed(1)}</span>
                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block mt-1">Standard BMI</span>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-base font-serif italic block font-bold"
                            style={{ color: getBmiColor(calculatedBmi) }}
                          >
                            {getBmiAssessment(calculatedBmi).state}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block mt-0.5">
                            {getBmiAssessment(calculatedBmi).sanskrit}
                          </span>
                        </div>
                      </div>

                      {/* Custom Horizontal Gauge Chart */}
                      {(() => {
                        const underBound = 18.5 + bmiShift;
                        const overBound = 25.0 + bmiShift;

                        // Bounds clamping to 0-40 range for layout
                        const pctFill = Math.max(0, Math.min(100, (calculatedBmi / 40) * 100));
                        const idealLeft = Math.max(0, (underBound / 40) * 100);
                        const idealWidth = ((overBound - underBound) / 40) * 100;

                        return (
                          <div className="mb-6">
                            <div className="relative h-2 bg-stone-200/70 border border-stone-300/40 rounded-full my-8">
                              {/* Ideal Zone */}
                              <div
                                className="absolute h-full rounded-md border-x-2 border-emerald-500 bg-emerald-500/10"
                                style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }}
                              />
                              {/* Pin Marker */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full shadow-md bg-stone-950 border border-white transition-all duration-700"
                                style={{ left: `${pctFill}%` }}
                              >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C27A5D] text-white px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-bold">YOU</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase tracking-widest mt-2">
                              <span>&lt; {underBound.toFixed(1)}</span>
                              <span className="text-emerald-700 font-semibold">Dosha Ideal Zone</span>
                              <span>&gt; {overBound.toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Insight Advice Block */}
                      <div className="p-4 bg-[#FDF6EC] border border-orange-100/50 rounded-2xl text-xs sm:text-sm text-[#8A5A44] leading-relaxed">
                        <strong className="block text-[#C27A5D] font-mono text-[9px] uppercase tracking-wider font-bold mb-1">AYURVEDIC INSIGHT</strong>
                        {getBmiAssessment(calculatedBmi).advice}
                      </div>
                    </div>
                  )}
                </div>

                {/* Shareable Result URL card */}
                <div className="w-full bg-[#FDF6EC] border border-orange-200/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔗</span>
                    <div>
                      <h4 className="font-serif italic text-base text-stone-900 font-normal">Share Your Prakriti</h4>
                      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Let others discover their vital constitution</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-stone-900 hover:bg-[#C27A5D] text-white transition-all duration-300 cursor-pointer text-center"
                  >
                    {copied ? '✅ COPIED!' : 'COPY LINK'}
                  </button>
                </div>
              </div>
            )}

            {/* BODY & MIND PANE */}
            {activeTab === 'bodymind' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Why Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-4 block">
                    🔍 WHY THIS IS YOUR PRAKRITI
                  </span>
                  <p className="text-stone-700 font-serif italic text-base leading-relaxed">
                    &ldquo;{activeDosha.why}&rdquo;
                  </p>
                </div>

                {/* Imbalance Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    ⚠️ EARLY WARNING SIGNS OF IMBALANCE
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    When **{activeDosha.name}** becomes aggravated in your constitution, these are the early biological warning signs to watch for.
                  </p>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeDosha.imbalance.map((item, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 border border-stone-200/30 rounded-2xl text-stone-700 font-inter text-xs hover:border-[#C27A5D]/30 transition-all duration-300 flex items-center gap-3">
                        <span className="text-orange-300">✦</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DIET PANE */}
            {activeTab === 'diet' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Diet Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    🍽️ DIET — ĀHĀRA GUIDE
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    <strong>Principle:</strong> {activeDosha.foods.principle}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Favour Columns */}
                    <div className="p-5 bg-emerald-50/20 border border-emerald-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <span>✓</span> FAVOUR
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.foods.prefer.map((food, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reduce Columns */}
                    <div className="p-5 bg-orange-50/20 border border-orange-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span>✕</span> REDUCE / AVOID
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.foods.avoid.map((food, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Herb Dravyaguna Panel */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    🌿 CLASSICAL HERBS — DRAVYAGUNA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    These botanical herbs have been utilized for centuries to balance **{activeDosha.name}** dosha. Always consult a qualified Vaidya practitioner before initiating herbal protocols.
                  </p>

                  <div className="space-y-4">
                    {activeDosha.herbs.map((herb, idx) => (
                      <div key={idx} className="p-4 bg-white/60 border border-stone-200/40 rounded-2xl flex items-start gap-4 hover:border-[#C27A5D]/30 transition-all duration-300">
                        <span className="text-3xl p-2 bg-stone-50 border border-stone-200/30 rounded-xl">{herb.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-serif italic text-base text-stone-900 font-bold">{herb.name}</h4>
                            <span className="text-[10px] text-stone-400 font-mono italic">{herb.sanskrit}</span>
                          </div>
                          <p className="text-xs text-stone-500 font-inter leading-relaxed mt-1">
                            {herb.use}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LIFESTYLE PANE */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Lifestyle Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    🌅 LIFESTYLE — VIHĀRA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    <strong>Principle:</strong> {activeDosha.lifestyle.principle}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 bg-emerald-50/20 border border-emerald-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <span>✓</span> FAVOUR
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.lifestyle.prefer.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-orange-50/20 border border-orange-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span>✕</span> REDUCE / AVOID
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.lifestyle.avoid.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Seasons Panel */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    🍂 SEASONAL GUIDANCE — RITUCHARYA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    Your **{activeDosha.name}** side requires specific seasonal adjustments to stay balanced year-round.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeDosha.seasons.map((season, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-3xl border transition-all duration-500 ${
                          season.active
                            ? 'bg-[#FDF6EC] border-orange-300 shadow-sm'
                            : 'bg-white/50 border-stone-200/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{season.icon}</span>
                          <span className="font-serif italic font-bold text-stone-900 text-base">{season.name}</span>
                          {season.active && (
                            <span className="px-2 py-0.5 bg-[#C27A5D] text-white text-[8px] font-mono font-bold uppercase rounded-full tracking-widest ml-auto">PEAK</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed font-inter">
                          {season.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RHYTHMS PANE */}
            {activeTab === 'rhythms' && (
              <div className="space-y-8 animate-fade-rise">
                {/* Exercise Card */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    🏃 EXERCISE — VYĀYĀMA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    <strong>Principle:</strong> {activeDosha.exercise.principle}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 bg-emerald-50/20 border border-emerald-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <span>✓</span> FAVOUR
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.exercise.prefer.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-orange-50/20 border border-orange-200/30 rounded-3xl">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span>✕</span> REDUCE / AVOID
                      </h4>
                      <ul className="space-y-2">
                        {activeDosha.exercise.avoid.map((item, idx) => (
                          <li key={idx} className="text-xs text-stone-700 font-inter leading-relaxed flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dinacharya Rhythm Panel Checklists */}
                <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-3 block">
                    ⏰ DAILY RHYTHM — DINACHARYA
                  </span>
                  <p className="text-stone-500 font-inter text-xs leading-relaxed mb-6">
                    Aligning your day to the dosha clock is one of Ayurveda&apos;s most powerful practices. Tap items to check off your daily synchronization.
                  </p>

                  <div className="space-y-3">
                    {activeDosha.rhythm.map((item, idx) => {
                      const chkId = `chk-${activeKey}-${idx}`;
                      const isChecked = !!checklist[chkId];
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleChecklist(chkId)}
                          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-[#FDF6EC] border-[#C27A5D] text-stone-900'
                              : 'bg-white/60 border-stone-200/40 text-stone-700 hover:border-[#C27A5D]/30'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-[#C27A5D] border-[#C27A5D] text-white' : 'border-stone-300 bg-stone-50'
                            }`}>
                              {isChecked && <span className="text-[10px] font-bold">✓</span>}
                            </div>
                            <div className="flex-1">
                              <span className="text-[10px] font-mono font-bold tracking-wider block text-stone-400">{item.time}</span>
                              <span className={`text-xs font-inter leading-relaxed ${isChecked ? 'line-through text-stone-400 font-light' : 'font-medium'}`}>{item.action}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* General Disclaimer Block */}
            <p className="text-[10px] text-stone-400 font-mono text-center tracking-wider leading-relaxed mt-12 mb-8">
              🪷 Based on classical Charaka Samhita and Sushruta Samhita guidelines · for educational awareness only, not clinical medical diagnosis.
            </p>

            {/* Recalibrate / Retake bottom CTA */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8">
              <button
                onClick={handleRetake}
                className="flex-1 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] border border-stone-300 hover:border-stone-500 bg-white/40 text-stone-600 hover:text-stone-900 transition-all duration-300 cursor-pointer shadow-sm text-center"
              >
                ↺ RETAKE ANALYSIS
              </button>
              <button
                onClick={() => router.push(getNextStepRouteAndLabel().route)}
                className="flex-1 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] hover:bg-[#C27A5D] text-white transition-all duration-300 cursor-pointer shadow-md text-center"
              >
                {getNextStepRouteAndLabel().label}
              </button>
            </div>

          </main>
        </div>

        <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
          <div>PHASE / CALIBRATION</div>
          <div>© OJAS RITUAL MMXXVI</div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#C27A5D]/10 transition-colors duration-500">
      <div>
        <Header />

        <main className="max-w-2xl mx-auto px-6 py-10 md:py-16 w-full">
          {/* Progress Bar Header */}
          <div className="mb-10 md:mb-12 animate-fade-rise">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold">
                KNOW YOUR PRAKRITI
              </h2>
              <span className="text-[10px] md:text-xs font-mono text-stone-400 uppercase tracking-wider">
                Question {currentQuestion + 1} of {PRAKRITI_QUESTIONS.length}
              </span>
            </div>
            <div className="w-full bg-stone-200/50 rounded-full h-1">
              <div
                className="bg-[#C27A5D] h-1 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="w-full bg-white/40 border border-stone-200/50 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(28,25,22,0.03)] mb-8 animate-fade-rise">
            {/* Category Tag */}
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-[#C27A5D] font-semibold mb-4 block">
              {question.cat.toUpperCase()}
            </span>
            
            <h3 className="text-2xl md:text-3xl font-serif italic text-stone-900 mb-8 font-normal leading-snug">
              {question.text}
            </h3>

            {/* Answer Options */}
            <div className="space-y-4">
              {question.opts.map((option, index) => {
                const letter = ['A', 'B', 'C'][index];
                const isSelected = selectedOption === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full p-5 text-left border rounded-2xl transition-all duration-300 font-inter text-sm md:text-base cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FDF6EC] border-[#C27A5D] text-[#C27A5D] font-semibold scale-[1.01]'
                        : 'bg-white/70 border-stone-200/60 text-stone-800 hover:border-[#C27A5D] hover:bg-[#FDF6EC] hover:text-stone-900 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center border font-bold transition-colors ${
                        isSelected 
                          ? 'bg-[#C27A5D] border-[#C27A5D] text-white' 
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}>
                        {letter}
                      </span>
                      <span>{option.t}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Ancient Vedic Fact Box - Smoothly slide in when an option is selected */}
            {selectedOption !== null && (
              <div className="mt-8 p-5 bg-[#FDF6EC] border border-orange-100/50 rounded-2xl animate-fade-rise text-xs md:text-sm text-[#8A5A44] font-inter leading-relaxed italic shadow-[inset_0_1px_3px_rgba(28,25,22,0.01)]">
                {question.fact}
              </div>
            )}
          </div>

          {/* Footer Nav Controls */}
          <div className="flex justify-between items-center animate-fade-rise mt-6">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] border transition-all duration-300 ${
                currentQuestion === 0
                  ? 'border-stone-200 text-stone-300 cursor-not-allowed opacity-50'
                  : 'border-stone-300 hover:border-stone-500 hover:scale-[1.03] active:scale-[0.98] bg-white/40 text-stone-600 hover:text-stone-900 cursor-pointer'
              }`}
            >
              Previous
            </button>

            {selectedOption !== null && (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-[#1C1917] text-white hover:bg-[#C27A5D] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer"
              >
                {currentQuestion === PRAKRITI_QUESTIONS.length - 1 ? 'FINISH assessment' : 'CONTINUE →'}
              </button>
            )}
          </div>
        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-stone-200/20 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-400 tracking-wider">
        <div>PHASE / ASSESSMENT</div>
        <div>© OJAS RITUAL MMXXVI</div>
      </footer>
    </div>
  );
}