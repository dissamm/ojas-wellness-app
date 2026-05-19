export interface Ritual {
    id: string;
    time: string;        // "05:30 AM"
    activity: string;    // "Pranayama (3 rounds Nadi Shodhana)"
    duration: number;    // 15 (minutes)
    dosha: string[];     // ["Vata", "Pitta"] (recommended for)
    phase?: string;      // "Menstrual" (optional: phase-specific)
    description: string;
    link?: string;       // Link to YouTube/Spotify for guided activities
    linkText?: string;
    linkType?: 'spotify' | 'youtube' | 'generic';
    phaseModifications?: {
        Menstrual?: Partial<Omit<Ritual, 'id' | 'time' | 'dosha' | 'phaseModifications'>>;
        Follicular?: Partial<Omit<Ritual, 'id' | 'time' | 'dosha' | 'phaseModifications'>>;
        Ovulatory?: Partial<Omit<Ritual, 'id' | 'time' | 'dosha' | 'phaseModifications'>>;
        Luteal?: Partial<Omit<Ritual, 'id' | 'time' | 'dosha' | 'phaseModifications'>>;
    };
}

export const ritualsList: Ritual[] = [
    {
        id: 'rising',
        time: '05:30 AM',
        activity: 'Brahma Muhurta Awakening',
        duration: 15,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Wake up during the peaceful hours before sunrise when Vata is dominant, allowing for mental clarity and stillness.',
        link: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5mrm5cNz',
        linkText: 'Morning Ambient Playlist',
        linkType: 'spotify',
        phaseModifications: {
            Menstrual: {
                activity: 'Gentle Menses Waking',
                description: 'Wake up with extra soft transitions. Lie in bed for 5 extra minutes focusing on deep abdominal breathing to ease pelvic cramping.',
                duration: 20
            }
        }
    },
    {
        id: 'oral_cleanse',
        time: '06:00 AM',
        activity: 'Tongue Scraping & Oil Pulling',
        duration: 10,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Scrape the tongue back-to-front and swish warm sesame or coconut oil to remove overnight toxins (Ama) and refresh oral health.',
        link: 'https://www.youtube.com/watch?v=kYJv8rG5V34',
        linkText: 'Morning Cleanse Guide',
        linkType: 'youtube'
    },
    {
        id: 'pranayama',
        time: '06:15 AM',
        activity: 'Nadi Shodhana Pranayama',
        duration: 10,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Alternate nostril breathing to calm the nervous system, balance the left and right hemispheres of the brain, and settle your energy.',
        link: 'https://open.spotify.com/track/53tY4nS3dJb6Xw26f2i56T',
        linkText: 'Breathing Solfeggio Frequencies',
        linkType: 'spotify',
        phaseModifications: {
            Menstrual: {
                activity: 'Soothing Nadi Shodhana (No Retention)',
                description: 'Alternate nostril breathing with soft, equal breaths. Do not hold your breath to avoid strain on pelvic energy.',
                duration: 10
            },
            Ovulatory: {
                activity: 'Dynamic Breathwork (Kapalabhati)',
                description: 'A more active breathwork session to channel peak ovulatory energy and clear stagnant channels.',
                duration: 8
            }
        }
    },
    {
        id: 'yoga',
        time: '06:30 AM',
        activity: 'Dosha-Specific Yoga Flow',
        duration: 25,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Morning yoga practice. Vata aligns with grounding Hatha; Pitta enjoys cooling, non-competitive Moon Salutations; Kapha practices heating Sun Salutations.',
        link: 'https://www.youtube.com/watch?v=v7AYKTypWwQ',
        linkText: 'Guided Morning Flow',
        linkType: 'youtube',
        phaseModifications: {
            Menstrual: {
                activity: 'Restorative Yin Yoga',
                description: 'Deeply relaxing poses like Child\'s Pose and Reclined Butterfly to open the hips, relax the lower back, and comfort cramping. Avoid inversions.',
                duration: 30,
                link: 'https://www.youtube.com/watch?v=8J7X1g5DbyI',
                linkText: 'Menstrual Restorative Yoga',
                linkType: 'youtube'
            },
            Luteal: {
                activity: 'Slow Flow Hatha Yoga',
                description: 'Slow down the pace to match luteal wind-down. Focus on hip openers and twists to release emotional and physical pressure.',
                duration: 20
            }
        }
    },
    {
        id: 'abhyanga',
        time: '07:00 AM',
        activity: 'Self-Massage (Abhyanga)',
        duration: 15,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Self-massage with warm organic oils (Sesame for Vata, Coconut for Pitta, light Sesame/Sunflower for Kapha) to hydrate tissues and calm the mind.',
        link: 'https://www.youtube.com/watch?v=7-qCscvBskU',
        linkText: 'Abhyanga Ritual Guide',
        linkType: 'youtube',
        phaseModifications: {
            Menstrual: {
                activity: 'Gentle Foot & Head Massage',
                description: 'Avoid full-body vigorous abhyanga during the heaviest days of bleeding. Instead, massage warm sesame oil into your feet (Padabhyanga) and scalp.',
                duration: 10
            }
        }
    },
    {
        id: 'breakfast',
        time: '08:00 AM',
        activity: 'Ayurvedic Nourishing Breakfast',
        duration: 20,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'A warm, cooked breakfast to ignite digestive fire (Agni). (Vata: cooked oats, Pitta: sweet stewed apples/pears, Kapha: light warm grains).',
        phaseModifications: {
            Menstrual: {
                activity: 'Iron-Rich Warm Breakfast',
                description: 'Warm spiced porridge with dates, raisins, and a pinch of ginger to replenish iron and ground your body. Avoid cold smoothies.',
                duration: 20
            },
            Follicular: {
                activity: 'Nutrient-Dense Light Breakfast',
                description: 'Include fermented foods or fresh sprouts to align with rising estrogen and aid follicular growth.',
                duration: 15
            }
        }
    },
    {
        id: 'lunch',
        time: '12:30 PM',
        activity: 'Principal Meal (Agni Peak)',
        duration: 30,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Eat your largest and most complete meal of the day now when the sun is highest, representing the peak of your digestive Agni.',
        phaseModifications: {
            Menstrual: {
                activity: 'Warming Comforting Kitchari',
                description: 'Enjoy a bowl of warm, soupy split-mung dal kitchari with cumin, coriander, and fennel. Soft and extremely easy to digest.',
                duration: 30
            }
        }
    },
    {
        id: 'walk',
        time: '02:00 PM',
        activity: 'Sattvic Nature Walk',
        duration: 15,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'A short 15-minute nature walk at a gentle pace to step away from screens, absorb natural light, and reset posture.',
        link: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0EXPn',
        linkText: 'Acoustic Soundscapes',
        linkType: 'spotify',
        phaseModifications: {
            Menstrual: {
                activity: 'Slow Centered Forest Bathing',
                description: 'Walk very slowly and intentionally. Focus on grounding the soles of your feet with each step, breathing out any accumulated fatigue.',
                duration: 10
            }
        }
    },
    {
        id: 'meditation',
        time: '06:00 PM',
        activity: 'Sandhya Gratitude Meditation',
        duration: 15,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Sit in silence as twilight begins. Transition from active doing to passive being by practicing gratitude reflection.',
        link: 'https://open.spotify.com/playlist/37i9dQZF1DX8Ueb7Cnp3rJ',
        linkText: 'Sunset Ambient Meditations',
        linkType: 'spotify'
    },
    {
        id: 'dinner',
        time: '07:00 PM',
        activity: 'Light Grounding Dinner',
        duration: 25,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'A light, warm dinner eaten at least 3 hours before sleep to support optimal digestion and sleep hygiene.',
        phaseModifications: {
            Menstrual: {
                activity: 'Mineral-Rich Warming Soups',
                description: 'Enjoy warm soups, steamed greens, and well-cooked root vegetables with ghee. Keep the portion light to ensure energy is directed to menstruation.',
                duration: 30
            }
        }
    },
    {
        id: 'sleep_prep',
        time: '09:00 PM',
        activity: 'Digital Detox & Golden Milk',
        duration: 20,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Disconnect from screens. Prepare warm almond or coconut milk spiced with turmeric, nutmeg, and ginger to soothe your nervous system.',
        link: 'https://www.youtube.com/watch?v=Y4gK0tF9fE4',
        linkText: 'How to Make Golden Milk',
        linkType: 'youtube',
        phaseModifications: {
            Menstrual: {
                activity: 'Menses Chamomile-Ginger Infusion',
                description: 'Sip warm chamomile tea infused with fresh ginger and fennel seeds to soothe uterine contractions and invite profound sleep.',
                duration: 25
            }
        }
    },
    {
        id: 'sleep',
        time: '10:00 PM',
        activity: 'Deep Sleep Rejuvenation',
        duration: 8,
        dosha: ['Vata', 'Pitta', 'Kapha'],
        description: 'Sleep by 10:00 PM to align with Kapha-to-Pitta clock transition. Sleep in a dark, quiet, cool room to support melatonin and recovery.',
    }
];

export const getCycleStateFromStore = (cycle: { startDate: string; cycleLengthDays: number } | null) => {
    if (!cycle || !cycle.startDate) {
        return { day: 9, phase: 'Follicular' as const };
    }
    const today = new Date();
    const last = new Date(cycle.startDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    const length = cycle.cycleLengthDays || 28;
    let day = (diffDays % length) + 1;
    if (day < 1) day = 1;
    if (day > length) day = length;

    const quarterLength = Math.floor(length / 4);
    let phase: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal' = 'Follicular';
    if (day <= 5) phase = 'Menstrual';
    else if (day <= quarterLength * 2) phase = 'Follicular';
    else if (day <= quarterLength * 2.5) phase = 'Ovulatory';
    else phase = 'Luteal';

    return { day, phase };
};

export const getRitualsForDosha = (
    dominantDosha: string | null,
    currentPhase: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal' | string,
    showPhaseModifications: boolean = true
): Ritual[] => {
    const dosha = dominantDosha || 'Pitta';
    const phaseKey = (currentPhase || 'Follicular') as 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

    return ritualsList
        .filter(ritual => ritual.dosha.includes(dosha))
        .map(ritual => {
            if (showPhaseModifications && ritual.phaseModifications?.[phaseKey]) {
                const mod = ritual.phaseModifications[phaseKey]!;
                return {
                    ...ritual,
                    activity: mod.activity ?? ritual.activity,
                    description: mod.description ?? ritual.description,
                    duration: mod.duration ?? ritual.duration,
                    link: mod.link ?? ritual.link,
                    linkText: mod.linkText ?? ritual.linkText,
                    linkType: mod.linkType ?? ritual.linkType,
                    phase: phaseKey // set phase-specific tag
                };
            }
            return ritual;
        });
};

export const getTopThreeRituals = (
    rituals: Ritual[]
): Ritual[] => {
    const currentHour = new Date().getHours();
    
    // Dynamic time-of-day suggestions
    if (currentHour < 12) {
        // Morning: Rising (index 0), Cleanse (index 1), Yoga or Breathing
        return rituals.slice(0, 3);
    } else if (currentHour < 17) {
        // Afternoon: Agni Peak (Lunch), Walk, Meditation
        const afternoonIndices = [6, 7, 8];
        const result: Ritual[] = [];
        afternoonIndices.forEach(idx => {
            const found = rituals.find(r => r.id === ritualsList[idx]?.id);
            if (found) result.push(found);
        });
        if (result.length >= 3) return result.slice(0, 3);
        return rituals.slice(Math.max(0, Math.floor(rituals.length / 2) - 1), Math.floor(rituals.length / 2) + 2);
    } else {
        // Evening/Night: Meditation, Dinner, Sleep Prep
        const eveningIds = ['meditation', 'dinner', 'sleep_prep'];
        const result = rituals.filter(r => eveningIds.includes(r.id));
        if (result.length >= 3) return result.slice(0, 3);
        return rituals.slice(-3);
    }
};
