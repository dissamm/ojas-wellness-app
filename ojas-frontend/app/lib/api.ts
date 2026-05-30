'use client';

import { useEffect, useState } from 'react';
import { getMusicRecommendations, RecommendedSong } from '../services/musicService';

export interface PredictMoodParams {
  cycle_day: number;
  date: string;
  estrogen?: number;
  prakriti?: string;
}

export interface PredictionData {
  success: boolean;
  predicted_mood: number;
  mood_type?: string;
  cycle_phase: string;
  day_in_cycle: number;
  moon_phase: string;
  moon_illumination: number;
  recommended_songs?: string[];
  recommended_genres?: string[];
  error?: string;
}

export const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  : 'http://localhost:5000';

export async function predictMood(params: PredictMoodParams): Promise<PredictionData> {
  const response = await fetch(`${API_BASE_URL}/api/predict-mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params,
    }),
  });
  return response.json();
}

export const useMoodPrediction = (
  cycle: { startDate?: string; cycleLengthDays?: number } | null | undefined,
  dominantDoshaText: string
) => {
  const [predictedMood, setPredictedMood] = useState<number | null>(null);
  const [moodType, setMoodType] = useState<string>('');
  const [cycleDay, setCycleDay] = useState<number>(9);
  const [cyclePhase, setCyclePhase] = useState<string>('Follicular');
  const [moonPhase, setMoonPhase] = useState<string>('Waxing Crescent');
  const [moonIllumination, setMoonIllumination] = useState<number>(35);
  const [musicRecommendations, setMusicRecommendations] = useState<RecommendedSong[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      const today = new Date();
      let day = 9;

      const length = cycle?.cycleLengthDays || 28;
      if (cycle && cycle.startDate) {
        const last = new Date(cycle.startDate);
        const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        day = (diffDays % length) + 1;
        if (day < 1) day = 1;
        if (day > length) day = length;
      }
      
      setCycleDay(day);

      try {
        const data = await predictMood({
          cycle_day: day,
          date: today.toISOString().split('T')[0],
          prakriti: dominantDoshaText,
        });

        if (data.success) {
          setPredictedMood(data.predicted_mood);
          setMoodType(data.mood_type || 'Calm');
          setCyclePhase(data.cycle_phase);
          setMoonPhase(data.moon_phase);
          setMoonIllumination(data.moon_illumination);
          
          // Compute music recommendations using musicService
          const recs = getMusicRecommendations(data.cycle_phase, data.predicted_mood);
          setMusicRecommendations(recs);
        } else {
          throw new Error(data.error || 'Failed prediction');
        }
      } catch (err) {
        console.warn("Failed to fetch mood prediction, using offline math fallback: ", err);
        // Clean mock fallback
        const quarterLength = Math.floor(length / 4);
        let phase = 'Follicular';
        if (day <= 5) phase = 'Menstrual';
        else if (day <= quarterLength * 2) phase = 'Follicular';
        else if (day <= quarterLength * 2.5) phase = 'Ovulatory';
        else phase = 'Luteal';

        setCyclePhase(phase);
        setPredictedMood(7);
        setMoodType('Calm');
        setMoonPhase('Waxing Gibbous');
        setMoonIllumination(75);

        // Compute music recommendations offline fallback
        const recs = getMusicRecommendations(phase, 7);
        setMusicRecommendations(recs);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [cycle, dominantDoshaText]);

  return {
    predictedMood,
    moodType,
    cycleDay,
    cyclePhase,
    moonPhase,
    moonIllumination,
    musicRecommendations,
    loading,
    error,
  };
};
