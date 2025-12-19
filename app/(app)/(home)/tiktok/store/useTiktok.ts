import { create } from 'zustand';

interface TiktokData {
    id?: string;
    userId?: string;
    prompt?: string;
    [key: string]: any;
}

interface TiktokPrompt {
    promptData: TiktokData | null;
    promptText: string;
    isLoading: boolean;
    isSaving: boolean;
    setPromptData: (data: TiktokData | null) => void;
    setPromptText: (text: string) => void;
    setLoading: (loading: boolean) => void;
    setSaving: (saving: boolean) => void;
    fetchPromptData: (userId: string) => Promise<void>;
    savePromptData: () => Promise<boolean>;
}

export const useTiktok = create<TiktokPrompt>((set, get) => ({
    promptData: null,
    promptText: '',
    isLoading: true,
    isSaving: false,
    setPromptData: (data) => set({ promptData: data }),
    setPromptText: (text) => set({ promptText: text }),
    setLoading: (loading) => set({ isLoading: loading }),
    setSaving: (saving) => set({ isSaving: saving }),
    fetchPromptData: async (userId: string) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/tiktok/prompt?userId=${userId}`);
            const data = await response.json();
            set({ promptData: data, promptText: data?.prompt || '', isLoading: false });
        } catch (error) {
            console.error('Failed to fetch tiktok prompt:', error);
            set({ isLoading: false });
        }
    },
    savePromptData: async () => {
        const { promptData, promptText } = get();
        set({ isSaving: true });
        try {
            const response = await fetch('/api/tiktok/prompt', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...promptData, prompt: promptText }),
            });
            if (response.ok) {
                const updated = await response.json();
                set({ promptData: updated, isSaving: false });
                return true;
            }
            set({ isSaving: false });
            return false;
        } catch (error) {
            console.error('Failed to save tiktok prompt:', error);
            set({ isSaving: false });
            return false;
        }
    },
}));
