import { create } from 'zustand';

interface User {
    id?: string;
    name?: string;
    email?: string;
    isLoggedIn: boolean;
}

interface UserState {
    user: User;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: {
        isLoggedIn: false,
    },

    setUser: (user: User) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user));
    },

    logout: () => {
        set({ user: { isLoggedIn: false } });
        localStorage.removeItem('user');
    },
}));

if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        useUserStore.setState({ user: JSON.parse(savedUser) });
    }
}