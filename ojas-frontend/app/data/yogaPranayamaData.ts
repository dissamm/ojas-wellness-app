export interface PranayamaTechnique {
  id: string;
  name: string;
  doshas: string[];
  ratio: string;
  inhale: number;
  hold: number;
  exhale: number;
  tagline: string;
  effect: string;
  trackName: string;
  trackArtist: string;
  trackFrequency: string;
}

export interface Asana {
  id: string;
  durationMin: number;
  name: string;
  sanskritName: string;
  description: string;
  doshaTags: string[];
  svgPath: string; // Line art drawing paths
}

export const PRANAYAMA_TECHNIQUES: PranayamaTechnique[] = [
  {
    id: 'nadi_shodhana',
    name: 'Nadi Shodhana',
    doshas: ['VATA+++', 'PITTA++'],
    ratio: '4-0-4',
    inhale: 4,
    hold: 0,
    exhale: 4,
    tagline: 'Alternate nostril',
    effect: 'Balances both hemispheres',
    trackName: 'Alag Aasmaan',
    trackArtist: 'Anuv Jain',
    trackFrequency: '432Hz'
  },
  {
    id: 'bhramari',
    name: 'Bhramari',
    doshas: ['VATA+++', 'PITTA+++'],
    ratio: '4-0-8',
    inhale: 4,
    hold: 0,
    exhale: 8,
    tagline: 'Humming bee breath',
    effect: 'Calms anxiety instantly',
    trackName: 'Saraswati Dreamscape',
    trackArtist: 'Ojas Sounds',
    trackFrequency: '432Hz'
  },
  {
    id: 'sheetali',
    name: 'Sheetali',
    doshas: ['PITTA+++'],
    ratio: '4-0-8',
    inhale: 4,
    hold: 0,
    exhale: 8,
    tagline: 'Cooling breath',
    effect: 'Reduces heat and irritability',
    trackName: 'Lunar Soma',
    trackArtist: 'Chandra Ambient',
    trackFrequency: '432Hz'
  },
  {
    id: 'bhastrika',
    name: 'Bhastrika',
    doshas: ['KAPHA+++'],
    ratio: '2-0-2',
    inhale: 2,
    hold: 0,
    exhale: 2,
    tagline: 'Bellows breath',
    effect: 'Energises and clears lethargy',
    trackName: 'Deep Solfeggio',
    trackArtist: 'Meditation',
    trackFrequency: '432Hz'
  },
  {
    id: 'ujjayi',
    name: 'Ujjayi',
    doshas: ['VATA+++', 'KAPHA++'],
    ratio: '4-4-8',
    inhale: 4,
    hold: 4,
    exhale: 8,
    tagline: 'Ocean breath',
    effect: 'Warms and grounds',
    trackName: 'Prana Flow',
    trackArtist: 'Vayu Resonance',
    trackFrequency: '432Hz'
  },
  {
    id: 'kapalbhati',
    name: 'Kapalbhati',
    doshas: ['KAPHA+++'],
    ratio: '1s rhythm',
    inhale: 1,
    hold: 0,
    exhale: 1,
    tagline: 'Skull shining',
    effect: 'Detoxifies and awakens',
    trackName: 'Solar Fire',
    trackArtist: 'Surya Kundalini',
    trackFrequency: '432Hz'
  }
];

export const YOGA_SEQUENCES: Record<'VATA' | 'PITTA' | 'KAPHA', Asana[]> = {
  VATA: [
    {
      id: 'balasana',
      durationMin: 5,
      name: "Child's Pose",
      sanskritName: 'Balasana',
      description: "The ultimate Vata pacifier. Grounds the nervous system, releases lower back tension, and brings the mind inward. Hold for 2–5 minutes with eyes closed.",
      doshaTags: ['VATA+++'],
      svgPath: 'M20,75 C25,50 50,45 65,65 C70,70 65,75 20,75 Z M65,65 C75,55 80,60 75,70 C70,72 72,75 75,75' // Child's Pose line art
    },
    {
      id: 'viparita_karani',
      durationMin: 3,
      name: 'Legs Up the Wall',
      sanskritName: 'Viparita Karani',
      description: 'Reverses blood flow and immediately calms Vata anxiety. Deeply restorative for an overactive mind. Hold 3–10 minutes.',
      doshaTags: ['VATA+++'],
      svgPath: 'M25,75 L75,75 M75,75 L75,25 M72,75 L50,55 L30,75' // Legs up the wall
    },
    {
      id: 'supta_baddha_konasana',
      durationMin: 5,
      name: 'Reclining Butterfly',
      sanskritName: 'Supta Baddha Konasana',
      description: 'Opens the hips and inner thighs while remaining fully passive. Eliminates Vata restlessness from the pelvis.',
      doshaTags: ['VATA++' , 'PITTA+'],
      svgPath: 'M20,75 L80,75 M30,75 C35,65 45,65 50,75 C55,65 65,65 70,75 M50,65 L50,75' // Reclining butterfly
    },
    {
      id: 'uttanasana',
      durationMin: 4,
      name: 'Standing Forward Fold',
      sanskritName: 'Uttanasana',
      description: 'Grounds downward Vata energy. Releases the hamstrings and quiets the nervous system. Bend the knees generously.',
      doshaTags: ['VATA+++'],
      svgPath: 'M50,75 L50,45 L35,50 L40,75' // Standing forward fold
    },
    {
      id: 'tadasana',
      durationMin: 3,
      name: 'Mountain Pose',
      sanskritName: 'Tadasana',
      description: 'Teaches Vata types the feeling of being rooted. Focus on pressing all four corners of the feet into the ground.',
      doshaTags: ['VATA++', 'KAPHA+'],
      svgPath: 'M50,75 L50,30 M45,45 L55,45 M50,30 C50,25 50,25 50,30' // Mountain pose
    },
    {
      id: 'vrikshasana',
      durationMin: 4,
      name: 'Tree Pose',
      sanskritName: 'Vrikshasana',
      description: "Builds Vata's weak point — stability and concentration. Hold the wall if needed. Improves proprioception.",
      doshaTags: ['VATA+++'],
      svgPath: 'M50,75 L50,30 M50,55 L35,60 L50,65 M45,45 L55,45' // Tree pose
    },
    {
      id: 'setu_bandhasana',
      durationMin: 5,
      name: 'Bridge Pose',
      sanskritName: 'Setu Bandhasana',
      description: 'Strengthens the lower back where Vata accumulates. Activates the kidneys and adrenals.',
      doshaTags: ['VATA++', 'KAPHA+'],
      svgPath: 'M20,75 L80,75 C25,75 35,55 50,55 C65,55 75,75 80,75' // Bridge pose
    },
    {
      id: 'paschimottanasana',
      durationMin: 4,
      name: 'Seated Forward Bend',
      sanskritName: 'Paschimottanasana',
      description: "Compresses the Vata seat (lower abdomen) and calms the apana vayu. Use a strap around the feet if needed.",
      doshaTags: ['VATA+++'],
      svgPath: 'M20,75 L70,75 L35,60 C30,65 25,70 20,75' // Seated forward bend
    },
    {
      id: 'ananda_balasana',
      durationMin: 3,
      name: 'Happy Baby',
      sanskritName: 'Ananda Balasana',
      description: "Releases sacral tension and brings a childlike ease to Vata's overserious mind.",
      doshaTags: ['VATA+++'],
      svgPath: 'M25,75 L75,75 C40,75 40,55 30,50 M60,75 C60,55 70,50 75,50' // Happy baby
    },
    {
      id: 'savasana',
      durationMin: 10,
      name: 'Corpse Pose',
      sanskritName: 'Savasana',
      description: 'Non-negotiable for Vata. The most important pose — lie completely still with a blanket over the body for full nervous system reset.',
      doshaTags: ['VATA+++'],
      svgPath: 'M15,75 L85,75 M30,70 L70,70 M50,65 L50,70' // Savasana
    }
  ],
  PITTA: [
    {
      id: 'chandra_namaskar',
      durationMin: 5,
      name: 'Moon Salutation',
      sanskritName: 'Chandra Namaskar',
      description: "Cooling counterpart to Sun Salutation. Calms Pitta's competitive fire and brings lunar, receptive energy.",
      doshaTags: ['PITTA+++'],
      svgPath: 'M50,75 L50,35 C40,30 35,45 25,50 M50,35 C60,30 65,45 75,50' // Moon salutation representation
    },
    {
      id: 'matsyasana',
      durationMin: 4,
      name: 'Fish Pose',
      sanskritName: 'Matsyasana',
      description: 'Opens the throat and chest to release Pitta frustration and pent-up emotion. Cool the heart centre.',
      doshaTags: ['PITTA++', 'VATA+'],
      svgPath: 'M20,75 L80,75 C30,75 35,60 50,60 C60,60 65,75 80,75' // Fish pose
    },
    {
      id: 'supta_matsyendrasana',
      durationMin: 5,
      name: 'Supine Twist',
      sanskritName: 'Supta Matsyendrasana',
      description: "Wrings out the liver — Pitta's primary organ. Releases accumulated heat from the digestive system.",
      doshaTags: ['PITTA+++'],
      svgPath: 'M25,75 L75,75 C45,75 40,65 50,65 C60,65 55,75 75,75' // Supine twist
    },
    {
      id: 'prasarita_padottanasana',
      durationMin: 3,
      name: 'Wide-Legged Forward Fold',
      sanskritName: 'Prasarita Padottanasana',
      description: "Cools the head and releases Pitta's tendency toward tension headaches.",
      doshaTags: ['PITTA+++'],
      svgPath: 'M30,75 L50,45 L70,75 M50,45 L50,60' // Wide-legged fold
    },
    {
      id: 'eka_pada_rajakapotasana',
      durationMin: 4,
      name: 'Pigeon Pose',
      sanskritName: 'Eka Pada Rajakapotasana',
      description: 'Releases deep hip tension where Pitta stores anger and frustration. Hold passively without force.',
      doshaTags: ['PITTA++', 'VATA+'],
      svgPath: 'M25,75 C30,65 45,65 50,75 C60,75 70,75 75,75 M50,65 L50,75' // Pigeon pose representation
    },
    {
      id: 'viparita_karani_pitta',
      durationMin: 3,
      name: 'Legs Up the Wall',
      sanskritName: 'Viparita Karani',
      description: "Cools the blood, calms the liver, and gives Pitta's overworked system a complete rest.",
      doshaTags: ['PITTA+++'],
      svgPath: 'M25,75 L75,75 M75,75 L75,25 M72,75 L50,55 L30,75' // Legs up the wall
    },
    {
      id: 'janu_sirsasana',
      durationMin: 4,
      name: 'Head to Knee Pose',
      sanskritName: 'Janu Sirsasana',
      description: 'Stretches the hamstrings and massages the liver and spleen. Practice without straining.',
      doshaTags: ['PITTA++'],
      svgPath: 'M20,75 L70,75 L35,65 C30,70 25,72 20,75' // Head to knee
    },
    {
      id: 'baddha_konasana',
      durationMin: 5,
      name: 'Butterfly Pose',
      sanskritName: 'Baddha Konasana',
      description: 'Opens the groin and inner thighs. Cooling for the pelvic region where Pitta heat accumulates.',
      doshaTags: ['PITTA++'],
      svgPath: 'M30,75 C35,65 45,65 50,75 C55,65 65,65 70,75 L30,75' // Butterfly
    },
    {
      id: 'cat_cow',
      durationMin: 3,
      name: 'Cat-Cow Flow',
      sanskritName: 'Marjaryasana-Bitilasana',
      description: 'Slow, fluid spinal movement that cools Pitta through rhythm rather than effort.',
      doshaTags: ['PITTA+'],
      svgPath: 'M25,75 C35,70 50,70 60,75 M60,75 L60,65' // Cat-Cow spinal representation
    },
    {
      id: 'savasana_eye_pillow',
      durationMin: 10,
      name: 'Savasana with Eye Pillow',
      sanskritName: 'Savasana',
      description: 'Pitta needs darkness to truly let go. An eye pillow signals the nervous system to release control completely.',
      doshaTags: ['PITTA+++'],
      svgPath: 'M15,75 L85,75 M30,70 L70,70 M48,63 L52,63' // Savasana with eye pillow line
    }
  ],
  KAPHA: [
    {
      id: 'surya_namaskar',
      durationMin: 5,
      name: 'Sun Salutation × 6 rounds',
      sanskritName: 'Surya Namaskar',
      description: "Kapha's primary medicine — generates heat, stimulates circulation, and burns accumulated lethargy. Move at a brisk pace.",
      doshaTags: ['KAPHA+++'],
      svgPath: 'M50,75 L50,30 M50,30 L65,15 M45,45 L55,45' // Sun salutation upward stretch
    },
    {
      id: 'utkatasana',
      durationMin: 4,
      name: 'Chair Pose',
      sanskritName: 'Utkatasana',
      description: 'Builds fire in the legs and core — exactly where Kapha accumulates excess. Hold for 10 breaths.',
      doshaTags: ['KAPHA+++'],
      svgPath: 'M50,75 L40,65 L50,50 L50,30 M45,45 L55,45' // Chair pose representation
    },
    {
      id: 'virabhadrasana_i',
      durationMin: 3,
      name: 'Warrior I',
      sanskritName: 'Virabhadrasana I',
      description: 'Awakens Kapha courage and determination. Strong, held poses break through Kapha inertia.',
      doshaTags: ['KAPHA+++'],
      svgPath: 'M30,75 L45,60 L75,75 M45,60 L45,30 M35,20 L55,35' // Warrior I stretch
    },
    {
      id: 'virabhadrasana_ii',
      durationMin: 4,
      name: 'Warrior II',
      sanskritName: 'Virabhadrasana II',
      description: "Opens the chest and lungs — Kapha's most congested area. Builds stamina and willpower.",
      doshaTags: ['KAPHA+++'],
      svgPath: 'M30,75 L50,60 L70,75 M50,60 L50,35 L20,35 M50,35 L80,35' // Warrior II arms extended
    },
    {
      id: 'trikonasana',
      durationMin: 3,
      name: 'Triangle Pose',
      sanskritName: 'Trikonasana',
      description: "Stimulates the digestive organs and opens the side body. Counteracts Kapha's tendency toward sluggish digestion.",
      doshaTags: ['KAPHA++', 'PITTA+'],
      svgPath: 'M30,75 L50,45 L70,75 M50,45 L35,75' // Triangle pose representation
    },
    {
      id: 'navasana',
      durationMin: 4,
      name: 'Boat Pose',
      sanskritName: 'Navasana',
      description: "Direct Agni activator. Strengthens the core and stimulates Kapha's weak digestive fire. Hold for 5 breaths × 3 sets.",
      doshaTags: ['KAPHA+++'],
      svgPath: 'M35,50 L50,70 L65,50 M50,70 L50,60' // Boat pose V-shape
    },
    {
      id: 'ustrasana',
      durationMin: 3,
      name: 'Camel Pose',
      sanskritName: 'Ustrasana',
      description: 'Opens the chest and lungs fully — clears Kapha congestion. Creates a powerful energetic lift.',
      doshaTags: ['KAPHA+++'],
      svgPath: 'M35,75 L35,55 C45,45 60,55 60,75 M35,55 L55,55' // Camel pose arch
    },
    {
      id: 'dhanurasana',
      durationMin: 4,
      name: 'Bow Pose',
      sanskritName: 'Dhanurasana',
      description: "Massages the entire digestive tract and stimulates the adrenals. Kapha's best backbend for energy.",
      doshaTags: ['KAPHA+++'],
      svgPath: 'M25,60 C35,75 65,75 75,60 C75,60 50,60 25,60' // Bow pose curve
    },
    {
      id: 'kapotasana_var',
      durationMin: 3,
      name: 'King Pigeon Variation',
      sanskritName: 'Kapotasana',
      description: 'Stimulates the thyroid and parathyroid — often sluggish in Kapha types.',
      doshaTags: ['KAPHA++', 'PITTA+'],
      svgPath: 'M20,75 C25,60 40,55 55,60 C65,65 70,75 75,75 M55,60 L70,50' // Pigeon throat opener
    },
    {
      id: 'savasana_brief',
      durationMin: 5,
      name: 'Brief Savasana',
      sanskritName: 'Savasana',
      description: 'Kapha needs rest too — but only 5 minutes maximum to avoid slipping back into heaviness.',
      doshaTags: ['KAPHA+'],
      svgPath: 'M15,75 L85,75 M30,70 L70,70 M50,65 L50,70' // Savasana
    }
  ]
};
