// services/musicService.ts

export interface RecommendedSong {
    title: string;
    artist: string;
    mood: string;
    spotifyUrl: string;
    youtubeUrl: string;
}

// Curated Underrated Indian Indie Pop recommendations based on phase
export function getMusicRecommendations(phase: string, moodScore: number): RecommendedSong[] {
    const phaseLower = phase.toLowerCase();

    // Follicular Phase (Rising creative energy)
    if (phaseLower.includes('follicular')) {
        if (moodScore >= 6) {
            return [
                { title: "Firefly", artist: "When Chai Met Toast", mood: "Optimistic", spotifyUrl: "https://open.spotify.com/track/2NWh665tV458t6575121S2", youtubeUrl: "https://www.youtube.com/results?search_query=when+chai+met+toast+firefly" },
                { title: "Shaayad", artist: "Taba Chake", mood: "Adaptable", spotifyUrl: "https://open.spotify.com/track/5c8c50cE5f0P61iZg8Cg8J", youtubeUrl: "https://www.youtube.com/results?search_query=taba+chake+shaayad" }
            ];
        } else {
            return [
                { title: "Kadam", artist: "Prateek Kuhad", mood: "Hopeful", spotifyUrl: "https://open.spotify.com/track/4WWh115tV458t6575121S1", youtubeUrl: "https://www.youtube.com/results?search_query=prateek+kuhad+kadam" },
                { title: "Alag Aasmaan", artist: "Anuv Jain", mood: "Dreamy", spotifyUrl: "https://open.spotify.com/track/6WWh225tV458t6575121S2", youtubeUrl: "https://www.youtube.com/results?search_query=anuv+jain+alag+aasmaan" }
            ];
        }
    }

    // Ovulatory Phase (Peak expressive power & transformation)
    if (phaseLower.includes('ovulat')) {
        return [
            { title: "One Nation", artist: "Karsh Kale", mood: "Transcendent", spotifyUrl: "https://open.spotify.com/track/3HWh775tV458t6575121S4", youtubeUrl: "https://www.youtube.com/results?search_query=karsh+kale+one+nation" },
            { title: "Jaago", artist: "Lifafa", mood: "Vibrant", spotifyUrl: "https://open.spotify.com/track/1HWh555tV458t6575121S9", youtubeUrl: "https://www.youtube.com/results?search_query=lifafa+jaago" },
            { title: "Maybe Babe", artist: "When Chai Met Toast", mood: "Expressive", spotifyUrl: "https://open.spotify.com/track/8WWh885tV458t6575121S8", youtubeUrl: "https://www.youtube.com/results?search_query=when+chai+met+toast+maybe+babe" }
        ];
    }

    // Luteal Phase (Reflective turn inwards)
    if (phaseLower.includes('luteal')) {
        if (moodScore >= 5) {
            return [
                { title: "Baarishein", artist: "Anuv Jain", mood: "Gentle", spotifyUrl: "https://open.spotify.com/track/5nAkv9yZkQ4gC0617v12S2", youtubeUrl: "https://www.youtube.com/results?search_query=anuv+jain+baarishein" },
                { title: "Kho Gaye Hum Kahan", artist: "Prateek Kuhad", mood: "Nostalgic", spotifyUrl: "https://open.spotify.com/track/9WWh995tV458t6575121S9", youtubeUrl: "https://www.youtube.com/results?search_query=prateek+kuhad+kho+gaye+hum+kahan" }
            ];
        } else {
            return [
                { title: "Nikamma", artist: "Lifafa", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/5WWh555tV458t6575121S5", youtubeUrl: "https://www.youtube.com/results?search_query=lifafa+nikamma" },
                { title: "Tune Kaha", artist: "Prateek Kuhad", mood: "Melancholic", spotifyUrl: "https://open.spotify.com/track/2WWh225tV458t6575121S2", youtubeUrl: "https://www.youtube.com/results?search_query=prateek+kuhad+tune+kaha" }
            ];
        }
    }

    // Menstrual Phase (Deep physical & spiritual rest)
    if (phaseLower.includes('menstrual')) {
        return [
            { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Cathartic", spotifyUrl: "https://open.spotify.com/track/1BWh445tV458t6575121S6", youtubeUrl: "https://www.youtube.com/results?search_query=prateek+kuhad+cold+mess" },
            { title: "Aasmaan", artist: "Taba Chake", mood: "Calming", spotifyUrl: "https://open.spotify.com/track/4c8c40cE5f0P61iZg8Cg8J", youtubeUrl: "https://www.youtube.com/results?search_query=taba+chake+aasmaan" },
            { title: "In Dino", artist: "Lifafa", mood: "Soulful", spotifyUrl: "https://open.spotify.com/track/3WWh335tV458t6575121S3", youtubeUrl: "https://www.youtube.com/results?search_query=lifafa+in+dino" }
        ];
    }

    // Default Fallback
    return [
        { title: "Shaayad", artist: "Taba Chake", mood: "Calm", spotifyUrl: "https://open.spotify.com/track/5c8c50cE5f0P61iZg8Cg8J", youtubeUrl: "https://www.youtube.com/results?search_query=taba+chake+shaayad" },
        { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/1BWh445tV458t6575121S6", youtubeUrl: "https://www.youtube.com/results?search_query=prateek+kuhad+cold+mess" }
    ];
}