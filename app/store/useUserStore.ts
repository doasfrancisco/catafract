import { create } from 'zustand';

interface UserData {
    id?: string;
    email?: string;
    name?: string;
    isPro?: boolean;
}

interface UserStore {
    userData: UserData | null;
    isUserLoading: boolean;
    setUserData: (data: UserData | null) => void;
    setLoading: (loading: boolean) => void;
    fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    userData: null,
    isUserLoading: true,
    setUserData: (data) => set({ userData: data }),
    setLoading: (loading) => set({ isUserLoading: loading }),
    fetchUserData: async () => {
        set({ isUserLoading: true });
        try {
            const response = await fetch('/api/user/');
            const data = await response.json();
            set({ userData: data, isUserLoading: false });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            set({ isUserLoading: false });
        }
    },
}));