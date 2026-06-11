// services/musicService.ts

export interface RecommendedSong {
    title: string;
    artist: string;
    mood: string;
    spotifyUrl: string;
    youtubeUrl: string;
}

// Curated Underrated Indian Indie Pop recommendations based on phase
export function getMusicRecommendations(phase: string, moodScore: number, dosha?: string): RecommendedSong[] {
    const phaseLower = phase.toLowerCase();
    
    // Define base track info without URLs
    type BaseTrack = { title: string; artist: string; mood: string; };
    let baseTracks: BaseTrack[] = [];

    // Follicular Phase (Rising creative energy)
    if (phaseLower === 'follicular') {
        if (moodScore >= 6) {
            baseTracks = [
                { title: "Firefly", artist: "When Chai Met Toast", mood: "Optimistic" },
                { title: "Shaayad", artist: "Taba Chake", mood: "Adaptable" }
            ];
        } else {
            baseTracks = [
                { title: "Kadam", artist: "Prateek Kuhad", mood: "Hopeful" },
                { title: "Alag Aasmaan", artist: "Anuv Jain", mood: "Dreamy" }
            ];
        }
    }
    // Ovulatory Phase (Peak expressive power & transformation)
    else if (phaseLower === 'ovulation' || phaseLower === 'ovulatory') {
        baseTracks = [
            { title: "Milan", artist: "Karsh Kale", mood: "Transcendent" },
            { title: "Jaago", artist: "Lifafa", mood: "Vibrant" },
            { title: "Maybe I Can Fly", artist: "When Chai Met Toast", mood: "Expressive" }
        ];
    }
    // Luteal Phase (Reflective turn inwards)
    else if (phaseLower === 'luteal') {
        if (moodScore >= 5) {
            baseTracks = [
                { title: "Baarishein", artist: "Anuv Jain", mood: "Gentle" },
                { title: "Kho Gaye Hum Kahan", artist: "Prateek Kuhad", mood: "Nostalgic" }
            ];
        } else {
            baseTracks = [
                { title: "Nikamma", artist: "Lifafa", mood: "Reflective" },
                { title: "Tune Kaha", artist: "Prateek Kuhad", mood: "Melancholic" }
            ];
        }
    }
    // Menstrual Phase (Deep physical & spiritual rest)
    else if (phaseLower === 'menstrual') {
        baseTracks = [
            { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Cathartic" },
            { title: "Aao Chalein", artist: "Taba Chake", mood: "Calming" },
            { title: "Din Raat", artist: "Lifafa", mood: "Soulful" }
        ];
    }
    // Default Fallback
    else {
        baseTracks = [
            { title: "Shaayad", artist: "Taba Chake", mood: "Calm" },
            { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Reflective" }
        ];
    }

    if (dosha) {
        const doshaLower = dosha.toLowerCase();
        const doshaTracks: Record<string, BaseTrack> = {
            vata: { title: "Joy of Little Things", artist: "When Chai Met Toast", mood: "Grounding" },
            pitta: { title: "Khudi", artist: "The Local Train", mood: "Cooling" },
            kapha: { title: "Udd Gaye", artist: "Ritviz", mood: "Energizing" }
        };
        const extraTrack = doshaTracks[doshaLower];
        if (extraTrack) {
            baseTracks = baseTracks.filter(t => t.title !== extraTrack.title);
            baseTracks.unshift(extraTrack);
        }
    }

    // Map the base tracks to include dynamic search URLs
    return baseTracks.map(track => {
        const query = encodeURIComponent(`${track.artist} ${track.title}`);
        return {
            ...track,
            spotifyUrl: `https://open.spotify.com/search/${query}`,
            youtubeUrl: `https://www.youtube.com/results?search_query=${query}`
        };
    });
}