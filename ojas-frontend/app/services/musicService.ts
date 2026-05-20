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
                { title: "Firefly", artist: "When Chai Met Toast", mood: "Optimistic", spotifyUrl: "https://open.spotify.com/track/3JxsX5nmbAn0lMrOcD5gPA", youtubeUrl: "https://www.youtube.com/watch?v=N6M5J5K477o" },
                { title: "Shaayad", artist: "Taba Chake", mood: "Adaptable", spotifyUrl: "https://open.spotify.com/track/6T1J61mB2sU6Ww8X5yS5gT", youtubeUrl: "https://www.youtube.com/watch?v=Cdys7CdwZac" }
            ];
        } else {
            return [
                { title: "Kadam", artist: "Prateek Kuhad", mood: "Hopeful", spotifyUrl: "https://open.spotify.com/track/4jZ2L5vX4m6V7Yf5Z2lQ5o", youtubeUrl: "https://www.youtube.com/watch?v=3-5eP154i1M" },
                { title: "Alag Aasmaan", artist: "Anuv Jain", mood: "Dreamy", spotifyUrl: "https://open.spotify.com/track/622bN1TjB2WJ5P22P29rS7", youtubeUrl: "https://www.youtube.com/watch?v=kY4e062V07g" }
            ];
        }
    }

    // Ovulatory Phase (Peak expressive power & transformation)
    if (phaseLower.includes('ovulat')) {
        return [
            { title: "Milan", artist: "Karsh Kale", mood: "Transcendent", spotifyUrl: "https://open.spotify.com/track/4S93o77G5P3lKkO61a2JvR", youtubeUrl: "https://www.youtube.com/watch?v=A8vG4n3oU94" },
            { title: "Jaago", artist: "Lifafa", mood: "Vibrant", spotifyUrl: "https://open.spotify.com/track/622hZ3kQ9n1T9aP0794s8S", youtubeUrl: "https://www.youtube.com/watch?v=R9jC76uPj3s" },
            { title: "Maybe I Can Fly", artist: "When Chai Met Toast", mood: "Expressive", spotifyUrl: "https://open.spotify.com/track/1P5Y7I47d0iP9FqH7O6J1L", youtubeUrl: "https://www.youtube.com/watch?v=k5qG1p6g_tQ" }
        ];
    }

    // Luteal Phase (Reflective turn inwards)
    if (phaseLower.includes('luteal')) {
        if (moodScore >= 5) {
            return [
                { title: "Baarishein", artist: "Anuv Jain", mood: "Gentle", spotifyUrl: "https://open.spotify.com/track/4j51B6M07N22Qd8jU1364a", youtubeUrl: "https://www.youtube.com/watch?v=kY4e1FN_p4I" },
                { title: "Kho Gaye Hum Kahan", artist: "Prateek Kuhad", mood: "Nostalgic", spotifyUrl: "https://open.spotify.com/track/629H5C42o1T4F1aXk9D15T", youtubeUrl: "https://www.youtube.com/watch?v=vt4jX0iRgCg" }
            ];
        } else {
            return [
                { title: "Nikamma", artist: "Lifafa", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/4jV1KxW4Z04O148Zf7048A", youtubeUrl: "https://www.youtube.com/watch?v=Jm9n_b9Cj0k" },
                { title: "Tune Kaha", artist: "Prateek Kuhad", mood: "Melancholic", spotifyUrl: "https://open.spotify.com/track/4jV1f2aK16W6yJtL6nE5Yh", youtubeUrl: "https://www.youtube.com/watch?v=1M7zX6qB-j4" }
            ];
        }
    }

    // Menstrual Phase (Deep physical & spiritual rest)
    if (phaseLower.includes('menstrual')) {
        return [
            { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Cathartic", spotifyUrl: "https://open.spotify.com/track/46k1aD331rVnL3i0y6p2i0", youtubeUrl: "https://www.youtube.com/watch?v=Il7Nv270zNk" },
            { title: "Aao Chalein", artist: "Taba Chake", mood: "Calming", spotifyUrl: "https://open.spotify.com/track/6Zp6t5H0Qf32v24w6w4X9G", youtubeUrl: "https://www.youtube.com/watch?v=jJSn-HWPDdg" },
            { title: "Din Raat", artist: "Lifafa", mood: "Soulful", spotifyUrl: "https://open.spotify.com/track/3u1tS1h2363t4lW4n30j34", youtubeUrl: "https://www.youtube.com/watch?v=kYJp6yCqF00" }
        ];
    }

    // Default Fallback
    return [
        { title: "Shaayad", artist: "Taba Chake", mood: "Calm", spotifyUrl: "https://open.spotify.com/track/6T1J61mB2sU6Ww8X5yS5gT", youtubeUrl: "https://www.youtube.com/watch?v=Cdys7CdwZac" },
        { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/46k1aD331rVnL3i0y6p2i0", youtubeUrl: "https://www.youtube.com/watch?v=Il7Nv270zNk" }
    ];
}