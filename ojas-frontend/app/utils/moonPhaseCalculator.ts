// app/utils/moonPhaseCalculator.ts

export const getCurrentMoonPhase = (): 'new' | 'waxing' | 'full' | 'waning' => {
    const date = new Date();
    const day = date.getDate();
    const phase = day % 29.5;

    if (phase < 7.38) return 'new';
    if (phase < 14.76) return 'waxing';
    if (phase < 22.14) return 'full';
    return 'waning';
};

export const getMoonPhaseEmoji = (phase: string): string => {
    const emojis: Record<string, string> = {
        new: '🌑',
        waxing: '🌒',
        full: '🌕',
        waning: '🌘'
    };
    return emojis[phase] || '🌙';
};

export const getMoonPhaseInsight = (phase: string): string => {
    const insights: Record<string, string> = {
        new: "New moon: Perfect time for setting intentions and starting fresh.",
        waxing: "Waxing moon: Energy is building. Take action on your goals.",
        full: "Full moon: Peak energy. Reflect, celebrate, and release.",
        waning: "Waning moon: Slow down. Rest, reflect, and let go."
    };
    return insights[phase] || "";
};