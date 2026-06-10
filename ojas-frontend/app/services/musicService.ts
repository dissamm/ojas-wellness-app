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
    let tracks: RecommendedSong[] = [];

    // Follicular Phase (Rising creative energy)
    if (phaseLower === 'follicular') {
        if (moodScore >= 6) {
            tracks = [
                { title: "Firefly", artist: "When Chai Met Toast", mood: "Optimistic", spotifyUrl: "https://open.spotify.com/track/3JxsX5nmbAn0lMrOcD5gPA", youtubeUrl: "https://www.youtube.com/watch?v=N6M5J5K477o" },
                { title: "Shaayad", artist: "Taba Chake", mood: "Adaptable", spotifyUrl: "https://open.spotify.com/track/6T1J61mB2sU6Ww8X5yS5gT", youtubeUrl: "https://www.youtube.com/watch?v=Cdys7CdwZac" }
            ];
        } else {
            tracks = [
                { title: "Kadam", artist: "Prateek Kuhad", mood: "Hopeful", spotifyUrl: "https://open.spotify.com/track/4jZ2L5vX4m6V7Yf5Z2lQ5o", youtubeUrl: "https://www.youtube.com/watch?v=3-5eP154i1M" },
                { title: "Alag Aasmaan", artist: "Anuv Jain", mood: "Dreamy", spotifyUrl: "https://open.spotify.com/track/622bN1TjB2WJ5P22P29rS7", youtubeUrl: "https://www.youtube.com/watch?v=kY4e062V07g" }
            ];
        }
    }
    // Ovulatory Phase (Peak expressive power & transformation)
    else if (phaseLower === 'ovulation' || phaseLower === 'ovulatory') {
        tracks = [
            { title: "Milan", artist: "Karsh Kale", mood: "Transcendent", spotifyUrl: "https://open.spotify.com/track/4S93o77G5P3lKkO61a2JvR", youtubeUrl: "https://www.youtube.com/watch?v=A8vG4n3oU94" },
            { title: "Jaago", artist: "Lifafa", mood: "Vibrant", spotifyUrl: "https://open.spotify.com/track/622hZ3kQ9n1T9aP0794s8S", youtubeUrl: "https://www.youtube.com/watch?v=R9jC76uPj3s" },
            { title: "Maybe I Can Fly", artist: "When Chai Met Toast", mood: "Expressive", spotifyUrl: "https://open.spotify.com/track/1P5Y7I47d0iP9FqH7O6J1L", youtubeUrl: "https://www.youtube.com/watch?v=k5qG1p6g_tQ" }
        ];
    }
    // Luteal Phase (Reflective turn inwards)
    else if (phaseLower === 'luteal') {
        if (moodScore >= 5) {
            tracks = [
                { title: "Baarishein", artist: "Anuv Jain", mood: "Gentle", spotifyUrl: "https://open.spotify.com/track/4j51B6M07N22Qd8jU1364a", youtubeUrl: "https://www.youtube.com/watch?v=kY4e1FN_p4I" },
                { title: "Kho Gaye Hum Kahan", artist: "Prateek Kuhad", mood: "Nostalgic", spotifyUrl: "https://open.spotify.com/track/629H5C42o1T4F1aXk9D15T", youtubeUrl: "https://www.youtube.com/watch?v=vt4jX0iRgCg" }
            ];
        } else {
            tracks = [
                { title: "Nikamma", artist: "Lifafa", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/4jV1KxW4Z04O148Zf7048A", youtubeUrl: "https://www.youtube.com/watch?v=Jm9n_b9Cj0k" },
                { title: "Tune Kaha", artist: "Prateek Kuhad", mood: "Melancholic", spotifyUrl: "https://open.spotify.com/track/4jV1f2aK16W6yJtL6nE5Yh", youtubeUrl: "https://www.youtube.com/watch?v=1M7zX6qB-j4" }
            ];
        }
    }
    // Menstrual Phase (Deep physical & spiritual rest)
    else if (phaseLower === 'menstrual') {
        tracks = [
            { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Cathartic", spotifyUrl: "https://open.spotify.com/track/46k1aD331rVnL3i0y6p2i0", youtubeUrl: "https://www.youtube.com/watch?v=Il7Nv270zNk" },
            { title: "Aao Chalein", artist: "Taba Chake", mood: "Calming", spotifyUrl: "https://open.spotify.com/track/6Zp6t5H0Qf32v24w6w4X9G", youtubeUrl: "https://www.youtube.com/watch?v=jJSn-HWPDdg" },
            { title: "Din Raat", artist: "Lifafa", mood: "Soulful", spotifyUrl: "https://open.spotify.com/track/3u1tS1h2363t4lW4n30j34", youtubeUrl: "https://www.youtube.com/watch?v=kYJp6yCqF00" }
        ];
    }
    // Default Fallback
    else {
        tracks = [
            { title: "Shaayad", artist: "Taba Chake", mood: "Calm", spotifyUrl: "https://open.spotify.com/track/6T1J61mB2sU6Ww8X5yS5gT", youtubeUrl: "https://www.youtube.com/watch?v=Cdys7CdwZac" },
            { title: "Cold/Mess", artist: "Prateek Kuhad", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/46k1aD331rVnL3i0y6p2i0", youtubeUrl: "https://www.youtube.com/watch?v=Il7Nv270zNk" }
        ];
    }

    if (dosha) {
        const doshaLower = dosha.toLowerCase();
        const doshaTracks: Record<string, RecommendedSong> = {
            vata: { title: "Joy of Little Things", artist: "When Chai Met Toast", mood: "Grounding", spotifyUrl: "https://open.spotify.com/track/1J00w9R7P9LzB1s2W8C0r5", youtubeUrl: "https://www.youtube.com/watch?v=F0OqCg4nKqY" },
            pitta: { title: "Khudi", artist: "The Local Train", mood: "Cooling", spotifyUrl: "https://open.spotify.com/track/4zIfkE5sXzX2G16w7F94Rz", youtubeUrl: "https://www.youtube.com/watch?v=P2vNlJ6xL4g" },
            kapha: { title: "Udd Gaye", artist: "Ritviz", mood: "Energizing", spotifyUrl: "https://open.spotify.com/track/1yYn7A71E9lF9sXfIuA3lF", youtubeUrl: "https://www.youtube.com/watch?v=v2-9rIL_f4w" }
        };
        const extraTrack = doshaTracks[doshaLower];
        if (extraTrack) {
            tracks = tracks.filter(t => t.title !== extraTrack.title);
            tracks.unshift(extraTrack);
        }
    }

    return tracks;
}