import { create } from 'zustand';
import { API_BASE_URL } from '../lib/api';
import { useCycleStore } from './cycleStore';

export interface UserData {
    id?: number;
    username?: string;
    email?: string;
    name: string;
    doshaComposition: {
        vata: number;
        pitta: number;
        kapha: number;
    };
    dominantDosha: string;
    menstrualCycleStart?: Date | string;
    musicPreferences?: string[];
    gender?: string;
    profilePicture?: string;
}

export interface AppState {
    currentStep: 'name' | 'dosha-animation' | 'assessment' | 'result' | 'menstrual-moon' | 'music' | 'companion';
    user: UserData;
    assessmentAnswers: Record<string, string>;
    token: string | null;
    isAuthenticated: boolean;
    setName: (name: string) => void;
    setDoshaComposition: (composition: UserData['doshaComposition'], dominant: string) => void;
    setCurrentStep: (step: AppState['currentStep']) => void;
    setAssessmentAnswer: (questionId: string, value: string) => void;
    setMenstrualData: (startDate: Date) => void;
    setMusicPreferences: (preferences: string[]) => void;
    resetAssessment: () => void;
    
    // Auth actions
    setToken: (token: string | null) => void;
    logout: () => void;
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (username: string, email: string, password: string, name: string, gender: string) => Promise<boolean>;
    syncUserProfile: () => Promise<void>;
    loadProfileFromToken: () => Promise<void>;
    
    // Account Settings Actions
    changeEmail: (newEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
    deleteAccount: () => Promise<{ success: boolean; message?: string }>;
}

export const useUserStore = create<AppState>((set, get) => ({
    currentStep: 'name',
    user: {
        name: '',
        doshaComposition: { vata: 0, pitta: 0, kapha: 0 },
        dominantDosha: '',
        gender: 'female',
    },
    assessmentAnswers: {},
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,

    setToken: (token) => {
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
        set({ token, isAuthenticated: !!token });
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('prakriti');
            localStorage.removeItem('dominantPrakriti');
            localStorage.removeItem('prakriti_quiz_progress');
            localStorage.removeItem('prakriti_quiz_answers');
            localStorage.removeItem('cycle');
            localStorage.removeItem('musicPreferencesSet');
            localStorage.removeItem('ojas_checklist_state');
        }
        useCycleStore.getState().clearCycle();
        set({
            token: null,
            isAuthenticated: false,
            user: {
                name: '',
                doshaComposition: { vata: 0, pitta: 0, kapha: 0 },
                dominantDosha: '',
                gender: 'female',
            },
            assessmentAnswers: {},
            currentStep: 'name'
        });
    },

    loginUser: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                get().setToken(data.token);
                set({ user: data.user });
                
                // Sync Prakriti details local storage
                if (data.user.doshaComposition && data.user.dominantDosha && (data.user.doshaComposition.vata + data.user.doshaComposition.pitta + data.user.doshaComposition.kapha > 0)) {
                    localStorage.setItem('prakriti', JSON.stringify(data.user.doshaComposition));
                    localStorage.setItem('dominantPrakriti', data.user.dominantDosha);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error("Login failed:", err);
            return false;
        }
    },

    registerUser: async (username, email, password, name, gender) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cycle');
                localStorage.removeItem('musicPreferencesSet');
                localStorage.removeItem('prakriti');
                localStorage.removeItem('dominantPrakriti');
                localStorage.removeItem('prakriti_quiz_progress');
                localStorage.removeItem('prakriti_quiz_answers');
                localStorage.removeItem('ojas_checklist_state');
            }
            useCycleStore.getState().clearCycle();

            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, name, gender })
            });
            const data = await response.json();
            if (data.success) {
                get().setToken(data.token);
                set({ user: data.user });
                return true;
            }
            return false;
        } catch (err) {
            console.error("Registration failed:", err);
            return false;
        }
    },

    syncUserProfile: async () => {
        const { token, user } = get();
        if (!token) return;
        
        try {
            await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: user.name,
                    doshaComposition: user.doshaComposition,
                    dominantDosha: user.dominantDosha,
                    menstrualCycleStart: user.menstrualCycleStart,
                    musicPreferences: user.musicPreferences,
                    gender: user.gender,
                    profilePicture: user.profilePicture
                })
            });
        } catch (err) {
            console.error("Sync failed:", err);
        }
    },

    loadProfileFromToken: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                set({ user: data.user });
                if (data.user.doshaComposition && data.user.dominantDosha && (data.user.doshaComposition.vata + data.user.doshaComposition.pitta + data.user.doshaComposition.kapha > 0)) {
                    localStorage.setItem('prakriti', JSON.stringify(data.user.doshaComposition));
                    localStorage.setItem('dominantPrakriti', data.user.dominantDosha);
                }
            } else {
                get().logout();
            }
        } catch (err) {
            console.error("Failed to load profile:", err);
            get().logout();
        }
    },

    setName: (name) => {
        set((state) => ({
            user: { ...state.user, name },
            currentStep: 'dosha-animation'
        }));
        get().syncUserProfile();
    },

    setDoshaComposition: (composition, dominant) => {
        set((state) => ({
            user: { ...state.user, doshaComposition: composition, dominantDosha: dominant }
        }));
        get().syncUserProfile();
    },

    setCurrentStep: (step) => set({ currentStep: step }),

    setAssessmentAnswer: (questionId, value) => set((state) => ({
        assessmentAnswers: { ...state.assessmentAnswers, [questionId]: value }
    })),

    setMenstrualData: (startDate) => {
        set((state) => ({
            user: { ...state.user, menstrualCycleStart: startDate },
            currentStep: 'music'
        }));
        get().syncUserProfile();
    },

    setMusicPreferences: (preferences) => {
        set((state) => ({
            user: { ...state.user, musicPreferences: preferences },
            currentStep: 'companion'
        }));
        get().syncUserProfile();
    },

    resetAssessment: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('prakriti_quiz_progress');
            localStorage.removeItem('prakriti_quiz_answers');
        }
        set({
            assessmentAnswers: {},
            currentStep: 'assessment'
        });
    },

    changeEmail: async (newEmail, password) => {
        const { token } = get();
        if (!token) return { success: false, message: 'No authentication token found' };
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/change-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newEmail, password })
            });
            const data = await response.json();
            if (data.success) {
                set({ user: data.user });
                return { success: true };
            }
            return { success: false, message: data.message || data.error || 'Failed to change email' };
        } catch (err) {
            console.error("Change email failed:", err);
            return { success: false, message: 'Connection to server failed' };
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        const { token } = get();
        if (!token) return { success: false, message: 'No authentication token found' };
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (data.success) {
                // If backend serialized user is returned, set it
                if (data.user) set({ user: data.user });
                return { success: true };
            }
            return { success: false, message: data.message || data.error || 'Failed to change password' };
        } catch (err) {
            console.error("Change password failed:", err);
            return { success: false, message: 'Connection to server failed' };
        }
    },

    deleteAccount: async () => {
        const { token } = get();
        if (!token) return { success: false, message: 'No authentication token found' };
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                get().logout();
                return { success: true };
            }
            return { success: false, message: data.message || data.error || 'Failed to delete account' };
        } catch (err) {
            console.error("Delete account failed:", err);
            return { success: false, message: 'Connection to server failed' };
        }
    },
}));