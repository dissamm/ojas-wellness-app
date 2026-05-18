// services/musicService.ts

export interface RecommendedSong {
    title: string;
    artist: string;
    mood: string;
    spotifyUrl: string;
    youtubeUrl: string;
}

// Phase-based music recommendations
export function getMusicRecommendations(phase: string, moodScore: number): RecommendedSong[] {
    const phaseLower = phase.toLowerCase();

    // Follicular Phase (Energy rising)
    if (phaseLower.includes('follicular')) {
        if (moodScore >= 6) {
            return [
                { title: "Happy", artist: "Pharrell Williams", mood: "Energetic", spotifyUrl: "https://open.spotify.com/track/60nZcImufyMA1TKQvUDRk7", youtubeUrl: "https://youtube.com/watch?v=y6Sxv-sUYtM" },
                { title: "Good as Hell", artist: "Lizzo", mood: "Confident", spotifyUrl: "https://open.spotify.com/track/6uL7Gj6v6JjCjGa5t2PPLX", youtubeUrl: "https://youtube.com/watch?v=XvFkIuYqj5s" },
                { title: "Levitating", artist: "Dua Lipa", mood: "Upbeat", spotifyUrl: "https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP", youtubeUrl: "https://youtube.com/watch?v=TUVcZfQe-Kw" }
            ];
        } else {
            return [
                { title: "Here Comes the Sun", artist: "The Beatles", mood: "Hopeful", spotifyUrl: "https://open.spotify.com/track/6p9CqlM1FQKJzVPPKrJ3qm", youtubeUrl: "https://youtube.com/watch?v=KQetemT1s2c" },
                { title: "Rises the Moon", artist: "Liana Flores", mood: "Dreamy", spotifyUrl: "https://open.spotify.com/track/3X5MURBk3zYUnAJuC8oZ8B", youtubeUrl: "https://youtube.com/watch?v=VgBx1VvR1qU" },
                { title: "Weightless", artist: "Marconi Union", mood: "Calming", spotifyUrl: "https://open.spotify.com/track/3yJ1e8X3axXo4O7yZeM9nR", youtubeUrl: "https://youtube.com/watch?v=qYnA9wWFHLI" }
            ];
        }
    }

    // Ovulatory Phase (Peak energy)
    if (phaseLower.includes('ovulat')) {
        return [
            { title: "Blinding Lights", artist: "The Weeknd", mood: "Energetic", spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b", youtubeUrl: "https://youtube.com/watch?v=fHI8X4_O4x0" },
            { title: "Uptown Funk", artist: "Bruno Mars", mood: "Confident", spotifyUrl: "https://open.spotify.com/track/6XpcuJa7cGMdsC3THFhnPF", youtubeUrl: "https://youtube.com/watch?v=OPf0YbXqDm0" },
            { title: "Girl on Fire", artist: "Alicia Keys", mood: "Empowered", spotifyUrl: "https://open.spotify.com/track/4T7cMcHgS68TZQ1kIISWHi", youtubeUrl: "https://youtube.com/watch?v=J91ti_MpdHA" }
        ];
    }

    // Luteal Phase (Slowing down)
    if (phaseLower.includes('luteal')) {
        if (moodScore >= 5) {
            return [
                { title: "Buddy", artist: "Willow Smith", mood: "Gentle", spotifyUrl: "https://open.spotify.com/track/0PfKiPJWXMAy7D9aJlQy8C", youtubeUrl: "https://youtube.com/watch?v=Xl1ssXbFWXk" },
                { title: "Sunflower", artist: "Post Malone", mood: "Warm", spotifyUrl: "https://open.spotify.com/track/4EpZ4h6dVJNYW59Iq8vNlM", youtubeUrl: "https://youtube.com/watch?v=ApXoWvfEYVU" }
            ];
        } else {
            return [
                { title: "Stay", artist: "Rihanna", mood: "Melancholic", spotifyUrl: "https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20", youtubeUrl: "https://youtube.com/watch?v=JF8BRvqG6sA" },
                { title: "Someone Like You", artist: "Adele", mood: "Emotional", spotifyUrl: "https://open.spotify.com/track/4kflIGfjdZJW4ot2ioixTB", youtubeUrl: "https://youtube.com/watch?v=hLQl3WQQoQ0" },
                { title: "Clair de Lune", artist: "Debussy", mood: "Reflective", spotifyUrl: "https://open.spotify.com/track/4pAWp4zNHnCeGPkg6Ch1LF", youtubeUrl: "https://youtube.com/watch?v=CvFH_6DNRCY" }
            ];
        }
    }

    // Menstrual Phase (Rest)
    if (phaseLower.includes('menstrual')) {
        return [
            { title: "River Flows in You", artist: "Yiruma", mood: "Peaceful", spotifyUrl: "https://open.spotify.com/track/3xr8COed4nPPn6XW5YfTWk", youtubeUrl: "https://youtube.com/watch?v=7maJOI3QMu0" },
            { title: "Gymnopédie No.1", artist: "Erik Satie", mood: "Calm", spotifyUrl: "https://open.spotify.com/track/1T9B8CcoPxcA3YNOV6JKrA", youtubeUrl: "https://youtube.com/watch?v=S-Xm7s9eGxU" },
            { title: "Experience", artist: "Ludovico Einaudi", mood: "Healing", spotifyUrl: "https://open.spotify.com/track/1BncfTJAWxrsxyT9culBrj", youtubeUrl: "https://youtube.com/watch?v=4Z7iTMSNS2M" }
        ];
    }

    // Default fallback
    return [
        { title: "Weightless", artist: "Marconi Union", mood: "Calming", spotifyUrl: "https://open.spotify.com/track/3yJ1e8X3axXo4O7yZeM9nR", youtubeUrl: "https://youtube.com/watch?v=qYnA9wWFHLI" },
        { title: "Clair de Lune", artist: "Debussy", mood: "Peaceful", spotifyUrl: "https://open.spotify.com/track/4pAWp4zNHnCeGPkg6Ch1LF", youtubeUrl: "https://youtube.com/watch?v=CvFH_6DNRCY" }
    ];
}