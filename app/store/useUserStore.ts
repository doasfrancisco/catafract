import { create } from 'zustand';

interface UserData {
    id?: string;
    email?: string;
    name?: string;
    isPro?: boolean;
}

interface UserStore {
    userData: UserData | null;
    isLoading: boolean;
    setUserData: (data: UserData | null) => void;
    setLoading: (loading: boolean) => void;
    fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    userData: null,
    isLoading: true,
    setUserData: (data) => set({ userData: data }),
    setLoading: (loading) => set({ isLoading: loading }),
    fetchUserData: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/user/');
            const data = await response.json();
            set({ userData: data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            set({ isLoading: false });
        }
    },
}));