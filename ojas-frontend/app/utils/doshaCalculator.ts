// app/utils/doshaCalculator.ts

export const calculateDoshaFromAnswers = (
    answers: Record<string, string>
): { vata: number; pitta: number; kapha: number } => {
    const counts = { vata: 0, pitta: 0, kapha: 0 };

    Object.values(answers).forEach((dosha) => {
        if (dosha === 'vata') counts.vata++;
        if (dosha === 'pitta') counts.pitta++;
        if (dosha === 'kapha') counts.kapha++;
    });

    const total = counts.vata + counts.pitta + counts.kapha;

    if (total === 0) return { vata: 33, pitta: 33, kapha: 34 };

    return {
        vata: Math.round((counts.vata / total) * 100),
        pitta: Math.round((counts.pitta / total) * 100),
        kapha: Math.round((counts.kapha / total) * 100),
    };
};

export const getDominantDosha = (composition: { vata: number; pitta: number; kapha: number }): string => {
    const { vata, pitta, kapha } = composition;
    if (vata >= pitta && vata >= kapha) return 'Vata';
    if (pitta >= vata && pitta >= kapha) return 'Pitta';
    return 'Kapha';
};

export const getDailyInsights = (
    doshaComposition: { vata: number; pitta: number; kapha: number }
) => {
    const dominant = getDominantDosha(doshaComposition).toLowerCase();

    const insights: Record<string, {
        affirmation: string;
        tips: string[];
        bestFoods: string[];
        avoidFoods: string[];
    }> = {
        vata: {
            affirmation: "I am grounded, calm, and centered.",
            tips: ["Wake up at the same time daily", "Eat warm, cooked meals", "Practice gentle yoga"],
            bestFoods: ["Warm soups", "Cooked grains", "Ginger tea"],
            avoidFoods: ["Cold drinks", "Raw vegetables", "Caffeine"]
        },
        pitta: {
            affirmation: "I am cool, calm, and balanced.",
            tips: ["Avoid overheating", "Take breaks throughout the day", "Practice cooling breathing"],
            bestFoods: ["Coconut water", "Sweet fruits", "Cucumber"],
            avoidFoods: ["Spicy food", "Coffee", "Fried food"]
        },
        kapha: {
            affirmation: "I am energetic, light, and motivated.",
            tips: ["Exercise daily", "Wake up early", "Try new activities"],
            bestFoods: ["Light fruits", "Spices like ginger", "Warm water with honey"],
            avoidFoods: ["Dairy", "Fried food", "Sugar"]
        }
    };

    return insights[dominant] || insights.vata;
};